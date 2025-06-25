import express from "express";
import { db } from "../config/firebaseAdmin.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { uid, nombre, rol } = req.body;
 console.log("▶️ Llega POST /api/usuarios:", req.body);
  if (!uid || !nombre || !rol) {
    return res.status(400).json({ error: "Faltan campos requeridos." });
  }

  try {
    const snapshot = await db.collection("usuarios").where("uid", "==", uid).get();

    if (!snapshot.empty) {
      // 🔁 Usuario existe → lo actualizamos
      const docId = snapshot.docs[0].id;
      await db.collection("usuarios").doc(docId).update({
        nombre,
        rol,
        actualizado: new Date()
      });

      return res.status(200).json({ message: "Usuario actualizado correctamente." });
    }

    // ✨ Usuario no existe → lo creamos
    await db.collection("usuarios").add({
      uid,
      nombre,
      rol,
      creado: new Date()
    });

    res.status(201).json({ message: "Usuario nuevo guardado con éxito." });

  } catch (error) {
    console.error("❌ Error al guardar/actualizar usuario:", error);
    res.status(500).json({ error: "Error del servidor." });
  }
});
export default router;