export function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[260px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
