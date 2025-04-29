"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAddAnomaly } from "@/hooks/useAddAnomaly";
import { Globe } from "lucide-react";
import { toast } from "sonner";

// Mock user behavior data - in a real app, this would come from a database
const userBehaviorData = {
  avgPageDwellTimes: {
    "/dashboard": 120000, // 2 minutes on dashboard
    "/dashboard/history": 90000, // 1.5 minutes on history
    "/dashboard/transfer": 180000 // 3 minutes on transfer
  }
};

export function PageDwellTracker({ userId }: { userId: string }) {
  const pathname = usePathname();
  const pageLoadTime = useRef(Date.now());
  const hasShownAlert = useRef(false);

  const { addAnomaly } = useAddAnomaly(userId);

  // Reset timer when path changes
  useEffect(() => {
    const prevPath = pageLoadTime.current;
    pageLoadTime.current = Date.now();
    hasShownAlert.current = false;

    // On unmount of previous page, check dwell time
    return () => {
      const dwellTime = Date.now() - prevPath;
      const avgDwellTime =
        userBehaviorData.avgPageDwellTimes[
          pathname as keyof typeof userBehaviorData.avgPageDwellTimes
        ] || 60000;

      // Check if dwell time is significantly different from average (80% threshold)
      const dwellTimeDiff = Math.abs(dwellTime - avgDwellTime);
      const isDwellTimeAnomaly = dwellTimeDiff > avgDwellTime * 0.8;

      if (
        isDwellTimeAnomaly &&
        dwellTime < avgDwellTime &&
        !hasShownAlert.current
      ) {
        // Only alert if the user left too quickly
        const severity =
          dwellTime < avgDwellTime * 0.3
            ? "high"
            : dwellTime < avgDwellTime * 0.5
            ? "medium"
            : "low";
        const variant: "default" | "destructive" | "secondary" =
          severity === "high"
            ? "destructive"
            : severity === "medium"
            ? "default"
            : "secondary";

        toast.warning(`Unusual Page Dwell Time (${severity})`, {
          description: `You navigated away from the page much faster than usual. This could indicate automated behavior.`,

          duration: 5000,
          icon: <Globe />
        });

        addAnomaly("page-dwell", `${severity}`);

        console.log("page anomaly");

        hasShownAlert.current = true;
      }
    };
  }, [pathname]);

  return null;
}
