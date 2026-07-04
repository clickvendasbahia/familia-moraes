"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeColorPicker } from "@/components/theme-color-picker";
import { LogoutButton } from "@/components/logout-button";
import { GlobalSearch } from "@/components/global-search";
import { NotificationsButton } from "@/components/notifications-button";
import type { AccentColor } from "@/config/theme-colors";
import type { NotificationItem } from "@/services/notifications-service";

export function Header({
  displayName,
  accentColor,
  notifications,
}: {
  displayName: string;
  accentColor: AccentColor;
  notifications: NotificationItem[];
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-sm md:px-6 print:hidden">
      <div className="text-sm text-muted-foreground">
        Olá,{" "}
        <span className="font-medium text-foreground">{displayName}</span>
      </div>
      <div className="flex items-center gap-2">
        <GlobalSearch />
        <NotificationsButton notifications={notifications} />
        <ThemeColorPicker current={accentColor} />
        <ThemeToggle />
        <LogoutButton />
      </div>
    </header>
  );
}
