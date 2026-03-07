# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] - 2026-03-07

### Fixed (Frontend)
- `screener.component.js`: reemplazado `setInterval` nativo por `$interval` de AngularJS — el ciclo de digest ahora se dispara correctamente en cada refresco del heatmap.
- `screener.component.js`: el tooltip D3 ahora se crea en `$onInit` y se elimina del DOM en `$onDestroy`, evitando el leak de elementos acumulados.

### Changed (Frontend)
- **CSS extraído de componentes a `main.css`**: todos los bloques `<style>` embebidos en los templates JS han sido eliminados y consolidados en `assets/styles/main.css`, organizado por secciones (variables, layout, tipografía, botones, navbar, screener, buscador global, login, pizarra). Los estilos ya no se duplican con cada renderizado de componente.
- **`GlobalService` creado** (`services/global.service.js`): la función `buscarGlobal` se ha extraído de `MercadoService` a un servicio propio, acorde con el principio de responsabilidad única.
- `global.component.js`: actualizado para inyectar `GlobalService` en lugar de `MercadoService`.
- `app.routes.js`: eliminada la ruta `/mercado-espanol/screener` que era un duplicado exacto de `/mercado-espanol`.
- `screener.component.js`: eliminado el bloque `if (currentTab === 'IBEX35')` vacío y el parámetro `isRefresh` no usado.
- `index.html`: scripts de librerías externas movidos al final del body (buena práctica); añadido `global.service.js`.

## [0.1.1] - 2026-03-07

### Fixed
- `GET /api/mercado/acciones/{ticker}` ahora devuelve HTTP 404 con detalle claro cuando el ticker no existe (antes devolvía `null`).
- `GET /api/global/buscar` eliminados los parámetros `tipo`, `divisa` y `mercado` que se declaraban pero nunca se aplicaban al filtrado.

### Changed
- `data/ibex35_mock.py`: extraída la función `find_accion_by_ticker(ticker)` para centralizar la búsqueda por ticker y evitar duplicar lógica en los routers.
- `routers/mercado.py`:
  - `get_sectores()` simplificado con `setdefault` en lugar de comprobación manual.
  - `get_heatmap()` simplificado: proyección de campos con dict comprehension en lugar de mapeo campo a campo.
  - `get_estadisticas()` refactorizado a un único bucle (antes hacía 4 pasadas sobre la misma lista).
- `requirements.txt`: eliminada la dependencia `fastapi-cors` (no existe como paquete independiente; CORS ya está incluido en Starlette/FastAPI).
- Alineación visual de `IBEX35_COMPANIES` para mejorar legibilidad.

## [0.1.0] - 2026-03-07

### Added
- Initial commit with project structure.
- Backend using FastAPI.
- Frontend base.
- Documentation and requirements files.
