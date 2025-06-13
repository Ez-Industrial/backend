console.log("▶️  [firebaseAdmin.js] arrancó");
import admin from "firebase-admin";
import { serviceAccount } from "./firebase.js";

console.log("📦 serviceAccount recibido en Admin:", typeof serviceAccount !== "undefined" ? "OK" : "defined");
console.log("⚙️  admin.apps.length:", admin.apps.length);
console.log("🛠  serviceAccount importado:", !!serviceAccount);


// Evitar doble inicialización
if (!admin.apps.length) {
    console.log("✅  No hay apps inicializadas, voy a inicializar Firebase");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wash-wheels.firebaseio.com"
  });
  console.log("🔥 Firebase Admin inicializado correctamente.");

}

const db = admin.firestore();

export { db };
export async function asignarRol(uid, rol) {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: rol });
    console.log(`✅ Rol "${rol}" asignado a usuario con UID: ${uid}`);
  } catch (error) {
    console.error("❌ Error al asignar rol:", error);
  }
}
