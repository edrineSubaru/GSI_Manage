import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, FileText, Calendar, DollarSign, User } from "lucide-react";
import { Proposal, Employee } from "@shared/schema";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { AddProposalDialog } from "@/components/dashboard/AddProposalDialog";

export default function Proposals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: proposals, isLoading } = useQuery<Proposal[]>({
    queryKey: ["api", "proposals"],
  });

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["api", "employees"],
  });

  const updateProposalMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Proposal> }) => {
      return await apiRequest("PUT", `/api/proposals/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
    },
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

  const handleStatusChange = (proposalId: string, newStatus: string) => {
    updateProposalMutation.mutate({
      id: proposalId,
      updates: { status: newStatus },
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "default";
      case "submitted":
        return "secondary";
      case "under_review":
        return "outline";
      case "rejected":
        return "destructive";
      case "draft":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-green-600";
      case "submitted":
        return "text-blue-600";
      case "under_review":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      case "draft":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredProposals = proposals?.filter(proposal => {
    const matchesSearch = 
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const totalValue = proposals?.reduce((sum, proposal) => sum + parseFloat(proposal.value || "0"), 0) || 0;
  const acceptedValue = proposals?.filter(p => p.status === "accepted").reduce((sum, proposal) => sum + parseFloat(proposal.value || "0"), 0) || 0;
  const pendingValue = proposals?.filter(p => p.status === "submitted" || p.status === "under_review").reduce((sum, proposal) => sum + parseFloat(proposal.value || "0"), 0) || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Proposal Management</h1>
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
        <h1 className="text-3xl font-bold">Proposal Management</h1>
        <AddProposalDialog employees={employees || []}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Proposal
          </Button>
        </AddProposalDialog>
      </div>

      {/* Proposal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Proposals</p>
                <p className="text-3xl font-bold text-blue-600">{proposals?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Accepted Value</p>
                <p className="text-3xl font-bold text-green-600">${acceptedValue.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {proposals?.filter(p => p.status === "accepted").length || 0} proposals
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Value</p>
                <p className="text-3xl font-bold text-yellow-600">${pendingValue.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {proposals?.filter(p => p.status === "submitted" || p.status === "under_review").length || 0} proposals
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-yellow-600" />
              </div>
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
                  placeholder="Search proposals..."
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
                All
              </Button>
              <Button
                variant={statusFilter === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("draft")}
              >
                Draft
              </Button>
              <Button
                variant={statusFilter === "submitted" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("submitted")}
              >
                Submitted
              </Button>
              <Button
                variant={statusFilter === "under_review" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("under_review")}
              >
                Under Review
              </Button>
              <Button
                variant={statusFilter === "accepted" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("accepted")}
              >
                Accepted
              </Button>
              <Button
                variant={statusFilter === "rejected" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("rejected")}
              >
                Rejected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposals List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProposals.length === 0 ? (
          <Card className="lg:col-span-2">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">No proposals found</p>
              <AddProposalDialog employees={employees || []}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Proposal
                </Button>
              </AddProposalDialog>
            </CardContent>
          </Card>
        ) : (
          filteredProposals.map((proposal) => (
            <Card key={proposal.id} className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{proposal.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{proposal.client}</p>
                  </div>
                  <Badge variant={getStatusVariant(proposal.status)} className="capitalize">
                    {proposal.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proposal.description && (
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {proposal.description}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Value</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${parseFloat(proposal.value || "0").toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Lead</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {getEmployeeInitials(proposal.leadId)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700">
                          {getEmployeeName(proposal.leadId)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {proposal.submissionDate && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Submitted</p>
                        <p className="text-sm text-gray-700">
                          {format(new Date(proposal.submissionDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    )}
                    {proposal.deadlineDate && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Deadline</p>
                        <p className="text-sm text-gray-700">
                          {format(new Date(proposal.deadlineDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${getStatusColor(proposal.status)}`}>
                        Status: {proposal.status.replace("_", " ")}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {proposal.status === "draft" && (
                          <Button 
                            size="sm"
                            onClick={() => handleStatusChange(proposal.id, "submitted")}
                            disabled={updateProposalMutation.isPending}
                          >
                            Submit
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
