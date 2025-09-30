"use server";

// This is a mock service to simulate extracting content from a news article URL.
// In a real application, this would use a library like Cheerio or a dedicated service
// to fetch and parse the article content from the given URL.

export async function extractNewsArticle(url: string): Promise<string> {
  console.log(`Mock extracting content from: ${url}`);

  // To make the simulation more realistic, we can check for a specific test URL.
  if (url.includes("test-article")) {
    return `
        LIGA CANELONES FUTSAL - GRAN VICTORIA EN EL CLÁSICO.
        En un emocionante encuentro disputado el pasado sábado, el equipo de "Los Titanes" se llevó la victoria frente a su eterno rival, "Los Gladiadores", con un marcador final de 5 a 2.
        El partido, que se jugó a estadio lleno, estuvo cargado de tensión y buen juego desde el primer minuto.
        Juan "El Mago" Pérez fue la figura del encuentro, anotando un hat-trick y dando una asistencia. "Fue un partido increíble, el equipo lo dio todo y la afición nos apoyó sin parar. Esta victoria es para ellos", declaró Pérez al finalizar el encuentro.
        Con este resultado, "Los Titanes" se consolidan en la primera posición de la tabla, mientras que "Los Gladiadores" deberán trabajar duro para recuperar terreno en las próximas fechas. La liga está más emocionante que nunca.
        `;
  }

  return `
        Este es el contenido simulado de un artículo de noticias para la URL: ${url}. 
        El artículo describe un evento deportivo reciente con muchos detalles importantes. 
        El equipo local ganó un partido crucial. El jugador estrella marcó varios goles. 
        El entrenador está muy contento con el rendimiento del equipo y mira con optimismo hacia el resto de la temporada. 
        La afición celebró la victoria con gran entusiasmo. Este resumen es una simulación del contenido que el modelo de IA procesaría.
    `;
}
