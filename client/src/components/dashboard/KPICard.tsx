import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down";
    label: string;
  };
  icon: React.ReactNode;
  iconBgColor?: string;
}

export function KPICard({ title, value, change, icon, iconBgColor = "bg-blue-50" }: KPICardProps) {
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {change && (
              <p className={cn(
                "text-sm mt-2 flex items-center",
                change.trend === "up" ? "text-green-600" : "text-red-600"
              )}>
                {change.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {change.value} {change.label}
              </p>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBgColor)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
