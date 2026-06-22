import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useState } from "react";
import { PartyPopper, NotebookPen, MapPin, TrendingUp, Clock, ArrowRight, BarChart3, Eye, Repeat2, ThumbsUp, Users, Share2, BookOpen, Heart } from "lucide-react";
import { donors, ShareSheet } from "@/routes/nutrisi";
import { JournalSheet } from "@/components/JournalSheet";
import { DonateSheet } from "@/components/DonateSheet";
import { useJournals, formatRelative } from "@/lib/journalStore";
import { useDonations, formatRelative as fmtDonRel } from "@/lib/donationStore";
import { useT, useLang } from "@/lib/i18n";

const ACTIVE_CAMPAIGN = {
  id: "kolaka-gizi-sehat",
  title: "Gizi Sehat Desa Kolaka",
  titleEn: "Healthy Nutrition for Kolaka Village",
  school: "SDN 047 Kolaka Utara",
};

const INSPIRASI = [
  {
    id: "1",
    tag: { id: "Kesehatan", en: "Health" },
    title: { id: "Dampak Stunting pada Fokus Belajar Anak", en: "How Stunting Affects Children's Focus in Class" },
    read: { id: "6 menit", en: "6 min" },
    hero: "linear-gradient(135deg, #0D7377 0%, #2d5016 100%)",
    emoji: "🧠",
  },
  {
    id: "2",
    tag: { id: "Gizi Lokal", en: "Local Nutrition" },
    title: { id: "Inovasi Gizi Lokal: Pangan Desa untuk Nutrisi Sekolah", en: "Local Nutrition Innovation: Village Food for School Meals" },
    read: { id: "8 menit", en: "8 min" },
    hero: "linear-gradient(135deg, #F47B20 0%, #c4654a 100%)",
    emoji: "🌽",
  },
  {
    id: "3",
    tag: { id: "Kolaborasi", en: "Collaboration" },
    title: { id: "Peran BUMDes & Kelompok Tani dalam Mendukung Gizi Anak", en: "BUMDes & Farmer Groups: Partners in Child Nutrition" },
    read: { id: "5 menit", en: "5 min" },
    hero: "linear-gradient(135deg, #6b4423 0%, #c9614a 100%)",
    emoji: "🤝",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beranda — Karsa" },
      { name: "description", content: "Pendamping harian guru: target gizi & kampanye aktif." },
    ],
  }),
  component: Beranda,
});

