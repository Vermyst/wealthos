export default function StatCard({ label, value, icon, iconBg, iconColor, badge, badgeBg, badgeColor }) {
  return (
    <div className="bg-white rounded-xl border p-3.5" style={{ borderColor: "#E5E7EB" }}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: iconBg }}>
          <i className={`ti ${icon}`} style={{ fontSize: 13, color: iconColor }} />
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: badgeBg, color: badgeColor, fontSize: 9.5 }}>
          {badge}
        </span>
      </div>
      <p className="text-xs mb-1" style={{ color: "#6B7280" }}>{label}</p>
      <p className="font-medium text-base" style={{ color: "#111827" }}>{value}</p>
    </div>
  );
}