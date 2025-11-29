import dayjs from "dayjs";

/* ---------------------------------------------------------
   AGENT 1 — SPEND CATEGORIZER
   Rule-based classification based on keywords
--------------------------------------------------------- */

export function categorizeTransaction(tx: any) {
  const label = `${tx.sender} ${tx.receiver}`.toLowerCase();

  const rules = [
    { cat: "Food", keys: ["zomato", "swiggy", "food", "pizza", "cafe", "starbucks", "restaurant"] },
    { cat: "Shopping", keys: ["amazon", "flipkart", "myntra", "ajio", "shopping"] },
    { cat: "Transport", keys: ["uber", "ola", "rapido", "bus", "train", "metro"] },
    { cat: "Entertainment", keys: ["netflix", "spotify", "movie", "games"] },
    { cat: "Bills", keys: ["electric", "water", "recharge", "bill", "gas"] },
    { cat: "Subscriptions", keys: ["subscription", "renewal", "membership"] }
  ];

  for (const rule of rules) {
    if (rule.keys.some(k => label.includes(k))) {
      return rule.cat;
    }
  }

  return "Misc";
}



/* ---------------------------------------------------------
   AGENT 2 — SPENDING PATTERN ANALYZER
--------------------------------------------------------- */

export function analyzePatterns(history: any[]) {
  if (!history || history.length === 0) {
    return {
      last7daysSpend: 0,
      last30daysSpend: 0,
      avgDaily: 0,
      frequency: {},
      topLeak: "None"
    };
  }

  const now = dayjs();

  const last7 = history.filter(t => dayjs(t.timestamp).isAfter(now.subtract(7, "days")));
  const last30 = history.filter(t => dayjs(t.timestamp).isAfter(now.subtract(30, "days")));

  const last7Spend = last7.reduce((s, t) => s + Math.abs(t.amount), 0);
  const last30Spend = last30.reduce((s, t) => s + Math.abs(t.amount), 0);

  // Frequency for leak detection
  const freq: any = {};
  for (const tx of history) {
    const cat = tx.category || "Misc";
    freq[cat] = (freq[cat] || 0) + 1;
  }

  const topLeak = Object.entries(freq).sort((a:any,b:any) => b[1] - a[1])[0]?.[0] || "None";

  return {
    last7daysSpend: last7Spend,
    last30daysSpend: last30Spend,
    avgDaily: last30Spend / 30,
    frequency: freq,
    topLeak
  };
}



/* ---------------------------------------------------------
   AGENT 3 — BUDGET CHECKER
--------------------------------------------------------- */

export function checkBudget(tx: any, patterns: any, prefs: any) {
  const category = tx.category;
  const amount = Math.abs(tx.amount);

  let warnings: string[] = [];
  let risk = "low";
  let block = false;

  // Weekly Budget Check
  if (patterns.last7daysSpend + amount > prefs.weeklyBudget) {
    warnings.push(
      `This pushes you **above your weekly budget by ₹${(patterns.last7daysSpend + amount - prefs.weeklyBudget)}**.`
    );
    risk = "high";
    block = true;
  }

  // Category Budget Check
  const catLimit = prefs.categoryBudgets[category];
  if (catLimit) {
    const spentInCat = patterns.frequency[category] || 0;
    if (spentInCat >= catLimit) {
      warnings.push(`You've already crossed your **${category} budget**.`);
      risk = "medium";
    }
  }

  // Monthly Burn Rate
  if (patterns.avgDaily * 30 > prefs.monthlyBudget) {
    warnings.push("Your spending rate is above your monthly budget.");
    risk = "medium";
  }

  return { warnings, risk, block };
}
