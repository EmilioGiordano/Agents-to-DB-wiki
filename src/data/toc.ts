// Índice de la guía. Los capítulos con `listo: true` se publican como borrador,
// con el contenido previsto, hasta que se redacten.
export interface Capitulo {
  num: string;
  slug: string;
  titulo: string;
  listo: boolean;
  previsto?: string[];
}

export const capitulos: Capitulo[] = [
  {
    num: '1',
    slug: '01-introduccion',
    titulo: 'Por qué conectar un agente a una base de datos',
    listo: true,
    previsto: [
      'El trabajo habitual con una base de datos y dónde se pierde el tiempo.',
      'Un mismo problema resuelto de dos maneras: consultas escritas a mano y consultas pedidas en lenguaje natural y verificadas.',
      'Qué cambia y qué no cambia: el agente no reemplaza el conocimiento de SQL, lo exige para poder verificar.',
      'Alcance de la guía y conocimientos previos.',
    ],
  },
  {
    num: '2',
    slug: '02-conceptos',
    titulo: 'Conceptos: modelos, agentes y MCP',
    listo: true,
    previsto: [
      'Modelo de lenguaje, asistente de chat y agente: diferencias prácticas.',
      'Qué es el Model Context Protocol (MCP) y qué problema resuelve.',
      'Figura: recorrido de un pedido entre el usuario, el agente, el servidor MCP y la base de datos (versión animada).',
      'Bases locales y bases en la nube (Neon, Supabase, InsForge).',
      'Qué permiten los asistentes de chat (Claude, ChatGPT) frente a los agentes.',
    ],
  },
  { num: '3', slug: '03-seguridad', titulo: 'Seguridad y acceso', listo: true },
  {
    num: '4',
    slug: '04-conexion',
    titulo: 'Conexión paso a paso',
    listo: true,
    previsto: [
      'Requisitos previos: base de ejemplo cargada y usuario de solo lectura creado.',
      'Configuración por cliente (Claude Code, Codex, OpenCode, Cursor, Claude, ChatGPT) y por motor, según el selector de la barra superior.',
      'Dos caminos para cada caso: configuración manual y prompt para que el agente la realice.',
      'Bases en la nube: servidores MCP de Neon, Supabase e InsForge.',
      'Verificación de la conexión y problemas frecuentes.',
    ],
  },
  {
    num: '5',
    slug: '05-sin-mcp',
    titulo: 'Uso sin MCP: el agente y la terminal',
    listo: true,
    previsto: [
      'El agente como usuario de psql y mysql.',
      'Credenciales sin pedir la contraseña en cada consulta: archivo pgpass y mysql_config_editor.',
      'Ventajas y desventajas frente a un servidor MCP.',
    ],
  },
  {
    num: '6',
    slug: '06-casos-de-uso',
    titulo: 'Casos de uso',
    listo: true,
    previsto: [
      'Validación de reglas de negocio explícitas (restricciones, disparadores) e implícitas (Tu Cine: la butaca de una entrada debe pertenecer a la sala de la función).',
      'Consultas en lenguaje natural y cruce de información entre tablas y entre bases.',
      'Revisión del modelo (Gimnasio: claves primarias faltantes, claves foráneas que apuntan a la tabla equivocada, restricciones ausentes).',
      'Rendimiento y mantenimiento: EXPLAIN ANALYZE antes y después de un índice, pg_size_pretty, VACUUM y ANALYZE.',
      'Columnas calculadas y consistencia (Heladería: total del pedido frente a sus renglones).',
      'Apoyo al desarrollo: cambios de esquema y migraciones.',
    ],
  },
  {
    num: '7',
    slug: '07-limites',
    titulo: 'Límites y riesgos',
    listo: true,
    previsto: [
      'Errores con apariencia de certeza: SQL incorrecto que se ejecuta sin fallar.',
      'Inyección de instrucciones a través de los datos.',
      'Privacidad, costos y dependencia de proveedores.',
      'Cómo verificar lo que el agente afirma.',
    ],
  },
  {
    num: '8',
    slug: '08-practica',
    titulo: 'Práctica guiada',
    listo: true,
    previsto: [
      'Consigna integradora sobre una base de los casos de estudio.',
      'Etapas: preparación, conexión, exploración, validación de reglas y análisis de rendimiento.',
      'Criterios para evaluar las respuestas del agente.',
    ],
  },
  {
    num: 'A',
    slug: 'a-bases-de-ejemplo',
    titulo: 'Bases de datos de ejemplo',
    listo: true,
    previsto: ['Scripts de creación y carga de Tu Cine, Gimnasio y Heladería para PostgreSQL y MySQL.'],
  },
  {
    num: 'B',
    slug: 'b-lista-de-control',
    titulo: 'Lista de control',
    listo: true,
    previsto: ['Lista interactiva de verificaciones antes de conectar un agente a una base de datos.'],
  },
  {
    num: 'C',
    slug: 'c-glosario',
    titulo: 'Glosario',
    listo: true,
    previsto: ['Términos técnicos utilizados en la guía.'],
  },
];

export const hrefCapitulo = (c: Capitulo) => `/guia/${c.slug}/`;

export const clientes = [
  { id: 'claude-code', nombre: 'Claude Code' },
  { id: 'codex', nombre: 'Codex' },
  { id: 'opencode', nombre: 'OpenCode' },
  { id: 'cursor', nombre: 'Cursor' },
  { id: 'claude-desktop', nombre: 'Claude (escritorio y web)' },
  { id: 'chatgpt', nombre: 'ChatGPT' },
];

export const motores = [
  { id: 'postgresql', nombre: 'PostgreSQL' },
  { id: 'mysql', nombre: 'MySQL' },
];
