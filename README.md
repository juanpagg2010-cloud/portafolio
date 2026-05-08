# Portafolio Juan Pablo Barragan Cortes

Portafolio personal creado con HTML5, CSS3, JavaScript vanilla y un mini backend en Node.js para guardar cambios globales.

## Deploy en Render

1. Sube este proyecto a un repositorio de GitHub.
2. En Render, crea un nuevo **Web Service** o usa el Blueprint del archivo `render.yaml`.
3. Configuracion manual si Render la pide:
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Agrega las variables de entorno:
   - `ADMIN_PASSWORD`: contrasena de edicion.
   - `MONGODB_URI`: URL de MongoDB Atlas.
   - `MONGODB_DB`: `portfolio`
   - `MONGODB_COLLECTION`: `site_data`
5. Render publicara el sitio y te dara una URL `onrender.com`.

## Uso local

```bash
npm start
```

Despues abre `http://localhost:3000`.

Para usar MongoDB localmente, copia `.env.example` como `.env` y reemplaza `TU_PASSWORD` por tu contrasena real de Atlas.

## Archivos principales

- `index.html`: estructura del sitio.
- `styles.css`: estilos, responsive y animaciones.
- `script.js`: menu movil, animaciones, modo edicion y llamadas a la API.
- `server.js`: servidor Node que entrega la pagina y guarda cambios.
- MongoDB Atlas guarda los datos editables del portafolio.
