import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDownRight,
  ArrowRight,
  Bike,
  Check,
  ChevronDown,
  CircleArrowOutUpRight,
  Clock3,
  Crosshair,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  Settings2,
  Sparkles,
  X,
  Wrench,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

import { site } from '../site.config';

const queryClient = new QueryClient();

const serviceStyles = [
  { icon: Wrench, accent: 'bg-[#e65646]' },
  { icon: Send, accent: 'bg-[#f4d94e]' },
  { icon: Settings2, accent: 'bg-[#4f7c70]' },
  { icon: Sparkles, accent: 'bg-[#242a3d]' },
];

const services = site.services.map((service, index) => ({
  number: String(index + 1).padStart(2, '0'),
  title: service.title,
  text: service.text,
  ...serviceStyles[index],
}));

const builds = [
  { name: 'RUSSIAN FIX', type: 'FIX / КРАСНЫЙ ХОД', spec: 'Сталь Columbus · 8,9 кг', color: '#e65646', year: '24', note: 'город без пауз' },
  { name: 'NIGHT SHIFT', type: 'GRAVEL / ТИХИЙ ШУМ', spec: 'Карбон · 10,2 кг', color: '#242a3d', year: '23', note: 'за линию света' },
  { name: 'YELLOW LINE', type: 'ROAD / БЫСТРЫЙ КОНТУР', spec: 'Алюминий · 8,1 кг', color: '#f4d94e', year: '24', note: 'срезает повороты' },
];

const steps = site.steps;

