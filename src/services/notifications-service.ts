import { differenceInCalendarDays } from "date-fns";
import { getActiveRecurringBills } from "@/repositories/recurring-bills-repository";
import { getNextDueDate } from "@/lib/utils";

export type NotificationItem = { id: string; message: string };

export async function getUpcomingBillNotifications(
  referenceDate: Date = new Date(),
): Promise<NotificationItem[]> {
  const bills = await getActiveRecurringBills();

  return bills
    .map((bill) => {
      const dueDate = getNextDueDate(bill.day_of_month, referenceDate);
      const days = differenceInCalendarDays(dueDate, referenceDate);
      return { id: bill.id, name: bill.name, days };
    })
    .filter((b) => b.days >= 0 && b.days <= 7)
    .sort((a, b) => a.days - b.days)
    .map((b) => ({
      id: b.id,
      message:
        b.days === 0
          ? `${b.name} vence hoje`
          : `${b.name} vence em ${b.days} ${b.days === 1 ? "dia" : "dias"}`,
    }));
}
