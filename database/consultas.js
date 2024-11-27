const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  allowExitOnIdle: true,
});

//=====================================================================
// LOGIN
//=====================================================================
const verificarCredenciales = async (email, password) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1 LIMIT 1";
  const values = [email];
  const { rows, rowCount } = await pool.query(consulta, values);

  if (rowCount <= 0 || !rows[0].contrasena)
    throw {
      code: 404,
      message: "No se encontró ningún usuario con estas credenciales",
    };

  const isMatch = bcrypt.compareSync(password, rows[0].contrasena);
  if (!isMatch)
    throw {
      code: 404,
      message: "No se encontró ningún usuario con estas credenciales",
    };

  // Si las credenciales son válidas, obtener el nombre y rol del usuario
  const nombre = rows[0].nombre ?? "";
  const rol = rows[0].rol ?? "";

  return { validCredentials: true, nombre: nombre, rol: rol };
};


//=====================================================================
// USUARIOS
//=====================================================================
const getUserByEmail = async (email) => {
    const consulta = "SELECT user_id, nombre, email, direccion, ciudad, pais, fecha_registro FROM usuarios WHERE email = $1";
    const values = [email];
    const { rows } = await pool.query(consulta, values);
    return rows[0];
};

const agregarUser = async ({
  nombre,
  email,
  password,
  direccion,
  ciudad,
  pais,
}) => {

  //Verificar si el correo electrónico existe
  const usuarioExistente = await getUserByEmail(email);
  if (usuarioExistente) {
    throw { code: 400, message: "El correo electrónico ya está en uso" };
  }

  const consulta =
    "INSERT INTO usuarios (nombre, email, contrasena, rol, direccion, ciudad, pais) VALUES ($1, $2, $3, 'cliente', $4, $5, $6) RETURNING *";
  const hash = bcrypt.hashSync(password, 10);
  const values = [nombre, email, hash, direccion, ciudad, pais];
  const res = await pool.query(consulta, values);
  return res.rows;
};

const obtenerRolDelUsuario = async (email) => {
  const consulta = "SELECT rol FROM usuarios WHERE email = $1";
  const valores = [email];
  const { rows } = await pool.query(consulta, valores);
  return rows[0].rol;
};


//=====================================================================
// PRODUCTOS
//=====================================================================
const obtenerProductos = async () => {
  const consulta =
    "SELECT producto_id AS id, nombre AS name, descripcion AS desc, FLOOR(precio) AS price, talla, color, stock, imagen AS img FROM productos";
  const { rows } = await pool.query(consulta);
  return rows;
};

const crearProducto = async (producto, emailUsuario) => {
  // Verificar si el usuario es administrador
  const rol = await obtenerRolDelUsuario(emailUsuario);

  if (rol !== "administrador") {
    throw {
      code: 403,
      message: "No tienes permiso para realizar esta acción.",
    };
  }

  // Verificar si ya existe un producto con el mismo nombre
  const { name, desc, price, talla, color, stock, img } = producto;
  const consultaNombre = "SELECT * FROM productos WHERE nombre = $1";
  const valoresNombre = [name];
  const { rows: productosExistentes } = await pool.query(
    consultaNombre,
    valoresNombre
  );

  if (productosExistentes.length > 0) {
    throw {
      code: 400,
      message: `Ya existe un producto con el nombre: ${name}`,
    };
  }

  //Insert producto
  const consulta =
    "INSERT INTO productos (nombre, descripcion, precio, talla, color, stock, imagen) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
  const valores = [name, desc, price, talla, color, stock, img];
  const { rows } = await pool.query(consulta, valores);

  const nuevoProducto = {
    id: rows[0].producto_id,
    name: rows[0].nombre,
    desc: rows[0].descripcion,
    price: parseInt(rows[0].precio, 10),
    talla: rows[0].talla,
    color: rows[0].color,
    stock: rows[0].stock,
    img: rows[0].imagen
  };


  console.log('nuevoProducto',nuevoProducto);

  return nuevoProducto;
};


