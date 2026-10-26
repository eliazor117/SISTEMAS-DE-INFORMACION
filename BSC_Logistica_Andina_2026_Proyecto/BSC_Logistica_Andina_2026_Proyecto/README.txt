PROYECTO MODULAR - DASHBOARD BSC LOGISTICA ANDINA 2026

ESTRUCTURA
index.html                 -> página principal
css/styles.css             -> estilos visuales
js/auth.js                 -> usuarios, login y sesión
js/dashboard.js            -> gráficos, filtros e interacción
data/bsc_data.json         -> datos de KPIs, perspectivas y regiones
assets/                    -> carpeta para logos o imágenes

COMO EJECUTAR
Opción recomendada: abrir con un servidor local, porque el navegador puede bloquear la lectura de JSON local.
1. Instala Python.
2. Abre una terminal dentro de esta carpeta.
3. Ejecuta: python -m http.server 8000
4. Abre en el navegador: http://localhost:8000

También puedes intentar abrir index.html directamente, pero algunos navegadores bloquean fetch de archivos locales.

CREDENCIALES
admin / bsc2026
jose.aroapaza / andina2026
