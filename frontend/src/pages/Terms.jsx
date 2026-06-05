import { useNavigate } from "react-router-dom";

export default function Terms() {
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
        <h1 style={{ fontSize: 28, fontWeight: 500, color: "#111827", marginBottom: 8 }}>Terms of Use</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 40 }}>Last updated: June 2026</p>
        {[
          { title: "Acceptance", body: "By using WealthOS, you agree to these terms. If you do not agree, please do not use the service." },
          { title: "About WealthOS", body: "WealthOS is a portfolio project created for educational and demonstration purposes. It is provided free of charge with no guarantees of uptime or data persistence." },
          { title: "Financial disclaimer", body: "WealthOS is not a licensed financial advisor. The debt strategies, projections, and AI advice provided are for informational purposes only and should not be considered professional financial advice. Always consult a qualified financial advisor before making major financial decisions." },
          { title: "Your account", body: "You are responsible for maintaining the security of your account credentials. Do not share your password with anyone. You are responsible for all activity that occurs under your account." },
          { title: "Data accuracy", body: "WealthOS is only as accurate as the data you provide. We are not responsible for decisions made based on incorrect data you have entered." },
          { title: "Service availability", body: "WealthOS is hosted on free-tier infrastructure and may experience occasional downtime. We do not guarantee 99.9% uptime or any specific service level." },
          { title: "Changes", body: "We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms." },
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