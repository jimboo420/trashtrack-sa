import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { Report } from "@/data";
import { useAuth } from "@/contexts/AuthContext";
import { reportsApi } from "@/lib/api";

const ReportIssue = () => {
  const [reportType, setReportType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async () => {
    if (!currentUser) {
      showError("You must be logged in to submit a report");
      return;
    }

    if (!reportType || !location || !description) {
      showError("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      
      const newReport: Omit<Report, 'report_id'> = {
        reporter_user_id: currentUser.user_id,
        report_type: reportType,
        location_address: location,
        description,
        report_date: new Date().toISOString().split('T')[0],
        status: "Pending"
      };

      await reportsApi.create(newReport);
      
      showSuccess("Report submitted successfully!");
      
      // Reset form
      setReportType("");
      setLocation("");
      setDescription("");
      setPhoto(null);
    } catch (err) {
      console.error('Failed to submit report:', err);
      showError("Failed to submit report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Report Dumping/Issue</h1>
        
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Submit a Report</CardTitle>
            <CardDescription className="text-gray-300">Report illegal dumping or other waste-related issues.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Report Type *</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-black/20 backdrop-blur-lg border border-white/10 text-white">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent className="bg-black/20 backdrop-blur-lg border border-white/10">
                  <SelectItem value="Illegal Dumping">Illegal Dumping</SelectItem>
                  <SelectItem value="Overflowing Bin">Overflowing Bin</SelectItem>
                  <SelectItem value="Missed Pickup">Missed Pickup</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Location Address *</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter address"
                className="bg-black/20 backdrop-blur-lg border border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Description *</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue"
                rows={4}
                className="bg-black/20 backdrop-blur-lg border border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Photo Upload (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
                className="bg-black/20 backdrop-blur-lg border border-white/10 text-white"
              />
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !reportType || !location || !description}
              className="w-full bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit Report'}
            </Button>
            <p className="text-sm text-gray-400 text-center">* Required fields</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssue;