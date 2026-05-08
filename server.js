import http from "node:http";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "Client");

loadEnvFile();

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "65747985";
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "portfolio";
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || "site_data";
const DATA_DOCUMENT_ID = "main";

let mongoClient;
let mongoCollection;

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

const defaultData = {
  profile: {
    name: "Juan Pablo Barragan Cortes",
    initials: "JP",
    photo: "",
    specialty: "JavaScript Backend",
    hero:
      "Construyo la logica detras de cada aplicacion: APIs seguras, bases de datos eficientes y sistemas backend escalables que hacen que todo funcione.",
    about:
      "Soy un desarrollador web especializado en el backend con JavaScript. Me enfoco en tecnologias como Node.js, Express, HTML y CSS, aunque mi principal fortaleza es el desarrollo backend.",
    location:
      "Soy de Colombia, Ibague - Tolima, y desde ahi estoy construyendo mi camino en el desarrollo web con enfoque en soluciones backend.",
    stats: [
      { title: "Node.js", text: "Runtime principal" },
      { title: "Express.js", text: "APIs y rutas" },
      { title: "DevSenior Code", text: "Formacion actual" }
    ]
  },
  skills: [
    { id: "skill-0", name: "HTML5" },
    { id: "skill-1", name: "CSS3" },
    { id: "skill-2", name: "Tailwind CSS" },
    { id: "skill-3", name: "JavaScript Vanilla" },
    { id: "skill-4", name: "Node.js" },
    { id: "skill-5", name: "Express.js" }
  ],
  projects: [
    {
      id: "gym-system",
      name: "Gym System",
      url: "https://gym-system-cxnq.onrender.com",
      description:
        "Sistema web orientado a la gestion de procesos para un gimnasio, con enfoque en estructura backend, rutas y flujo de datos."
    },
    {
      id: "class-manager",
      name: "Class Manager",
      url: "https://classmanager-r062.onrender.com",
      description:
        "Aplicacion para administrar informacion academica y organizar recursos de clase con una experiencia web clara y practica."
    }
  ],
  education: [
    {
      id: "devsenior",
      label: "Formacion actual",
      title: "DevSenior Code",
      description:
        "Actualmente estoy estudiando JavaScript y desarrollo web para crear soluciones backend mas limpias, robustas y profesionales.",
      url: "https://www.devseniorcode.com/nosotros/",
      logo: "assets/devsenior-logo.webp"
    },
    {
      id: "fps",
      label: "Institucion educativa",
      title: "Colegio Francisco de Paula Santander",
      description:
        "Parte de mi formacion academica viene de esta institucion educativa, ubicada en Ibague, Tolima.",
      url: "https://www.iefranciscodepaulasantander.edu.co",
      logo: "assets/francisco-de-paula-santander-logo.jpg"
    }
  ],
  learningTech: [
    {
      id: "mongo-db",
      name: "MongoDB",
      description: "Estoy fortaleciendo el manejo de bases de datos NoSQL para conectar mejor mis APIs."
    },
    {
      id: "typescript",
      name: "TypeScript",
      description: "Estoy aprendiendo tipado para escribir codigo JavaScript mas claro, estable y mantenible."
    },
    {
      id: "testing",
      name: "Testing Backend",
      description: "Estoy practicando pruebas para validar endpoints, errores y comportamientos del servidor."
    }
  ]
};

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
    // .env is optional. Render should use real environment variables.
  }
}

async function getMongoCollection() {
  if (!MONGODB_URI) return null;
  if (mongoCollection) return mongoCollection;

  mongoClient = new MongoClient(MONGODB_URI);
  await mongoClient.connect();
  mongoCollection = mongoClient.db(MONGODB_DB).collection(MONGODB_COLLECTION);
  return mongoCollection;
}

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

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(data));
}

async function getData() {
  try {
    const collection = await getMongoCollection();
    if (!collection) return defaultData;

    const document = await collection.findOne({ _id: DATA_DOCUMENT_ID });
    if (document?.data) return document.data;

    await collection.updateOne(
      { _id: DATA_DOCUMENT_ID },
      { $set: { data: defaultData, updatedAt: new Date() } },
      { upsert: true }
    );
  } catch (error) {
    console.error("MongoDB read failed:", error.message);
  }

  return defaultData;
}

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
