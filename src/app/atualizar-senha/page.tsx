"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updatePasswordSchema,
  type UpdatePasswordInput,
} from "@/lib/validations/auth";
import { updatePassword } from "@/services/auth-service";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
  });

  async function onSubmit(data: UpdatePasswordInput) {
    const { error } = await updatePassword(data.password);
    if (error) {
      toast.error("Não foi possível atualizar a senha");
      return;
    }
    toast.success("Senha atualizada com sucesso");
    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight">Nova senha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha uma nova senha de acesso
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-xs text-expense">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword && (
              <p className="mt-1 text-xs text-expense">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Salvar nova senha
          </Button>
        </form>
      </div>
    </main>
  );
}
