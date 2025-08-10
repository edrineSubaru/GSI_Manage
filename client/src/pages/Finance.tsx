import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { Transaction, Project } from "@shared/schema";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { AddTransactionDialog } from "@/components/dashboard/AddTransactionDialog";

export default function Finance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["api", "transactions"],
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["api", "projects"],
  });

  const getProjectName = (projectId: string | null) => {
    if (!projectId || !projects) return "General";
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  const getTypeVariant = (type: string) => {
    return type === "income" ? "default" : "destructive";
  };

  const getTypeIcon = (type: string) => {
    return type === "income" 
      ? <TrendingUp className="h-4 w-4 text-green-600" />
      : <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const filteredTransactions = transactions?.filter(transaction => {
    const projectName = getProjectName(transaction.projectId).toLowerCase();
    
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projectName.includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || transaction.type === typeFilter;
    const matchesCategory = !categoryFilter || transaction.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  }) || [];

  const totalIncome = transactions?.filter(t => t.type === "income").reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
  const totalExpenses = transactions?.filter(t => t.type === "expense").reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
  const netBalance = totalIncome - totalExpenses;

  const categories = Array.from(new Set(transactions?.map(t => t.category) || []));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Financial Management</h1>
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
        <h1 className="text-3xl font-bold">Financial Management</h1>
        <AddTransactionDialog
          projects={projects || []}
          categories={categories}
        >
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </AddTransactionDialog>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Income</p>
                <p className="text-3xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
                <p className="text-3xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Net Balance</p>
                <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netBalance.toLocaleString()}
                </p>
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
                <p className="text-gray-600 text-sm font-medium">Transactions</p>
                <p className="text-3xl font-bold text-gray-600">{transactions?.length || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Total recorded</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-gray-600" />
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
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={typeFilter === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("")}
              >
                All Types
              </Button>
              <Button
                variant={typeFilter === "income" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("income")}
              >
                Income
              </Button>
              <Button
                variant={typeFilter === "expense" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("expense")}
              >
                Expenses
              </Button>
            </div>
            {categories.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant={categoryFilter === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter("")}
                >
                  All Categories
                </Button>
                {categories.slice(0, 3).map((category) => (
                  <Button
                    key={category}
                    variant={categoryFilter === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No transactions found</p>
              <AddTransactionDialog
                projects={projects || []}
                categories={categories}
              >
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Transaction
                </Button>
              </AddTransactionDialog>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                      Date
                    </th>
                    <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                      Description
                    </th>
                    <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                      Category
                    </th>
                    <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                      Project
                    </th>
                    <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                      Type
                    </th>
                    <th className="text-right text-xs font-medium text-gray-600 uppercase tracking-wider py-3">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="py-4 text-sm text-gray-600">
                        {format(new Date(transaction.date), "MMM dd, yyyy")}
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        <Badge variant="outline" className="capitalize">
                          {transaction.category}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {getProjectName(transaction.projectId)}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(transaction.type)}
                          <Badge variant={getTypeVariant(transaction.type)} className="capitalize">
                            {transaction.type}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 text-right text-sm font-semibold">
                        <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                          {transaction.type === "income" ? "+" : "-"}${parseFloat(transaction.amount).toLocaleString()}
                        </span>
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