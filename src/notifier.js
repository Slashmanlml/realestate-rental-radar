'use strict';

const logger = require('./logger');
const { callTelegramApi } = require('./telegram');

/** Escapa los caracteres que rompen el parseo Markdown de Telegram. */
const escapeMd = (text = '') => String(text).replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');

class RentalNotifier {
    static buildMessage(prop) {
        return (
`🏠 *¡NUEVA OPORTUNIDAD DE ALQUILER DETECTADA!*\n\n` +
`📍 *Ubicación:* ${escapeMd(prop.barrio)}\n` +
`🚪 *Tipo:* ${escapeMd(String(prop.ambientes))} Ambientes (${escapeMd(prop.metros)})\n` +
`💰 *Precio:* \$${Number(prop.precio).toLocaleString()} ${escapeMd(prop.moneda)}/mes\n` +
`🏷️ *Expensas:* ${escapeMd(prop.expensas)}\n` +
`📋 *Detalle:* ${escapeMd(prop.titulo)}\n\n` +
`⚡ _Las buenas propiedades se reservan en < 3hs._\n` +
`🔗 [Contactar / Ver Publicación Directa](${prop.link})\n\n` +
`⭐ _Canal VIP Alquileres Ya • Alerta Temprana_`
        );
    }

    /** Despacha la alerta. Devuelve true solo si Telegram confirmó el envío. Nunca lanza. */
    static async sendOpportunityAlert(prop) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            logger.warn('[Telegram] Sin credenciales configuradas, omitiendo envío.');
            return false;
        }

        const mensaje = RentalNotifier.buildMessage(prop);

        const res = await callTelegramApi(token, 'sendMessage', {
            chat_id: chatId,
            text: mensaje,
            parse_mode: 'Markdown',
            disable_web_page_preview: true
        });
        if (!res.ok) {
            logger.error(`❌ Error enviando alerta inmobiliaria: ${res.error.message}`);
            return false;
        }
        logger.info(`📱 [Telegram] Alerta inmobiliaria despachada: ${prop.id}`);
        return true;
    }
}

module.exports = RentalNotifier;
module.exports.escapeMd = escapeMd;
