import { useSyncExternalStore } from "react";

export type Transaction = {
  id: string;
  amount: number;
  timestamp: string;
  status: "Approved" | "Pending" | "Failed";
  receiptId: string;
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
      amount,
      timestamp: new Date().toISOString(),
      status: "Approved",
      receiptId: "RCP-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
    };
    state = {
      balance: state.balance + amount,
      transactions: [tx, ...state.transactions],
    };
    emit();
    return tx;
  },
};

export function useWallet() {
  return useSyncExternalStore(walletStore.subscribe, walletStore.getSnapshot, walletStore.getSnapshot);
}
