"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { NotificationItem } from "@/services/notifications-service";

export function NotificationsButton({
  notifications,
}: {
  notifications: NotificationItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        title="Notificações"
        onClick={() => setOpen(true)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {notifications.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-expense text-[10px] font-medium text-white">
            {notifications.length}
          </span>
        )}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Notificações</DialogTitle>
          </DialogHeader>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma conta vencendo nos próximos 7 dias.
            </p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="rounded-lg bg-surface-muted px-3 py-2 text-sm"
                >
                  {n.message}
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
