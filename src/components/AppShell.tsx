import { Link } from "@tanstack/react-router";
import { Wallet, Receipt } from "lucide-react";

export function AppShell({ children, active }: { children: React.ReactNode; active: "wallet" | "history" }) {
  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <header className="bg-[#174793] text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#00875A] font-bold">T</div>
            <div>
              <div className="text-sm font-semibold leading-none">Transcor</div>
              <div className="text-[10px] uppercase tracking-widest text-white/60">SDVBO Wallet</div>
            </div>
          </div>
          <nav className="flex items-center gap-1 rounded-full bg-white/10 p-1 text-sm">
            <Link
              to="/"
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${
                active === "wallet" ? "bg-[#00875A] text-white" : "text-white/80 hover:text-white"
              }`}
            >
              <Wallet className="h-4 w-4" /> Wallet
            </Link>
            <Link
              to="/transactions"
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${
                active === "history" ? "bg-[#00875A] text-white" : "text-white/80 hover:text-white"
              }`}
            >
              <Receipt className="h-4 w-4" /> History
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-8">{children}</main>
    </div>
  );
}
