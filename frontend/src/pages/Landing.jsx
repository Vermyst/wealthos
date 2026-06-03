import { useNavigate } from "react-router-dom";

const features = [
  { icon: "ti-arrows-transfer-up", title: "Debt Optimizer", desc: "C++ DP knapsack + min-heap finds the mathematically optimal payoff strategy across 3 approaches.", bg: "#E1F5EE", color: "#0F6E56" },
  { icon: "ti-chart-line", title: "Net Worth Projector", desc: "Simulate your financial future month by month. Adjust income, savings rate and investment return live.", bg: "#E6F1FB", color: "#185FA5" },
  { icon: "ti-message-chatbot", title: "AI Financial Advisor", desc: "Ask anything about your money. Every answer is grounded in your real transactions, debts and goals.", bg: "#EEEDFE", color: "#534AB7" },
  { icon: "ti-target", title: "Smart Goal Allocator", desc: "Greedy algorithm distributes your monthly savings across savings goals in priority order automatically.", bg: "#FAEEDA", color: "#854F0B" },
  { icon: "ti-bell-ringing", title: "Real-time Alerts", desc: "Socket.IO WebSocket pushes instant notifications the moment you breach your monthly budget limit.", bg: "#FBEAF0", color: "#993556" },
  { icon: "ti-search", title: "Trie Autocomplete", desc: "O(k) prefix search over your entire transaction history. Built from scratch — no library used.", bg: "#EAF3DE", color: "#3B6D11" },
];

const steps = [
  { num: "1", title: "Create your account", desc: "Sign up free with email or Google OAuth. No credit card needed." },
  { num: "2", title: "Add your data", desc: "Upload a bank CSV or manually enter income, expenses and debts." },
  { num: "3", title: "Get real insights", desc: "Debt optimizer, net worth projector and AI advisor activate instantly." },
];

