import type { Metadata } from "next"
import AnomaliesView from "@/components/anomalies-view"
import { getAllData, userData } from '../../../lib/action';

export const metadata: Metadata = {
  title: "Anomalies | Admin Dashboard",
  description: "Anomaly Detection and Analysis",
}

export default async function AnomaliesPage() {

  const userData = await getAllData()

  return <AnomaliesView users={userData} />
}
