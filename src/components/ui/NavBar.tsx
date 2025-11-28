import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="p-4 bg-white shadow flex gap-6">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/transactions">Transactions</Link>
      <Link href="/goals">Goals</Link>
      <Link href="/mockupi">Mock UPI</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  );
}
