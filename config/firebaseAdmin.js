import admin from "firebase-admin";

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
