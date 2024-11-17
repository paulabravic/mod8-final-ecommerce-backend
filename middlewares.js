const { JWT_SECRET_KEY } = require('./config'); 
const jwt = require('jsonwebtoken');


// Middleware para verificar la existencia de credenciales
function verificarCredencialesMiddleware(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Credenciales incompletas" });
    }
    next();
}

// Middleware para validar el token
function validarTokenMiddleware(req, res, next) {
    const Authorization = req.header("Authorization");
    if (!Authorization) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }
    
    const token = Authorization.split("Bearer ")[1];
    if (!token) {
        return res.status(401).json({ error: "Formato de token incorrecto" });
    }
    
    try {
        jwt.verify(token, JWT_SECRET_KEY);
        req.user = jwt.decode(token); // Decodificamos el token y lo asignamos al objeto req para su uso en las rutas.
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido" });
    }
}

module.exports = {
    verificarCredencialesMiddleware,
    validarTokenMiddleware
};
