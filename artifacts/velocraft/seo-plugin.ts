import type { Plugin } from 'vite';

import { site } from './site.config';

/**
 * SEO-плагин: из site.config.ts генерирует
 *  - <head>-блок (title, description, canonical, Open Graph, Twitter, JSON-LD, иконки);
 *  - robots.txt, sitemap.xml, llms.txt.
 * Работает и в dev-сервере, и в production-сборке.
 */

const HEAD_MARKER = '<!--seo-head-->';

const esc = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** JSON внутри <script>: экранируем "<", чтобы нельзя было выйти из тега. */
const jsonForScript = (data: unknown) =>
  JSON.stringify(data, null, 2).replace(/</g, '\\u003c');

function resolveSiteUrl() {
  return (process.env.SITE_URL || site.url).replace(/\/+$/, '');
}

function buildJsonLd(url: string) {
  const abs = (path: string) => `${url}${path}`;
  const { address, services } = site;

  const business = {
    '@type': 'BicycleStore',
    '@id': abs('/#business'),
    name: site.name,
    description: site.description,
    url: abs('/'),
    image: [abs(site.og.image), abs('/velocraft-bike.jpg')],
    logo: abs('/icon-512.png'),
    telephone: site.phone.tel,
    email: site.email,
    foundingDate: String(site.foundingYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressCountry: address.country,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [...address.openingDays],
        opens: address.opens,
        closes: address.closes,
      },
    ],
    areaServed: [
      { '@type': 'City', name: address.city },
      { '@type': 'Country', name: 'Россия' },
    ],
    sameAs: [site.instagram.url, site.telegram.url],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: site.phone.tel,
      email: site.email,
      availableLanguage: 'ru',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Услуги веломастерской VeloCraft',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.text,
          provider: { '@id': abs('/#business') },
          areaServed: { '@type': 'Country', name: 'Россия' },
        },
      })),
    },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': abs('/#website'),
        url: abs('/'),
        name: site.name,
        inLanguage: site.lang,
        publisher: { '@id': abs('/#business') },
      },
      business,
      {
        '@type': 'WebPage',
        '@id': abs('/#webpage'),
        url: abs('/'),
        name: site.title,
        description: site.description,
        inLanguage: site.lang,
        isPartOf: { '@id': abs('/#website') },
        about: { '@id': abs('/#business') },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: abs(site.og.image),
          width: site.og.width,
          height: site.og.height,
        },
      },
    ],
  };
}

function buildHead(url: string) {
  const abs = (path: string) => `${url}${path}`;
  const canonical = abs('/');
  const image = abs(site.og.image);
  const verification = {
    google: process.env.GOOGLE_SITE_VERIFICATION || site.verification.google,
    yandex: process.env.YANDEX_VERIFICATION || site.verification.yandex,
    bing: process.env.BING_VERIFICATION || site.verification.bing,
  };

  const lines = [
    `<title>${esc(site.title)}</title>`,
    `<meta name="description" content="${esc(site.description)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `<meta name="author" content="${esc(site.name)}" />`,
    `<meta name="application-name" content="${esc(site.name)}" />`,
    `<meta name="apple-mobile-web-app-title" content="${esc(site.name)}" />`,
    `<meta name="theme-color" content="${site.themeColor}" />`,
    '',
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel="alternate" hreflang="${site.lang}" href="${canonical}" />`,
    `<link rel="alternate" hreflang="x-default" href="${canonical}" />`,
    '',
    '<!-- Open Graph: Facebook, VK, Telegram, WhatsApp, LinkedIn, Discord, Slack -->',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:title" content="${esc(site.title)}" />`,
    `<meta property="og:description" content="${esc(site.shortDescription)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:secure_url" content="${image}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="${site.og.width}" />`,
    `<meta property="og:image:height" content="${site.og.height}" />`,
    `<meta property="og:image:alt" content="${esc(site.og.alt)}" />`,
    '',
    '<!-- Twitter / X -->',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(site.title)}" />`,
    `<meta name="twitter:description" content="${esc(site.shortDescription)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${esc(site.og.alt)}" />`,
    '',
    '<!-- Иконки и манифест -->',
    `<link rel="icon" href="/favicon.ico" sizes="48x48" />`,
    `<link rel="icon" type="image/svg+xml" href="/favicon.svg" sizes="any" />`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
    `<link rel="manifest" href="/site.webmanifest" />`,
    `<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />`,
  ];

  if (verification.google) {
    lines.push(`<meta name="google-site-verification" content="${esc(verification.google)}" />`);
  }
  if (verification.yandex) {
    lines.push(`<meta name="yandex-verification" content="${esc(verification.yandex)}" />`);
  }
  if (verification.bing) {
    lines.push(`<meta name="msvalidate.01" content="${esc(verification.bing)}" />`);
  }

  lines.push(
    '',
    '<!-- Структурированные данные (Schema.org JSON-LD) -->',
    `<script type="application/ld+json">\n${jsonForScript(buildJsonLd(url))}\n</script>`,
  );

  return lines.join('\n    ');
}

