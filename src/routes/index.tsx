import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LoadWalletDialog } from "@/components/LoadWalletDialog";
import { GenerateTicketDialog } from "@/components/GenerateTicketDialog";
import { TICKET_PRICE, useWallet } from "@/lib/wallet-store";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, CheckCircle2, Ticket, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

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
  const [ticketOpen, setTicketOpen] = useState(false);
  const recent = transactions.slice(0, 3);
  const insufficient = balance < TICKET_PRICE;

  const handleGenerateTicket = () => {
    if (insufficient) {
      toast.error("Insufficient balance", {
        description: `You need at least ${TICKET_PRICE.toFixed(2)} CVE to generate a ticket. Please reload your wallet.`,
        action: { label: "Load Wallet", onClick: () => setOpen(true) },
      });
      return;
    }
    setTicketOpen(true);
  };

  return (
    <AppShell active="wallet">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#174793] to-[#0a1d3d] p-5 text-white shadow-lg sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-widest text-white/60 sm:text-xs">Available balance</p>
            <p className="mt-2 break-words text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
              <span className="text-xl font-semibold text-white/80 sm:text-2xl md:text-3xl">CVE</span>
            </p>
            <p className="mt-1 text-xs text-white/60 sm:text-sm">
              Transcor SDVBO • Ticket price {TICKET_PRICE.toFixed(2)} CVE
            </p>
          </div>
          <div className="shrink-0 rounded-md bg-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider">
            Active
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button
            onClick={() => setOpen(true)}
            className="w-full bg-[#00875A] text-white hover:bg-[#006644] sm:w-auto"
          >
            <Plus className="mr-1 h-4 w-4" /> Load Wallet
          </Button>
          <Button
            onClick={handleGenerateTicket}
            disabled={insufficient}
            className="w-full bg-white text-[#174793] hover:bg-white/90 disabled:opacity-60 sm:w-auto"
          >
            <Ticket className="mr-1 h-4 w-4" /> Generate Ticket
          </Button>
          <Button asChild variant="outline" className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:w-auto">
            <Link to="/transactions">
              View history <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {insufficient && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#ee2424]/30 bg-[#ee2424]/5 p-4 text-sm text-[#ee2424]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Insufficient balance to generate a ticket</p>
            <p className="text-xs text-[#ee2424]/80">
              You need at least {TICKET_PRICE.toFixed(2)} CVE. Reload your wallet to keep generating tickets.
            </p>
          </div>
        </div>
      )}

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#174793]">Recent activity</h2>
          <Link to="/transactions" className="text-xs font-medium text-[#00875A] hover:underline">
            See all
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#174793]/20 bg-white p-8 text-center text-sm text-muted-foreground">
            No transactions yet. Tap <span className="font-medium text-[#00875A]">Load Wallet</span> to make your first recharge.
          </div>
        ) : (
          <ul className="divide-y divide-[#174793]/10 overflow-hidden rounded-xl bg-white shadow-sm">
            {recent.map((t) => {
              const isCredit = t.amount > 0;
              return (
                <li key={t.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        isCredit ? "bg-[#00875A]/10 text-[#00875A]" : "bg-[#174793]/10 text-[#174793]"
                      }`}
                    >
                      {isCredit ? <CheckCircle2 className="h-5 w-5" /> : <Ticket className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#174793]">{t.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(t.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${isCredit ? "text-[#00875A]" : "text-[#174793]"}`}>
                      {isCredit ? "+" : ""}
                      {t.amount.toFixed(2)} CVE
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.status}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <LoadWalletDialog open={open} onOpenChange={setOpen} />
    </AppShell>
  );
}