function Header({ onMenu }: { onMenu: () => void }) {
  const links = [['#services', 'Услуги'], ['#method', 'Подход'], ['#builds', 'Сборки'], ['#configurator', 'Конфигуратор']];
  return (
    <header className="absolute left-0 right-0 top-0 z-30 px-5 py-5 text-[#f6f0e5] md:px-10 md:py-7">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        <a href="#top" className="group flex items-center gap-3" data-testid="link-logo">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f6f0e5]/45 text-[#f4d94e] transition-transform group-hover:rotate-[-18deg]"><Bike size={21} strokeWidth={1.8} /></span>
          <span className="font-display text-xl font-semibold tracking-[-.06em]">VELOC<span className="text-[#e65646]">RAFT</span></span>
        </a>
        <nav aria-label="Основная навигация" className="hidden items-center gap-8 font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#f6f0e5]/75 lg:flex">
          {links.map(([href, label]) => <a key={href} href={href} className="transition-colors hover:text-[#f4d94e]" data-testid={`link-nav-${label}`}>{label}</a>)}
        </nav>
        <div className="hidden items-center gap-6 lg:flex">
          <a href={`tel:${site.phone.tel}`} className="font-mono-ui text-[10px] tracking-[.1em] text-[#f6f0e5]/70 hover:text-[#f4d94e]" data-testid="link-header-phone">{site.phone.display}</a>
          <a href="#contact" className="group flex items-center gap-2 rounded-full border border-[#f6f0e5]/35 px-4 py-2 font-mono-ui text-[10px] uppercase tracking-[.14em] transition-colors hover:border-[#f4d94e] hover:text-[#f4d94e]" data-testid="link-header-contact">Обсудить проект <ArrowDownRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" /></a>
        </div>
        <button type="button" aria-label="Открыть меню" aria-haspopup="dialog" onClick={onMenu} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f6f0e5]/30 lg:hidden" data-testid="button-mobile-menu"><Menu size={19} /></button>
      </div>
    </header>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = previousOverflow; };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label="Меню" className="fixed inset-0 z-50 flex flex-col bg-[#242a3d] p-6 text-[#f6f0e5] lg:hidden">
      <div className="flex items-center justify-between">
        <span className="font-display text-xl font-semibold tracking-[-.06em]">VELOC<span className="text-[#e65646]">RAFT</span></span>
        <button type="button" aria-label="Закрыть меню" autoFocus onClick={onClose} className="rounded-full border border-[#f6f0e5]/30 p-2" data-testid="button-mobile-close"><X size={18} /></button>
      </div>
      <nav aria-label="Мобильная навигация" className="mt-24 flex flex-col gap-7 font-display text-4xl" onClick={onClose}>
        <a href="#services" data-testid="link-mobile-services">Услуги</a>
        <a href="#method" data-testid="link-mobile-method">Подход</a>
        <a href="#builds" data-testid="link-mobile-builds">Сборки</a>
        <a href="#configurator" data-testid="link-mobile-configurator">Конфигуратор</a>
        <a href="#contact" className="text-[#f4d94e]" data-testid="link-mobile-contact">Связаться</a>
      </nav>
      <p className="mt-auto font-mono-ui text-xs uppercase tracking-[.15em] text-[#f6f0e5]/50">Москва · работа по всей России</p>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative flex min-h-[760px] items-end overflow-hidden bg-[#242a3d] pb-12 pt-32 text-[#f6f0e5] md:min-h-[850px] md:pb-20">
      <picture>
        <source srcSet={`${import.meta.env.BASE_URL}velocraft-bike.webp`} type="image/webp" />
        <img src={`${import.meta.env.BASE_URL}velocraft-bike.jpg`} alt="Кастомный шоссейный велосипед в мастерской VeloCraft" width={1024} height={1024} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center max-sm:object-[64%_center]" />
      </picture>
      <div aria-hidden="true" className="hero-shade absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_33%,rgba(230,86,70,.24),transparent_26%),linear-gradient(180deg,rgba(36,42,61,.2),rgba(36,42,61,.85))]" />
      <div className="relative mx-auto grid w-full max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="reveal mb-6 flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.22em] text-[#f4d94e]"><span className="h-px w-8 bg-[#f4d94e]" />веломастерская · москва · 2017</p>
          <h1 id="hero-title" className="reveal reveal-delay-1 max-w-[960px] font-display text-[clamp(4.2rem,12vw,10.5rem)] font-semibold leading-[.82] tracking-[-.09em]">ЕХАТЬ<br /><span className="stroke-text">СВОИМ</span><br /><span className="text-[#e65646]">ХОДОМ.</span><span className="sr-only"> — VeloCraft: ремонт и кастомные велосипеды в Москве</span></h1>
          <p className="reveal reveal-delay-2 mt-9 max-w-md text-base leading-relaxed text-[#f6f0e5]/70 md:text-lg">Веломастерская в Москве: ремонт, подбор компонентов и кастомные велосипеды, собранные под то, как вы действительно катаетесь.</p>
          <div className="reveal reveal-delay-3 mt-9 flex flex-wrap gap-3">
            <a href="#configurator" className="group inline-flex items-center gap-3 bg-[#e65646] px-5 py-3 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#f6f0e5] transition-colors hover:bg-[#f4d94e] hover:text-[#242a3d]" data-testid="link-hero-configurator">Собрать свой велосипед <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></a>
            <a href="#services" className="inline-flex items-center gap-2 border border-[#f6f0e5]/35 px-5 py-3 font-mono-ui text-[10px] uppercase tracking-[.14em] transition-colors hover:border-[#f4d94e] hover:text-[#f4d94e]" data-testid="link-hero-services">Что мы делаем</a>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="absolute -left-12 -top-24 h-32 w-32 rounded-full border border-[#f6f0e5]/25" />
          <div className="relative border-l border-[#f6f0e5]/25 pl-7">
            <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#f6f0e5]/45">Из мастерской в работу</p>
            <p className="mt-3 font-display text-3xl leading-none">Техника<br />с характером.</p>
            <p className="mt-5 max-w-[220px] text-xs leading-relaxed text-[#f6f0e5]/55">Не продаём велосипед из каталога. Собираем инструмент, который хочется брать каждый день.</p>
          </div>
        </div>
      </div>
      <a href="#services" className="absolute bottom-7 right-24 hidden items-center gap-3 font-mono-ui text-[9px] uppercase tracking-[.15em] text-[#f6f0e5]/55 md:flex" data-testid="link-scroll-services"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f6f0e5]/30"><ChevronDown size={15} /></span> листать</a>
    </section>
  );
}

