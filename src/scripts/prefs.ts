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
  document.querySelectorAll<HTMLButtonElement>('[data-set-client]').forEach((b) => {
    const activo = String(b.dataset.setClient === client);
    if (b.getAttribute('role') === 'menuitemradio') {
      b.setAttribute('aria-checked', activo);
      if (activo === 'true') {
        const nombre = document.getElementById('btn-client-name');
        if (nombre) nombre.textContent = b.dataset.nombre ?? '';
      }
    } else {
      b.setAttribute('aria-pressed', activo);
    }
  });
}

type Tema = 'sistema' | 'claro' | 'oscuro';
const TEMA_ATTR: Record<Tema, string | null> = { sistema: null, claro: 'light', oscuro: 'dark' };
const TEMA_NOMBRE: Record<Tema, string> = { sistema: 'Sistema', claro: 'Claro', oscuro: 'Oscuro' };

function currentTheme(): Tema {
  if (root.dataset.theme === 'light') return 'claro';
  if (root.dataset.theme === 'dark') return 'oscuro';
  return 'sistema';
}

function setTheme(name: Tema) {
  const attr = TEMA_ATTR[name];
  if (attr) root.dataset.theme = attr;
  else delete root.dataset.theme;
  save('guia.theme', attr);
  const btn = document.getElementById('btn-theme');
  if (btn) {
    btn.dataset.pref = name;
    btn.setAttribute('aria-label', `Tema: ${TEMA_NOMBRE[name]}`);
  }
  document.querySelectorAll<HTMLElement>('[data-set-theme]').forEach((b) => {
    b.setAttribute('aria-checked', String(b.dataset.setTheme === name));
  });
}

// Menú desplegable accesible: se abre con el botón, se recorre con las flechas
// y se cierra con Esc, con Tab o al hacer clic fuera de él.
function initMenu(triggerId: string, listId: string, alElegir?: (item: HTMLButtonElement) => void) {
  const trigger = document.getElementById(triggerId);
  const list = document.getElementById(listId);
  if (!trigger || !list) return;
  const items = [...list.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')];
  const contenedor = trigger.closest('.menu');

  const abrir = () => {
    list.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    (items.find((b) => b.getAttribute('aria-checked') === 'true') ?? items[0]).focus();
  };
  const cerrar = (devolverFoco = false) => {
    list.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (devolverFoco) trigger.focus();
  };

  trigger.addEventListener('click', () => (list.hidden ? abrir() : cerrar()));
  items.forEach((b) =>
    b.addEventListener('click', () => {
      alElegir?.(b);
      cerrar(true);
    }),
  );
  list.addEventListener('keydown', (e) => {
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') items[(i + 1) % items.length].focus();
    else if (e.key === 'ArrowUp') items[(i - 1 + items.length) % items.length].focus();
    else if (e.key === 'Escape') cerrar(true);
    else if (e.key === 'Tab') cerrar();
    else return;
    e.preventDefault();
  });
  document.addEventListener('click', (e) => {
    if (!list.hidden && !contenedor?.contains(e.target as Node)) cerrar();
  });
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
  initMenu('btn-theme', 'theme-list', (b) => setTheme(b.dataset.setTheme as Tema));
  initMenu('btn-client', 'client-list');
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

  // En pantallas angostas el índice empieza plegado.
  const nav = document.querySelector<HTMLDetailsElement>('.nav details');
  if (nav && window.matchMedia('(max-width: 900px)').matches) nav.open = false;
}
