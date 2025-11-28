import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { normalizeTransactions } from "@/lib/normalize";


const filePath = path.join(process.cwd(), "data/wallet.json");

function ensureFile() {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify({ balance: 5000, transactions: [] }, null, 2));
  }
}

function loadWallet() {
  ensureFile();
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function saveWallet(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = loadWallet();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Failed to load wallet" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { amount, sender, receiver } = await req.json();
    const data = loadWallet();

    const numericAmount = Number(amount);

    let finalAmount = 0;

    // Determine direction correctly
    if (sender.toLowerCase() === "you") {
      // YOU paid someone → outgoing
      finalAmount = -numericAmount;
    } else if (receiver.toLowerCase() === "you") {
      // YOU received money → incoming
      finalAmount = numericAmount;
    } else {
      // Neither sender nor receiver is YOU → invalid
      return NextResponse.json(
        { error: "Either sender or receiver must be YOU" },
        { status: 400 }
      );
    }

    // Create transaction record
    const tx = {
      id: crypto.randomUUID(),
      amount: finalAmount,
      sender,
      receiver,
      timestamp: new Date().toISOString(),
    };

    // Update balance
    data.balance += finalAmount;

    // Save
    data.transactions.unshift(tx);
    saveWallet(data);
    normalizeTransactions();   // <-- creates fixed clean file

    

    return NextResponse.json({
      success: true,
      balance: data.balance,
      transaction: tx,
    });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

