import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../components/Card";

export default function Debts() {
  const [debts, setDebts] = useState([]);
  const [form, setForm] = useState({ name: "", totalAmount: "", remainingAmount: "", interestRate: "", minimumPayment: "", dueDate: "" });
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const fetchDebts = async () => {
    const res = await axios.get("/debts");
    setDebts(res.data);
  };

  useEffect(() => { fetchDebts(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/debts", form);
      setForm({ name: "", totalAmount: "", remainingAmount: "", interestRate: "", minimumPayment: "", dueDate: "" });
      setShowForm(false);
      fetchDebts();
    } catch (err) { setError(err.response?.data?.message || "Failed to add"); }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/debts/${id}`);
    fetchDebts();
  };

  const handleOptimize = async () => {
    if (!budget) return setError("Enter monthly budget first");
    setLoading(true); setError("");
    try {
      const res = await axios.post("/debts/optimize", { monthlyBudget: Number(budget) });
      setResult(res.data);
    } catch (err) { setError(err.response?.data?.message || "Optimizer failed"); }
    finally { setLoading(false); }
  };

  const totalDebt = debts.reduce((s, d) => s + d.remainingAmount, 0);
  const avgRate = debts.length ? (debts.reduce((s, d) => s + d.interestRate, 0) / debts.length).toFixed(1) : 0;

  const debtRisk = (rate) => {
    if (rate >= 24) return { label: "High risk", bg: "#FCEBEB", color: "#A32D2D", dot: "#E24B4A", border: "#0F6E56" };
    if (rate >= 12) return { label: "Moderate", bg: "#FAEEDA", color: "#854F0B", dot: "#BA7517" };
    return { label: "Low risk", bg: "#EAF3DE", color: "#3B6D11", dot: "#639922" };
  };

  const chartData = result ? [
    { strategy: "Avalanche", months: result.avalanche.months, fill: "#378ADD" },
    { strategy: "Snowball", months: result.snowball.months, fill: "#7F77DD" },
    { strategy: "Optimized", months: result.optimized.months, fill: "#1D9E75" },
  ] : [];

  const strategies = result ? [
    { key: "avalanche", label: "Avalanche", desc: "Highest interest first", color: "#378ADD", lightBg: "#EBF4FF", icon: "ti-arrow-up" },
    { key: "snowball", label: "Snowball", desc: "Lowest balance first", color: "#7F77DD", lightBg: "#EEEDFE", icon: "ti-snowflake" },
    { key: "optimized", label: "DP Optimized", desc: "Max interest saved (C++ knapsack)", color: "#1D9E75", lightBg: "#E1F5EE", icon: "ti-cpu" },
  ] : [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-base font-medium" style={{ color: "#111827" }}>Debt Manager</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{debts.length} active debts · ₹{totalDebt.toLocaleString("en-IN")} total</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
          style={{ background: "var(--green-700)", boxShadow: "0 2px 8px #0F6E5630" }}>
          <i className="ti ti-plus" style={{ fontSize: 13 }} />
          Add debt
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg text-xs flex items-center gap-2"
          style={{ background: "#FCEBEB", color: "#A32D2D" }}>
          <i className="ti ti-alert-circle" style={{ fontSize: 14 }} />
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: "#E5E7EB" }}>
          <p className="text-xs mb-1" style={{ color: "#6B7280" }}>Total debt remaining</p>
          <p className="text-lg font-medium" style={{ color: "#A32D2D" }}>₹{totalDebt.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: "#E5E7EB" }}>
          <p className="text-xs mb-1" style={{ color: "#6B7280" }}>Average interest rate</p>
          <p className="text-lg font-medium" style={{ color: "#854F0B" }}>{avgRate}%</p>
        </div>
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: "#E5E7EB" }}>
          <p className="text-xs mb-1" style={{ color: "#6B7280" }}>Active debts</p>
          <p className="text-lg font-medium" style={{ color: "#185FA5" }}>{debts.length}</p>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="mb-4">
          <p className="text-sm font-medium mb-4" style={{ color: "#111827" }}>Add new debt</p>
          <form onSubmit={handleAdd} className="grid grid-cols-3 gap-3">
            <input required placeholder="Debt name (e.g. Credit card)" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            <input required type="number" placeholder="Total amount (₹)" value={form.totalAmount}
              onChange={e => setForm({ ...form, totalAmount: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            <input required type="number" placeholder="Remaining amount (₹)" value={form.remainingAmount}
              onChange={e => setForm({ ...form, remainingAmount: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            <input required type="number" placeholder="Interest rate (%)" value={form.interestRate}
              onChange={e => setForm({ ...form, interestRate: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            <input required type="number" placeholder="Min monthly payment (₹)" value={form.minimumPayment}
              onChange={e => setForm({ ...form, minimumPayment: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            <input type="date" value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            <div className="col-span-3 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-xs border"
                style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>Cancel</button>
              <button type="submit"
                className="px-4 py-2 rounded-lg text-xs font-medium text-white"
                style={{ background: "var(--green-700)" }}>Add debt</button>
            </div>
          </form>
        </Card>
      )}

      {/* Debt list */}
      {debts.length > 0 && (
        <Card className="mb-4">
          <p className="text-sm font-medium mb-4" style={{ color: "#111827" }}>Your debts</p>
          <div className="divide-y" style={{ borderColor: "#F9FAFB" }}>
            {debts.map(d => {
              const risk = debtRisk(d.interestRate);
              const paidPct = Math.round(((d.totalAmount - d.remainingAmount) / d.totalAmount) * 100);
              return (
                <div key={d._id} className="py-3 group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: risk.dot }} />
                    <p className="text-xs font-medium flex-1" style={{ color: "#111827" }}>{d.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: risk.bg, color: risk.color, fontSize: 9.5 }}>{risk.label}</span>
                    <p className="text-sm font-medium" style={{ color: "#A32D2D" }}>
                      ₹{d.remainingAmount.toLocaleString("en-IN")}
                    </p>
                    <button onClick={() => handleDelete(d._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded flex items-center justify-center hover:bg-red-50"
                      style={{ color: "#EF4444" }}>
                      <i className="ti ti-trash" style={{ fontSize: 12 }} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 ml-5">
                    <div className="flex-1 rounded-full h-1" style={{ background: "#F3F4F6" }}>
                      <div className="h-1 rounded-full" style={{ width: `${paidPct}%`, background: risk.dot }} />
                    </div>
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>{paidPct}% paid</span>
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>{d.interestRate}% interest</span>
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>Min ₹{d.minimumPayment.toLocaleString("en-IN")}/mo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Optimizer */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-medium" style={{ color: "#111827" }}>Debt Payoff Optimizer</p>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>C++ DP knapsack + min-heap · 3 strategies compared</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: "#E1F5EE" }}>
            <i className="ti ti-cpu" style={{ fontSize: 13, color: "#0F6E56" }} />
            <span className="text-xs font-medium" style={{ color: "#0F6E56" }}>Powered by C++</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 mb-4">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#9CA3AF" }}>₹</span>
            <input type="number" placeholder="Monthly budget" value={budget}
              onChange={e => setBudget(e.target.value)}
              className="w-full pl-7 pr-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
          <button onClick={handleOptimize} disabled={loading || debts.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white disabled:opacity-50 transition-opacity"
            style={{ background: "var(--green-700)" }}>
            {loading ? (
              <><div className="w-3 h-3 border border-t-transparent rounded-full animate-spin border-white" />Optimizing...</>
            ) : (
              <><i className="ti ti-bolt" style={{ fontSize: 13 }} />Optimize</>
            )}
          </button>
        </div>

        {result && (
          <div className="space-y-4">
            {/* Bar chart */}
            <div className="p-4 rounded-xl" style={{ background: "#F9FAFB" }}>
              <p className="text-xs font-medium mb-3" style={{ color: "#374151" }}>Months to payoff comparison</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="strategy" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false}
                    label={{ value: "Months", angle: -90, position: "insideLeft", fill: "#9CA3AF", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "white", border: "0.5px solid #E5E7EB", borderRadius: 8, fontSize: 11 }}
                    formatter={(v) => [`${v} months`, "Payoff time"]} />
                  <Bar dataKey="months" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <rect key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Strategy cards */}
            <div className="grid grid-cols-3 gap-3">
              {strategies.map(({ key, label, desc, color, lightBg, icon }) => (
                <div key={key} className="rounded-xl p-4 border-l-4"
                  style={{ background: lightBg, borderLeftColor: color }}>
                  <div className="flex items-center gap-2 mb-2">
                    <i className={`ti ${icon}`} style={{ fontSize: 14, color }} />
                    <p className="text-xs font-medium" style={{ color: "#111827" }}>{label}</p>
                  </div>
                  <p className="text-xs mb-3" style={{ color: "#6B7280" }}>{desc}</p>
                  <p className="text-2xl font-medium mb-3" style={{ color }}>
                    {result[key].months}
                    <span className="text-xs font-normal ml-1" style={{ color: "#6B7280" }}>months</span>
                  </p>
                  <div className="space-y-1.5">
                    {result[key].payments.map((p, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-xs truncate" style={{ color: "#6B7280", maxWidth: "60%" }}>{p.name}</span>
                        <span className="text-xs font-medium" style={{ color: "#111827" }}>
                          ₹{Math.round(p.payment).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {debts.length === 0 && (
          <div className="text-center py-10">
            <i className="ti ti-credit-card-off" style={{ fontSize: 32, color: "#D1D5DB" }} />
            <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>Add debts above to use the optimizer</p>
          </div>
        )}
      </Card>
    </div>
  );
}