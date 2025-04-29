"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

import { MouseTracker, type MouseAnalysisResult } from "@/lib/mouse-tracker";
import { useAddAnomaly } from "@/hooks/useAddAnomaly";
import { toast } from "sonner";
import { Mouse } from "lucide-react";

type MouseTrackingContextType = {
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  lastAnalysisResult: MouseAnalysisResult | null;
};

const MouseTrackingContext = createContext<
  MouseTrackingContextType | undefined
>(undefined);

export function useMouseTracking() {
  const context = useContext(MouseTrackingContext);
  if (context === undefined) {
    throw new Error(
      "useMouseTracking must be used within a MouseTrackingProvider"
    );
  }
  return context;
}

export function MouseTrackingProvider({
  children,
  userId
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const [isTracking, setIsTracking] = useState(true);
  const [lastAnalysisResult, setLastAnalysisResult] =
    useState<MouseAnalysisResult | null>(null);
  const trackerRef = useRef<MouseTracker | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastAlertTimeRef = useRef<number>(0);
  const { addAnomaly } = useAddAnomaly(userId);

  // Initialize the tracker
  useEffect(() => {
    trackerRef.current = new MouseTracker(1000, 20);
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);

  const startTracking = () => {
    if (!isTracking) {
      setIsTracking(true);
    }
  };

  const stopTracking = () => {
    if (isTracking) {
      setIsTracking(false);
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    }
  };

  const recordAnomaly = (result: MouseAnalysisResult, severity: string) => {
    const anomalyData = {
      type: "suspicious_mouse_movement",
      severity,
      timestamp: new Date().toISOString()
    };

    addAnomaly(`unusal mouse movement`, severity);
  };

  useEffect(() => {
    if (!isTracking || !trackerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (trackerRef.current) {
        trackerRef.current.addPoint(e.clientX, e.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    analysisIntervalRef.current = setInterval(() => {
      if (trackerRef.current) {
        const result = trackerRef.current.analyze();
        setLastAnalysisResult(result);

        const now = Date.now();
        const timeSinceLastAlert = now - lastAlertTimeRef.current;
        const minimumAlertInterval = 30000;

        if (
          result.isSuspicious &&
          result.segments.length > 10 &&
          result.suspiciousPatterns.length >= 2 &&
          timeSinceLastAlert > minimumAlertInterval
        ) {
          let severity = "low";
          let variant: "default" | "destructive" | "secondary" = "secondary";

          if (result.naturalMovementScore < 0.2) {
            severity = "high";
            variant = "destructive";
          } else if (result.naturalMovementScore < 0.3) {
            severity = "medium";
            variant = "default";
          }

          // Show toast notification
         

          toast.warning(`Suspicious Mouse Movement Detected (${severity})`, {
            description: result.suspiciousPatterns.join(". "),
            duration: 3000,
            icon: <Mouse />
          });

           addAnomaly(`mouse-anomaly`, severity );

          lastAlertTimeRef.current = now;
          console.log("Suspicious mouse movement detected:", result);
        }
      }
    }, 10000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, [isTracking, userId, addAnomaly]);

  return (
    <MouseTrackingContext.Provider
      value={{
        isTracking,
        startTracking,
        stopTracking,
        lastAnalysisResult
      }}
    >
      {children}
    </MouseTrackingContext.Provider>
  );
}
