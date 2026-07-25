"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ENTITIES, EntitySlug } from "@/lib/entities";

function buildPayload(fields: { name: string; type: string }[], formData: FormData) {
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.type === "checkbox") {
      payload[field.name] = formData.get(field.name) === "on";
      continue;
    }

    const raw = formData.get(field.name);
    const value = typeof raw === "string" ? raw.trim() : "";

    if (value === "") {
      payload[field.name] = null;
      continue;
    }

    payload[field.name] = field.type === "number" ? Number(value) : value;
  }

  return payload;
}

export async function createRecord(entidad: string, formData: FormData) {
  const config = ENTITIES[entidad as EntitySlug];
  if (!config) {
    throw new Error("Entidad desconocida");
  }

  const payload = buildPayload(config.fields, formData);
  const supabase = await createClient();
  const { error } = await supabase.from(config.table).insert(payload);

  const path = `/registro/${entidad}`;

  if (error) {
    redirect(`${path}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(path);
  redirect(path);
}

const HABITO_FIELDS = [
  { name: "nombre", type: "text" },
  { name: "dominio", type: "select" },
  { name: "frecuencia_objetivo", type: "select" },
] as const;

export async function createHabito(formData: FormData) {
  const payload = buildPayload(HABITO_FIELDS as unknown as { name: string; type: string }[], formData);
  const supabase = await createClient();
  const { error } = await supabase.from("habitos").insert(payload);

  if (error) {
    redirect(`/registro/habitos?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/registro/habitos");
  redirect("/registro/habitos");
}

export async function marcarHabitoHoy(habitoId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("habitos_registro").insert({
    habito_id: habitoId,
    fecha: new Date().toISOString().slice(0, 10),
    cumplido: true,
  });

  if (error) {
    redirect(`/registro/habitos?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/registro/habitos");
  redirect("/registro/habitos");
}
