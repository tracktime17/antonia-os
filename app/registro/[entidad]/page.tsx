import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ENTITIES, EntitySlug } from "@/lib/entities";
import { AppNav } from "@/components/AppNav";
import { EntityForm } from "@/components/EntityForm";
import { createRecord } from "@/app/registro/actions";

export const dynamic = "force-dynamic";

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "boolean") return value ? "Sí" : "No";
  return String(value);
}

export default async function EntidadPage({
  params,
  searchParams,
}: {
  params: { entidad: string };
  searchParams: { error?: string };
}) {
  const config = ENTITIES[params.entidad as EntitySlug];
  if (!config) notFound();

  const supabase = await createClient();

  const { data } = await supabase
    .from(config.table)
    .select(config.listColumns.map((c) => c.key).join(", "))
    .order("creado_en", { ascending: false })
    .limit(30);
  const rows = data as unknown as Record<string, unknown>[] | null;

  const refOptions: Record<string, { id: string; label: string }[]> = {};
  for (const field of config.fields) {
    if (field.type === "ref") {
      const { data } = await supabase
        .from(field.table)
        .select(`id, ${field.labelColumn}`)
        .order("creado_en", { ascending: false })
        .limit(100);
      refOptions[field.name] = (data ?? []).map((r: Record<string, unknown>) => ({
        id: String(r.id),
        label: String(r[field.labelColumn]),
      }));
    }
  }

  const createForEntidad = createRecord.bind(null, config.slug);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <AppNav current={config.slug} />
      <h1 className="mt-6 text-2xl font-semibold">{config.labelPlural}</h1>

      {searchParams?.error && (
        <p className="mt-4 rounded bg-red-50 px-4 py-2 text-sm text-red-700">{searchParams.error}</p>
      )}

      <section className="mt-8 border-b border-neutral-200 pb-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
          Nuevo{config.label.match(/^[AEIOUÁÉÍÓÚ]/i) ? "" : "a"} {config.label.toLowerCase()}
        </h2>
        <EntityForm config={config} refOptions={refOptions} action={createForEntidad} />
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">Últimos registros</h2>
        {rows && rows.length > 0 ? (
          <ul className="mt-4 divide-y divide-neutral-200">
            {rows.map((row, i) => (
              <li key={i} className="py-3 text-sm text-neutral-700">
                {config.listColumns
                  .map((c) => formatValue(row[c.key]))
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-neutral-500">Sin registros todavía.</p>
        )}
      </section>
    </main>
  );
}
