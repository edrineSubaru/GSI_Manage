import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, CreditCard, BarChart3 } from "lucide-react";

const quickActions = [
  {
    id: 1,
    label: "Create New Task",
    icon: Plus,
    iconColor: "text-blue-500",
    href: "/tasks",
  },
  {
    id: 2,
    label: "Add Employee",
    icon: UserPlus,
    iconColor: "text-green-500",
    href: "/employees",
  },
  {
    id: 3,
    label: "Process Payroll",
    icon: CreditCard,
    iconColor: "text-yellow-500",
    href: "/payroll",
  },
  {
    id: 4,
    label: "Generate Report",
    icon: BarChart3,
    iconColor: "text-blue-500",
    href: "/monitoring",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={() => window.location.href = action.href}
              >
                <Icon className={`h-4 w-4 mr-3 ${action.iconColor}`} />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
