"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE_CONFIG } from "@/config/site";
import {
  loginSchema,
  forgotPasswordSchema,
  type LoginInput,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";
import { signInWithPassword, requestPasswordReset } from "@/services/auth-service";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const forgotForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onLogin(data: LoginInput) {
    setLoading(true);
    const { error } = await signInWithPassword(data.email, data.password);
    setLoading(false);
    if (error) {
      toast.error("E-mail ou senha inválidos");
      return;
    }
    router.push("/");
    router.refresh();
  }

  async function onForgot(data: ForgotPasswordInput) {
    setLoading(true);
    const { error } = await requestPasswordReset(data.email);
    setLoading(false);
    if (error) {
      toast.error("Não foi possível enviar o e-mail de recuperação");
      return;
    }
    toast.success("Enviamos um link de recuperação para o seu e-mail");
    setMode("login");
  }

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight">
          {SITE_CONFIG.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login" ? "Entre com sua conta" : "Recuperar senha"}
        </p>

        {mode === "login" ? (
          <form
            className="mt-6 space-y-4"
            onSubmit={loginForm.handleSubmit(onLogin)}
          >
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...loginForm.register("email")}
              />
              {loginForm.formState.errors.email && (
                <p className="mt-1 text-xs text-expense">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...loginForm.register("password")}
              />
              {loginForm.formState.errors.password && (
                <p className="mt-1 text-xs text-expense">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Esqueci minha senha
            </button>
          </form>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={forgotForm.handleSubmit(onForgot)}
          >
            <div>
              <Label htmlFor="forgot-email">E-mail</Label>
              <Input
                id="forgot-email"
                type="email"
                autoComplete="email"
                {...forgotForm.register("email")}
              />
              {forgotForm.formState.errors.email && (
                <p className="mt-1 text-xs text-expense">
                  {forgotForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Voltar para o login
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
