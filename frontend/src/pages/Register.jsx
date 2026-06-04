import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3;

  const strengthConfig = {
    0: { label: "", color: "#E5E7EB", width: "0%" },
    1: { label: "Weak", color: "#E24B4A", width: "33%" },
    2: { label: "Good", color: "#BA7517", width: "66%" },
    3: { label: "Strong", color: "#0F6E56", width: "100%" },
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
            Start your journey<br />to financial<br />
            <span style={{ color: "#7DFFC8" }}>freedom.</span>
          </p>
          <p className="text-sm leading-relaxed mb-10" style={{ color: "#A8D8C8" }}>
            Join WealthOS and get AI-powered insights, debt optimization, and real-time alerts — completely free.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { val: "Free", label: "Forever" },
              { val: "6", label: "DSA algorithms" },
              { val: "3", label: "Debt strategies" },
              { val: "AI", label: "Financial advisor" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-3" style={{ background: "#ffffff12" }}>
                <p className="text-lg font-medium text-white">{s.val}</p>
                <p className="text-xs" style={{ color: "#A8D8C8" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: "#6ABDA0" }}>
          No credit card required · Cancel anytime
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

          <h1 className="text-2xl font-medium mb-1" style={{ color: "#111827" }}>Create your account</h1>
          <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
            Free forever. No credit card needed.
          </p>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm"
              style={{ background: "#FCEBEB", color: "#A32D2D" }}>
              <i className="ti ti-alert-circle" style={{ fontSize: 15 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "#374151" }}>
                Full name
              </label>
              <div className="relative">
                <i className="ti ti-user absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ fontSize: 15, color: "#9CA3AF" }} />
                <input type="text" required placeholder="Tanishk"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: "#E5E7EB", color: "#111827", background: "white" }}
                  onFocus={e => e.target.style.borderColor = "#0F6E56"}
                  onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
              </div>
            </div>

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
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "#374151" }}>
                Password
              </label>
              <div className="relative">
                <i className="ti ti-lock absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ fontSize: 15, color: "#9CA3AF" }} />
                <input type={showPassword ? "text" : "password"} required placeholder="Min. 6 characters"
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

              {/* Password strength */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
                    <div className="h-1 rounded-full transition-all duration-300"
                      style={{ width: strengthConfig[strength].width, background: strengthConfig[strength].color }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: strengthConfig[strength].color }}>
                    {strengthConfig[strength].label}
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              style={{ background: "linear-gradient(135deg, #0F6E56, #1D9E75)", boxShadow: "0 4px 15px #0F6E5630" }}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create free account
                  <i className="ti ti-arrow-right" style={{ fontSize: 15 }} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#6B7280" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-medium hover:underline" style={{ color: "#0F6E56" }}>
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs mt-8" style={{ color: "#9CA3AF" }}>
            By creating an account you agree to our{" "}
            <a href="#" className="hover:underline" style={{ color: "#6B7280" }}>Terms</a>
            {" "}and{" "}
            <a href="#" className="hover:underline" style={{ color: "#6B7280" }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}