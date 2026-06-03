import Sidebar from "./Sidebar";
import AlertToast from "./AlertToast";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--page-bg)" }}>
      <Sidebar />
      <main className="ml-52 flex-1 p-6 min-h-screen">
        {children}
      </main>
      <AlertToast />
    </div>
  );
}