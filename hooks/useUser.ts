// hooks/useUser.ts
"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookies";

export function useUser() {
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const userData = getCookie("currentUser");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user cookie", error);
      }
    }
  }, []);

  return { user, isLoading: user === null };
}
