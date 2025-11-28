import { NextResponse } from "next/server";

let clients: Response[] = [];

export function GET() {
  return new ReadableStream({
    start(controller) {
      clients.push(controller);

      // Send initial connection message
      controller.enqueue(`data: connected\n\n`);
    },
    cancel() {
      clients = clients.filter((c) => c !== controller);
    },
  });
}

export function broadcast(data: any) {
  clients.forEach((controller) => {
    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
  });
}
