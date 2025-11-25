import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, FileText, AlertTriangle, Calendar, Eye, Filter, Download, BarChart3, Save, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User, Report, PickupSchedule, ReportSchedule } from "@/data";
import { reportsApi, usersApi, pickupSchedulesApi, reportSchedulesApi } from "@/lib/api";
import { exportToCSV } from "@/utils/export";
import { showSuccess, showError } from "@/utils/toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { title: "Total Users", value: "0", icon: Users, color: "text-blue-400" },
    { title: "Total Reports", value: "0", icon: FileText, color: "text-green-400" },
    { title: "Pending Issues", value: "0", icon: AlertTriangle, color: "text-red-400" },
    { title: "Active Schedules", value: "0", icon: Calendar, color: "text-yellow-400" },
  ]);
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [newCollector, setNewCollector] = useState<string>("");
  const [newSchedule, setNewSchedule] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [analyticsData, setAnalyticsData] = useState<any>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allUsers, allReports, allSchedules] = await Promise.all([
          usersApi.getAll(),
          reportsApi.getAll(),
          pickupSchedulesApi.getAll()
        ]);

        setStats([
          { title: "Total Users", value: allUsers.length.toString(), icon: Users, color: "text-blue-400" },
          { title: "Total Reports", value: allReports.length.toString(), icon: FileText, color: "text-green-400" },
          { title: "Pending Issues", value: allReports.filter((r: Report) => r.status === "Pending").length.toString(), icon: AlertTriangle, color: "text-red-400" },
          { title: "Active Schedules", value: allSchedules.filter((s: PickupSchedule) => s.is_active).length.toString(), icon: Calendar, color: "text-yellow-400" },
        ]);

        setReports(allReports);
        setFilteredReports(allReports);
        setUsers(allUsers);

        // Prepare analytics data
        const reportTypes = allReports.reduce((acc: any, report: Report) => {
          acc[report.report_type] = (acc[report.report_type] || 0) + 1;
          return acc;
        }, {});
        const reportTypeData = Object.entries(reportTypes).map(([type, count]) => ({ type, count }));

        const statusCounts = allReports.reduce((acc: any, report: Report) => {
          acc[report.status] = (acc[report.status] || 0) + 1;
          return acc;
        }, {});
        const statusData = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

        // Reports over time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentReports = allReports.filter(r => new Date(r.report_date) >= thirtyDaysAgo);
        const dailyReports = recentReports.reduce((acc: any, report: Report) => {
          const date = new Date(report.report_date).toISOString().split('T')[0]; // Extract date part from ISO string
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        const timeData = Object.entries(dailyReports).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));

        setAnalyticsData({ reportTypeData, statusData, timeData });
      } catch (error) {
        console.error('Failed to load admin dashboard data:', error);
        // Handle error appropriately, maybe show a toast
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = reports;

    if (statusFilter !== "all") {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(report => report.report_type === typeFilter);
    }

    if (dateFilter) {
      // Extract date part from ISO format for comparison
      filtered = filtered.filter(report => new Date(report.report_date).toISOString().split('T')[0] === dateFilter);
    }

    setFilteredReports(filtered);
  }, [reports, statusFilter, typeFilter, dateFilter]);

  const getReportDetails = async (report: Report) => {
    const reporter = users.find(u => u.user_id === report.reporter_user_id);
    const collector = report.assigned_collector_id ? users.find(u => u.user_id === report.assigned_collector_id) : null;
    
    try {
      const allReportSchedules = await reportSchedulesApi.getAll();
      const reportScheduleData = allReportSchedules.filter(rs => rs.report_id === report.report_id);
      const allSchedules = await pickupSchedulesApi.getAll();
      const schedules = allSchedules.filter(s => reportScheduleData.some(rs => rs.schedule_id === s.schedule_id));

      return {
        report,
        reporter,
        collector,
        schedules
      };
    } catch (error) {
      console.error('Failed to load report details:', error);
      return {
        report,
        reporter,
        collector,
        schedules: []
      };
    }
  };

  const handleStatusChange = async (report: Report) => {
    if (!newStatus || newStatus === report.status) return;

    try {
      await reportsApi.update(report.report_id, { status: newStatus });
      
      // Update local state
      const updatedReports = reports.map(r =>
        r.report_id === report.report_id ? { ...r, status: newStatus } : r
      );
      setReports(updatedReports);
      setSelectedReport(null);
      setNewStatus("");
      setNewCollector("");
      setNewSchedule("");
      showSuccess("Report status updated successfully!");
    } catch (error) {
      console.error('Failed to update report status:', error);
      showError("Failed to update report status");
    }
  };

  const handleCollectorChange = async (report: Report) => {
    const collectorId = newCollector === "none" ? undefined : (newCollector ? parseInt(newCollector) : undefined);
    if (collectorId === report.assigned_collector_id) return;

    try {
      await reportsApi.update(report.report_id, { assigned_collector_id: collectorId });
      
      // Update local state
      const updatedReports = reports.map(r =>
        r.report_id === report.report_id ? { ...r, assigned_collector_id: collectorId } : r
      );
      setReports(updatedReports);
      setSelectedReport(null);
      setNewStatus("");
      setNewCollector("");
      setNewSchedule("");
      showSuccess("Collector assigned successfully!");
    } catch (error) {
      console.error('Failed to assign collector:', error);
      showError("Failed to assign collector");
    }
  };

  const handleScheduleChange = async (report: Report) => {
    const scheduleId = newSchedule === "none" ? undefined : (newSchedule ? parseInt(newSchedule) : undefined);

    try {
      const allReportSchedules = await reportSchedulesApi.getAll();
      const existingLink = allReportSchedules.find(rs => rs.report_id === report.report_id);

      if (scheduleId) {
        if (existingLink) {
          // Update existing
          await reportSchedulesApi.update(existingLink.report_schedule_id, { schedule_id: scheduleId });
        } else {
          // Add new
          await reportSchedulesApi.create({
            report_id: report.report_id,
            schedule_id: scheduleId
          });
        }
      } else if (existingLink) {
        // Remove existing
        await reportSchedulesApi.delete(existingLink.report_schedule_id);
      }

      setSelectedReport(null);
      setNewStatus("");
      setNewCollector("");
      setNewSchedule("");
      showSuccess("Schedule updated successfully!");
    } catch (error) {
      console.error('Failed to update schedule:', error);
      showError("Failed to update schedule");
    }
  };

  const handleSaveChanges = async (report: Report) => {
    try {
      const details = await getReportDetails(report);
      const currentScheduleId = details.schedules[0]?.schedule_id || undefined;

      if (newStatus && newStatus !== report.status) {
        await handleStatusChange(report);
      }
      if (newCollector && (newCollector === "none" ? undefined : parseInt(newCollector)) !== report.assigned_collector_id) {
        await handleCollectorChange(report);
      }
      if (newSchedule && (newSchedule === "none" ? undefined : parseInt(newSchedule)) !== currentScheduleId) {
        await handleScheduleChange(report);
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
      showError("Failed to save changes");
    }
  };

  const handleExport = () => {
    const exportData = filteredReports.map(report => {
      const user = users.find(u => u.user_id === report.reporter_user_id);
      const collector = report.assigned_collector_id ? users.find(u => u.user_id === report.assigned_collector_id) : null;
      return {
        'Report ID': report.report_id,
        'Type': report.report_type,
        'Location': report.location_address,
        'Description': report.description || '',
        'Status': report.status,
        'Date': new Date(report.report_date).toLocaleDateString(),
        'Reporter': user ? `${user.first_name} ${user.last_name}` : 'Unknown',
        'Assigned Collector': collector ? `${collector.first_name} ${collector.last_name}` : 'Not Assigned',
        'Latitude': report.latitude || '',
        'Longitude': report.longitude || ''
      };
    });
    
    exportToCSV(exportData, `all-reports-${new Date().toISOString().split('T')[0]}.csv`);
    showSuccess("Reports exported successfully!");
  };

  const [schedules, setSchedules] = useState<PickupSchedule[]>([]);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const allSchedules = await pickupSchedulesApi.getAll();
        const activeSchedules = allSchedules.filter(s => s.is_active);
        setSchedules(activeSchedules);
      } catch (error) {
        console.error('Failed to load pickup schedules:', error);
      }
    };

    loadSchedules();
  }, []);

  const uniqueReportTypes = [...new Set(reports.map(r => r.report_type))];
  const uniqueStatuses = [...new Set(reports.map(r => r.status))];
  const collectors = users.filter(u => u.user_role === 'Collector');
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate("/user-management")} className="bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white text-sm">
              <UserCog className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button onClick={handleExport} className="bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white text-sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => navigate("/dashboard")} className="bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white text-sm">
              View User Dashboard
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-black/20 backdrop-blur-lg border border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Section */}
        <Card className="mb-6 bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics Overview
            </CardTitle>
            <CardDescription className="text-gray-300">Key insights into report data and trends.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Report Types Distribution */}
              <div>
                <h4 className="text-white font-semibold mb-2">Reports by Type</h4>
                <PieChart width={300} height={200}>
                  <Pie
                    data={analyticsData.reportTypeData}
                    cx={150}
                    cy={100}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.reportTypeData?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>

              {/* Status Distribution */}
              <div>
                <h4 className="text-white font-semibold mb-2">Reports by Status</h4>
                <BarChart width={300} height={200} data={analyticsData.statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </div>

              {/* Reports Over Time */}
              <div className="md:col-span-2 lg:col-span-1">
                <h4 className="text-white font-semibold mb-2">Reports Over Time (Last 30 Days)</h4>
                <LineChart width={300} height={200} data={analyticsData.timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6 bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status-filter" className="text-white">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-black/20 backdrop-blur-lg border border-white/10 text-white">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/20 backdrop-blur-lg border border-white/10">
                    <SelectItem value="all">All Statuses</SelectItem>
                    {uniqueStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type-filter" className="text-white">Report Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="bg-black/20 backdrop-blur-lg border border-white/10 text-white">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/20 backdrop-blur-lg border border-white/10">
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueReportTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <Label htmlFor="date-filter" className="text-white">Date</Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-black/20 backdrop-blur-lg border border-white/10 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Reports Table */}
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">All Reports ({filteredReports.length})</CardTitle>
            <CardDescription className="text-gray-300">Manage and review all user-submitted reports.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">ID</TableHead>
                  <TableHead className="text-white">Type</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">User</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => {
                  const user = users.find(u => u.user_id === report.reporter_user_id);
                  return (
                    <TableRow key={report.report_id}>
                      <TableCell className="text-white">{report.report_id}</TableCell>
                      <TableCell className="text-white">{report.report_type}</TableCell>
                      <TableCell>
                        <Badge variant={report.status === "Resolved" ? "default" : report.status === "In Progress" ? "secondary" : "destructive"} className="bg-black/20 backdrop-blur-lg border border-white/10 text-white">
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{user ? `${user.first_name} ${user.last_name}` : 'Unknown'}</TableCell>
                      <TableCell className="text-white">{new Date(report.report_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black/20 backdrop-blur-lg border border-white/10 text-white max-w-2xl w-full mx-4">
                            <DialogHeader>
                              <DialogTitle className="text-white">Report Details - #{report.report_id}</DialogTitle>
                              <DialogDescription className="text-gray-300">
                                Detailed information about this report.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {(() => {
                                const reporter = users.find(u => u.user_id === report.reporter_user_id);
                                const collector = report.assigned_collector_id ? users.find(u => u.user_id === report.assigned_collector_id) : null;
                                return (
                                  <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-white font-semibold">Report Type</Label>
                                        <p className="text-gray-300">{report.report_type}</p>
                                      </div>
                                      <div>
                                        <Label className="text-white font-semibold">Status</Label>
                                        <Badge variant={report.status === "Resolved" ? "default" : report.status === "In Progress" ? "secondary" : "destructive"} className="bg-black/20 backdrop-blur-lg border border-white/10 text-white">
                                          {report.status}
                                        </Badge>
                                      </div>
                                      <div>
                                        <Label className="text-white font-semibold">Reporter</Label>
                                        <p className="text-gray-300">{reporter ? `${reporter.first_name} ${reporter.last_name}` : 'Unknown'}</p>
                                      </div>
                                      <div>
                                        <Label className="text-white font-semibold">Assigned Collector</Label>
                                        <p className="text-gray-300">{collector ? `${collector.first_name} ${collector.last_name}` : 'Not Assigned'}</p>
                                      </div>
                                      <div>
                                        <Label className="text-white font-semibold">Date</Label>
                                        <p className="text-gray-300">{new Date(report.report_date).toLocaleDateString()}</p>
                                      </div>
                                      <div>
                                        <Label className="text-white font-semibold">Location</Label>
                                        <p className="text-gray-300">{report.location_address}</p>
                                      </div>
                                    </div>
                                    {report.latitude && report.longitude && (
                                      <div>
                                        <Label className="text-white font-semibold">Coordinates</Label>
                                        <p className="text-gray-300">{report.latitude}, {report.longitude}</p>
                                      </div>
                                    )}
                                    <div>
                                      <Label className="text-white font-semibold">Description</Label>
                                      <p className="text-gray-300">{report.description || 'No description provided'}</p>
                                    </div>
                                    {/* Admin Controls */}
                                    <div className="border-t border-white/10 pt-4">
                                      <h4 className="text-white font-semibold mb-4">Admin Controls</h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                          <Label className="text-white">Change Status</Label>
                                          <Select onValueChange={async (value) => {
                                            if (value && value !== report.status) {
                                              try {
                                                await reportsApi.update(report.report_id, { status: value });
                                                showSuccess("Status updated successfully!");
                                                // Refresh reports to show changes
                                                const updatedReports = reports.map(r =>
                                                  r.report_id === report.report_id ? { ...r, status: value } : r
                                                );
                                                setReports(updatedReports);
                                              } catch (error) {
                                                showError("Failed to update status");
                                              }
                                            }
                                          }}>
                                            <SelectTrigger className="bg-black/20 backdrop-blur-lg border border-white/10 text-white">
                                              <SelectValue placeholder="Select new status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black/20 backdrop-blur-lg border border-white/10">
                                              {uniqueStatuses.map(status => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <Label className="text-white">Assign Collector</Label>
                                          <Select onValueChange={async (value) => {
                                            const collectorId = value === "none" ? undefined : (value ? parseInt(value) : undefined);
                                            if (collectorId !== report.assigned_collector_id) {
                                              try {
                                                await reportsApi.update(report.report_id, { assigned_collector_id: collectorId });
                                                showSuccess("Collector assigned successfully!");
                                                // Refresh reports to show changes
                                                const updatedReports = reports.map(r =>
                                                  r.report_id === report.report_id ? { ...r, assigned_collector_id: collectorId } : r
                                                );
                                                setReports(updatedReports);
                                              } catch (error) {
                                                showError("Failed to assign collector");
                                              }
                                            }
                                          }}>
                                            <SelectTrigger className="bg-black/20 backdrop-blur-lg border border-white/10 text-white">
                                              <SelectValue placeholder="Select collector" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black/20 backdrop-blur-lg border border-white/10">
                                              <SelectItem value="none">Not Assigned</SelectItem>
                                              {collectors.map(collector => (
                                                <SelectItem key={collector.user_id} value={collector.user_id.toString()}>
                                                  {collector.first_name} {collector.last_name} ({collector.email})
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="sm:col-span-2 lg:col-span-1">
                                          <Label className="text-white">Assign Schedule</Label>
                                          <Select onValueChange={async (value) => {
                                            const scheduleId = value === "none" ? undefined : (value ? parseInt(value) : undefined);

                                            try {
                                              const allReportSchedules = await reportSchedulesApi.getAll();
                                              const existingLink = allReportSchedules.find(rs => rs.report_id === report.report_id);

                                              if (scheduleId) {
                                                if (existingLink) {
                                                  // Update existing
                                                  await reportSchedulesApi.update(existingLink.report_schedule_id, { schedule_id: scheduleId });
                                                } else {
                                                  // Add new
                                                  await reportSchedulesApi.create({
                                                    report_id: report.report_id,
                                                    schedule_id: scheduleId
                                                  });
                                                }
                                              } else if (existingLink) {
                                                // Remove existing
                                                await reportSchedulesApi.delete(existingLink.report_schedule_id);
                                              }

                                              showSuccess("Schedule updated successfully!");
                                            } catch (error) {
                                              showError("Failed to update schedule");
                                            }
                                          }}>
                                            <SelectTrigger className="bg-black/20 backdrop-blur-lg border border-white/10 text-white">
                                              <SelectValue placeholder="Select schedule" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black/20 backdrop-blur-lg border border-white/10">
                                              <SelectItem value="none">No Schedule</SelectItem>
                                              {schedules.map(schedule => (
                                                <SelectItem key={schedule.schedule_id} value={schedule.schedule_id.toString()}>
                                                  {schedule.day_of_week} at {schedule.time_slot.slice(0, 5)} - {schedule.area_covered}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div className="flex gap-2 mt-4">
                                        <Button onClick={() => handleSaveChanges(report)} className="bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
                                          <Save className="h-4 w-4 mr-2" />
                                          Save Changes
                                        </Button>
                                      </div>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;