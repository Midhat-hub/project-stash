import fs from "fs";
import path from "path";

const RAW_PATH = path.join(process.cwd(), "data/wallet.json");
const CLEAN_PATH = path.join(process.cwd(), "data/clean-transactions.json");

export function normalizeTransactions() {
  if (!fs.existsSync(RAW_PATH)) return;

  const raw = JSON.parse(fs.readFileSync(RAW_PATH, "utf-8"));

  const corrected = raw.transactions.map((t: any) => {
    // sender & receiver are reversed in wallet.json
    const realSender = t.receiver;   // ✔ actual sender
    const realReceiver = t.sender;   // ✔ actual receiver

    return {
      id: t.id,
      amount: t.amount,         // amount is correct already (+/-)
      sender: realSender,
      receiver: realReceiver,
      timestamp: t.timestamp
    };
  });

  fs.writeFileSync(
    CLEAN_PATH,
    JSON.stringify({ transactions: corrected }, null, 2)
  );

  console.log("Normalized transactions written to clean-transactions.json");
}
