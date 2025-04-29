"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for demonstration
function formatDate(date: Date): string {
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}`;
}

function convertUsersToTimeSeriesData(users: User[]): {
  date: string;
  pinSpeed: number;
  pageDwell: number;
  mouseMovements: number;
}[] {
  // Initialize a map to store daily counts
  const dateMap = new Map<
    string,
    {
      pinSpeed: number;
      pageDwell: number;
      mouseMovements: number;
    }
  >();

  // Process all users' anomalies
  users.forEach((user) => {
    user.anomalies.forEach((anomaly) => {
      const date = new Date(anomaly.timeDetected);
      const dateKey = formatDate(date);

      // Initialize date entry if it doesn't exist
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          pinSpeed: 0,
          pageDwell: 0,
          mouseMovements: 0
        });
      }

      const dailyData = dateMap.get(dateKey)!;

      // Increment the appropriate counter
      switch (anomaly.type) {
        case "pin-speed-anomaly":
          dailyData.pinSpeed++;
          break;
        case "page-dwell":
          dailyData.pageDwell++;
          break;
        case "mouse-anomaly":
          dailyData.mouseMovements++;
          break;
      }
    });
  });

  // Convert the map to an array of objects
  const result = Array.from(dateMap.entries())
    .map(([date, counts]) => ({
      date,
      ...counts
    }))
    // Sort by date (assuming your dates are in chronological order)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return result;
}


export default function AnomalyTimelineChart({ users }: { users: User[] }) {

  const data = convertUsersToTimeSeriesData(users);
  
  return (
    <ChartContainer
      config={{
        pinSpeed: {
          label: "Pin Speed Anomalies",
          color: "hsl(0, 84%, 60%)",
        },
        pageDwell: {
          label: "Page Dwell Anomalies",
          color: "hsl(40, 84%, 60%)",
        },
        mouseMovements: {
          label: "Mouse Movement Anomalies",
          color: "hsl(210, 84%, 60%)",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="pinSpeed"
            stackId="1"
            stroke="var(--color-pinSpeed)"
            fill="var(--color-pinSpeed)"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="pageDwell"
            stackId="1"
            stroke="var(--color-pageDwell)"
            fill="var(--color-pageDwell)"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="mouseMovements"
            stackId="1"
            stroke="var(--color-mouseMovements)"
            fill="var(--color-mouseMovements)"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
