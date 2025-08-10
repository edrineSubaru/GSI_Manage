import { useQuery } from "@tanstack/react-query";
import { KPICard } from "@/components/dashboard/KPICard";
import { ProjectProgress } from "@/components/dashboard/ProjectProgress";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TaskTable } from "@/components/dashboard/TaskTable";
import { BarChart3, Users, DollarSign, CheckSquare } from "lucide-react";

interface DashboardStats {
  activeProjects: number;
  totalEmployees: number;
  pendingTasks: number;
  monthlyRevenue: number;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["api", "dashboard", "stats"],
  });

  return (
    <div className="animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Active Projects"
          value={isLoading ? "..." : stats?.activeProjects || 0}
          change={{ value: "12%", trend: "up", label: "from last month" }}
          icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />
        <KPICard
          title="Total Employees"
          value={isLoading ? "..." : stats?.totalEmployees || 0}
          change={{ value: "8", trend: "up", label: "new hires" }}
          icon={<Users className="h-6 w-6 text-green-600" />}
          iconBgColor="bg-green-50"
        />
        <KPICard
          title="Monthly Revenue"
          value={isLoading ? "..." : `$${((stats?.monthlyRevenue || 0) / 1000).toFixed(0)}K`}
          change={{ value: "3%", trend: "down", label: "from last month" }}
          icon={<DollarSign className="h-6 w-6 text-yellow-600" />}
          iconBgColor="bg-yellow-50"
        />
        <KPICard
          title="Pending Tasks"
          value={isLoading ? "..." : stats?.pendingTasks || 0}
          change={{ value: "8", trend: "up", label: "due today" }}
          icon={<CheckSquare className="h-6 w-6 text-gray-600" />}
          iconBgColor="bg-gray-50"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ProjectProgress />
        <RecentActivities />
      </div>

      {/* Quick Actions and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActions />
        <div className="lg:col-span-2">
          <TaskTable />
        </div>
      </div>
    </div>
  );
}
