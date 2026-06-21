import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useWallet } from "@/lib/wallet-store";
import { CheckCircle2, Receipt, Ticket } from "lucide-react";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transações — Transcor SDVBO" },
      { name: "description", content: "Histórico completo de transações e recibos da carteira." },
    ],
  }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const { transactions } = useWallet();

  return (
    <AppShell active="history">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#174793] sm:text-2xl">Histórico de transações</h1>
        <p className="text-sm text-muted-foreground">Todos os carregamentos e bilhetes da sua carteira.</p>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#174793]/20 bg-white p-12 text-center">
          <Receipt className="mx-auto h-8 w-8 text-[#174793]/40" />
          <p className="mt-3 text-sm text-muted-foreground">Ainda sem transações.</p>
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <ul className="space-y-3 sm:hidden">
            {transactions.map((t) => {
              const isCredit = t.amount > 0;
              return (
                <li key={t.id} className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#174793]">{t.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(t.timestamp).toLocaleString("pt-PT")}
                      </p>
                      <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                        {t.receiptId}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#00875A]/10 px-2 py-0.5 text-xs font-medium text-[#00875A]">
                        <CheckCircle2 className="h-3 w-3" /> {t.status}
                      </span>
                    </div>
                    <p
                      className={`shrink-0 text-base font-semibold ${
                        isCredit ? "text-[#00875A]" : "text-[#174793]"
                      }`}
                    >
                      {isCredit ? "+" : ""}
                      {t.amount.toFixed(2)} CVE
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Desktop: table */}
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm sm:block">
            <table className="w-full text-sm">
              <thead className="bg-[#174793] text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Data</th>
                  <th className="px-4 py-3 text-left font-medium">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium">Recibo</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                  <th className="px-4 py-3 text-right font-medium">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#174793]/10">
                {transactions.map((t) => {
                  const isCredit = t.amount > 0;
                  return (
                    <tr key={t.id} className="hover:bg-[#F4F5F7]">
                      <td className="px-4 py-3 text-[#174793]">
                        {new Date(t.timestamp).toLocaleString("pt-PT")}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-[#174793]">
                          {isCredit ? (
                            <CheckCircle2 className="h-4 w-4 text-[#00875A]" />
                          ) : (
                            <Ticket className="h-4 w-4 text-[#174793]" />
                          )}
                          {t.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.receiptId}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#00875A]/10 px-2 py-0.5 text-xs font-medium text-[#00875A]">
                          <CheckCircle2 className="h-3 w-3" /> {t.status}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-semibold ${
                          isCredit ? "text-[#00875A]" : "text-[#174793]"
                        }`}
                      >
                        {isCredit ? "+" : ""}
                        {t.amount.toFixed(2)} CVE
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AppShell>
  );
}
