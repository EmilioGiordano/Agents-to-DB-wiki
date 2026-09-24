// Agrega a cada bloque de código una barra con el lenguaje y un botón de copia,
// y resalta los datos que el lector debe completar (‹ASÍ›).

const LANG_NAMES: Record<string, string> = {
  sql: 'SQL',
  sh: 'Terminal',
  bash: 'Terminal',
  shell: 'Terminal',
  powershell: 'PowerShell',
  json: 'JSON',
  toml: 'TOML',
  ini: 'Configuración',
  text: 'Texto',
  plaintext: 'Texto',
};

const PLACEHOLDER = /‹[^›]+›/g;

function markPlaceholders(el: Element) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) {
    const n = walker.currentNode as Text;
    if (PLACEHOLDER.test(n.data)) nodes.push(n);
    PLACEHOLDER.lastIndex = 0;
  }
  for (const node of nodes) {
    const frag = document.createDocumentFragment();
    let last = 0;
    node.data.replace(PLACEHOLDER, (m, i: number) => {
      frag.append(node.data.slice(last, i));
      const span = document.createElement('span');
      span.className = 'ph';
      span.textContent = m;
      frag.append(span);
      last = i + m.length;
      return m;
    });
    frag.append(node.data.slice(last));
    node.replaceWith(frag);
  }
}

async function copyText(btn: HTMLButtonElement, text: string) {
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = 'Copiado';
    btn.dataset.done = '';
  } catch {
    btn.textContent = 'No se pudo copiar';
  }
  setTimeout(() => {
    btn.textContent = 'Copiar';
    delete btn.dataset.done;
  }, 1800);
}

function makeCopyButton(getText: () => string) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'copy';
  btn.textContent = 'Copiar';
  btn.addEventListener('click', () => copyText(btn, getText()));
  return btn;
}

export function enhanceCode() {
  document.querySelectorAll<HTMLPreElement>('pre.astro-code').forEach((pre) => {
    if (pre.parentElement?.classList.contains('codeblock')) return;
    const lang = pre.dataset.language || 'text';
    const title = pre.closest('[data-code-title]')?.getAttribute('data-code-title');

    const wrap = document.createElement('div');
    wrap.className = 'codeblock';
    const bar = document.createElement('div');
    bar.className = 'codeblock__bar';
    const label = document.createElement('span');
    label.textContent = title || LANG_NAMES[lang] || lang.toUpperCase();
    bar.append(label, makeCopyButton(() => pre.innerText.replace(/\n$/, '')));

    pre.replaceWith(wrap);
    wrap.append(bar, pre);
    markPlaceholders(pre);
  });

  document.querySelectorAll<HTMLElement>('.prompt').forEach((p) => {
    const body = p.querySelector<HTMLElement>('.prompt__body');
    const bar = p.querySelector('.prompt__bar');
    if (!body || !bar || bar.querySelector('.copy')) return;
    bar.append(makeCopyButton(() => body.innerText.trim()));
    markPlaceholders(body);
  });
}
