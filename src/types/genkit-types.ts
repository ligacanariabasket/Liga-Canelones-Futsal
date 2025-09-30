import { z } from 'zod';

// --- Shared Schemas and Types for Genkit Actions ---

const TeamInputSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const CreateSeasonAndTeamsInputSchema = z.object({
  seasonId: z.number(),
  teams: z.array(TeamInputSchema),
});
export type CreateSeasonAndTeamsInput = z.infer<
  typeof CreateSeasonAndTeamsInputSchema
>;

export const GenerateFixtureForSeasonInputSchema = z.object({
  seasonId: z.number(),
  teams: z.array(TeamInputSchema),
});
export type GenerateFixtureForSeasonInput = z.infer<
  typeof GenerateFixtureForSeasonInputSchema
>;

// --- Match Chronicle Schemas ---

const GameEventSchema = z.object({
  type: z.string(),
  playerName: z.string().nullable(),
  teamName: z.string().nullable(),
  timeDescription: z.string().describe("Descripción del momento del evento, ej: 'Minuto 15 del 2do tiempo'."),
});

export const GenerateMatchChronicleInputSchema = z.object({
  matchId: z.number(),
  teamA: z.object({
    id: z.number(),
    name: z.string(),
  }),
  teamB: z.object({
    id: z.number(),
    name: z.string(),
  }),
  scoreA: z.number(),
  scoreB: z.number(),
  events: z.array(GameEventSchema).describe("Lista de todos los eventos del partido. Deben estar ordenados cronológicamente."),
  imageStructure: z.any().describe("Estructura de archivos de imágenes disponibles para usar en el contenido."),
});
export type GenerateMatchChronicleInput = z.infer<typeof GenerateMatchChronicleInputSchema>;

export const GenerateMatchChronicleOutputSchema = z.object({
    title: z.string().describe("Un titular simple y directo. Ej: 'Equipo A vence a Equipo B'"),
    chronicleBody: z.string().describe("El cuerpo principal de la crónica, narrando el partido de forma periodística."),
    matchStatsSummary: z.string().describe("Un bloque de texto en formato Markdown que incluye una lista de 2 a 4 puntos con datos estadísticos, seguido por el banner y logo de la liga.")
});
export type GenerateMatchChronicleOutput = z.infer<typeof GenerateMatchChronicleOutputSchema>;


// --- Blog Post Schemas ---
export const GenerateBlogPostInputSchema = z.object({
  topic: z
    .string()
    .describe("El tema o título inicial para la publicación del blog."),
  category: z
    .string()
    .describe("La categoría seleccionada para la publicación del blog."),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

export const GenerateBlogPostOutputSchema = z.object({
  title: z
    .string()
    .describe(
      "Un título atractivo y optimizado para SEO para la publicación del blog."
    ),
  excerpt: z
    .string()
    .describe(
      "Un extracto o resumen corto (2-3 frases) del contenido del artículo."
    ),
  content: z
    .string()
    .describe(
      "El contenido completo del artículo, formateado en Markdown. Debe ser informativo, atractivo y visualmente moderno."
    ),
  imageUrl: z
    .string()
    .url()
    .describe(
      "Una URL a una imagen de alta calidad de picsum.photos que sea relevante para el tema. Debe ser de 1200x600px."
    ),
});
export type GenerateBlogPostOutput = z.infer<
  typeof GenerateBlogPostOutputSchema
>;
