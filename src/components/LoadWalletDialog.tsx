import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { walletStore } from "@/lib/wallet-store";
import { Lock, CheckCircle2, MessageSquare, ArrowLeft } from "lucide-react";

type Step = "card" | "sms" | "success";

// Masks last 4 digits of card to derive a fake associated phone number.
function maskedPhoneFor(card: string) {
  const digits = card.replace(/\D/g, "").slice(-4) || "0000";
  return `+238 9** ** ${digits.slice(0, 2)} ${digits.slice(2)}`;
}

export function LoadWalletDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [step, setStep] = useState<Step>("card");
  const [amount, setAmount] = useState("");
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [cvc, setCvc] = useState("123");
  const [exp, setExp] = useState("12/28");
  const [smsCode, setSmsCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [sending, setSending] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<null | { amount: number; receiptId: string }>(null);

  const reset = () => {
    setStep("card");
    setAmount("");
    setSmsCode("");
    setInputCode("");
    setError(null);
    setProcessing(false);
    setSending(false);
    setSuccess(null);
  };

  const handleSendCode = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    if (cvc.length < 3) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    // In production the code is sent via SMS/Gmail; for the prototype it is fixed so the flow remains testable.
    setSmsCode("123456");
    setSending(false);
    setStep("sms");
  };

  const handleVerifyAndPay = async () => {
    setError(null);
    if (inputCode.trim() !== smsCode) {
      setError("Invalid verification code. Check the SMS and try again.");
      return;
    }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1100));
    const value = parseFloat(amount);
    const tx = walletStore.loadWallet(value);
    setSuccess({ amount: value, receiptId: tx.receiptId });
    setProcessing(false);
    setStep("success");
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
        {step === "card" && (
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
                  <Input id="exp" value={exp} onChange={(e) => setExp(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" value={cvc} onChange={(e) => setCvc(e.target.value)} />
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                onClick={handleSendCode}
                disabled={sending || !amount}
                className="w-full bg-[#00875A] text-white hover:bg-[#006644] sm:w-auto"
              >
                {sending ? "Sending SMS..." : "Send verification code"}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "sms" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-xs font-medium text-[#174793]/60">
                <MessageSquare className="h-3 w-3" /> TWO-FACTOR AUTHENTICATION
              </div>
              <DialogTitle className="text-[#174793]">Enter SMS code</DialogTitle>
              <DialogDescription>
                A 6-digit code was sent to{" "}
                <span className="font-medium text-[#174793]">{maskedPhoneFor(card)}</span>, the phone
                associated with this card.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="rounded-md border border-dashed border-[#174793]/30 bg-[#174793]/5 p-3 text-xs text-[#174793]">
                <span className="font-semibold">Simulated SMS:</span> Your Transcor verification code is{" "}
                <span className="font-mono text-base font-bold">{smsCode}</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Verification code</Label>
                <Input
                  id="code"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="text-center text-lg tracking-[0.5em]"
                />
                {error && <p className="text-xs font-medium text-[#ee2424]">{error}</p>}
              </div>
              <p className="text-xs text-muted-foreground">
                Confirming will debit{" "}
                <span className="font-semibold text-[#174793]">{parseFloat(amount || "0").toFixed(2)} CVE</span>{" "}
                from your bank account and credit your Transcor wallet.
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("card");
                  setInputCode("");
                  setError(null);
                }}
                disabled={processing}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleVerifyAndPay}
                disabled={processing || inputCode.length < 6}
                className="w-full bg-[#00875A] text-white hover:bg-[#006644] sm:w-auto"
              >
                {processing ? "Processing..." : `Confirm payment`}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "success" && success && (
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
