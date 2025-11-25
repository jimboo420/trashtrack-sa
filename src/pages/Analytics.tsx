import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Report, ReportSchedule } from "@/data";
import { reportsApi, reportSchedulesApi } from "@/lib/api";

const Analytics = () => {
  const [reportData, setReportData] = useState<any[]>([]);
  const [scheduleData, setScheduleData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reports, reportSchedules] = await Promise.all([
          reportsApi.getAll(),
          reportSchedulesApi.getAll()
        ]);

        // Process reports for charts
        const reportTypes = reports.reduce((acc: any, report: Report) => {
          acc[report.report_type] = (acc[report.report_type] || 0) + 1;
          return acc;
        }, {});
        const reportChartData = Object.entries(reportTypes).map(([type, count]) => ({ type, count }));

        // Process schedules for charts
        const scheduleUsage = reportSchedules.reduce((acc: any, rs: ReportSchedule) => {
          acc[rs.schedule_id] = (acc[rs.schedule_id] || 0) + 1;
          return acc;
        }, {});
        const scheduleChartData = Object.entries(scheduleUsage).map(([scheduleId, count]) => ({ schedule: `Schedule ${scheduleId}`, count }));

        setReportData(reportChartData);
        setScheduleData(scheduleChartData);
      } catch (error) {
        console.error('Failed to load analytics data:', error);
        setReportData([]);
        setScheduleData([]);
      }
    };

    loadData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Analytics</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reports by Type */}
          <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Reports by Type</CardTitle>
              <CardDescription className="text-gray-300">Distribution of report types submitted.</CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart width={400} height={300}>
                <Pie
                  data={reportData}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {reportData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>

          {/* Schedule Usage */}
          <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Schedule Usage</CardTitle>
              <CardDescription className="text-gray-300">Number of reports per schedule slot.</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart width={400} height={300} data={scheduleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="schedule" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;