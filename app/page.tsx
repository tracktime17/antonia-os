import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

function diasRestantes(fechaObjetivo: string) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const objetivo = new Date(fechaObjetivo);
  objetivo.setHours(0, 0, 0, 0);
  const ms = objetivo.getTime() - hoy.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function getReadiness() {
  const { data } = await supabase
    .from("metricas")
    .select("valor, unidad, fecha")
    .eq("tipo", "tsb")
    .order("fecha", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

async function getObjetivoActivo() {
  const { data } = await supabase
    .from("objetivos")
    .select("nombre, fecha_objetivo")
    .eq("estado", "activo")
    .order("fecha_objetivo", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data;
}

async function getUltimoEntrenamiento() {
  const { data } = await supabase
    .from("entrenamientos")
    .select("fecha, disciplina, titulo, duracion_min, tss")
    .order("fecha", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

async function getDecisionSinResolver() {
  const { data } = await supabase
    .from("decisiones")
    .select("fecha, contexto, decision_tomada")
    .is("resultado_real", null)
    .order("fecha", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-neutral-200 py-8">
      <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function Home() {
  const [readiness, objetivo, entrenamiento, decision] = await Promise.all([
    getReadiness(),
    getObjetivoActivo(),
    getUltimoEntrenamiento(),
    getDecisionSinResolver(),
  ]);

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Antonia OS</h1>

      <Card title="Estado de readiness de hoy">
        {readiness ? (
          <p className="text-lg">
            TSB: <span className="font-semibold">{readiness.valor}</span>
            {readiness.unidad ? ` ${readiness.unidad}` : ""}{" "}
            <span className="text-sm text-neutral-500">
              ({formatFecha(readiness.fecha)})
            </span>
          </p>
        ) : (
          <p className="text-neutral-500">Sin datos de readiness todavía</p>
        )}
      </Card>

      <Card title="Objetivo activo más próximo">
        {objetivo ? (
          <div>
            <p className="text-lg font-semibold">{objetivo.nombre}</p>
            {objetivo.fecha_objetivo && (
              <p className="text-neutral-500">
                {formatFecha(objetivo.fecha_objetivo)} ·{" "}
                {diasRestantes(objetivo.fecha_objetivo)} días restantes
              </p>
            )}
          </div>
        ) : (
          <p className="text-neutral-500">Sin objetivos activos</p>
        )}
      </Card>

      <Card title="Último entrenamiento registrado">
        {entrenamiento ? (
          <div>
            <p className="text-lg font-semibold">
              {entrenamiento.titulo || entrenamiento.disciplina}
            </p>
            <p className="text-neutral-500">
              {formatFecha(entrenamiento.fecha)} · {entrenamiento.disciplina}
              {entrenamiento.duracion_min
                ? ` · ${entrenamiento.duracion_min} min`
                : ""}
              {entrenamiento.tss ? ` · TSS ${entrenamiento.tss}` : ""}
            </p>
          </div>
        ) : (
          <p className="text-neutral-500">Sin entrenamientos registrados</p>
        )}
      </Card>

      <Card title="Alertas">
        <p className="text-neutral-500">Sin alertas</p>
      </Card>

      <Card title="Última decisión sin resolver">
        {decision ? (
          <div>
            <p className="text-lg font-semibold">{decision.decision_tomada}</p>
            <p className="text-neutral-500">
              {formatFecha(decision.fecha)} · {decision.contexto}
            </p>
          </div>
        ) : (
          <p className="text-neutral-500">No hay decisiones sin resolver</p>
        )}
      </Card>
    </main>
  );
}