function Ticker() {
  return <div aria-hidden="true" className="overflow-hidden border-b border-[#242a3d]/15 bg-[#f4d94e] py-3 text-[#242a3d]"><div className="marquee flex w-max whitespace-nowrap font-mono-ui text-[10px] uppercase tracking-[.2em]"><span className="mx-6">точная механика · честный разговор · свой ход · </span><span className="mx-6">точная механика · честный разговор · свой ход · </span><span className="mx-6">точная механика · честный разговор · свой ход · </span><span className="mx-6">точная механика · честный разговор · свой ход · </span></div></div>;
}

function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-[#f6f0e5] px-5 py-24 text-[#242a3d] md:px-10 md:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div><p className="section-marker font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#e65646]">Чем занимаемся</p><h2 id="services-title" className="mt-6 max-w-lg font-display text-5xl font-semibold leading-[.9] tracking-[-.07em] md:text-7xl">Один гараж.<br /><span className="text-[#e65646]">Четыре</span> сценария.</h2></div>
          <p className="max-w-md text-base leading-relaxed text-[#242a3d]/65 lg:justify-self-end">От срочной настройки перед поездкой до велосипеда, который существует в единственном экземпляре. Работаем с тем, что уже есть, и строим с нуля.</p>
        </div>
        <div className="grid border-t border-[#242a3d]/20 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => { const Icon = service.icon; return <article key={service.number} className="group relative border-b border-[#242a3d]/20 py-8 md:border-r md:px-6 md:first:pl-0 lg:border-b-0 lg:px-7 lg:first:pl-0 lg:last:border-r-0">
            <div className="flex items-start justify-between"><span className="font-mono-ui text-[11px] text-[#242a3d]/45">{service.number}</span><span className={`flex h-10 w-10 items-center justify-center rounded-full ${service.accent} text-[#242a3d] transition-transform group-hover:rotate-12`}><Icon size={18} strokeWidth={1.7} /></span></div>
            <h3 className="mt-14 font-display text-2xl font-semibold tracking-[-.04em]">{service.title}</h3><p className="mt-4 text-sm leading-relaxed text-[#242a3d]/60">{service.text}</p><a href="#contact" className="mt-8 inline-flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#e65646]" data-testid={`link-service-${service.number}`}>Обсудить <ArrowRight size={13} /></a>
          </article>; })}
        </div>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section id="method" aria-labelledby="method-title" className="bg-[#242a3d] px-5 py-24 text-[#f6f0e5] md:px-10 md:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr]">
          <div><p className="section-marker font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#f4d94e]">01 — Подход</p><h2 id="method-title" className="mt-7 font-display text-6xl font-semibold leading-[.86] tracking-[-.08em] md:text-[7.2rem]">Точно<br /><span className="text-[#e65646]">в вас.</span></h2><p className="mt-8 max-w-sm text-base leading-relaxed text-[#f6f0e5]/60">Хороший велосипед не должен быть самым дорогим. Он должен быть самым понятным: почему именно такой руль, эта резина и такой угол.</p><div className="mt-10 flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f6f0e5]/25 text-[#f4d94e]"><Crosshair size={20} /></span><span className="font-mono-ui text-[10px] uppercase leading-relaxed tracking-[.12em] text-[#f6f0e5]/55">никаких деталей<br />ради деталей</span></div></div>
          <div className="grid gap-0 self-end border-t border-[#f6f0e5]/20">{steps.map(([num, title, text]) => <div key={num} className="group grid grid-cols-[50px_1fr] gap-4 border-b border-[#f6f0e5]/20 py-6 md:grid-cols-[75px_150px_1fr] md:gap-5"><span className="font-mono-ui text-xs text-[#e65646]">{num}</span><h3 className="font-display text-2xl leading-none transition-colors group-hover:text-[#f4d94e]">{title}</h3><p className="col-start-2 text-sm leading-relaxed text-[#f6f0e5]/52 md:col-start-3">{text}</p></div>)}</div>
        </div>
      </div>
    </section>
  );
}

