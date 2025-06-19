// routes/roles.js
import express from "express";
import { asignarRol } from "./firebaseAdmin.js";
const router = express.Router();

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