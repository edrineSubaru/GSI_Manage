import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/AppLayout";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import KPIs from "@/pages/KPIs";
import Employees from "@/pages/Employees";
import Users from "@/pages/Users";
import Finance from "@/pages/Finance";
import Payroll from "@/pages/Payroll";
import Proposals from "@/pages/Proposals";
import Monitoring from "@/pages/Monitoring";
import Reports from "@/pages/Reports";
import Assets from "@/pages/Assets";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return <AppLayout>{children}</AppLayout>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/tasks">
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      </Route>
      <Route path="/kpis">
        <ProtectedRoute>
          <KPIs />
        </ProtectedRoute>
      </Route>
      <Route path="/employees">
        <ProtectedRoute>
          <Employees />
        </ProtectedRoute>
      </Route>
      <Route path="/users">
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      </Route>
      <Route path="/finance">
        <ProtectedRoute>
          <Finance />
        </ProtectedRoute>
      </Route>
      <Route path="/payroll">
        <ProtectedRoute>
          <Payroll />
        </ProtectedRoute>
      </Route>
      <Route path="/proposals">
        <ProtectedRoute>
          <Proposals />
        </ProtectedRoute>
      </Route>
      <Route path="/monitoring">
        <ProtectedRoute>
          <Monitoring />
        </ProtectedRoute>
      </Route>
      <Route path="/reports">
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      </Route>
      <Route path="/assets">
        <ProtectedRoute>
          <Assets />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