const stats = [
  { val: "3 strategies", label: "Debt payoff methods" },
  { val: "6 algorithms", label: "DSA under the hood" },
  { val: "Real-time", label: "Budget breach alerts" },
  { val: "AI advisor", label: "Grounded in your data" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background-primary)" }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-3.5 border-b bg-white"
        style={{ borderColor: "#E5E7EB" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#0F6E56" }}>
            <i className="ti ti-trending-up text-white" style={{ fontSize: 14 }} />
          </div>
          <span className="text-sm font-medium" style={{ color: "#111827" }}>WealthOS</span>
        </div>
        <div className="flex items-center gap-6">
          {["Features", "How it works", "About"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`}
              className="text-xs transition-colors hover:text-green-700"
              style={{ color: "#6B7280" }}>{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/login")}
            className="px-3 py-1.5 rounded-lg text-xs border transition-colors hover:border-green-600 hover:text-green-700"
            style={{ borderColor: "#E5E7EB", color: "#374151" }}>
            Log in
          </button>
          <button onClick={() => navigate("/register")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "#0F6E56" }}>
            Get started free →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-8 pt-16 pb-0"
        style={{ background: "linear-gradient(160deg, #0D3D2C 0%, #0F6E56 55%, #1D9E75 100%)" }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-medium"
          style={{ background: "#ffffff20", border: "0.5px solid #ffffff30", color: "#A8F0D8" }}>
          <i className="ti ti-sparkles" style={{ fontSize: 11 }} />
          AI-powered · DSA-driven · Real-time
        </div>
        <h1 className="text-4xl font-medium text-white mb-4 leading-tight">
          Your money, finally<br />
          <span style={{ color: "#7DFFC8" }}>under control</span>
        </h1>
        <p className="text-sm mb-8 max-w-lg mx-auto leading-relaxed" style={{ color: "#A8D8C8" }}>
          WealthOS helps you clear debt faster, save smarter, and project your net worth — powered by real algorithms, AI, and real-time insights.
        </p>
        <div className="flex items-center justify-center gap-3 mb-10">
          <button onClick={() => navigate("/register")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: "white", color: "#0F6E56" }}>
            <i className="ti ti-rocket" style={{ fontSize: 14 }} />
            Start for free
          </button>
          <button onClick={() => document.getElementById("how-it-works").scrollIntoView({ behavior: "smooth" })}
            className="px-5 py-2.5 rounded-xl text-sm transition-colors"
            style={{ background: "transparent", color: "white", border: "0.5px solid #ffffff50" }}>
            See how it works
          </button>
        </div>

        {/* Stats bar */}
        <div className="max-w-2xl mx-auto grid grid-cols-4 divide-x rounded-t-2xl overflow-hidden"
          style={{ background: "#ffffff12", borderTop: "0.5px solid #ffffff20", divideColor: "#ffffff20" }}>
          {stats.map((s, i) => (
            <div key={i} className="py-4 text-center" style={{ borderRight: i < 3 ? "0.5px solid #ffffff20" : "none" }}>
              <p className="text-base font-medium text-white">{s.val}</p>
              <p className="text-xs mt-0.5" style={{ color: "#A8D8C8" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-16 bg-white">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-3"
            style={{ background: "#E1F5EE", color: "#0F6E56" }}>Features</span>
          <h2 className="text-2xl font-medium mb-2" style={{ color: "#111827" }}>
            Everything you need to master your finances
          </h2>
          <p className="text-sm" style={{ color: "#6B7280" }}>Built with real algorithms — not just spreadsheets</p>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="p-5 rounded-2xl border transition-shadow hover:shadow-md"
              style={{ borderColor: "#E5E7EB" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: f.bg }}>
                <i className={`ti ${f.icon}`} style={{ fontSize: 16, color: f.color }} />
              </div>
              <p className="text-sm font-medium mb-1.5" style={{ color: "#111827" }}>{f.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-8 py-16" style={{ background: "#F2FAF7" }}>
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-3"
            style={{ background: "#C4EEE0", color: "#085041" }}>How it works</span>
          <h2 className="text-2xl font-medium mb-2" style={{ color: "#111827" }}>
            Up and running in 2 minutes
          </h2>
          <p className="text-sm" style={{ color: "#6B7280" }}>No bank connection required — start with a CSV or manual entry</p>
        </div>
        <div className="flex max-w-3xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 text-center relative px-4">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium text-white mx-auto mb-3"
                style={{ background: "#0F6E56" }}>
                {s.num}
              </div>
              <p className="text-sm font-medium mb-1.5" style={{ color: "#111827" }}>{s.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="absolute top-4 left-[62%] w-[76%] h-px" style={{ background: "#B5DDD0" }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="px-8 py-16 text-center" style={{ background: "#0D3D2C" }}>
        <h2 className="text-2xl font-medium text-white mb-3">Ready to take control of your finances?</h2>
        <p className="text-sm mb-8" style={{ color: "#A8D8C8" }}>Free forever. No credit card. No ads.</p>
        <button onClick={() => navigate("/register")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "#1D9E75" }}>
          <i className="ti ti-rocket" style={{ fontSize: 14 }} />
          Create free account
        </button>
      </section>

      {/* Footer */}
      <footer className="px-8 py-5 flex items-center justify-between" style={{ background: "#0A2D1E" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "#1D9E75" }}>
            <i className="ti ti-trending-up text-white" style={{ fontSize: 12 }} />
          </div>
          <span className="text-sm font-medium text-white">WealthOS</span>
        </div>
        <div className="flex gap-5">
          {["GitHub", "Privacy Policy", "Terms", "Contact"].map(l => (
            <a key={l} href="#" className="text-xs transition-colors hover:text-white" style={{ color: "#6ABDA0" }}>{l}</a>
          ))}
        </div>
        <p className="text-xs" style={{ color: "#6ABDA0" }}>Built by Tanishk · 2026</p>
      </footer>
    </div>
  );
}