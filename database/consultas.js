const { Pool } = require("pg");
const bcrypt = require('bcryptjs');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    allowExitOnIdle: true
});

const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 LIMIT 1";
    const values = [email];
    const { rows, rowCount } = await pool.query(consulta, values);

    if (rowCount <= 0 || !rows[0].contrasena)
        throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" };

    const isMatch = bcrypt.compareSync(password, rows[0].contrasena);
    if (!isMatch)
        throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" };

    // Si las credenciales son válidas, obtener el nombre del usuario
    const nombre = rows[0].nombre ?? '';

    return { validCredentials: true, nombre: nombre };
}

const getUserByEmail = async (email) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const values = [email];
    const { rows } = await pool.query(consulta, values);
    return rows[0];
}

const agregarUser = async ({ nombre, email, password, direccion, ciudad, pais }) => {
  const consulta = "INSERT INTO usuarios (nombre, email, contrasena, rol, direccion, ciudad, pais) VALUES ($1, $2, $3, 'cliente', $4, $5, $6) RETURNING *";
  const hash = bcrypt.hashSync(password, 10);
  const values = [nombre, email, hash, direccion, ciudad, pais]; 
  const res = await pool.query(consulta, values);
  return res.rows;
};

module.exports = { verificarCredenciales, getUserByEmail, agregarUser }