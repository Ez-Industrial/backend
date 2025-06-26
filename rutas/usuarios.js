import express from "express";
import { db } from "../config/firebaseAdmin.js";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("▶️ Llega POST /api/usuarios:", req.body);
  const { uid, nombre, email, rol } = req.body;

  if (!uid || !nombre || !email || !rol) {
    return res.status(400).json({ error: "Faltan campos requeridos." });
  }

  try {
    const snapshot = await db.collection("usuarios").where("uid", "==", uid).get();

    if (!snapshot.empty) {
      // 🔁 Usuario existe → lo actualizamos
      const docId = snapshot.docs[0].id;
      await db.collection("usuarios").doc(docId).update({
        nombre,
        email,
        rol,
        actualizado: new Date()
      });
      return res.status(200).json({ message: "Usuario actualizado correctamente." });
    }

    // ✨ Usuario no existe → lo creamos
    await db.collection("usuarios").add({
      uid,
      nombre,
      email,
      rol,
      creado: new Date()
    });
    return res.status(201).json({ message: "Usuario nuevo guardado con éxito." });

  } catch (error) {
    console.error("❌ Error al guardar/actualizar usuario:", error);
    return res.status(500).json({ error: "Error del servidor." });
  }
});
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("usuarios").get();
    const usuarios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error("❌ Error obteniendo usuarios:", error);
    return res.status(500).json({ error: "No se pudieron obtener los usuarios." });
  }
});
router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const snap = await db
      .collection("usuarios")
      .where("uid", "==", uid)
      .limit(1)
      .get();

    if (snap.empty) return res.status(404).json({ error: "Usuario no encontrado" });

    const doc = snap.docs[0];
    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("Error GET /api/usuarios/:uid", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});
export default router;