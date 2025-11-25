import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showError, showSuccess } from "@/utils/toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showError("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      const success = await login(email, password);
      
      if (success) {
        showSuccess("Login successful!");
        navigate("/dashboard");
      } else {
        showError("Invalid credentials. Please check your email and password.");
      }
    } catch (error) {
      console.error('Login error:', error);
      showError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md bg-black/20 backdrop-blur-lg border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Login to TrashTrack</CardTitle>
          <CardDescription className="text-gray-300">Enter your credentials to access the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-black/20 backdrop-blur-lg border border-white/10 text-white placeholder-gray-400 disabled:opacity-50"
                placeholder="Enter your email"
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
                disabled={isLoading}
                className="bg-black/20 backdrop-blur-lg border border-white/10 text-white placeholder-gray-400 disabled:opacity-50"
                placeholder="Enter your password"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !email || !password}
              className="w-full bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm text-center">
              Demo accounts:
            </p>
            <p className="text-blue-200 text-xs text-center mt-1">
              Admin: user@user.com / password123<br/>
              User: regular@user.com / password123
            </p>
          </div>
          <p className="text-center text-gray-300 mt-4">
            Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300">Register here</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;