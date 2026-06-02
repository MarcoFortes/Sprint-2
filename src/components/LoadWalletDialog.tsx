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
              <div className="flex items-center gap-2 text-xs font-medium text-[#174793]/60">
                <Lock className="h-3 w-3" /> SECURE PAYMENT GATEWAY
              </div>
              <DialogTitle className="text-[#174793]">Load Wallet</DialogTitle>
              <DialogDescription>
                Simulated checkout. Enter the amount in CVE to recharge your Transcor SDVBO wallet.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Recharge amount (CVE)</Label>
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
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={processing || !amount}
                className="w-full bg-[#00875A] text-white hover:bg-[#006644] sm:w-auto"
              >
                {processing ? "Processing..." : `Pay ${amount || "0.00"} CVE`}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#00875A]/10">
              <CheckCircle2 className="h-8 w-8 text-[#00875A]" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#174793]">Payment approved</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {success.amount.toFixed(2)} CVE added to your wallet.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Receipt: {success.receiptId}</p>
            <Button
              className="mt-6 w-full bg-[#174793] text-white hover:bg-[#0a1d3d]"
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
