"use client";

import LoginForm from "@/components/login-form";
import { useActionState, useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart2,
  Loader2,
  Lock,
  Shield,
  User
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin, loginUser } from "@/lib/action";
import { toast } from "sonner";

const initialState = {
  message: ""
};

export default function Home() {
  // For anonymous users, we can still track but with a generic ID
  const anonymousUser = {
    id: "anonymous",
    name: "Anonymous User"
  };

  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  useEffect(() => {
    if (state.message == "success") {
      toast.success("Loggin Successful");
    } else if (state.message == "unsuccess") {
      toast.error("Unsuccessful Login");
    }
  }, [state]);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
          action={formAction}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />

                <p>Admin Login</p>
              </CardTitle>
              <CardDescription>
                Enter your credentials to access the admin portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input id="password" type="password" name="password" />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">
                Login
                {pending ? (
                  <Loader2 className=" ml-2 h-4 w-4" />
                ) : (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.form>
      </main>
    </>
  );
}
