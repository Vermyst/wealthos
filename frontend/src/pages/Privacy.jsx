import { useNavigate } from "react-router-dom";

export default function Privacy() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "white", fontFamily: "Inter, system-ui, sans-serif" }}>
      <nav style={{ borderBottom: "0.5px solid #E5E7EB", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
          <div style={{ width: 28, height: 28, background: "#0F6E56", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-trending-up" style={{ fontSize: 14, color: "white" }} />
          </div>
          <span style={{ fontWeight: 500, fontSize: 14, color: "#111827" }}>WealthOS</span>
        </div>
        <button onClick={() => navigate("/")} style={{ fontSize: 13, color: "#6B7280", background: "none", border: "none", cursor: "pointer" }}>← Back to home</button>
      </nav>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 32px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 500, color: "#111827", marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 40 }}>Last updated: June 2026</p>
        {[
          { title: "Overview", body: "WealthOS is a personal finance portfolio project. We take your privacy seriously. This policy explains what data we collect, how we use it, and your rights." },
          { title: "Data we collect", body: "We collect the information you provide directly: your name, email address, and financial data you enter (transactions, debts, goals). We do not collect any data automatically beyond what is necessary to run your account." },
          { title: "How we use your data", body: "Your data is used solely to provide the WealthOS service — storing your transactions, running the debt optimizer, and generating AI insights. We never sell, share, or use your data for advertising." },
          { title: "Data storage", body: "Your data is stored securely on MongoDB Atlas servers. Passwords are hashed with bcrypt and never stored in plaintext. Authentication uses JWT tokens stored in httpOnly cookies, which cannot be accessed by JavaScript." },
          { title: "AI advisor", body: "When you use the AI advisor, a summary of your financial data is sent to Google Gemini API to generate a response. No data is stored by Google beyond their standard API usage policies. We do not include personally identifiable information beyond financial summaries." },
          { title: "Your rights", body: "You can delete your account and all associated data at any time by contacting us. We will permanently delete all your data within 7 days of your request." },
          { title: "Contact", body: "For any privacy concerns, please use the contact form on the homepage." },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 500, color: "#111827", marginBottom: 8 }}>{s.title}</h2>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.75 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}