"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  return (
    <div className="space-y-8">

      <h1 className="text-4xl font-bold">Dashboard</h1>

      <div className="card">
        <h2 className="text-xl font-semibold">Balance</h2>
        <p className="text-4xl font-bold mt-2">₹5000</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold">Weekly Spend Overview</h2>
        <p className="text-gray-600 mt-2">
          Your spending is stable this week. Great job!
        </p>
      </div>

    </div>
  );
}
