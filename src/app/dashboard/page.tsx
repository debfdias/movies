"use client";

import { signOut, useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen p-8">
      <button style={{ marginRight: 10 }} onClick={() => signOut()}>
        Sign Out
      </button>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="mb-4">Welcome, {session?.user?.email}!</p>
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Account</h2>
          <p>Email: {session?.user?.email}</p>
        </div>
      </div>
    </div>
  );
}
