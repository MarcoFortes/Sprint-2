import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LINES, getLine } from "@/lib/lines";
import { TICKET_PRICE, walletStore } from "@/lib/wallet-store";
import { toast } from "sonner";
import { Ticket, ArrowRight } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsufficient?: () => void;
};

export function GenerateTicketDialog({ open, onOpenChange, onInsufficient }: Props) {
  const [lineId, setLineId] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const line = useMemo(() => (lineId ? getLine(lineId) : undefined), [lineId]);
  const stations = line?.stations ?? [];

  useEffect(() => {
    if (!open) {
      setLineId("");
      setFrom("");
      setTo("");
    }
  }, [open]);

  useEffect(() => {
    setFrom("");
    setTo("");
  }, [lineId]);

  const canSubmit = Boolean(lineId && from && to && from !== to);

  const parseStation = (v: string) => v.split(":").slice(1).join(":");

  const handleConfirm = () => {
    if (!canSubmit || !line) return;
    const fromName = parseStation(from);
    const toName = parseStation(to);
    const result = walletStore.generateTicket({ lineId: line.id, from: fromName, to: toName });
    if (!result.ok) {
      toast.error("Saldo insuficiente", {
        description: `Precisa de pelo menos ${TICKET_PRICE.toFixed(2)} CVE para gerar um bilhete.`,
      });
      onOpenChange(false);
      onInsufficient?.();
      return;
    }
    toast.success("Bilhete gerado", {
      description: `${line.id} · ${fromName} → ${toName} · −${TICKET_PRICE.toFixed(2)} CVE`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#174793]">
            <Ticket className="h-5 w-5" /> Gerar Bilhete
          </DialogTitle>
          <DialogDescription>
            Escolha a sua linha e selecione a estação onde vai embarcar e a estação onde vai desembarcar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="line">Linha</Label>
            <Select value={lineId} onValueChange={setLineId}>
              <SelectTrigger id="line">
                <SelectValue placeholder="Selecione uma linha" />
              </SelectTrigger>
              <SelectContent>
                {LINES.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.id} — {l.stations[0]} → {l.stations[l.stations.length - 1]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="from">Estação de embarque</Label>
              <Select value={from} onValueChange={setFrom} disabled={!line}>
                <SelectTrigger id="from">
                  <SelectValue placeholder={line ? "Selecione a estação" : "Escolha uma linha primeiro"} />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((s, i) => (
                    <SelectItem key={`${s}-${i}`} value={`${i}:${s}`}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">Estação de desembarque</Label>
              <Select value={to} onValueChange={setTo} disabled={!line}>
                <SelectTrigger id="to">
                  <SelectValue placeholder={line ? "Selecione a estação" : "Escolha uma linha primeiro"} />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((s, i) => (
                    <SelectItem
                      key={`${s}-${i}`}
                      value={`${i}:${s}`}
                      disabled={from === `${i}:${s}`}
                    >
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {from && to && from === to && (
            <p className="text-xs text-[#ee2424]">
              As estações de embarque e desembarque têm de ser diferentes.
            </p>
          )}

          {line && from && to && from !== to && (
            <div className="rounded-lg border border-[#174793]/20 bg-[#174793]/5 p-3 text-sm text-[#174793]">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{line.id}</span>
                <span className="truncate">{from.split(":").slice(1).join(":")}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{to.split(":").slice(1).join(":")}</span>
              </div>
              <p className="mt-1 text-xs text-[#174793]/70">
                Tarifa: {TICKET_PRICE.toFixed(2)} CVE
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canSubmit}
            className="bg-[#174793] text-white hover:bg-[#103563]"
          >
            Confirmar · {TICKET_PRICE.toFixed(2)} CVE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
