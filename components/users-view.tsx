"use client"

import { useState } from "react"
import { DownloadIcon, MoreHorizontal, RefreshCw, UserPlus } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import DashboardLayout from "./dashboard-layout"

// Mock data for demonstration
const users = [
  {
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
    habits: {
      historyDwell: 35,
      transferDwell: 28,
      dashboardDwell: 90,
      pinSpeed: 1.2,
    },
    anomalies: [
      { type: "pin-speed", severity: "high", timeDetected: "2023-04-15T10:30:00Z" },
      { type: "page-dwell", severity: "medium", timeDetected: "2023-04-14T15:45:00Z" },
    ],
    lastActive: "2 hours ago",
    status: "active",
  },
  {
    id: "2",
    email: "alice.smith@example.com",
    name: "Alice Smith",
    habits: {
      historyDwell: 42,
      transferDwell: 32,
      dashboardDwell: 78,
      pinSpeed: 1.5,
    },
    anomalies: [{ type: "page-dwell", severity: "medium", timeDetected: "2023-04-15T09:20:00Z" }],
    lastActive: "1 day ago",
    status: "active",
  },
  {
    id: "3",
    email: "bob.johnson@example.com",
    name: "Bob Johnson",
    habits: {
      historyDwell: 29,
      transferDwell: 25,
      dashboardDwell: 65,
      pinSpeed: 1.1,
    },
    anomalies: [{ type: "mouse-movements", severity: "low", timeDetected: "2023-04-14T11:15:00Z" }],
    lastActive: "3 days ago",
    status: "inactive",
  },
  {
    id: "4",
    email: "emma.wilson@example.com",
    name: "Emma Wilson",
    habits: {
      historyDwell: 50,
      transferDwell: 40,
      dashboardDwell: 95,
      pinSpeed: 1.8,
    },
    anomalies: [
      { type: "pin-speed", severity: "high", timeDetected: "2023-04-15T14:10:00Z" },
      { type: "mouse-movements", severity: "medium", timeDetected: "2023-04-13T16:30:00Z" },
    ],
    lastActive: "5 hours ago",
    status: "active",
  },
  {
    id: "5",
    email: "michael.brown@example.com",
    name: "Michael Brown",
    habits: {
      historyDwell: 38,
      transferDwell: 30,
      dashboardDwell: 85,
      pinSpeed: 1.3,
    },
    anomalies: [{ type: "page-dwell", severity: "medium", timeDetected: "2023-04-14T13:45:00Z" }],
    lastActive: "1 week ago",
    status: "inactive",
  },
  {
    id: "6",
    email: "sarah.davis@example.com",
    name: "Sarah Davis",
    habits: {
      historyDwell: 45,
      transferDwell: 35,
      dashboardDwell: 88,
      pinSpeed: 1.6,
    },
    anomalies: [],
    lastActive: "3 hours ago",
    status: "active",
  },
  {
    id: "7",
    email: "david.miller@example.com",
    name: "David Miller",
    habits: {
      historyDwell: 33,
      transferDwell: 27,
      dashboardDwell: 72,
      pinSpeed: 1.4,
    },
    anomalies: [{ type: "pin-speed", severity: "medium", timeDetected: "2023-04-12T10:15:00Z" }],
    lastActive: "2 days ago",
    status: "active",
  },
  {
    id: "8",
    email: "jennifer.taylor@example.com",
    name: "Jennifer Taylor",
    habits: {
      historyDwell: 48,
      transferDwell: 38,
      dashboardDwell: 92,
      pinSpeed: 1.7,
    },
    anomalies: [{ type: "page-dwell", severity: "low", timeDetected: "2023-04-11T14:30:00Z" }],
    lastActive: "4 days ago",
    status: "inactive",
  },
]

export default function UsersView({ users }: { users: User[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [anomalyFilter, setAnomalyFilter] = useState<"all" | "has-anomalies" | "no-anomalies">("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())


    const matchesAnomaly =
      anomalyFilter === "all" ||
      (anomalyFilter === "has-anomalies" && user.anomalies.length > 0) ||
      (anomalyFilter === "no-anomalies" && user.anomalies.length === 0)

    return matchesSearch && matchesAnomaly
  })

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Enter the details for the new user account.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Full name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Email address" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage all users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
             
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Habits</TableHead>
                    <TableHead>Anomalies</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div>History: {user.habits.historyDwell}s</div>
                            <div>Dashboard: {user.habits.dashboardDwell}s</div>
                            <div>Pin Speed: {user.habits.pinSpeed}s</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.anomalies.length > 0 ? (
                            <Badge variant="outline" className="font-normal">
                              {user.anomalies.length} detected
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>View anomalies</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Reset anomalies</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
