import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Resolve um ícone a partir do nome usado em `config/site.ts` e
 * `config/categories.ts` (strings, para permitir vir de dados/DB no futuro).
 */
export function getIcon(name: string): LucideIcon {
  const icon = (icons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? icons.Circle;
}
