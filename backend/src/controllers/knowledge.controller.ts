import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Ruta base a la carpeta de la base de conocimiento
const knowledgeBasePath = path.join(__dirname, '..', 'knowledge_base');

/**
 * Obtiene la lista de carpetas en knowledge_base
 */
export const getFolders = (req: Request, res: Response) => {
  try {
    // Leer las carpetas en knowledge_base
    const folders = fs.readdirSync(knowledgeBasePath)
      .filter(item => fs.statSync(path.join(knowledgeBasePath, item)).isDirectory());
    
    res.status(200).json({ folders });
  } catch (error) {
    console.error('Error al obtener carpetas:', error);
    res.status(500).json({ error: 'Error al obtener carpetas de knowledge_base' });
  }
};

/**
 * Obtiene la lista de archivos en una carpeta específica
 */
export const getFiles = (req: Request, res: Response) => {
  try {
    const { folder } = req.params;
    const folderPath = path.join(knowledgeBasePath, folder);
    
    // Verificar que la carpeta existe
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
      return res.status(404).json({ error: 'Carpeta no encontrada' });
    }
    
    // Leer los archivos en la carpeta
    const files = fs.readdirSync(folderPath)
      .filter(item => {
        const itemPath = path.join(folderPath, item);
        return fs.statSync(itemPath).isFile() && path.extname(item) === '.md';
      });
    
    res.status(200).json({ files });
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    res.status(500).json({ error: 'Error al obtener archivos de la carpeta' });
  }
};

/**
 * Obtiene el contenido de un archivo específico
 */
export const getFileContent = (req: Request, res: Response) => {
  try {
    const { folder, file } = req.params;
    const filePath = path.join(knowledgeBasePath, folder, file);
    
    // Verificar que el archivo existe
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    // Leer el contenido del archivo
    const content = fs.readFileSync(filePath, 'utf8');
    
    res.status(200).json({ content });
  } catch (error) {
    console.error('Error al obtener contenido del archivo:', error);
    res.status(500).json({ error: 'Error al obtener contenido del archivo' });
  }
};

/**
 * Actualiza el contenido de un archivo específico
 */
export const updateFileContent = (req: Request, res: Response) => {
  try {
    const { folder, file } = req.params;
    const { content } = req.body;
    
    // Validar que se proporcionó contenido
    if (!content) {
      return res.status(400).json({ error: 'No se proporcionó contenido para actualizar' });
    }
    
    const filePath = path.join(knowledgeBasePath, folder, file);
    
    // Verificar que el archivo existe
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    // Escribir el nuevo contenido en el archivo
    fs.writeFileSync(filePath, content, 'utf8');
    
    res.status(200).json({ message: 'Archivo actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar archivo:', error);
    res.status(500).json({ error: 'Error al actualizar el archivo' });
  }
};

/**
 * Crea una nueva carpeta en knowledge_base
 */
export const createFolder = (req: Request, res: Response) => {
  try {
    const { folderName } = req.body;
    
    // Validar que se proporcionó un nombre de carpeta
    if (!folderName) {
      return res.status(400).json({ error: 'No se proporcionó un nombre de carpeta' });
    }
    
    // Validar que el nombre de carpeta no contenga caracteres inválidos
    if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
      return res.status(400).json({ error: 'El nombre de carpeta contiene caracteres inválidos. Use solo letras, números, guiones y guiones bajos.' });
    }
    
    const folderPath = path.join(knowledgeBasePath, folderName);
    
    // Verificar si la carpeta ya existe
    if (fs.existsSync(folderPath)) {
      return res.status(400).json({ error: 'Ya existe una carpeta con ese nombre' });
    }
    
    // Crear la carpeta
    fs.mkdirSync(folderPath);
    
    res.status(201).json({ message: 'Carpeta creada correctamente', folderName });
  } catch (error) {
    console.error('Error al crear carpeta:', error);
    res.status(500).json({ error: 'Error al crear la carpeta' });
  }
};

/**
 * Crea un nuevo archivo en una carpeta específica
 */
export const createFile = (req: Request, res: Response) => {
  try {
    const { folder } = req.params;
    const { fileName, content = '' } = req.body;
    
    // Validar que se proporcionó un nombre de archivo
    if (!fileName) {
      return res.status(400).json({ error: 'No se proporcionó un nombre de archivo' });
    }
    
    // Validar que el nombre de archivo tenga extensión .md
    if (!fileName.endsWith('.md')) {
      return res.status(400).json({ error: 'El archivo debe tener extensión .md' });
    }
    
    // Validar que el nombre de archivo no contenga caracteres inválidos
    const baseFileName = path.basename(fileName, '.md');
    if (!/^[a-zA-Z0-9_-]+$/.test(baseFileName)) {
      return res.status(400).json({ error: 'El nombre de archivo contiene caracteres inválidos. Use solo letras, números, guiones y guiones bajos.' });
    }
    
    const folderPath = path.join(knowledgeBasePath, folder);
    
    // Verificar que la carpeta existe
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
      return res.status(404).json({ error: 'Carpeta no encontrada' });
    }
    
    const filePath = path.join(folderPath, fileName);
    
    // Verificar si el archivo ya existe
    if (fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'Ya existe un archivo con ese nombre' });
    }
    
    // Crear el archivo
    fs.writeFileSync(filePath, content, 'utf8');
    
    res.status(201).json({ message: 'Archivo creado correctamente', fileName });
  } catch (error) {
    console.error('Error al crear archivo:', error);
    res.status(500).json({ error: 'Error al crear el archivo' });
  }
}; 