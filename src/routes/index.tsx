import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, GraduationCap, ShieldCheck, Loader2, X, Sprout, Users, TrendingUp } from "lucide-react";

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
            Portal Guru <span className="opacity-70 font-normal">(Masuk/Daftar)</span>
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

      {/* Cara Kerja */}
      <section id="cara" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">Cara Kerja</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Tiga langkah, dampak langsung</h2>
        </div>
        <div id="dampak" className="mt-12 grid md:grid-cols-3 gap-6">
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

      <footer className="border-t border-border/60 py-10 text-center text-xs text-muted-foreground">
        © 2026 Karsa · Untuk anak-anak Indonesia
      </footer>

      {portalOpen && <TeacherPortalModal onClose={() => setPortalOpen(false)} />}
    </div>
  );
}

function TeacherPortalModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [idType, setIdType] = useState<"NUPTK" | "PegID Kemenag">("NUPTK");
  const [idNumber, setIdNumber] = useState("");
  const [npsn, setNpsn] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate({ to: "/beranda" });
    }, 2000);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-md bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Portal Guru</h2>
          </div>
          <button onClick={onClose} disabled={loading} className="text-muted-foreground hover:text-foreground disabled:opacity-40">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <Loader2 className="w-10 h-10 mx-auto text-primary animate-spin" />
            <p className="mt-4 font-semibold">Memvalidasi data NUPTK & NPSN...</p>
            <p className="mt-2 text-xs text-muted-foreground">Menghubungi server Dapodik / Simpatika</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Masuk atau daftar dengan data institusional Anda. Hanya guru terverifikasi dapat membuat kampanye.
            </p>

            <div>
              <label className="text-xs font-semibold text-foreground/80">Tipe Identitas Guru</label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value as "NUPTK" | "PegID Kemenag")}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="NUPTK">NUPTK</option>
                <option value="PegID Kemenag">PegID Kemenag</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground/80">Nomor Identitas</label>
              <input
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                required
                inputMode="numeric"
                placeholder={idType === "NUPTK" ? "Contoh: 1234567890123456" : "Contoh: 198501012010012001"}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground/80">NPSN (Nomor Pokok Sekolah Nasional)</label>
              <input
                value={npsn}
                onChange={(e) => setNpsn(e.target.value)}
                required
                inputMode="numeric"
                maxLength={8}
                placeholder="Contoh: 40100123"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
                Sistem akan memvalidasi kecocokan data Anda dengan sekolah di database Dapodik/Simpatika.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-bold text-sm hover:opacity-95 transition inline-flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Verifikasi & Daftar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
