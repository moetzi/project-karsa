import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useState } from "react";
import {
  ShieldCheck, MapPin, Truck, ChevronRight, ThumbsUp, Info, Send, Hash,
  Eye, Repeat2, Share2, X, Link2, Check, Landmark,
  CalendarDays, Calendar, Wallet, Users, Phone, Sparkles,
} from "lucide-react";
import { useT } from "@/lib/i18n";
import { DonateSheet } from "@/components/DonateSheet";
import { useDonations } from "@/lib/donationStore";

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

const campaigns = [
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
    
    hero: "linear-gradient(135deg, #8a2a1a 0%, #d4842a 100%)",
    report: "linear-gradient(135deg, #2d5016 0%, #5a8a3d 100%)",
    teacher: "Pak Budi",
    journal: "Pagi tadi Robinson pingsan di kelas karena kelaparan. Bantuan Anda akan memberinya — dan teman-temannya — makanan bergizi akhir pekan ini.",
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
    hero: "linear-gradient(135deg, #2d5016 0%, #5a8a3d 100%)",
    report: "linear-gradient(135deg, #d4842a 0%, #c9614a 100%)",
    teacher: "Ibu Sari Dewi",
    journal: "Minggu lalu anak-anak sudah mulai mendapat asupan protein tambahan dari telur lokal. Senyum mereka adalah motivasi kami.",
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
    hero: "linear-gradient(135deg, #6b4423 0%, #c4654a 100%)",
    report: "linear-gradient(135deg, #2d5a3d 0%, #5a8a5c 100%)",
    teacher: "Pak Ridwan Saputra",
    journal: "Dengan dukungan petani lokal, kami kini bisa menyediakan sayuran segar setiap hari Senin dan Rabu untuk makan siang anak-anak.",
    boosts: 84,
    views: "836",
    shares: 211,
  },
];

function Feed() {
  return (
    <div className="space-y-5">
      {campaigns.map((c, i) => (
        <CampaignCard key={i} c={c} />
      ))}
    </div>
  );
}

function CampaignCard({ c }: { c: typeof campaigns[number] }) {
  const t = useT();
  const [boosted, setBoosted] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
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
      <div className="relative h-44 p-4 flex flex-col justify-between" style={{ background: c.hero }}>
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 bg-surface/95 text-primary text-[11px] font-semibold px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3 h-3" /> {t("Terverifikasi", "Verified")}
          </span>
        </div>
        <div className="text-primary-foreground">
          <h2 className="text-xl font-extrabold drop-shadow leading-tight">{c.title}</h2>
          <p className="text-xs flex items-center gap-1 mt-1 opacity-90">
            <MapPin className="w-3 h-3" /> {c.school}
          </p>
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
          <p className="text-[11px] text-muted-foreground mt-1.5">{t(`${pct}% terkumpul`, `${pct}% raised`)}</p>
        </div>


        <div className="mt-4 bg-primary-soft/40 rounded-xl p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
            {t("Jurnal Guru", "Teacher's Journal")} — {c.teacher.toUpperCase()}
          </p>
          <p className="font-serif italic text-[13px] text-foreground mt-2 leading-relaxed">
            "{c.journal}"
          </p>
        </div>

        <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span><span className="font-mono font-semibold text-foreground">{c.views}</span> {t("Views", "Views")}</span>
          </span>
          <span className="w-px h-3 bg-border" />
          <span className="inline-flex items-center gap-1.5">
            <Repeat2 className="w-3.5 h-3.5" />
            <span><span className="font-mono font-semibold text-foreground">{shares}</span> {t("Shares", "Shares")}</span>
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
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
      </div>

      {shareOpen && <ShareSheet title={c.title} onClose={() => setShareOpen(false)} />}
      {donateOpen && <DonateSheet campaign={{ id: c.id, title: c.title, school: c.school }} onClose={() => setDonateOpen(false)} />}
    </article>
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
  const [journal, setJournal] = useState("");

  // Disbursement & Accountability
  const [teacherBank, setTeacherBank] = useState("");
  const [teacherAccount, setTeacherAccount] = useState("");
  const [tmpGroup, setTmpGroup] = useState("");
  const [tmpPhone, setTmpPhone] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierGroup, setSupplierGroup] = useState("");

  const [menu, setMenu] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState(false);

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

  const valid = npsn && nama && sekolah && region && recipients && guru && target && deadline && desc && journal && teacherBank && teacherAccount && tmpGroup && tmpPhone;

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
          {t(". Dana hanya dapat dicairkan ke rekening pemasok lokal yang terdaftar.", ". Funds can only be disbursed to registered local supplier accounts.")}
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
        <FormField label={t("Jurnal Guru (Pembuka)", "Teacher's Journal (Opening)")} required>
          <textarea value={journal} onChange={(e) => setJournal(e.target.value)} rows={3}
            placeholder={t("Tuliskan catatan pertama Anda untuk para donatur...", "Write your first note to donors...")}
            className="w-full bg-primary-soft/30 rounded-xl px-4 py-3 text-sm text-foreground border border-primary/20 focus:border-primary outline-none resize-none font-serif italic placeholder:text-muted-foreground/70 placeholder:not-italic placeholder:font-sans" />
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
          <FormField label={t("No. WhatsApp Perwakilan", "Representative's WhatsApp No.")} required>
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
              {t("Jadwal Gizi Mingguan", "Weekly Meal Plan")}
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

      <button
        disabled={!valid}
        className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-95 transition"
      >
        <Send className="w-4 h-4" /> {t("Ajukan Kampanye", "Submit Campaign")}
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
