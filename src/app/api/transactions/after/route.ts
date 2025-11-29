import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  categorizeTransaction,
  analyzePatterns,
  checkBudget,
  generateNudge
} from "@/ai/engine";

const cleanPath = path.join(process.cwd(), "data/clean-transactions.json");
const prefsPath = path.join(process.cwd(), "data/preferences.json");

export async function POST(req: Request) {
  try {
    const tx = await req.json();

    const history = JSON.parse(fs.readFileSync(cleanPath, "utf8")).transactions;
    const prefs = JSON.parse(fs.readFileSync(prefsPath, "utf8"));

    // Agent 1
    tx.category = categorizeTransaction(tx);

    // Agent 2
    const patterns = analyzePatterns(history);

    // Agent 3
    const budgetCheck = checkBudget(tx, patterns, prefs);

    // Agent 4 – AFTER payment, nudges become INSIGHTS
    const insights = generateNudge(tx, budgetCheck, prefs, patterns);

    return NextResponse.json({
      insights,
      category: tx.category,
      budget: budgetCheck,
      patterns
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "After-payment AI failed" }, { status: 500 });
  }
}
