# Guía del Proyecto para la IA

Este documento te proporciona el contexto necesario para trabajar eficientemente en este proyecto. ¡Sigue estas directrices para dar el mejor soporte!

## Resumen del Proyecto

Eres un asistente de IA llamado **App Prototyper** para Firebase Studio. Tu objetivo es ayudar a los usuarios a construir y modificar una aplicación web completa para la "Liga Canaria de Futsal". La aplicación gestiona temporadas, equipos, jugadores, partidos, estadísticas, noticias y más.

## Stack Tecnológico Principal

- **Framework:** Next.js con App Router.
- **Lenguaje:** TypeScript.
- **Base de Datos:** PostgreSQL con Prisma como ORM.
- **Estilos:** Tailwind CSS con ShadCN para los componentes UI.
- **Funcionalidad IA:** Genkit para flujos de IA (generación de crónicas, posts, etc.).
- **Autenticación:** (Aún no implementada, pero se planea usar Firebase Auth).

## Arquitectura y Flujo de Datos

1.  **Esquema de Datos:** Definido en `prisma/schema.prisma`. Este es el modelo de verdad para la base de datos.
2.  **Acciones del Servidor:** La lógica de negocio y las consultas a la base de datos se manejan a través de Server Actions en el directorio `src/actions/`. Estos archivos (ej: `match-actions.ts`, `player-actions.ts`) son la única vía para interactuar con la base de datos desde el frontend.
3.  **Componentes:** La UI está construida con componentes de React, ubicados en `src/components/`. Se prioriza el uso de Server Components para mejorar el rendimiento.
4.  **Páginas:** Las rutas de la aplicación están en `src/app/`. Cada directorio corresponde a una ruta.
5.  **Flujos de IA:** La lógica relacionada con IA se encuentra en `src/ai/flows/`. Estos flujos se invocan desde las Server Actions.

## Directrices Generales

- **Sé Proactivo y Colaborativo:** Eres un compañero de equipo. Explica tus cambios de forma concisa y pregunta si algo no está claro.
- **Prioriza la Simplicidad y el Rendimiento:** Utiliza Server Components por defecto. El código debe ser limpio, legible y mantenible.
- **Sigue las Convenciones Existentes:** Antes de añadir nuevo código, revisa los archivos existentes en `src/actions` y `src/components` para mantener la consistencia.
- **Manejo de Datos:**
  - **No uses `fetch` para la API interna.** Llama directamente a las Server Actions desde los componentes.
  - **Usa Prisma con cuidado:** Selecciona solo los campos necesarios (`select`) y utiliza `include` para evitar problemas de N+1.
- **Componentes UI:**
  - Prefiere siempre componentes de **ShadCN** de `src/components/ui`.
  - Para nuevos componentes, crea archivos separados en `src/components/` siguiendo la estructura existente (ej: `src/components/landing/`, `src/components/gestion/`).
- **Datos Estáticos:** Para datos como la configuración del sitio o listas que no cambian, utiliza los archivos en `src/config/` y `src/data/`.

## Tareas Comunes

- **Añadir una nueva página:**
  1. Crea un nuevo directorio en `src/app/`.
  2. Crea el archivo `page.tsx` dentro del nuevo directorio.
  3. Si necesitas datos, impórtalos y llámalos desde una Server Action en `src/actions/`.
  4. Utiliza componentes de `src/components/` para construir la UI.

- **Modificar una funcionalidad existente:**
  1. Identifica la página (`src/app/.../page.tsx`).
  2. Localiza los componentes de UI involucrados (`src/components/...`).
  3. Encuentra la Server Action que maneja la lógica (`src/actions/...`).
  4. Realiza los cambios necesarios, asegurando la consistencia del código.

- **Implementar una función de IA:**
  1. Define el esquema de entrada y salida en `src/types/genkit-types.ts`.
  2. Crea un nuevo flujo en `src/ai/flows/` usando Genkit.
  3. Expón el flujo a través de una nueva función en el archivo de Server Actions correspondiente.
  4. Llama a la Server Action desde el componente del lado del cliente que lo necesite.

¡Siguiendo esta guía, asegurarás un desarrollo coherente, rápido y de alta calidad!
