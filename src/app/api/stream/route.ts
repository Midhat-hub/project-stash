// src/app/api/stream/route.ts
import { NextResponse } from "next/server";
import { addController, removeController } from "@/lib/broadcaster";

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      // register controller for broadcasts
      addController(controller);
      // send a welcome message
      controller.enqueue(`data: ${JSON.stringify({ type: "connected", ts: Date.now() })}\n\n`);
    },
    cancel() {
      // remove handled controllers on disconnect
      // removeController can't reference controller directly here, so we rely on broadcaster cleanup when enqueue fails
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
