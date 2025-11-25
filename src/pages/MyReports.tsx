import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Report } from "@/data";
import { useAuth } from "@/contexts/AuthContext";
import { reportsApi } from "@/lib/api";
import { exportToCSV } from "@/utils/export";
import { showSuccess } from "@/utils/toast";

const MyReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadReports = async () => {
      if (currentUser) {
        try {
          setIsLoading(true);
          setError(null);
          const allReports = await reportsApi.getAll();
          const userReports = allReports.filter(r => r.reporter_user_id === currentUser.user_id);
          setReports(userReports);
        } catch (err) {
          console.error('Failed to load reports:', err);
          setError('Failed to load reports');
          setReports([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [currentUser]);

  const handleExport = () => {
    const exportData = reports.map(report => ({
      'Report ID': report.report_id,
      'Type': report.report_type,
      'Location': report.location_address,
      'Description': report.description || '',
      'Status': report.status,
      'Date': report.report_date,
      'Latitude': report.latitude || '',
      'Longitude': report.longitude || ''
    }));
    
    exportToCSV(exportData, `my-reports-${new Date().toISOString().split('T')[0]}.csv`);
    showSuccess("Reports exported successfully!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Error Loading Reports</CardTitle>
            <CardDescription className="text-gray-300">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Reports</h1>
          {reports.length > 0 && (
            <Button onClick={handleExport} className="bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          {reports.length === 0 ? (
            <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
              <CardContent className="p-8 text-center">
                <p className="text-gray-300">No reports found.</p>
                <Button 
                  onClick={() => window.location.href = '/report-issue'} 
                  className="mt-4 bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white"
                >
                  Submit Your First Report
                </Button>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card key={report.report_id} className="bg-black/20 backdrop-blur-lg border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Report #{report.report_id}</CardTitle>
                  <CardDescription className="text-gray-300">{report.report_type} - Submitted on {report.report_date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-2"><strong>Location:</strong> {report.location_address}</p>
                  <p className="text-gray-300 mb-2"><strong>Description:</strong> {report.description}</p>
                  <Badge variant={report.status === "Resolved" ? "default" : report.status === "In Progress" ? "secondary" : "destructive"} className="bg-black/20 backdrop-blur-lg border border-white/10 text-white">
                    {report.status}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReports;