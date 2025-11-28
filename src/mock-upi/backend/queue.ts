import { Transaction } from "./types";

const queue: Transaction[] = [];

export function enqueue(tx: Transaction) {
  queue.push(tx);
}

export function dequeue(): Transaction | null {
  return queue.length > 0 ? queue.shift()! : null;
}
