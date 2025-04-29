"use client";

import RegisterForm from "@/components/register-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  // For anonymous users, we can still track but with a generic ID
  const anonymousUser = {
    id: "anonymous",
    name: "Anonymous User"
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">SecureBank</h1>
            <p className="text-slate-600 mt-2">
              Secure advanced anomaly detection powered by IntelliDetect
            </p>
          </div>
          <RegisterForm />
          <Link
            href={"/userlogin"}
            className=" mt-2 underline text-blue-500 text-sm font-semibold  "
          >
            Login to user portal
          </Link>
        </div>
      </main>
    </>
  );
}
