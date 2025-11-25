import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { showSuccess, showError } from "@/utils/toast";
import { Report, PickupSchedule } from "@/data";
import { useAuth } from "@/contexts/AuthContext";
import { reportsApi, pickupSchedulesApi, reportSchedulesApi } from "@/lib/api";

const SchedulePickup = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [wasteType, setWasteType] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [schedules, setSchedules] = useState<PickupSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setIsLoadingSchedules(true);
        const allSchedules = await pickupSchedulesApi.getAll();
        const activeSchedules = allSchedules.filter(s => s.is_active);
        setSchedules(activeSchedules);
      } catch (err) {
        console.error('Failed to load schedules:', err);
        showError("Failed to load pickup schedules");
      } finally {
        setIsLoadingSchedules(false);
      }
    };

    loadSchedules();
  }, []);

  const handleSchedule = async () => {
    if (!currentUser || !date || !wasteType || !selectedSchedule) {
      showError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);

      // Create the pickup request as a report
      const newReport: Omit<Report, 'report_id'> = {
        reporter_user_id: currentUser.user_id,
        report_type: "Pickup Request",
        location_address: currentUser.address_line1 || "User Address",
        description: `Scheduled pickup for ${wasteType}`,
        report_date: date.toISOString().split('T')[0],
        status: "Scheduled"
      };

      const reportResult = await reportsApi.create(newReport);
      const reportId = reportResult.report_id;

      // Link to the selected schedule
      await reportSchedulesApi.create({
        report_id: reportId,
        schedule_id: selectedSchedule
      });

      showSuccess("Pickup scheduled successfully!");
      
      // Reset form
      setDate(new Date());
      setWasteType("");
      setSelectedSchedule(null);
    } catch (err) {
      console.error('Failed to schedule pickup:', err);
      showError("Failed to schedule pickup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingSchedules) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Schedule Pickup</h1>
        
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Request a Pickup</CardTitle>
            <CardDescription className="text-gray-300">Select your preferred date and waste type.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Select Date *</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border border-white/10 bg-black/20 backdrop-blur-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Waste Type *</label>
              <Select value={wasteType} onValueChange={setWasteType}>
                <SelectTrigger className="bg-black/20 backdrop-blur-lg border border-white/10 text-white">
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent className="bg-black/20 backdrop-blur-lg border border-white/10">
                  <SelectItem value="General Waste">General Waste</SelectItem>
                  <SelectItem value="Recycling">Recycling</SelectItem>
                  <SelectItem value="Organic">Organic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Preferred Time Slot *</label>
              <Select 
                value={selectedSchedule?.toString() || ""} 
                onValueChange={(value) => setSelectedSchedule(parseInt(value))}
                disabled={schedules.length === 0}
              >
                <SelectTrigger className="bg-black/20 backdrop-blur-lg border border-white/10 text-white">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent className="bg-black/20 backdrop-blur-lg border border-white/10">
                  {schedules.map(schedule => (
                    <SelectItem key={schedule.schedule_id} value={schedule.schedule_id.toString()}>
                      {schedule.day_of_week} at {schedule.time_slot.slice(0, 5)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {schedules.length === 0 && (
                <p className="text-sm text-gray-400 mt-1">No active schedules available</p>
              )}
            </div>
            <Button 
              onClick={handleSchedule} 
              disabled={isLoading || !date || !wasteType || !selectedSchedule || schedules.length === 0}
              className="w-full bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Scheduling...' : 'Schedule Pickup'}
            </Button>
            <p className="text-sm text-gray-400 text-center">* Required fields</p>
          </CardContent>
        </Card>
        
        <Card className="mt-6 bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Available Schedules</CardTitle>
          </CardHeader>
          <CardContent>
            {schedules.length === 0 ? (
              <p className="text-gray-400">No active pickup schedules available.</p>
            ) : (
              <>
                <p className="text-gray-300">Available pickup slots:</p>
                <ul className="text-gray-300 mt-2 space-y-1">
                  {schedules.map(schedule => (
                    <li key={schedule.schedule_id} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      {schedule.day_of_week} at {schedule.time_slot.slice(0, 5)}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchedulePickup;