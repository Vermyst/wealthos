import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const GITHUB_URL = "https://github.com/Vermyst/wealthos";

const features = [
  { icon: "ti-arrows-transfer-up", title: "Debt optimizer", desc: "C++ DP knapsack + min-heap finds the mathematically optimal payoff strategy across 3 approaches — avalanche, snowball, and DP optimized.", bg: "#E1F5EE", color: "#0F6E56" },
  { icon: "ti-chart-line", title: "Net worth projector", desc: "Simulate your financial future month by month. Adjust income, savings rate and investment return with live sliders.", bg: "#E6F1FB", color: "#185FA5" },
  { icon: "ti-message-chatbot", title: "AI financial advisor", desc: "Ask anything about your money. Every answer is grounded in your real transactions, debts and goals — not generic advice.", bg: "#EEEDFE", color: "#534AB7" },
  { icon: "ti-target", title: "Smart goal allocator", desc: "Greedy algorithm distributes your monthly savings across savings goals in priority order automatically.", bg: "#FAEEDA", color: "#854F0B" },
  { icon: "ti-bell-ringing", title: "Real-time alerts", desc: "Socket.IO WebSocket connection pushes instant notifications the moment you breach your monthly budget limit.", bg: "#FBEAF0", color: "#993556" },
  { icon: "ti-search", title: "Trie autocomplete", desc: "O(k) prefix search over your entire transaction history — built from scratch, no library used.", bg: "#EAF3DE", color: "#3B6D11" },
];

const steps = [
  { num: "1", title: "Create your account", desc: "Sign up free with email or Google OAuth. No credit card needed ever." },
  { num: "2", title: "Add your data", desc: "Upload a bank CSV or manually enter income, expenses and debts." },
  { num: "3", title: "Get real insights", desc: "Debt optimizer, net worth projector and AI advisor activate instantly." },
];

const faqs = [
  { q: "Is WealthOS really free?", a: "Yes — completely free forever. No credit card, no premium tier, no ads. WealthOS is a portfolio project built to showcase real engineering." },
  { q: "Is my financial data safe?", a: "All data is stored in your personal account on MongoDB Atlas with JWT authentication. Passwords are hashed with bcrypt. No data is shared or sold." },
  { q: "Do I need to connect my bank?", a: "No. You can upload a CSV export from your bank or enter transactions manually. There's no direct bank connection required." },
  { q: "What DSA algorithms does it use?", a: "Six — min-heap for debt scheduling, DP knapsack for optimal payoff, sliding window for spend analysis, HashMap for category aggregation, Trie for autocomplete, and greedy for goal allocation." },
  { q: "What tech stack is it built on?", a: "React + Tailwind on the frontend, Node.js + Express on the backend, MongoDB for the database, Socket.IO for real-time alerts, and Google Gemini for AI." },
];

// Mock screenshot components
const DashboardMock = () => (
  <div style={{ background: "#F0F4F2", borderRadius: 12, padding: 16, fontSize: 11 }}>
    <div style={{ background: "#0D2B22", borderRadius: 8, padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 18, height: 18, background: "#1D9E75", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className="ti ti-trending-up" style={{ fontSize: 10, color: "white" }} />
      </div>
      <span style={{ color: "white", fontWeight: 500, fontSize: 11 }}>WealthOS</span>
      <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
        {["Dashboard", "Transactions", "Debts"].map(l => (
          <span key={l} style={{ color: "#8DB8A0", fontSize: 9, padding: "2px 6px", borderRadius: 4 }}>{l}</span>
        ))}
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 10 }}>
      {[
        { label: "Income", val: "₹50,000", color: "#0F6E56", bg: "#E1F5EE" },
        { label: "Expenses", val: "₹18,200", color: "#A32D2D", bg: "#FCEBEB" },
        { label: "Debt", val: "₹85,000", color: "#854F0B", bg: "#FAEEDA" },
        { label: "Saved", val: "₹12,000", color: "#185FA5", bg: "#E6F1FB" },
      ].map(s => (
        <div key={s.label} style={{ background: "white", borderRadius: 6, padding: "8px 10px", border: "0.5px solid #E5E7EB" }}>
          <p style={{ color: "#9CA3AF", fontSize: 9, marginBottom: 3 }}>{s.label}</p>
          <p style={{ color: s.color, fontWeight: 500, fontSize: 11 }}>{s.val}</p>
        </div>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 8 }}>
      <div style={{ background: "white", borderRadius: 6, padding: 10, border: "0.5px solid #E5E7EB" }}>
        <p style={{ color: "#111827", fontWeight: 500, marginBottom: 8, fontSize: 10 }}>Spending breakdown</p>
        {[["Food", "72%", "#1D9E75"], ["Transport", "38%", "#378ADD"], ["Shopping", "28%", "#7F77DD"], ["Entertainment", "18%", "#D4537E"]].map(([cat, pct, color]) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <span style={{ color: "#6B7280", width: 60, fontSize: 9 }}>{cat}</span>
            <div style={{ flex: 1, background: "#F3F4F6", borderRadius: 99, height: 4 }}>
              <div style={{ width: pct, background: color, height: 4, borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "white", borderRadius: 6, padding: 10, border: "0.5px solid #E5E7EB" }}>
        <p style={{ color: "#111827", fontWeight: 500, marginBottom: 8, fontSize: 10 }}>Active debts</p>
        {[["Credit card", "36%", "#E24B4A", "High"], ["Personal loan", "12%", "#BA7517", "Mid"], ["Study loan", "8%", "#639922", "Low"]].map(([name, rate, dot, risk]) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: dot, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ color: "#111827", fontSize: 9, fontWeight: 500 }}>{name}</p>
              <p style={{ color: "#9CA3AF", fontSize: 8 }}>{rate} interest</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DebtMock = () => (
  <div style={{ background: "white", borderRadius: 12, padding: 14, border: "0.5px solid #E5E7EB", fontSize: 11 }}>
    <p style={{ fontWeight: 500, color: "#111827", marginBottom: 10, fontSize: 12 }}>Debt payoff optimizer</p>
    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#E1F5EE", padding: "6px 10px", borderRadius: 6, marginBottom: 10 }}>
      <i className="ti ti-cpu" style={{ fontSize: 11, color: "#0F6E56" }} />
      <span style={{ fontSize: 9, color: "#0F6E56", fontWeight: 500 }}>Powered by DP knapsack + min-heap algorithm</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
      {[
        { label: "Avalanche", months: 21, color: "#378ADD", bg: "#EBF4FF", desc: "Highest interest first" },
        { label: "Snowball", months: 24, color: "#7F77DD", bg: "#EEEDFE", desc: "Lowest balance first" },
        { label: "DP Optimized", months: 19, color: "#1D9E75", bg: "#E1F5EE", desc: "Max interest saved" },
      ].map(s => (
        <div key={s.label} style={{ background: s.bg, borderRadius: 8, padding: 10, borderLeft: `3px solid ${s.color}` }}>
          <p style={{ fontWeight: 500, color: "#111827", fontSize: 10, marginBottom: 2 }}>{s.label}</p>
          <p style={{ color: "#6B7280", fontSize: 8, marginBottom: 6 }}>{s.desc}</p>
          <p style={{ fontSize: 20, fontWeight: 500, color: s.color }}>{s.months}<span style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 400 }}> mo</span></p>
        </div>
      ))}
    </div>
  </div>
);

const ChatMock = () => (
  <div style={{ background: "white", borderRadius: 12, padding: 14, border: "0.5px solid #E5E7EB" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: "#0F6E56", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className="ti ti-message-chatbot" style={{ fontSize: 13, color: "white" }} />
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 500, color: "#111827" }}>AI Financial Advisor</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#1D9E75" }} />
          <p style={{ fontSize: 9, color: "#6B7280" }}>Online · Grounded in your data</p>
        </div>
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
      <div style={{ background: "#0F6E56", color: "white", borderRadius: "12px 12px 2px 12px", padding: "7px 11px", maxWidth: "75%", fontSize: 10 }}>
        Which debt should I pay off first?
      </div>
    </div>
    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
      <div style={{ width: 22, height: 22, borderRadius: 6, background: "#0F6E56", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <i className="ti ti-sparkles" style={{ fontSize: 10, color: "white" }} />
      </div>
      <div style={{ background: "#F9FAFB", border: "0.5px solid #E5E7EB", borderRadius: "12px 12px 12px 2px", padding: "8px 11px", fontSize: 10, color: "#374151", lineHeight: 1.55 }}>
        <p style={{ color: "#0F6E56", fontWeight: 500, marginBottom: 4, fontSize: 9 }}>WealthOS AI</p>
        Based on your data, your Credit Card at 36% interest is costing you the most. Pay that first — it saves ₹8,400 in interest vs snowball.
      </div>
    </div>
  </div>
);

export default function Landing() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  const handleContact = (e) => {
    e.preventDefault();
    setContactSent(true);
  };

  const screens = {
    dashboard: { component: <DashboardMock />, label: "Dashboard" },
    debt: { component: <DebtMock />, label: "Debt optimizer" },
    chat: { component: <ChatMock />, label: "AI advisor" },
  };

  return (
    <div style={{ background: "white", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "white", borderBottom: "0.5px solid #E5E7EB", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#0F6E56", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-trending-up" style={{ fontSize: 14, color: "white" }} />
          </div>
          <span style={{ fontWeight: 500, fontSize: 14, color: "#111827" }}>WealthOS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {[["Features", "#features"], ["How it works", "#how-it-works"], ["FAQ", "#faq"], ["About", "#about"], ["Contact", "#contact"]].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: 13, color: "#6B7280", textDecoration: "none" }}
              onMouseOver={e => e.target.style.color = "#0F6E56"}
              onMouseOut={e => e.target.style.color = "#6B7280"}>
              {label}
            </a>
          ))}
          <a href={GITHUB_URL} target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#6B7280", textDecoration: "none" }}
            onMouseOver={e => e.target.style.color = "#111827"}
            onMouseOut={e => e.target.style.color = "#6B7280"}>
            <i className="ti ti-brand-github" style={{ fontSize: 16 }} />
            GitHub
          </a>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate("/login")}
            style={{ padding: "7px 14px", borderRadius: 8, border: "0.5px solid #E5E7EB", background: "white", fontSize: 13, color: "#374151", cursor: "pointer" }}>
            Log in
          </button>
          <button onClick={() => navigate("/register")}
            style={{ padding: "7px 14px", borderRadius: 8, background: "#0F6E56", border: "none", fontSize: 13, color: "white", cursor: "pointer", fontWeight: 500 }}>
            Get started free →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #0D3D2C 0%, #0F6E56 55%, #1D9E75 100%)", padding: "64px 32px 0", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "0.5px solid rgba(255,255,255,0.25)", color: "#A8F0D8", fontSize: 12, fontWeight: 500, padding: "5px 14px", borderRadius: 99, marginBottom: 20 }}>
          <i className="ti ti-sparkles" style={{ fontSize: 12 }} />
          AI-powered · DSA-driven · Real-time
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 500, color: "white", lineHeight: 1.2, marginBottom: 16 }}>
          Your money, finally<br />
          <span style={{ color: "#7DFFC8" }}>under control</span>
        </h1>
        <p style={{ fontSize: 15, color: "#A8D8C8", lineHeight: 1.75, maxWidth: 500, margin: "0 auto 28px" }}>
          WealthOS helps you clear debt faster, save smarter, and project your net worth — powered by real algorithms, AI, and real-time insights.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 40 }}>
          <button onClick={() => navigate("/register")}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, background: "white", color: "#0F6E56", border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            <i className="ti ti-rocket" style={{ fontSize: 15 }} />
            Start for free
          </button>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, background: "transparent", color: "white", border: "0.5px solid rgba(255,255,255,0.4)", fontSize: 14, textDecoration: "none" }}>
            <i className="ti ti-brand-github" style={{ fontSize: 15 }} />
            View on GitHub
          </a>
        </div>

        {/* Stats */}
        <div style={{ maxWidth: 640, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "rgba(255,255,255,0.1)", borderTop: "0.5px solid rgba(255,255,255,0.15)", borderRadius: "12px 12px 0 0" }}>
          {[["3 strategies", "Debt payoff methods"], ["6 algorithms", "DSA under the hood"], ["Real-time", "Budget breach alerts"], ["AI advisor", "Grounded in your data"]].map(([val, label], i) => (
            <div key={i} style={{ padding: "18px 0", textAlign: "center", borderRight: i < 3 ? "0.5px solid rgba(255,255,255,0.15)" : "none" }}>
              <p style={{ fontSize: 16, fontWeight: 500, color: "white", margin: "0 0 3px" }}>{val}</p>
              <p style={{ fontSize: 11, color: "#A8D8C8", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* App preview */}
      <section style={{ background: "#F0F4F2", padding: "48px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#0F6E56", marginBottom: 6 }}>Live preview</p>
          <h2 style={{ fontSize: 22, fontWeight: 500, color: "#111827", marginBottom: 8 }}>See it in action</h2>
          <p style={{ fontSize: 13, color: "#6B7280" }}>Real UI screenshots from the live app</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          {Object.entries(screens).map(([key, { label }]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{ padding: "7px 16px", borderRadius: 99, fontSize: 12, cursor: "pointer", border: "none", background: activeTab === key ? "#0F6E56" : "#E5E7EB", color: activeTab === key ? "white" : "#6B7280", fontWeight: activeTab === key ? 500 : 400, transition: "all 0.15s" }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          {screens[activeTab].component}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "64px 32px", background: "white" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ display: "inline-block", background: "#E1F5EE", color: "#0F6E56", fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 99, marginBottom: 12 }}>Features</span>
          <h2 style={{ fontSize: 26, fontWeight: 500, color: "#111827", marginBottom: 8 }}>Everything you need to master your finances</h2>
          <p style={{ fontSize: 14, color: "#6B7280" }}>Built with real algorithms — not just spreadsheets</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 900, margin: "0 auto" }}>
          {features.map((f, i) => (
            <div key={i} style={{ padding: 20, borderRadius: 14, border: "0.5px solid #E5E7EB", background: "white", transition: "box-shadow 0.2s" }}
              onMouseOver={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"}
              onMouseOut={e => e.currentTarget.style.boxShadow = "none"}>
              <div style={{ width: 36, height: 36, background: f.bg, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <i className={`ti ${f.icon}`} style={{ fontSize: 16, color: f.color }} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#111827", marginBottom: 6 }}>{f.title}</p>
              <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: "64px 32px", background: "#F2FAF7", borderTop: "0.5px solid #D0EEE4" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ display: "inline-block", background: "#C4EEE0", color: "#085041", fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 99, marginBottom: 12 }}>How it works</span>
          <h2 style={{ fontSize: 26, fontWeight: 500, color: "#111827", marginBottom: 8 }}>Up and running in 2 minutes</h2>
          <p style={{ fontSize: 14, color: "#6B7280" }}>No bank connection required — start with a CSV or manual entry</p>
        </div>
        <div style={{ display: "flex", maxWidth: 700, margin: "0 auto" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", position: "relative", padding: "0 16px" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0F6E56", color: "white", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                {s.num}
              </div>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#111827", marginBottom: 6 }}>{s.title}</p>
              <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.65 }}>{s.desc}</p>
              {i < steps.length - 1 && (
                <div style={{ position: "absolute", top: 18, left: "62%", width: "76%", height: 0.5, background: "#B5DDD0" }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "64px 32px", background: "white" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ display: "inline-block", background: "#E6F1FB", color: "#185FA5", fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 99, marginBottom: 12 }}>FAQ</span>
          <h2 style={{ fontSize: 26, fontWeight: 500, color: "#111827" }}>Frequently asked questions</h2>
        </div>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: "0.5px solid #E5E7EB" }}>
              <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{faq.q}</span>
                <i className={`ti ${activeFaq === i ? "ti-minus" : "ti-plus"}`} style={{ fontSize: 16, color: "#6B7280", flexShrink: 0 }} />
              </button>
              {activeFaq === i && (
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, paddingBottom: 18, margin: 0 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: "64px 32px", background: "#F0F4F2" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-block", background: "#E1F5EE", color: "#0F6E56", fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 99, marginBottom: 14 }}>About</span>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: "#111827", marginBottom: 14 }}>Built by a developer, for developers</h2>
            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.75, marginBottom: 14 }}>
              WealthOS is a portfolio project built by Tanishk to demonstrate full-stack engineering skills — combining real DSA algorithms, AI integration, real-time features, and production-grade auth in a single cohesive application.
            </p>
            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.75, marginBottom: 20 }}>
              Every feature was deliberately designed to showcase a different engineering concept — from DP knapsack for debt optimization to Trie autocomplete for search, Socket.IO for real-time alerts, and JWT auth with refresh token rotation.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 9, background: "#111827", color: "white", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
                <i className="ti ti-brand-github" style={{ fontSize: 15 }} />
                View source
              </a>
              <button onClick={() => navigate("/register")}
                style={{ padding: "9px 16px", borderRadius: 9, background: "white", border: "0.5px solid #E5E7EB", fontSize: 13, color: "#374151", cursor: "pointer" }}>
                Try the app
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "ti-code", label: "Open source", val: "MIT license", bg: "#E1F5EE", color: "#0F6E56" },
              { icon: "ti-cpu", label: "DSA algorithms", val: "6 implemented", bg: "#E6F1FB", color: "#185FA5" },
              { icon: "ti-brand-react", label: "Frontend", val: "React + Tailwind", bg: "#EEEDFE", color: "#534AB7" },
              { icon: "ti-server", label: "Backend", val: "Node + Express", bg: "#FAEEDA", color: "#854F0B" },
              { icon: "ti-database", label: "Database", val: "MongoDB Atlas", bg: "#EAF3DE", color: "#3B6D11" },
              { icon: "ti-rocket", label: "Deployed on", val: "Vercel + Render", bg: "#FBEAF0", color: "#993556" },
            ].map((item, i) => (
              <div key={i} style={{ background: "white", borderRadius: 10, padding: "12px 14px", border: "0.5px solid #E5E7EB" }}>
                <div style={{ width: 28, height: 28, background: item.bg, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                  <i className={`ti ${item.icon}`} style={{ fontSize: 13, color: item.color }} />
                </div>
                <p style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2 }}>{item.label}</p>
                <p style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: "64px 32px", background: "white" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "#FAEEDA", color: "#854F0B", fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 99, marginBottom: 14 }}>Contact</span>
          <h2 style={{ fontSize: 26, fontWeight: 500, color: "#111827", marginBottom: 8 }}>Get in touch</h2>
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 32 }}>Have a question, feedback, or want to collaborate? Send a message.</p>
          {contactSent ? (
            <div style={{ background: "#E1F5EE", borderRadius: 12, padding: "24px", textAlign: "center" }}>
              <i className="ti ti-circle-check" style={{ fontSize: 32, color: "#0F6E56", marginBottom: 10, display: "block" }} />
              <p style={{ fontWeight: 500, color: "#0F6E56", marginBottom: 4 }}>Message sent!</p>
              <p style={{ fontSize: 13, color: "#6B7280" }}>Thanks for reaching out. I'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleContact} style={{ textAlign: "left" }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Name</label>
                <input required placeholder="Your name" value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 9, border: "0.5px solid #E5E7EB", fontSize: 13, color: "#111827", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Email</label>
                <input required type="email" placeholder="you@example.com" value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 9, border: "0.5px solid #E5E7EB", fontSize: 13, color: "#111827", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Message</label>
                <textarea required rows={4} placeholder="Your message..." value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 9, border: "0.5px solid #E5E7EB", fontSize: 13, color: "#111827", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <button type="submit"
                style={{ width: "100%", padding: "11px", borderRadius: 9, background: "#0F6E56", color: "white", border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                Send message
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "64px 32px", textAlign: "center", background: "#0D3D2C" }}>
        <h2 style={{ fontSize: 26, fontWeight: 500, color: "white", marginBottom: 10 }}>Ready to take control of your finances?</h2>
        <p style={{ fontSize: 14, color: "#A8D8C8", marginBottom: 28 }}>Free forever. No credit card. No ads.</p>
        <button onClick={() => navigate("/register")}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 11, background: "#1D9E75", color: "white", border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
          <i className="ti ti-rocket" style={{ fontSize: 15 }} />
          Create free account
        </button>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0A2D1E", padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, background: "#1D9E75", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-trending-up" style={{ fontSize: 12, color: "white" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "white" }}>WealthOS</span>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#6ABDA0", textDecoration: "none" }}>GitHub</a>
          <Link to="/privacy" style={{ fontSize: 12, color: "#6ABDA0", textDecoration: "none" }}>Privacy Policy</Link>
          <Link to="/terms" style={{ fontSize: 12, color: "#6ABDA0", textDecoration: "none" }}>Terms of Use</Link>
          <a href="#contact" style={{ fontSize: 12, color: "#6ABDA0", textDecoration: "none" }}>Contact</a>
        </div>
        <p style={{ fontSize: 12, color: "#6ABDA0", margin: 0 }}>Built by Tanishk · 2026</p>
      </footer>
    </div>
  );
}