import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-white">Create your WealthOS account</h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input className="w-full bg-gray-800 text-white px-4 py-2 rounded" placeholder="Name"
          value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input className="w-full bg-gray-800 text-white px-4 py-2 rounded" placeholder="Email"
          value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input className="w-full bg-gray-800 text-white px-4 py-2 rounded" placeholder="Password" type="password"
          value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded font-semibold">Register</button>
        <p className="text-gray-400 text-sm text-center">Have an account? <Link to="/login" className="text-emerald-400">Login</Link></p>
      </form>
    </div>
  );
}