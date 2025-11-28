"use client";

import { useEffect, useState } from "react";

export default function SpendingAlert({ transactions }: any) {
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const weeklySpend = transactions
      .filter((t: any) => t.amount < 0)
      .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);

    if (weeklySpend > 1000 && weeklySpend < 2000) {
      setAlert("⚠️ You're spending more than usual this week. Try limiting food orders.");
    } else if (weeklySpend >= 2000) {
      setAlert("🚨 High spending detected! You’ve crossed ₹2000 this week. Consider pausing luxury expenses.");
    } else {
      setAlert("");
    }
  }, [transactions]);

  if (!alert) return null;

  return (
    <div className="neon-card border-l-4 border-[#0aff99] text-[#0aff99]">
      {alert}
    </div>
  );
}
