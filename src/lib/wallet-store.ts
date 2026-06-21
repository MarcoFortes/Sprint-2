import { useSyncExternalStore } from "react";

export const TICKET_PRICE = 42;

export type TxType = "recharge" | "ticket";

export type Transaction = {
  id: string;
  type: TxType;
  amount: number; // positive for recharge, negative for ticket
  timestamp: string;
  status: "Approved" | "Pending" | "Failed";
  receiptId: string;
  label: string;
};

type State = {
  balance: number;
  transactions: Transaction[];
};

let state: State = {
  balance: 1000,
  transactions: [],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const newReceipt = (prefix: string) =>
  `${prefix}-` + Math.random().toString(36).slice(2, 10).toUpperCase();

export const walletStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot() {
    return state;
  },
  loadWallet(amount: number): Transaction {
    const tx: Transaction = {
      id: crypto.randomUUID(),
      type: "recharge",
      amount,
      timestamp: new Date().toISOString(),
      status: "Approved",
      receiptId: newReceipt("RCP"),
      label: "Carregamento da carteira",
    };
    state = {
      balance: state.balance + amount,
      transactions: [tx, ...state.transactions],
    };
    emit();
    return tx;
  },
  generateTicket(trip?: { lineId: string; from: string; to: string }):
    | { ok: true; tx: Transaction }
    | { ok: false; reason: "insufficient" } {
    if (state.balance < TICKET_PRICE) {
      return { ok: false, reason: "insufficient" };
    }
    const label = trip
      ? `Bilhete ${trip.lineId} · ${trip.from} → ${trip.to}`
      : "Bilhete emitido";
    const tx: Transaction = {
      id: crypto.randomUUID(),
      type: "ticket",
      amount: -TICKET_PRICE,
      timestamp: new Date().toISOString(),
      status: "Approved",
      receiptId: newReceipt("TKT"),
      label,
    };
    state = {
      balance: state.balance - TICKET_PRICE,
      transactions: [tx, ...state.transactions],
    };
    emit();
    return { ok: true, tx };
  },
};

export function useWallet() {
  return useSyncExternalStore(walletStore.subscribe, walletStore.getSnapshot, walletStore.getSnapshot);
}
