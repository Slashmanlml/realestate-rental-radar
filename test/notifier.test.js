'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const RentalNotifier = require('../src/notifier');
const { escapeMd } = require('../src/notifier');

describe('notifier', () => {
    it('escapa caracteres que rompen el Markdown', () => {
        assert.equal(escapeMd('Palermo [Soho]_top'), 'Palermo \\[Soho\\]\\_top');
    });

    it('el mensaje incluye el barrio escapado', () => {
        const prop = {
            barrio: 'Palermo [Soho]',
            ambientes: 2,
            metros: '48 m²',
            precio: 360000,
            moneda: 'ARS',
            expensas: '$ 45.000 ARS',
            titulo: '2 Ambientes',
            link: 'https://x.test/prop',
        };
        const msg = RentalNotifier.buildMessage(prop);
        assert.ok(msg.includes('Palermo \\[Soho\\]'));
        assert.ok(msg.includes('https://x.test/prop'));
    });

    it('sin credenciales no despacha y devuelve false', async () => {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chat = process.env.TELEGRAM_CHAT_ID;
        delete process.env.TELEGRAM_BOT_TOKEN;
        delete process.env.TELEGRAM_CHAT_ID;
        try {
            const ok = await RentalNotifier.sendOpportunityAlert({ id: 'x' });
            assert.equal(ok, false);
        } finally {
            if (token !== undefined) process.env.TELEGRAM_BOT_TOKEN = token;
            if (chat !== undefined) process.env.TELEGRAM_CHAT_ID = chat;
        }
    });
});
