import { PageDwellTracker } from "@/components/page-dwell-tracker";
import UserDashboard from "@/components/user-dashboard";
import { userData } from "@/lib/action"
import { cookies } from "next/headers";


export default async function DashboardPage() {
  // In a real app, this would come from authentication

  const cookieStore = await cookies()
  const id = cookieStore.get("id")?.value ?? ""
  

  const data = await userData(id) 

  console.log(data)

 

  const user = {
    id: `${data?.id}`,
    name: `${data?.name}`,
    email: `${data?.email}`,
    balance: 5280.42,
    currency: "USD",
    accountNumber: "****4321",
    recentTransactions: [
      {
        id: 1,
        type: "deposit",
        amount: 1200,
        date: "2023-03-15",
        description: "Salary"
      },
      {
        id: 2,
        type: "withdrawal",
        amount: 450,
        date: "2023-03-12",
        description: "Rent"
      },
      {
        id: 3,
        type: "transfer",
        amount: 120,
        date: "2023-03-10",
        description: "Utilities"
      }
    ]
  };

  // User's average dwell times for different pages
  const userAverageDwellTimes = {
    dashboard: data?.habits.dashboardDwell ?? 120000, // 3 minutes
    history: data?.habits.historyDwell ?? 120000, // 2 minutes
    transfer: data?.habits.transferDwell ?? 120000 // 4 minutes
  };

  return (
    <>
      <UserDashboard user={user} />
      {data && (
        <PageDwellTracker
          userId={user.id}
          averageDwellTimes={userAverageDwellTimes}
        />
      )}
    </>
  );
}
