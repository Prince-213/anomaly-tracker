"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for demonstration
function convertUsersToSummaryData(users: User[]): {
  name: string;
  value: number;
  color: string;
}[] {
  // Initialize counters for each anomaly type
  const anomalyCounts = {
    "pin-speed-anomaly": 0,
    "page-dwell": 0,
    "mouse-anomaly": 0
  };

  // Count all anomalies from all users
  users.forEach((user) => {
    user.anomalies.forEach((anomaly) => {
      if (anomaly.type in anomalyCounts) {
        anomalyCounts[anomaly.type]++;
      }
    });
  });

  // Convert to the desired format
  return [
    {
      name: "Pin Speed",
      value: anomalyCounts["pin-speed-anomaly"],
      color: "hsl(0, 84%, 60%)"
    },
    {
      name: "Page Dwell",
      value: anomalyCounts["page-dwell"],
      color: "hsl(40, 84%, 60%)"
    },
    {
      name: "Mouse Movements",
      value: anomalyCounts["mouse-anomaly"],
      color: "hsl(210, 84%, 60%)"
    }
  ];
}

export default function AnomalyTypesChart({ users }: { users: User[] }) {

  const data = convertUsersToSummaryData(users);
  
  return (
    <ChartContainer
      config={{
        pinSpeed: {
          label: "Pin Speed",
          color: "hsl(0, 84%, 60%)",
        },
        pageDwell: {
          label: "Page Dwell",
          color: "hsl(40, 84%, 60%)",
        },
        mouseMovements: {
          label: "Mouse Movements",
          color: "hsl(210, 84%, 60%)",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
