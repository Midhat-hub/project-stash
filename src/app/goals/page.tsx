export default function Goals() {
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">Savings Goals</h1>

      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-lg font-semibold">Laptop – ₹70,000</h2>

        <div className="mt-4">
          <div className="h-4 bg-gray-200 rounded-full">
            <div className="h-4 bg-blue-500 rounded-full" style={{ width: "40%" }}></div>
          </div>
          <p className="mt-2 text-gray-500">Progress: 40%</p>
        </div>
      </div>

      <p className="italic text-green-700">
        AI: “Skipping one ₹499 order brings you 1.2% closer to your laptop.”
      </p>
    </div>
  );
}
