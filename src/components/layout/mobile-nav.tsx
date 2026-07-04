"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/config/site";

const MOBILE_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Movimentações", href: "/movimentacoes", icon: "ArrowLeftRight" },
  { label: "Caixa", href: "/caixa", icon: "Wallet" },
  { label: "Metas", href: "/metas", icon: "Flag" },
  { label: "Relatórios", href: "/relatorios", icon: "FileBarChart" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-border bg-surface md:hidden print:hidden">
      {MOBILE_ITEMS.map((item) => {
        const Icon = getIcon(item.icon);
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 text-[11px] font-medium",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
