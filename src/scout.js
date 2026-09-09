const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const DB_FILE = path.join(__dirname, '..', 'data', 'propiedades_vistas.json');

/**
 * Identidad estable derivada del contenido (titulo, barrio, precio).
 * Antes se usaba Math.random(), asi que cada corrida generaba ids nuevos y el
 * filtro de duplicados no filtraba nada: se re-despachaba todo en cada ejecucion.
 */
const buildId = item => 'PROP-' + crypto.createHash('sha1')
  .update([item.titulo, item.barrio, item.precio].join('|').toLowerCase())
  .digest('hex').slice(0, 10);

class RealEstateScout {
    constructor() {
        this.precioPromedioMercado = 450000;
    }

    async scanNewListings() {
        logger.log('🏠 [RealEstate Scout] Escaneando portales inmobiliarios en busca de oportunidades...');

        const currentItems = [
            {
                id: null, // se calcula abajo, a partir del contenido
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
                id: null, // se calcula abajo, a partir del contenido
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
                id: null, // se calcula abajo, a partir del contenido
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

        // Identidad estable: sin esto la deduplicacion no puede funcionar.

        currentItems.forEach(i => { i.id = buildId(i); });


        let historico = [];
        if (fs.existsSync(DB_FILE)) {
            try {
                historico = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
            } catch (e) {
                historico = [];
            }
        }

        const idsVistos = new Set(historico.map(p => p.id));
        const oportunidades = currentItems.filter(p => {
            const noVisto = !idsVistos.has(p.id);
            const esOportunidad = p.precio <= this.precioPromedioMercado || p.ambientes >= 3;
            return noVisto && esOportunidad;
        });

        logger.log(`📊 [RealEstate Scout] Propiedades analizadas: ${currentItems.length} | Oportunidades: ${oportunidades.length}`);

        const actualizado = [...oportunidades, ...historico].slice(0, 100);
        fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
        fs.writeFileSync(DB_FILE, JSON.stringify(actualizado, null, 2), 'utf-8');

        return oportunidades;
    }
}

module.exports = RealEstateScout;
module.exports.buildId = buildId;
