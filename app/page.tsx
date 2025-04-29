"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, BarChart2, Lock, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"user" | "admin" | null>(
    null
  );

  const route = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 flex items-center justify-center gap-2">
          <BarChart2 className="h-8 w-8 text-blue-600" />
          Intellidectect
        </h1>
        <p className="mt-2 text-slate-600 max-w-md">
          Advanced anomaly detection for optimized system performance
        </p>
      </motion.div>

      {!selectedRole ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl"
        >
          <RoleCard
            title="User Login"
            description="Access dashboard and reports"
            icon={<User className="h-6 w-6" />}
            onClick={() => route.push("/userlogin")}
          />
          <RoleCard
            title="Admin Login"
            description="Configure and manage system"
            icon={<Shield className="h-6 w-6" />}
            onClick={() => route.push("/adminlogin")}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedRole === "user" ? (
                  <User className="h-5 w-5 text-blue-600" />
                ) : (
                  <Shield className="h-5 w-5 text-blue-600" />
                )}
                {selectedRole === "user" ? "User Login" : "Admin Login"}
              </CardTitle>
              <CardDescription>
                Enter your credentials to access the{" "}
                {selectedRole === "user" ? "user" : "admin"} portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@company.com" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="p-0 h-auto text-xs">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Input id="password" type="password" />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full">
                Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="text-sm"
                onClick={() => setSelectedRole(null)}
              >
                Back to selection
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function RoleCard({ title, description, icon, onClick }: RoleCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-blue-50 text-blue-600">
              {icon}
            </div>
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="ghost" className="w-full justify-between group">
            Continue
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
