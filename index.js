const RealEstateScout = require('./src/scout');
const RentalNotifier = require('./src/notifier');

async function main() {
    console.log('====================================================');
    console.log('🏠 REAL ESTATE RENTAL RADAR - RADAR DE OPORTUNIDADES');
    console.log('====================================================\n');

    const scout = new RealEstateScout();
    const oportunidades = await scout.scanNewListings();

    for (const prop of oportunidades) {
        await RentalNotifier.sendOpportunityAlert(prop);
        await new Promise(r => setTimeout(r, 800));
    }

    console.log('\n====================================================');
    console.log(`✅ Escaneo completado. ${oportunidades.length} alertas despachadas.`);
    console.log('====================================================');
}

main().catch(err => {
    console.error('❌ Error en el radar inmobiliario:', err);
    process.exit(1);
});
