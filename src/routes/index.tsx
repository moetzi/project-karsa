import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, GraduationCap, ShieldCheck, X, Sprout, Users, TrendingUp, Clock, ArrowRight, BookOpen } from "lucide-react";
import { campaigns, CampaignCard } from "@/routes/nutrisi";
import { INSPIRASI } from "@/lib/inspirasi";
import { IndonesiaImpactMap } from "@/components/IndonesiaImpactMap";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Karsa — Akhiri Stunting, Mulai dari Sekolah" },
      { name: "description", content: "Dukung gerakan guru Indonesia memberi gizi sehat untuk anak-anak di pelosok. Donasi transparan, dampak nyata." },
      { property: "og:title", content: "Karsa — Akhiri Stunting, Mulai dari Sekolah" },
      { property: "og:description", content: "Donasi transparan untuk kampanye gizi sekolah yang dipimpin langsung oleh guru terverifikasi." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [portalOpen, setPortalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <Sprout className="w-4 h-4" />
            </span>
            <span className="text-lg">Karsa</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#dampak" className="hover:text-foreground">Dampak</a>
            <a href="#cara" className="hover:text-foreground">Cara Kerja</a>
            <Link to="/nutrisi" className="hover:text-foreground">Kampanye</Link>
          </nav>
          <button
            onClick={() => setPortalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
          >
            <GraduationCap className="w-4 h-4" />
            Portal Guru <span className="opacity-70 font-normal">{"\n"}</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(80% 60% at 20% 0%, oklch(0.94 0.06 160) 0%, transparent 60%), radial-gradient(60% 50% at 100% 20%, oklch(0.94 0.08 60) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary px-3 py-1 text-xs font-mono font-semibold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" /> Diverifikasi NUPTK & Dapodik
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Akhiri stunting.<br />
              <span className="text-primary">Mulai dari ruang kelas.</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Setiap rupiah donasi Anda langsung menjadi sepiring nasi panas, ikan segar, dan sayur kebun
              untuk anak-anak Indonesia di pelosok — dikelola oleh guru-guru terverifikasi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/nutrisi"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3.5 text-sm font-bold hover:opacity-95 transition shadow-lg shadow-primary/20"
              >
                <Heart className="w-4 h-4" /> Mulai Berdonasi
              </Link>
              <a
                href="#cara"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-semibold hover:bg-muted transition"
              >
                Lihat Cara Kerja
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { v: "12.4k", l: "Anak terbantu" },
                { v: "284", l: "Guru aktif" },
                { v: "98%", l: "Dana tersalur" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="text-2xl font-extrabold font-mono">{s.v}</dt>
                  <dd className="text-xs text-muted-foreground mt-1">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-border/60"
                 style={{ background: "linear-gradient(135deg, #0D7377 0%, #2d5016 100%)" }}>
              <div className="h-full w-full grid place-items-center text-7xl">🌱</div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-surface rounded-2xl border border-border/60 shadow-lg p-4 max-w-[220px]">
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">Kampanye Aktif</p>
              <p className="mt-1 text-sm font-bold leading-snug">Gizi Sehat Desa Kolaka</p>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-accent" style={{ width: "56%" }} />
              </div>
              <p className="mt-1 text-[10px] font-mono text-muted-foreground">56% dari Rp 15jt</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dampak — Dashboard sebaran */}
      <section id="dampak" className="max-w-6xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">Dampak Karsa</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Sebaran kampanye di seluruh Nusantara</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Setiap titik bercahaya adalah seorang guru Karsa yang sedang memimpin kampanye gizi di provinsinya. Hover pada titik untuk melihat detail.
          </p>
        </div>
        <div className="mt-10">
          <IndonesiaImpactMap />
        </div>
      </section>

      {/* Cara Kerja */}
      <section id="cara" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">Cara Kerja</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Tiga langkah, dampak langsung</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { icon: Users, t: "Guru mengajukan", d: "Guru terverifikasi NUPTK/PegID membuat kampanye spesifik untuk muridnya." },
            { icon: Heart, t: "Donatur memberi", d: "Anda berdonasi langsung ke kampanye yang transparan, tanpa potongan platform." },
            { icon: TrendingUp, t: "Dampak terlapor", d: "Foto, struk belanja, dan jurnal harian dikirim guru langsung ke dashboard." },
          ].map((s) => (
            <div key={s.t} className="bg-surface rounded-2xl border border-border/60 p-6">
              <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary grid place-items-center">
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 font-bold text-lg">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kampanye Aktif */}
      <section id="kampanye" className="max-w-6xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">Kampanye Aktif</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Pilih kampanye yang ingin kamu dukung</h2>
          </div>
          <Link to="/nutrisi" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-80">
            Lihat semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} c={c} />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link to="/nutrisi" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Lihat semua kampanye <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Pojok Inspirasi */}
      <section id="inspirasi" className="max-w-6xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">Pojok Inspirasi Guru</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Bacaan pilihan untuk donatur</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">Pahami konteks gizi anak Indonesia & dampak nyata dari donasi Anda.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {INSPIRASI.map((a) => (
            <Link
              key={a.id}
              to="/inspirasi/$id"
              params={{ id: a.id }}
              className="group bg-surface rounded-2xl border border-border/60 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="relative h-44 sm:h-48 overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title.id}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 bg-surface/95 backdrop-blur text-primary text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  {a.tag.id}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="flex-1 font-serif text-base leading-snug text-foreground line-clamp-3">{a.title.id}</h3>
                <div className="mt-auto pt-4 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-muted-foreground inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {a.read.id}
                  </span>
                  <span className="text-accent font-semibold inline-flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                    <BookOpen className="w-3 h-3" /> Baca
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 py-10 text-center text-xs text-muted-foreground">
        © 2026 Karsa · Untuk anak-anak Indonesia
      </footer>

      {portalOpen && <TeacherPortalModal onClose={() => setPortalOpen(false)} />}
    </div>
  );
}

function TeacherPortalModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-md bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Portal Guru</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Hanya guru terverifikasi (NUPTK / PegID + NPSN) yang dapat membuat kampanye.
          </p>
          <button
            onClick={() => { onClose(); navigate({ to: "/auth" }); }}
            className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-bold text-sm hover:opacity-95 transition inline-flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> Masuk / Daftar
          </button>
        </div>

      </div>
    </div>
  );
}

