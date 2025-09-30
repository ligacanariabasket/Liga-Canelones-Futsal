import { PrismaClient, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const jsonExportsDir = path.join(process.cwd(), 'prisma', 'json-exports');

// Helper function to load and parse a JSON file
function loadJson<T>(filename: string): T {
  const filePath = path.join(jsonExportsDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`🟡 Advertencia: El archivo ${filename} no fue encontrado. Saltando...`);
    return [] as T;
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContent);

  // Prisma needs Date objects, but JSON stores them as strings.
  // We need to convert them back. This is a generic way to handle it.
  return JSON.parse(JSON.stringify(data), (key, value) => {
    // A simple regex to check for ISO date strings
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    if (typeof value === 'string' && isoDateRegex.test(value)) {
      return new Date(value);
    }
    return value;
  });
}

async function main() {
  console.log(`🔵 Iniciando el proceso de seeding desde los archivos generados...`);

  // 1. Limpieza de la base de datos en el orden correcto
  // Se eliminan los modelos que dependen de otros primero para evitar errores de FK.
  // No eliminamos Team y Player, ya que son la base.
  console.log(`🧹 Limpiando datos de temporadas anteriores...`);
  
  // Models with dependencies on Poll/PollOption
  await prisma.vote.deleteMany();
  console.log('-> ✅ Votos eliminados.');

  // Models with dependencies on Poll/Player
  await prisma.pollOption.deleteMany();
  console.log('-> ✅ Opciones de encuestas eliminadas.');

  // Models with dependencies on Match/Player
  await prisma.poll.deleteMany();
  console.log('-> ✅ Encuestas eliminadas.');

  // Models with dependencies on Match
  await prisma.matchChronicle.deleteMany();
  console.log('-> ✅ Crónicas eliminadas.');
  await prisma.gameEvent.deleteMany();
  console.log('-> ✅ Eventos de partido eliminados.');
  await prisma.playerMatchStats.deleteMany();
  console.log('-> ✅ Estadísticas de jugador por partido eliminadas.');
  
  // The Match itself
  await prisma.match.deleteMany();
  console.log('-> ✅ Partidos eliminados.');
  
  // Season data
  await prisma.seasonTeam.deleteMany();
  console.log('-> ✅ Equipos de temporada eliminados.');
  await prisma.season.deleteMany();
  console.log('-> ✅ Temporadas eliminadas.');

  // Other data like Posts
  await prisma.post.deleteMany();
  console.log('-> ✅ Posts eliminados.');

  console.log('-> ✅ Limpieza completada.');

  // 2. Cargar todos los datos desde los archivos JSON generados
  // -----------------------------------------------------------
  console.log('📂 Leyendo archivos JSON desde prisma/json-exports...');
  const seasons = loadJson<Prisma.SeasonCreateManyInput[]>('season.json');
  const seasonTeams = loadJson<Prisma.SeasonTeamCreateManyInput[]>('seasonTeam.json');
  const matches = loadJson<Prisma.MatchCreateManyInput[]>('match.json');
  const gameEvents = loadJson<Prisma.GameEventCreateManyInput[]>('gameEvent.json');
  const playerMatchStats = loadJson<Prisma.PlayerMatchStatsCreateManyInput[]>('playerMatchStats.json');
  const matchChronicles = loadJson<Prisma.MatchChronicleCreateManyInput[]>('matchChronicle.json');
  const polls = loadJson<Prisma.PollCreateManyInput[]>('poll.json');
  const pollOptions = loadJson<Prisma.PollOptionCreateManyInput[]>('pollOption.json');
  const votes = loadJson<Prisma.VoteCreateManyInput[]>('vote.json');
  const posts = loadJson<Prisma.PostCreateManyInput[]>('post.json');
  
  // 3. Inserción de los datos en el orden correcto
  // ---------------------------------------------
  console.log(`🌱 Sembrando los nuevos datos...`);

  if (seasons.length > 0) {
    await prisma.season.createMany({ data: seasons, skipDuplicates: true });
    console.log(`-> ✅ ${seasons.length} temporadas creadas.`);
  }
  if (seasonTeams.length > 0) {
    await prisma.seasonTeam.createMany({ data: seasonTeams, skipDuplicates: true });
    console.log(`-> ✅ ${seasonTeams.length} registros de SeasonTeam creados.`);
  }
  if (matches.length > 0) {
    await prisma.match.createMany({ data: matches, skipDuplicates: true });
    console.log(`-> ✅ ${matches.length} partidos creados.`);
  }
  if (playerMatchStats.length > 0) {
    await prisma.playerMatchStats.createMany({ data: playerMatchStats, skipDuplicates: true });
    console.log(`-> ✅ ${playerMatchStats.length} registros de PlayerMatchStats creados.`);
  }
  if (gameEvents.length > 0) {
    await prisma.gameEvent.createMany({ data: gameEvents, skipDuplicates: true });
    console.log(`-> ✅ ${gameEvents.length} eventos de partido creados.`);
  }
  if (matchChronicles.length > 0) {
    await prisma.matchChronicle.createMany({ data: matchChronicles, skipDuplicates: true });
    console.log(`-> ✅ ${matchChronicles.length} crónicas creadas.`);
  }
  if (polls.length > 0) {
    await prisma.poll.createMany({ data: polls, skipDuplicates: true });
    console.log(`-> ✅ ${polls.length} encuestas creadas.`);
  }
  if (pollOptions.length > 0) {
    await prisma.pollOption.createMany({ data: pollOptions, skipDuplicates: true });
    console.log(`-> ✅ ${pollOptions.length} opciones de encuesta creadas.`);
  }
  if (votes.length > 0) {
    await prisma.vote.createMany({ data: votes, skipDuplicates: true });
    console.log(`-> ✅ ${votes.length} votos creados.`);
  }
  if (posts.length > 0) {
    await prisma.post.createMany({ data: posts, skipDuplicates: true });
    console.log(`-> ✅ ${posts.length} posts creados.`);
  }

  console.log(`🟢 Seeding finalizado exitosamente.`);
}

main()
  .catch((e) => {
    console.error('🔴 Error durante el proceso de seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });