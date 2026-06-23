import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck, MapPin, Truck, ChevronRight, ThumbsUp, Info, Send, Hash,
  Eye, Repeat2, Share2, X, Link2, Check, Landmark,
  CalendarDays, Calendar, Wallet, Users, Phone, Sparkles,
  ImagePlus, Trash2, Camera, Clock, Lock, LogIn,
} from "lucide-react";
import { useT } from "@/lib/i18n";
import { DonateSheet } from "@/components/DonateSheet";
import { useDonations } from "@/lib/donationStore";
import robinsonMakan1 from "@/assets/robinson-makan-1.jpg";
import robinsonMakan2 from "@/assets/robinson-makan-2.jpg";
import heroRobinson from "@/assets/campaign-hero-robinson.jpg";
import heroKolaka from "@/assets/campaign-hero-kolaka.jpg";
import heroMahakam from "@/assets/campaign-hero-mahakam.jpg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createCampaign, getMyActiveCampaign, closeMyActiveCampaign, updateMyCampaign } from "@/lib/campaigns.functions";
import { listJournals, deleteJournal } from "@/lib/journals.functions";
import { JournalSheet } from "@/components/JournalSheet";


export const Route = createFileRoute("/nutrisi")({
  head: () => ({
    meta: [
      { title: "Gizi & Kampanye — Karsa" },
      { name: "description", content: "Crowdfunding gizi sekolah dari guru untuk anak Indonesia." },
    ],
  }),
  component: Nutrisi,
});

type Tab = "feed" | "buat";

function Nutrisi() {
  const t = useT();
  const [tab, setTab] = useState<Tab>("feed");
  return (
    <PhoneShell>
      <div className="px-6 pt-4 pb-6">
        <h1 className="text-[28px] font-extrabold text-foreground">{t("Gizi & Kampanye", "Nutrition & Campaigns")}</h1>

        <div className="mt-5 bg-muted/70 rounded-2xl p-1 grid grid-cols-2 gap-1">
          {([
            ["feed", t("Feed", "Feed")],
            ["buat", t("+ Buat", "+ Create")],
          ] as [Tab, string][]).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={
                "py-2.5 rounded-xl text-xs font-semibold transition-all " +
                (tab === k ? "bg-surface text-primary shadow-sm" : "text-muted-foreground")
              }
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "feed" && <Feed />}
          {tab === "buat" && <BuatKampanye />}
        </div>
      </div>
    </PhoneShell>
  );
}

export const campaigns = [
  {
    id: "tuamese-darurat-robinson",
    title: "Darurat Gizi — Robinson & Teman",
    school: "SDN Tuamese",
    recipients: 12,
    supplier: "KWT Tuamese",
    tmp: "Posyandu Tuamese",
    region: "Nusa Tenggara Timur",
    raised: 0.25,
    target: 0.25,
    pct: 100,
    
    hero: heroRobinson,
    report: "linear-gradient(135deg, #2d5016 0%, #5a8a3d 100%)",
    teacher: "Pak Budi",
    description: "Robinson, salah satu siswa kelas 3 saya, kemarin pingsan di tengah pelajaran. Setelah saya datangi rumahnya, ternyata sudah dua hari ia hanya makan singkong rebus. Ini bukan kasus tunggal — ada 11 anak lain di kelas saya dengan kondisi serupa. Saya butuh bantuan untuk menyediakan makanan bergizi setiap hari Senin–Jumat selama dua minggu ke depan: nasi, protein hewani (ikan/telur), dan sayur segar dari KWT Tuamese. Total kebutuhan Rp 250.000 untuk 12 anak. Dimasak oleh Posyandu Tuamese, diantar pagi sebelum jam pelajaran dimulai.",
    journal: "Alhamdulillah, dana terkumpul Senin pagi langsung saya teruskan ke Ibu Kristi lalu dibelanjakan ke Kelompok Wanita Tani. Tim Posyandu Tuamese masak sejak subuh — nasi panas, ikan lelusi bumbu kuning, dan tumis sawi segar. Robinson dan 11 temannya makan dengan lahap di kelas hari ini. Robinson bilang ini makanan paling enak yang pernah dia makan. Terima kasih untuk setiap donatur yang telah menyelamatkan anak-anak kami.",
    journalPhotos: [robinsonMakan1, robinsonMakan2] as string[],
    journalDate: "Senin, 22 Jun 2026",
    boosts: 218,
    views: "3.4k",
    shares: 612,
  },
  {
    id: "kolaka-gizi-sehat",
    title: "Gizi Sehat Desa Kolaka",
    school: "SDN 047 Kolaka Utara",
    recipients: 47,
    supplier: "BUMDes Maju Bersama",
    tmp: "PKK Desa Kolaka Utara",
    region: "Sulawesi Tenggara",
    raised: 8.4,
    target: 15,
    pct: 56,
    hero: heroKolaka,
    report: "linear-gradient(135deg, #d4842a 0%, #c9614a 100%)",
    teacher: "Ibu Sari Dewi",
    description: "SDN 047 Kolaka Utara memiliki 47 siswa, mayoritas anak nelayan dengan asupan protein yang fluktuatif. Bersama BUMDes Maju Bersama dan PKK desa, kami menjalankan program makan siang bergizi seimbang setiap hari sekolah selama satu semester. Menu disusun bersama ahli gizi puskesmas: nasi, ikan/telur lokal, sayur, dan buah. Dana digunakan untuk bahan baku (70%), insentif tim masak PKK (20%), dan logistik (10%).",
    journal: "Minggu lalu anak-anak sudah mulai mendapat asupan protein tambahan dari telur lokal. Senyum mereka adalah motivasi kami.",
    deadline: "2026-07-15T23:59:00+08:00",
    boosts: 132,
    views: "1.2k",
    shares: 450,
  },
  {
    id: "mahakam-pangan-bergizi",
    title: "Pangan Bergizi Kampung Baru",
    school: "SDN 013 Mahakam Ulu",
    recipients: 63,
    supplier: "Kelompok Tani Harapan Jaya",
    tmp: "Posyandu Mahakam Ulu",
    region: "Kalimantan Timur",
    raised: 5.2,
    target: 12,
    pct: 43,
    hero: heroMahakam,
    report: "linear-gradient(135deg, #2d5a3d 0%, #5a8a5c 100%)",
    teacher: "Pak Ridwan Saputra",
    description: "Kampung Baru di hulu Sungai Mahakam jauh dari pasar; harga sayur tinggi dan stok protein terbatas. Kami bermitra dengan Kelompok Tani Harapan Jaya untuk pasokan sayur segar dua kali seminggu, dan Posyandu untuk pengolahan. Program berjalan 12 minggu untuk 63 siswa, fokus pada perbaikan tinggi-badan-per-usia yang akan diukur ulang oleh kader Posyandu di akhir program.",
    journal: "Dengan dukungan petani lokal, kami kini bisa menyediakan sayuran segar setiap hari Senin dan Rabu untuk makan siang anak-anak.",
    deadline: "2026-08-30T23:59:00+08:00",
    boosts: 84,
    views: "836",
    shares: 211,
  },
];

