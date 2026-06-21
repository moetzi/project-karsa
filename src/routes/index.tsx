import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { PartyPopper, Upload, MapPin, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";

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

        {/* Pojok Inspirasi Guru */}
        <section className="-mx-6">
          <div className="px-6 flex items-end justify-between mb-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">
                Pojok Inspirasi Guru
              </p>
              <h2 className="mt-0.5 text-[18px] font-extrabold text-foreground">Bacaan Pilihan</h2>
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">3 artikel</span>
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
                        {a.tag}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-serif text-[14px] leading-snug text-foreground line-clamp-3 min-h-[3.6em]">
                        {a.title}
                      </h3>
                      <div className="mt-2.5 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-muted-foreground inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {a.read}
                        </span>
                        <span className="text-accent font-semibold inline-flex items-center gap-0.5">
                          Baca <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
