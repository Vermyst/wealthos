import { useEffect, useState } from "react";
import axios from "../utils/axios";
import Card from "../components/Card";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ name: "", targetAmount: "", savedAmount: "", priority: "1", deadline: "" });
  const [savings, setSavings] = useState("");
  const [result, setResult] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const fetchGoals = async () => {
    const res = await axios.get("/goals");
    setGoals(res.data);
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/goals", form);
      setForm({ name: "", targetAmount: "", savedAmount: "", priority: "1", deadline: "" });
      setShowForm(false);
      fetchGoals();
    } catch (err) { setError(err.response?.data?.message || "Failed to add"); }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/goals/${id}`);
    fetchGoals();
  };

  const handleAllocate = async () => {
    if (!savings) return setError("Enter monthly savings first");
    setError("");
    try {
      const res = await axios.post("/goals/allocate", { monthlySavings: Number(savings) });
      setResult(res.data);
    } catch (err) { setError(err.response?.data?.message || "Allocation failed"); }
  };

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const priorityConfig = {
    "3": { label: "High", bg: "#FCEBEB", color: "#A32D2D" },
    "2": { label: "Medium", bg: "#FAEEDA", color: "#854F0B" },
    "1": { label: "Low", bg: "#E6F1FB", color: "#185FA5" },
  };

  const goalColors = ["#1D9E75", "#378ADD", "#7F77DD", "#D4537E", "#BA7517", "#E24B4A"];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-base font-medium" style={{ color: "#111827" }}>Savings Goals</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            {goals.length} goals · ₹{totalSaved.toLocaleString("en-IN")} saved of ₹{totalTarget.toLocaleString("en-IN")}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
          style={{ background: "var(--green-700)", boxShadow: "0 2px 8px #0F6E5630" }}>
          <i className="ti ti-plus" style={{ fontSize: 13 }} />
          Add goal
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg text-xs flex items-center gap-2"
          style={{ background: "#FCEBEB", color: "#A32D2D" }}>
          <i className="ti ti-alert-circle" style={{ fontSize: 14 }} />
          {error}
        </div>
      )}

      {/* Overall progress */}
      {goals.length > 0 && (
        <div className="bg-white rounded-xl border p-4 mb-4" style={{ borderColor: "#E5E7EB" }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium" style={{ color: "#111827" }}>Overall savings progress</p>
            <p className="text-xs font-medium" style={{ color: "var(--green-700)" }}>{overallPct}%</p>
          </div>
          <div className="rounded-full h-2 mb-2" style={{ background: "#F3F4F6" }}>
            <div className="h-2 rounded-full transition-all"
              style={{ width: `${overallPct}%`, background: "linear-gradient(90deg, var(--green-600), var(--green-700))" }} />
          </div>
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: "#6B7280" }}>₹{totalSaved.toLocaleString("en-IN")} saved</span>
            <span className="text-xs" style={{ color: "#6B7280" }}>₹{(totalTarget - totalSaved).toLocaleString("en-IN")} remaining</span>
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <Card className="mb-4">
          <p className="text-sm font-medium mb-4" style={{ color: "#111827" }}>New savings goal</p>
          <form onSubmit={handleAdd} className="grid grid-cols-3 gap-3">
            <input required placeholder="Goal name (e.g. Emergency fund)" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            <input required type="number" placeholder="Target amount (₹)" value={form.targetAmount}
              onChange={e => setForm({ ...form, targetAmount: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            <input type="number" placeholder="Already saved (₹)" value={form.savedAmount}
              onChange={e => setForm({ ...form, savedAmount: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }}>
              <option value="3">High priority</option>
              <option value="2">Medium priority</option>
              <option value="1">Low priority</option>
            </select>
            <input type="date" value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            <div className="flex justify-end gap-2 col-span-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-xs border"
                style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>Cancel</button>
              <button type="submit"
                className="px-4 py-2 rounded-lg text-xs font-medium text-white"
                style={{ background: "var(--green-700)" }}>Add goal</button>
            </div>
          </form>
        </Card>
      )}

      {/* Goals grid */}
      {goals.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {goals.map((g, idx) => {
            const pct = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
            const color = goalColors[idx % goalColors.length];
            const pri = priorityConfig[String(g.priority)] || priorityConfig["1"];
            const remaining = g.targetAmount - g.savedAmount;
            return (
              <div key={g._id} className="bg-white rounded-xl border p-4 group"
                style={{ borderColor: "#E5E7EB" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}18` }}>
                      <i className="ti ti-target" style={{ fontSize: 14, color }} />
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: "#111827" }}>{g.name}</p>
                      {g.deadline && (
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>
                          Due {new Date(g.deadline).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: pri.bg, color: pri.color, fontSize: 9.5 }}>{pri.label}</span>
                    <button onClick={() => handleDelete(g._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded flex items-center justify-center hover:bg-red-50"
                      style={{ color: "#EF4444" }}>
                      <i className="ti ti-trash" style={{ fontSize: 12 }} />
                    </button>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs" style={{ color: "#6B7280" }}>₹{g.savedAmount.toLocaleString("en-IN")} saved</span>
                    <span className="text-xs font-medium" style={{ color }}>{pct}%</span>
                  </div>
                  <div className="rounded-full h-2" style={{ background: "#F3F4F6" }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: "#9CA3AF" }}>
                    ₹{remaining.toLocaleString("en-IN")} to go
                  </span>
                  <span className="text-xs font-medium" style={{ color: "#374151" }}>
                    / ₹{g.targetAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Greedy allocator */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-medium" style={{ color: "#111827" }}>Smart Goal Allocator</p>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Greedy algorithm · distributes savings by priority order</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "#E6F1FB" }}>
            <i className="ti ti-brain" style={{ fontSize: 13, color: "#185FA5" }} />
            <span className="text-xs font-medium" style={{ color: "#185FA5" }}>Greedy DSA</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 mb-4">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#9CA3AF" }}>₹</span>
            <input type="number" placeholder="Monthly savings available" value={savings}
              onChange={e => setSavings(e.target.value)}
              className="w-full pl-7 pr-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
          <button onClick={handleAllocate} disabled={goals.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white disabled:opacity-50"
            style={{ background: "var(--green-700)" }}>
            <i className="ti ti-bolt" style={{ fontSize: 13 }} />
            Allocate
          </button>
        </div>

        {result && (
          <div className="space-y-2">
            {result.allocations.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: a.status === "completed" ? "#F9FAFB" : "#F0FBF7" }}>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: a.status === "completed" ? "#F3F4F6" : "#E1F5EE" }}>
                    <i className={`ti ${a.status === "completed" ? "ti-check" : "ti-target"}`}
                      style={{ fontSize: 13, color: a.status === "completed" ? "#9CA3AF" : "#0F6E56" }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "#111827" }}>{a.name}</p>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>
                      {a.monthsLeft ? `~${a.monthsLeft} months to complete` : a.status}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium" style={{ color: a.allocate > 0 ? "#0F6E56" : "#9CA3AF" }}>
                    ₹{a.allocate.toLocaleString("en-IN")}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: a.status === "will complete" ? "#E1F5EE" : a.status === "completed" ? "#F3F4F6" : "#FAEEDA",
                      color: a.status === "will complete" ? "#0F6E56" : a.status === "completed" ? "#9CA3AF" : "#854F0B",
                      fontSize: 9.5
                    }}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
            {result.budgetLeft > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "#F9FAFB" }}>
                <i className="ti ti-wallet" style={{ fontSize: 13, color: "#9CA3AF" }} />
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  ₹{result.budgetLeft.toLocaleString("en-IN")} left unallocated — consider adding a new goal
                </p>
              </div>
            )}
          </div>
        )}

        {goals.length === 0 && (
          <div className="text-center py-10">
            <i className="ti ti-target-off" style={{ fontSize: 32, color: "#D1D5DB" }} />
            <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>Add goals above to use the allocator</p>
          </div>
        )}
      </Card>
    </div>
  );
}