
'use server';

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

/**
 * Carga y parsea un archivo JSON desde el directorio de respaldo.
 * @param filename El nombre del archivo JSON a cargar.
 * @returns Los datos parseados del archivo.
 */
function loadJsonFromBackup<T>(filename: string): T {
  const filePath = path.join(process.cwd(), 'prisma', 'respaldo', filename);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: El archivo de respaldo ${filename} no fue encontrado.`);
    process.exit(1);
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  // Convierte las fechas de string a objetos Date, Prisma lo necesita.
  return JSON.parse(fileContent, (key, value) => {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    if (typeof value === 'string' && isoDateRegex.test(value)) {
      return new Date(value);
    }
    return value;
  });
}

async function main() {
  console.log(`🔵 Iniciando el proceso de seeding para equipos y jugadores...`);

  try {
    // 1. Limpieza de la base de datos en el orden correcto
    console.log(`🧹 Limpiando datos existentes...`);
    // Primero se eliminan los jugadores por la clave foránea a Team.
    await prisma.player.deleteMany();
    console.log('-> ✅ Jugadores eliminados.');
    await prisma.team.deleteMany();
    console.log('-> ✅ Equipos eliminados.');
    
    // 2. Cargar datos desde los archivos JSON de respaldo.
    console.log('📂 Leyendo archivos JSON desde prisma/respaldo...');
    const teams = loadJsonFromBackup<any[]>('team.json');
    const players = loadJsonFromBackup<any[]>('player.json');

    // 3. Inserción de los datos.
    console.log(`🌱 Sembrando los nuevos datos...`);

    if (teams.length > 0) {
      await prisma.team.createMany({
        data: teams,
        skipDuplicates: true,
      });
      console.log(`-> ✅ ${teams.length} equipos creados.`);
    }

    if (players.length > 0) {
      await prisma.player.createMany({
        data: players,
        skipDuplicates: true,
      });
      console.log(`-> ✅ ${players.length} jugadores creados.`);
    }

    console.log(`🟢 Seeding de equipos y jugadores finalizado exitosamente.`);

  } catch (e) {
    console.error('🔴 Error durante el proceso de seeding:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexión a la base de datos cerrada.');
  }
}

main();
