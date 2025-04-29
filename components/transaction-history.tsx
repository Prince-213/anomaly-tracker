"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  CreditCard,
  Download,
  Filter,
  Home,
  LogOut,
  PieChart,
  Search,
  Settings,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock transaction data
const transactionData = [
  {
    id: 1,
    description: "Grocery Store",
    amount: -85.25,
    date: "2023-03-20",
    category: "Shopping",
    status: "completed",
  },
  { id: 2, description: "Salary Deposit", amount: 3200.0, date: "2023-03-19", category: "Income", status: "completed" },
  {
    id: 3,
    description: "Electric Bill",
    amount: -145.8,
    date: "2023-03-15",
    category: "Utilities",
    status: "completed",
  },
  {
    id: 4,
    description: "Online Shopping",
    amount: -65.99,
    date: "2023-03-14",
    category: "Shopping",
    status: "completed",
  },
  { id: 5, description: "Restaurant", amount: -32.5, date: "2023-03-12", category: "Food", status: "completed" },
  {
    id: 6,
    description: "Gas Station",
    amount: -45.0,
    date: "2023-03-10",
    category: "Transportation",
    status: "completed",
  },
  {
    id: 7,
    description: "Streaming Service",
    amount: -14.99,
    date: "2023-03-08",
    category: "Entertainment",
    status: "completed",
  },
  { id: 8, description: "ATM Withdrawal", amount: -200.0, date: "2023-03-05", category: "Cash", status: "completed" },
  {
    id: 9,
    description: "Mobile Phone Bill",
    amount: -89.99,
    date: "2023-03-03",
    category: "Utilities",
    status: "completed",
  },
  {
    id: 10,
    description: "Freelance Payment",
    amount: 850.0,
    date: "2023-03-01",
    category: "Income",
    status: "completed",
  },
  { id: 11, description: "Gym Membership", amount: -50.0, date: "2023-02-28", category: "Health", status: "completed" },
  { id: 12, description: "Coffee Shop", amount: -4.75, date: "2023-02-25", category: "Food", status: "completed" },
]

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  // Filter transactions based on search term and category
  const filteredTransactions = transactionData.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || transaction.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCategory
  })

  // Get unique categories for filter
  const categories = ["all", ...new Set(transactionData.map((t) => t.category.toLowerCase()))]

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">SecureBank</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/history"
              className="flex items-center gap-3 rounded-lg bg-slate-100 px-3 py-2 text-slate-900 transition-all hover:text-slate-900"
            >
              <PieChart className="h-4 w-4" />
              <span>Transaction History</span>
            </Link>
            <Link
              href="/dashboard/transfer"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900"
            >
              <ArrowRight className="h-4 w-4" />
              <span>Transfer Money</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900"
            >
              <CreditCard className="h-4 w-4" />
              <span>Cards</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-slate-500">Personal Account</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6">
          <Button variant="ghost" size="icon" asChild className="md:hidden">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex flex-1 items-center gap-4">
            <h1 className="text-lg font-semibold">Transaction History</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="outline" size="icon" className="md:hidden">
              <User className="h-4 w-4" />
              <span className="sr-only">Account</span>
            </Button>
          </div>
        </header>

        <main className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and filter your transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Date Range
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{transaction.category}</Badge>
                          </TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell
                            className={`text-right font-medium ${transaction.amount > 0 ? "text-green-600" : ""}`}
                          >
                            {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant={transaction.status === "completed" ? "outline" : "secondary"}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-slate-500">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
