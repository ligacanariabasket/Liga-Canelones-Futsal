
import * as fs from 'fs';
import * as path from 'path';

/**
 * Lee la estructura del directorio 'public' desde un archivo JSON y la convierte
 * en una lista plana de rutas de archivo.
 * 
 * @param jsonPath La ruta al archivo public.json.
 * @returns Una lista de strings, donde cada string es una ruta de archivo válida.
 */
function generateFileStructureFromJSON(jsonPath: string): string[] {
  try {
    const jsonString = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(jsonString) as Record<string, unknown>;

    // Función recursiva para procesar el objeto JSON anidado
    const flattenStructure = (node: Record<string, unknown>, currentPath: string): string[] => {
      let paths: string[] = [];

      for (const key in node) {
        const newPath = path.join(currentPath, key).replace(/\\/g, '/');
        // Si el valor es null, es un archivo.
        if (node[key] === null) {
          paths.push(`/${newPath}`);
        } 
        // Si el valor es un objeto, es un directorio.
        else if (typeof node[key] === 'object' && node[key] !== null) {
          paths = paths.concat(flattenStructure(node[key] as Record<string, unknown>, newPath));
        }
      }
      return paths;
    };

    // Inicia el proceso desde la raíz del objeto.
    return flattenStructure(data, '');

  } catch (error) {
    console.error("Error al generar la estructura de archivos desde JSON:", error);
    // Devuelve un array vacío en caso de error.
    return [];
  }
}

// Define la ruta al archivo JSON generado.
const jsonFilePath = path.resolve(process.cwd(), 'src', 'data', 'public.json');

// Genera la estructura y la exporta para ser usada en la aplicación.
export const imageFileStructure = generateFileStructureFromJSON(jsonFilePath);
