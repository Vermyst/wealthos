import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F0F4F2" }}>

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10"
        style={{ background: "linear-gradient(160deg, #0D3D2C 0%, #0F6E56 60%, #1D9E75 100%)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#ffffff20" }}>
            <i className="ti ti-trending-up text-white" style={{ fontSize: 16 }} />
          </div>
          <span className="text-white font-medium">WealthOS</span>
        </div>

        <div>
          <p className="text-3xl font-medium text-white leading-snug mb-4">
            Take control of<br />your finances<br />
            <span style={{ color: "#7DFFC8" }}>today.</span>
          </p>
          <p className="text-sm leading-relaxed mb-10" style={{ color: "#A8D8C8" }}>
            Track debts, set goals, and get AI-powered advice — all in one place.
          </p>

          {/* Feature list */}
          {[
            { icon: "ti-cpu", text: "C++ debt optimizer with DP algorithms" },
            { icon: "ti-chart-line", text: "Net worth projector with live sliders" },
            { icon: "ti-message-chatbot", text: "AI advisor grounded in your data" },
            { icon: "ti-bell-ringing", text: "Real-time budget breach alerts" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#ffffff15" }}>
                <i className={`ti ${f.icon}`} style={{ fontSize: 13, color: "#7DFFC8" }} />
              </div>
              <p className="text-sm" style={{ color: "#C8EAE0" }}>{f.text}</p>
            </div>
          ))}
        </div>

        <p className="text-xs" style={{ color: "#6ABDA0" }}>
          Free forever · No credit card · No ads
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "#0F6E56" }}>
              <i className="ti ti-trending-up text-white" style={{ fontSize: 14 }} />
            </div>
            <span className="font-medium" style={{ color: "#111827" }}>WealthOS</span>
          </div>

          <h1 className="text-2xl font-medium mb-1" style={{ color: "#111827" }}>Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
            Sign in to your account to continue
          </p>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm"
              style={{ background: "#FCEBEB", color: "#A32D2D" }}>
              <i className="ti ti-alert-circle" style={{ fontSize: 15 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "#374151" }}>
                Email address
              </label>
              <div className="relative">
                <i className="ti ti-mail absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ fontSize: 15, color: "#9CA3AF" }} />
                <input type="email" required placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: "#E5E7EB", color: "#111827", background: "white" }}
                  onFocus={e => e.target.style.borderColor = "#0F6E56"}
                  onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium" style={{ color: "#374151" }}>Password</label>
              </div>
              <div className="relative">
                <i className="ti ti-lock absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ fontSize: 15, color: "#9CA3AF" }} />
                <input type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: "#E5E7EB", color: "#111827", background: "white" }}
                  onFocus={e => e.target.style.borderColor = "#0F6E56"}
                  onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3AF" }}>
                  <i className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"}`} style={{ fontSize: 15 }} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              style={{ background: "linear-gradient(135deg, #0F6E56, #1D9E75)", boxShadow: "0 4px 15px #0F6E5630" }}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <i className="ti ti-arrow-right" style={{ fontSize: 15 }} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
            <span className="text-xs" style={{ color: "#9CA3AF" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
          </div>

          <p className="text-center text-sm" style={{ color: "#6B7280" }}>
            Don't have an account?{" "}
            <Link to="/register" className="font-medium hover:underline" style={{ color: "#0F6E56" }}>
              Create one free
            </Link>
          </p>

          <p className="text-center text-xs mt-8" style={{ color: "#9CA3AF" }}>
            By signing in you agree to our{" "}
            <a href="#" className="hover:underline" style={{ color: "#6B7280" }}>Terms</a>
            {" "}and{" "}
            <a href="#" className="hover:underline" style={{ color: "#6B7280" }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}