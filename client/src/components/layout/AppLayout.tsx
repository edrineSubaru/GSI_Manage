import { Sidebar, SidebarHeader, SidebarContent, SidebarNav, SidebarNavList, SidebarNavItem } from "@/components/ui/sidebar";
import { Building, BarChart3, CheckSquare, TrendingUp, Users, UserCog, DollarSign, CreditCard, FileText, BarChart } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { TopBar } from "./TopBar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { path: "/", label: "Dashboard", icon: BarChart3 },
  { path: "/tasks", label: "Task Management", icon: CheckSquare },
  { path: "/kpis", label: "KPI Monitoring", icon: TrendingUp },
  { path: "/employees", label: "Employee Management", icon: Users },
  { path: "/users", label: "User Management", icon: UserCog },
  { path: "/finance", label: "Finance", icon: DollarSign },
  { path: "/payroll", label: "Payroll", icon: CreditCard },
  { path: "/proposals", label: "Proposals", icon: FileText },
  { path: "/monitoring", label: "Monitoring & Evaluation", icon: BarChart },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center space-x-3">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">GSI</h1>
              <p className="text-xs text-gray-600">Management System</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarNav>
            <SidebarNavList>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <SidebarNavItem key={item.path}>
                    <Link href={item.path}>
                      <a
                        className={cn(
                          "sidebar-item flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/15 text-primary"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </a>
                    </Link>
                  </SidebarNavItem>
                );
              })}
            </SidebarNavList>
          </SidebarNav>
        </SidebarContent>
      </Sidebar>

      <main className="flex-1 overflow-hidden">
        <TopBar />
        <div className="h-full overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
