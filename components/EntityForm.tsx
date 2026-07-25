import type { EntityConfig } from "@/lib/entities";

type RefOptions = Record<string, { id: string; label: string }[]>;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const inputClass =
  "w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900";

export function EntityForm({
  config,
  refOptions,
  action,
}: {
  config: EntityConfig;
  refOptions: RefOptions;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="mt-4 flex flex-col gap-4">
      {config.fields.map((field) => {
        if (field.type === "checkbox") {
          return (
            <label key={field.name} className="flex items-center gap-2 text-sm text-neutral-700">
              <input type="checkbox" name={field.name} className="h-4 w-4" />
              {field.label}
            </label>
          );
        }

        return (
          <div key={field.name} className="flex flex-col gap-1">
            <label htmlFor={field.name} className="text-sm text-neutral-600">
              {field.label}
              {field.required ? " *" : ""}
            </label>

            {field.type === "textarea" && (
              <textarea id={field.name} name={field.name} required={field.required} rows={3} className={inputClass} />
            )}

            {field.type === "text" && (
              <input id={field.name} name={field.name} type="text" required={field.required} className={inputClass} />
            )}

            {field.type === "number" && (
              <input
                id={field.name}
                name={field.name}
                type="number"
                step={field.step ?? "1"}
                required={field.required}
                className={inputClass}
              />
            )}

            {field.type === "date" && (
              <input
                id={field.name}
                name={field.name}
                type="date"
                required={field.required}
                defaultValue={field.defaultToday ? todayISO() : undefined}
                className={inputClass}
              />
            )}

            {field.type === "select" && (
              <select
                id={field.name}
                name={field.name}
                required={field.required}
                defaultValue={field.defaultValue ?? ""}
                className={inputClass}
              >
                {!field.defaultValue && <option value="">Selecciona...</option>}
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === "ref" && (
              <select id={field.name} name={field.name} className={inputClass} defaultValue="">
                <option value="">— Ninguno —</option>
                {(refOptions[field.name] ?? []).map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      })}

      <button type="submit" className="mt-2 self-start rounded bg-neutral-900 px-4 py-2 text-sm text-white">
        Guardar
      </button>
    </form>
  );
}
