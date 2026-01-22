const Brevo = require('@getbrevo/brevo');

// Configuración del cliente Brevo
let defaultClient = Brevo.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];

// IMPORTANTE: Asegúrate de que esta variable esté en el panel de Render
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new Brevo.TransactionalEmailsApi();

module.exports = { apiInstance, Brevo };