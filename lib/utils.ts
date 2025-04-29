import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Helper function to format time (you may need to adjust this)
export function formatTime(dateTime: string): string {
  const now = new Date();
  const detected = new Date(dateTime);
  const diffMs = now.getTime() - detected.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return "less than an hour ago";
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}
