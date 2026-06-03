import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-white">Login to WealthOS</h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input className="w-full bg-gray-800 text-white px-4 py-2 rounded" placeholder="Email"
          value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input className="w-full bg-gray-800 text-white px-4 py-2 rounded" placeholder="Password" type="password"
          value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded font-semibold">Login</button>
        <p className="text-gray-400 text-sm text-center">No account? <Link to="/register" className="text-emerald-400">Register</Link></p>
      </form>
    </div>
  );
}