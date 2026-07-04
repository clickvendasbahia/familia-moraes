import { createClient } from "@/lib/supabase/server";

const ATTACHMENTS_BUCKET = "attachments";

export async function getSignedAttachmentUrl(path: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .createSignedUrl(path, 60 * 5);
  if (error) throw error;
  return data.signedUrl;
}
