import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, BarChart3, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  status: "completed" | "pending" | "failed";
}

export default function Reports() {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mock reports data
  const [reports] = useState<Report[]>([
    {
      id: "1",
      name: "Employee Performance Report",
      type: "Performance",
      generatedAt: "2025-08-09T14:30:00Z",
      status: "completed"
    },
    {
      id: "2",
      name: "Financial Summary Report",
      type: "Finance",
      generatedAt: "2025-08-08T10:15:00Z",
      status: "completed"
    },
    {
      id: "3",
      name: "Project Progress Report",
      type: "Projects",
      generatedAt: "2025-08-07T16:45:00Z",
      status: "completed"
    }
  ]);

  const reportTypes = [
    { value: "employee-performance", label: "Employee Performance Report" },
    { value: "financial-summary", label: "Financial Summary Report" },
    { value: "project-progress", label: "Project Progress Report" },
    { value: "task-completion", label: "Task Completion Report" },
    { value: "kpi-analysis", label: "KPI Analysis Report" },
  ];

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      toast({
        title: "Error",
        description: "Please select a report type to generate",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Report Generated",
        description: "Your report has been successfully generated.",
      });
    }, 2000);
  };

  const handleDownloadReport = (reportId: string, format: 'excel' | 'pdf') => {
    toast({
      title: "Downloading Report",
      description: `Your report is being downloaded as ${format.toUpperCase()}.`,
    });
    
    // In a real application, this would call the API to download the report
    // For now, we'll simulate the download
    const link = document.createElement('a');
    link.href = `/api/reports/${reportId}/download?format=${format}`;
    link.download = `report-${reportId}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewReport = (reportId: string) => {
    toast({
      title: "Viewing Report",
      description: "Opening report viewer...",
    });
    
    // In a real application, this would open a modal or navigate to a report viewer page
    // For now, we'll simulate opening the report
    window.open(`/api/reports/${reportId}/view`, '_blank');
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Generate, view, and download reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Generate Report Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Generate Report
            </CardTitle>
            <CardDescription>
              Select a report type and generate a new report
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                "Generate Report"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Reports Overview Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Reports Overview
            </CardTitle>
            <CardDescription>
              View and manage your generated reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium">{report.name}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(report.generatedAt).toLocaleDateString()} • {report.type}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewReport(report.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleDownloadReport(report.id, 'excel')}>
                          Download as Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadReport(report.id, 'pdf')}>
                          Download as PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types Information */}
      <Card>
        <CardHeader>
          <CardTitle>Available Report Types</CardTitle>
          <CardDescription>
            Different types of reports you can generate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((type) => (
              <div 
                key={type.value} 
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium">{type.label}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed analysis and insights for {type.label.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}