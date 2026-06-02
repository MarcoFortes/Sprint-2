import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LoadWalletDialog } from "@/components/LoadWalletDialog";
import { useWallet } from "@/lib/wallet-store";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Transcor SDVBO — Wallet" },
      { name: "description", content: "Manage your Transcor SDVBO digital wallet balance and recharges." },
    ],
  }),
  component: WalletPage,
});

function WalletPage() {
  const { balance, transactions } = useWallet();
  const [open, setOpen] = useState(false);
  const recent = transactions.slice(0, 3);

  return (
    <AppShell active="wallet">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#172B4D] to-[#0b1a33] p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/60">Available balance</p>
            <p className="mt-2 text-5xl font-bold tracking-tight">
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="mt-1 text-sm text-white/60">Transcor SDVBO • Escudo</p>
          </div>
          <div className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider">
            Active
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => setOpen(true)}
            className="bg-[#00875A] text-white hover:bg-[#006644]"
          >
            <Plus className="mr-1 h-4 w-4" /> Load Wallet
          </Button>
          <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
            <Link to="/transactions">
              View history <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#172B4D]">Recent activity</h2>
          <Link to="/transactions" className="text-xs font-medium text-[#00875A] hover:underline">
            See all
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#172B4D]/20 bg-white p-8 text-center text-sm text-muted-foreground">
            No transactions yet. Tap <span className="font-medium text-[#00875A]">Load Wallet</span> to make your first recharge.
          </div>
        ) : (
          <ul className="divide-y divide-[#172B4D]/10 overflow-hidden rounded-xl bg-white shadow-sm">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00875A]/10 text-[#00875A]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#172B4D]">Wallet recharge</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#00875A]">
                    +{t.amount.toFixed(2)} CVE
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <LoadWalletDialog open={open} onOpenChange={setOpen} />
    </AppShell>
  );
}
