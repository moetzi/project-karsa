import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { PartyPopper, Upload, MapPin, TrendingUp, Clock, ArrowRight } from "lucide-react";

const INSPIRASI = [
  {
    id: "1",
    tag: "Kesehatan",
    title: "Dampak Stunting pada Fokus Belajar Anak",
    read: "6 menit",
    hero: "linear-gradient(135deg, #0D7377 0%, #2d5016 100%)",
    emoji: "🧠",
  },
  {
    id: "2",
    tag: "Gizi Lokal",
    title: "Inovasi Gizi Lokal: Pangan Desa untuk Nutrisi Sekolah",
    read: "8 menit",
    hero: "linear-gradient(135deg, #F47B20 0%, #c4654a 100%)",
    emoji: "🌽",
  },
  {
    id: "3",
    tag: "Kolaborasi",
    title: "Peran BUMDes & Kelompok Tani dalam Mendukung Gizi Anak",
    read: "5 menit",
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
  return (
    <PhoneShell>
      <div className="px-6 pt-4 pb-6 space-y-6">
        <header>
          <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">Senin, 21 Juni</p>
          <h1 className="mt-1 text-[28px] leading-tight font-extrabold text-foreground">
            Selamat pagi,<br />
            <span className="text-primary">Bu Sari</span> 🌱
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Mari lanjutkan misi gizi & literasi hari ini.
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
                Aksi Hari Ini
              </p>
              <h2 className="mt-1 text-[15px] font-bold text-foreground leading-snug">
                🎉 Target Terpenuhi!
              </h2>
              <p className="mt-1 text-[13px] text-foreground/80 leading-relaxed">
                Unggah foto makan bersama dan tulis jurnal hari ini untuk <span className="font-semibold">Desa Kolaka</span>.
              </p>
            </div>
          </div>
          <button className="mt-4 w-full bg-foreground text-background rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition">
            <Upload className="w-4 h-4" />
            Unggah Laporan
          </button>
        </section>

        {/* Active campaign widget */}
        <section className="bg-surface rounded-2xl p-5 border border-border/60">
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">
              Kampanye Aktif
            </p>
            <span className="text-[10px] font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded-full">
              56% terkumpul
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground">Gizi Sehat Desa Kolaka</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" /> SDN 047 Kolaka Utara
          </p>

          <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full progress-gradient rounded-full" style={{ width: "56%" }} />
          </div>
          <div className="mt-2 flex justify-between text-xs">
            <span className="font-mono font-semibold text-foreground">Rp 8.4jt</span>
            <span className="font-mono text-muted-foreground">dari Rp 15.0jt</span>
          </div>

          <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>+12 donatur minggu ini</span>
            </div>
            <span className="text-xs font-semibold text-primary">Lihat detail →</span>
          </div>
        </section>
      </div>
    </PhoneShell>
  );
}
