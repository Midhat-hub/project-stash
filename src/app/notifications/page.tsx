export default function Notifications() {
  return (
    <div className="space-y-6">

      <h1 className="text-4xl font-bold mb-4">AI Inbox</h1>

      <div className="card border-l-8 border-yellow-500 bg-yellow-50">
        <h2 className="text-xl font-bold text-yellow-700">Overspending Warning</h2>
        <p className="mt-1">You spent 32% more than usual on Food this week.</p>
      </div>

      <div className="card border-l-8 border-blue-500 bg-blue-50">
        <h2 className="text-xl font-bold text-blue-700">Goal Progress</h2>
        <p className="mt-1">Yesterday’s skipped order pushed you +1% closer to your goal.</p>
      </div>

      <div className="card border-l-8 border-green-500 bg-green-50">
        <h2 className="text-xl font-bold text-green-700">Good Job!</h2>
        <p className="mt-1">You saved ₹900 this week. Keep going!</p>
      </div>

    </div>
  );
}
