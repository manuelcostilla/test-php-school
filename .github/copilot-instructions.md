# Copilot Instructions for AI Coding Agents

## Arquitectura y Estructura General
- Proyecto basado en [Astro](https://astro.build/), estructura estándar: `src/pages`, `src/components`, `src/layouts`, `src/lib`, `public`.
- El sitio consume contenido dinámico desde un WordPress externo (`https://clic.baradero.gob.ar`) usando funciones en `src/lib/wp.js`.
- Los componentes principales (`Header`, `Footer`, `Layout`) se encuentran en `src/components` y `src/layouts`.
- Las páginas Astro (`.astro`) pueden importar y renderizar HTML externo, eliminando cabeceras y pies de página redundantes.

## Flujo de Datos y Comunicación
- El archivo `src/lib/wp.js` contiene funciones para obtener datos de WordPress vía REST API (`getPageInfo`, `getPostInfo`, etc.).
- Ejemplo de uso: `const { id, title } = await getPageInfo("inicio");`.
- Los datos obtenidos se usan para renderizar contenido dinámico en las páginas Astro.
- Se cargan estilos remotos de WordPress/Elementor mediante múltiples `<link rel="stylesheet">` en el `<head>`.

## Convenciones y Patrones Específicos
- El contenido HTML externo se limpia de `<header>` y `<footer>` antes de insertarse en el DOM (`replace(/<header[\s\S]*?<\/header>/g, "")`).
- Los componentes usan slots para header/footer y un layout base.
- Los estilos globales adicionales están en `src/styles/global.css`.
- Los scripts de WordPress/Elementor se cargan al final del `<body>`.

## Workflows de Desarrollo
- Comandos principales:
  - `npm install` — Instala dependencias
  - `npm run dev` — Servidor local en `localhost:4321`
  - `npm run build` — Compila a producción en `./dist/`
  - `npm run preview` — Previsualiza el build
- No hay tests automatizados ni scripts personalizados documentados.

## Integraciones y Dependencias
- Depende de la API REST de WordPress para datos de páginas y posts.
- Carga CSS y JS remotos de Elementor y Astra Theme.
- El script `scripts/fetch-elementor-css.js` puede usarse para obtener CSS remoto (ver si es relevante para tareas de scraping o build).

## Ejemplo de Patrón de Página
```astro
---
import { getPageInfo } from "../lib/wp";
const { id, title } = await getPageInfo("inicio");
---
<Layout title={title}>
  <Header slot="header" />
  <div set:html={content} />
  <Footer slot="footer" />
</Layout>
```

## Notas
- Si la API de WordPress cambia, actualizar `src/lib/wp.js`.
- Si se agregan nuevos componentes, seguir la convención de importación y uso de slots/layouts.
- Para problemas de carga de CSS, revisar el orden de los `<link>` y posibles bloqueos de CORS.