export function getCountdown(deadline?: string) {
  if (!deadline) return null;
  const ms = new Date(deadline).getTime() - Date.now();
  if (isNaN(ms)) return null;
  if (ms <= 0) return { id: "Berakhir", en: "Ended", urgent: true, ended: true };
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const urgent = days < 7;
  if (days >= 1) return { id: `${days} hari ${hours} jam lagi`, en: `${days}d ${hours}h left`, urgent, ended: false };
  return { id: `${hours} jam lagi`, en: `${hours}h left`, urgent, ended: false };
}

function Feed() {
  return (
    <div className="space-y-5">
      {campaigns.map((c, i) => (
        <CampaignCard key={i} c={c} />
      ))}
    </div>
  );
}

export function CampaignCard({ c }: { c: typeof campaigns[number] }) {
  const t = useT();
  const [boosted, setBoosted] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const donations = useDonations(c.id);
  const shares = c.shares;
  const boosts = c.boosts + (boosted ? 1 : 0);

  // Live totals — baseline (in juta) + new donations
  const newRaised = donations.reduce((s, d) => s + d.amount, 0);
  const totalRaised = c.raised * 1_000_000 + newRaised;
  const targetRp = c.target * 1_000_000;
  const pct = Math.min(100, Math.round((totalRaised / targetRp) * 100));
  const fmtJt = (n: number) => (n / 1_000_000 >= 10 ? (n / 1_000_000).toFixed(1) : (n / 1_000_000).toFixed(2)) + "jt";


  return (
    <article className="relative bg-surface rounded-2xl overflow-hidden border border-border/60">
      <button
        type="button"
        onClick={() => setDetailOpen(true)}
        className="block w-full text-left hover:bg-muted/20 transition-colors"
        aria-label={t(`Lihat detail ${c.title}`, `View ${c.title} details`)}
      >
        <div className="relative h-44 overflow-hidden">
          <img src={c.hero} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          <div className="relative z-10 h-full p-4 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 bg-surface/95 text-primary text-[11px] font-semibold px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3 h-3" /> {t("Terverifikasi", "Verified")}
              </span>
            </div>
            <div className="text-white">
              <h2 className="text-xl font-extrabold drop-shadow leading-tight">{c.title}</h2>
              <p className="text-xs flex items-center gap-1 mt-1 opacity-90">
                <MapPin className="w-3 h-3" /> {c.school}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs items-start pb-3 border-b border-border/60">
            <div className="text-center pt-0.5">
              <p className="font-bold text-lg text-foreground leading-none">{c.recipients}</p>
              <p className="text-[10px] text-muted-foreground">{t("Penerima", "Recipients")}</p>
            </div>
            <div className="text-[11px] space-y-0.5">
              {c.supplier.split(" & ").filter(Boolean).map((s, i) => (
                <p key={i} className="flex items-center gap-1.5">
                  <Truck className="w-3 h-3 text-primary shrink-0" />
                  {i === 0 && <span className="text-muted-foreground">{t("Pemasok:", "Supplier:")}</span>}
                  <span className="font-semibold text-foreground">{s}</span>
                </p>
              ))}
              {c.tmp && (
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-primary shrink-0" />
                  <span className="text-muted-foreground">{t("Dimasak oleh:", "Cooked by:")}</span>
                  <span className="font-semibold text-foreground">{c.tmp}</span>
                </p>
              )}
              <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-primary shrink-0" /><span className="text-foreground">{c.region}</span></p>
            </div>
          </div>

          <div className="pt-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-mono font-bold text-foreground">Rp {fmtJt(totalRaised)}</span>
              <span className="font-mono text-muted-foreground">{t(`dari Rp ${c.target}jt`, `of Rp ${c.target}M`)}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full progress-gradient rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between mt-1.5 text-[11px]">
              <p className="text-muted-foreground">{t(`${pct}% terkumpul`, `${pct}% raised`)}</p>
              {pct < 100 && (() => {
                const cd = getCountdown(("deadline" in c ? (c as { deadline?: string }).deadline : undefined));
                if (!cd) return null;
                return (
                  <span
                    className={
                      "inline-flex items-center gap-1 font-mono font-semibold " +
                      (cd.urgent ? "text-accent" : "text-foreground")
                    }
                  >
                    <Clock className="w-3 h-3" /> {t(cd.id, cd.en)}
                  </span>
                );
              })()}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span className="font-mono font-semibold text-foreground">{c.views}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Repeat2 className="w-3.5 h-3.5" />
                <span className="font-mono font-semibold text-foreground">{shares}</span>
              </span>
            </div>
            <span className="inline-flex items-center gap-0.5 text-primary font-semibold">
              {t("Lihat detail", "View details")} <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </button>

      <div className="px-4 pb-4 -mt-1 flex items-center gap-2">
        <button
          onClick={() => setBoosted((b) => !b)}
          className={
            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold border transition-colors " +
            (boosted
              ? "bg-accent text-accent-foreground border-accent"
              : "bg-muted/60 text-foreground border-border")
          }
        >
          <ThumbsUp className="w-4 h-4" /> {t("Boost", "Boost")} <span className="font-mono">{boosts}</span>
        </button>
        <button
          onClick={() => setShareOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold border border-primary/30 bg-primary-soft/60 text-primary hover:bg-primary-soft transition-colors"
        >
          <Share2 className="w-4 h-4" /> {t("Bagikan", "Share")}
        </button>
        {pct >= 100 ? (
          <span className="ml-auto inline-flex items-center gap-1 text-primary font-bold text-sm">
            {t("Target Terpenuhi 🎉", "Target Met 🎉")}
          </span>
        ) : (
          <button onClick={() => setDonateOpen(true)} className="ml-auto text-primary font-semibold text-sm inline-flex items-center gap-1 hover:opacity-80 transition">
            {t("Donasi", "Donate")} <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {shareOpen && <ShareSheet title={c.title} onClose={() => setShareOpen(false)} />}
      {donateOpen && <DonateSheet campaign={{ id: c.id, title: c.title, school: c.school }} onClose={() => setDonateOpen(false)} />}
      {detailOpen && (
        <CampaignDetailSheet
          c={c}
          pct={pct}
          totalRaised={totalRaised}
          fmtJt={fmtJt}
          onClose={() => setDetailOpen(false)}
          onDonate={() => { setDetailOpen(false); setDonateOpen(true); }}
          onShare={() => { setDetailOpen(false); setShareOpen(true); }}
        />
      )}
    </article>
  );
}

export function CampaignDetailSheet({
  c, pct, totalRaised, fmtJt, onClose, onDonate, onShare,
}: {
  c: typeof campaigns[number];
  pct: number;
  totalRaised: number;
  fmtJt: (n: number) => string;
  onClose: () => void;
  onDonate: () => void;
  onShare: () => void;
}) {
  const t = useT();
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md sm:max-w-2xl lg:max-w-3xl bg-background rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-300"
      >
        <div className="sticky top-0 bg-background z-10 pt-2 pb-3 px-5 border-b border-border/60">
          <div className="mx-auto w-10 h-1 rounded-full bg-muted-foreground/30 mb-3" />
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
              {t("Detail Kampanye", "Campaign Details")}
            </p>
            <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-full bg-muted hover:bg-muted/70">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative h-40 sm:h-56 overflow-hidden">
          <img src={c.hero} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          <div className="relative z-10 h-full p-4 flex items-end">
            <div className="text-white">
              <h2 className="text-2xl font-extrabold drop-shadow leading-tight">{c.title}</h2>
              <p className="text-xs flex items-center gap-1 mt-1 opacity-90">
                <MapPin className="w-3 h-3" /> {c.school} • {c.region}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-mono font-bold text-foreground">Rp {fmtJt(totalRaised)}</span>
              <span className="font-mono text-muted-foreground">{t(`dari Rp ${c.target}jt`, `of Rp ${c.target}M`)}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full progress-gradient rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between mt-1.5 text-[11px]">
              <p className="text-muted-foreground">{t(`${pct}% terkumpul`, `${pct}% raised`)}</p>
              {pct < 100 && (() => {
                const cd = getCountdown(("deadline" in c ? (c as { deadline?: string }).deadline : undefined));
                if (!cd) return null;
                return (
                  <span
                    className={
                      "inline-flex items-center gap-1 font-mono font-semibold " +
                      (cd.urgent ? "text-accent" : "text-foreground")
                    }
                  >
                    <Clock className="w-3 h-3" /> {t(cd.id, cd.en)}
                  </span>
                );
              })()}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-muted/40 p-2.5">
              <p className="font-bold text-base text-foreground">{c.recipients}</p>
              <p className="text-[10px] text-muted-foreground">{t("Penerima", "Recipients")}</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-2.5">
              <p className="font-bold text-base text-foreground">{c.views}</p>
              <p className="text-[10px] text-muted-foreground">{t("Views", "Views")}</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-2.5">
              <p className="font-bold text-base text-foreground">{c.shares}</p>
              <p className="text-[10px] text-muted-foreground">{t("Shares", "Shares")}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold mb-2">
              {t("Deskripsi Kampanye", "Campaign Description")}
            </p>
            <p className="font-serif text-[13px] text-foreground leading-relaxed whitespace-pre-line">
              {c.description}
            </p>
          </div>

          {pct >= 100 && (
            <div className="bg-primary-soft/40 rounded-xl p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                  {("journalPhotos" in c && (c as { journalPhotos?: string[] }).journalPhotos?.length)
                    ? t("Jurnal Penutup", "Closing Journal")
                    : t("Cerita Guru", "Teacher's Story")} — {c.teacher.toUpperCase()}
                </p>
                {"journalDate" in c && (c as { journalDate?: string }).journalDate && (
                  <span className="font-mono text-[9px] text-muted-foreground shrink-0">
                    {(c as { journalDate?: string }).journalDate}
                  </span>
                )}
              </div>
              <p className="font-serif italic text-[13px] text-foreground mt-2 leading-relaxed">
                "{c.journal}"
              </p>
              {"journalPhotos" in c && (c as { journalPhotos?: string[] }).journalPhotos && (c as { journalPhotos?: string[] }).journalPhotos!.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(c as { journalPhotos: string[] }).journalPhotos.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border/60">
                      <img
                        src={src}
                        alt={t("Foto anak-anak makan bersama", "Children eating together")}
                        width={1024}
                        height={1024}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="rounded-xl border border-border/60 p-3 space-y-1.5 text-[12px]">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
              {t("Rantai Akuntabilitas", "Accountability Chain")}
            </p>
            <p className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-primary shrink-0" /><span className="text-muted-foreground">{t("Pemasok:", "Supplier:")}</span><span className="font-semibold text-foreground">{c.supplier}</span></p>
            {c.tmp && <p className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" /><span className="text-muted-foreground">{t("Dimasak:", "Cooked by:")}</span><span className="font-semibold text-foreground">{c.tmp}</span></p>}
            <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary shrink-0" /><span className="text-foreground">{c.region}</span></p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={onShare}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-sm font-semibold border border-primary/30 bg-primary-soft/60 text-primary"
            >
              <Share2 className="w-4 h-4" /> {t("Bagikan", "Share")}
            </button>
            {pct >= 100 ? (
              <span className="flex-1 text-center text-primary font-bold text-sm py-3">
                {t("Target Terpenuhi 🎉", "Target Met 🎉")}
              </span>
            ) : (
              <button
                onClick={onDonate}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-sm font-semibold bg-primary text-primary-foreground"
              >
                {t("Donasi Sekarang", "Donate Now")} <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-[10px] text-center text-muted-foreground font-mono pb-2">
            {t(
              "Jurnal penutup & foto akan diunggah guru saat kampanye selesai.",
              "Closing journal & photos uploaded by the teacher when the campaign closes.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function ShareSheet({ title, onClose }: { title: string; onClose: () => void }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const channels = [
    { id: "wa", label: "WhatsApp", emoji: "💬", bg: "linear-gradient(135deg,#25D366,#128C7E)" },
    { id: "ig", label: "Instagram Story", emoji: "📸", bg: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)" },
    { id: "tw", label: "Twitter / X", emoji: "𝕏", bg: "linear-gradient(135deg,#0f1419,#1d9bf0)" },
  ];
  return (
    <div
      className="absolute inset-0 z-20 flex items-end bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full bg-surface rounded-t-3xl p-5 pb-7 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">{t("Bagikan Kampanye", "Share Campaign")}</p>
            <h3 className="mt-1 text-[15px] font-bold text-foreground leading-snug pr-6">{title}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted grid place-items-center text-muted-foreground shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {channels.map((ch) => (
            <button key={ch.id} className="flex flex-col items-center gap-2 group">
              <span
                className="w-14 h-14 rounded-2xl grid place-items-center text-2xl text-white shadow-md group-active:scale-95 transition"
                style={{ background: ch.bg }}
              >
                {ch.emoji}
              </span>
              <span className="text-[11px] font-semibold text-foreground text-center leading-tight">{ch.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="mt-5 w-full flex items-center justify-between bg-muted/70 rounded-xl px-4 py-3 text-sm hover:bg-muted transition"
        >
          <span className="font-mono text-xs text-muted-foreground truncate">karsa.id/k/{title.split(" ")[1]?.toLowerCase() ?? "kampanye"}</span>
          <span className={"inline-flex items-center gap-1 font-semibold text-xs " + (copied ? "text-primary" : "text-foreground")}>
            {copied ? (<><Check className="w-3.5 h-3.5" /> {t("Tersalin", "Copied")}</>) : (<><Link2 className="w-3.5 h-3.5" /> {t("Salin", "Copy")}</>)}
          </span>
        </button>
      </div>
    </div>
  );
}

const SUPPLIER_GROUPS = [
  "BUMDes",
  "Kelompok Tani Lokal",
  "Kelompok Ternak Lokal",
  "Kelompok Nelayan Lokal",
  "Lainnya (Kios/UMKM)",
];

const REGIONS = [
  "Aceh","Sumatera Utara","Sumatera Barat","Riau","Kepulauan Riau","Jambi","Bengkulu","Sumatera Selatan","Bangka Belitung","Lampung",
  "DKI Jakarta","Banten","Jawa Barat","Jawa Tengah","DI Yogyakarta","Jawa Timur",
  "Bali","Nusa Tenggara Barat","Nusa Tenggara Timur",
  "Kalimantan Barat","Kalimantan Tengah","Kalimantan Selatan","Kalimantan Timur","Kalimantan Utara",
  "Sulawesi Utara","Gorontalo","Sulawesi Tengah","Sulawesi Barat","Sulawesi Selatan","Sulawesi Tenggara",
  "Maluku","Maluku Utara","Papua","Papua Barat","Papua Selatan","Papua Tengah","Papua Pegunungan","Papua Barat Daya",
];

const DAYS_ID = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
const DAYS_EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const AI_MENU_SAMPLE: Record<string, string> = {
  Senin: "Nasi Jagung, Ikan Tongkol Bumbu Kuning, Tumis Kangkung",
  Selasa: "Bubur Kacang Hijau, Telur Rebus, Pisang",
  Rabu: "Nasi Merah, Ayam Suwir Kemangi, Sup Bayam",
  Kamis: "Nasi Putih, Tempe Orek, Sayur Asem, Pepaya",
  Jumat: "Nasi Uduk, Perkedel Tahu, Tumis Buncis Wortel",
};

function BuatKampanye() {
  const t = useT();
  const [npsn, setNpsn] = useState("");
  const [nama, setNama] = useState("");
  const [sekolah, setSekolah] = useState("");
  const [region, setRegion] = useState("");
  const [recipients, setRecipients] = useState("");
  const [guru, setGuru] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [desc, setDesc] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  // Disbursement & Accountability
  const [teacherBank, setTeacherBank] = useState("");
  const [teacherAccount, setTeacherAccount] = useState("");
  const [tmpGroup, setTmpGroup] = useState("");
  const [tmpPhone, setTmpPhone] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierGroup, setSupplierGroup] = useState("");

  const [menu, setMenu] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState(false);
  const [journalCommit, setJournalCommit] = useState(false);

  const handlePhotos = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).slice(0, 4 - photos.length).map((f) => URL.createObjectURL(f));
    setPhotos((p) => [...p, ...urls].slice(0, 4));
  };

  const autoGenerateMenu = () => {
    setAiLoading(true);
    setTimeout(() => {
      setMenu({ ...AI_MENU_SAMPLE });
      setAiLoading(false);
    }, 700);
  };

  const groupLabels: Record<string, string> = {
    "BUMDes": t("BUMDes (Badan Usaha Milik Desa)", "BUMDes (Village-Owned Enterprise)"),
    "Kelompok Tani Lokal": t("Kelompok Tani Lokal", "Local Farmer Group"),
    "Kelompok Ternak Lokal": t("Kelompok Ternak Lokal", "Local Livestock Group"),
    "Kelompok Nelayan Lokal": t("Kelompok Nelayan Lokal", "Local Fisher Group"),
    "Lainnya (Kios/UMKM)": t("Lainnya (Kios/UMKM)", "Other (Shop/MSME)"),
  };

  const fieldChecks: Array<[string, string, boolean]> = [
    ["npsn", t("NPSN", "NPSN"), !!npsn],
    ["sekolah", t("Nama Sekolah", "School Name"), !!sekolah],
    ["region", t("Provinsi", "Province"), !!region],
    ["guru", t("Nama Guru", "Teacher's Name"), !!guru],
    ["nama", t("Nama Kampanye", "Campaign Name"), !!nama],
    ["recipients", t("Jumlah Penerima", "Number of Recipients"), !!recipients],
    ["target", t("Target Dana", "Funding Target"), !!target],
    ["deadline", t("Deadline", "Deadline"), !!deadline],
    ["desc", t("Deskripsi Kampanye", "Campaign Description"), !!desc],
    ["photos", t("Foto Bukti (min. 1)", "Proof Photos (min. 1)"), photos.length > 0],
    ["teacherBank", t("Nama Bank", "Bank Name"), !!teacherBank],
    ["teacherAccount", t("No. Rekening", "Account No."), !!teacherAccount],
    ["tmpGroup", t("Kelompok TMP", "TMP Group"), !!tmpGroup],
    ["tmpPhone", t("No. HP TMP", "TMP Phone"), !!tmpPhone],
  ];
  const missing = fieldChecks.filter(([, , ok]) => !ok).map(([, label]) => label);
  const valid = missing.length === 0 && journalCommit;
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // Auth + active-campaign gate (server-enforced "one active campaign per teacher").
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user.id ?? null);
      setAuthReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const queryClient = useQueryClient();
  const getActive = useServerFn(getMyActiveCampaign);
  const createFn = useServerFn(createCampaign);

  const activeQuery = useQuery({
    queryKey: ["my-active-campaign", userId],
    queryFn: () => getActive(),
    enabled: !!userId,
    staleTime: 30_000,
  });
  const hasActiveCampaign = !!activeQuery.data;

  const createMutation = useMutation({
    mutationFn: (input: { title: string; description: string; school: string; target_amount: number }) =>
      createFn({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-active-campaign", userId] });
      setSubmitted(true);
      toast.success(t("Kampanye diajukan!", "Campaign submitted!"));
    },
    onError: (err: Error) => {
      const msg = err.message ?? "";
      if (msg.includes("ACTIVE_CAMPAIGN_EXISTS")) {
        toast.error(
          t(
            "Anda masih punya kampanye aktif. Tutup dulu sebelum membuat yang baru.",
            "You still have an active campaign. Close it before creating a new one.",
          ),
        );
        queryClient.invalidateQueries({ queryKey: ["my-active-campaign", userId] });
      } else if (msg.startsWith("Unauthorized")) {
        toast.error(t("Masuk dulu untuk membuat kampanye.", "Sign in first to create a campaign."));
      } else {
        toast.error(msg || t("Gagal mengajukan kampanye.", "Failed to submit campaign."));
      }
    },
  });

  const locked = !userId || hasActiveCampaign || createMutation.isPending;

  const handleSubmit = () => {
    if (!valid) { setShowErrors(true); return; }
    if (!userId) {
      toast.error(t("Masuk dulu untuk membuat kampanye.", "Sign in first to create a campaign."));
      return;
    }
    if (hasActiveCampaign) {
      toast.error(
        t(
          "Anda masih punya kampanye aktif. Tutup dulu sebelum membuat yang baru.",
          "You still have an active campaign. Close it before creating a new one.",
        ),
      );
      return;
    }
    createMutation.mutate({
      title: nama,
      description: desc,
      school: sekolah,
      target_amount: Number(target),
    });
  };


  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-4 text-xs leading-relaxed flex items-start gap-2.5"
        style={{ background: "oklch(0.94 0.04 215)", border: "1px solid oklch(0.85 0.06 215)" }}
      >
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-foreground/85">
          {t("Kampanye akan diverifikasi menggunakan ", "Campaigns are verified using the ")}
          <span className="font-semibold">{t("NPSN resmi sekolah", "school's official NPSN")}</span>
          {t(". Dana dicairkan sesuai alur lean disbursment kami.", ". Funds are disbursed according to our lean disbursement flow.")}
        </p>
      </div>

      {/* Identitas Sekolah */}
      <SectionCard title={t("Identitas Sekolah", "School Identity")}>
        <FormField label={t("NPSN (ID Sekolah)", "NPSN (School ID)")} required>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={npsn}
              onChange={(e) => setNpsn(e.target.value)}
              placeholder={t("cth. 10200101", "e.g. 10200101")}
              className="w-full bg-muted/60 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70"
            />
          </div>
        </FormField>
        <FormField label={t("Nama Sekolah", "School Name")} required>
          <input value={sekolah} onChange={(e) => setSekolah(e.target.value)}
            placeholder={t("cth. SDN 047 Kolaka Utara", "e.g. SDN 047 Kolaka Utara")}
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70" />
        </FormField>
        <FormField label={t("Provinsi", "Province")} required>
          <select value={region} onChange={(e) => setRegion(e.target.value)}
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground appearance-none border border-transparent focus:border-primary outline-none">
            <option value="">{t("Pilih provinsi...", "Select province...")}</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </FormField>
        <FormField label={t("Nama Guru Penanggung Jawab", "Responsible Teacher's Name")} required>
          <input value={guru} onChange={(e) => setGuru(e.target.value)}
            placeholder={t("cth. Ibu Sari Dewi", "e.g. Ms. Sari Dewi")}
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70" />
        </FormField>
      </SectionCard>

      {/* Detail Kampanye */}
      <SectionCard title={t("Detail Kampanye", "Campaign Details")}>
        <FormField label={t("Nama Kampanye", "Campaign Name")} required>
          <input value={nama} onChange={(e) => setNama(e.target.value)}
            placeholder={t("cth. Gizi Sehat Desa Kolaka 2025", "e.g. Healthy Nutrition Kolaka Village 2025")}
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70" />
        </FormField>
        <FormField label={t("Jumlah Penerima (Siswa)", "Number of Recipients (Students)")} required>
          <input value={recipients} onChange={(e) => setRecipients(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric" placeholder={t("cth. 47", "e.g. 47")}
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm font-mono text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70" />
        </FormField>
        <FormField label={t("Target Dana (IDR)", "Funding Target (IDR)")} required>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-mono font-semibold text-foreground">Rp</span>
            <input value={target} onChange={(e) => setTarget(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric" placeholder="15000000"
              className="w-full bg-muted/60 rounded-xl pl-12 pr-4 py-3 text-sm font-mono text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70" />
          </div>
        </FormField>
        <FormField label={t("Batas Waktu Kampanye (Deadline)", "Campaign Deadline")} required>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-muted/60 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground border border-transparent focus:border-primary outline-none"
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
            {t(
              "Kampanye otomatis ditutup jika target dana tercapai atau melewati tanggal ini.",
              "The campaign auto-closes when the funding target is met or this date passes.",
            )}
          </p>
        </FormField>
        <FormField label={t("Deskripsi Kampanye", "Campaign Description")} required>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4}
            placeholder={t(
              "Ceritakan kondisi anak-anak di sekolah Anda dan bagaimana dana ini akan digunakan...",
              "Describe the condition of children at your school and how the funds will be used...",
            )}
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground border border-transparent focus:border-primary outline-none resize-none font-serif placeholder:text-muted-foreground/70 placeholder:font-sans" />
        </FormField>
        <FormField label={t("Foto Bukti Kondisi (untuk meningkatkan kepercayaan donatur)", "Proof Photos (boosts donor trust)")} required>
          <div className="grid grid-cols-4 gap-2">
            {photos.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border/60">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white grid place-items-center"
                  aria-label={t("Hapus foto", "Remove photo")}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {photos.length < 4 && (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary-soft/30 transition flex flex-col items-center justify-center gap-1 text-muted-foreground"
              >
                <ImagePlus className="w-5 h-5" />
                <span className="text-[9px] font-mono uppercase">{t("Tambah", "Add")}</span>
              </button>
            )}
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            className="hidden"
            onChange={(e) => handlePhotos(e.target.files)}
          />
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="mt-2 w-full border border-border rounded-xl py-2.5 text-xs font-semibold text-foreground inline-flex items-center justify-center gap-2 hover:bg-muted/50"
          >
            <Camera className="w-4 h-4" /> {t("Ambil / Pilih Foto (maks. 4)", "Take / Pick Photos (max 4)")}
          </button>
          <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
            {t(
              "Foto kondisi sekolah, ruang masak, atau anak-anak penerima — meningkatkan kepercayaan calon donatur.",
              "Photos of school, kitchen, or recipient children — boosts trust with prospective donors.",
            )}
          </p>
        </FormField>
      </SectionCard>

      {/* Disbursement & Accountability */}
      <SectionCard
        title={
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            {t("Pencairan & Akuntabilitas", "Disbursement & Accountability")}
          </span>
        }
        subtitle={t(
          "Lean disbursement: dana cair ke guru, diverifikasi tim lokal.",
          "Lean disbursement: funds go to the teacher, verified by the local team.",
        )}
      >
        {/* Teacher's Bank */}
        <div className="rounded-xl border border-border/70 bg-muted/30 p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
              {t("Rekening Pencairan (Guru)", "Disbursement Account (Teacher)")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label={t("Nama Bank", "Bank Name")} required>
              <div className="relative">
                <Landmark className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input value={teacherBank} onChange={(e) => setTeacherBank(e.target.value)}
                  placeholder={t("cth. BRI", "e.g. BRI")}
                  className="w-full bg-surface rounded-lg pl-8 pr-2 py-2.5 text-sm text-foreground border border-border focus:border-primary outline-none placeholder:text-muted-foreground/70" />
              </div>
            </FormField>
            <FormField label={t("No. Rekening", "Account No.")} required>
              <input value={teacherAccount} onChange={(e) => setTeacherAccount(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric" placeholder="0123456789"
                className="w-full bg-surface rounded-lg px-3 py-2.5 text-sm font-mono text-foreground border border-border focus:border-primary outline-none placeholder:text-muted-foreground/70" />
            </FormField>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            {t("Dana cair langsung ke rekening Anda.", "Funds are disbursed directly to your account.")}
          </p>
        </div>

        {/* TMP Verification */}
        <div className="rounded-xl border border-border/70 bg-muted/30 p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
              {t("Verifikasi Tim Pembuat Makanan (TMP)", "Meal Team (TMP) Verification")}
            </span>
          </div>
          <FormField label={t("Nama Kelompok PKK/Posyandu", "PKK/Posyandu Group Name")} required>
            <input value={tmpGroup} onChange={(e) => setTmpGroup(e.target.value)}
              placeholder={t("cth. Posyandu Tuamese", "e.g. Posyandu Tuamese")}
              className="w-full bg-surface rounded-lg px-3 py-2.5 text-sm text-foreground border border-border focus:border-primary outline-none placeholder:text-muted-foreground/70" />
          </FormField>
          <FormField label={t("NO. HP PERWAKILAN", "Representative's Mobile No.")} required>
            <div className="relative">
              <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input value={tmpPhone} onChange={(e) => setTmpPhone(e.target.value.replace(/[^\d+]/g, ""))}
                inputMode="tel" placeholder="+62 812 3456 7890"
                className="w-full bg-surface rounded-lg pl-8 pr-2 py-2.5 text-sm font-mono text-foreground border border-border focus:border-primary outline-none placeholder:text-muted-foreground/70" />
            </div>
          </FormField>
        </div>

        {/* Optional Local Supplier */}
        <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
              {t("Mitra Pemasok Lokal (Opsional)", "Local Supplier Partner (Optional)")}
            </span>
          </div>
          <FormField label={t("Nama Pemasok", "Supplier Name")}>
            <input value={supplierName} onChange={(e) => setSupplierName(e.target.value)}
              placeholder={t("cth. BUMDes Maju Bersama", "e.g. BUMDes Maju Bersama")}
              className="w-full bg-surface rounded-lg px-3 py-2.5 text-sm text-foreground border border-border focus:border-primary outline-none placeholder:text-muted-foreground/70" />
          </FormField>
          <FormField label={t("Pilihan Kelompok", "Group Type")}>
            <select value={supplierGroup} onChange={(e) => setSupplierGroup(e.target.value)}
              className="w-full bg-surface rounded-lg px-3 py-2.5 text-sm text-foreground appearance-none border border-border focus:border-primary outline-none">
              <option value="">{t("Pilih kelompok...", "Select group...")}</option>
              {SUPPLIER_GROUPS.map((g) => <option key={g} value={g}>{groupLabels[g]}</option>)}
            </select>
          </FormField>
        </div>
      </SectionCard>

      {/* Meal Planner */}
      <SectionCard
        title={
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              {t("\u00a0Meal Plan", "\u00a0Meal Plan")}
            </span>
            <button
              type="button"
              onClick={autoGenerateMenu}
              disabled={aiLoading}
              className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg, oklch(0.72 0.16 50), oklch(0.62 0.18 35))",
                boxShadow: "0 0 0 2px oklch(0.95 0.08 60), 0 8px 24px -8px oklch(0.65 0.18 40 / 0.55)",
              }}
            >
              <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? "animate-spin" : ""}`} />
              {aiLoading
                ? t("Membuat...", "Generating...")
                : t("Auto-Generate Menu (AI)", "Auto-Generate Menu (AI)")}
            </button>
          </div>
        }
        subtitle={t(
          "Kosongkan hari yang tidak ada jadwal. Menu ini akan tampil di tab 'Cerita' donatur.",
          "Leave days blank if not scheduled. This menu appears in the donor's 'Story' tab.",
        )}
      >
        <div className="space-y-2">
          {DAYS_ID.map((d, i) => (
            <div key={d} className="flex items-center gap-2">
              <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                {t(d, DAYS_EN[i])}
              </span>
              <input
                value={menu[d] ?? ""}
                onChange={(e) => setMenu((m) => ({ ...m, [d]: e.target.value }))}
                placeholder={t("Opsional — kosongkan jika libur", "Optional — leave blank if none")}
                className="flex-1 bg-muted/60 rounded-lg px-3 py-2.5 text-sm text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70"
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {showErrors && !valid && (
        <div
          className="rounded-2xl p-3.5 text-xs leading-relaxed flex items-start gap-2.5"
          style={{ background: "oklch(0.96 0.05 35)", border: "1px solid oklch(0.82 0.12 35)" }}
        >
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              {t("Lengkapi field berikut:", "Please complete:")}
            </p>
            <p className="text-foreground/80">{missing.join(" • ")}</p>
          </div>
        </div>
      )}
      {submitted && (
        <div
          className="rounded-2xl p-3.5 text-xs leading-relaxed flex items-start gap-2.5"
          style={{ background: "oklch(0.94 0.06 165)", border: "1px solid oklch(0.78 0.14 165)" }}
        >
          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              {t("Kampanye diajukan!", "Campaign submitted!")}
            </p>
            <p className="text-foreground/80">
              {t(
                "Setelah kampanye selesai (target tercapai atau deadline lewat), Anda mengunggah satu jurnal penutup berisi foto bukti dari tab Beranda untuk menutup loop transparansi ke donatur.",
                "Once the campaign closes (target met or deadline passed), upload a single closing journal with proof photos from Home to close the transparency loop with donors.",
              )}
            </p>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setJournalCommit((v) => !v)}
        className={
          "w-full flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition " +
          (journalCommit
            ? "border-primary bg-primary/10"
            : "border-border/60 bg-muted/40 hover:bg-muted/60")
        }
      >
        <span
          className={
            "mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition " +
            (journalCommit
              ? "bg-primary border-primary text-primary-foreground"
              : "bg-transparent border-muted-foreground/30")
          }
        >
          {journalCommit && <Check className="w-3.5 h-3.5" />}
        </span>
        <div>
          <p className="text-xs font-semibold text-foreground">
            {t(
              "Saya berkomitmen membuat jurnal penutup dengan foto bukti saat kampanye selesai",
              "I commit to creating a closing journal with proof photos when the campaign ends",
            )}
          </p>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
            {t(
              "Jurnal ini menjadi laporan transparansi yang otomatis dikirim ke semua donatur.",
              "This journal becomes the transparency report auto-sent to all donors.",
            )}
          </p>
        </div>
      </button>
      {authReady && !userId && (
        <div className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-xs flex items-start gap-2">
          <LogIn className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-foreground/85">
            {t(
              "Masuk dulu untuk mengajukan kampanye. Validasi 1 kampanye aktif per guru dilakukan di server.",
              "Sign in to submit a campaign. The one-active-campaign-per-teacher rule is enforced on the server.",
            )}
          </p>
        </div>
      )}
      {hasActiveCampaign && activeQuery.data && (
        <ActiveCampaignPanel
          campaign={activeQuery.data}
          onChanged={() => queryClient.invalidateQueries({ queryKey: ["my-active-campaign", userId] })}
        />
      )}
      <button
        type="button"
        onClick={handleSubmit}
        aria-disabled={!valid || locked}
        disabled={locked}
        className={
          "w-full rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 transition " +
          (valid && !locked
            ? "bg-primary text-primary-foreground hover:opacity-95"
            : "bg-primary/50 text-primary-foreground hover:bg-primary/60 cursor-not-allowed")
        }
      >
        {locked ? <Lock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
        {createMutation.isPending
          ? t("Mengirim...", "Submitting...")
          : hasActiveCampaign
            ? t("Kampanye Aktif Masih Berjalan", "Active Campaign In Progress")
            : !userId
              ? t("Masuk untuk Mengajukan", "Sign In to Submit")
              : t("Ajukan Kampanye", "Submit Campaign")}
      </button>

    </div>
  );
}

function SectionCard({
  title, subtitle, children,
}: { title: React.ReactNode; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="bg-surface rounded-2xl p-5 border border-border/60">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{subtitle}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
    </div>
  );
}

/* Dashboard moved to Beranda → Active Campaign card */
export const donors = [
  { name: "Hamba Allah #12", amount: 250_000, time: "2 mnt lalu", timeEn: "2 min ago" },
  { name: "Andi P.", amount: 100_000, time: "15 mnt lalu", timeEn: "15 min ago" },
  { name: "Hamba Allah #11", amount: 500_000, time: "1 jam lalu", timeEn: "1 hr ago" },
  { name: "Keluarga Suryanto", amount: 1_000_000, time: "3 jam lalu", timeEn: "3 hr ago" },
  { name: "Hamba Allah #10", amount: 75_000, time: "5 jam lalu", timeEn: "5 hr ago" },
  { name: "Komunitas Sahabat Anak", amount: 750_000, time: "Kemarin", timeEn: "Yesterday" },
];
export { ShareSheet };

/* =================== Active Campaign Management Panel =================== */

type ActiveCampaign = {
  id: string;
  title: string;
  description: string;
  school: string;
  target_amount: number;
  status: string;
  created_at: string;
  closed_at: string | null;
};

function ActiveCampaignPanel({
  campaign,
  onChanged,
}: {
  campaign: ActiveCampaign;
  onChanged: () => void;
}) {
  const t = useT();
  const [editOpen, setEditOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  const closeFn = useServerFn(closeMyActiveCampaign);
  const closeMutation = useMutation({
    mutationFn: () => closeFn(),
    onSuccess: () => {
      toast.success(t("Kampanye ditutup.", "Campaign closed."));
      setConfirmClose(false);
      onChanged();
    },
    onError: (e: Error) => toast.error(e.message || t("Gagal menutup kampanye.", "Failed to close.")),
  });

  return (
    <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4 space-y-3">
      <div className="flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
            {t("Kampanye Aktif Anda", "Your Active Campaign")}
          </p>
          <p className="mt-0.5 text-sm font-bold text-foreground truncate">{campaign.title}</p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {campaign.school} · Rp {(campaign.target_amount / 1_000_000).toFixed(1)}jt
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setEditOpen(true)}
          className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-muted/60"
        >
          <Sparkles className="w-3.5 h-3.5" /> {t("Edit", "Edit")}
        </button>
        <button
          onClick={() => setConfirmClose(true)}
          className="rounded-xl border border-accent/50 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent inline-flex items-center justify-center gap-1.5 hover:bg-accent/15"
        >
          <Lock className="w-3.5 h-3.5" /> {t("Tutup", "Close")}
        </button>
        <button
          onClick={() => setJournalOpen(true)}
          className="rounded-xl bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:opacity-95"
        >
          <Camera className="w-3.5 h-3.5" /> {t("Buat Jurnal", "New Journal")}
        </button>
        <button
          onClick={() => setLogOpen(true)}
          className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-muted/60"
        >
          <Eye className="w-3.5 h-3.5" /> {t("Lihat Jurnal", "View Journals")}
        </button>
      </div>

      {editOpen && (
        <EditCampaignDialog
          campaign={campaign}
          onClose={() => setEditOpen(false)}
          onSaved={() => { setEditOpen(false); onChanged(); }}
        />
      )}
      {journalOpen && (
        <JournalSheet
          campaign={{ id: campaign.id, title: campaign.title, titleEn: campaign.title, school: campaign.school }}
          onClose={() => setJournalOpen(false)}
        />
      )}
      {logOpen && (
        <JournalsLogSheet campaignId={campaign.id} onClose={() => setLogOpen(false)} />
      )}
      {confirmClose && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4" onClick={() => !closeMutation.isPending && setConfirmClose(false)}>
          <div className="bg-background rounded-2xl border border-border p-5 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-foreground">{t("Tutup kampanye ini?", "Close this campaign?")}</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              {t(
                "Setelah ditutup, donatur tidak bisa berdonasi lagi dan Anda bisa membuat kampanye baru.",
                "Once closed, donors can't contribute anymore and you can create a new campaign.",
              )}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setConfirmClose(false)}
                disabled={closeMutation.isPending}
                className="rounded-xl border border-border bg-surface py-2.5 text-sm font-semibold"
              >
                {t("Batal", "Cancel")}
              </button>
              <button
                onClick={() => closeMutation.mutate()}
                disabled={closeMutation.isPending}
                className="rounded-xl bg-accent text-accent-foreground py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {closeMutation.isPending ? "..." : t("Ya, Tutup", "Yes, Close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditCampaignDialog({
  campaign, onClose, onSaved,
}: { campaign: ActiveCampaign; onClose: () => void; onSaved: () => void }) {
  const t = useT();
  const [title, setTitle] = useState(campaign.title);
  const [description, setDescription] = useState(campaign.description);
  const [school, setSchool] = useState(campaign.school);
  const [target, setTarget] = useState(String(campaign.target_amount));
  const updateFn = useServerFn(updateMyCampaign);
  const mutation = useMutation({
    mutationFn: () => updateFn({
      data: {
        id: campaign.id,
        title,
        description,
        school,
        target_amount: Number(target),
      },
    }),
    onSuccess: () => { toast.success(t("Kampanye diperbarui.", "Campaign updated.")); onSaved(); },
    onError: (e: Error) => toast.error(e.message || t("Gagal memperbarui.", "Failed to update.")),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-background rounded-t-3xl md:rounded-2xl max-h-[90vh] overflow-y-auto border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-background border-b border-border/60 px-5 py-3 flex items-center justify-between">
          <h3 className="font-extrabold text-foreground">{t("Edit Kampanye", "Edit Campaign")}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-muted grid place-items-center hover:bg-muted/70">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <Field label={t("Nama Kampanye", "Campaign Name")}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={editInput} />
          </Field>
          <Field label={t("Nama Sekolah", "School Name")}>
            <input value={school} onChange={(e) => setSchool(e.target.value)} className={editInput} />
          </Field>
          <Field label={t("Target Dana (Rp)", "Target (IDR)")}>
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              className={editInput + " font-mono"}
            />
          </Field>
          <Field label={t("Deskripsi", "Description")}>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className={editInput + " resize-none font-serif leading-relaxed"} />
          </Field>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !title || !school || !description || !target}
            className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {mutation.isPending ? "..." : <><Check className="w-4 h-4" /> {t("Simpan Perubahan", "Save Changes")}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
const editInput = "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:border-primary";

function JournalsLogSheet({ campaignId, onClose }: { campaignId: string; onClose: () => void }) {
  const t = useT();
  const qc = useQueryClient();
  const listFn = useServerFn(listJournals);
  const delFn = useServerFn(deleteJournal);
  const { data: entries, isLoading } = useQuery({
    queryKey: ["journals", campaignId],
    queryFn: () => listFn({ data: { campaign_id: campaignId } }),
  });
  const delMutation = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["journals", campaignId] }); toast.success(t("Jurnal dihapus.", "Journal deleted.")); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto border-t border-border" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-background border-b border-border/60 px-5 py-3 flex items-center justify-between">
          <h3 className="font-extrabold text-foreground">{t("Jurnal Kampanye", "Campaign Journals")}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-muted grid place-items-center hover:bg-muted/70">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground text-center py-8">{t("Memuat…", "Loading…")}</p>}
          {!isLoading && entries && entries.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">{t("Belum ada jurnal.", "No journals yet.")}</p>
          )}
          {entries?.map((j) => (
            <article key={j.id} className="bg-surface rounded-2xl border border-border/60 overflow-hidden">
              {j.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-0.5">
                  {j.photos.slice(0, 4).map((src, i) => (
                    <img key={i} src={src} alt="" className="aspect-square w-full object-cover" />
                  ))}
                </div>
              )}
              <div className="p-3 space-y-1.5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {new Date(j.created_at).toLocaleString()}
                </p>
                <p className="text-xs font-semibold text-foreground">{j.menu}</p>
                <p className="text-[13px] font-serif text-foreground/80 leading-relaxed">{j.story}</p>
                <div className="flex items-center justify-between pt-1.5 text-[11px] text-muted-foreground">
                  <span>{j.attendance ? `${j.attendance} ${t("anak", "kids")}` : ""} {j.mood ? `· ${j.mood}` : ""}</span>
                  <button
                    onClick={() => { if (confirm(t("Hapus jurnal ini?", "Delete this journal?"))) delMutation.mutate(j.id); }}
                    className="text-accent font-semibold inline-flex items-center gap-1 hover:opacity-80"
                  >
                    <Trash2 className="w-3 h-3" /> {t("Hapus", "Delete")}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
