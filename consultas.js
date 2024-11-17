const { Pool } = require("pg");
const bcrypt = require('bcryptjs');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "123456",
    database: "softjobs",
    port: 5432,
    allowExitOnIdle: true
});


const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 LIMIT 1";
    const values = [email];
    const { rows, rowCount } = await pool.query(consulta, values);

    if(rowCount<=0)
        throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" };

    const isMatch = bcrypt.compareSync(password, rows[0].password);
    if (!isMatch)
        throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" };
}

const getUserByEmail = async (email) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const values = [email];
    const {rows} = await pool.query(consulta, values);
    return rows[0];
}

const agregarUser = async ({email,password,rol,lenguage}) => {
    const consulta = "INSERT INTO usuarios VALUES (DEFAULT, $1,$2,$3,$4) RETURNING *";
    const hash = bcrypt.hashSync(password, 10);
    console.log('hash',hash);
    const values = [email, hash, rol, lenguage];
    const res = await pool.query(consulta, values);
    return res.rows[0];
}

module.exports = {verificarCredenciales,getUserByEmail,agregarUser}