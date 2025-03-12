import { API_URL } from '@/lib/config';

/**
 * Obtiene todas las carpetas de knowledge_base
 */
export const getFolders = async () => {
  try {
    const response = await fetch(`${API_URL}/api/knowledge/folders`);
    if (!response.ok) {
      throw new Error('Error al obtener carpetas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getFolders:', error);
    throw error;
  }
};

/**
 * Obtiene todos los archivos de una carpeta específica
 */
export const getFiles = async (folder: string) => {
  try {
    const response = await fetch(`${API_URL}/api/knowledge/folders/${folder}/files`);
    if (!response.ok) {
      throw new Error('Error al obtener archivos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getFiles:', error);
    throw error;
  }
};

/**
 * Obtiene el contenido de un archivo específico
 */
export const getFileContent = async (folder: string, file: string) => {
  try {
    const response = await fetch(`${API_URL}/api/knowledge/folders/${folder}/files/${file}`);
    if (!response.ok) {
      throw new Error('Error al obtener contenido del archivo');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getFileContent:', error);
    throw error;
  }
};

/**
 * Actualiza el contenido de un archivo específico
 */
export const updateFileContent = async (folder: string, file: string, content: string) => {
  try {
    const response = await fetch(`${API_URL}/api/knowledge/folders/${folder}/files/${file}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar archivo');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updateFileContent:', error);
    throw error;
  }
};

/**
 * Crea una nueva carpeta
 */
export const createFolder = async (folderName: string) => {
  try {
    const response = await fetch(`${API_URL}/api/knowledge/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folderName }),
    });
    if (!response.ok) {
      throw new Error('Error al crear carpeta');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createFolder:', error);
    throw error;
  }
};

/**
 * Crea un nuevo archivo en una carpeta específica
 */
export const createFile = async (folder: string, fileName: string, content: string = '') => {
  try {
    const response = await fetch(`${API_URL}/api/knowledge/folders/${folder}/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, content }),
    });
    if (!response.ok) {
      throw new Error('Error al crear archivo');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createFile:', error);
    throw error;
  }
}; 