"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for demonstration
function convertUsersToIndividualMetrics(users: User[]): {
  name: string;
  historyDwell: number;
  transferDwell: number;
  dashboardDwell: number;
  pinSpeed: number;
}[] {
  return users.map((user) => ({
    name: user.name || `User ${user.id.slice(0, 4)}`, // Fallback to "User [ID]" if name is missing
    historyDwell: user.habits.historyDwell,
    transferDwell: user.habits.transferDwell,
    dashboardDwell: user.habits.dashboardDwell,
    pinSpeed: user.habits.pinSpeed
  }));
}

export default function UserHabitsChart({ users }: { users: User[] }) {

  const data = convertUsersToIndividualMetrics(users);
  return (
    <ChartContainer
      config={{
        historyDwell: {
          label: "History Dwell Time (s)",
          color: "hsl(var(--chart-1))",
        },
        transferDwell: {
          label: "Transfer Dwell Time (s)",
          color: "hsl(var(--chart-2))",
        },
        dashboardDwell: {
          label: "Dashboard Dwell Time (s)",
          color: "hsl(var(--chart-3))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" angle={-45} textAnchor="end" tick={{ fontSize: 12 }} height={60} />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="historyDwell" fill="var(--color-historyDwell)" name="History Dwell Time (s)" />
          <Bar dataKey="transferDwell" fill="var(--color-transferDwell)" name="Transfer Dwell Time (s)" />
          <Bar dataKey="dashboardDwell" fill="var(--color-dashboardDwell)" name="Dashboard Dwell Time (s)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
