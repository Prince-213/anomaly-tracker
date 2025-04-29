"use client"

import { useState } from "react"
import { BarChart3, Calendar, Clock, Download, MousePointer, RefreshCw } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import DashboardLayout from "./dashboard-layout"
import AnomalyTimelineChart from "./charts/anomaly-timeline-chart"
import AnomalyDistributionPieChart from "./charts/anomaly-distribution-pie-chart"
import { formatTime } from "@/lib/utils"

// Mock data for demonstration


export default function AnomaliesView({ users }: { users: User[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  const anomalies = users.flatMap((user) => {
    if (!user.anomalies || user.anomalies.length === 0) return [];

    return user.anomalies.map((anomaly, index) => {
      // Generate details based on anomaly type
      let details = "";
      switch (anomaly.type) {
        case "pin-speed":
          details = `Pin entry speed ${
            user.habits?.pinSpeed ? `(${user.habits.pinSpeed}s) ` : ""
          }deviates from normal pattern`;
          break;
        case "transfer-dwell":
          details = `Unusual time spent on transfer page ${
            user.habits?.transferDwell ? `(${user.habits.transferDwell}s) ` : ""
          }`;
          break;
        case "dashboard-dwell":
          details = `Abnormal dashboard dwell time ${
            user.habits?.dashboardDwell
              ? `(${user.habits.dashboardDwell}s) `
              : ""
          }`;
          break;
        case "history-dwell":
          details = `Suspicious history page activity ${
            user.habits?.historyDwell ? `(${user.habits.historyDwell}s) ` : ""
          }`;
          break;
        default:
          details = `Unusual ${anomaly.type} pattern detected`;
      }

      return {
        id: parseInt(user.id) * 100 + index + 1, // Generate unique ID
        user: {
          id: user.id,
          name: user.name || "Unknown User",
          email: user.email
        },
        type: anomaly.type,
        severity: anomaly.severity.toLowerCase(),
        timeDetected: anomaly.timeDetected,
        formattedTime: formatTime(anomaly.timeDetected), // You'll need to implement this
        details: details
      };
    });
  });


  const filteredAnomalies = anomalies.filter((anomaly) => {
    const matchesSearch =
      anomaly.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anomaly.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anomaly.details.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || anomaly.type === typeFilter
    const matchesSeverity = severityFilter === "all" || anomaly.severity === severityFilter

    // Date filtering would be implemented here with actual date parsing
    // This is simplified for the example

    return matchesSearch && matchesType && matchesSeverity
  })

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Anomaly Detection</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="list">Anomaly List</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4 text-red-500" />
                  <CardTitle>Pin Speed</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">Anomalies detected</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                  <CardTitle>Page Dwell</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">Anomalies detected</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <MousePointer className="mr-2 h-4 w-4 text-blue-500" />
                  <CardTitle>Mouse Movements</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9</div>
                <p className="text-xs text-muted-foreground">Anomalies detected</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Anomaly Timeline</CardTitle>
                <CardDescription>When anomalies were detected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-fit">
                  <AnomalyTimelineChart users={users} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Anomaly Distribution</CardTitle>
                <CardDescription>By type and severity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AnomalyDistributionPieChart users={users} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>All Anomalies</CardTitle>
              <CardDescription>Filter and analyze detected anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-2">
                  <Input
                    placeholder="Search anomalies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Button variant="outline" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pin-speed">Pin Speed</SelectItem>
                      <SelectItem value="page-dwell">Page Dwell</SelectItem>
                      <SelectItem value="mouse-movements">Mouse Movements</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-[150px] justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                            </>
                          ) : (
                            dateRange.from.toLocaleDateString()
                          )
                        ) : (
                          <span>Date Range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={new Date()}
                        selected={dateRange as { from: Date; to: Date } | undefined}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-4">
                {filteredAnomalies.length === 0 ? (
                  <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                    <p className="text-muted-foreground">No anomalies found matching your filters.</p>
                  </div>
                ) : (
                  filteredAnomalies.map((anomaly) => (
                    <div key={anomaly.id} className="rounded-lg border p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`rounded-full p-2 ${
                              anomaly.severity === "high"
                                ? "bg-red-100 text-red-700"
                                : anomaly.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {anomaly.type === "pin-speed" ? (
                              <BarChart3 className="h-5 w-5" />
                            ) : anomaly.type === "page-dwell" ? (
                              <Clock className="h-5 w-5" />
                            ) : (
                              <MousePointer className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{anomaly.user.name}</h3>
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
                            <div className="text-sm text-muted-foreground">{anomaly.user.email}</div>
                            <div className="mt-1 text-sm">{anomaly.details}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-muted-foreground">{anomaly.formattedTime}</div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
