import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useState } from "react";
import { ShieldCheck, MapPin, Truck, ChevronRight, ThumbsUp, Info, Send, Hash, Eye, Repeat2, Share2, X, Link2, Check } from "lucide-react";

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
  const [tab, setTab] = useState<Tab>("feed");
  return (
    <PhoneShell>
      <div className="px-6 pt-4 pb-6">
        <h1 className="text-[28px] font-extrabold text-foreground">Gizi & Kampanye</h1>

        <div className="mt-5 bg-muted/70 rounded-2xl p-1 grid grid-cols-2 gap-1">
          <button
            onClick={() => setTab("feed")}
            className={
              "py-2.5 rounded-xl text-sm font-semibold transition-all " +
              (tab === "feed" ? "bg-surface text-primary shadow-sm" : "text-muted-foreground")
            }
          >
            Feed Publik
          </button>
          <button
            onClick={() => setTab("buat")}
            className={
              "py-2.5 rounded-xl text-sm font-semibold transition-all " +
              (tab === "buat" ? "bg-surface text-primary shadow-sm" : "text-muted-foreground")
            }
          >
            + Buat Kampanye
          </button>
        </div>

        <div className="mt-6">
          {tab === "feed" ? <Feed /> : <BuatKampanye />}
        </div>
      </div>
    </PhoneShell>
  );
}

