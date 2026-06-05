import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navGroups = [
  {
    label: "Overview",
    links: [
      { to: "/dashboard", icon: "ti-layout-dashboard", label: "Dashboard" },
      { to: "/transactions", icon: "ti-arrows-transfer-up", label: "Transactions" },
    ]
  },
  {
    label: "Manage",
    links: [
      { to: "/debts", icon: "ti-credit-card", label: "Debts" },
      { to: "/goals", icon: "ti-target", label: "Goals" },
    ]
  },
  {
    label: "Tools",
    links: [
      { to: "/chat", icon: "ti-message-chatbot", label: "AI Advisor" },
    ]
  }
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-52 flex flex-col py-5 px-3"
      style={{ background: "var(--sidebar-bg)" }}>

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 pb-4 mb-3"
        style={{ borderBottom: "0.5px solid var(--sidebar-border)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--green-600)" }}>
          <i className="ti ti-trending-up text-white" style={{ fontSize: 14 }} />
        </div>
        <span className="text-white font-medium text-sm">WealthOS</span>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto">
        {navGroups.map(group => (
          <div key={group.label} className="mb-3">
            <p className="text-xs font-medium px-2 mb-1"
              style={{ color: "var(--sidebar-muted)", letterSpacing: "0.07em", textTransform: "uppercase", fontSize: 9.5 }}>
              {group.label}
            </p>
            {group.links.map(link => (
              <NavLink key={link.to} to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs mb-0.5 transition-colors ${
                    isActive
                      ? "font-medium"
                      : "hover:bg-white/5"
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? "var(--sidebar-active)" : "transparent",
                  color: isActive ? "#5DCAA5" : "var(--sidebar-text)",
                })}>
                {({ isActive }) => (
                  <>
                    <i className={`ti ${link.icon}`} style={{ fontSize: 14, color: isActive ? "#5DCAA5" : "var(--sidebar-muted)" }} />
                    {link.label}
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "var(--green-600)" }} />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="pt-3" style={{ borderTop: "0.5px solid var(--sidebar-border)" }}>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0"
            style={{ background: "linear-gradient(135deg, var(--green-600), var(--green-700))" }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name}</p>
            <p className="text-xs" style={{ color: "var(--sidebar-muted)", fontSize: 10 }}>Free plan</p>
          </div>
          <button onClick={handleLogout} title="Logout"
            className="hover:text-red-400 transition-colors"
            style={{ color: "var(--sidebar-muted)" }}>
            <i className="ti ti-logout" style={{ fontSize: 14 }} />
          </button>
        </div>
      </div>
    </div>
  );
}