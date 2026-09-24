// Antepone la base del sitio (configurable en astro.config.mjs) a una ruta
// interna, para que los enlaces funcionen también si se publica en una subcarpeta.
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
