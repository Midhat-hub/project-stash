import { NextResponse } from "next/server";
import { getTransactions } from "@/lib/db";

export async function GET() {
  return NextResponse.json(getTransactions());
}
