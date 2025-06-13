import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Buffer } from "buffer";

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("SERVICE_ACCOUNT_KEY:", process.env.SERVICE_ACCOUNT_KEY || "⚠️ Variable no definida");

if (!process.env.SERVICE_ACCOUNT_KEY) {
  throw new Error("SERVICE_ACCOUNT_KEY no está definida. Revisa el archivo .env y la ruta.");
}

const decodedKeyStr = Buffer.from(process.env.SERVICE_ACCOUNT_KEY, "base64").toString("utf8");
const serviceAccount = JSON.parse(decodedKeyStr);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Ubicación esperada del .env:", path.join(__dirname, ".env"));
console.log("Directorio de ejecución actual:", process.cwd());

const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wash-wheels.firebaseio.com"
});

console.log("Firebase Service Account Key decodificado correctamente")
