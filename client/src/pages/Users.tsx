import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Shield, User, Settings } from "lucide-react";
import { User as UserType } from "@shared/schema";
import { format } from "date-fns";
import { AddUserDialog } from "@/components/dashboard/AddUserDialog";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  const { data: users, isLoading } = useQuery<UserType[]>({
    queryKey: ["api", "users"],
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "administrator":
        return <Shield className="h-4 w-4" />;
      case "manager":
        return <Settings className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case "administrator":
        return "destructive";
      case "manager":
        return "default";
      default:
        return "secondary";
    }
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole && user.isActive;
  }) || [];

  const roles = Array.from(new Set(users?.map(user => user.role) || []));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
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
        <h1 className="text-3xl font-bold">User Management</h1>
        <AddUserDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </AddUserDialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {users?.filter(user => user.isActive).length || 0}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {users?.filter(user => user.role === "administrator").length || 0}
              </div>
              <div className="text-sm text-gray-600">Administrators</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {users?.filter(user => user.role === "manager").length || 0}
              </div>
              <div className="text-sm text-gray-600">Managers</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {users?.filter(user => user.role === "user").length || 0}
              </div>
              <div className="text-sm text-gray-600">Regular Users</div>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={roleFilter === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter("")}
              >
                All Roles
              </Button>
              {roles.map((role) => (
                <Button
                  key={role}
                  variant={roleFilter === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRoleFilter(role)}
                  className="capitalize"
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Cards */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">No users found</p>
            <AddUserDialog>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            </AddUserDialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    <div className="mt-2">
                      <Badge variant={getRoleVariant(user.role)} className="capitalize">
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{user.role}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-600">
                    <span>Created: {format(new Date(user.createdAt!), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>Last updated: {format(new Date(user.updatedAt!), "MMM dd, yyyy")}</span>
                  </div>
                  {user.permissions && user.permissions.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <span>Permissions: {user.permissions.join(", ")}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Edit User
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
