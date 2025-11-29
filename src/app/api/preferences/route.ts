import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "data/preferences.json");

function loadPrefs() {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function savePrefs(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = loadPrefs();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    savePrefs(body);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Could not save" }, { status: 400 });
  }
}
