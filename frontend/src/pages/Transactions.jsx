import { useEffect, useState, useRef } from "react";
import axios from "../utils/axios";
import Papa from "papaparse";
import Card from "../components/Card";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", type: "expense", date: "" });
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const fileRef = useRef();

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/transactions");
      setTransactions(res.data);
    } catch { setError("Failed to fetch transactions"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTransactions(); }, []);

  useEffect(() => {
    if (search.length < 1) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`/search/autocomplete?q=${search}`);
        setSuggestions(res.data);
      } catch { setSuggestions([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/transactions", form);
      setForm({ title: "", amount: "", type: "expense", date: "" });
      setShowForm(false);
      fetchTransactions();
    } catch (err) { setError(err.response?.data?.message || "Failed to add"); }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          await axios.post("/transactions/upload-csv", { transactions: results.data });
          fetchTransactions();
        } catch { setError("CSV upload failed"); }
      }
    });
  };

  const filtered = transactions.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.type === filter;
    return matchSearch && matchFilter;
  });

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const categoryColors = {
    food: "#1D9E75", transport: "#378ADD", shopping: "#7F77DD",
    entertainment: "#D4537E", utilities: "#BA7517", health: "#E24B4A",
    education: "#534AB7", other: "#9CA3AF"
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-base font-medium" style={{ color: "#111827" }}>Transactions</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{transactions.length} total transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} className="hidden" />
          <button onClick={() => fileRef.current.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-gray-50"
            style={{ color: "#374151", borderColor: "#E5E7EB" }}>
            <i className="ti ti-upload" style={{ fontSize: 13 }} />
            Import CSV
          </button>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
            style={{ background: "var(--green-700)", boxShadow: "0 2px 8px #0F6E5630" }}>
            <i className="ti ti-plus" style={{ fontSize: 13 }} />
            Add transaction
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg text-xs flex items-center gap-2"
          style={{ background: "#FCEBEB", color: "#A32D2D" }}>
          <i className="ti ti-alert-circle" style={{ fontSize: 14 }} />
          {error}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <Card className="mb-4">
          <p className="text-sm font-medium mb-4" style={{ color: "#111827" }}>New transaction</p>
          <form onSubmit={handleAdd} className="grid grid-cols-5 gap-3">
            <input required placeholder="Title (e.g. Zomato)" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="col-span-2 px-3 py-2 rounded-lg text-xs border outline-none focus:ring-1"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            <input required type="number" placeholder="Amount (₹)" value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs border outline-none focus:ring-1"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input type="date" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            <div className="col-span-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-xs border"
                style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>
                Cancel
              </button>
              <button type="submit"
                className="px-4 py-2 rounded-lg text-xs font-medium text-white"
                style={{ background: "var(--green-700)" }}>
                Add transaction
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: "#E5E7EB" }}>
          <p className="text-xs mb-1" style={{ color: "#6B7280" }}>Total income</p>
          <p className="text-lg font-medium" style={{ color: "#0F6E56" }}>₹{totalIncome.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: "#E5E7EB" }}>
          <p className="text-xs mb-1" style={{ color: "#6B7280" }}>Total expenses</p>
          <p className="text-lg font-medium" style={{ color: "#A32D2D" }}>₹{totalExpense.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: "#E5E7EB" }}>
          <p className="text-xs mb-1" style={{ color: "#6B7280" }}>Net balance</p>
          <p className="text-lg font-medium" style={{ color: totalIncome - totalExpense >= 0 ? "#0F6E56" : "#A32D2D" }}>
            ₹{Math.abs(totalIncome - totalExpense).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Transaction list */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          {/* Search with Trie autocomplete */}
          <div className="relative flex-1">
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: 13, color: "#9CA3AF" }} />
            <input placeholder="Search transactions..." value={search}
              onChange={e => setSearch(e.target.value)}
              onBlur={() => setTimeout(() => setSuggestions([]), 150)}
              className="w-full pl-8 pr-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-lg mt-1 z-10 shadow-sm overflow-hidden"
                style={{ borderColor: "#E5E7EB" }}>
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => { setSearch(s); setSuggestions([]); }}
                    className="px-3 py-2 text-xs capitalize cursor-pointer hover:bg-gray-50"
                    style={{ color: "#374151" }}>
                    <i className="ti ti-search mr-2" style={{ fontSize: 11, color: "#9CA3AF" }} />
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: "#E5E7EB" }}>
            {["all", "income", "expense"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-2 text-xs capitalize transition-colors"
                style={{
                  background: filter === f ? "var(--green-700)" : "white",
                  color: filter === f ? "white" : "#6B7280",
                  borderRight: f !== "expense" ? "0.5px solid #E5E7EB" : "none"
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--green-700)" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <i className="ti ti-receipt-off" style={{ fontSize: 32, color: "#D1D5DB" }} />
            <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>No transactions found</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "#F9FAFB" }}>
            {filtered.map(t => (
              <div key={t._id} className="flex items-center gap-3 py-2.5 group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: t.type === "income" ? "#E1F5EE" : "#FFF7ED" }}>
                  <i className={`ti ${t.type === "income" ? "ti-building-bank" : "ti-shopping-bag"}`}
                    style={{ fontSize: 13, color: t.type === "income" ? "#0F6E56" : "#BA7517" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium capitalize" style={{ color: "#111827" }}>{t.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs px-1.5 py-0.5 rounded-full capitalize"
                      style={{ background: `${categoryColors[t.category]}18`, color: categoryColors[t.category] || "#9CA3AF", fontSize: 9.5 }}>
                      {t.category}
                    </span>
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>
                      {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium flex-shrink-0"
                  style={{ color: t.type === "income" ? "#0F6E56" : "#A32D2D" }}>
                  {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                </p>
                <button onClick={() => handleDelete(t._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded flex items-center justify-center hover:bg-red-50"
                  style={{ color: "#EF4444" }}>
                  <i className="ti ti-trash" style={{ fontSize: 12 }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}