const campaigns = [
  {
    title: "Gizi Sehat Desa Kolaka",
    school: "SDN 047 Kolaka Utara",
    recipients: 47,
    supplier: "BUMDes Maju Bersama",
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
    title: "Pangan Bergizi Kampung Baru",
    school: "SDN 013 Mahakam Ulu",
    recipients: 63,
    supplier: "Kelompok Tani Harapan Jaya",
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
  const [boosted, setBoosted] = useState(false);
  const boosts = c.boosts + (boosted ? 1 : 0);
  return (
    <article className="bg-surface rounded-2xl overflow-hidden border border-border/60">
      {/* Hero */}
      <div className="relative h-44 p-4 flex flex-col justify-between" style={{ background: c.hero }}>
        <span className="self-start inline-flex items-center gap-1.5 bg-surface/95 text-primary text-[11px] font-semibold px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3 h-3" /> Terverifikasi
        </span>
        <div className="text-primary-foreground">
          <h2 className="text-xl font-extrabold drop-shadow leading-tight">{c.title}</h2>
          <p className="text-xs flex items-center gap-1 mt-1 opacity-90">
            <MapPin className="w-3 h-3" /> {c.school}
          </p>
        </div>
      </div>

      <div className="p-4">
        {/* Meta grid */}
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs items-center pb-3 border-b border-border/60">
          <div className="text-center">
            <p className="font-bold text-lg text-foreground leading-none">{c.recipients}</p>
            <p className="text-[10px] text-muted-foreground">Penerima</p>
          </div>
          <div className="text-[11px] space-y-0.5">
            <p className="flex items-center gap-1.5"><Truck className="w-3 h-3 text-primary" /><span className="text-muted-foreground">Pemasok:</span> <span className="font-semibold text-foreground">{c.supplier}</span></p>
            <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-primary" /><span className="text-foreground">{c.region}</span></p>
          </div>
        </div>

        {/* Funding */}
        <div className="pt-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-mono font-bold text-foreground">Rp {c.raised}jt</span>
            <span className="font-mono text-muted-foreground">dari Rp {c.target}jt</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full progress-gradient rounded-full" style={{ width: `${c.pct}%` }} />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5">{c.pct}% terkumpul</p>
        </div>

        {/* Transparency report */}
        <div className="mt-4 pt-4 border-t border-border/60">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" /> Laporan Transparansi
          </p>
          <div className="mt-2 relative rounded-xl overflow-hidden h-32" style={{ background: c.report }}>
            <span className="absolute top-2 right-2 bg-foreground/70 text-background text-[10px] font-semibold px-2 py-1 rounded-full">
              Ketuk untuk lanjut
            </span>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {[0, 1, 2, 3].map((d) => (
                <span key={d} className={"h-1 rounded-full " + (d === 0 ? "w-6 bg-white" : "w-1.5 bg-white/50")} />
              ))}
            </div>
          </div>
        </div>

        {/* Teacher journal */}
        <div className="mt-4 bg-primary-soft/40 rounded-xl p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
            Jurnal Guru — {c.teacher.toUpperCase()}
          </p>
          <p className="font-serif italic text-[13px] text-foreground mt-2 leading-relaxed">
            "{c.journal}"
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setBoosted((b) => !b)}
            className={
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold border transition-colors " +
              (boosted
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-muted/60 text-foreground border-border")
            }
          >
            <ThumbsUp className="w-4 h-4" /> Boost <span className="font-mono">{boosts}</span>
          </button>
          <button className="text-primary font-semibold text-sm inline-flex items-center gap-1">
            Donasi <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

const SUPPLIERS = [
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

function BuatKampanye() {
  const [supplier, setSupplier] = useState("");
  const [npsn, setNpsn] = useState("");
  const [nama, setNama] = useState("");
  const [sekolah, setSekolah] = useState("");
  const [region, setRegion] = useState("");
  const [recipients, setRecipients] = useState("");
  const [guru, setGuru] = useState("");
  const [target, setTarget] = useState("");
  const [desc, setDesc] = useState("");
  const [journal, setJournal] = useState("");
  const [lainnya, setLainnya] = useState("");
  const showLainnya = supplier === "Lainnya (Kios/UMKM)";
  const valid =
    npsn && nama && sekolah && region && recipients && guru &&
    supplier && target && desc && journal && (!showLainnya || lainnya);

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-4 text-xs leading-relaxed flex items-start gap-2.5"
        style={{ background: "oklch(0.94 0.04 215)", border: "1px solid oklch(0.85 0.06 215)" }}
      >
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-foreground/85">
          Kampanye akan diverifikasi menggunakan <span className="font-semibold">NPSN resmi sekolah</span>. Dana hanya dapat dicairkan ke rekening pemasok lokal yang terdaftar.
        </p>
      </div>

      <div className="bg-surface rounded-2xl p-5 border border-border/60 space-y-4">
        <FormField label="NPSN (ID Sekolah)" required>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={npsn}
              onChange={(e) => setNpsn(e.target.value)}
              placeholder="cth. 10200101"
              className="w-full bg-muted/60 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70"
            />
          </div>
        </FormField>

        <FormField label="Nama Kampanye" required>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="cth. Gizi Sehat Desa Kolaka 2025"
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70"
          />
        </FormField>

        <FormField label="Nama Sekolah" required>
          <input
            value={sekolah}
            onChange={(e) => setSekolah(e.target.value)}
            placeholder="cth. SDN 047 Kolaka Utara"
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70"
          />
        </FormField>

        <FormField label="Provinsi" required>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground appearance-none border border-transparent focus:border-primary outline-none"
          >
            <option value="">Pilih provinsi...</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Jumlah Penerima (Siswa)" required>
          <input
            value={recipients}
            onChange={(e) => setRecipients(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            placeholder="cth. 47"
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm font-mono text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70"
          />
        </FormField>

        <FormField label="Nama Guru Penanggung Jawab" required>
          <input
            value={guru}
            onChange={(e) => setGuru(e.target.value)}
            placeholder="cth. Ibu Sari Dewi"
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70"
          />
        </FormField>

        <FormField label="Pilih Pemasok/Merchant Lokal" required>
          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground appearance-none border border-transparent focus:border-primary outline-none"
          >
            <option value="">Pilih pemasok lokal...</option>
            {SUPPLIERS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </FormField>

        {showLainnya && (
          <FormField label="Sebutkan nama merchant" required>
            <input
              value={lainnya}
              onChange={(e) => setLainnya(e.target.value)}
              placeholder="cth. Kios Bu Tini, Warung Berkah..."
              className="w-full bg-accent-soft/40 rounded-xl px-4 py-3 text-sm text-foreground border border-accent/40 focus:border-accent outline-none placeholder:text-muted-foreground/70"
            />
          </FormField>
        )}

        <FormField label="Target Dana (IDR)" required>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-mono font-semibold text-foreground">Rp</span>
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              placeholder="15000000"
              className="w-full bg-muted/60 rounded-xl pl-12 pr-4 py-3 text-sm font-mono text-foreground border border-transparent focus:border-primary outline-none placeholder:text-muted-foreground/70"
            />
          </div>
        </FormField>

        <FormField label="Deskripsi Kampanye" required>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            placeholder="Ceritakan kondisi anak-anak di sekolah Anda dan bagaimana dana ini akan digunakan untuk mencegah stunting..."
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground border border-transparent focus:border-primary outline-none resize-none placeholder:text-muted-foreground/70"
          />
        </FormField>

        <FormField label="Jurnal Guru (Pembuka)" required>
          <textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            rows={3}
            placeholder="Tuliskan catatan pertama Anda untuk para donatur..."
            className="w-full bg-primary-soft/30 rounded-xl px-4 py-3 text-sm text-foreground border border-primary/20 focus:border-primary outline-none resize-none font-serif italic placeholder:text-muted-foreground/70 placeholder:not-italic placeholder:font-sans"
          />
        </FormField>

        <button
          disabled={!valid}
          className="w-full bg-accent text-accent-foreground rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-95 transition"
        >
          <Send className="w-4 h-4" /> Ajukan Kampanye
        </button>
      </div>
    </div>
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
