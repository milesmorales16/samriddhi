**Product Requirements Document (PRD)**

| Project Name | **Personal Risk Engine & Trading Journal** |
| :--- | :--- |
| **Version** | 1.0 (Draft) |
| **Status** | Planning / Pre-Alpha |
| **Owner** | Product Management |
| **Type** | B2C SaaS (Internal MVP First) |

---

## 1. Executive Summary
We are building a **Multi-Entity Trading Ledger** designed to aggregate portfolios across multiple brokerages (Fidelity, Schwab, IBKR, etc.). Unlike standard trading journals that treat transactions as isolated events, this system focuses on the **lifecycle of a trade**. It introduces "Campaign" tracking for complex option rolls and provides a rigorous, immutable ledger for tax compliance and wash-sale detection.

**The Vision:** To build the "QuickBooks for Options Traders"—a tool that provides hedge-fund-grade back-office analytics, risk projection, and tax compliance for the active retail trader.

---

## 2. Problem Statement
Active traders face three critical issues that Excel and generic journals fail to solve:
1.  **Data Fragmentation:** A trader with a Taxable account at Fidelity and an IRA at Schwab has no unified view of their exposure to a specific ticker (e.g., TSLA).
2.  **The "Roll" Blind Spot:** When an options trader "rolls" a losing position (closes for a loss, opens a new one for credit), generic tools record a realized loss and a new trade. They fail to link these into a single "Campaign," obscuring the true cost basis and net P&L.
3.  **Regulatory Risk (Wash Sales):** Brokers do not talk to each other. A loss realized in Account A can be permanently disallowed if a substantially identical position is opened in Account B (IRA). Traders are flying blind regarding their tax liabilities.

---

## 3. Product Principles
1.  **Multi-Tenant by Design:** Even for the single-user MVP, the architecture must support `user_id` and data isolation to facilitate a seamless transition to SaaS.
2.  **Immutable History (The "Git" Model):** We never delete data. Corrections are made via append-only versioning. Auditability is absolute.
3.  **Deterministic Math:** We do not use "Black Box" heuristics for risk projections. We use contract-based algebra (Intrinsic Value at Expiration).
4.  **Asset Agnostic:** Stocks are First-Class Citizens. The system must handle equities and options with equal fidelity to support "Covered" strategy detection.

---

## 4. User Personas
*   **The Architect (Phase 1 User):** The creator. Needs a CLI to onboard, manual CSV uploads, and accurate P&L tracking across 3+ accounts.
*   **The Active Retailer (Phase 3 User):** Trades options weekly. Worried about taxes. Needs automated insights to improve win rate.

---

## 5. Functional Requirements

### 5.1. Authentication & Onboarding
*   **FR-001 (CLI Onboarding):** The system shall support user creation via Command Line Interface (CLI) scripts (`npm run create-user`).
*   **FR-002 (Auth Token):** The system shall identify users via persistent tokens/cookies, bypassing a UI login screen for Phase 1, but enforcing `user_id` checks on all API routes.
*   **FR-003 (Encryption):** All user credentials (even if manual) must be hashed.

### 5.2. Data Ingestion & Hierarchy
*   **FR-004 (Account Hierarchy):** The system must enforce a strict hierarchy: `User` > `Institution` (e.g., Schwab) > `Account` (e.g., Roth IRA) > `Transactions`.
*   **FR-005 (CSV Normalization):** The system shall provide an "Adapter" framework to parse disparate CSV formats (Fidelity, Schwab, IBKR) into a unified `Transaction` object.
*   **FR-006 (Upload Modal):** Users must explicitly map a CSV upload to a specific `Account_ID` via a UI modal during ingestion.

### 5.3. The Ledger (Bi-Temporal Modeling)
*   **FR-007 (Immutable Entries):** The database shall never perform `UPDATE` or `DELETE` on a committed transaction.
*   **FR-008 (Correction Workflow):** If a user edits a trade:
    1.  The original row is marked `is_active = false`.
    2.  A new row is inserted with `is_active = true`, `version = n+1`, and `parent_id = original_id`.
*   **FR-009 (Audit View):** A "History" view must be available for every trade to show the timeline of manual corrections.

### 5.4. Asset & Trade Logic
*   **FR-010 (Asset Classes):** The system must support:
    *   **Equities:** Multiplier = 1, Expiration = NULL.
    *   **Options:** Multiplier = 100, Expiration = Date, Type = Call/Put, Strike = Price.
*   **FR-011 (Campaign Linking):** Users must be able to manually link a Closed Trade to a New Open Trade, designating it as a "Roll." The system must calculate "Campaign Net P&L."
*   **FR-012 (Strategy Grouping):** The system shall detect basic strategies (Verticals, Strangles, Iron Condors) based on timestamp, symbol, and expiration matching.
*   **FR-013 (Covered Asset Logic):** The system shall detect "Covered" positions (Long Stock + Short Call) across the same account.

