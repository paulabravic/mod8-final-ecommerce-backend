const { verificarCredenciales, getUserByEmail, agregarUser } = require('./consultas');
const { verificarCredencialesMiddleware, validarTokenMiddleware } = require('./middlewares');
const { JWT_SECRET_KEY } = require('./config'); 
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.get("/", async (req,res) => {
  try {
    res.json("Bienvenido a la api");
  } catch (error) {
    res.status(500).json("Un error ha ocurrido: " + error);
  }
});


app.post("/login", verificarCredencialesMiddleware, async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const token = jwt.sign({ email }, JWT_SECRET_KEY);
        res.send({token});
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error);
    }
});


app.post("/usuarios", verificarCredencialesMiddleware, async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body;
        console.log(email, password, rol, lenguage);

        const usuarioAgregado = await agregarUser({email, password, rol, lenguage});
        console.log(usuarioAgregado);

        res.json({mensaje:"ok"});
    } catch (error) {
        res.status(500).send(error);
    }
});


app.get("/usuarios", validarTokenMiddleware, async (req, res) => {
    try {
        
      const { email } = req.user;
      const user = await getUserByEmail(email);
      res.json([user]);
      
    } catch (error) {
        res.status(500).send(error);
    }
});


app.use('*', (req, res) => {
  res.status(404).json('Página no encontrada');
});


app.listen(port, () => console.log("servidor escuchado en puerto 3000")); 