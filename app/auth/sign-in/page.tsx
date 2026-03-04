"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <SignIn 
        signUpUrl="/auth/sign-up"
        routing="path"
        path="/auth/sign-in"
      />
    </main>
  );
}
