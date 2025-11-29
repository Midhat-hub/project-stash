import "./globals.css";

export const metadata = {
  title: "Stash",
  description: "Fintech savings assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f5f7fb] text-gray-900">

        {/* ⭐ TOP NAVIGATION BAR ⭐ 
       /* <nav className="
          w-full 
          bg-white 
          shadow-md 
          border-b border-gray-200 
          px-10 py-4 
          flex 
          justify-between 
          items-center
        ">
          <h1 className="text-3xl font-extrabold text-blue-600">Stash</h1>

          <div className="flex gap-6 text-lg">
            <a className="nav-link" href="/dashboard">Dashboard</a>
            <a className="nav-link" href="/profile">Profile</a>
            <a className="nav-link" href="/preferences">Preferences</a>
            <a className="nav-link" href="/goals">Goals</a>
            <a className="nav-link" href="/transactions">Transactions</a>
            <a className="nav-link" href="/notifications">AI Inbox</a>
          </div>
        </nav>*/}

        {/* ⭐ MAIN CONTENT BELOW NAVBAR ⭐ */}
        <main className="p-10 max-w-6xl mx-auto">
          {children}
        </main>

      </body>
    </html>
  );
}
