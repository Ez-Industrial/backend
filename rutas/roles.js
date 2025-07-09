//roles.js
import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";
const router = express.Router();
import { admin, db } from "../config/firebaseAdmin.js";

export async function asignarRol(uid, rol) {
  try {
    // 🔐 Asignar el custom claim
    await admin.auth().setCustomUserClaims(uid, rol);
    console.log(`✅ Rol "${rol}" asignado como claim`);

    // 🔎 Buscar el documento en Firestore con ese UID
    const snapshot = await db.collection("usuarios")
    .where("uid", "==", uid).get();

    if (!snapshot.empty) {
      const docId = snapshot.docs[0].id;
      await db.collection("usuarios").doc(docId).update({ rol });
      console.log(`📝 Rol "${rol}" también guardado en Firestore`);
    } else {
      console.warn("⚠️ No se encontró documento del usuario en Firestore.");
    }

  } catch (error) {
    console.error("❌ Error al asignar rol:", error);
    throw error;
  }
}

router.post("/asignar-rol", authenticate, authorizeRoles("admin"), async (req, res) => {
  const { uid, rol } = req.body;

  if (!uid || !rol) {
    return res.status(400).json({ error: "Faltan campos: uid y rol son requeridos." });
  }
  const rolesValidos = ["admin", "lavador", "cliente"];
  if (!rolesValidos.includes(rol)) {
   return res.status(400).json({ error: "Rol no permitido." });
   } 

  try {
    await asignarRol(uid, rol);
    return res.status(200).json({ message: `Rol "${rol}" asignado correctamente al usuario.` });
  } catch (error) {
    console.error("❌ Error en endpoint:", error);
    return res.status(500).json({ error: "Error al asignar rol." });
  }
});

export default router;