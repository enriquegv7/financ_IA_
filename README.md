# Financial Hub Clone - España

Este proyecto es un clon funcional y estéticamente fiel de la plataforma [Financial Hub](https://www.financial-hub.es), enfocado en la sección de mercado español y screener con heatmap.

## Tecnologías Utilizadas

- **Backend:** Python con FastAPI
- **Frontend:** AngularJS (1.8), D3.js (Heatmap), Chart.js (Estadísticas)
- **Estilos:** CSS3 puro con variables y temática oscura (Dark Mode)
- **API:** RESTful con soporte CORS

## Estructura del Proyecto

- `/backend`: Servidor FastAPI, routers de API, modelos Pydantic y datos mock del IBEX35.
- `/frontend`: Aplicación AngularJS modular, servicios, componentes y estilos.

## Instrucciones de Arranque

### 1. Backend (Servidor API)

Asegúrate de tener Python 3.10+ instalado. El backend utiliza FastAPI con una arquitectura funcional y una base de datos SQLite persistente.

```bash
cd backend
# Se recomienda usar un entorno virtual
pip install -r requirements.txt
python main.py
```
- **URL de la API:** `http://localhost:8000` (¡No uses `0.0.0.0` en el navegador!)
- **Documentación Interactiva (Swagger):** `http://localhost:8000/docs`
- **Base de Datos:** Se creará automáticamente un archivo `aplicacion.db` al arrancar.

### 2. Frontend (Servidor de Desarrollo)

Puedes servir los archivos estáticos usando cualquier servidor web. Por ejemplo, con Python:

```bash
cd frontend
python -m http.server 4200 --bind 127.0.0.1
# Abre obligatoriamente http://localhost:4200 en tu navegador
```

## Características Implementadas

- **Heatmap Interactivo:** Treemap generado con D3.js que representa la capitalización y variación de las 35 empresas del IBEX35.
- **Filtros en Tiempo Real:** Filtrado por sector, visualización (Mercado/Volumen) y pestañas de categorías.
- **Buscador Global:** Búsqueda con debounce para activos financieros.
- **Diseño Responsive:** Navbar colapsable y barra inferior para dispositivos móviles.
- **Modo Oscuro:** Paleta de colores fiel a la web original.
- **Actualización Automática:** El heatmap se refresca cada 30 segundos con variaciones de precio simuladas.
- **Autenticación Real:** Sistema de registro, login y gestión de sesiones mediante JWT y persistencia en base de datos.

---
Proyecto desarrollado para demostración técnica.
