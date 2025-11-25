import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, AlertTriangle, Settings, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { isAdmin } = useAuth();

  return (
    <nav className="fixed bottom-4 left-4 right-4 bg-black/20 backdrop-blur-lg border border-white/10 rounded-full p-2 md:p-4 shadow-lg z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-around">
        <Button asChild variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-white hover:bg-white/10">
          <Link to="/dashboard">
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Dashboard</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-white hover:bg-white/10">
          <Link to="/report-issue">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-xs">Report</span>
          </Link>
        </Button>
        {isAdmin && (
          <Button asChild variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-white hover:bg-white/10">
            <Link to="/admin-dashboard">
              <Shield className="h-5 w-5" />
              <span className="text-xs">Admin</span>
            </Link>
          </Button>
        )}
        <Button asChild variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-white hover:bg-white/10">
          <Link to="/settings">
            <Settings className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;