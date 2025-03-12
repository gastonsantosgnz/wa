import fs from 'fs';
import path from 'path';

/**
 * Interface for Knowledge Base file structure
 */
export interface KnowledgeFile {
  title: string;
  patterns: string[];
  responses: {
    title: string;
    content: string;
  }[];
  variables: {
    name: string;
    description: string;
  }[];
  aiData: string[];
  conversationFlow: string[];
}

/**
 * Reads and parses a knowledge base file
 * 
 * @param filePath Path to the knowledge base file
 * @returns Parsed knowledge file structure
 */
export function parseKnowledgeFile(filePath: string): KnowledgeFile | null {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Initialize the knowledge file structure
    const knowledgeFile: KnowledgeFile = {
      title: '',
      patterns: [],
      responses: [],
      variables: [],
      aiData: [],
      conversationFlow: []
    };
    
    // Extract the title
    const titleMatch = content.match(/# (.*)/);
    if (titleMatch) {
      knowledgeFile.title = titleMatch[1].trim();
    }
    
    // Extract patterns
    const patternsSection = content.match(/## Patrones de Detección\s+([\s\S]*?)(?=## |$)/);
    if (patternsSection) {
      knowledgeFile.patterns = patternsSection[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').replace(/"/g, '').trim())
        .filter(pattern => pattern.length > 0);
    }
    
    // Extract responses
    const responsesSection = content.match(/## Respuestas Predeterminadas\s+([\s\S]*?)(?=## |$)/);
    if (responsesSection) {
      const responsesContent = responsesSection[1];
      
      // Find all response titles
      const responseTitles = responsesContent.match(/### (.*?):/g) || [];
      
      for (let i = 0; i < responseTitles.length; i++) {
        const currentTitle = responseTitles[i];
        const nextTitle = responseTitles[i + 1] || '## ';
        
        // Find the start index of current title
        const startIndex = responsesContent.indexOf(currentTitle);
        
        // Find the start index of next title or section
        const endIndex = responsesContent.indexOf(nextTitle, startIndex + currentTitle.length);
        
        // Extract content between current and next title
        const responseContent = endIndex > startIndex 
          ? responsesContent.substring(startIndex + currentTitle.length, endIndex) 
          : responsesContent.substring(startIndex + currentTitle.length);
        
        // Extract the response text between code blocks
        const responseTextMatch = responseContent.match(/```([\s\S]*?)```/);
        
        if (responseTextMatch) {
          knowledgeFile.responses.push({
            title: currentTitle.replace(/### |\:/g, '').trim(),
            content: responseTextMatch[1].trim()
          });
        }
      }
    }
    
    // Extract variables
    const variablesSection = content.match(/## Variables Dinámicas\s+([\s\S]*?)(?=## |$)/);
    if (variablesSection) {
      const variablesContent = variablesSection[1];
      
      // Match all variable definitions
      const variableMatches = variablesContent.match(/- `\{([^}]+)\}`\s*:\s*(.*)/g) || [];
      
      for (const varMatch of variableMatches) {
        const match = varMatch.match(/- `\{([^}]+)\}`\s*:\s*(.*)/);
        if (match && match.length >= 3) {
          knowledgeFile.variables.push({
            name: match[1].trim(),
            description: match[2].trim()
          });
        }
      }
    }
    
    // Extract AI data
    const aiDataSection = content.match(/## Datos para IA\s+([\s\S]*?)(?=## |$)/);
    if (aiDataSection) {
      knowledgeFile.aiData = aiDataSection[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(data => data.length > 0);
    }
    
    // Extract conversation flow
    const flowSection = content.match(/## Flujo de Conversación\s+([\s\S]*?)(?=## |$)/);
    if (flowSection) {
      knowledgeFile.conversationFlow = flowSection[1]
        .split('\n')
        .filter(line => /^\d+\./.test(line.trim()))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(flow => flow.length > 0);
    }
    
    return knowledgeFile;
  } catch (error) {
    console.error(`Error parsing knowledge file ${filePath}:`, error);
    return null;
  }
}

/**
 * Gets the appropriate knowledge base file for a given intent and query
 * 
 * @param intent The classified intent
 * @param query The user's original query
 * @returns Path to the most relevant knowledge file
 */
export async function findKnowledgeFile(intent: string, query: string): Promise<string | null> {
  try {
    // Map intent to directory
    const intentMap: Record<string, string> = {
      'cursos': 'cursos',
      'examen_admision': 'admision_uabc',
      'proceso_admision': 'admision_uabc',
      'carreras_uabc': 'admision_uabc',
      'garantias': 'garantias',
      'pagos': 'pagos',
      'soporte_tecnico': 'soporte_tecnico',
      'certificados': 'soporte_tecnico',
      'testimonios': 'testimonios',
      'contacto': 'contacto',
      'ubicaciones': 'contacto',
      'academico': 'academico',
      'info_negocio': 'contacto'
    };
    
    // Get the directory for this intent
    const directory = intentMap[intent] || 'cursos';
    
    // Construct the path to the knowledge base directory
    const knowledgeDir = path.join(__dirname, '..', 'knowledge_base', directory);
    
    // Check if directory exists
    if (!fs.existsSync(knowledgeDir)) {
      console.warn(`Knowledge directory not found: ${knowledgeDir}`);
      return null;
    }
    
    // Get all markdown files in the directory
    const files = fs.readdirSync(knowledgeDir).filter(file => file.endsWith('.md'));
    
    if (files.length === 0) {
      console.warn(`No markdown files found in: ${knowledgeDir}`);
      return null;
    }
    
    // If only one file, return it
    if (files.length === 1) {
      return path.join(knowledgeDir, files[0]);
    }
    
    // Find the most relevant file based on query and patterns
    let bestMatchFile = null;
    let bestMatchScore = 0;
    
    // Normalize query for comparison
    const normalizedQuery = query.toLowerCase();
    
    for (const file of files) {
      const filePath = path.join(knowledgeDir, file);
      const knowledge = parseKnowledgeFile(filePath);
      
      if (knowledge) {
        // Count pattern matches
        let matchScore = 0;
        
        for (const pattern of knowledge.patterns) {
          // Remove quotes if present
          const cleanPattern = pattern.replace(/^"(.+)"$/, '$1').toLowerCase();
          
          // Check if pattern is in query
          if (normalizedQuery.includes(cleanPattern)) {
            // Longer patterns get higher score
            matchScore += cleanPattern.length;
          }
        }
        
        // Update best match if better score found
        if (matchScore > bestMatchScore) {
          bestMatchScore = matchScore;
          bestMatchFile = filePath;
        }
      }
    }
    
    // Return the best match or first file as fallback
    return bestMatchFile || path.join(knowledgeDir, files[0]);
  } catch (error) {
    console.error('Error finding knowledge file:', error);
    return null;
  }
}

/**
 * Selects the appropriate response from a knowledge file based on user query
 * 
 * @param knowledgeFile Parsed knowledge file
 * @param query User's query
 * @returns The most appropriate response
 */
export function selectResponse(knowledgeFile: KnowledgeFile, query: string): string | null {
  try {
    if (!knowledgeFile.responses || knowledgeFile.responses.length === 0) {
      return null;
    }
    
    // If only one response, return it
    if (knowledgeFile.responses.length === 1) {
      return knowledgeFile.responses[0].content;
    }
    
    // Normalize query
    const normalizedQuery = query.toLowerCase();
    
    // Look for specific keywords that match conversation flow
    for (const flowRule of knowledgeFile.conversationFlow) {
      // Extract response number from flow rule
      const responseNumberMatch = flowRule.match(/Respuesta (\d+)/i);
      if (!responseNumberMatch) continue;
      
      const responseNumber = parseInt(responseNumberMatch[1]);
      
      // Check if the condition in the flow rule applies
      if (flowRule.includes('información general') && 
          (normalizedQuery.includes('información') || normalizedQuery.includes('general'))) {
        return knowledgeFile.responses[responseNumber - 1]?.content || null;
      }
      
      if (flowRule.includes('requisitos') && normalizedQuery.includes('requisito')) {
        return knowledgeFile.responses[responseNumber - 1]?.content || null;
      }
      
      if (flowRule.includes('proceso') && normalizedQuery.includes('proceso')) {
        return knowledgeFile.responses[responseNumber - 1]?.content || null;
      }
      
      if (flowRule.includes('precio') || flowRule.includes('costo') || flowRule.includes('pago')) {
        if (normalizedQuery.includes('precio') || normalizedQuery.includes('costo') || normalizedQuery.includes('pago')) {
          return knowledgeFile.responses[responseNumber - 1]?.content || null;
        }
      }
    }
    
    // Default to first response if no specific match
    return knowledgeFile.responses[0].content;
  } catch (error) {
    console.error('Error selecting response:', error);
    return null;
  }
}

/**
 * Formats a response by replacing dynamic variables
 * 
 * @param response The response text
 * @param customer Customer data for personalization
 * @returns Formatted response
 */
export function formatResponse(response: string, customer: any): string {
  try {
    if (!response) return '';
    
    // Replace common variables
    let formattedResponse = response
      .replace(/\{NOMBRE_CLIENTE\}/g, customer.name || 'Estudiante')
      .replace(/\{CURSO_ACTUAL\}/g, customer.examType || 'Curso UABC')
      .replace(/\{GRUPO\}/g, customer.group || 'grupo asignado')
      .replace(/\{CIUDAD\}/g, customer.city || 'tu ciudad');
    
    // Add more variables as needed
    
    return formattedResponse;
  } catch (error) {
    console.error('Error formatting response:', error);
    return response; // Return original response if error
  }
} 