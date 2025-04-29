"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for demonstration
function convertUsersToAnomalyData(
  users: User[]
): { name: string; value: number; color: string }[] {
  // Initialize counters for each anomaly type and severity
  const anomalyCounts: Record<string, { high: number; low: number }> = {
    "pin-speed-anomaly": { high: 0, low: 0 },
    "page-dwell": { high: 0, low: 0 },
    "mouse-anomaly": { high: 0, low: 0 }
  };

  // Count anomalies from all users
  users.forEach((user) => {
    user.anomalies.forEach((anomaly) => {
      const type = anomaly.type;
      const severity = anomaly.severity.toLowerCase();

      if (anomalyCounts[type]) {
        if (severity === "high") {
          anomalyCounts[type].high++;
        } else if (severity === "low") {
          anomalyCounts[type].low++;
        }
      }
    });
  });

  // Convert the counts to the desired format with proper display names
  const result = [
    {
      name: "Pin Speed (High)",
      value: anomalyCounts["pin-speed-anomaly"].high,
      color: "hsl(0, 84%, 60%)"
    },
    {
      name: "Pin Speed (Medium)",
      value: anomalyCounts["pin-speed-anomaly"].low,
      color: "hsl(0, 84%, 75%)"
    },
    {
      name: "Page Dwell (High)",
      value: anomalyCounts["page-dwell"].high,
      color: "hsl(40, 84%, 60%)"
    },
    {
      name: "Page Dwell (Medium)",
      value: anomalyCounts["page-dwell"].low,
      color: "hsl(40, 84%, 75%)"
    },
    {
      name: "Mouse Anomaly (High)",
      value: anomalyCounts["mouse-anomaly"].high,
      color: "hsl(210, 84%, 60%)"
    },
    {
      name: "Mouse Anomaly (Low)",
      value: anomalyCounts["mouse-anomaly"].low,
      color: "hsl(210, 84%, 75%)"
    }
  ];

  return result;
}

export default function AnomalyDistributionPieChart({ users }: { users: User[] }) {

  const data = convertUsersToAnomalyData(users);
  return (
    <ChartContainer
      config={{
        pinSpeedHigh: {
          label: "Pin Speed (High)",
          color: "hsl(0, 84%, 60%)",
        },
        pinSpeedMedium: {
          label: "Pin Speed (Low)",
          color: "hsl(0, 84%, 75%)",
        },
        pageDwellHigh: {
          label: "Page Dwell (High)",
          color: "hsl(40, 84%, 60%)",
        },
        pageDwellMedium: {
          label: "Page Dwell (Low)",
          color: "hsl(40, 84%, 75%)",
        },
        mouseMovementsHigh: {
          label: "Mouse Movements (High)",
          color: "hsl(210, 84%, 60%)",
        },
        mouseMovementsMedium: {
          label: "Mouse Movements (Low)",
          color: "hsl(210, 84%, 75%)",
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
