"use client";

import type React from "react";

import { useState, useEffect, useRef, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { loginUser } from "@/lib/action";
import { toast } from "sonner";
import Link from "next/link";

const initialState = {
  message: ""
};
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const router = useRouter();

  const [state, formAction, pending] = useActionState(loginUser, initialState);

  useEffect(() => {
    if (state.message == "success") {
      toast.success("Loggin Successful");
    } else if (state.message == "unsuccess") {
      toast.error("Unsuccessful Login");
    }
  }, [state]);

  // Page load time tracking

  // Track page dwell time

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                placeholder="Enter your email"
                className="pl-10"
                type="email"
                name="email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10"
                name="password"
                required
              />
              <button
                type="submit"
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 font-medium">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Logging in..." : "Login"}
          </Button>

          {/* <div className="text-center text-xs text-slate-500 mt-4">
            <p>Demo credentials:</p>
            <p>User: username="user", password="password"</p>
            <p>Admin: username="admin", password="admin123"</p>
          </div> */}
        </form>
      </CardContent>

      <Link href={"/register"} className=" mt-2 text-sm text-blue-500 px-6 pb-4">
        Create User Profile
      </Link>
    </Card>
  );
}
