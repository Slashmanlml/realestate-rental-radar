#!/usr/bin/env node
'use strict';

const RealEstateScout = require('./src/scout');
const RentalNotifier = require('./src/notifier');
const logger = require('./src/logger');

const DISPATCH_DELAY_MS = 800;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
    logger.log('====================================================');
    logger.log('🏠 REAL ESTATE RENTAL RADAR - RADAR DE OPORTUNIDADES');
    logger.log('====================================================\n');

    const scout = new RealEstateScout();
    const oportunidades = await scout.scanNewListings();

    let despachadas = 0;
    for (const prop of oportunidades) {
        const ok = await RentalNotifier.sendOpportunityAlert(prop);
        if (ok) despachadas++;
        if (oportunidades.length > 1) await sleep(DISPATCH_DELAY_MS);
    }

    logger.log('\n====================================================');
    logger.log(`✅ Escaneo completado. ${oportunidades.length} nuevas | ${despachadas} despachadas por Telegram.`);
    logger.log('====================================================');
    return { nuevas: oportunidades.length, despachadas };
}

if (require.main === module) {
    main().catch(err => {
        logger.error('❌ Error en el radar inmobiliario:', err.message || err);
        process.exit(1);
    });
}

module.exports = { main };
