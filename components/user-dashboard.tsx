"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  CreditCard,
  DollarSign,
  Home,
  LogOut,
  PieChart,
  Settings,
  User,
  AlertTriangle,
  X,
  MousePointer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MouseTracker } from "@/lib/mouse-tracker";
import { logoutUser } from "@/lib/action";

// Mock data
const accountData = {
  name: "John Doe",
  balance: 12450.75,
  accountNumber: "**** **** **** 4567",
  savingsGoal: 20000,
  recentTransactions: [
    {
      id: 1,
      description: "Grocery Store",
      amount: -85.25,
      date: "Today",
      status: "completed"
    },
    {
      id: 2,
      description: "Salary Deposit",
      amount: 3200.0,
      date: "Yesterday",
      status: "completed"
    },
    {
      id: 3,
      description: "Electric Bill",
      amount: -145.8,
      date: "Mar 15, 2023",
      status: "completed"
    },
    {
      id: 4,
      description: "Online Shopping",
      amount: -65.99,
      date: "Mar 14, 2023",
      status: "completed"
    },
    {
      id: 5,
      description: "Restaurant",
      amount: -32.5,
      date: "Mar 12, 2023",
      status: "completed"
    }
  ],
  upcomingPayments: [
    { id: 1, description: "Rent", amount: 1200.0, date: "Mar 30, 2023" },
    { id: 2, description: "Car Insurance", amount: 175.5, date: "Apr 05, 2023" }
  ]
};

// Mock user behavior data
const userBehaviorData = {
  avgPageDwellTimes: {
    dashboard: 120000, // 2 minutes
    history: 90000, // 1.5 minutes
    transfer: 180000 // 3 minutes
  },
  mouseMovementPatterns: {
    avgSpeed: 300, // pixels per second
    avgDistance: 1200, // pixels
    avgEntropy: 0.7, // 0-1 scale, higher is more random/natural
    avgStraightness: 0.5 // 0-1 scale, higher is straighter
  },
  navigationPatterns: {
    commonSequence: ["dashboard", "history", "dashboard", "transfer"]
  }
};

