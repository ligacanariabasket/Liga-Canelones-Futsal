"use server";
/**
 * @fileOverview Flow para generar una publicación de blog completa con IA.
 *
 * - generateBlogPost - Genera título, extracto, contenido y URL de imagen.
 */

import { futsalTeams } from "@/data/teams";
import { players } from "@/data/players";
import { matchStatuses } from "@/data/matchData";
import { newsCategories } from "@/data/news-categories";
import { ai } from "@/ai/genkit";
import { googleAI } from "@genkit-ai/googleai";
import type { GenerateBlogPostInput, GenerateBlogPostOutput } from "@/types/genkit-types";
import { GenerateBlogPostInputSchema, GenerateBlogPostOutputSchema } from "@/types/genkit-types";


export async function generateBlogPost(
  input: GenerateBlogPostInput
): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const teamsContext = futsalTeams.map((team) => ({
  id: team.id,
  name: team.name,
  slug: team.slug,
  description: team.description,
  players: team.players.map((p) => ({
    id: p.id,
    name: p.name,
    number: p.number,
    position: p.position,
  })),
}));

const playersContext = players.map((player) => ({
  id: player.id,
  name: player.name,
  number: player.number,
  position: player.position,
  teamId: player.teamId,
}));

const categoriesContext = newsCategories.map((c) => ({
  slug: c.slug,
  name: c.name,
  description: c.description,
}));

const blogPostPrompt = ai.definePrompt({
  name: "generateBlogPostPrompt",
  input: { schema: GenerateBlogPostInputSchema },
  output: { schema: GenerateBlogPostOutputSchema },
  prompt: `
        Eres un periodista deportivo y diseñador de contenido experto en futsal, especializado en la Liga Canaria de Futsal de Uruguay.
        Tu tarea es escribir una publicación de blog atractiva, informativa y con un diseño moderno usando Markdown, basándote en los datos reales de la liga que te proporciono.

        Tema: {{{topic}}}
        Categoría: {{{category}}}

        ## Contexto de la Liga (Datos Reales):

        ### Equipos:
        ${JSON.stringify(teamsContext, null, 2)}

        ### Jugadores:
        ${JSON.stringify(playersContext, null, 2)}
        
        ### Estados de Partido Posibles:
        ${JSON.stringify(matchStatuses, null, 2)}

        ### Categorías de Noticias:
        ${JSON.stringify(categoriesContext, null, 2)}

        ## Instrucciones:
        1.  **Título:** Crea un título que sea pegadizo, relevante para el tema y la categoría, y optimizado para SEO.
        2.  **Extracto:** Escribe un resumen corto (2-3 frases) que enganche al lector.
        3.  **Contenido:** Desarrolla el tema en un artículo completo y bien estructurado, **teniendo en cuenta la categoría seleccionada**.
            *   **Usa los Datos:** Integra los nombres de equipos y jugadores del contexto proporcionado para que el artículo sea auténtico y específico de la liga.
            *   **Estructura Moderna:** Utiliza subtítulos (##), listas con viñetas (*), y citas destacadas (>) para romper el texto y hacerlo más legible y dinámico.
            *   **Tono:** Apasionado, conocedor y profesional.
            *   **Imagen en el Cuerpo:** A mitad del artículo, inserta una imagen relevante para el contenido. Usa el formato de Markdown: ![Descripción de la imagen](URL_de_la_imagen). Debes generar una URL de imagen de https://picsum.photos con un tamaño de 800x400 para esta imagen interna.
        4.  **URL de Imagen de Cabecera:** Genera una URL de una imagen de https://picsum.photos con un tamaño de 1200x600 para la imagen principal del artículo. Esta debe ser diferente a la imagen del cuerpo.
    `,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: "generateBlogPostFlow",
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    const { output } = await blogPostPrompt(input);
    if (!output) {
      throw new Error("La IA no pudo generar la publicación del blog.");
    }
    return output;
  }
);
