//firebaseAdmin.js
import admin from "firebase-admin";
import { serviceAccount } from "./firebase.js";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wash-wheels.firebaseio.com"
  });
}

const db = admin.firestore();

export { admin, db };