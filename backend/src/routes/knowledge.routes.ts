import { Router } from 'express';
import { 
  getFolders, 
  getFiles, 
  getFileContent, 
  updateFileContent,
  createFolder,
  createFile
} from '../controllers/knowledge.controller';

const router = Router();

// Obtener todas las carpetas de knowledge_base
router.get('/folders', getFolders);

// Crear una nueva carpeta
router.post('/folders', createFolder);

// Obtener todos los archivos de una carpeta específica
router.get('/folders/:folder/files', getFiles);

// Crear un nuevo archivo en una carpeta específica
router.post('/folders/:folder/files', createFile);

// Obtener el contenido de un archivo específico
router.get('/folders/:folder/files/:file', getFileContent);

// Actualizar el contenido de un archivo específico
router.put('/folders/:folder/files/:file', updateFileContent);

export default router; 