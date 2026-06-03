export default function PageHeader({ greeting, subtitle, actions }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-base font-medium" style={{ color: "#111827" }}>{greeting}</h1>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}