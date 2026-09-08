# Real Estate Rental Radar

Filtra publicaciones de alquiler por precio y cantidad de ambientes, descarta las
ya vistas y despacha las nuevas por Telegram. Se ejecuta con cron de GitHub Actions.

> ### ⚠️ Estado: prototipo
>
> **No consulta ningún portal inmobiliario.** El módulo `src/scout.js` devuelve un
> conjunto fijo de publicaciones de ejemplo con el mismo formato que tendría la
> fuente real. Lo que está implementado y funciona es el resto: el filtrado por
> criterios, la deduplicación y el despacho.
>
> Para conectarlo de verdad hay que reemplazar el array `currentItems` por una
> consulta al portal, respetando sus términos de uso y su `robots.txt`.

## Uso

```bash
node index.js
```

Con `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` en el entorno despacha por Telegram;
sin esas variables corre igual y solo omite el envío.

## Correcciones aplicadas

- **La deduplicación ahora funciona.** Los ids se derivan del contenido
  (`titulo|barrio|precio`) con un hash, en vez de generarse con `Math.random()`.
  Antes cada corrida inventaba ids nuevos, nunca coincidían con el histórico y
  las mismas publicaciones se re-despachaban indefinidamente.
- **Ya no crashea al guardar.** Se crea el directorio `data/` antes de escribir;
  antes fallaba con `ENOENT` porque la carpeta no estaba en el repositorio.

## Licencia

MIT
