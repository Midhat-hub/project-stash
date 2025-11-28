import { enqueue } from "./queue";
import { Transaction } from "./types";

export function newTransaction(amount: number, sender: string, receiver: string) {
  const tx: Transaction = {
    id: crypto.randomUUID(),
    amount,
    sender,
    receiver,
    timestamp: Date.now(),
  };

  enqueue(tx);
  return tx;
}
