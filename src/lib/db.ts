type Transaction = {
  id: string;
  type: "sent" | "received";
  amount: number;
  name: string;
  timestamp: string;
  message?: string;
};

let transactions: Transaction[] = [];

export function getTransactions() {
  return transactions;
}

export function addTransaction(tx: Transaction) {
  transactions.push(tx);
}
