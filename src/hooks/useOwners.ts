
import { supabase } from "@/integrations/supabase/client";
import type { Owner, SelectedOwner } from "@/types/owners";

export async function searchOwners(query: string) {
  const q = query?.trim();
  let req = supabase.from("owners").select("*").order("full_name", { ascending: true });
  if (q) {
    req = req.ilike("full_name", `%${q}%`);
  }
  const { data, error } = await req;
  if (error) throw error;
  return (data ?? []) as Owner[];
}

export async function createOwner(payload: {
  full_name: string;
  email?: string;
  phone?: string;
  document?: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("owners")
    .insert({
      full_name: payload.full_name,
      email: payload.email ?? null,
      phone: payload.phone ?? null,
      document: payload.document ?? null,
      notes: payload.notes ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Owner;
}

export async function updateOwner(id: string, payload: Partial<Omit<Owner, "id" | "created_at" | "updated_at" | "created_by">>) {
  const { data, error } = await supabase
    .from("owners")
    .update({
      ...payload,
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Owner;
}

export async function deleteOwner(id: string) {
  const { error } = await supabase.from("owners").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchOwnersForProperty(propertyId: string) {
  const { data, error } = await supabase
    .from("property_owners")
    .select(
      `
      owner_id,
      ownership_percent,
      owners (*)
    `
    )
    .eq("property_id", propertyId);
  if (error) throw error;

  const selected = (data ?? []).map((row: any) => ({
    owner: row.owners as Owner,
    ownership_percent: row.ownership_percent ?? null,
  })) as SelectedOwner[];

  return selected;
}

export async function syncPropertyOwners(propertyId: string, selected: SelectedOwner[]) {
  // Fetch current links
  const { data: current, error: curErr } = await supabase
    .from("property_owners")
    .select("owner_id, ownership_percent")
    .eq("property_id", propertyId);
  if (curErr) throw curErr;

  const currentIds = new Set((current ?? []).map((c) => c.owner_id as string));
  const selectedIds = new Set(selected.map((s) => s.owner.id));

  // Upsert selected
  if (selected.length > 0) {
    const upsertPayload = selected.map((s) => ({
      property_id: propertyId,
      owner_id: s.owner.id,
      ownership_percent: s.ownership_percent ?? null,
    }));
    const { error: upErr } = await supabase
      .from("property_owners")
      .upsert(upsertPayload, { onConflict: "property_id,owner_id" });
    if (upErr) throw upErr;
  }

  // Delete removed
  const toDelete = [...currentIds].filter((id) => !selectedIds.has(id));
  if (toDelete.length > 0) {
    const { error: delErr } = await supabase
      .from("property_owners")
      .delete()
      .eq("property_id", propertyId)
      .in("owner_id", toDelete);
    if (delErr) throw delErr;
  }
}
