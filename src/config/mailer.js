const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = { resend };
const transporter = nodemailer.createTransport({
  service: 'gmail', // Al usar 'service', Nodemailer configura automáticamente host y puerto 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Eliminamos port y host manual para que Nodemailer use su configuración interna de Gmail
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify().then(() => {
  console.log('📧 Servidor listo para enviar correos');
}).catch((err) => {
  console.error('❌ Error en la configuración de email:', err.message);
});

module.exports = { transporter };