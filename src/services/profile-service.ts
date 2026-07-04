"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateAccentColor } from "@/repositories/profiles-repository";
import type { AccentColor } from "@/config/theme-colors";

export async function updateAccentColorAction(accentColor: AccentColor) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  await updateAccentColor(user.id, accentColor);
  revalidatePath("/", "layout");
}
