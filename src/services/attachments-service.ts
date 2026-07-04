"use server";

import { getSignedAttachmentUrl } from "@/repositories/storage-repository";

export async function getAttachmentUrlAction(path: string) {
  return getSignedAttachmentUrl(path);
}
