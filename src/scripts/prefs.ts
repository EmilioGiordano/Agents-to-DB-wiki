// Preferencias del lector: motor, cliente, tema y color de acento.
// Se guardan en localStorage solo como comodidad; el sitio funciona sin él.

const root = document.documentElement;

function save(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* almacenamiento no disponible: se ignora */
  }
}

function setEngine(engine: string) {
  root.dataset.engine = engine;
  save('guia.engine', engine);
  document.querySelectorAll<HTMLButtonElement>('[data-set-engine]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.setEngine === engine));
  });
}

function setClient(client: string) {
  root.dataset.client = client;
  save('guia.client', client);
  const sel = document.getElementById('sel-client') as HTMLSelectElement | null;
  if (sel) sel.value = client;
  document.querySelectorAll<HTMLButtonElement>('[data-set-client]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.setClient === client));
  });
}

const THEMES = ['sistema', 'claro', 'oscuro'] as const;
const THEME_ATTR: Record<string, string | null> = { sistema: null, claro: 'light', oscuro: 'dark' };

function currentTheme(): (typeof THEMES)[number] {
  if (root.dataset.theme === 'light') return 'claro';
  if (root.dataset.theme === 'dark') return 'oscuro';
  return 'sistema';
}

function setTheme(name: (typeof THEMES)[number]) {
  const attr = THEME_ATTR[name];
  if (attr) root.dataset.theme = attr;
  else delete root.dataset.theme;
  save('guia.theme', attr);
  const btn = document.getElementById('btn-theme');
  if (btn) btn.textContent = `Tema: ${name}`;
}

export function setAccent(accent: 'azul' | 'bordo') {
  if (accent === 'bordo') root.dataset.accent = 'bordo';
  else delete root.dataset.accent;
  save('guia.accent', accent === 'bordo' ? 'bordo' : null);
  document.querySelectorAll<HTMLButtonElement>('[data-set-accent]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.setAccent === accent));
  });
}

export function initPrefs() {
  setEngine(root.dataset.engine || 'postgresql');
  setClient(root.dataset.client || 'claude-code');
  setTheme(currentTheme());
  setAccent(root.dataset.accent === 'bordo' ? 'bordo' : 'azul');

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const eng = t.closest<HTMLElement>('[data-set-engine]');
    if (eng?.dataset.setEngine) setEngine(eng.dataset.setEngine);
    const cli = t.closest<HTMLElement>('[data-set-client]');
    if (cli?.dataset.setClient) setClient(cli.dataset.setClient);
    const acc = t.closest<HTMLElement>('[data-set-accent]');
    if (acc?.dataset.setAccent) setAccent(acc.dataset.setAccent as 'azul' | 'bordo');
  });

  document.getElementById('sel-client')?.addEventListener('change', (e) => {
    setClient((e.target as HTMLSelectElement).value);
  });

  document.getElementById('btn-theme')?.addEventListener('click', () => {
    const i = THEMES.indexOf(currentTheme());
    setTheme(THEMES[(i + 1) % THEMES.length]);
  });

  // En pantallas angostas el índice empieza plegado.
  const nav = document.querySelector<HTMLDetailsElement>('.nav details');
  if (nav && window.matchMedia('(max-width: 900px)').matches) nav.open = false;
}
