import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Eye, Filter, Download, Save, UserCheck, UserX, Shield, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User } from "@/data";
import { usersApi } from "@/lib/api";
import { exportToCSV } from "@/utils/export";
import { showSuccess, showError } from "@/utils/toast";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allUsers = await usersApi.getAll();
        setUsers(allUsers);
        setFilteredUsers(allUsers);
      } catch (err) {
        console.error('Failed to load users:', err);
        setError('Failed to load users');
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.user_role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, roleFilter]);

  const getUserDetails = (user: User) => {
    return {
      user,
      reportsCount: 0, // In a real app, you'd calculate this from reports data
      pickupsCount: 0, // In a real app, you'd calculate this from pickups data
    };
  };

  const handleRoleChange = async (user: User) => {
    if (!newRole || newRole === user.user_role) return;

    try {
      const updatedUser = { ...user, user_role: newRole };
      await usersApi.update(user.user_id, updatedUser);
      
      // Update local state
      const updatedUsers = users.map(u =>
        u.user_id === user.user_id ? updatedUser : u
      );
      setUsers(updatedUsers);
      setSelectedUser(null);
      setNewRole("");
      showSuccess("User role updated successfully!");
    } catch (err) {
      console.error('Failed to update user role:', err);
      showError("Failed to update user role");
    }
  };

  const handleExport = () => {
    const exportData = filteredUsers.map(user => ({
      'User ID': user.user_id,
      'First Name': user.first_name,
      'Last Name': user.last_name,
      'Email': user.email,
      'Role': user.user_role,
      'Address': user.address_line1 || '',
      'City': user.city || '',
      'Registration Date': 'N/A' // In a real app, you'd have this field
    }));
    
    exportToCSV(exportData, `all-users-${new Date().toISOString().split('T')[0]}.csv`);
    showSuccess("Users exported successfully!");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-4 w-4" />;
      case 'Collector':
        return <Truck className="h-4 w-4" />;
      case 'Author':
        return <UserCheck className="h-4 w-4" />;
      default:
        return <UserX className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'destructive';
      case 'Collector':
        return 'secondary';
      case 'Author':
        return 'default';
      default:
        return 'outline';
    }
  };

  const uniqueRoles = [...new Set(users.map(u => u.user_role))];

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
            <CardTitle className="text-white">Error Loading Users</CardTitle>
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
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExport} className="bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white text-sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => navigate("/admin-dashboard")} className="bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white text-sm">
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Admins</CardTitle>
              <Shield className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.filter(u => u.user_role === 'Admin').length}</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Collectors</CardTitle>
              <Truck className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.filter(u => u.user_role === 'Collector').length}</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Reporters</CardTitle>
              <UserCheck className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.filter(u => u.user_role === 'Reporter').length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="role-filter" className="text-white">Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="bg-black/20 backdrop-blur-lg border border-white/10 text-white">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/20 backdrop-blur-lg border border-white/10">
                    <SelectItem value="all">All Roles</SelectItem>
                    {uniqueRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">All Users ({filteredUsers.length})</CardTitle>
            <CardDescription className="text-gray-300">Manage user roles and view user information.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">ID</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Role</TableHead>
                  <TableHead className="text-white">Location</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="text-white">{user.user_id}</TableCell>
                    <TableCell className="text-white">{user.first_name} {user.last_name}</TableCell>
                    <TableCell className="text-white">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.user_role)} className="bg-black/20 backdrop-blur-lg border border-white/10 text-white flex items-center gap-1">
                        {getRoleIcon(user.user_role)}
                        {user.user_role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">
                      {user.city ? `${user.city}` : 'N/A'}
                    </TableCell>
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
                            <DialogTitle className="text-white">User Details - {user.first_name} {user.last_name}</DialogTitle>
                            <DialogDescription className="text-gray-300">
                              Detailed information about this user.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {(() => {
                              const details = getUserDetails(user);
                              return (
                                <>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-white font-semibold">User ID</Label>
                                      <p className="text-gray-300">{details.user.user_id}</p>
                                    </div>
                                    <div>
                                      <Label className="text-white font-semibold">Role</Label>
                                      <div className="flex gap-2 items-center">
                                        <Badge variant={getRoleBadgeVariant(details.user.user_role)} className="bg-black/20 backdrop-blur-lg border border-white/10 text-white flex items-center gap-1">
                                          {getRoleIcon(details.user.user_role)}
                                          {details.user.user_role}
                                        </Badge>
                                        <Select
                                          value={newRole}
                                          onValueChange={setNewRole}
                                        >
                                          <SelectTrigger className="w-32 bg-black/20 backdrop-blur-lg border border-white/10 text-white">
                                            <SelectValue placeholder="Change role" />
                                          </SelectTrigger>
                                          <SelectContent className="bg-black/20 backdrop-blur-lg border border-white/10">
                                            <SelectItem value="Reporter">Reporter</SelectItem>
                                            <SelectItem value="Collector">Collector</SelectItem>
                                            <SelectItem value="Author">Author</SelectItem>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        {newRole && newRole !== details.user.user_role && (
                                          <Button
                                            size="sm"
                                            onClick={() => handleRoleChange(details.user)}
                                            className="bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white"
                                          >
                                            <Save className="h-4 w-4 mr-1" />
                                            Save
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-white font-semibold">First Name</Label>
                                      <p className="text-gray-300">{details.user.first_name}</p>
                                    </div>
                                    <div>
                                      <Label className="text-white font-semibold">Last Name</Label>
                                      <p className="text-gray-300">{details.user.last_name}</p>
                                    </div>
                                    <div>
                                      <Label className="text-white font-semibold">Email</Label>
                                      <p className="text-gray-300">{details.user.email}</p>
                                    </div>
                                    <div>
                                      <Label className="text-white font-semibold">City</Label>
                                      <p className="text-gray-300">{details.user.city || 'N/A'}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-white font-semibold">Address</Label>
                                    <p className="text-gray-300">{details.user.address_line1 || 'N/A'}</p>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-white font-semibold">Reports Submitted</Label>
                                      <p className="text-gray-300">{details.reportsCount}</p>
                                    </div>
                                    <div>
                                      <Label className="text-white font-semibold">Pickups Scheduled</Label>
                                      <p className="text-gray-300">{details.pickupsCount}</p>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;