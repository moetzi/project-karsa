import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useState } from "react";
import { PartyPopper, NotebookPen, MapPin, TrendingUp, Clock, ArrowRight, BarChart3, Eye, Repeat2, ThumbsUp, Users, Share2, Heart } from "lucide-react";
import { donors, ShareSheet, getCountdown, CampaignDetailSheet, campaigns } from "@/routes/nutrisi";
import { JournalSheet } from "@/components/JournalSheet";
import { DonateSheet } from "@/components/DonateSheet";
import { useDonations, formatRelative as fmtDonRel } from "@/lib/donationStore";
import { useCampaignClosed } from "@/lib/campaignStatusStore";
import { useJournals } from "@/lib/journalsStore";
import { useT } from "@/lib/i18n";
import { INSPIRASI } from "@/lib/inspirasi";


const ACTIVE_CAMPAIGN = {
  id: "kolaka-gizi-sehat",
  title: "Gizi Sehat Desa Kolaka",
  titleEn: "Healthy Nutrition for Kolaka Village",
  school: "SDN 047 Kolaka Utara",
  deadline: "2026-07-15T23:59:00+08:00",
};


export const Route = createFileRoute("/_authenticated/beranda")({
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
  const [shareOpen, setShareOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const donations = useDonations(ACTIVE_CAMPAIGN.id);
  const closed = useCampaignClosed(ACTIVE_CAMPAIGN.id);
  const journals = useJournals(ACTIVE_CAMPAIGN.id);

  const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");
  const allDonors = [
    ...donations.map((d) => ({ name: d.name, amount: d.amount, time: fmtDonRel(d.createdAt, "id"), timeEn: fmtDonRel(d.createdAt, "en") })),
    ...donors,
  ];
  const campaign = campaigns.find((c) => c.id === ACTIVE_CAMPAIGN.id)!;
  const newRaised = donations.reduce((s, d) => s + d.amount, 0);
  const totalRaised = campaign.raised * 1_000_000 + newRaised;
  const targetRp = campaign.target * 1_000_000;
  const rawPct = Math.min(100, Math.round((totalRaised / targetRp) * 100));
  const pct = closed ? 100 : rawPct;
  // Closing journal unlocks when campaign is closed OR target reached.
  const isCampaignClosed = !!closed || rawPct >= 100;
  const hasClosingJournal = journals.some((j) => j.kind === "closing");
  const fmtJt = (n: number) => (n / 1_000_000 >= 10 ? (n / 1_000_000).toFixed(1) : (n / 1_000_000).toFixed(2)) + "jt";
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

        {/* Action item alert — only when campaign is closed (target reached) */}
        {isCampaignClosed && (
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
                  {hasClosingJournal ? t("🎉 Jurnal Penutup Terbit", "🎉 Closing Journal Published") : t("🎉 Kampanye Selesai!", "🎉 Campaign Closed!")}
                </h2>
                <p className="mt-1 text-[13px] text-foreground/80 leading-relaxed">
                  {hasClosingJournal
                    ? t("Donatur sudah bisa melihat bukti penutup di halaman kampanye publik.", "Donors can now see the closing proof on the public campaign page.")
                    : t("Tulis jurnal penutup dengan foto bukti untuk ", "Write the closing journal with proof photos for ")}
                  {!hasClosingJournal && <span className="font-semibold">{t("Desa Kolaka", "Kolaka Village")}</span>}
                </p>
              </div>
            </div>
            <button onClick={() => setJournalOpen(true)} className="mt-4 w-full bg-foreground text-background rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition">
              <NotebookPen className="w-4 h-4" />
              {t("Buat Jurnal Penutup", "Create Closing Journal")}
            </button>
          </section>
        )}


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
                    <div className="relative h-28 overflow-hidden">
                      <img
                        src={a.image}
                        alt={t(a.title.id, a.title.en)}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <span className="absolute bottom-2.5 left-2.5 bg-surface/90 backdrop-blur text-primary text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {t(a.tag.id, a.tag.en)}
                      </span>
                    </div>
                    <div className="p-3 flex flex-col">
                      <h3 className="flex-1 font-serif text-[14px] leading-snug text-foreground line-clamp-3 min-h-[3.6em]">
                        {t(a.title.id, a.title.en)}
                      </h3>
                      <div className="mt-auto pt-2.5 flex items-center justify-between text-[11px]">
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
        <section className="relative bg-surface rounded-2xl border border-border/60 overflow-hidden">
          <button
            onClick={() => setDetailOpen(true)}
            className="block w-full text-left p-5 hover:bg-muted/20 transition-colors"
          >
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
            <div className="flex items-center justify-between mt-1.5 text-[11px]">
              <p className="text-muted-foreground">{t("56% terkumpul", "56% raised")}</p>
              {(() => {
                const cd = getCountdown(ACTIVE_CAMPAIGN.deadline);
                if (!cd) return null;
                return (
                  <span className={"inline-flex items-center gap-1 font-mono font-semibold " + (cd.urgent ? "text-accent" : "text-foreground")}>
                    <Clock className="w-3 h-3" /> {t(cd.id, cd.en)}
                  </span>
                );
              })()}
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
                <span className="text-[10px] text-muted-foreground font-mono">{allDonors.length} {t("donatur", "donors")}</span>
              </div>
              <ul className="divide-y divide-border/60 max-h-56 overflow-y-auto">
                {allDonors.map((d, i) => (
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
          </button>

          <div className="px-5 pb-5 mt-4 flex gap-2">
            <button
              onClick={() => setDonateOpen(true)}
              className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition"
            >
              <Heart className="w-4 h-4" /> {t("Donasi", "Donate")}
            </button>
            <button
              onClick={() => setShareOpen(true)}
              className="flex-1 bg-muted text-foreground rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-muted/80 transition border border-border"
            >
              <Share2 className="w-4 h-4" /> {t("Bagikan", "Share")}
            </button>
          </div>

          {shareOpen && (
            <ShareSheet title={t("Gizi Sehat Desa Kolaka", "Healthy Nutrition for Kolaka Village")} onClose={() => setShareOpen(false)} />
          )}
          {donateOpen && (
            <DonateSheet
              campaign={{ id: ACTIVE_CAMPAIGN.id, title: t(ACTIVE_CAMPAIGN.title, ACTIVE_CAMPAIGN.titleEn), school: ACTIVE_CAMPAIGN.school }}
              onClose={() => setDonateOpen(false)}
            />
          )}
          {detailOpen && (
            <CampaignDetailSheet
              c={campaign}
              pct={pct}
              totalRaised={totalRaised}
              fmtJt={fmtJt}
              onClose={() => setDetailOpen(false)}
              onDonate={() => { setDetailOpen(false); setDonateOpen(true); }}
              onShare={() => { setDetailOpen(false); setShareOpen(true); }}
            />
          )}
        </section>

        {journalOpen && <JournalSheet campaign={ACTIVE_CAMPAIGN} onClose={() => setJournalOpen(false)} />}
      </div>
    </PhoneShell>
  );
}