function Beranda() {
  const t = useT();
  const { lang } = useLang();
  const [shareOpen, setShareOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const journals = useJournals(ACTIVE_CAMPAIGN.id);
  const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");
  return (
    <PhoneShell>
      <div className="px-6 pt-4 pb-6 space-y-6">
        <header>
          <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
            {t("Senin, 21 Juni", "Monday, June 21")}
          </p>
          <h1 className="mt-1 text-[28px] leading-tight font-extrabold text-foreground">
            {t("Selamat pagi,", "Good morning,")}<br />
            <span className="text-primary">{t("Bu Sari", "Ms. Sari")}</span> 🌱
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("Mari lanjutkan misi gizi & literasi hari ini.", "Let's continue today's nutrition & literacy mission.")}
          </p>
        </header>

        {/* Action item alert */}
        <section
          className="relative rounded-2xl p-5 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, oklch(0.96 0.06 60) 0%, oklch(0.93 0.05 50) 100%)",
            border: "1px solid oklch(0.85 0.08 55)",
          }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground grid place-items-center shrink-0">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent font-semibold">
                {t("Aksi Hari Ini", "Today's Action")}
              </p>
              <h2 className="mt-1 text-[15px] font-bold text-foreground leading-snug">
                {t("🎉 Target Terpenuhi!", "🎉 Target Reached!")}
              </h2>
              <p className="mt-1 text-[13px] text-foreground/80 leading-relaxed">
                {t("Unggah foto makan bersama dan tulis jurnal hari ini untuk ", "Upload a group meal photo and write today's journal for ")}
                <span className="font-semibold">{t("Desa Kolaka", "Kolaka Village")}</span>.
              </p>
            </div>
          </div>
          <button onClick={() => setJournalOpen(true)} className="mt-4 w-full bg-foreground text-background rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition">
            <NotebookPen className="w-4 h-4" />
            {t("Buat Jurnal", "Create Journal")}
          </button>
        </section>

        {/* Pojok Inspirasi Guru */}
        <section className="-mx-6">
          <div className="px-6 flex items-end justify-between mb-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">
                {t("Pojok Inspirasi Guru", "Teacher's Inspiration Corner")}
              </p>
              <h2 className="mt-0.5 text-[18px] font-extrabold text-foreground">
                {t("Bacaan Pilihan", "Featured Reads")}
              </h2>
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">
              {t("3 artikel", "3 articles")}
            </span>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <ul className="flex gap-3 px-6 pb-1 snap-x snap-mandatory">
              {INSPIRASI.map((a) => (
                <li key={a.id} className="shrink-0 w-[230px] snap-start">
                  <Link
                    to="/inspirasi/$id"
                    params={{ id: a.id }}
                    className="block bg-surface rounded-2xl border border-border/60 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div
                      className="relative h-28 flex items-end p-3"
                      style={{ background: a.hero }}
                    >
                      <span className="absolute top-2.5 right-2.5 text-2xl drop-shadow">{a.emoji}</span>
                      <span className="bg-surface/90 backdrop-blur text-primary text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {t(a.tag.id, a.tag.en)}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-serif text-[14px] leading-snug text-foreground line-clamp-3 min-h-[3.6em]">
                        {t(a.title.id, a.title.en)}
                      </h3>
                      <div className="mt-2.5 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-muted-foreground inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {t(a.read.id, a.read.en)}
                        </span>
                        <span className="text-accent font-semibold inline-flex items-center gap-0.5">
                          {t("Baca", "Read")} <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Active campaign widget + Dashboard Performa */}
        <section className="relative bg-surface rounded-2xl p-5 border border-border/60">
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">
              {t("Kampanye Aktif", "Active Campaign")}
            </p>
            <span className="text-[10px] font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded-full">
              {t("56% terkumpul", "56% raised")}
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {t("Gizi Sehat Desa Kolaka", "Healthy Nutrition for Kolaka Village")}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" /> SDN 047 Kolaka Utara
          </p>

          <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "56%", background: "#F47B20" }} />
          </div>
          <div className="mt-2 flex justify-between text-xs">
            <span className="font-mono font-semibold text-foreground">Rp 8.4jt</span>
            <span className="font-mono text-muted-foreground">{t("dari Rp 15.0jt", "of Rp 15.0M")}</span>
          </div>

          {/* Dashboard Performa */}
          <div className="mt-5 pt-4 border-t border-border/60">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3" /> {t("Dashboard Performa", "Performance Dashboard")}
              </p>
              <span className="text-[10px] font-mono font-semibold text-accent inline-flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12% {t("minggu ini", "this week")}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { icon: <Eye className="w-3.5 h-3.5" />, value: "1.2k", label: t("Tayangan", "Views") },
                { icon: <Repeat2 className="w-3.5 h-3.5" />, value: "450", label: t("Bagikan", "Shares") },
                { icon: <ThumbsUp className="w-3.5 h-3.5" />, value: "132", label: t("Boost", "Boost") },
              ].map((s, i) => (
                <div key={i} className="bg-muted/50 rounded-xl p-2.5 text-center">
                  <div className="w-7 h-7 rounded-full bg-primary-soft text-primary grid place-items-center mx-auto">
                    {s.icon}
                  </div>
                  <p className="mt-1.5 text-sm font-extrabold text-foreground font-mono leading-none">{s.value}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground font-mono font-semibold">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Donatur Terakhir */}
          <div className="mt-4 bg-muted/40 rounded-xl border border-border/60 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-border/60 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold flex items-center gap-1.5">
                <Users className="w-3 h-3" /> {t("Donatur Terakhir", "Recent Donors")}
              </p>
              <span className="text-[10px] text-muted-foreground font-mono">{donors.length} {t("donatur", "donors")}</span>
            </div>
            <ul className="divide-y divide-border/60 max-h-56 overflow-y-auto">
              {donors.map((d, i) => (
                <li key={i} className="flex items-center gap-2.5 px-3 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary-soft text-primary grid place-items-center text-[10px] font-bold shrink-0">
                    {d.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{d.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{t(d.time, d.timeEn)}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-primary">{fmt(d.amount)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Jurnal Terkini */}
          <div className="mt-4 bg-muted/40 rounded-xl border border-border/60 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-border/60 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" /> {t("Jurnal Terkini", "Recent Journals")}
              </p>
              <span className="text-[10px] text-muted-foreground font-mono">
                {journals.length} {t("entri", "entries")}
              </span>
            </div>
            {journals.length === 0 ? (
              <div className="px-3 py-5 text-center">
                <p className="text-[11px] text-muted-foreground">
                  {t("Belum ada jurnal. Buat jurnal pertama hari ini.", "No journals yet. Create today's first journal.")}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border/60 max-h-80 overflow-y-auto">
                {journals.map((j) => (
                  <li key={j.id} className="px-3 py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold text-foreground truncate">{j.menu}</p>
                      <span className="text-[10px] text-muted-foreground font-mono shrink-0 ml-2">
                        {formatRelative(j.createdAt, lang)}
                      </span>
                    </div>
                    {j.photos.length > 0 && (
                      <div className="grid grid-cols-4 gap-1">
                        {j.photos.slice(0, 4).map((src, i) => (
                          <div key={i} className="aspect-square rounded-md overflow-hidden bg-muted">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="font-serif text-[12px] text-foreground/80 leading-relaxed line-clamp-3">
                      {j.story}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                      {j.mood && <span className="px-1.5 py-0.5 rounded-full bg-primary-soft text-primary font-semibold">{j.mood}</span>}
                      {j.attendance && <span>👧 {j.attendance} {t("anak", "kids")}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={() => setShareOpen(true)}
            className="mt-4 w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition"
          >
            <Share2 className="w-4 h-4" /> {t("Bagikan Link Kampanye", "Share Campaign Link")}
          </button>

          {shareOpen && (
            <ShareSheet title={t("Gizi Sehat Desa Kolaka", "Healthy Nutrition for Kolaka Village")} onClose={() => setShareOpen(false)} />
          )}
        </section>

        {journalOpen && <JournalSheet campaign={ACTIVE_CAMPAIGN} onClose={() => setJournalOpen(false)} />}
      </div>
    </PhoneShell>
  );
}