---

## 6. Key Views & Dashboards

### 6.1. Navigation
*   **Global Context Switcher:** A persistent dropdown in the navigation bar allowing the user to view data by:
    *   Scope: [All Accounts] | [Portfolio Group] | [Single Account].

### 6.2. The Morning Blotter (Status)
*   **Expiring Soon:** List of options expiring within 7 days.
*   **Consolidated Positions:** A unified view of exposure per Ticker (aggregating shares and delta across all brokers).

### 6.3. The Scenario Projector (Risk Engine)
*   **Input:** Ticker Symbol + Target Price + Target Date.
*   **Logic:** Iterate through all open positions for that ticker. Calculate Intrinsic Value: `(Target Price - Strike) * Qty`.
*   **Constraint:** DO NOT use Implied Volatility models. Show exact Payoff-At-Expiration math.
*   **Output:** Net P&L Table at the target price.

### 6.4. The Campaign Timeline
*   **Visual:** A chronological view (Sankey or Block timeline) showing the lifecycle of a rolled position.
*   **Metric:** Display "Realized P&L" (Cash banked) vs. "Campaign Cost Basis" (True break-even).

### 6.5. The Shadow Ledger (Tax View)
*   **Logic:** A toggle to switch P&L calculation from "GAAP/Real" to "Taxable."
*   **Wash Sale Flag:** Identify losses realized within 30 days of opening a substantially identical position (across *any* account). Mark these losses as "Deferred/Disallowed."

---

## 7. Data Architecture (Schema Highlights)

### Core Tables
1.  **`users`**: `id`, `email`, `created_at`.
2.  **`institutions`**: `id`, `name` (e.g., Fidelity), `adapter_type`.
3.  **`accounts`**: `id`, `user_id`, `institution_id`, `name` (e.g., "Main IRA"), `tax_status` (Taxable, Roth, SEP).
4.  **`assets`**: `id`, `symbol`, `type` (Stock/Option), `strike`, `expiration`, `multiplier`.
5.  **`transactions`**:
    *   `id`, `account_id`, `asset_id`
    *   `side` (Buy/Sell), `qty`, `price`, `fees`
    *   `transacted_at`
    *   `is_active` (Boolean), `version` (Int), `parent_id` (FK to self) — *Enables Bi-Temporal Logic*.
6.  **`campaigns`**: `id`, `user_id`, `status` (Open/Closed), `notes`.
7.  **`campaign_links`**: Linking table connecting `transactions` to `campaigns`.

---

## 8. Phased Roadmap

### Phase 1: The Foundation (Internal MVP)
*   **Goal:** Replace the spreadsheet.
*   **Scope:** CLI Auth, Postgres DB, CSV Ingestion (1 Broker), Immutable Ledger logic, Blotter View, Basic P&L.
*   **No-Go:** Tax logic, Auto-grouping strategies, SaaS billing.

### Phase 2: The Logic Layer (Personal Utility)
*   **Goal:** Advanced Analytics.
*   **Scope:** Multi-Account Context Switcher, Campaign (Rolling) support, Stock+Option "Covered" detection, Scenario Projector (Math only).
*   **Data:** Delayed/EOD Market Data integration for pricing.

### Phase 3: The Commercial Turn (SaaS)
*   **Goal:** Onboard external users.
*   **Scope:** Auth0/Clerk Login UI, Stripe Integration, Cross-Broker Wash Sale Engine (The "Killer Feature"), API-based imports (Plaid/Yodlee).

---

## 9. Glossary

*   **Campaign:** A user-defined grouping of multiple trades (rolls) representing a continuous engagement with a specific underlying asset, used to track net cost basis over time.
*   **Iron Condor:** A neutral defined-risk strategy involving four option legs (Short Call Spread + Short Put Spread) on the same expiration.
*   **Strangle:** An undefined-risk strategy involving a Call and a Put on the same asset with different strikes.
*   **Wash Sale:** A tax regulation disallowing a loss deduction if a "substantially identical" security is purchased within 30 days before or after the sale.
*   **Bi-Temporal Modeling:** A database design pattern that tracks both the "valid time" (when the trade happened) and "transaction time" (when the record was entered/corrected), allowing for immutable history.

---

## 10. Success Metrics (KPIs)
*   **Accuracy:** 100% match between "Shadow Ledger" P&L and Brokerage Monthly Statements (reconciliation).
*   **Efficiency:** Time to ingest and categorize weekly trades < 5 minutes.
*   **Coverage:** 100% of "Rolled" trades correctly linked to Campaigns.