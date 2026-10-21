import { useEffect } from 'react';

/** 404: сервер отдаёт index.html на любой путь, поэтому закрываем страницу от индексации через noindex. */
export default function NotFound() {
  useEffect(() => {
    const previousTitle = document.title;
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const created = !meta;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    const previousContent = meta.content;
    meta.content = 'noindex, nofollow';
    document.title = 'Страница не найдена — VeloCraft';
    return () => {
      document.title = previousTitle;
      if (created) meta.remove();
      else meta.content = previousContent;
    };
  }, []);

  return (
    <main className="flex min-h-[100dvh] w-full items-center justify-center bg-[#242a3d] px-5 text-[#f6f0e5]">
      <div className="max-w-md">
        <p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#f4d94e]">Ошибка 404</p>
        <h1 className="mt-5 font-display text-6xl font-semibold leading-[.9] tracking-[-.07em]">
          Не туда <span className="text-[#e65646]">свернули.</span>
        </h1>
        <p className="mt-6 text-base leading-relaxed text-[#f6f0e5]/70">
          Такой страницы нет. Вернёмся на главную — там всё про ремонт и кастомные велосипеды.
        </p>
        <a
          href={import.meta.env.BASE_URL}
          className="mt-8 inline-flex bg-[#e65646] px-5 py-3 font-mono-ui text-[10px] uppercase tracking-[.14em] transition-colors hover:bg-[#f4d94e] hover:text-[#242a3d]"
        >
          На главную
        </a>
      </div>
    </main>
  );
}
