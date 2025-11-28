// src/lib/broadcaster.ts
// Simple SSE broadcaster: modules persist in dev environment.
const controllers: ReadableStreamDefaultController<any>[] = [];

export function addController(controller: ReadableStreamDefaultController<any>) {
  controllers.push(controller);
}

export function removeController(controller: ReadableStreamDefaultController<any>) {
  const idx = controllers.indexOf(controller);
  if (idx >= 0) controllers.splice(idx, 1);
}

export function broadcastEvent(data: any) {
  const s = `data: ${JSON.stringify(data)}\n\n`;
  // Try/catch; drop controllers that throw
  for (let i = controllers.length - 1; i >= 0; i--) {
    try {
      controllers[i].enqueue(s);
    } catch (e) {
      // remove broken controller
      controllers.splice(i, 1);
    }
  }
}