/** Поисковые, ИИ-поисковые, ИИ-ассистентские и соцсетевые краулеры. */
const searchBots = ['Googlebot', 'Googlebot-Image', 'Bingbot', 'YandexBot', 'YandexImages', 'YandexAdditional', 'DuckDuckBot', 'Applebot'];
const socialBots = ['facebookexternalhit', 'Facebot', 'Twitterbot', 'TelegramBot', 'vkShare', 'LinkedInBot', 'WhatsApp', 'Slackbot', 'Discordbot', 'Pinterestbot'];
const aiSearchBots = ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'DuckAssistBot', 'MistralAI-User', 'Meta-ExternalFetcher'];
const aiTrainingBots = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'Amazonbot', 'Meta-ExternalAgent', 'CCBot'];

const group = (agents: string[]) =>
  [...agents.map((agent) => `User-agent: ${agent}`), 'Allow: /'].join('\n');

function buildRobots(url: string) {
  return `# robots.txt для ${url}
# Сайт открыт для индексации поисковиками, соцсетями и ИИ-ассистентами.

User-agent: *
Allow: /

# Поисковые роботы
${group(searchBots)}

# Превью ссылок в соцсетях и мессенджерах
${group(socialBots)}

# ИИ-поиск и ИИ-ассистенты (ответы ChatGPT, Claude, Perplexity и др. со ссылкой на сайт)
${group(aiSearchBots)}

# Сбор данных для обучения ИИ. Сейчас разрешён.
# Чтобы запретить, замените "Allow: /" на "Disallow: /" в этой группе.
${group(aiTrainingBots)}

Sitemap: ${url}/sitemap.xml
`;
}

function buildSitemap(url: string) {
  const lastmod = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${url}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${url}${site.og.image}</image:loc>
      <image:title>${esc(site.title)}</image:title>
      <image:caption>${esc(site.og.alt)}</image:caption>
    </image:image>
    <image:image>
      <image:loc>${url}/velocraft-bike.jpg</image:loc>
      <image:title>Кастомный велосипед VeloCraft в мастерской</image:title>
    </image:image>
  </url>
</urlset>
`;
}

/** llms.txt: краткая «визитка» сайта для языковых моделей (https://llmstxt.org). */
function buildLlms(url: string) {
  const { address, services, steps } = site;
  return `# ${site.name}

> ${site.description}

${site.name} — веломастерская в Москве, основана в ${site.foundingYear} году. Принимаем заказы со всей России: часть работы (подбор деталей, сборка по видеосвязи) делается удалённо.

## Услуги

${services.map((service) => `- [${service.title}](${url}/#services): ${service.text}`).join('\n')}

## Как мы работаем

${steps.map(([num, title, text]) => `- [${num}. ${title}](${url}/#method): ${text}`).join('\n')}

## Контакты

- Адрес мастерской: ${address.city}, ${address.street}
- Часы работы: ${address.hoursText}
- Телефон: ${site.phone.display}
- Email: ${site.email}
- Telegram: ${site.telegram.handle} (${site.telegram.url})
- Instagram: ${site.instagram.handle} (${site.instagram.url})
- Форма заявки: ${url}/#contact

## Разделы сайта

- [Главная](${url}/): единственная страница сайта, все разделы — якоря на ней
- [Сборки из архива](${url}/#builds): примеры кастомных велосипедов мастерской
- [Конфигуратор](${url}/#configurator): три вопроса, чтобы получить первый вариант сетапа

## Optional

- [Карта сайта](${url}/sitemap.xml)
`;
}

export function seoPlugin(): Plugin {
  const url = resolveSiteUrl();
  const files: Record<string, { type: string; body: string }> = {
    'robots.txt': { type: 'text/plain; charset=utf-8', body: buildRobots(url) },
    'sitemap.xml': { type: 'application/xml; charset=utf-8', body: buildSitemap(url) },
    'llms.txt': { type: 'text/plain; charset=utf-8', body: buildLlms(url) },
  };

  return {
    name: 'velocraft-seo',
    applyToEnvironment: (environment) => environment.name === 'client',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!html.includes(HEAD_MARKER)) {
          throw new Error(`index.html должен содержать маркер ${HEAD_MARKER}`);
        }
        return html.replace(HEAD_MARKER, buildHead(url));
      },
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const name = (req.url ?? '').split('?')[0].replace(/^\//, '');
        const file = files[name];
        if (!file) return next();
        res.setHeader('Content-Type', file.type);
        res.end(file.body);
      });
    },
    generateBundle() {
      for (const [fileName, { body }] of Object.entries(files)) {
        this.emitFile({ type: 'asset', fileName, source: body });
      }
    },
  };
}
