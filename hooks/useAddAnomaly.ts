"use client";

import { useState } from "react";

type AddAnomalyOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useAddAnomaly(userId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addAnomaly = async (
    anomalyType: string,
    anomalySeverity: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/anomalies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          type: anomalyType,
          status: anomalySeverity
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add anomaly");
      }

    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { addAnomaly, isLoading, error };
}
