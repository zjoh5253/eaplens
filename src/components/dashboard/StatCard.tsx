import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({ label, value, subtext, trend, className }: StatCardProps) {
  const trendColor =
    trend === "up" ? "text-green-600" : trend === "down" ? "text-red-500" : "text-gray-400";

  return (
    <Card className={cn("", className)}>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        {subtext && (
          <p className={cn("text-xs mt-1", trendColor)}>{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}
