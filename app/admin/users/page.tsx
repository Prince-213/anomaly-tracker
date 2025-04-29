import type { Metadata } from "next"
import UsersView from "@/components/users-view"
import { getAllData } from "@/lib/action";

export const metadata: Metadata = {
  title: "Users | Admin Dashboard",
  description: "User Management and Analytics",
}

export default async function UsersPage() {

  const usersData = await getAllData();
  
  return <UsersView users={usersData} />
}
