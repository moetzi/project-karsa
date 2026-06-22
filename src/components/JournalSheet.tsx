import { useRef, useState } from "react";
import { X, Camera, ImagePlus, Check, MapPin, Trash2, Sparkles, Send } from "lucide-react";
import { useT } from "@/lib/i18n";
import { addJournal } from "@/lib/journalStore";

type Props = {
  campaign: { id: string; title: string; titleEn: string; school: string };
  onClose: () => void;
};

const MOOD = [
  { emoji: "😍", id: "Antusias", en: "Excited" },
  { emoji: "😊", id: "Senang", en: "Happy" },
  { emoji: "😋", id: "Lahap", en: "Hearty" },
  { emoji: "🤔", id: "Kurang Selera", en: "Picky" },
];

export function JournalSheet({ campaign, onClose }: Props) {
  const t = useT();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [menu, setMenu] = useState("");
  const [story, setStory] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [attendance, setAttendance] = useState("");
  const [sent, setSent] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).slice(0, 4 - photos.length).map((f) => URL.createObjectURL(f));
    setPhotos((p) => [...p, ...urls].slice(0, 4));
  };

  const valid = photos.length > 0 && story.trim().length >= 10 && menu.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    addJournal({
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      campaignTitleEn: campaign.titleEn,
      school: campaign.school,
      photos,
      menu: menu.trim(),
      story: story.trim(),
      mood,
      attendance,
    });
    setSent(true);
    setTimeout(onClose, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-background rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300"
      >
        {/* Handle */}
        <div className="sticky top-0 bg-background z-10 pt-2 pb-3 px-5 border-b border-border/60">
          <div className="mx-auto w-10 h-1 rounded-full bg-muted-foreground/30 mb-3" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                {t("Jurnal Harian", "Daily Journal")}
              </p>
              <h2 className="text-lg font-extrabold text-foreground">{t("Buat Jurnal", "Create Journal")}</h2>
            </div>
            <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-full bg-muted hover:bg-muted/70">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {sent ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary text-primary-foreground grid place-items-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-foreground">{t("Jurnal Terkirim!", "Journal Submitted!")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("Terima kasih, donatur akan menerima notifikasi cerita hari ini.", "Thank you! Donors will be notified of today's story.")}
            </p>
          </div>
        ) : (
          <div className="px-5 py-5 space-y-5">
            {/* Linked campaign */}
            <div className="rounded-2xl border border-border/60 bg-primary-soft/40 p-3 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground grid place-items-center text-xs font-bold shrink-0">
                {t("KMP", "CMP")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-widest text-primary font-bold">
                  {t("Untuk Kampanye", "For Campaign")}
                </p>
                <p className="text-sm font-bold text-foreground truncate">{t(campaign.title, campaign.titleEn)}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {campaign.school}
                </p>
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className="text-xs font-semibold text-foreground flex items-center justify-between mb-2">
                <span>{t("Foto Makan Bersama", "Group Meal Photo")} <span className="text-accent">*</span></span>
                <span className="font-mono text-[10px] text-muted-foreground">{photos.length}/4</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {photos.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white grid place-items-center"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {photos.length < 4 && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary-soft/30 transition flex flex-col items-center justify-center gap-1 text-muted-foreground"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-[9px] font-mono uppercase">{t("Tambah", "Add")}</span>
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="mt-2 w-full border border-border rounded-xl py-2.5 text-xs font-semibold text-foreground inline-flex items-center justify-center gap-2 hover:bg-muted/50"
              >
                <Camera className="w-4 h-4" /> {t("Ambil Foto / Pilih dari Galeri", "Take Photo / Pick from Gallery")}
              </button>
            </div>

            {/* Menu */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-2 block">
                {t("Menu Hari Ini", "Today's Menu")} <span className="text-accent">*</span>
              </label>
              <input
                value={menu}
                onChange={(e) => setMenu(e.target.value)}
                placeholder={t("cth: Nasi, ayam suwir, tumis kangkung, pisang", "e.g. Rice, shredded chicken, sautéed greens, banana")}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Attendance */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-2 block">
                {t("Jumlah Anak Hadir", "Children Attending")}
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                placeholder="28"
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* Mood */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-2 block">
                {t("Suasana Anak", "Children's Mood")}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {MOOD.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className={
                      "rounded-xl border py-2 flex flex-col items-center gap-0.5 transition " +
                      (mood === m.id
                        ? "border-primary bg-primary-soft"
                        : "border-border bg-surface hover:bg-muted/50")
                    }
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-[9px] font-mono uppercase tracking-wide text-muted-foreground">
                      {t(m.id, m.en)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Story */}
            <div>
              <label className="text-xs font-semibold text-foreground flex items-center justify-between mb-2">
                <span>{t("Cerita Hari Ini", "Today's Story")} <span className="text-accent">*</span></span>
                <span className="font-mono text-[10px] text-muted-foreground">{story.length}/280</span>
              </label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value.slice(0, 280))}
                rows={4}
                placeholder={t(
                  "Tulis momen hangat hari ini — bagaimana anak-anak menikmati makanannya?",
                  "Share today's warm moment — how did the children enjoy their meal?"
                )}
                className="w-full font-serif rounded-xl border border-border bg-surface px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:border-primary resize-none"
              />
              <button
                onClick={() =>
                  setStory(
                    t(
                      "Hari ini anak-anak makan dengan lahap. Mereka sangat senang menikmati menu bergizi bersama teman-teman.",
                      "The children ate heartily today, joyfully sharing a nutritious meal with their friends."
                    )
                  )
                }
                className="mt-1.5 text-[11px] text-accent font-semibold inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> {t("Bantu tulis dengan AI", "Help me write with AI")}
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={submit}
              disabled={!valid}
              className={
                "w-full rounded-xl py-3.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition " +
                (valid
                  ? "bg-primary text-primary-foreground hover:opacity-95"
                  : "bg-muted text-muted-foreground cursor-not-allowed")
              }
            >
              <Send className="w-4 h-4" /> {t("Kirim Jurnal", "Submit Journal")}
            </button>
            <p className="text-[10px] text-center text-muted-foreground font-mono">
              {t("Jurnal akan dibagikan ke donatur kampanye ini.", "This journal will be shared with the campaign's donors.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
