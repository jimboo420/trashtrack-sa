import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/data";
import { usersApi } from "@/lib/api";
import { showError, showSuccess } from "@/utils/toast";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation
    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!firstName || !lastName || !email || !password) {
      showError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const newUser = {
        first_name: firstName,
        last_name: lastName,
        email,
        hashed_password: password, // In real app, hash this
        user_role: "Reporter", // Default role
        address_line1: address,
        city
      };

      const result = await usersApi.create(newUser);
      showSuccess("Registration successful! Logging you in...");
      
      // Automatically log in the user after successful registration
      const loginSuccess = await login(email, password);
      
      if (loginSuccess) {
        showSuccess("Welcome to TrashTrack!");
        navigate("/dashboard");
      } else {
        // If auto-login fails, navigate to login page
        showError("Registration successful, but login failed. Please log in manually.");
        navigate("/");
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      // Handle specific error messages from the backend
      if (error.message.includes('Email already exists')) {
        showError("An account with this email already exists. Please use a different email.");
      } else {
        showError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md bg-black/20 backdrop-blur-lg border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Register for TrashTrack</CardTitle>
          <CardDescription className="text-gray-300">Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="text-white">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="bg-black/20 backdrop-blur-lg border border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-white">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
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
                required
                className="bg-black/20 backdrop-blur-lg border border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/20 backdrop-blur-lg border border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
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
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>
          <p className="text-center text-gray-300 mt-4">
            Already have an account? <Link to="/" className="text-blue-400 hover:text-blue-300">Login here</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;