import { createRequire } from "module";
const require = createRequire(import.meta.url);  // 🔥 Esto permite usar `require()` en ESM


const admin = require("firebase-admin");
const serviceAccount = process.env.SERVICE_ACCOUNT_KEY ? JSON.parse(process.env.SERVICE_ACCOUNT_KEY) : null;

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
