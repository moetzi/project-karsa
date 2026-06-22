import { useState } from "react";
import { X, Heart, Check, ShieldCheck, Landmark, Smartphone, CreditCard } from "lucide-react";
import { useT } from "@/lib/i18n";
import { addDonation } from "@/lib/donationStore";

type Campaign = {
  id: string;
  title: string;
  school?: string;
};

const PRESETS = [50_000, 100_000, 250_000, 500_000, 1_000_000, 2_500_000];

const METHODS = [
  { id: "qris", label: "QRIS", icon: Smartphone },
  { id: "va", label: "Virtual Account", icon: Landmark },
  { id: "card", label: "Kartu / Card", icon: CreditCard },
];

export function DonateSheet({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
  const t = useT();
  const [step, setStep] = useState<"amount" | "details" | "success">("amount");
  const [amount, setAmount] = useState<number>(100_000);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState("qris");

  const finalAmount = custom ? parseInt(custom.replace(/\D/g, ""), 10) || 0 : amount;
  const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");

  const canNext = finalAmount >= 10_000;
  const canConfirm = canNext && (anonymous || name.trim().length > 1);

  const confirm = () => {
    addDonation({
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      name: anonymous ? `Hamba Allah #${Math.floor(Math.random() * 90 + 10)}` : name.trim(),
      anonymous,
      amount: finalAmount,
      method,
      message: message.trim() || undefined,
    });
    setStep("success");
  };

  return (
    <div
      className="absolute inset-0 z-30 flex items-end bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full bg-surface rounded-t-3xl p-5 pb-7 max-h-[92%] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="pr-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-semibold inline-flex items-center gap-1.5">
              <Heart className="w-3 h-3" /> {t("Donasi Kampanye", "Donate to Campaign")}
            </p>
            <h3 className="mt-1 text-[15px] font-bold text-foreground leading-snug">{campaign.title}</h3>
            {campaign.school && <p className="text-[11px] text-muted-foreground mt-0.5">{campaign.school}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted grid place-items-center text-muted-foreground shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === "amount" && (
          <>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              {t("Pilih Nominal", "Choose Amount")}
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {PRESETS.map((p) => {
                const active = !custom && amount === p;
                return (
                  <button
                    key={p}
                    onClick={() => { setAmount(p); setCustom(""); }}
                    className={
                      "rounded-xl py-3 text-xs font-bold font-mono border transition " +
                      (active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/60 text-foreground border-border hover:border-primary/40")
                    }
                  >
                    {p >= 1_000_000 ? `${p / 1_000_000}jt` : `${p / 1000}rb`}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              {t("Atau Nominal Lain", "Or Custom Amount")}
            </p>
            <div className="mt-2 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono text-muted-foreground">Rp</span>
              <input
                value={custom ? parseInt(custom, 10).toLocaleString("id-ID") : ""}
                onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                placeholder={t("min. 10.000", "min. 10,000")}
                className="w-full bg-muted/60 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70"
              />
            </div>

            <div className="mt-5 bg-primary-soft/40 rounded-xl p-3 text-[11px] text-foreground/80 leading-relaxed flex gap-2">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p>
                {t(
                  "Dana dicairkan langsung ke rekening TMP lokal yang terverifikasi. Setiap transaksi tercatat di laporan transparansi.",
                  "Funds are disbursed directly to the verified local TMP account. Every transaction appears in the transparency report.",
                )}
              </p>
            </div>

            <button
              disabled={!canNext}
              onClick={() => setStep("details")}
              className="mt-5 w-full bg-foreground text-background rounded-xl py-3 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("Lanjut", "Continue")} · {fmt(finalAmount || 0)}
            </button>
          </>
        )}

        {step === "details" && (
          <>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              {t("Nama Donatur", "Donor Name")}
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={anonymous}
              placeholder={t("cth. Andi P.", "e.g. Andi P.")}
              className="mt-2 w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground border border-transparent focus:border-primary outline-none disabled:opacity-50 placeholder:text-muted-foreground/70"
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              {t("Donasi sebagai Hamba Allah (anonim)", "Donate as Anonymous")}
            </label>

            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              {t("Pesan untuk Guru (Opsional)", "Message for Teacher (Optional)")}
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              maxLength={140}
              placeholder={t("Semangat untuk anak-anak!", "Cheering on the kids!")}
              className="mt-2 w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70 resize-none"
            />

            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              {t("Metode Pembayaran", "Payment Method")}
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {METHODS.map((m) => {
                const Icon = m.icon;
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={
                      "rounded-xl py-3 px-2 text-[11px] font-semibold border transition flex flex-col items-center gap-1.5 " +
                      (active
                        ? "bg-primary-soft border-primary text-primary"
                        : "bg-muted/60 border-border text-foreground hover:border-primary/40")
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {m.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3">
              <span className="text-[11px] uppercase font-mono text-muted-foreground tracking-wider">{t("Total", "Total")}</span>
              <span className="font-mono font-extrabold text-foreground text-base">{fmt(finalAmount)}</span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setStep("amount")}
                className="flex-1 bg-muted text-foreground rounded-xl py-3 font-semibold text-sm"
              >
                {t("Kembali", "Back")}
              </button>
              <button
                disabled={!canConfirm}
                onClick={confirm}
                className="flex-[1.4] bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t("Konfirmasi Donasi", "Confirm Donation")}
              </button>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="mt-5 text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary-soft text-primary grid place-items-center">
              <Check className="w-8 h-8" strokeWidth={3} />
            </div>
            <h4 className="mt-4 text-lg font-extrabold text-foreground">
              {t("Terima kasih!", "Thank you!")}
            </h4>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed px-4">
              {t(
                `Donasi ${fmt(finalAmount)} sedang diproses. Anda akan menerima laporan penggunaan dana dari guru.`,
                `Your ${fmt(finalAmount)} donation is being processed. You will receive a usage report from the teacher.`,
              )}
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full bg-foreground text-background rounded-xl py-3 font-semibold text-sm"
            >
              {t("Selesai", "Done")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
