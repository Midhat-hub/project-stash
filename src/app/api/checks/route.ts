import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, category } = body;

    const filePath = path.join(process.cwd(), "data", "clean-transactions.json");
    const file = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(file);

    const alerts = [];
    const balance = data.balance;

    const numericAmount = Number(amount);

    // 1. If transaction will push balance below threshold
    if (balance - numericAmount < 1000) {
      alerts.push({
        type: "danger",
        message: "This payment will drop your balance below ₹1,000.",
      });
    }

    // 2. Large transaction check
    if (numericAmount > 5000) {
      alerts.push({
        type: "warning",
        message: "This is a large transaction compared to your history.",
      });
    }

    // 3. Simple category budget rule (optional)
    const categorySpent = data.transactions
      .filter((t: any) => t.category === category)
      .reduce((s: number, t: any) => s + Math.abs(t.amount), 0);

    if (categorySpent + numericAmount > 5000) {
      alerts.push({
        type: "warning",
        message: `This exceeds your ₹5,000 monthly budget for ${category}.`,
      });
    }

    return NextResponse.json({ alerts });

  } catch (e) {
    return NextResponse.json({ error: "Failed to check transaction" }, { status: 500 });
  }
}
