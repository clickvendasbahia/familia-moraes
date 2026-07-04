export type AccentColor =
  | "roxo"
  | "preto_rosa"
  | "azul"
  | "verde"
  | "laranja"
  | "grafite";

export const DEFAULT_ACCENT_COLOR: AccentColor = "roxo";

export const ACCENT_COLORS: { value: AccentColor; label: string; swatch: string }[] = [
  { value: "roxo", label: "Roxo", swatch: "#7c3aed" },
  { value: "preto_rosa", label: "Preto & Rosa", swatch: "#db2777" },
  { value: "azul", label: "Azul", swatch: "#2563eb" },
  { value: "verde", label: "Verde", swatch: "#059669" },
  { value: "laranja", label: "Laranja", swatch: "#ea580c" },
  { value: "grafite", label: "Grafite", swatch: "#334155" },
];
