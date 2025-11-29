import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import {
  categorizeTransaction,
  analyzePatterns,
  checkBudget,
  generateNudge,
  decideAction
} from "@/ai/engine";

const cleanPath = path.join(process.cwd(), "data/clean-transactions.json");
const prefsPath = path.join(process.cwd(), "data/preferences.json");

export async function POST(req: Request) {
  try {
    const tx = await req.json();

    // load history
    const history = JSON.parse(fs.readFileSync(cleanPath, "utf8")).transactions;

    // load prefs
    const prefs = JSON.parse(fs.readFileSync(prefsPath, "utf8"));

    // Agents 1–3
    tx.category = categorizeTransaction(tx);
    const patterns = analyzePatterns(history);
    const budgetCheck = checkBudget(tx, patterns, prefs);

    // Agent 4
    const nudges = generateNudge(tx, budgetCheck, prefs, patterns);

    // Agent 5
    const decision = decideAction(budgetCheck);

    return NextResponse.json({
      decision,
      nudges
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "AI processing failed." }, { status: 500 });
  }
}

