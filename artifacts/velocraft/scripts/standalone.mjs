// Собирает папку /preview в корне репозитория: один index.html с вшитыми JS и CSS + картинки.
// Открывается двойным кликом (file://) и в VS Code (Live Server / Simple Browser) без Node и сервера.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist/standalone');
const out = path.resolve(root, '../../preview');

let html = await readFile(path.join(dist, 'index.html'), 'utf8');
const read = (rel) => readFile(path.join(dist, rel.replace(/^\.\//, '')), 'utf8');

// Функции-заменители (а не строки), чтобы "$&" и т.п. внутри бандла не трактовались как шаблон.
const cssLinks = [...html.matchAll(/<link rel="stylesheet"[^>]*href="(\.\/assets\/[^"]+\.css)"[^>]*>/g)];
for (const [tag, href] of cssLinks) {
  const css = await read(href);
  html = html.replace(tag, () => `<style>\n${css}\n</style>`);
}

const jsTags = [...html.matchAll(/<script type="module"[^>]*src="(\.\/assets\/[^"]+\.js)"[^>]*><\/script>/g)];
if (jsTags.length === 0 || cssLinks.length === 0) {
  throw new Error('standalone: не найдены подключения JS/CSS в dist/standalone/index.html');
}
for (const [tag, src] of jsTags) {
  const js = (await read(src)).replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
  // Модульный inline-скрипт выполняется после разбора страницы, как и внешний type=module.
  html = html.replace(tag, () => `<script type="module">\n${js}\n</script>`);
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await writeFile(path.join(out, 'index.html'), html);
for (const file of ['velocraft-bike.jpg', 'velocraft-bike.webp', 'favicon.svg', 'favicon.ico']) {
  await cp(path.join(dist, file), path.join(out, file));
}
console.log(`standalone: OK -> ${path.relative(process.cwd(), out)}/index.html (${(html.length / 1024).toFixed(0)} KB)`);
