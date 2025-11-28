// src/lib/storage.ts
export type Transaction = {
  id: string;
  amount: number;
  sender: string;
  receiver: string;
  message?: string;
  timestamp: string;
};

let balance = 10000; // starting balance for the mock UPI
let transactions: Transaction[] = []; // newest first

export function getBalance() {
  return balance;
}

export function setBalance(newBal: number) {
  balance = newBal;
}

export function updateBalanceSubtract(amount: number) {
  balance = Math.max(0, balance - amount);
  return balance;
}

export function getTransactions() {
  return transactions;
}

export function addTransaction(tx: Transaction) {
  transactions.unshift(tx);
}
