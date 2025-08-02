import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, BarChart3, TrendingUp, Award, Calendar } from "lucide-react";
import { Evaluation, Project, Employee } from "@shared/schema";
import { format } from "date-fns";

export default function Monitoring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const { data: evaluations, isLoading } = useQuery<Evaluation[]>({
    queryKey: ["/api/evaluations"],
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const getProjectName = (projectId: string) => {
    const project = projects?.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  const getEvaluatorName = (evaluatorId: string | null) => {
    if (!evaluatorId || !employees) return "System";
    const employee = employees.find(emp => emp.id === evaluatorId);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Unknown";
  };

  const getEvaluatorInitials = (evaluatorId: string | null) => {
    if (!evaluatorId || !employees) return "SY";
    const employee = employees.find(emp => emp.id === evaluatorId);
    return employee ? `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}` : "UK";
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-gray-600";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number | null) => {
    if (!score) return "outline";
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "final":
        return "default";
      case "midterm":
        return "secondary";
      case "baseline":
        return "outline";
      default:
        return "outline";
    }
  };

  const filteredEvaluations = evaluations?.filter(evaluation => {
    const projectName = getProjectName(evaluation.projectId).toLowerCase();
    const evaluatorName = getEvaluatorName(evaluation.evaluatorId).toLowerCase();
    
    const matchesSearch = 
      projectName.includes(searchTerm.toLowerCase()) ||
      evaluatorName.includes(searchTerm.toLowerCase()) ||
      evaluation.findings?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || evaluation.evaluationType === typeFilter;
    
    return matchesSearch && matchesType;
  }) || [];

  const averageScore = evaluations && evaluations.filter(e => e.score).length > 0 
    ? evaluations.filter(e => e.score).reduce((sum, e) => sum + (e.score || 0), 0) / evaluations.filter(e => e.score).length 
    : 0;
  const totalEvaluations = evaluations?.length || 0;
  const completedProjects = projects?.filter(p => p.status === "completed").length || 0;
  const ongoingEvaluations = evaluations?.filter(e => new Date(e.evaluationDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Monitoring & Evaluation</h1>
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
        <h1 className="text-3xl font-bold">Monitoring & Evaluation</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Evaluation
        </Button>
      </div>

      {/* M&E Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Evaluations</p>
                <p className="text-3xl font-bold text-blue-600">{totalEvaluations}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
                  {averageScore.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500 mt-1">Overall performance</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Projects Evaluated</p>
                <p className="text-3xl font-bold text-purple-600">{completedProjects}</p>
                <p className="text-sm text-gray-500 mt-1">Completed projects</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Recent Evaluations</p>
                <p className="text-3xl font-bold text-orange-600">{ongoingEvaluations}</p>
                <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
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
                  placeholder="Search evaluations..."
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
                variant={typeFilter === "baseline" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("baseline")}
              >
                Baseline
              </Button>
              <Button
                variant={typeFilter === "midterm" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("midterm")}
              >
                Midterm
              </Button>
              <Button
                variant={typeFilter === "final" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("final")}
              >
                Final
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      {projects && projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => {
                const projectEvaluations = evaluations?.filter(e => e.projectId === project.id) || [];
                const latestScore = projectEvaluations
                  .filter(e => e.score)
                  .sort((a, b) => new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime())[0]?.score || 0;
                
                return (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {project.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{latestScore}%</span>
                        <Badge variant={getScoreBadgeVariant(latestScore)}>
                          {projectEvaluations.length} evaluations
                        </Badge>
                      </div>
                    </div>
                    <Progress value={latestScore} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evaluations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvaluations.length === 0 ? (
          <Card className="lg:col-span-2">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">No evaluations found</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Evaluation
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredEvaluations.map((evaluation) => (
            <Card key={evaluation.id} className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {getProjectName(evaluation.projectId)}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1 capitalize">
                      {evaluation.evaluationType} Evaluation
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getTypeVariant(evaluation.evaluationType)} className="capitalize">
                      {evaluation.evaluationType}
                    </Badge>
                    {evaluation.score && (
                      <Badge variant={getScoreBadgeVariant(evaluation.score)}>
                        {evaluation.score}%
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Evaluation Date</p>
                    <p className="text-sm text-gray-700">
                      {format(new Date(evaluation.evaluationDate), "MMM dd, yyyy")}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Evaluator</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {getEvaluatorInitials(evaluation.evaluatorId)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700">
                          {getEvaluatorName(evaluation.evaluatorId)}
                        </span>
                      </div>
                    </div>
                    {evaluation.score && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Score</p>
                        <p className={`text-2xl font-bold ${getScoreColor(evaluation.score)}`}>
                          {evaluation.score}%
                        </p>
                      </div>
                    )}
                  </div>

                  {evaluation.findings && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Key Findings</p>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-3">
                        {evaluation.findings}
                      </p>
                    </div>
                  )}

                  {evaluation.recommendations && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Recommendations</p>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-3">
                        {evaluation.recommendations}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Created {format(new Date(evaluation.createdAt!), "MMM dd, yyyy")}
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
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
