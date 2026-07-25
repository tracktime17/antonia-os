import { createClient } from "@/lib/supabase/server";
import { AppNav } from "@/components/AppNav";

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

async function getReadiness(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from("metricas")
    .select("valor, unidad, fecha")
    .eq("tipo", "tsb")
    .order("fecha", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

async function getObjetivoActivo(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from("objetivos")
    .select("nombre, fecha_objetivo")
    .eq("estado", "activo")
    .order("fecha_objetivo", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data;
}

async function getUltimoEntrenamiento(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from("entrenamientos")
    .select("fecha, disciplina, titulo, duracion_min, tss")
    .order("fecha", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

async function getDecisionSinResolver(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from("decisiones")
    .select("fecha, contexto, decision_tomada")
    .is("resultado_real", null)
    .order("fecha", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

async function getProximaTarea(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from("tareas")
    .select("titulo, dominio, fecha_vencimiento, estado")
    .in("estado", ["pendiente", "en_progreso"])
    .order("fecha_vencimiento", { ascending: true, nullsFirst: false })
    .limit(1)
    .maybeSingle();
  return data;
}

async function getProximaCompetencia(supabase: Awaited<ReturnType<typeof createClient>>) {
  const hoy = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("competencias")
    .select("nombre, fecha, disciplina, categoria")
    .gte("fecha", hoy)
    .order("fecha", { ascending: true })
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
  const supabase = await createClient();

  const [readiness, objetivo, tarea, entrenamiento, competencia, decision] =
    await Promise.all([
      getReadiness(supabase),
      getObjetivoActivo(supabase),
      getProximaTarea(supabase),
      getUltimoEntrenamiento(supabase),
      getProximaCompetencia(supabase),
      getDecisionSinResolver(supabase),
    ]);

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <AppNav />
      <h1 className="mt-6 text-2xl font-semibold">Antonia OS</h1>

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

      <Card title="Próxima tarea pendiente">
        {tarea ? (
          <div>
            <p className="text-lg font-semibold">{tarea.titulo}</p>
            <p className="text-neutral-500">
              {tarea.dominio}
              {tarea.fecha_vencimiento
                ? ` · vence ${formatFecha(tarea.fecha_vencimiento)}`
                : ""}
            </p>
          </div>
        ) : (
          <p className="text-neutral-500">Sin tareas pendientes</p>
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

      <Card title="Próxima competencia">
        {competencia ? (
          <div>
            <p className="text-lg font-semibold">{competencia.nombre}</p>
            <p className="text-neutral-500">
              {formatFecha(competencia.fecha)} · {competencia.disciplina}
              {competencia.categoria ? ` · ${competencia.categoria}` : ""} ·{" "}
              {diasRestantes(competencia.fecha)} días restantes
            </p>
          </div>
        ) : (
          <p className="text-neutral-500">Sin competencias próximas</p>
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
