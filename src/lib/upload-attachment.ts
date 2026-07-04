import { createClient } from "@/lib/supabase/client";

const ATTACHMENTS_BUCKET = "attachments";

/**
 * Faz upload do anexo direto do navegador (o File só existe no cliente) e
 * retorna o path no storage, que é salvo em `transactions.attachment_url`.
 */
export async function uploadAttachment(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;
  const { error } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .upload(path, file);
  if (error) throw error;
  return path;
}
