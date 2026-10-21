# VeloCraft — ремонт и кастомные велосипеды

Одностраничный сайт веломастерской с услугами ремонта, удалённой сборки, подбора компонентов и кастомных велосипедов.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/velocraft/src/App.tsx` — структура страницы, CTA, конфигуратор и контактная форма.
- `artifacts/velocraft/src/index.css` — визуальная система, адаптив и анимации.
- `artifacts/velocraft/site.config.ts` — **единый источник данных**: домен, телефон, почта, соцсети, адрес, услуги, шаги. Здесь меняются все заглушки.
- `artifacts/velocraft/seo-plugin.ts` — генерирует из конфига `<head>` (title, description, canonical, Open Graph, Twitter, JSON-LD `BicycleStore`), а также `robots.txt`, `sitemap.xml`, `llms.txt`.
- `artifacts/velocraft/public/` — иконки (`favicon.ico/svg`, `apple-touch-icon`, `icon-192/512`), `site.webmanifest`, `og-image.jpg` (1200×630), hero-картинка (jpg + webp).
- `artifacts/velocraft/index.html` — каркас; SEO-блок подставляется вместо `<!--seo-head-->`.
- `artifacts/velocraft/scripts/prerender.mjs` — после сборки встраивает отрендеренную страницу в `index.html`, чтобы боты без JS видели контент.

## Architecture decisions

- Первый релиз сделан как быстрый frontend-only сайт: прямые контакты и mailto не требуют отдельного API.
- Контактная форма открывает письмо через `mailto`, чтобы не имитировать отправку без подключённого сервера.
- Конфигуратор и мобильное меню работают локально и не зависят от внешних интеграций.

## Product

Промо-сайт VeloCraft с адаптивной навигацией, блоками услуг и процесса, архивом кастомных сборок, интерактивным конфигуратором и контактными CTA для Telegram, Instagram, телефона и email.

## User preferences

- Пользователь запросил современный креативный сайт веломастерской на русском языке с SEO-оптимизацией.

## Gotchas

- Перед публикацией нужно заменить домен `velocraft.ru`, тестовые телефон/email, Instagram/Telegram и адрес мастерской на реальные данные — **только в `site.config.ts`** (домен можно передать и через `SITE_URL=https://ваш-домен.ru` при сборке).
- Коды подтверждения Google Search Console / Яндекс.Вебмастер / Bing: `GOOGLE_SITE_VERIFICATION`, `YANDEX_VERIFICATION`, `BING_VERIFICATION` (env при сборке) или поле `verification` в конфиге.
- Сборка (`pnpm --filter @workspace/velocraft run build`) делает три шага: клиент → SSR-бандл → предрендер. Если менять `App.tsx`, не использовать `window`/`Date.now()` при рендере, иначе гидратация разойдётся с предрендером.
- В `*.tsbuildinfo` из архива может быть устаревший кэш: при ошибке TS6305 удалите их и запустите `pnpm run typecheck` заново.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
