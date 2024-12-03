require("dotenv").config();
const {
  verificarCredenciales,
  getUserByEmail,
  agregarUser,
  actualizarUsuario,
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  registrarPago, 
  obtenerPagosUsuario,
  obtenerTodosLosPagos,
  crearPedido,
  actualizarStockProductos,
  actualizarEstadoPedido,
  obtenerFavoritosUsuario,
  agregarFavorito,
  eliminarFavorito,
  verificarFavorito
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
    console.log('user',user);
    res.json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/usuarios", validarTokenMiddleware, async (req, res) => {
  try {
    const { nombre, 
            email,             
            direccion, 
            ciudad, 
            pais } = req.body;
    const emailUsuario = req.user.email; 

    // Actualizar al usuario en la base de datos
    const usuarioActualizadoDB = await actualizarUsuario(emailUsuario, {
      nombre,
      email, 
      direccion, 
      ciudad, 
      pais,
    });

    res.json(usuarioActualizadoDB);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(error.code || 500).json({ code: error.code || 500, message: error.message });
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

// Ruta PUT para actualizar un producto
app.put('/productos/:id', validarTokenMiddleware, async (req, res) => {
  try {
    const idProducto = parseInt(req.params.id);
    const productoActualizado = req.body;
    const emailUsuario = req.user.email;

    // Actualizar el producto en la base de datos
    const productoActualizadoDB = await actualizarProducto(idProducto, productoActualizado, emailUsuario);
    
    res.json(productoActualizadoDB);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(error.code || 500).json({ code: error.code || 500, message: error.message });
  }
});

// Ruta DELETE para eliminar un producto
app.delete('/productos/:id', validarTokenMiddleware, async (req, res) => {
  try {
    const idProducto = parseInt(req.params.id);
    const emailUsuario = req.user.email;

    // Eliminar el producto de la base de datos
    await eliminarProducto(idProducto, emailUsuario);
    
    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(error.code || 500).json({ code: error.code || 500, message: error.message });
  }
});


//=====================================================================
// PAGOS
//=====================================================================
app.get("/pagos", validarTokenMiddleware, async (req, res) => {
  try {

    // Obtener el email del token JWT
    const emailUsuario = req.user.email;

    // Obtener el user_id a partir del email
    const usuario = await getUserByEmail(emailUsuario); 

    const userId = usuario.user_id;
    const rol = usuario.rol;
    let pagos = [];

    if (rol === 'administrador') {
      // Obtener todos los pagos para el administrador
      pagos = await obtenerTodosLosPagos(); 
    } else {
      // Obtener solo los pagos del usuario actual
      pagos = await obtenerPagosUsuario(userId); 
    }

    if (pagos.length === 0) {
      return res.json({ message: "No tienes pagos aún." });
    } else {
      res.json(pagos);
    }
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    res.status(error.code || 500).send({ code: error.code || 500, message: error.message });
  }
});

app.post("/pagos", validarTokenMiddleware, async (req, res) => {
  console.log('pagos',req.body);
  try {
    const {
      metodoPago,
      numeroTarjeta,
      vencimiento,
      ccv,
      direccion,
      total,
      carrito,
    } = req.body;

    const nuevoPedido = await crearPedido(req.user.email, total, carrito); 

    const response = { data: { status: "success" } }; // Simulación de respuesta exitosa

    if (response.data.status === "success") {
      const datosPago = {
        metodoPago,
        numeroTarjeta,
        vencimiento,
        ccv,
        direccion,
        total,
        carrito, 
      };
      await registrarPago(datosPago, nuevoPedido.pedido_id); // Registrar el pago, asociándolo al nuevo pedido

      //await actualizarEstadoPedido(nuevoPedido.pedido_id, "completado");

      await actualizarStockProductos(carrito);

      res.json({
        message: "Pago exitoso",
        idPedido: nuevoPedido.id, 
      });
    } else {
      res.status(500).json({ 
        code: error.code || 500, 
        message: "Error al procesar el pago" 
      });
    }
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    res.status(error.code || 500).send({ 
      code: error.code || 500, 
      message: error.message 
    });
  }
});

app.put("/pagos/:id", validarTokenMiddleware, async (req, res) => {
  try {
    const idPedido = parseInt(req.params.id);
    const nuevoEstado = req.body.estado;

    // Actualizar el estado del pedido usando la función de consultas.js
    await actualizarEstadoPedido(idPedido, nuevoEstado);

    res.json({ message: "Estado del pedido actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
    res.status(error.code || 500).send({
      code: error.code || 500,
      message: error.message,
    });
  }
});


//=====================================================================
// FAVORITOS
//=====================================================================
app.get("/favoritos", validarTokenMiddleware, async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Obtener el user_id
    const user = await getUserByEmail(userEmail);
    const user_id = user.user_id;

    // Obtener producto_id de la consulta (si existe)
    const producto_id = req.query.producto_id; 

    if (producto_id) {
      // Si se proporciona producto_id, verificar si es favorito
      const esFavorito = await verificarFavorito(user_id, producto_id);
      res.json(esFavorito); 
    } else {
      // Si no se proporciona producto_id, devolver todos los favoritos
      const productosFavoritos = await obtenerFavoritosUsuario(user_id);
      res.json(productosFavoritos); 
    }

  } catch (error) {
    console.error("Error al procesar la solicitud de favoritos:", error);
    res.status(error.code || 500).send({ code: error.code || 500, message: error.message });
  }
});

app.post("/favoritos", validarTokenMiddleware, async (req, res) => {
  try {
    const { producto_id } = req.body;
    const userEmail = req.user.email;

    // Obtener el user_id
    const user = await getUserByEmail(userEmail);
    const user_id = user.user_id;

    // Verificar si el producto ya está en favoritos
    const esFavorito = await verificarFavorito(user_id, producto_id);

    if (esFavorito) {
      // El producto ya está en favoritos, eliminarlo
      await eliminarFavorito(user_id, producto_id);
      res.json({ message: "Producto eliminado de favoritos." });
    } else {
      // El producto no está en favoritos, agregarlo
      await agregarFavorito(user_id, producto_id);
      res.json({ message: "Producto agregado a favoritos." });
    }
  } catch (error) {
    console.error("Error al procesar la solicitud de favoritos:", error);
    res.status(error.code || 500).send({ code: error.code || 500, message: error.message });
  }
});





app.use("*", (req, res) => {
  res.status(404).json("Página no encontrada");
});

app.listen(port, () => console.log(`servidor escuchado en puerto ${port}`));

module.exports = app; // Exportar la instancia de la aplicación Express
