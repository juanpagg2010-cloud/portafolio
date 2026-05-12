import http from "node:http";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import { DEFAULT_DATA } from "./Client/default-data.js";

// En esta parte reconstruyo la ruta del proyecto porque en ES Modules no existe __dirname automaticamente.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "Client");

loadEnvFile();

// Aqui se leen las variables de entorno que Render usa para iniciar el servidor y conectar la base de datos.
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "65747985";
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "portfolio";
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || "site_data";
const DATA_DOCUMENT_ID = "main";

let mongoClient;
let mongoCollection;

// Este mapa le dice al navegador que tipo de archivo esta recibiendo: HTML, CSS, JavaScript o imagenes.
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

// Esta funcion carga el archivo .env cuando trabajo en local; en produccion Render entrega esas variables directamente.
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, ".env");
    const envText = fsSync.readFileSync(envPath, "utf8");

    envText.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) return;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    });
  } catch {
    // El .env es opcional porque en Render las variables se configuran desde el panel.
  }
}

// Aqui se abre la conexion con MongoDB solo cuando se necesita y luego se reutiliza para no crear conexiones de mas.
async function getMongoCollection() {
  if (!MONGODB_URI) return null;
  if (mongoCollection) return mongoCollection;

  mongoClient = new MongoClient(MONGODB_URI);
  await mongoClient.connect();
  mongoCollection = mongoClient.db(MONGODB_DB).collection(MONGODB_COLLECTION);
  return mongoCollection;
}

// Esta funcion lee el cuerpo JSON de las peticiones y limita el tamano para evitar cargas demasiado grandes.
async function readJsonBody(request) {
  let body = "";

  for await (const chunk of request) {
    body += chunk;
    if (body.length > 12_000_000) {
      throw new Error("Payload too large");
    }
  }

  return body ? JSON.parse(body) : {};
}

// Esta funcion responde siempre en formato JSON y evita que el navegador guarde datos viejos en cache.
function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(data));
}

// Aqui se cargan los datos editables del portafolio; si MongoDB esta vacio, se crean datos iniciales.
async function getData() {
  try {
    const collection = await getMongoCollection();
    if (!collection) return DEFAULT_DATA;

    const document = await collection.findOne({ _id: DATA_DOCUMENT_ID });
    if (document?.data) return document.data;

    await collection.updateOne(
      { _id: DATA_DOCUMENT_ID },
      { $set: { data: DEFAULT_DATA, updatedAt: new Date() } },
      { upsert: true }
    );
  } catch (error) {
    console.error("MongoDB read failed:", error.message);
  }

  return DEFAULT_DATA;
}

// Esta funcion guarda en MongoDB todo el documento editable del portafolio.
async function saveData(data) {
  const collection = await getMongoCollection();

  if (!collection) {
    throw new Error("MongoDB is not configured");
  }

  await collection.updateOne(
    { _id: DATA_DOCUMENT_ID },
    { $set: { data, updatedAt: new Date() } },
    { upsert: true }
  );
}

// Esta funcion entrega los archivos del frontend desde la carpeta Client, como el HTML, CSS, JS e imagenes.
async function serveStatic(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const normalizedPath = requestUrl.pathname.startsWith("/Client/")
    ? requestUrl.pathname.replace("/Client", "")
    : requestUrl.pathname;
  const cleanPath = decodeURIComponent(normalizedPath === "/" ? "/index.html" : normalizedPath);
  const filePath = path.normalize(path.join(ROOT, cleanPath));

  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream"
    });
    response.end(file);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}

// Este bloque funciona como un router pequeno: primero atiende la API y despues entrega el frontend.
const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "GET" && requestUrl.pathname === "/api/data") {
      sendJson(response, 200, await getData());
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/login") {
      const body = await readJsonBody(request);
      const isValidPassword = body.password === ADMIN_PASSWORD;

      sendJson(response, isValidPassword ? 200 : 401, { ok: isValidPassword });
      return;
    }

    if (request.method === "PUT" && requestUrl.pathname === "/api/data") {
      const body = await readJsonBody(request);

      if (body.password !== ADMIN_PASSWORD) {
        sendJson(response, 401, { ok: false, message: "Unauthorized" });
        return;
      }

      await saveData(body.data);
      sendJson(response, 200, { ok: true });
      return;
    }

    await serveStatic(request, response);
  } catch (error) {
    sendJson(response, 500, { ok: false, message: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Portfolio server running on port ${PORT}`);
});

process.on("SIGTERM", async () => {
  await mongoClient?.close();
  process.exit(0);
});
