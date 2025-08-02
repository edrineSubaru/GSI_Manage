import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Task, Employee } from "@shared/schema";
import { format } from "date-fns";

export function TaskTable() {
  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const getEmployeeName = (employeeId: string | null) => {
    if (!employeeId || !employees) return "Unassigned";
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Unknown";
  };

  const getEmployeeInitials = (employeeId: string | null) => {
    if (!employeeId || !employees) return "UA";
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}` : "UK";
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  if (tasksLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentTasks = tasks?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Tasks</CardTitle>
        <Button variant="ghost" size="sm">
          Manage Tasks
        </Button>
      </CardHeader>
      <CardContent>
        {recentTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tasks found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                    Task
                  </th>
                  <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                    Assignee
                  </th>
                  <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="py-4">
                      <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-600">{task.description}</div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {getEmployeeInitials(task.assigneeId)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700">
                          {getEmployeeName(task.assigneeId)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant={getStatusVariant(task.status)}>
                        {getStatusLabel(task.status)}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {task.dueDate ? format(new Date(task.dueDate), "MMM dd, yyyy") : "No due date"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
