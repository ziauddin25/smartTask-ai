"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <SignUp 
        signInUrl="/auth/sign-in"
        routing="path"
        path="/auth/sign-up"
      />
    </main>
  );
}
