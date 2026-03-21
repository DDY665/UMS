import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="app-shell flex min-h-screen">
      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Navbar />

        <main className="fade-in flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
