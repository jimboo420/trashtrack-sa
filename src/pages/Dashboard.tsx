import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, AlertTriangle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PieChart, Pie, Cell } from "recharts";
import { reportsApi } from "@/lib/api";
import { Report } from "@/data";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin } = useAuth();
  const [reportData, setReportData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const reports = await reportsApi.getAll();
        
        // Process report data for analytics
        const reportTypes = reports.reduce((acc: any, report: Report) => {
          acc[report.report_type] = (acc[report.report_type] || 0) + 1;
          return acc;
        }, {});
        const reportChartData = Object.entries(reportTypes).map(([type, count]) => ({ type, count }));
        setReportData(reportChartData);
      } catch (err) {
        console.error('Failed to load reports:', err);
        setError('Failed to load reports data');
        // Fallback to empty data
        setReportData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadReportData();
  }, []);

  if (!isLoggedIn) {
    return null; // or a loading spinner
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
            <CardTitle className="text-white">Error Loading Dashboard</CardTitle>
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
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">TrashTrack Dashboard</h1>
          
          <Card className="mb-6 bg-black/20 backdrop-blur-lg border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="h-5 w-5" />
                Next Pickup Reminder
              </CardTitle>
              <CardDescription className="text-gray-300">Your next scheduled pickup is on Friday, October 13th at 8:00 AM.</CardDescription>
            </CardHeader>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Reports Overview</CardTitle>
                <CardDescription className="text-gray-300">Quick view of your reports by type.</CardDescription>
              </CardHeader>
              <CardContent>
                {reportData.length > 0 ? (
                  <PieChart width={300} height={200}>
                    <Pie
                      data={reportData}
                      cx={150}
                      cy={100}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No reports data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-300">Access common features.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={() => navigate("/analytics")} className="w-full bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
                  View Full Analytics
                </Button>
                <Button onClick={() => navigate("/my-reports")} variant="outline" className="w-full bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
                  My Reports
                </Button>
                {isAdmin && (
                  <Button onClick={() => navigate("/admin-dashboard")} variant="outline" className="w-full bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
                    Admin Dashboard
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={() => navigate("/schedule-pickup")} className="h-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
              <Calendar className="h-6 w-6 mb-2" />
              Schedule Pickup
            </Button>
            <Button onClick={() => navigate("/report-issue")} variant="outline" className="h-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Report Issue
            </Button>
            <Button onClick={() => navigate("/recycling-centers")} variant="outline" className="h-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
              <MapPin className="h-6 w-6 mb-2" />
              Find Recycling Centers
            </Button>
            <Button onClick={() => navigate("/educational-content")} variant="outline" className="h-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
              <BookOpen className="h-6 w-6 mb-2" />
              Educational Content
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;