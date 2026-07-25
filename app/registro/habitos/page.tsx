import { createClient } from "@/lib/supabase/server";
import { DOMINIOS } from "@/lib/domains";
import { AppNav } from "@/components/AppNav";
import { EntityForm } from "@/components/EntityForm";
import { createHabito, marcarHabitoHoy } from "@/app/registro/actions";
import type { EntityConfig } from "@/lib/entities";

export const dynamic = "force-dynamic";

const HABITO_CONFIG: EntityConfig = {
  slug: "habitos",
  table: "habitos",
  label: "Hábito",
  labelPlural: "Hábitos",
  fields: [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "dominio", label: "Dominio", type: "select", options: DOMINIOS, required: true },
    {
      name: "frecuencia_objetivo",
      label: "Frecuencia objetivo",
      type: "select",
      defaultValue: "diario",
      options: [
        { value: "diario", label: "Diario" },
        { value: "semanal", label: "Semanal" },
        { value: "custom", label: "Personalizada" },
      ],
    },
  ],
  listColumns: [],
};

export default async function HabitosPage({ searchParams }: { searchParams: { error?: string } }) {
  const supabase = await createClient();
  const hoy = new Date().toISOString().slice(0, 10);

  const { data: habitos } = await supabase
    .from("habitos")
    .select("id, nombre, dominio, frecuencia_objetivo")
    .eq("activo", true)
    .order("nombre", { ascending: true });

  const { data: registrosHoy } = await supabase
    .from("habitos_registro")
    .select("habito_id")
    .eq("fecha", hoy);

  const marcadosHoy = new Set((registrosHoy ?? []).map((r) => r.habito_id));

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <AppNav current="habitos" />
      <h1 className="mt-6 text-2xl font-semibold">Hábitos</h1>

      {searchParams?.error && (
        <p className="mt-4 rounded bg-red-50 px-4 py-2 text-sm text-red-700">{searchParams.error}</p>
      )}

      <section className="mt-8 border-b border-neutral-200 pb-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">Registro de hoy</h2>
        {habitos && habitos.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-3">
            {habitos.map((habito) => {
              const cumplido = marcadosHoy.has(habito.id);
              const marcar = marcarHabitoHoy.bind(null, habito.id);
              return (
                <li
                  key={habito.id}
                  className="flex items-center justify-between rounded border border-neutral-200 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{habito.nombre}</p>
                    <p className="text-xs text-neutral-500">
                      {habito.dominio} · {habito.frecuencia_objetivo}
                    </p>
                  </div>
                  {cumplido ? (
                    <span className="text-sm text-emerald-700">Cumplido hoy ✓</span>
                  ) : (
                    <form action={marcar}>
                      <button
                        type="submit"
                        className="rounded bg-neutral-900 px-3 py-1.5 text-sm text-white"
                      >
                        Marcar hoy
                      </button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 text-neutral-500">Sin hábitos activos todavía.</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">Nuevo hábito</h2>
        <EntityForm config={HABITO_CONFIG} refOptions={{}} action={createHabito} />
      </section>
    </main>
  );
}
