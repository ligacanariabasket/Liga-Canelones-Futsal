# Manual de Optimización de Rendimiento

Esta guía cubre las mejores prácticas para optimizar el rendimiento de tu aplicación, tanto en el lado del servidor (Next.js, Prisma) como en el lado del cliente (React).

## 1. Optimización del Servidor y Datos (Backend)

La velocidad de tu aplicación comienza en el servidor. Una estrategia de datos eficiente es fundamental.

### 1.1. Server Components por Defecto

Next.js App Router introduce los React Server Components (RSC) como opción predeterminada.

- **Qué hacer:** Construye la mayoría de tus componentes como Server Components. Solo utiliza el decorador `"use client"` cuando necesites interactividad del lado del cliente (hooks como `useState`, `useEffect`, o event listeners como `onClick`).
- **Por qué:** Los Server Components se renderizan en el servidor y no envían JavaScript al cliente. Esto reduce drásticamente el tamaño del bundle, mejorando los tiempos de carga inicial y la interactividad.

### 1.2. Streaming de UI con `Suspense`

- **Qué hacer:** Envuelve las partes de tu UI que dependen de datos asíncronos (como peticiones a la base de datos) con el componente `<Suspense>` de React. Proporciona un `fallback` con un componente de esqueleto (Skeleton).
- **Por qué:** En lugar de esperar a que todos los datos se carguen antes de renderizar la página, el servidor puede enviar inmediatamente el HTML estático (incluyendo los esqueletos). A medida que los datos están listos, el servidor los "streamea" al cliente, rellenando la UI sin un bloqueo completo de la página. Esto mejora drásticamente el *Time to First Byte* (TTFB) y la percepción de velocidad.

```jsx
// app/page.tsx
import { Suspense } from 'react';
import { MiComponenteDeDatos } from '@/components/MiComponente';
import { MiEsqueleto } from '@/components/MiEsqueleto';

export default function Pagina() {
  return (
    <div>
      <h1>Bienvenido</h1>
      <Suspense fallback={<MiEsqueleto />}>
        <MiComponenteDeDatos />
      </Suspense>
    </div>
  );
}
```

### 1.3. Caching Agresivo de Datos

Next.js extiende la API `fetch` para cachear automáticamente las peticiones. Úsalo siempre que sea posible en tus Server Actions o funciones de obtención de datos.

- **Qué hacer:** Utiliza `next: { revalidate: <segundos> }` para datos que no cambian constantemente, o `cache: 'force-cache'` para datos estáticos.
- **Por qué:** Esto evita ejecutar consultas a la base de datos en cada petición, sirviendo los datos desde una caché rápida y reduciendo la carga del servidor.

```typescript
// actions/data-actions.ts
export async function getDatosEstaticos() {
  // Esta petición se cacheará indefinidamente hasta que se revalide manualmente.
  const res = await fetch('https://api.example.com/data', { cache: 'force-cache' });
  return res.json();
}

export async function getDatosDinamicos() {
  // Esta petición se cacheará por 10 minutos.
  const res = await fetch('https://api.example.com/live', { next: { revalidate: 600 } });
  return res.json();
}
```

### 1.4. Optimización de Consultas a la Base de Datos (Prisma)

- **Selecciona solo los campos necesarios:** En lugar de `findMany()`, usa `findMany({ select: { ... } })` para pedir solo los datos que el componente realmente necesita.
- **Evita problemas N+1:** Cuando obtengas una lista y necesites datos relacionados para cada ítem, usa `include` para traer todo en una sola consulta en lugar de hacer consultas individuales en un bucle.
- **Paginación:** Para listas largas, pagina los resultados en la base de datos usando `take` y `skip` en lugar de traer miles de registros y paginarlos en el cliente.
- **Transacciones:** Para operaciones que involucran múltiples escrituras (crear un partido y sus eventos), usa `prisma.$transaction([...])` para asegurar la atomicidad y mejorar el rendimiento.

## 2. Optimización del Cliente (Frontend)

Una vez que el HTML llega al navegador, la eficiencia de React es crucial.

### 2.1. `React.memo` para Componentes Puros

- **Qué hacer:** Envuelve los componentes que, dadas las mismas props, siempre renderizan el mismo resultado, con `React.memo`.
- **Por qué:** `memo` previene que un componente se vuelva a renderizar si sus props no han cambiado, ahorrando ciclos de renderizado costosos. Es especialmente útil en listas largas.

```jsx
import React from 'react';

const MiComponenteCaro = React.memo(function MiComponenteCaro({ data }) {
  // ...lógica de renderizado
});
```

### 2.2. `useCallback` y `useMemo` para Memorización

- **`useCallback`:** Envuelve las funciones que pasas como props a componentes memorizados (`React.memo`) para evitar que se creen nuevas instancias de la función en cada render.
- **`useMemo`:** Memoriza el resultado de cálculos computacionalmente costosos para que no se re-ejecuten en cada render.

### 2.3. Carga Diferida (Lazy Loading) de Componentes

- **Qué hacer:** Usa `next/dynamic` para importar componentes que no son visibles inmediatamente (por ejemplo, modales, contenido "below the fold").
- **Por qué:** Esto divide el código en chunks más pequeños. El JavaScript para un componente "lazy" no se carga hasta que está a punto de ser renderizado, reduciendo el tamaño del bundle inicial.

```jsx
import dynamic from 'next/dynamic';

const ModalPesado = dynamic(() => import('@/components/ModalPesado'));

export default function MiPagina() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Abrir Modal</button>
      {showModal && <ModalPesado />}
    </div>
  );
}
```

### 2.4. Optimización de Imágenes con `next/image`

- **Qué hacer:** Usa siempre el componente `<Image>` de Next.js en lugar de la etiqueta `<img>` nativa.
- **Por qué:** `next/image` optimiza automáticamente las imágenes:
  - **Redimensiona** las imágenes para servirlas en el tamaño adecuado para cada dispositivo.
  - **Convierte** a formatos modernos y más eficientes como WebP.
  - **Aplica "lazy loading"** por defecto (las imágenes no se cargan hasta que están cerca de ser visibles).
  - **Previene *Cumulative Layout Shift* (CLS)** al reservar el espacio necesario para la imagen antes de que cargue.

## 3. Optimización de Estilos y Activos

- **CSS Crítico:** Next.js automáticamente inyecta en línea los estilos críticos necesarios para el primer renderizado, mejorando el *First Contentful Paint* (FCP).
- **Carga Asíncrona de Fuentes:** Usa `next/font` para cargar fuentes de Google Fonts u otras fuentes locales. Esto las carga de manera óptima y previene el "flash" de texto sin estilo.
- **Minimización:** La build de producción de Next.js (`next build`) minifica automáticamente el JavaScript y CSS.