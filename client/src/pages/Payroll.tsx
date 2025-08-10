import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { PayrollRecord, Employee } from "@shared/schema";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { AddPayrollDialog } from "@/components/dashboard/AddPayrollDialog";

export default function Payroll() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [periodFilter, setPeriodFilter] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: payrollRecords, isLoading } = useQuery<PayrollRecord[]>({
    queryKey: ["api", "payroll"],
  });

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["api", "employees"],
  });

  const updatePayrollMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PayrollRecord> }) => {
      return await apiRequest("PUT", `/api/payroll/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll"] });
    },
  });

  const getEmployeeName = (employeeId: string) => {
    const employee = employees?.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Unknown Employee";
  };

  const getEmployeeInitials = (employeeId: string) => {
    const employee = employees?.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}` : "UK";
  };

  const handleStatusChange = (payrollId: string, newStatus: string) => {
    updatePayrollMutation.mutate({
      id: payrollId,
      updates: { 
        status: newStatus,
        ...(newStatus === "approved" ? { approvedAt: new Date() } : {})
      },
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "approved":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  const filteredPayroll = payrollRecords?.filter(record => {
    const employeeName = getEmployeeName(record.employeeId).toLowerCase();
    const matchesSearch = employeeName.includes(searchTerm.toLowerCase()) ||
                         record.period.includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || record.status === statusFilter;
    const matchesPeriod = !periodFilter || record.period === periodFilter;
    
    return matchesSearch && matchesStatus && matchesPeriod;
  }) || [];

  const totalPayroll = payrollRecords?.reduce((sum, record) => sum + parseFloat(record.netPay), 0) || 0;
  const pendingPayroll = payrollRecords?.filter(r => r.status === "pending").reduce((sum, record) => sum + parseFloat(record.netPay), 0) || 0;
  const paidPayroll = payrollRecords?.filter(r => r.status === "paid").reduce((sum, record) => sum + parseFloat(record.netPay), 0) || 0;

  const periods = Array.from(new Set(payrollRecords?.map(record => record.period) || []));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Payroll Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payroll Management</h1>
        <AddPayrollDialog employees={employees || []}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Process Payroll
          </Button>
        </AddPayrollDialog>
      </div>

      {/* Payroll Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Payroll</p>
                <p className="text-3xl font-bold text-blue-600">${totalPayroll.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-600">${pendingPayroll.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {payrollRecords?.filter(r => r.status === "pending").length || 0} records
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Paid This Month</p>
                <p className="text-3xl font-bold text-green-600">${paidPayroll.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {payrollRecords?.filter(r => r.status === "paid").length || 0} records
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Employees</p>
                <p className="text-3xl font-bold text-gray-600">
                  {new Set(payrollRecords?.map(r => r.employeeId)).size || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">On payroll</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("")}
              >
                All Status
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("approved")}
              >
                Approved
              </Button>
              <Button
                variant={statusFilter === "paid" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("paid")}
              >
                Paid
              </Button>
            </div>
            {periods.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant={periodFilter === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPeriodFilter("")}
                >
                  All Periods
                </Button>
                {periods.slice(0, 3).map((period) => (
                  <Button
                    key={period}
                    variant={periodFilter === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPeriodFilter(period)}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payroll Records */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Records ({filteredPayroll.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayroll.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No payroll records found</p>
              <AddPayrollDialog employees={employees || []}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Process First Payroll
                </Button>
              </AddPayrollDialog>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                      Employee
                    </th>
                    <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                      Period
                    </th>
                    <th className="text-right text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                      Base Salary
                    </th>
                    <th className="text-right text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                      Allowances
                    </th>
                    <th className="text-right text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                      Deductions
                    </th>
                    <th className="text-right text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                      Net Pay
                    </th>
                    <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayroll.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                              {getEmployeeInitials(record.employeeId)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900">
                            {getEmployeeName(record.employeeId)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {record.period}
                      </td>
                      <td className="py-4 text-right text-sm text-gray-900">
                        ${parseFloat(record.baseSalary).toLocaleString()}
                      </td>
                      <td className="py-4 text-right text-sm text-green-600">
                        +${parseFloat(record.allowances || "0").toLocaleString()}
                      </td>
                      <td className="py-4 text-right text-sm text-red-600">
                        -${parseFloat(record.deductions || "0").toLocaleString()}
                      </td>
                      <td className="py-4 text-right text-sm font-semibold text-gray-900">
                        ${parseFloat(record.netPay).toLocaleString()}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(record.status)}
                          <Badge variant={getStatusVariant(record.status)} className="capitalize">
                            {record.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4">
                        {record.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(record.id, "approved")}
                              disabled={updatePayrollMutation.isPending}
                            >
                              Approve
                            </Button>
                          </div>
                        )}
                        {record.status === "approved" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(record.id, "paid")}
                            disabled={updatePayrollMutation.isPending}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
