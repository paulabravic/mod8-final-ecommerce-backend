const request = require("supertest");
const app = require("../index");

describe("Pruebas de api backend", () => {
  it("Debería responder con un mensaje de bienvenida", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toBe("Bienvenido a la API de Collares Bruno");
  });

  it("Debería iniciar sesión correctamente con credenciales válidas", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "cliente@example.com", password: "test1234" }); // Credenciales de usuario de prueba
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it('Debería devolver un error con credenciales inválidas', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'usuario@incorrecto.com', password: 'contraseña' });
    expect(response.status).toBe(404); 
    expect(response.body).toHaveProperty('message', 'No se encontró ningún usuario con estas credenciales'); 
  });

  it('Debería devolver la información del usuario con un token válido', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNsaWVudGVAZXhhbXBsZS5jb20iLCJub21icmUiOiJDbGllbnRlIiwiaWF0IjoxNzMyNTEwMzU3fQ.-XvaG3ECvzeeSXCFFyymgyZZe_YzYaNc3Z7PCp2n9Zo'; // Token JWT obtenido
  
    const response = await request(app)
      .get('/usuarios')
      .set('Authorization', `Bearer ${token}`); 
    expect(response.status).toBe(200); 
    expect(response.body).toHaveProperty('email', 'cliente@example.com'); // Verificar el email del usuario
  });

  it('Debería devolver un error si no se proporciona un token', async () => {
    const response = await request(app)
      .get('/usuarios');
    expect(response.status).toBe(401); 
    expect(response.body).toHaveProperty('error', 'Token no proporcionado'); 
  });

});
