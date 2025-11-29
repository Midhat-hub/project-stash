// app/signup/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // TODO: replace with API to create user
    await new Promise((r) => setTimeout(r, 800));

    // After signup, redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-white flex items-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="rounded-xl border p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="mt-2 text-sm text-slate-500">Start your Stash workspace.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm text-slate-600">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="you@example.com"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg px-4 py-2 bg-rose-500 text-white font-medium"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <div className="mt-4 text-sm text-slate-500">
            Already have an account?{" "}
            <button onClick={() => router.push("/login")} className="text-indigo-600 underline">
              Log in
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
