"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Home,
  LogOutIcon,
  MousePointer,
  Search,
  Settings,
  Users
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from "@/components/ui/sidebar";

import UserHabitsChart from "./charts/user-habits-chart";
import AnomalyTimelineChart from "./charts/anomaly-timeline-chart";
import AnomalyTypesChart from "./charts/anomaly-types-chart";
import UserTable from "./user-table";
import { logoutAdmin } from "@/lib/action";

// Mock data for demonstration
const mockData = {
  totalUsers: 128,
  activeUsers: 87,
  totalAnomalies: 42,
  highSeverityAnomalies: 12
};

export default function AdminDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex h-14 items-center border-b px-4">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <AlertTriangle className="h-4 w-4" />
                  <span>Anomalies</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Activity className="h-4 w-4" />
                  <span>Activity</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <Button
              className=" w-full flex items-center space-x-4 "
              variant={"outline"}
              onClick={logoutAdmin}
            >
              <LogOutIcon />
              <p>Logout</p>
            </Button>
            <div className="text-xs text-muted-foreground">
              Admin Portal v1.0
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            </div>
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </header>

          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">User Analytics</h1>
              <div className="flex items-center gap-2">
                <Select
                  value={selectedTimeframe}
                  onValueChange={setSelectedTimeframe}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Users</CardDescription>
                  <CardTitle className="text-3xl">
                    {mockData.totalUsers}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +12 from last week
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Users</CardDescription>
                  <CardTitle className="text-3xl">
                    {mockData.activeUsers}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(
                      (mockData.activeUsers / mockData.totalUsers) * 100
                    )}
                    % of total users
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Anomalies</CardDescription>
                  <CardTitle className="text-3xl">
                    {mockData.totalAnomalies}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Across all users
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>High Severity</CardDescription>
                  <CardTitle className="text-3xl">
                    {mockData.highSeverityAnomalies}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Requires attention
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="habits" className="mt-6">
              <TabsList>
                <TabsTrigger value="habits">User Habits</TabsTrigger>
                <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
                <TabsTrigger value="users">User List</TabsTrigger>
              </TabsList>

              <TabsContent value="habits" className="space-y-6">
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>User Habits Overview</CardTitle>
                    <CardDescription>
                      Average dwell times and pin speed across all users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <UserHabitsChart />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <CardTitle>History Dwell</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">42s</div>
                      <p className="text-xs text-muted-foreground">
                        Average time spent on history pages
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <CardTitle>Dashboard Dwell</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">87s</div>
                      <p className="text-xs text-muted-foreground">
                        Average time spent on dashboard
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" />
                        <CardTitle>Pin Speed</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1.2s</div>
                      <p className="text-xs text-muted-foreground">
                        Average pin entry speed
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="anomalies" className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Anomaly Detection</h2>
                    <p className="text-sm text-muted-foreground">
                      Unusual user behavior detected by the system
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer">
                      All
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer bg-red-50"
                    >
                      Pin Speed
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer bg-yellow-50"
                    >
                      Page Dwell
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer bg-blue-50"
                    >
                      Mouse Movements
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Anomaly Timeline</CardTitle>
                      <CardDescription>
                        When anomalies were detected
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <AnomalyTimelineChart />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Anomaly Types</CardTitle>
                      <CardDescription>
                        Distribution by type and severity
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <AnomalyTypesChart />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Anomalies</CardTitle>
                    <CardDescription>
                      Latest detected unusual behaviors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          id: 1,
                          user: "john.doe@example.com",
                          type: "pin-speed",
                          severity: "high",
                          time: "2 hours ago",
                          icon: <BarChart3 className="h-4 w-4" />
                        },
                        {
                          id: 2,
                          user: "alice.smith@example.com",
                          type: "page-dwell",
                          severity: "medium",
                          time: "5 hours ago",
                          icon: <Clock className="h-4 w-4" />
                        },
                        {
                          id: 3,
                          user: "bob.johnson@example.com",
                          type: "mouse-movements",
                          severity: "low",
                          time: "1 day ago",
                          icon: <MousePointer className="h-4 w-4" />
                        },
                        {
                          id: 4,
                          user: "emma.wilson@example.com",
                          type: "pin-speed",
                          severity: "high",
                          time: "1 day ago",
                          icon: <BarChart3 className="h-4 w-4" />
                        },
                        {
                          id: 5,
                          user: "michael.brown@example.com",
                          type: "page-dwell",
                          severity: "medium",
                          time: "2 days ago",
                          icon: <Clock className="h-4 w-4" />
                        }
                      ].map((anomaly) => (
                        <div
                          key={anomaly.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`rounded-full p-2 ${
                                anomaly.severity === "high"
                                  ? "bg-red-100 text-red-700"
                                  : anomaly.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {anomaly.icon}
                            </div>
                            <div>
                              <div className="font-medium">{anomaly.user}</div>
                              <div className="text-sm text-muted-foreground">
                                {anomaly.type} - {anomaly.time}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={
                              anomaly.severity === "high"
                                ? "destructive"
                                : anomaly.severity === "medium"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {anomaly.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>User List</CardTitle>
                    <CardDescription>
                      All registered users and their activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserTable />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
