import admin from "firebase-admin";
import { serviceAccount } from "./firebase.js";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wash-wheels.firebaseio.com"
  });
  console.log("🔥 Firebase Admin inicializado correctamente.");
}

const db = admin.firestore();

export { admin, db };