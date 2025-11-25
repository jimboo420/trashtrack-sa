import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { showSuccess, showError } from "@/utils/toast";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { usersApi } from "@/lib/api";

const Settings = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notifications, setNotifications] = useState(true);
  const { theme, setTheme } = useTheme();
  const { currentUser, logout, updateUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.first_name);
      setLastName(currentUser.last_name);
      setEmail(currentUser.email);
      setAddress(currentUser.address_line1 || "");
      setCity(currentUser.city || "");
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (currentUser) {
      try {
        const updatedUser = {
          ...currentUser,
          first_name: firstName,
          last_name: lastName,
          email,
          address_line1: address,
          city
        };

        await usersApi.update(currentUser.user_id, updatedUser);
        updateUser(updatedUser);
        showSuccess("Settings updated successfully!");
      } catch (error) {
        console.error('Failed to update user settings:', error);
        showError("Failed to update settings. Please try again.");
      }
    }
  };

  const handleThemeToggle = (checked: boolean) => {
    if (!checked) {
      showError("Not possible, it burns!");
    } else {
      setTheme("dark");
    }
  };

  const handleSignOut = () => {
    logout();
    showSuccess("Signed out successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Settings / Profile</h1>
        
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
            <CardDescription className="text-gray-300">Update your profile details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="text-white">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-black/20 backdrop-blur-lg border border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-white">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-black/20 backdrop-blur-lg border border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/20 backdrop-blur-lg border border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-white">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-black/20 backdrop-blur-lg border border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-white">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-black/20 backdrop-blur-lg border border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
              <Label htmlFor="notifications" className="text-white">Enable notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="theme"
                checked={theme === "dark"}
                onCheckedChange={handleThemeToggle}
              />
              <Label htmlFor="theme" className="text-white">Dark Mode</Label>
            </div>
            <Button onClick={handleSave} className="w-full bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">Save Changes</Button>
            <Button onClick={handleSignOut} variant="destructive" className="w-full bg-red-600 hover:bg-red-700 text-white">Sign Out</Button>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card className="mt-6 bg-black/20 backdrop-blur-lg border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Admin Tools</CardTitle>
              <CardDescription className="text-gray-300">Access administrative documentation and tools.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate("/database-structure")} className="w-full bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
                Database Structure
              </Button>
              <Button onClick={() => navigate("/app-documentation")} className="w-full bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
                App Documentation
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Settings;