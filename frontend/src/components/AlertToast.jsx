import { useSocket } from "../context/SocketContext";

export default function AlertToast() {
  const { alerts, dismissAlert } = useSocket();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {alerts.map(alert => (
        <div key={alert.id}
          className="bg-red-900 border border-red-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-start gap-3 max-w-sm animate-pulse">
          <span className="text-lg">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold">Budget Alert</p>
            <p className="text-xs text-red-200 mt-1">{alert.message}</p>
          </div>
          <button onClick={() => dismissAlert(alert.id)}
            className="text-red-300 hover:text-white text-xs">✕</button>
        </div>
      ))}
    </div>
  );
}