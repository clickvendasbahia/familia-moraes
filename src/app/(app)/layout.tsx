import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { QuickExpenseButton } from "@/components/transactions/quick-expense-button";
import { getCategoriesWithSubcategories } from "@/repositories/categories-repository";
import { getUpcomingBillNotifications } from "@/services/notifications-service";
import { DEFAULT_ACCENT_COLOR } from "@/config/theme-colors";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, categories, notifications] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, accent_color")
      .eq("id", user.id)
      .single(),
    getCategoriesWithSubcategories(),
    getUpcomingBillNotifications(),
  ]);

  const accentColor = profile?.accent_color ?? DEFAULT_ACCENT_COLOR;

  return (
    <div
      data-accent-color={accentColor}
      className="flex min-h-screen w-full"
    >
      <Sidebar />
      <div className="flex flex-1 flex-col md:pl-64">
        <Header
          displayName={profile?.display_name ?? user.email ?? ""}
          accentColor={accentColor}
          notifications={notifications}
        />
        <div className="flex flex-1 flex-col pb-20 md:pb-0">{children}</div>
      </div>
      <MobileNav />
      <QuickExpenseButton categories={categories} />
    </div>
  );
}
