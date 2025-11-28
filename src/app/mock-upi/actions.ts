"use server";

export async function sendTransaction(data: {
  amount: number;
  sender: string;
  receiver: string;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stream`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.ok;
}
