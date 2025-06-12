import { createRequire } from "module";
const require = createRequire(import.meta.url);  
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import { Buffer } from "buffer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("Directorio de firebaseAdmin.js:", __dirname);
console.log("Directorio de ejecución (process.cwd()):", process.cwd());
console.log("SERVICE_ACCOUNT_KEY:", process.env.SERVICE_ACCOUNT_KEY || "⚠️ Variable no definida");

if (!process.env.SERVICE_ACCOUNT_KEY) {
  throw new Error("SERVICE_ACCOUNT_KEY no está definida. Revisa el archivo .env y la ruta.");
}

const decodedKeyStr = Buffer.from(process.env.SERVICE_ACCOUNT_KEY, "base64").toString("utf8");
let serviceAccount;
try {
  serviceAccount = JSON.parse(decodedKeyStr);
} catch (error) {
  throw new Error("Error al parsear SERVICE_ACCOUNT_KEY: " + error);
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wash-wheels.firebaseio.com"
});

const db = admin.firestore();
async function asignarRol(uid, rol) {
    try {
        await admin.auth().setCustomUserClaims(uid, { role: rol });
        console.log(`✅ Rol "${rol}" asignado a usuario con UID: ${uid}`);
    } catch (error) {
        console.error("❌ Error al asignar rol:", error);
    }
}

// Exportar Firestore y la función de asignación de roles
export { db, asignarRol };

console.log("🔥 Firebase Admin inicializado correctamente");
