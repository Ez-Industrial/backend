import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Buffer } from "buffer";
import admin from "firebase-admin"; 

dotenv.config({ path: path.join(fileURLToPath(import.meta.url), "../.env") });

if (!process.env.SERVICE_ACCOUNT_KEY) {
  throw new Error("SERVICE_ACCOUNT_KEY no está definida. Revisa el archivo .env y la ruta.");
}

const decodedKeyStr = Buffer.from(process.env.SERVICE_ACCOUNT_KEY, "base64").toString("utf8");
const serviceAccount = JSON.parse(decodedKeyStr);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wash-wheels.firebaseio.com"
});

export {serviceAccount};