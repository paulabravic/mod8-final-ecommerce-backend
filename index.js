require("dotenv").config();
const {
  verificarCredenciales,
  getUserByEmail,
  agregarUser,
  obtenerProductos,
  crearProducto
} = require("./database/consultas");
const {
  verificarCredencialesMiddleware,
  validarTokenMiddleware,
} = require("./middleware/middlewares");
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT_SERVER || 3000;
const JWT_SECRET_KEY = process.env.SECRET_JWT_KEY;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", async (req, res) => {
  try {
    res.json("Bienvenido a la API de Collares Bruno");
  } catch (error) {
    res.status(error.code || 500).json("Un error ha ocurrido: " + error);
  }
});


//=====================================================================
// LOGIN
//=====================================================================
app.post("/login", verificarCredencialesMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;
    const { validCredentials, nombre, rol } = await verificarCredenciales(
      email,
      password
    );

    if (validCredentials) {
      const token = jwt.sign({ email: email, nombre: nombre, rol: rol }, JWT_SECRET_KEY);
      res.send({ token });
    } else {
      throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" };
    }
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send({code: error.code || 500, message: error.message});
  }
});

//=====================================================================
// USUARIOS
//=====================================================================
app.post("/usuarios", verificarCredencialesMiddleware, async (req, res) => {
  try {
    const { nombre, email, password, direccion, ciudad, pais } = req.body;
    const usuarioAgregado = await agregarUser({
      nombre,
      email,
      password,
      direccion,
      ciudad,
      pais,
    });
    res.json({ mensaje: "Usuario agregado con éxito" });
  } catch (error) {
    res.status(500).send({code: error.code || 500, message: error.message});
  }
});

app.get("/usuarios", validarTokenMiddleware, async (req, res) => {
  try {
    const { email } = req.user;
    const user = await getUserByEmail(email);
    res.json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});


//=====================================================================
// PRODUCTOS
//=====================================================================
app.get("/productos", async (req, res) => {
  try {
    const productos = await obtenerProductos(); 
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error); 
    res.status(500).json({code: error.code || 500, message: error.message}); 
  }
});

app.post("/productos", validarTokenMiddleware, async (req, res) => {
  try {
    const nuevoProducto = req.body; 
    const productoCreado = await crearProducto(nuevoProducto, req.user.email); 
    res.status(201).json(productoCreado);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(error.code || 500).json({code: error.code || 500, message: error.message}); 
  }
});



app.use("*", (req, res) => {
  res.status(404).json("Página no encontrada");
});

app.listen(port, () => console.log(`servidor escuchado en puerto ${port}`));

module.exports = app; // Exportar la instancia de la aplicación Express
