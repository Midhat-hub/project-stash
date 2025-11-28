import fs from "fs";
import path from "path";

const RAW_PATH = path.join(process.cwd(), "data/wallet.json");
const CLEAN_PATH = path.join(process.cwd(), "data/clean-transactions.json");

export function normalizeTransactions() {
  if (!fs.existsSync(RAW_PATH)) return;

  const raw = JSON.parse(fs.readFileSync(RAW_PATH, "utf-8"));

  // Extract raw balance (already correct)
  const correctedBalance = raw.balance;

  // Correct sender/receiver in each transaction
  const correctedTransactions = raw.transactions.map((t: any) => {
    const realSender = t.receiver;   // ✔ actual sender
    const realReceiver = t.sender;   // ✔ actual receiver

    return {
      id: t.id,
      amount: t.amount,
      sender: realSender,
      receiver: realReceiver,
      timestamp: t.timestamp,
    };
  });

  const cleanOutput = {
    balance: correctedBalance,
    transactions: correctedTransactions,
  };

  fs.writeFileSync(CLEAN_PATH, JSON.stringify(cleanOutput, null, 2));

  console.log("✔ Clean wallet updated at data/clean-transactions.json");
}
