import { DOMINIOS } from "@/lib/domains";

type Option = { value: string; label: string };

type BaseField = {
  name: string;
  label: string;
  required?: boolean;
};

export type FieldConfig =
  | (BaseField & { type: "text" })
  | (BaseField & { type: "textarea" })
  | (BaseField & { type: "date"; defaultToday?: boolean })
  | (BaseField & { type: "number"; step?: string })
  | (BaseField & { type: "checkbox" })
  | (BaseField & { type: "select"; options: readonly Option[]; defaultValue?: string })
  | (BaseField & { type: "ref"; table: string; labelColumn: string });

export type EntityConfig = {
  slug: string;
  table: string;
  label: string;
  labelPlural: string;
  fields: FieldConfig[];
  listColumns: { key: string; label: string }[];
};

const PRIORIDAD_OPTIONS = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Media" },
  { value: "baja", label: "Baja" },
] as const;

export const ENTITIES = {
  objetivos: {
    slug: "objetivos",
    table: "objetivos",
    label: "Objetivo",
    labelPlural: "Objetivos",
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      { name: "dominio", label: "Dominio", type: "select", options: DOMINIOS, required: true },
      { name: "descripcion", label: "Descripción", type: "textarea" },
      { name: "fecha_objetivo", label: "Fecha objetivo", type: "date" },
      { name: "prioridad", label: "Prioridad", type: "select", options: PRIORIDAD_OPTIONS, defaultValue: "media" },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        defaultValue: "activo",
        options: [
          { value: "activo", label: "Activo" },
          { value: "pausado", label: "Pausado" },
          { value: "cumplido", label: "Cumplido" },
          { value: "descartado", label: "Descartado" },
        ],
      },
      { name: "metrica_exito", label: "Métrica de éxito", type: "text" },
    ],
    listColumns: [
      { key: "nombre", label: "Nombre" },
      { key: "dominio", label: "Dominio" },
      { key: "estado", label: "Estado" },
      { key: "fecha_objetivo", label: "Fecha objetivo" },
    ],
  },

  proyectos: {
    slug: "proyectos",
    table: "proyectos",
    label: "Proyecto",
    labelPlural: "Proyectos",
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      { name: "dominio", label: "Dominio", type: "select", options: DOMINIOS, defaultValue: "proyectos", required: true },
      { name: "descripcion", label: "Descripción", type: "textarea" },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        defaultValue: "activo",
        required: true,
        options: [
          { value: "idea", label: "Idea" },
          { value: "activo", label: "Activo" },
          { value: "pausado", label: "Pausado" },
          { value: "completado", label: "Completado" },
          { value: "descartado", label: "Descartado" },
        ],
      },
      { name: "prioridad", label: "Prioridad", type: "select", options: PRIORIDAD_OPTIONS, defaultValue: "media" },
      { name: "fecha_inicio", label: "Fecha de inicio", type: "date" },
      { name: "fecha_objetivo", label: "Fecha objetivo", type: "date" },
      { name: "objetivo_id", label: "Objetivo asociado", type: "ref", table: "objetivos", labelColumn: "nombre" },
      { name: "repo_url", label: "Repositorio (GitHub)", type: "text" },
    ],
    listColumns: [
      { key: "nombre", label: "Nombre" },
      { key: "dominio", label: "Dominio" },
      { key: "estado", label: "Estado" },
      { key: "fecha_objetivo", label: "Fecha objetivo" },
    ],
  },

  tareas: {
    slug: "tareas",
    table: "tareas",
    label: "Tarea",
    labelPlural: "Tareas",
    fields: [
      { name: "titulo", label: "Título", type: "text", required: true },
      { name: "dominio", label: "Dominio", type: "select", options: DOMINIOS, required: true },
      { name: "descripcion", label: "Descripción", type: "textarea" },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        defaultValue: "pendiente",
        required: true,
        options: [
          { value: "pendiente", label: "Pendiente" },
          { value: "en_progreso", label: "En progreso" },
          { value: "bloqueada", label: "Bloqueada" },
          { value: "completada", label: "Completada" },
          { value: "descartada", label: "Descartada" },
        ],
      },
      { name: "prioridad", label: "Prioridad", type: "select", options: PRIORIDAD_OPTIONS, defaultValue: "media" },
      { name: "fecha_vencimiento", label: "Fecha de vencimiento", type: "date" },
      { name: "proyecto_id", label: "Proyecto asociado", type: "ref", table: "proyectos", labelColumn: "nombre" },
      { name: "objetivo_id", label: "Objetivo asociado", type: "ref", table: "objetivos", labelColumn: "nombre" },
    ],
    listColumns: [
      { key: "titulo", label: "Título" },
      { key: "dominio", label: "Dominio" },
      { key: "estado", label: "Estado" },
      { key: "fecha_vencimiento", label: "Vence" },
    ],
  },

  entrenamientos: {
    slug: "entrenamientos",
    table: "entrenamientos",
    label: "Entrenamiento",
    labelPlural: "Entrenamientos",
    fields: [
      { name: "fecha", label: "Fecha", type: "date", required: true, defaultToday: true },
      {
        name: "disciplina",
        label: "Disciplina",
        type: "select",
        required: true,
        options: [
          { value: "swim", label: "Natación" },
          { value: "bike", label: "Ciclismo" },
          { value: "run", label: "Running" },
          { value: "strength", label: "Gimnasio" },
          { value: "other", label: "Otro" },
        ],
      },
      { name: "titulo", label: "Título", type: "text" },
      { name: "descripcion", label: "Descripción", type: "textarea" },
      { name: "duracion_min", label: "Duración (min)", type: "number" },
      { name: "tss", label: "TSS", type: "number", step: "0.1" },
      { name: "if_", label: "IF", type: "number", step: "0.01" },
      { name: "distancia_m", label: "Distancia (m)", type: "number" },
      { name: "pace_promedio", label: "Pace promedio", type: "text" },
      { name: "fc_promedio", label: "FC promedio", type: "number" },
      { name: "fc_max", label: "FC máxima", type: "number" },
      { name: "potencia_promedio", label: "Potencia promedio (W)", type: "number", step: "0.1" },
      { name: "objetivo_id", label: "Objetivo asociado", type: "ref", table: "objetivos", labelColumn: "nombre" },
      {
        name: "fuente",
        label: "Fuente",
        type: "select",
        defaultValue: "manual",
        options: [
          { value: "manual", label: "Manual" },
          { value: "trainingpeaks", label: "TrainingPeaks" },
          { value: "garmin", label: "Garmin" },
          { value: "strava", label: "Strava" },
        ],
      },
    ],
    listColumns: [
      { key: "fecha", label: "Fecha" },
      { key: "disciplina", label: "Disciplina" },
      { key: "titulo", label: "Título" },
      { key: "duracion_min", label: "Min" },
      { key: "tss", label: "TSS" },
    ],
  },

  competencias: {
    slug: "competencias",
    table: "competencias",
    label: "Competencia",
    labelPlural: "Competencias",
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      { name: "fecha", label: "Fecha", type: "date", required: true },
      {
        name: "disciplina",
        label: "Disciplina",
        type: "select",
        required: true,
        options: [
          { value: "triatlon", label: "Triatlón" },
          { value: "natacion", label: "Natación" },
          { value: "ciclismo", label: "Ciclismo" },
          { value: "running", label: "Running" },
          { value: "otro", label: "Otro" },
        ],
      },
      { name: "categoria", label: "Categoría", type: "text" },
      { name: "objetivo_id", label: "Objetivo asociado", type: "ref", table: "objetivos", labelColumn: "nombre" },
      { name: "resultado_tiempo", label: "Resultado (tiempo)", type: "text" },
      { name: "resultado_posicion_general", label: "Posición general", type: "number" },
      { name: "resultado_posicion_categoria", label: "Posición en categoría", type: "number" },
      { name: "clasifico", label: "¿Clasificó?", type: "checkbox" },
      { name: "notas", label: "Notas", type: "textarea" },
    ],
    listColumns: [
      { key: "nombre", label: "Nombre" },
      { key: "fecha", label: "Fecha" },
      { key: "disciplina", label: "Disciplina" },
      { key: "resultado_tiempo", label: "Resultado" },
    ],
  },

  metricas: {
    slug: "metricas",
    table: "metricas",
    label: "Métrica",
    labelPlural: "Métricas",
    fields: [
      { name: "fecha", label: "Fecha", type: "date", required: true, defaultToday: true },
      { name: "tipo", label: "Tipo (ej. tsb, hrv, peso, sueño)", type: "text", required: true },
      { name: "valor", label: "Valor", type: "number", step: "0.01", required: true },
      { name: "unidad", label: "Unidad", type: "text" },
      { name: "fuente", label: "Fuente", type: "text" },
    ],
    listColumns: [
      { key: "fecha", label: "Fecha" },
      { key: "tipo", label: "Tipo" },
      { key: "valor", label: "Valor" },
      { key: "unidad", label: "Unidad" },
    ],
  },

  decisiones: {
    slug: "decisiones",
    table: "decisiones",
    label: "Decisión",
    labelPlural: "Decisiones",
    fields: [
      { name: "fecha", label: "Fecha", type: "date", required: true, defaultToday: true },
      { name: "dominio", label: "Dominio", type: "select", options: DOMINIOS, required: true },
      { name: "contexto", label: "Contexto", type: "textarea", required: true },
      { name: "opciones_consideradas", label: "Opciones consideradas", type: "textarea" },
      { name: "decision_tomada", label: "Decisión tomada", type: "textarea", required: true },
      { name: "razon", label: "Razón", type: "textarea" },
      { name: "objetivo_id", label: "Objetivo asociado", type: "ref", table: "objetivos", labelColumn: "nombre" },
      { name: "resultado_esperado", label: "Resultado esperado", type: "textarea" },
      { name: "resultado_real", label: "Resultado real (completar después)", type: "textarea" },
      { name: "aprendizaje", label: "Aprendizaje (completar después)", type: "textarea" },
    ],
    listColumns: [
      { key: "fecha", label: "Fecha" },
      { key: "dominio", label: "Dominio" },
      { key: "decision_tomada", label: "Decisión" },
    ],
  },

  notas: {
    slug: "notas",
    table: "notas",
    label: "Nota",
    labelPlural: "Notas",
    fields: [
      { name: "titulo", label: "Título", type: "text" },
      { name: "contenido", label: "Contenido", type: "textarea", required: true },
      {
        name: "tipo",
        label: "Tipo",
        type: "select",
        defaultValue: "nota",
        required: true,
        options: [
          { value: "nota", label: "Nota" },
          { value: "journal", label: "Journal" },
          { value: "lectura", label: "Lectura" },
          { value: "curso", label: "Curso" },
          { value: "reflexion", label: "Reflexión" },
          { value: "aprendizaje", label: "Aprendizaje" },
        ],
      },
      { name: "dominio", label: "Dominio", type: "select", options: DOMINIOS },
      {
        name: "fuente",
        label: "Fuente",
        type: "select",
        defaultValue: "manual",
        options: [
          { value: "manual", label: "Manual" },
          { value: "obsidian", label: "Obsidian" },
          { value: "markdown", label: "Markdown" },
        ],
      },
      { name: "ruta_origen", label: "Ruta de origen", type: "text" },
    ],
    listColumns: [
      { key: "titulo", label: "Título" },
      { key: "tipo", label: "Tipo" },
      { key: "dominio", label: "Dominio" },
    ],
  },

  finanzas: {
    slug: "finanzas",
    table: "finanzas_movimientos",
    label: "Movimiento",
    labelPlural: "Finanzas",
    fields: [
      { name: "fecha", label: "Fecha", type: "date", required: true, defaultToday: true },
      {
        name: "tipo",
        label: "Tipo",
        type: "select",
        required: true,
        options: [
          { value: "ingreso", label: "Ingreso" },
          { value: "gasto", label: "Gasto" },
          { value: "ahorro", label: "Ahorro" },
          { value: "inversion", label: "Inversión" },
        ],
      },
      { name: "categoria", label: "Categoría", type: "text", required: true },
      { name: "monto", label: "Monto", type: "number", step: "0.01", required: true },
      { name: "moneda", label: "Moneda", type: "text" },
      { name: "descripcion", label: "Descripción", type: "textarea" },
      { name: "objetivo_id", label: "Objetivo asociado", type: "ref", table: "objetivos", labelColumn: "nombre" },
    ],
    listColumns: [
      { key: "fecha", label: "Fecha" },
      { key: "tipo", label: "Tipo" },
      { key: "categoria", label: "Categoría" },
      { key: "monto", label: "Monto" },
    ],
  },

  documentos: {
    slug: "documentos",
    table: "documentos",
    label: "Documento",
    labelPlural: "Documentos",
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      { name: "dominio", label: "Dominio", type: "select", options: DOMINIOS, required: true },
      {
        name: "tipo",
        label: "Tipo",
        type: "select",
        options: [
          { value: "examen", label: "Examen" },
          { value: "contrato", label: "Contrato" },
          { value: "certificado", label: "Certificado" },
          { value: "plan", label: "Plan" },
          { value: "otro", label: "Otro" },
        ],
      },
      { name: "storage_path", label: "Ruta o URL del archivo", type: "text", required: true },
      { name: "fecha_documento", label: "Fecha del documento", type: "date" },
      { name: "notas", label: "Notas", type: "textarea" },
    ],
    listColumns: [
      { key: "nombre", label: "Nombre" },
      { key: "dominio", label: "Dominio" },
      { key: "tipo", label: "Tipo" },
    ],
  },

  personas: {
    slug: "personas",
    table: "personas",
    label: "Persona",
    labelPlural: "Personas",
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      {
        name: "relacion",
        label: "Relación",
        type: "select",
        options: [
          { value: "familia", label: "Familia" },
          { value: "amistad", label: "Amistad" },
          { value: "pareja", label: "Pareja" },
          { value: "entrenador", label: "Entrenador" },
          { value: "equipo", label: "Equipo" },
          { value: "colega", label: "Colega" },
          { value: "otro", label: "Otro" },
        ],
      },
      { name: "notas", label: "Notas", type: "textarea" },
    ],
    listColumns: [
      { key: "nombre", label: "Nombre" },
      { key: "relacion", label: "Relación" },
    ],
  },
} as const satisfies Record<string, EntityConfig>;

export type EntitySlug = keyof typeof ENTITIES;

export const NAV_ITEMS: { slug: string; label: string }[] = [
  { slug: "objetivos", label: "Objetivos" },
  { slug: "proyectos", label: "Proyectos" },
  { slug: "tareas", label: "Tareas" },
  { slug: "entrenamientos", label: "Entrenamientos" },
  { slug: "competencias", label: "Competencias" },
  { slug: "metricas", label: "Métricas" },
  { slug: "decisiones", label: "Decisiones" },
  { slug: "notas", label: "Notas" },
  { slug: "habitos", label: "Hábitos" },
  { slug: "finanzas", label: "Finanzas" },
  { slug: "documentos", label: "Documentos" },
  { slug: "personas", label: "Personas" },
];
