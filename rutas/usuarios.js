import express from "express";
import { db } from "../config/firebaseAdmin.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { uid, nombre, email, rol } = req.body;
  const userRef = db.collection("usuarios").doc(uid);

  if (!uid || !nombre || !email || !rol) {
    return res.status(400).json({ error: "Faltan campos requeridos." });}

  try {
    const userRef = db.collection("usuarios").doc(uid);
    const snap    = await userRef.get();

    if (snap.exists) {
      // 🔁 Ya existe: actualiza con merge para no pisar created
      await userRef.set(
        { nombre, email, rol, actualizado: new Date() },
        { merge: true }
      );
      return res.status(200).json({ message: "Usuario actualizado correctamente." });
    }

    // ✨ No existía: créalo con ID = uid
    await userRef.set({
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
    const docRef = db.collection("usuarios").doc(uid);
    const snap = await db
      .collection("usuarios")
      .where("uid", "==", uid)
      .limit(1)
      .get();

    if (!snap.exists) 
      return res.status(404).json({ error: "Usuario no encontrado" });

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("Error GET /api/usuarios/:uid", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});
export default router;