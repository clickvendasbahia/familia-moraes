"use client";

import { useState } from "react";
import { Check, Palette } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ACCENT_COLORS, type AccentColor } from "@/config/theme-colors";
import { updateAccentColorAction } from "@/services/profile-service";
import { cn } from "@/lib/utils";

export function ThemeColorPicker({ current }: { current: AccentColor }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(current);
  const [saving, setSaving] = useState(false);

  async function handleSelect(color: AccentColor) {
    if (color === selected || saving) return;
    setSelected(color);
    setSaving(true);
    try {
      await updateAccentColorAction(color);
      toast.success("Cor atualizada");
    } catch {
      toast.error("Não foi possível atualizar a cor");
      setSelected(current);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        title="Cor do tema"
        onClick={() => setOpen(true)}
      >
        <Palette className="h-4 w-4" />
      </Button>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cor do seu tema</DialogTitle>
          <DialogDescription>
            Escolha a cor de destaque só para o seu login. Cada pessoa pode
            ter a sua.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3">
          {ACCENT_COLORS.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={saving}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-3 text-xs font-medium transition-colors disabled:opacity-50",
                selected === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-surface-muted",
              )}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: option.swatch }}
              >
                {selected === option.value && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </span>
              {option.label}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
