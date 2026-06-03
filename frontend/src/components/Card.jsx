export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl border p-4 ${className}`}
      style={{ borderColor: "#E5E7EB" }}>
      {children}
    </div>
  );
}