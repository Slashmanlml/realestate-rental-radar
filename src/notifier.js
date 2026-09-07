class RentalNotifier {
    static async sendOpportunityAlert(prop) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            console.log('⚠️ [Telegram] Sin credenciales configuradas, omitiendo envío.');
            return;
        }

        const mensaje = 
`🏠 *¡NUEVA OPORTUNIDAD DE ALQUILER DETECTADA!*\n\n` +
`📍 *Ubicación:* ${prop.barrio}\n` +
`🚪 *Tipo:* ${prop.ambientes} Ambientes (${prop.metros})\n` +
`💰 *Precio:* \$${prop.precio.toLocaleString()} ${prop.moneda}/mes\n` +
`🏷️ *Expensas:* ${prop.expensas}\n` +
`📋 *Detalle:* ${prop.titulo}\n\n` +
`⚡ _Las buenas propiedades se reservan en < 3hs._\n` +
`🔗 [Contactar / Ver Publicación Directa](${prop.link})\n\n` +
`⭐ _Canal VIP Alquileres Ya • Alerta Temprana_`;

        try {
            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: mensaje,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true
                })
            });
            console.log(`📱 [Telegram] Alerta inmobiliaria despachada: ${prop.id}`);
        } catch (e) {
            console.error('❌ Error enviando alerta inmobiliaria:', e.message);
        }
    }
}

module.exports = RentalNotifier;
