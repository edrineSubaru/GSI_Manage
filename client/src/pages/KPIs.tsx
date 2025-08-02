import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { KPI } from "@shared/schema";

export default function KPIs() {
  const { data: kpis, isLoading } = useQuery<KPI[]>({
    queryKey: ["/api/kpis"],
  });

  const calculateProgress = (current: string | null, target: string | null) => {
    if (!current || !target) return 0;
    const currentNum = parseFloat(current);
    const targetNum = parseFloat(target);
    return Math.min((currentNum / targetNum) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">KPI Monitoring</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold">KPI Monitoring</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add KPI
        </Button>
      </div>

      {kpis && kpis.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">No KPIs configured yet</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First KPI
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis?.map((kpi) => {
            const progress = calculateProgress(kpi.currentValue, kpi.targetValue);
            const isOnTrack = progress >= 80;
            
            return (
              <Card key={kpi.id} className="card-hover">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{kpi.name}</CardTitle>
                      <p className="text-sm text-gray-600 capitalize">{kpi.category}</p>
                    </div>
                    {isOnTrack ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        {kpi.currentValue || "0"}{kpi.unit && ` ${kpi.unit}`}
                      </span>
                      <span className="text-sm text-gray-600">
                        Target: {kpi.targetValue || "0"}{kpi.unit && ` ${kpi.unit}`}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className={`text-sm font-medium ${getProgressColor(progress)}`}>
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {kpi.description && (
                      <p className="text-sm text-gray-600">{kpi.description}</p>
                    )}
                    
                    <div className="text-xs text-gray-500 capitalize">
                      Period: {kpi.period}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
