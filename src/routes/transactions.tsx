import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useWallet } from "@/lib/wallet-store";
import { CheckCircle2, Receipt } from "lucide-react";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — Transcor SDVBO" },
      { name: "description", content: "Complete history of wallet transactions and receipts." },
    ],
  }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const { transactions } = useWallet();

  return (
    <AppShell active="history">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#172B4D]">Transaction history</h1>
        <p className="text-sm text-muted-foreground">All recharges and receipts on your wallet.</p>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#172B4D]/20 bg-white p-12 text-center">
          <Receipt className="mx-auto h-8 w-8 text-[#172B4D]/40" />
          <p className="mt-3 text-sm text-muted-foreground">No transactions yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#172B4D] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Receipt</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172B4D]/10">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-[#F4F5F7]">
                  <td className="px-4 py-3 text-[#172B4D]">
                    {new Date(t.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.receiptId}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#00875A]/10 px-2 py-0.5 text-xs font-medium text-[#00875A]">
                      <CheckCircle2 className="h-3 w-3" /> {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-[#00875A]">
                    +{t.amount.toFixed(2)} CVE
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
