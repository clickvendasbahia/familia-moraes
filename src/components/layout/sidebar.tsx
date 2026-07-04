"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getIcon } from "@/lib/icons";
import { NAV_ITEMS, SITE_CONFIG } from "@/config/site";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface md:flex print:hidden">
      <div className="flex h-16 shrink-0 items-center px-6">
        <span className="text-lg font-semibold tracking-tight">
          {SITE_CONFIG.name}
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = getIcon(item.icon);
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
