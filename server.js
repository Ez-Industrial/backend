import express from "express";
import cors from "cors";
import { db } from "./config/firebaseAdmin.js";
import Joi from "joi";
import dotenv from "dotenv";
import { authenticate, authorizeRoles } from "./middlewares/auth.js";
import asignarRol from "./rutas/roles.js";
import usuariosRoutes from "./rutas/usuarios.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8081;

// Middlewaresaa
app.use(cors());
app.use(
  express.json({
    verify: (req, res, buf) => {
      console.log("💡 raw body recibido:", buf.toString());
    }
  })
);
app.use("/api/roles", asignarRol);

//Validación
const usuarioSchema = Joi.object({
    nombre: Joi.string().min(3).max(50).required()
});

//Rutas
app.get('/', (req, res) => {
 res.send("<h1>¡Bienvenido a WashWheels en Vercel! lap</h1><p>El backend está funcionando correctamente.</p>");
});

app.use("/api/usuarios", usuariosRoutes);

app.get("/mensajes", async (req, res) => {
  try {
    const querySnapshot = await db.collection("mensajes").get();
    const mensajesArray = querySnapshot.docs.map(doc => doc.data());
    res.json(mensajesArray); // Aquí aseguramos que se envía JSON
  } catch (error) {
    console.error("Error obteniendo mensajes:", error);
    res.status(500).json({ error: "Error obteniendo mensajes de Firebase" }); // Enviar un JSON en caso de error
  }
});

app.get("/mensajes/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const querySnapshot = await db.collection("mensajes").where("uid", "==", uid).get();
    const mensajesArray = querySnapshot.docs.map(doc => doc.data());
    res.json(mensajesArray);
  } catch (error) {
    console.error("Error obteniendo mensajes:", error);
    res.status(500).json({ error: "Error al obtener mensajes de Firebase" });
  }
});

app.post("/api/test", async (req, res) => {
  try {
    const { mensaje, uid } = req.body;
    if (!uid) return res.status(400).json({ error: "UID requerido" });

    await db.collection("mensajes").add({ mensaje, uid, timestamp: new Date() });
    res.json({ mensajeGuardado: mensaje });
  } catch (err) {
    console.error("Error guardando mensaje:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.get("/profile", authenticate, (req, res) => {
  return res.json(req.user);
});

app.post( "/admin/create",  authenticate, authorizeRoles("admin"),  async (req, res) => {
    res.json({ ok: true });
  });

app.use((err, req, res, next) => {
  console.error("❌ Error inesperado:", err.stack);
  res.status(500).json({ error: "Algo salió mal en el servidor." });
});

//Local 
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Backend corriendo en http://localhost:${PORT}`));
}

export default app;