import { NextResponse } from "next/server";
import { addTransaction } from "@/lib/db";
import { broadcast } from "@/app/api/stream/route";

export async function POST(req: Request) {
  const data = await req.json();

  const newTx = {
    id: crypto.randomUUID(),
    type: "sent" as const,
    amount: data.amount,
    name: data.to,
    message: data.message || "",
    timestamp: new Date().toISOString(),
  };

  addTransaction(newTx);

  // Notify dashboard listeners
  broadcast(newTx);

  return NextResponse.json({
    success: true,
    message: "Payment sent",
    transaction: newTx,
  });
}
