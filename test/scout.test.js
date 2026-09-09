'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { buildId } = require('../src/scout');

describe('scout: identidad estable', () => {
    it('el mismo contenido produce el mismo id', () => {
        const item = { titulo: '2 Ambientes', barrio: 'Palermo', precio: 360000 };
        assert.equal(buildId(item), buildId({ ...item }));
    });

    it('contenido distinto produce id distinto', () => {
        const base = { titulo: '2 Ambientes', barrio: 'Palermo', precio: 360000 };
        assert.notEqual(buildId(base), buildId({ ...base, precio: 999999 }));
    });
});

describe('scout: filtro de oportunidad', () => {
    it('filtra por precio y ambientes sin romper la deduplicación', async () => {
        // scanNewListings persiste en data/: se resguarda y restaura el archivo.
        const fs = require('node:fs');
        const path = require('node:path');
        const dbFile = path.join(__dirname, '..', 'data', 'propiedades_vistas.json');
        const backup = fs.existsSync(dbFile) ? fs.readFileSync(dbFile) : null;
        try {
            const RealEstateScout = require('../src/scout');
            const scout = new RealEstateScout();
            scout.precioPromedioMercado = 1; // fuerza: solo pasan 3+ ambientes
            fs.writeFileSync(dbFile, '[]'); // historial vacío: se evalúa el filtro, no la deduplicación
            const all = await scout.scanNewListings();
            assert.equal(all.length, 1);
            assert.ok(all.every(p => p.ambientes >= 3));
        } finally {
            if (backup === null) {
                if (fs.existsSync(dbFile)) fs.rmSync(dbFile);
            } else {
                fs.writeFileSync(dbFile, backup);
            }
        }
    });
});
