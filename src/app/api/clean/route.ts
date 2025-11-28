import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Read data/clean-transactions.json
    const filePath = path.join(process.cwd(), "data", "clean-transactions.json");
    const json = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(json);

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: "Could not read clean-transactions.json" },
      { status: 500 }
    );
  }
}
