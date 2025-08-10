import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Filter, Mail, Phone } from "lucide-react";
import { Employee } from "@shared/schema";
import { format } from "date-fns";
import { AddEmployeeDialog } from "@/components/dashboard/AddEmployeeDialog";

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");

  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ["api", "employees"],
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const filteredEmployees = employees?.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
    
    return matchesSearch && matchesDepartment && employee.status === "active";
  }) || [];

  const departments = Array.from(new Set(employees?.map(emp => emp.department) || []));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Employee Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <AddEmployeeDialog departments={departments}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </AddEmployeeDialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {employees?.filter(emp => emp.status === "active").length || 0}
              </div>
              <div className="text-sm text-gray-600">Active Employees</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {departments.length}
              </div>
              <div className="text-sm text-gray-600">Departments</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {employees?.filter(emp => new Date(emp.hireDate).getFullYear() === new Date().getFullYear()).length || 0}
              </div>
              <div className="text-sm text-gray-600">New Hires This Year</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                ${((employees?.filter(emp => emp.salary).reduce((sum, emp) => sum + parseFloat(emp.salary || "0"), 0) || 0) / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-gray-600">Total Payroll</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
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
                variant={departmentFilter === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setDepartmentFilter("")}
              >
                All Departments
              </Button>
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={departmentFilter === dept ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDepartmentFilter(dept)}
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Cards */}
      {filteredEmployees.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">No employees found</p>
            <AddEmployeeDialog departments={departments}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First Employee
              </Button>
            </AddEmployeeDialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {getInitials(employee.firstName, employee.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                    <Badge variant="outline" className="mt-1">
                      {employee.department}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  {employee.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{employee.phone}</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-600">
                    <span>Hired: {format(new Date(employee.hireDate), "MMM yyyy")}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>ID: {employee.employeeId}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                      {employee.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
