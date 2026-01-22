const { apiInstance, Brevo } = require('../config/mailer');
const { contactEmailTemplate } = require('../templates/emailTemplate');
const { customerWelcomeTemplate } = require('../templates/customerTemplate');

const sendNotification = async (req, res) => {
    const contactData = req.body;

    if (!contactData || !contactData.email) {
        return res.status(400).json({ success: false, error: "Datos insuficientes" });
    }

    try {
        // Función auxiliar para configurar cada envío
        const prepararEmail = (destinatario, asunto, contenido) => {
            let email = new Brevo.SendSmtpEmail();
            email.subject = asunto;
            email.htmlContent = contenido;
            email.sender = { "name": "Visual Core Digital", "email": "visualcoredigital@gmail.com" };
            email.to = [{ "email": destinatario }];
            return email;
        };

        // Creamos los dos correos
        const emailAdmin = prepararEmail(
            process.env.EMAIL_ADMIN || 'visualcoredigital@gmail.com',
            `Nuevo Lead: ${contactData.nombre}`,
            contactEmailTemplate(contactData)
        );

        const emailCliente = prepararEmail(
            contactData.email,
            'Confirmación de contacto - Visual Core Digital',
            customerWelcomeTemplate(contactData.nombre)
        );

        // Enviamos ambos en paralelo
        await Promise.all([
            apiInstance.sendTransacEmail(emailAdmin),
            apiInstance.sendTransacEmail(emailCliente)
        ]);

        console.log('✅ Correos enviados con éxito a través de Brevo');
        return res.status(200).json({ success: true, message: "Notificaciones enviadas" });

    } catch (error) {
        console.error('❌ Error en el envío de Brevo:', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { sendNotification };