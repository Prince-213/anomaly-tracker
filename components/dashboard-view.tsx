"use client"

import { useState } from "react"
import { BarChart3, Clock, MousePointer } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import DashboardLayout from "./dashboard-layout"
import UserHabitsChart from "./charts/user-habits-chart"
import UserActivityLineChart from "./charts/user-activity-line-chart"
import AnomalyDistributionPieChart from "./charts/anomaly-distribution-pie-chart"

// Mock data for demonstration

export default function DashboardView({ users }: { users: User[] }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")

 const mockData = {
   totalUsers: users.length,
   activeUsers: users.filter((user) => user.habits !== undefined).length,
   totalAnomalies: users.reduce(
     (sum, user) => sum + (user.anomalies ? user.anomalies.length : 0),
     0
   ),
   highSeverityAnomalies: users.reduce((sum, user) => {
     return (
       sum +
       (user.anomalies
         ? user.anomalies.filter((anomaly) => anomaly.severity === "high")
             .length
         : 0)
     );
   }, 0)
 };


  return (
    <div className=" w-full ">
      <DashboardLayout>
        <div className="flex items-center justify-between w-full ">
          <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
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
              <CardTitle className="text-3xl">{mockData.totalUsers}</CardTitle>
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
              <CardTitle className="text-3xl">{mockData.activeUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {Math.round((mockData.activeUsers / mockData.totalUsers) * 100)}
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

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Trends</CardTitle>
              <CardDescription>
                Daily active users and session duration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-fit">
                <UserActivityLineChart users={users} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Distribution</CardTitle>
              <CardDescription>Breakdown by type and severity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-fit">
                <AnomalyDistributionPieChart users={users} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Habits Overview</CardTitle>
              <CardDescription>
                Average dwell times and pin speed across all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-fit">
                <UserHabitsChart users={users} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Anomalies</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/anomalies">View All</Link>
            </Button>
          </div>

          <div className="mt-4 grid gap-4">
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
        </div>
      </DashboardLayout>
    </div>
  );
}