function BuildCard({ build, index }: { build: typeof builds[number]; index: number }) {
  return <article className={`group relative overflow-hidden bg-[#ece5d8] ${index === 1 ? 'md:mt-16' : index === 2 ? 'md:mt-5' : ''}`} data-testid={`card-build-${index}`}>
    <div aria-hidden="true" className="relative aspect-[.9] overflow-hidden bg-[#242a3d]"><div className="absolute inset-[16%] rounded-full border-[3px] border-[#f6f0e5]/20 transition-transform duration-700 group-hover:scale-110" /><div className="absolute inset-[25%] rounded-full border border-[#f6f0e5]/25 transition-transform duration-700 group-hover:scale-110" /><div className="absolute left-[23%] top-[30%] h-[42%] w-[52%] rotate-[-12deg] border-[5px] transition-transform duration-700 group-hover:rotate-[-6deg] group-hover:scale-105" style={{ borderColor: build.color, borderRadius: '47% 53% 38% 62% / 38% 44% 56% 62%' }} /><div className="absolute left-[48%] top-[21%] h-[54%] w-[11%] rotate-[-27deg] border-[5px]" style={{ borderColor: build.color }} /><div className="absolute bottom-[24%] left-[42%] h-10 w-10 rounded-full bg-[#f6f0e5]/20" /><span className="absolute right-6 top-6 font-mono-ui text-[10px] tracking-[.2em] text-[#f6f0e5]/55">VC / {build.year}</span><span className="absolute bottom-6 left-6 font-display text-6xl font-semibold italic tracking-[-.08em]" style={{ color: build.color }}>{build.note}</span></div>
    <div className="flex items-end justify-between p-5"><div><p className="font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#242a3d]/45">{build.type}</p><h3 className="mt-2 font-display text-2xl font-semibold tracking-[-.05em]">{build.name}</h3><p className="mt-2 text-xs text-[#242a3d]/55">{build.spec}</p></div><a href="#contact" aria-label={`Обсудить сборку ${build.name}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#242a3d]/25 transition-colors hover:bg-[#e65646] hover:text-[#f6f0e5]" data-testid={`button-build-${index}`}><ArrowUpRightIcon /></a></div>
  </article>;
}

function ArrowUpRightIcon() { return <CircleArrowOutUpRight size={17} strokeWidth={1.5} />; }

function Builds() {
  return <section id="builds" aria-labelledby="builds-title" className="bg-[#f6f0e5] px-5 py-24 text-[#242a3d] md:px-10 md:py-36"><div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p className="section-marker font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#e65646]">Из архива мастерской</p><h2 id="builds-title" className="mt-6 font-display text-6xl font-semibold leading-[.86] tracking-[-.08em] md:text-[7rem]">Собрано<br /><span className="text-[#e65646]">вручную.</span></h2></div><a href="#configurator" className="group flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.15em] hover:text-[#e65646]" data-testid="link-builds-configurator">Хочу свою сборку <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#242a3d]/25 transition-transform group-hover:translate-x-1"><ArrowRight size={14} /></span></a></div><div className="mt-16 grid gap-5 md:grid-cols-3">{builds.map((build, index) => <BuildCard build={build} index={index} key={build.name} />)}</div></div></section>;
}

function Configurator() {
  const [style, setStyle] = useState('Город');
  const [ride, setRide] = useState('Каждый день');
  const [budget, setBudget] = useState('150–250 тыс.');
  const [sent, setSent] = useState(false);
  const sendConfig = () => {
    const subject = encodeURIComponent('Конфигуратор VeloCraft: запрос на первый сетап');
    const body = encodeURIComponent(`Для чего: ${ride}\nХарактер: ${style}\nБюджет: ${budget}\n\nМой контакт (телефон или Telegram): `);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };
  const options = [
    ['Для чего', ['Каждый день', 'Длинные выезды', 'Гравий и лес', 'Городской спринт'], ride, setRide],
    ['Характер', ['Город', 'Спокойный', 'Быстрый', 'Без компромиссов'], style, setStyle],
    ['Бюджет', ['до 150 тыс.', '150–250 тыс.', '250–400 тыс.', 'от 400 тыс.'], budget, setBudget],
  ] as const;
  return <section id="configurator" aria-labelledby="configurator-title" className="bg-[#e65646] px-5 py-24 text-[#242a3d] md:px-10 md:py-32"><div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[.8fr_1.2fr]"><div><p className="section-marker font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#242a3d]/65">02 — Конфигуратор</p><h2 id="configurator-title" className="mt-7 max-w-lg font-display text-6xl font-semibold leading-[.84] tracking-[-.08em] md:text-[7.2rem]">Соберём<br /><span className="text-[#f6f0e5]">идею.</span></h2><p className="mt-8 max-w-sm text-base leading-relaxed text-[#242a3d]/70">Ответьте на три вопроса — мы пришлём первый вариант сетапа в течение рабочего дня.</p><div className="mt-12 flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.14em]"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#242a3d] text-[#f4d94e]"><Clock3 size={15} /></span> 10 минут до первого эскиза</div></div><div className="bg-[#f6f0e5] p-6 md:p-10"><div className="flex items-center justify-between border-b border-[#242a3d]/15 pb-5"><span className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#242a3d]/50">Ваши вводные</span><span className="font-mono-ui text-[10px] text-[#e65646]">шаг 01 / 03</span></div>{options.map(([label, values, current, setter]) => <fieldset key={label} className="mt-8"><legend className="font-display text-2xl font-semibold tracking-[-.05em]">{label}</legend><div className="mt-4 flex flex-wrap gap-2">{values.map((value) => <button key={value} type="button" aria-pressed={current === value} onClick={() => setter(value)} className={`rounded-full border px-4 py-2 font-mono-ui text-[10px] uppercase tracking-[.1em] transition-colors ${current === value ? 'border-[#242a3d] bg-[#242a3d] text-[#f6f0e5]' : 'border-[#242a3d]/20 text-[#242a3d]/65 hover:border-[#e65646]'}`} data-testid={`button-option-${value}`}>{value}</button>)}</div></fieldset>)}<div className="mt-10 border-t border-[#242a3d]/15 pt-6">{sent ? <div className="flex items-center gap-3 bg-[#f4d94e] p-4 font-mono-ui text-[11px] uppercase tracking-[.08em]" role="status" data-testid="status-configurator-success"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#242a3d] text-[#f4d94e]"><Check size={16} /></span> Открыли письмо с вашим выбором. Допишите контакт и отправьте — ответим в рабочее время.</div> : <button type="button" onClick={sendConfig} className="group flex w-full items-center justify-between bg-[#242a3d] px-5 py-4 text-left font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#f6f0e5] transition-colors hover:bg-[#f4d94e] hover:text-[#242a3d]" data-testid="button-configurator-submit">Показать мой первый сетап <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></button>}</div><p className="mt-4 font-mono-ui text-[9px] leading-relaxed text-[#242a3d]/45">Вы выбрали: {ride} · {style} · {budget}</p></div></div></section>;
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '');
    const contact = String(form.get('contact') ?? '');
    const message = String(form.get('message') ?? '');
    const subject = encodeURIComponent(`Запрос в VeloCraft от ${name}`);
    const body = encodeURIComponent(`Имя: ${name}\nКонтакт: ${contact}\n\n${message}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };
  return <section id="contact" aria-labelledby="contact-title" className="bg-[#f6f0e5] px-5 py-24 text-[#242a3d] md:px-10 md:py-36"><div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[1fr_.8fr]"><div><p className="section-marker font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#e65646]">03 — На связи</p><h2 id="contact-title" className="mt-7 max-w-2xl font-display text-6xl font-semibold leading-[.84] tracking-[-.08em] md:text-[8rem]">Расскажите,<br /><span className="text-[#e65646]">куда едем.</span></h2><p className="mt-9 max-w-md text-base leading-relaxed text-[#242a3d]/60">Заполните форму или напишите напрямую. Если вопрос срочный — звоните, мы почти всегда рядом с инструментами.</p><div className="mt-10 grid max-w-md grid-cols-2 gap-3"><a href={site.telegram.url} target="_blank" rel="noopener noreferrer me" className="group flex items-center gap-3 border border-[#242a3d]/20 p-4 transition-colors hover:border-[#e65646]" data-testid="link-contact-telegram"><MessageCircle size={18} className="text-[#e65646]" /><span><b className="block font-display text-sm">Telegram</b><small className="font-mono-ui text-[9px] uppercase text-[#242a3d]/45">бот / {site.telegram.handle}</small></span><ArrowRight size={13} className="ml-auto transition-transform group-hover:translate-x-1" /></a><a href={site.instagram.url} target="_blank" rel="noopener noreferrer me" className="group flex items-center gap-3 border border-[#242a3d]/20 p-4 transition-colors hover:border-[#e65646]" data-testid="link-contact-instagram"><Instagram size={18} className="text-[#e65646]" /><span><b className="block font-display text-sm">Instagram</b><small className="font-mono-ui text-[9px] uppercase text-[#242a3d]/45">{site.instagram.handle}</small></span><ArrowRight size={13} className="ml-auto transition-transform group-hover:translate-x-1" /></a></div></div><div className="border-t border-[#242a3d]/20 pt-6 lg:pt-0">{submitted ? <div className="flex min-h-[380px] flex-col justify-center bg-[#242a3d] p-8 text-[#f6f0e5] md:p-10" data-testid="status-contact-success"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f4d94e] text-[#242a3d]"><Check size={25} /></span><h3 className="mt-8 font-display text-4xl font-semibold leading-none tracking-[-.06em]">Заявка<br /><span className="text-[#f4d94e]">уехала.</span></h3><p className="mt-5 max-w-xs text-sm leading-relaxed text-[#f6f0e5]/60">Спасибо. Мы свяжемся с вами в рабочее время и начнём с самого интересного — разговора о маршруте.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-8 self-start font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#f6f0e5]/60 underline underline-offset-4 hover:text-[#f4d94e]" data-testid="button-contact-reset">Отправить ещё</button></div> : <form onSubmit={handleSubmit} className="space-y-7" data-testid="form-contact"><label className="block"><span className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#242a3d]/50">Имя</span><input required type="text" name="name" autoComplete="name" placeholder="Как к вам обращаться" className="mt-2 w-full border-0 border-b border-[#242a3d]/20 bg-transparent px-0 py-3 font-display text-xl outline-none placeholder:text-[#242a3d]/25 focus:border-[#e65646]" data-testid="input-contact-name" /></label><label className="block"><span className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#242a3d]/50">Контакт</span><input required type="text" name="contact" placeholder="Телефон или Telegram" className="mt-2 w-full border-0 border-b border-[#242a3d]/20 bg-transparent px-0 py-3 font-display text-xl outline-none placeholder:text-[#242a3d]/25 focus:border-[#e65646]" data-testid="input-contact-value" /></label><label className="block"><span className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#242a3d]/50">Что собираем</span><textarea name="message" rows={2} placeholder="Есть велосипед, идея или просто вопрос" className="mt-2 w-full resize-none border-0 border-b border-[#242a3d]/20 bg-transparent px-0 py-3 font-display text-xl outline-none placeholder:text-[#242a3d]/25 focus:border-[#e65646]" data-testid="input-contact-message" /></label><button type="submit" className="group flex items-center gap-3 bg-[#e65646] px-6 py-4 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#f6f0e5] transition-colors hover:bg-[#242a3d]" data-testid="button-contact-submit">Отправить запрос <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button><p className="font-mono-ui text-[9px] leading-relaxed text-[#242a3d]/40">Нажимая кнопку, вы соглашаетесь на обработку заявки. Никаких рассылок.</p></form>}</div></div></section>;
}

