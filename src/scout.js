const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'propiedades_vistas.json');

class RealEstateScout {
    constructor() {
        this.precioPromedioMercado = 450000;
    }

    async scanNewListings() {
        console.log('🏠 [RealEstate Scout] Escaneando portales inmobiliarios en busca de oportunidades...');

        const currentListings = [
            {
                id: `PROP-PALERMO-${Math.floor(100 + Math.random() * 900)}`,
                titulo: '2 Ambientes con Balcón y Cochera Opcional',
                barrio: 'Palermo Soho',
                precio: 360000,
                moneda: 'ARS',
                expensas: '$ 45.000 ARS',
                ambientes: 2,
                metros: '48 m²',
                link: 'https://zonaprop.com.ar/inmueble/sample-palermo-2026',
                fecha: new Date().toISOString()
            },
            {
                id: `PROP-BELGRANO-${Math.floor(100 + Math.random() * 900)}`,
                titulo: 'Monoambiente Divisible Luminoso a Estrenar',
                barrio: 'Belgrano R',
                precio: 310000,
                moneda: 'ARS',
                expensas: '$ 30.000 ARS',
                ambientes: 1,
                metros: '36 m²',
                link: 'https://zonaprop.com.ar/inmueble/sample-belgrano-2026',
                fecha: new Date().toISOString()
            },
            {
                id: `PROP-CABALLITO-${Math.floor(100 + Math.random() * 900)}`,
                titulo: '3 Ambientes Frente al Parque Rivadavia',
                barrio: 'Caballito',
                precio: 490000,
                moneda: 'ARS',
                expensas: '$ 60.000 ARS',
                ambientes: 3,
                metros: '72 m²',
                link: 'https://zonaprop.com.ar/inmueble/sample-caballito-2026',
                fecha: new Date().toISOString()
            }
        ];

        let historico = [];
        if (fs.existsSync(DB_FILE)) {
            try {
                historico = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
            } catch (e) {
                historico = [];
            }
        }

        const idsVistos = new Set(historico.map(p => p.id));
        const oportunidades = currentListings.filter(p => {
            const noVisto = !idsVistos.has(p.id);
            const esOportunidad = p.precio <= this.precioPromedioMercado || p.ambientes >= 3;
            return noVisto && esOportunidad;
        });

        console.log(`📊 [RealEstate Scout] Propiedades analizadas: ${currentListings.length} | Oportunidades: ${oportunidades.length}`);

        const actualizado = [...oportunidades, ...historico].slice(0, 100);
        fs.writeFileSync(DB_FILE, JSON.stringify(actualizado, null, 2), 'utf-8');

        return oportunidades;
    }
}

module.exports = RealEstateScout;
