import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import StatCard from "../components/StatCard";
import Card from "../components/Card";

export default function Dashboard() {
  const [analysis, setAnalysis] = useState(null);
  const [debts, setDebts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState("");
  const [incomeSaved, setIncomeSaved] = useState(false);
  const [projection, setProjection] = useState([]);
  const [projConfig, setProjConfig] = useState({ months: 12, savingsRate: 20, returnRate: 8 });
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [a, d, g, t] = await Promise.all([
          axios.get("/transactions/analysis?days=30"),
          axios.get("/debts"),
          axios.get("/goals"),
          axios.get("/transactions"),
        ]);
        setAnalysis(a.data);
        setDebts(d.data);
        setGoals(g.data);
        setTransactions(t.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const monthlyIncome = Number(income) || 50000;
    const totalDebt = debts.reduce((s, d) => s + d.remainingAmount, 0);
    const monthlySavings = (monthlyIncome * projConfig.savingsRate) / 100;
    const monthlyReturn = projConfig.returnRate / 100 / 12;
    let worth = -totalDebt;
    const data = [];
    for (let i = 0; i <= projConfig.months; i++) {
      data.push({ month: `M${i}`, value: Math.round(worth) });
      worth = worth * (1 + monthlyReturn) + monthlySavings;
    }
    setProjection(data);
  }, [projConfig, debts, income]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--green-700)" }} />
    </div>
  );

  const totalExpenses = analysis?.total || 0;
  const totalDebt = debts.reduce((s, d) => s + d.remainingAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const categoryData = Object.entries(analysis?.categoryBreakdown || {}).sort((a, b) => b[1] - a[1]);
  const maxCategory = categoryData[0]?.[1] || 1;
  const recentTx = transactions.slice(0, 4);
  const projectedFinal = projection[projection.length - 1]?.value || 0;

  const categoryColors = {
    food: "#1D9E75", transport: "#378ADD", shopping: "#7F77DD",
    entertainment: "#D4537E", utilities: "#BA7517", health: "#E24B4A", other: "#9CA3AF"
  };

  const debtRisk = (rate) => {
    if (rate >= 24) return { label: "High risk", bg: "#FCEBEB", color: "#A32D2D", dot: "#E24B4A" };
    if (rate >= 12) return { label: "Moderate", bg: "#FAEEDA", color: "#854F0B", dot: "#BA7517" };
    return { label: "Low risk", bg: "#EAF3DE", color: "#3B6D11", dot: "#639922" };
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-base font-medium" style={{ color: "#111827" }}>
            {greeting} 👋
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{today} · Financial overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/transactions")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--green-700)", boxShadow: "0 2px 8px #0F6E5630" }}>
            <i className="ti ti-plus" style={{ fontSize: 13 }} />
            Add transaction
          </button>
        </div>
      </div>

      {/* Income setter */}
      <div className="flex items-center gap-3 mb-5 p-3.5 bg-white rounded-xl border" style={{ borderColor: "#E5E7EB" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#E1F5EE" }}>
          <i className="ti ti-cash" style={{ fontSize: 13, color: "var(--green-700)" }} />
        </div>
        <p className="text-xs font-medium" style={{ color: "#374151" }}>Set monthly income</p>
        <input type="number" placeholder="e.g. 50000" value={income}
          onChange={e => setIncome(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none border-b focus:border-green-600 transition-colors"
          style={{ borderColor: "#E5E7EB", color: "#111827", maxWidth: 160 }} />
        <button onClick={async () => {
          await axios.put("/auth/update", { monthlyIncome: Number(income) });
          setIncomeSaved(true);
          setTimeout(() => setIncomeSaved(false), 2000);
        }} className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
          style={{ background: "var(--green-700)" }}>
          Save
        </button>
        {incomeSaved && <span className="text-xs" style={{ color: "var(--green-700)" }}>Saved ✓</span>}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatCard label="Monthly income" value={`₹${Number(income || 0).toLocaleString("en-IN")}`}
          icon="ti-cash" iconBg="#E1F5EE" iconColor="#0F6E56"
          badge="+0%" badgeBg="#E1F5EE" badgeColor="#0F6E56" />
        <StatCard label="Total expenses (30d)" value={`₹${totalExpenses.toLocaleString("en-IN")}`}
          icon="ti-shopping-cart" iconBg="#FCEBEB" iconColor="#A32D2D"
          badge={income ? `${Math.round((totalExpenses / Number(income)) * 100)}% used` : "—"}
          badgeBg="#FCEBEB" badgeColor="#A32D2D" />
        <StatCard label="Total debt" value={`₹${totalDebt.toLocaleString("en-IN")}`}
          icon="ti-credit-card" iconBg="#FAEEDA" iconColor="#854F0B"
          badge={`${debts.length} active`} badgeBg="#FAEEDA" badgeColor="#854F0B" />
        <StatCard label="Saved towards goals" value={`₹${totalSaved.toLocaleString("en-IN")}`}
          icon="ti-piggy-bank" iconBg="#E6F1FB" iconColor="#185FA5"
          badge={`${goals.length} goals`} badgeBg="#E6F1FB" badgeColor="#185FA5" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-13 gap-4 mb-4" style={{ gridTemplateColumns: "1.3fr 0.7fr" }}>
        {/* Spending breakdown */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: "#111827" }}>Spending breakdown</p>
            <span className="text-xs" style={{ color: "#6B7280" }}>Last 30 days</span>
          </div>
          {categoryData.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "#9CA3AF" }}>No expenses yet — add transactions to see your breakdown</p>
          ) : (
            <div className="space-y-3">
              {categoryData.slice(0, 6).map(([cat, val]) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-xs capitalize w-24 flex-shrink-0" style={{ color: "#374151" }}>{cat}</span>
                  <div className="flex-1 rounded-full h-1.5" style={{ background: "#F3F4F6" }}>
                    <div className="h-1.5 rounded-full transition-all"
                      style={{ width: `${(val / maxCategory) * 100}%`, background: categoryColors[cat] || "#9CA3AF" }} />
                  </div>
                  <span className="text-xs w-16 text-right" style={{ color: "#6B7280" }}>₹{val.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Active debts */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: "#111827" }}>Active debts</p>
            <button onClick={() => navigate("/debts")} className="text-xs" style={{ color: "var(--green-700)" }}>View all</button>
          </div>
          {debts.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "#9CA3AF" }}>No debts added yet</p>
          ) : (
            <div className="divide-y" style={{ borderColor: "#F3F4F6" }}>
              {debts.slice(0, 4).map(d => {
                const risk = debtRisk(d.interestRate);
                return (
                  <div key={d._id} className="flex items-center gap-2.5 py-2.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: risk.dot }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "#111827" }}>{d.name}</p>
                      <p className="text-xs" style={{ color: "#9CA3AF" }}>{d.interestRate}% interest</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium" style={{ color: "#A32D2D" }}>₹{d.remainingAmount.toLocaleString("en-IN")}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: risk.bg, color: risk.color, fontSize: 9 }}>{risk.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Net worth projector */}
        <Card>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium" style={{ color: "#111827" }}>Net worth projection</p>
          </div>
          <p className="text-xl font-medium mb-0.5" style={{ color: "var(--green-700)" }}>
            ₹{projectedFinal.toLocaleString("en-IN")}
          </p>
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mb-3"
            style={{ background: "#E1F5EE", color: "#0F6E56", fontSize: 10 }}>
            <i className="ti ti-trending-up" style={{ fontSize: 10 }} />
            in {projConfig.months} months
          </span>
          <ResponsiveContainer width="100%" height={70}>
            <LineChart data={projection}>
              <Line type="monotone" dataKey="value" stroke="#1D9E75" strokeWidth={1.5} dot={false} />
              <Tooltip formatter={v => `₹${v.toLocaleString("en-IN")}`}
                contentStyle={{ background: "white", border: "0.5px solid #E5E7EB", borderRadius: 8, fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: "Savings %", key: "savingsRate", min: 0, max: 80, step: 5 },
              { label: "Return %/yr", key: "returnRate", min: 0, max: 25, step: 1 },
              { label: "Months", key: "months", min: 6, max: 120, step: 6 },
            ].map(({ label, key, min, max, step }) => (
              <div key={key}>
                <p className="text-xs mb-1" style={{ color: "#6B7280" }}>{label}: <span className="font-medium" style={{ color: "#111827" }}>{projConfig[key]}</span></p>
                <input type="range" min={min} max={max} step={step} value={projConfig[key]}
                  onChange={e => setProjConfig(p => ({ ...p, [key]: Number(e.target.value) }))}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: "var(--green-700)" }} />
              </div>
            ))}
          </div>
        </Card>

        {/* Savings goals */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: "#111827" }}>Savings goals</p>
            <button onClick={() => navigate("/goals")} className="text-xs" style={{ color: "var(--green-700)" }}>View all</button>
          </div>
          {goals.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "#9CA3AF" }}>No goals added yet</p>
          ) : (
            <div className="space-y-3">
              {goals.slice(0, 3).map(g => {
                const pct = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
                return (
                  <div key={g._id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-medium" style={{ color: "#111827" }}>{g.name}</p>
                      <p className="text-xs font-medium" style={{ color: "var(--green-700)" }}>{pct}%</p>
                    </div>
                    <div className="rounded-full h-1.5" style={{ background: "#F3F4F6" }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: "var(--green-600)" }} />
                    </div>
                    <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                      ₹{g.savedAmount.toLocaleString("en-IN")} / ₹{g.targetAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent transactions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: "#111827" }}>Recent transactions</p>
            <button onClick={() => navigate("/transactions")} className="text-xs" style={{ color: "var(--green-700)" }}>View all</button>
          </div>
          {recentTx.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "#9CA3AF" }}>No transactions yet</p>
          ) : (
            <div className="divide-y" style={{ borderColor: "#F3F4F6" }}>
              {recentTx.map(t => (
                <div key={t._id} className="flex items-center gap-2.5 py-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: t.type === "income" ? "#E1F5EE" : "#FFF0E6" }}>
                    <i className={`ti ${t.type === "income" ? "ti-building-bank" : "ti-shopping-bag"}`}
                      style={{ fontSize: 12, color: t.type === "income" ? "#0F6E56" : "#BA7517" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium capitalize truncate" style={{ color: "#111827" }}>{t.title}</p>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>{t.category} · {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </div>
                  <p className="text-xs font-medium flex-shrink-0"
                    style={{ color: t.type === "income" ? "#0F6E56" : "#A32D2D" }}>
                    {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}