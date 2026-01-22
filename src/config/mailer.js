const nodemailer = require('nodemailer');

// Configuración del transportador optimizada para la nube (Render)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,             // Puerto estándar para TLS
  secure: false,         // Debe ser false para el puerto 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // Esto evita que la conexión se caiga por temas de certificados en contenedores
    rejectUnauthorized: false 
  }
});

// Verificación de la conexión con Gmail
transporter.verify().then(() => {
  console.log('📧 Servidor listo para enviar correos (Puerto 587)');
}).catch((err) => {
  // Aquí verás el error detallado si la App Password es incorrecta
  console.error('❌ Error en la configuración de email:', err.message);
});

module.exports = { transporter };