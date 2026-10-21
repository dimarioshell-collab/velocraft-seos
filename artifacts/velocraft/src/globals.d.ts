/** Год сборки; подставляется Vite (define), одинаков на сервере и клиенте — без hydration mismatch. */
declare const __BUILD_YEAR__: number;

/** true при `vite build --mode standalone` (одиночный HTML без роутера). */
declare const __STANDALONE__: boolean;