function Footer() {
  return <footer className="bg-[#242a3d] px-5 pb-8 pt-16 text-[#f6f0e5] md:px-10 md:pt-24"><div className="mx-auto max-w-[1440px]"><div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]"><div><a href="#top" className="font-display text-4xl font-semibold tracking-[-.08em]" data-testid="link-footer-logo">VELOC<span className="text-[#e65646]">RAFT</span></a><p className="mt-5 max-w-xs text-sm leading-relaxed text-[#f6f0e5]/50">Веломастерская для тех, кто слышит разницу между «нормально» и «вот теперь да».</p></div><div><p className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#f4d94e]">В мастерской</p><address className="mt-5 flex items-start gap-2 text-sm not-italic text-[#f6f0e5]/65"><MapPin size={15} className="mt-0.5 shrink-0 text-[#e65646]" aria-hidden="true" /><span>{site.address.city}, {site.address.street}<br />{site.address.hoursText}</span></address></div><div><p className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#f4d94e]">Прямой контакт</p><div className="mt-5 space-y-3 text-sm"><a href={`tel:${site.phone.tel}`} className="flex items-center gap-2 text-[#f6f0e5]/65 hover:text-[#f4d94e]" data-testid="link-footer-phone"><Phone size={14} className="text-[#e65646]" aria-hidden="true" /> {site.phone.display}</a><a href={`mailto:${site.email}`} className="flex items-center gap-2 text-[#f6f0e5]/65 hover:text-[#f4d94e]" data-testid="link-footer-email"><Mail size={14} className="text-[#e65646]" aria-hidden="true" /> {site.email}</a></div></div></div><div className="mt-20 flex flex-col justify-between gap-4 border-t border-[#f6f0e5]/15 pt-5 font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#f6f0e5]/35 md:flex-row"><span>© {site.foundingYear}–{__BUILD_YEAR__} VeloCraft workshop</span><span>сделано для движения</span><a href="#top" className="hover:text-[#f4d94e]" data-testid="link-footer-top">наверх ↑</a></div></div></footer>;
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <div className="grain min-h-[100dvh] overflow-hidden">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-[#f4d94e] focus:px-4 focus:py-2 focus:text-[#242a3d]">Перейти к содержимому</a>
      <Header onMenu={() => setMenuOpen(true)} />
      {menuOpen && <MobileMenu onClose={closeMenu} />}
      <main id="content">
        <Hero /><Ticker /><Services /><Method /><Builds /><Configurator /><Contact />
      </main>
      <Footer />
      <a href={site.telegram.url} target="_blank" rel="noopener noreferrer" className="fixed bottom-5 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#e65646] text-[#f6f0e5] shadow-xl transition-transform hover:scale-105 md:bottom-8 md:right-8" aria-label="Написать в Telegram" data-testid="button-floating-telegram"><MessageCircle size={20} aria-hidden="true" /></a>
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App({ ssrPath }: { ssrPath?: string }) {
  // Одиночный HTML (file://): без роутера, чтобы работали якоря #services и т.п.
  if (__STANDALONE__) return <QueryClientProvider client={queryClient}><TooltipProvider><Home /></TooltipProvider></QueryClientProvider>;
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')} ssrPath={ssrPath}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;