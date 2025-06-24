// routes/roles.js
import express from "express";
const router = express.Router();
import { admin } from "./firebaseAdmin.js";

export async function asignarRol(uid, rol) {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: rol });
    console.log(`✅ Rol "${rol}" asignado a usuario con UID: ${uid}`);
  } catch (error) {
    console.error("❌ Error al asignar rol:", error);
    throw error;
  }
}

router.post("/asignar-rol", async (req, res) => {
  const { uid, rol } = req.body;

  if (!uid || !rol) {
    return res.status(400).json({ error: "Faltan campos: uid y rol son requeridos." });
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