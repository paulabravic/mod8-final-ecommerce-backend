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
  const { nombre, descripcion, precio, talla, color, stock, imagen } = producto;
  const consultaNombre = "SELECT * FROM productos WHERE nombre = $1";
  const valoresNombre = [nombre];
  const { rows: productosExistentes } = await pool.query(
    consultaNombre,
    valoresNombre
  );

  if (productosExistentes.length > 0) {
    throw {
      code: 400,
      message: `Ya existe un producto con el nombre: ${nombre}`,
    };
  }

  //Insert producto
  const consulta =
    "INSERT INTO productos (nombre, descripcion, precio, talla, color, stock, imagen) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
  const valores = [nombre, descripcion, precio, talla, color, stock, imagen];
  const { rows } = await pool.query(consulta, valores);
  return rows;
};

module.exports = {
  agregarUser,
  verificarCredenciales,
  getUserByEmail,
  obtenerProductos,
  crearProducto,
};
