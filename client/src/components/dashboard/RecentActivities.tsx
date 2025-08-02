import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, AlertCircle, Calendar } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "proposal",
    title: "New proposal submitted for AfDB project",
    time: "2 hours ago",
    icon: FileText,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    type: "completion",
    title: "Employee onboarding completed for John Smith",
    time: "5 hours ago",
    icon: CheckCircle,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    id: 3,
    type: "reminder",
    title: "Payroll processing reminder for March",
    time: "1 day ago",
    icon: AlertCircle,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
  {
    id: 4,
    type: "meeting",
    title: "Team meeting scheduled for project review",
    time: "2 days ago",
    icon: Calendar,
    iconBg: "bg-gray-50",
    iconColor: "text-gray-500",
  },
];

export function RecentActivities() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activities</CardTitle>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{activity.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
