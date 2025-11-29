# Stash — Intelligent Financial Behavior Engine  
### Agentic AI Platform for Real-Time Spend Intelligence & Budget Governance

Stash is an **agentic AI system** designed to interpret financial behavior, evaluate spending risks, and deliver real-time decision support.  
It operates as a policy-driven intelligence layer between the user and their financial actions.

The platform provides:
- Autonomous AI spend classification  
- Predictive behavioral analysis  
- Budget compliance evaluation  
- Real-time pre-transaction risk alerts  
- Post-transaction financial insights  

This architecture enables proactive financial governance without requiring direct integration with live banking rails.

---

# 🧠 Architecture Overview

Stash is built using a **multi-agent decision framework**:



┌───────────────────────────┐
│   Transaction Event        │
└───────────────┬───────────┘
▼
┌──────────────────────────────────────────────┐
│  Agent 1: Spend Categorizer                   │
└───────────────┬──────────────────────────────┘
▼
┌──────────────────────────────────────────────┐
│ Agent 2: Pattern Analyzer                     │
└───────────────┬──────────────────────────────┘
▼
┌──────────────────────────────────────────────┐
│ Agent 3: Budget Compliance Engine             │
└───────────────┬──────────────────────────────┘
▼
┌──────────────────────────────────────────────┐
│ Agent 4: Nudge Designer                       │
└───────────────┬──────────────────────────────┘
▼
┌──────────────────────────────────────────────┐
│ Agent 5: Real-Time Decision Engine            │
└──────────────────────────────────────────────┘



Each agent focuses on a distinct domain and provides structured output to the next agent, forming a **reasoning pipeline**.  
The final decision influences **user actions before the transaction is executed**.

---

# 🧩 Agent Responsibilities

## **1. Spend Categorizer**
Classifies transactions based on merchant context and heuristics.

- Food & Delivery  
- Transport  
- Shopping  
- Entertainment  
- Subscriptions  
- Bills & Utilities  
- Miscellaneous  

Acts as the metadata layer for downstream analytics.

---

## **2. Pattern Analyzer**
Processes 7–30 day financial behavior to detect:

- Anomalous spending events  
- Category-specific spikes  
- Burn rate trajectory  
- High-frequency transactions  
- Subscription leakage  
- Over-indexing in specific categories  

Outputs a behavioral risk profile for the current transaction.

---

## **3. Budget Compliance Engine**
Evaluates the transaction against:

- Global monthly budget  
- Weekly spend limits  
- Category-specific allocations  
- Savings or goal-based dependencies  

Produces compliance flags and deviation metrics.

---

## **4. Nudge Designer**
Transforms analytical outputs into **actionable insights** using natural-language reasoning.

Examples:
- “This transaction will exceed your weekly food allocation by ₹260.”  
- “You have reached 62% of your shopping bandwidth in the first 9 days.”  
- “This decision reduces your savings trajectory toward your goal.”  

This agent defines the system's *communication layer*.

---

## **5. Real-Time Decision Engine**
Makes the final regulatory call:

- `allow`  
- `warn`  
- `strong_nudge`  
- `soft_block`  

Determines whether the user needs to be alerted before proceeding.

This is the **agentic control mechanism** that differentiates Stash from passive analytics tools.

---

# 📡 API Endpoints

All intelligence is exposed via REST endpoints.

### **GET /api/transactions**
Returns:
- Current balance  
- Raw transaction ledger  

### **POST /api/transactions**
Records a new transaction and updates balance.

### **POST /api/transactions/pending**
Runs the full agentic reasoning stack *before* the transaction is approved.  
Returns:

json
{
  "decision": "warn",
  "nudges": [
    "Food spending exceeds weekly allocation by ₹260.",
    "Ordering frequency is above your usual pattern."
  ]
}


### **POST /api/transactions/after**

Provides post-transaction analysis and insight generation.

### **GET /api/clean**

Returns normalized, categorized transaction data for dashboards or ML models.

### **GET /api/preferences**

Retrieves budget and user preference configuration.

### **POST /api/preferences**

Updates the user’s financial policy configuration.

---

# 🗂 Data Storage Model

All data is stored locally in structured JSON for portability:

* `wallet.json` — Financial ledger and balance
* `clean-transactions.json` — Transformed and enriched transactions
* `preferences.json` — Policy configuration (budgets, goals, allocations)

The system can be easily extended to support SQL/NoSQL storage.

---

# 🔐 Governance & Compliance Layer

Stash simulates the behavior of an enterprise financial governance engine:

* Real-time policy enforcement
* Predictive risk scoring
* Behavioral modeling
* Human-readable decision rationale
* Explainability by design (XAI)

This approach mirrors how corporate expense management and neobanks enforce compliance.

---

# 🏗 Technology Stack

| Layer        | Technology                                        |
| ------------ | ------------------------------------------------- |
| API Layer    | Next.js Route Handlers                            |
| Intelligence | Multi-Agent Reasoning (Rule-based + Heuristic AI) |
| Data Model   | JSON-based domain storage                         |
| Frontend     | Next.js + React + Tailwind                        |
| Processing   | Composable agent pipeline                         |

---

# 🚀 Running Locally


npm install
npm run dev


APIs available at:

http://localhost:3000/api/


---
