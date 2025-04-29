"use client";

import type React from "react";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CreditCard,
  Home,
  LogOut,
  PieChart,
  Settings,
  User,
  AlertTriangle,
  X
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useAddAnomaly } from "@/hooks/useAddAnomaly";

// Mock data
const accountData = {
  balance: 12450.75,
  accounts: [
    {
      id: "main",
      name: "Main Account",
      number: "**** 4567",
      balance: 12450.75
    },
    {
      id: "savings",
      name: "Savings Account",
      number: "**** 7890",
      balance: 5280.42
    }
  ],
  recentRecipients: [
    {
      id: 1,
      name: "Jane Smith",
      accountNumber: "**** 1234",
      bank: "Chase Bank"
    },
    {
      id: 2,
      name: "Bob Johnson",
      accountNumber: "**** 5678",
      bank: "Bank of America"
    },
    {
      id: 3,
      name: "Alice Williams",
      accountNumber: "**** 9012",
      bank: "Wells Fargo"
    }
  ]
};

export default function TransferMoney({ userId }: { userId: string }) {
  const [step, setStep] = useState(1);
  const [fromAccount, setFromAccount] = useState(accountData.accounts[0].id);
  const [recipientType, setRecipientType] = useState("new");
  const [recipient, setRecipient] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transferDate, setTransferDate] = useState("now");
  const [showAnomalyWarning, setShowAnomalyWarning] = useState(false);

  const [showPinVerification, setShowPinVerification] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinInputTimes, setPinInputTimes] = useState<number[]>([]);
  const [pinError, setPinError] = useState("");
  const [showPinAnomalyWarning, setShowPinAnomalyWarning] = useState(false);
  const [isPasteDetected, setIsPasteDetected] = useState(false);

  const { addAnomaly } = useAddAnomaly(userId);

  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Mock average PIN input times (in ms) - in a real app, this would come from a database
  const avgPinInputTime = 800; // Average time between PIN inputs
  const minTypingSpeed = 100; // Minimum expected time between keystrokes (ms)
  const maxTypingSpeed = 1500; // Maximum expected time between keystrokes (ms)

  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  const handleContinue = () => {
    if (Number.parseFloat(amount) > 1000) {
      setShowAnomalyWarning(true);
    } else {
      setShowPinVerification(true);
    }
  };

  const detectPaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData("text/plain");
    if (pastedText.length >= 4) {
      setIsPasteDetected(true);
      // In a real app, you might want to prevent the paste or flag it as suspicious
      addAnomaly(`pin-speed-anomaly`, "high");
    }
  };

  const handlePinChange = (index: number, value: string) => {
    const currentTime = Date.now();
    const newPinInputTimes = [...pinInputTimes, currentTime];
    setPinInputTimes(newPinInputTimes);

    // Update PIN value
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Check for paste detection (multiple digits entered at once)
    if (value.length > 1) {
      setIsPasteDetected(true);
      addAnomaly(`pin-speed-anomaly`, "high");
    }

    // Analyze typing speed if we have at least 2 inputs
    if (newPinInputTimes.length >= 2) {
      const lastInputTime = newPinInputTimes[newPinInputTimes.length - 1];
      const prevInputTime = newPinInputTimes[newPinInputTimes.length - 2];
      const timeDiff = lastInputTime - prevInputTime;

      // Check for unusually fast or slow typing
      if (timeDiff < minTypingSpeed || timeDiff > maxTypingSpeed) {
        setShowPinAnomalyWarning(true);
        addAnomaly(`pin-speed-anomaly`, "high");
      }

      // Check for consistent timing (which might indicate automation)
      if (newPinInputTimes.length >= 3) {
        const timeDiffs = [];
        for (let i = 1; i < newPinInputTimes.length; i++) {
          timeDiffs.push(newPinInputTimes[i] - newPinInputTimes[i - 1]);
        }

        // Check if all time differences are nearly identical (within 50ms)
        const allSimilar = timeDiffs.every(
          (diff, i, arr) => i === 0 || Math.abs(diff - arr[0]) < 50
        );

        if (allSimilar && timeDiffs.length >= 2) {
          setShowPinAnomalyWarning(true);
          addAnomaly(`pin-speed-anomaly`, "high");
        }
      }
    }

    // Auto-focus next input
    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }

    // Check if PIN is complete
    if (index === 3 && value) {
      verifyPin(newPin.join(""));
    }
  };

  const verifyPin = (enteredPin: string) => {
    // In a real app, we would verify the PIN with the backend
    if (enteredPin === "1234") {
      // Mock correct PIN
      if (isPasteDetected || showPinAnomalyWarning) {
        // Log the suspicious activity but still allow it for demo purposes
        addAnomaly(`pin-verified-with-anomaly`, "high");
      }
      setShowPinVerification(false);
      setStep(2);
    } else {
      setPinError("Invalid PIN. Please try again.");
      setPin(["", "", "", ""]);
      setPinInputTimes([]);
      setIsPasteDetected(false);
      pinRefs[0].current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Allow backspace to go to previous input
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const resetPinVerification = () => {
    setShowPinVerification(false);
    setPin(["", "", "", ""]);
    setPinInputTimes([]);
    setPinError("");
    setIsPasteDetected(false);
    setShowPinAnomalyWarning(false);
  };

  const handleConfirm = () => {
    setStep(3);
  };

  const handleNewTransfer = () => {
    setStep(1);
    setAmount("");
    setDescription("");
    setRecipient("");
    setAccountNumber("");
    setBankName("");
    setShowAnomalyWarning(false);
  };

  const selectedAccount = accountData.accounts.find(
    (acc) => acc.id === fromAccount
  );

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
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900"
            >
              <PieChart className="h-4 w-4" />
              <span>Transaction History</span>
            </Link>
            <Link
              href="/dashboard/transfer"
              className="flex items-center gap-3 rounded-lg bg-slate-100 px-3 py-2 text-slate-900 transition-all hover:text-slate-900"
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
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-slate-500">Personal Account</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleLogout}
          >
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
            <h1 className="text-lg font-semibold">Transfer Money</h1>
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
          <div className="max-w-2xl mx-auto">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Details</CardTitle>
                  <CardDescription>
                    Enter the details for your money transfer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fromAccount">From Account</Label>
                      <Select
                        value={fromAccount}
                        onValueChange={setFromAccount}
                      >
                        <SelectTrigger id="fromAccount">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountData.accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name} ({account.number}) - $
                              {account.balance.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Recipient</Label>
                      <div className="flex gap-4 mt-2">
                        <Button
                          type="button"
                          variant={
                            recipientType === "new" ? "default" : "outline"
                          }
                          className="flex-1"
                          onClick={() => setRecipientType("new")}
                        >
                          New Recipient
                        </Button>
                        <Button
                          type="button"
                          variant={
                            recipientType === "existing" ? "default" : "outline"
                          }
                          className="flex-1"
                          onClick={() => setRecipientType("existing")}
                        >
                          Existing Recipient
                        </Button>
                      </div>
                    </div>

                    {recipientType === "new" ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="recipient">Recipient Name</Label>
                          <Input
                            id="recipient"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="Enter recipient name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Enter account number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="Enter bank name"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="existingRecipient">
                          Select Recipient
                        </Label>
                        <Select
                          onValueChange={(value) => {
                            const selected = accountData.recentRecipients.find(
                              (r) => r.id.toString() === value
                            );
                            if (selected) {
                              setRecipient(selected.name);
                              setAccountNumber(selected.accountNumber);
                              setBankName(selected.bank);
                            }
                          }}
                        >
                          <SelectTrigger id="existingRecipient">
                            <SelectValue placeholder="Select recipient" />
                          </SelectTrigger>
                          <SelectContent>
                            {accountData.recentRecipients.map((r) => (
                              <SelectItem key={r.id} value={r.id.toString()}>
                                {r.name} - {r.accountNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-slate-500">
                          $
                        </span>
                        <Input
                          id="amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="pl-8"
                        />
                      </div>
                      {selectedAccount && (
                        <p className="text-xs text-slate-500 mt-1">
                          Available balance: $
                          {selectedAccount.balance.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">
                        Description (Optional)
                      </Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a description for this transfer"
                      />
                    </div>

                    <div>
                      <Label htmlFor="transferDate">Transfer Date</Label>
                      <Select
                        value={transferDate}
                        onValueChange={setTransferDate}
                      >
                        <SelectTrigger id="transferDate">
                          <SelectValue placeholder="Select transfer date" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="now">Transfer now</SelectItem>
                          <SelectItem value="tomorrow">Tomorrow</SelectItem>
                          <SelectItem value="schedule">
                            Schedule for later
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {showAnomalyWarning && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Unusual Activity Detected</AlertTitle>
                      <AlertDescription>
                        This transfer amount is higher than your usual
                        transfers. Our monitoring system has flagged this as
                        potentially unusual activity. Please verify this is
                        intentional before proceeding.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                  <Button
                    onClick={handleContinue}
                    disabled={
                      !fromAccount ||
                      !recipient ||
                      !accountNumber ||
                      !bankName ||
                      !amount ||
                      Number.parseFloat(amount) <= 0
                    }
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            )}

            {showPinVerification && (
              <Card className="absolute inset-0 z-10 bg-white">
                <CardHeader>
                  <CardTitle>Verify Your PIN</CardTitle>
                  <CardDescription>
                    Please enter your 4-digit PIN to authorize this transfer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(showPinAnomalyWarning || isPasteDetected) && (
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="flex items-center justify-between">
                        <span className="text-amber-800">
                          {isPasteDetected
                            ? "Paste detected. For security, please type your PIN manually."
                            : "Unusual input pattern detected. Please verify this is you."}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                          onClick={() => {
                            setShowPinAnomalyWarning(false);
                            setIsPasteDetected(false);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-center gap-2">
                    {pin.map((digit, index) => (
                      <Input
                        key={index}
                        ref={pinRefs[index]}
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg"
                        value={digit}
                        onChange={(e) => handlePinChange(index, e.target.value)}
                        onKeyDown={(e) => handlePinKeyDown(index, e)}
                        onPaste={detectPaste}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>

                  {pinError && (
                    <div className="text-sm text-red-500 font-medium text-center">
                      {pinError}
                    </div>
                  )}

                  <div className="text-center text-xs text-slate-500">
                    <p>Demo PIN: 1234</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={resetPinVerification}>
                    Cancel
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Confirm Transfer</CardTitle>
                  <CardDescription>
                    Please review the transfer details before confirming
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">From Account:</span>
                      <span className="font-medium">
                        {selectedAccount?.name} ({selectedAccount?.number})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">To:</span>
                      <span className="font-medium">{recipient}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Account Number:</span>
                      <span className="font-medium">{accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bank:</span>
                      <span className="font-medium">{bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount:</span>
                      <span className="font-medium">
                        ${Number.parseFloat(amount).toLocaleString()}
                      </span>
                    </div>
                    {description && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Description:</span>
                        <span className="font-medium">{description}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transfer Date:</span>
                      <span className="font-medium">
                        {transferDate === "now"
                          ? "Immediate"
                          : transferDate === "tomorrow"
                          ? "Tomorrow"
                          : "Scheduled"}
                      </span>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This transaction is being monitored for security purposes.
                      Please ensure all details are correct.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={handleConfirm}>Confirm Transfer</Button>
                </CardFooter>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Transfer Successful</CardTitle>
                  <CardDescription>
                    Your money transfer has been processed successfully
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Amount:</span>
                        <span className="font-medium">
                          ${Number.parseFloat(amount).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">To:</span>
                        <span className="font-medium">{recipient}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Reference:</span>
                        <span className="font-medium">
                          TRF-{Math.floor(Math.random() * 1000000)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Date:</span>
                        <span className="font-medium">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button className="w-full" asChild>
                    <Link href="/dashboard">Back to Dashboard</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleNewTransfer}
                  >
                    Make Another Transfer
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
