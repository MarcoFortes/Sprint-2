import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { walletStore } from "@/lib/wallet-store";
import { Lock, CheckCircle2 } from "lucide-react";

export function LoadWalletDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [amount, setAmount] = useState("");
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<null | { amount: number; receiptId: string }>(null);

  const reset = () => {
    setAmount("");
    setProcessing(false);
    setSuccess(null);
  };

  const handleConfirm = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    const tx = walletStore.loadWallet(value);
    setSuccess({ amount: value, receiptId: tx.receiptId });
    setProcessing(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setTimeout(reset, 200);
      }}
    >
      <DialogContent className="sm:max-w-md">
        {!success ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-xs font-medium text-[#172B4D]/60">
                <Lock className="h-3 w-3" /> SECURE PAYMENT GATEWAY
              </div>
              <DialogTitle className="text-[#172B4D]">Load Wallet</DialogTitle>
              <DialogDescription>
                Simulated checkout. Enter the amount to recharge your Transcor SDVBO wallet.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Recharge amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card">Card number</Label>
                <Input id="card" value={card} onChange={(e) => setCard(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="exp">Expiry</Label>
                  <Input id="exp" defaultValue="12/28" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" defaultValue="123" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={processing || !amount}
                className="bg-[#00875A] text-white hover:bg-[#006644]"
              >
                {processing ? "Processing..." : `Pay $${amount || "0.00"}`}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#00875A]/10">
              <CheckCircle2 className="h-8 w-8 text-[#00875A]" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#172B4D]">Payment approved</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              ${success.amount.toFixed(2)} added to your wallet.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Receipt: {success.receiptId}</p>
            <Button
              className="mt-6 w-full bg-[#172B4D] text-white hover:bg-[#0b1a33]"
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
