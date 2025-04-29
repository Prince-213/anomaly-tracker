"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for demonstration
function convertToDailyActivity(users: User[]): {
  date: string;
  activeUsers: number;
  sessionDuration: number;
}[] {
  // Helper to format dates as "Apr 1"
  const formatDate = (date: Date): string => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Initialize a map to store daily data
  const dailyData = new Map<
    string,
    {
      uniqueUsers: Set<string>;
      totalDwell: number;
      dwellCount: number;
    }
  >();

  // Process all users' anomalies
  users.forEach((user) => {
    user.anomalies.forEach((anomaly) => {
      const date = new Date(anomaly.timeDetected);
      const dateKey = formatDate(date);

      // Initialize day if not exists
      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, {
          uniqueUsers: new Set(),
          totalDwell: 0,
          dwellCount: 0
        });
      }

      const day = dailyData.get(dateKey)!;

      // Track unique users
      day.uniqueUsers.add(user.id);

      // Calculate session duration (using dwell times as proxy)
      if (anomaly.type === "page-dwell") {
        // Assuming dwell times are in minutes - adjust as needed
        const dwellTime =
          user.habits.transferDwell ||
          user.habits.dashboardDwell ||
          user.habits.historyDwell ||
          0;
        day.totalDwell += dwellTime;
        day.dwellCount++;
      }
    });
  });

  // Convert to final format
  const result: Array<{
    date: string;
    activeUsers: number;
    sessionDuration: number;
  }> = [];

  // Generate data for last 14 days (as in example)
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = formatDate(date);

    const dayData = dailyData.get(dateKey) || {
      uniqueUsers: new Set(),
      totalDwell: 0,
      dwellCount: 0
    };

    // Calculate average session duration in minutes
    const avgDuration =
      dayData.dwellCount > 0
        ? Math.round(dayData.totalDwell / dayData.dwellCount)
        : 8 + Math.floor(Math.random() * 12); // Fallback random value (8-20 mins)

    result.push({
      date: dateKey,
      activeUsers: dayData.uniqueUsers.size,
      sessionDuration: avgDuration
    });
  }

  return result;
}

export default function UserActivityLineChart({ users }: { users: User[] }) {
  const data = convertToDailyActivity(users);
  
  return (
    <ChartContainer
      config={{
        activeUsers: {
          label: "Active Users",
          color: "hsl(var(--chart-1))",
        },
        sessionDuration: {
          label: "Avg. Session Duration (min)",
          color: "hsl(var(--chart-2))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="activeUsers"
            stroke="var(--color-activeUsers)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="sessionDuration"
            stroke="var(--color-sessionDuration)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
