import type { Metadata } from "next"
import DashboardView from "@/components/dashboard-view"
import { getAllData } from "@/lib/action"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "User Analytics Dashboard",
}

export default async function DashboardPage() {

  const usersData = await getAllData()


  return <>{usersData && <DashboardView users={usersData} />}</>;
}