// Función para actualizar un producto
const actualizarProducto = async (id, productoActualizado,emailUsuario) => {

  // Verificar si el usuario es administrador
  const rol = await obtenerRolDelUsuario(emailUsuario);

  if (rol !== "administrador") {
    throw {
      code: 403,
      message: "No tienes permiso para realizar esta acción.",
    };
  }

console.log('productoActualizado',productoActualizado);

  try {
    const consulta = `
      UPDATE productos
      SET nombre = $1,
          descripcion = $2,
          precio = $3,
          talla = $4,
          color = $5,
          stock = $6,
          imagen = $7
      WHERE producto_id = $8
      RETURNING *;
    `;

    const valores = [
      productoActualizado.name,
      productoActualizado.desc,
      productoActualizado.price,
      productoActualizado.talla,
      productoActualizado.color,
      productoActualizado.stock,
      productoActualizado.img,
      id,
    ];

    const resultado = await pool.query(consulta, valores);

    return resultado.rows;
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw error; // Re-lanzar el error para manejarlo en la ruta
  }
};


// Función para eliminar un producto
const eliminarProducto = async (id, emailUsuario) => {
  
  // Verificar si el usuario es administrador
  const rol = await obtenerRolDelUsuario(emailUsuario);

  if (rol !== "administrador") {
    throw {
      code: 403,
      message: "No tienes permiso para realizar esta acción.",
    };
  }

  try {
    const consulta = 'DELETE FROM productos WHERE producto_id = $1';
    const valores = [id];

    await pool.query(consulta, valores);
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    throw error; // Re-lanzar el error para manejarlo en la ruta
  }
};



//=====================================================================
// PAGO
//=====================================================================
const registrarPago = async (datosPago, pedidoId) => { // Agregar pedidoId como argumento
  try {
    const {
      metodoPago,
      numeroTarjeta,
      vencimiento,
      ccv,
      direccion,
      total, 
      carrito,
    } = datosPago;

    // Consulta SQL para insertar el pago 
    const consulta = `
      INSERT INTO pagos (pedido_id, monto, estado_pago)
      VALUES ($1, $2, $3) 
      RETURNING *; 
    `;

    const valores = [
      pedidoId, // Pasar el pedidoId como primer valor
      total,
      'completado'       
    ];

    const resultado = await pool.query(consulta, valores);
    return resultado.rows; 

  } catch (error) {
    console.error("Error al registrar el pago:", error);
    throw error;  
  }
};


const crearPedido = async (emailUsuario, total, carrito) => {
  try {
    // 1. Obtener el user_id a partir del email
    const consultaUsuario = "SELECT user_id FROM usuarios WHERE email = $1";
    const valoresUsuario = [emailUsuario];
    const { rows: usuario } = await pool.query(consultaUsuario, valoresUsuario);
    const userId = usuario.user_id;

    // 2. Insertar el nuevo pedido en la tabla 'pedidos'
    const consultaPedido = `
      INSERT INTO pedidos (user_id, total, estado)
      VALUES ($1, $2, 'pendiente') 
      RETURNING *;
    `;
    const valoresPedido = [userId, total];
    const { rows: nuevoPedido } = await pool.query(consultaPedido, valoresPedido);
    const pedidoId = nuevoPedido.pedido_id;

    // 3. Insertar los detalles del pedido en la tabla 'detalles_pedido'
    for (const producto of carrito) {
      const { id, count, price } = producto;
      const consultaDetalle = `
        INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio) 
        VALUES ($1, $2, $3, $4);
      `;
      const valoresDetalle = [pedidoId, id, count, price];
      await pool.query(consultaDetalle, valoresDetalle);
    }

    // 4. Devolver el objeto del nuevo pedido
    return nuevoPedido;
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    throw error;
  }
};


const actualizarStockProductos = async (carrito) => {
  try {
    // Iterar sobre cada producto en el carrito
    for (const producto of carrito) {
      const { id, count } = producto; 

      const consulta = `
        UPDATE productos 
        SET stock = stock - $1
        WHERE producto_id = $2
        RETURNING *; 
      `;
      const valores = [count, id];
      await pool.query(consulta, valores); 
    }
  } catch (error) {
    console.error("Error al actualizar el stock de productos:", error);
    throw error; // Re-lanzar el error para manejarlo en la ruta 
  }
};



module.exports = {
  agregarUser,
  verificarCredenciales,
  getUserByEmail,
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  registrarPago, 
  crearPedido,
  actualizarStockProductos
};
