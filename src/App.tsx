import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SchedulePickup from "./pages/SchedulePickup";
import RecyclingCenters from "./pages/RecyclingCenters";
import ReportIssue from "./pages/ReportIssue";
import EducationalContent from "./pages/EducationalContent";
import MyReports from "./pages/MyReports";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import DatabaseStructure from "./pages/DatabaseStructure";
import AppDocumentation from "./pages/AppDocumentation";
import UserManagement from "./pages/UserManagement";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoggedIn } = useAuth();

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {isLoggedIn && <Navbar />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/database-structure" element={<DatabaseStructure />} />
          <Route path="/app-documentation" element={<AppDocumentation />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schedule-pickup" element={<SchedulePickup />} />
          <Route path="/recycling-centers" element={<RecyclingCenters />} />
          <Route path="/report-issue" element={<ReportIssue />} />
          <Route path="/educational-content" element={<EducationalContent />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;