export default function UserDashboard() {
  const [showMonitoringAlert, setShowMonitoringAlert] = useState(true);
  const [showBehaviorAlert, setShowBehaviorAlert] = useState(false);
  const [showMouseAlert, setShowMouseAlert] = useState(false);
  const router = useRouter();

  // Page dwell time tracking
  const pageLoadTime = useRef(Date.now());
  const [inactivityTime, setInactivityTime] = useState(0);
  const lastMouseActivity = useRef(Date.now());

  // Mouse tracking
  const mouseTracker = useRef<MouseTracker | null>(null);
  const mouseAnalysisInterval = useRef<NodeJS.Timeout | null>(null);
  const [mouseAnalysisResult, setMouseAnalysisResult] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize mouse tracker
  useEffect(() => {
    mouseTracker.current = new MouseTracker(
      500, // max points
      20, // segment size
      {
        avgSpeed: userBehaviorData.mouseMovementPatterns.avgSpeed,
        avgEntropy: userBehaviorData.mouseMovementPatterns.avgEntropy,
        avgStraightness: userBehaviorData.mouseMovementPatterns.avgStraightness
      }
    );

    // Set up mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseTracker.current) {
        mouseTracker.current.addPoint(e.clientX, e.clientY);
      }
      lastMouseActivity.current = Date.now();
    };

    // Set up periodic analysis
    mouseAnalysisInterval.current = setInterval(() => {
      if (mouseTracker.current) {
        const result = mouseTracker.current.analyze();
        setMouseAnalysisResult(result);

        // Show alert if suspicious AND has enough data AND multiple suspicious patterns
        if (
          result.isSuspicious &&
          result.segments.length > 10 && // Require more segments (was 5)
          result.suspiciousPatterns.length >= 2 && // Require at least 2 suspicious patterns
          result.naturalMovementScore < 0.3 // Require a lower natural movement score (more suspicious)
        ) {
          setShowMouseAlert(true);

          // Log to console for debugging
          console.log("Suspicious mouse movement detected:", result);

          // In a real app, we would send this to the server for logging
          // sendToServer('/api/security/mouse-anomaly', result);
        }
      }
    }, 10000); // Analyze every 10 seconds instead of 5 seconds

    window.addEventListener("mousemove", handleMouseMove);

    // Inactivity check interval
    const inactivityInterval = setInterval(() => {
      const currentInactivity = Date.now() - lastMouseActivity.current;
      setInactivityTime(currentInactivity);

      // Check for unusual inactivity (more than 2 minutes instead of 30 seconds)
      if (currentInactivity > 120000) {
        // This could be an anomaly - user left page open without interaction
        setShowBehaviorAlert(true);
      }
    }, 5000); // Check every 5 seconds

    return () => {
      // Calculate total dwell time when component unmounts
      const dwellTime = Date.now() - pageLoadTime.current;

      // In a real app, we would send this to the server to compare with the user's average
      console.log(`Dashboard dwell time: ${dwellTime}ms`);

      // Check if dwell time is significantly different from average
      const avgDwellTime = userBehaviorData.avgPageDwellTimes.dashboard;
      const dwellTimeDiff = Math.abs(dwellTime - avgDwellTime);
      const isDwellTimeAnomaly = dwellTimeDiff > avgDwellTime * 0.8; // 80% threshold (was 50%)

      if (isDwellTimeAnomaly) {
        // In a real app, we would log this anomaly
        console.log("Anomaly detected: Unusual dashboard dwell time");
      }

      // Clean up
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(inactivityInterval);

      if (mouseAnalysisInterval.current) {
        clearInterval(mouseAnalysisInterval.current);
      }
    };
  }, []);

  // Draw mouse movement visualization when canvas or analysis result changes
  useEffect(() => {
    if (canvasRef.current && mouseTracker.current && mouseAnalysisResult) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Set canvas size to match its display size
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // Import the visualization function
        import("@/lib/mouse-tracker").then(
          ({ createMouseMovementVisualization }) => {
            createMouseMovementVisualization(
              canvas,
              mouseTracker.current!.getPoints(),
              mouseTracker.current!.getSegments()
            );
          }
        );
      }
    }
  }, [mouseAnalysisResult]);

  const handleLogout = () => {
    router.push("/");
  };

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
              className="flex items-center gap-3 rounded-lg bg-slate-100 px-3 py-2 text-slate-900 transition-all hover:text-slate-900"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/history"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900"
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
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="User"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{accountData.name}</p>
              <p className="text-xs text-slate-500">Personal Account</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={logoutUser}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6">
          <div className="flex flex-1 items-center gap-4">
            <h1 className="text-lg font-semibold">Dashboard</h1>
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

        <main className="grid gap-6 p-6">
          {/* Account Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Current Balance</CardDescription>
                <CardTitle className="text-3xl">
                  ${accountData.balance.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-slate-500">
                  Account Number: {accountData.accountNumber}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Add Funds
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Savings Goal</CardDescription>
                <CardTitle className="flex justify-between">
                  <span>${accountData.balance.toLocaleString()}</span>
                  <span className="text-slate-400">
                    of ${accountData.savingsGoal.toLocaleString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <Progress
                  value={(accountData.balance / accountData.savingsGoal) * 100}
                  className="h-2"
                />
                <p className="mt-2 text-xs text-slate-500">
                  {Math.round(
                    (accountData.balance / accountData.savingsGoal) * 100
                  )}
                  % of your goal
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Adjust Goal
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Upcoming Payments</CardDescription>
                <CardTitle>
                  {accountData.upcomingPayments.length} Payments Due
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {accountData.upcomingPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex justify-between text-sm"
                    >
                      <span>{payment.description}</span>
                      <span className="font-medium">
                        ${payment.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your recent account activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="incoming">Incoming</TabsTrigger>
                  <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  {accountData.recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-full p-2 ${
                            transaction.amount > 0
                              ? "bg-green-100"
                              : "bg-slate-100"
                          }`}
                        >
                          {transaction.amount > 0 ? (
                            <DollarSign className="h-4 w-4 text-green-600" />
                          ) : (
                            <CreditCard className="h-4 w-4 text-slate-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-slate-500">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            transaction.amount > 0
                              ? "text-green-600"
                              : "text-slate-900"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount.toLocaleString()}
                        </span>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "outline"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="incoming" className="space-y-4">
                  {accountData.recentTransactions
                    .filter((t) => t.amount > 0)
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-full p-2 bg-green-100">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-slate-500">
                              {transaction.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-green-600">
                            +{transaction.amount.toLocaleString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </TabsContent>
                <TabsContent value="outgoing" className="space-y-4">
                  {accountData.recentTransactions
                    .filter((t) => t.amount < 0)
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-full p-2 bg-slate-100">
                            <CreditCard className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-slate-500">
                              {transaction.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">
                            {transaction.amount.toLocaleString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/history">View All Transactions</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Mouse Movement Visualization (Hidden in normal view, visible for admins/debugging) */}
          <div className="hidden">
            <Card>
              <CardHeader>
                <CardTitle>Mouse Movement Analysis</CardTitle>
                <CardDescription>
                  Visualization of mouse movement patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <canvas
                  ref={canvasRef}
                  className="w-full h-[200px] border border-slate-200 rounded-md bg-slate-50"
                ></canvas>

                {mouseAnalysisResult && (
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-medium">
                          Natural Movement Score:
                        </span>{" "}
                        <span
                          className={
                            mouseAnalysisResult.naturalMovementScore < 0.4
                              ? "text-red-500"
                              : "text-green-500"
                          }
                        >
                          {(
                            mouseAnalysisResult.naturalMovementScore * 100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Average Speed:</span>{" "}
                        {mouseAnalysisResult.averageSpeed.toFixed(1)} px/s
                      </div>
                      <div>
                        <span className="font-medium">Straightness:</span>{" "}
                        <span
                          className={
                            mouseAnalysisResult.overallStraightness > 0.85
                              ? "text-red-500"
                              : "text-slate-700"
                          }
                        >
                          {(
                            mouseAnalysisResult.overallStraightness * 100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Entropy:</span>{" "}
                        <span
                          className={
                            mouseAnalysisResult.overallEntropy < 0.3
                              ? "text-red-500"
                              : "text-slate-700"
                          }
                        >
                          {(mouseAnalysisResult.overallEntropy * 100).toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>
                    </div>

                    {mouseAnalysisResult.suspiciousPatterns.length > 0 && (
                      <div>
                        <span className="font-medium">
                          Suspicious Patterns:
                        </span>
                        <ul className="list-disc list-inside text-red-500 mt-1">
                          {mouseAnalysisResult.suspiciousPatterns.map(
                            (pattern: string, index: number) => (
                              <li key={index}>{pattern}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Monitoring Alerts */}
          {showMonitoringAlert && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-amber-800">
                  Your account is being monitored for security purposes. Unusual
                  activity will be flagged.
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                  onClick={() => setShowMonitoringAlert(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Behavioral Anomaly Alert */}
          {showBehaviorAlert && (
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-red-800">
                  Unusual account behavior detected. Extended inactivity may
                  indicate your session is unattended.
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-600 hover:text-red-800 hover:bg-red-100"
                  onClick={() => setShowBehaviorAlert(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Mouse Movement Anomaly Alert */}
          {showMouseAlert && (
            <Alert className="bg-red-50 border-red-200">
              <MousePointer className="h-4 w-4 text-red-600" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-red-800">
                  Unusual mouse movement pattern detected. This may indicate
                  automated activity or unauthorized access.
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-600 hover:text-red-800 hover:bg-red-100"
                  onClick={() => setShowMouseAlert(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </main>
      </div>
    </div>
  );
}
