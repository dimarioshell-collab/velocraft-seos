// Встраивает отрендеренную главную страницу в dist/public/index.html,
// чтобы поисковые и ИИ-боты, не исполняющие JS, видели весь контент и ссылки.
// Запускается после `vite build` и `vite build --ssr` (см. скрипт "build").
import { readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = path.join(root, 'dist/public/index.html');
const serverDir = path.join(root, 'dist/server');
const serverEntry = path.join(serverDir, 'entry-server.js');

const { render } = await import(pathToFileURL(serverEntry).href);
const appHtml = render();

const template = await readFile(htmlPath, 'utf8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  throw new Error(`prerender: в ${htmlPath} не найден ${marker}`);
}
if (!appHtml || appHtml.length < 500) {
  throw new Error('prerender: пустой результат рендера');
}

await writeFile(htmlPath, template.replace(marker, `<div id="root">${appHtml}</div>`));
await rm(serverDir, { recursive: true, force: true });
console.log(`prerender: OK (${(appHtml.length / 1024).toFixed(1)} KB HTML встроено в index.html)`);
