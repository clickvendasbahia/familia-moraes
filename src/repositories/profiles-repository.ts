import { createClient } from "@/lib/supabase/server";
import type { AccentColor } from "@/config/theme-colors";

export async function getOwnProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, person, display_name, accent_color")
    .eq("id", user.id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateAccentColor(userId: string, accentColor: AccentColor) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ accent_color: accentColor })
    .eq("id", userId);
  if (error) throw error;
}
