const axios = require('axios');
const { BREVO_API_URL, BREVO_API_KEY } = require('../config/mailer');
const { contactEmailTemplate } = require('../templates/emailTemplate');
const { customerWelcomeTemplate } = require('../templates/customerTemplate');

const sendNotification = async (req, res) => {
    const contactData = req.body;

    // 1. Validación de datos recibidos
    if (!contactData || !contactData.email) {
        return res.status(400).json({ 
            success: false, 
            error: "Datos de contacto insuficientes" 
        });
    }

    try {
        // 2. Configuración de autenticación para Brevo
        const axiosConfig = {
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json'
            }
        };

        // 3. Función auxiliar para estructurar el JSON que pide Brevo
        const crearPayload = (toEmail, subject, html) => ({
            sender: { name: "Visual Core Digital", email: "visualcoredigital@gmail.com" },
            to: [{ email: toEmail }],
            subject: subject,
            htmlContent: html
        });

        // 4. Ejecución de envíos en paralelo (Admin y Cliente)
        await Promise.all([
            // Correo para la Agencia
            axios.post(BREVO_API_URL, crearPayload(
                process.env.EMAIL_ADMIN || 'visualcoredigital@gmail.com',
                `Nuevo Lead: ${contactData.nombre}`,
                contactEmailTemplate(contactData)
            ), axiosConfig),
            
            // Correo de bienvenida para el Cliente
            axios.post(BREVO_API_URL, crearPayload(
                contactData.email,
                'Confirmación de contacto - Visual Core Digital',
                customerWelcomeTemplate(contactData.nombre)
            ), axiosConfig)
        ]);

        console.log('✅ Correos enviados con éxito vía API REST (Brevo)');
        
        return res.status(200).json({ 
            success: true, 
            message: "Notificaciones enviadas correctamente" 
        });

    } catch (error) {
        // Log detallado en caso de error de la API
        const errorDetail = error.response ? error.response.data : error.message;
        console.error('❌ Error en el envío:', JSON.stringify(errorDetail));
        
        return res.status(500).json({ 
            success: false, 
            error: "Fallo en el servicio de correo",
            details: errorDetail 
        });
    }
};

module.exports = { sendNotification };