"use client"

import { useState } from "react"
import { AlertTriangle, MoreHorizontal } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

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
  },
]

export default function UserTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Habits</TableHead>
              <TableHead>Anomalies</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
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
                  <div className="flex flex-col gap-1">
                    {user.anomalies.map((anomaly, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <AlertTriangle
                          className={`h-3 w-3 ${
                            anomaly.severity === "high"
                              ? "text-red-500"
                              : anomaly.severity === "medium"
                                ? "text-yellow-500"
                                : "text-blue-500"
                          }`}
                        />
                        <Badge
                          variant={
                            anomaly.severity === "high"
                              ? "destructive"
                              : anomaly.severity === "medium"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {anomaly.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
