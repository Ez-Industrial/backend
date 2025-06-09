const express = require("express");
const cors = require("cors");
const { db, asignarRol } = require("./config/firebaseAdmin.js");
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en https://backend-one-psi-28.vercel.app`));

const Joi = require("joi");

const usuarioSchema = Joi.object({
    nombre: Joi.string().min(3).max(50).required()
});

app.post("/usuarios", async (req, res) => {
    const { error } = usuarioSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const docRef = await db.collection("usuarios").add(req.body);
        res.status(200).json({ id: docRef.id, mensaje: "Usuario guardado con éxito" });
    } catch (error) {
        console.error("❌ Error al guardar en Firestore:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

app.get("/usuarios", async (req, res) => {
    try {
        const snapshot = await db.collection("usuarios").get();
        const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Construir HTML con estilos personalizados
        const htmlResponse = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Usuarios</title>
                <style>
                    body { font-family: 'Courier New', monospace; background-color: #f4f4f4; padding: 20px; }
                    h1 { font-size: 24px; color: #333; }
                    ul { list-style-type: none; padding: 0; }
                    li { font-size: 18px; margin: 5px 0; }
                </style>
            </head>
            <body>
                <h1>Lista de Usuarios</h1>
                <ul>
                    ${usuarios.map(user => `<li>${user.nombre}</li>`).join("")}
                </ul>
            </body>
            </html>
        `;

        res.send(htmlResponse);  // Devolver la respuesta con estilos
    } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
        res.status(500).send("<h1>Error interno del servidor</h1>");
    }
});

app.use(express.json()); // Asegura que Express pueda leer JSON

app.post("/api/test", async (req, res) => {
  try {
    const { mensaje, uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "UID del usuario es obligatorio" });
    }

    await db.collection("mensajes").add({ mensaje, uid, timestamp: new Date() });
    res.json({ mensajeGuardado: mensaje });
  } catch (error) {
    console.error("Error guardando mensaje:", error);
    res.status(500).json({ error: "Error guardando mensaje en Firebase" });
  }
});

app.get('/', (req, res) => {
  console.log('R');
  res.json({ mensaje: 'A' });

});

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

app.get('/api/test', (req, res) => {
  console.log('Solicitud recibida en /api/test');
  res.json({ mensaje: 'API funcionando' });
});

app.get('/usuario/rol', (req, res) => {
  asignarRol("kV4o1NJ30pTszDxPd7Q8AbwU8fC2", "admin"); // Asigna el rol "admin" a este usuario
  console.log('Mandando rol de usuario');
  res.json({ mensaje: 'eres admin' });
});