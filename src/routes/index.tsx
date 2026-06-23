import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, GraduationCap, ShieldCheck, X, Sprout, Users, TrendingUp, Clock, BookOpen, Brain, HeartHandshake, WifiOff, MapPin, FileCheck2, Camera, Receipt, ChevronDown } from "lucide-react";
import { campaigns, CampaignCard } from "@/routes/nutrisi";
import { INSPIRASI } from "@/lib/inspirasi";
import { IndonesiaImpactMap } from "@/components/IndonesiaImpactMap";
import { useClosedMap } from "@/lib/campaignStatusStore";

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
  const closedMap = useClosedMap();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <Sprout className="w-4 h-4" />
            </span>
            <span className="text-lg">Karsa</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#tentang" className="hover:text-foreground">Tentang</a>
            <a href="#cara" className="hover:text-foreground">Cara Kerja</a>
            <a href="#dampak" className="hover:text-foreground">Dampak</a>
            <a href="#kampanye" className="hover:text-foreground">Kampanye</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
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
              Di pelosok negeri,<br />
              <span className="text-primary">seorang guru menolak menyerah.</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Mereka tahu nama setiap muridnya. Mereka tahu siapa yang datang ke sekolah dengan perut kosong.
              Karsa berdiri di samping mereka — agar setiap rupiah donasi Anda berubah menjadi sepiring makanan
              hangat hari ini, bukan janji bertahun kemudian.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#kampanye"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3.5 text-sm font-bold hover:opacity-95 transition shadow-lg shadow-primary/20"
              >
                <Heart className="w-4 h-4" /> Mulai Berdonasi
              </a>
              <a
                href="#cara"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-semibold hover:bg-muted transition"
              >
                Lihat Cara Kerja
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {(() => {
                // Anak terbantu = total penerima dari kampanye yang selesai (pct≥100 atau ditutup guru via jurnal penutup).
                const completed = campaigns.filter((c) => c.pct >= 100 || closedMap[c.id]);
                const recipients = completed.reduce((s, c) => s + c.recipients, 0);
                // Guru aktif = semua guru yang berhasil login di PWA (data statistik provinsi)
                const teachers = 142;
                const completedRaised = completed.reduce((s, c) => s + (closedMap[c.id] ? c.target : c.raised), 0);
                const completedTarget = completed.reduce((s, c) => s + c.target, 0);
                const dana = completedTarget > 0 ? Math.min(100, Math.round((completedRaised / completedTarget) * 100)) : 0;
                return [
                  { v: recipients.toLocaleString("id-ID"), l: "Anak terbantu" },
                  { v: teachers.toLocaleString("id-ID"), l: "Guru aktif" },
                  { v: `${dana}%`, l: "Dana tersalur" },
                ];
              })().map((s) => (
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

      {/* Tentang Karsa */}
      <section id="tentang" className="max-w-6xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">Tentang Karsa</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
              Bukan platform donasi biasa.<br />
              <span className="text-primary">Ini ruang kerja para guru.</span>
            </h2>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              Karsa adalah aplikasi web (PWA) ringan yang dirancang khusus untuk guru-guru di
              wilayah <span className="font-semibold text-foreground">Terdepan, Terluar, dan Tertinggal (3T)</span> —
              tempat sinyal sering hilang, perangkat terbatas, dan satu guru sering menanggung
              banyak peran sekaligus.
            </p>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Kami percaya orang yang paling tahu kebutuhan seorang anak adalah gurunya sendiri.
              Maka kami serahkan kendalinya: guru yang mengajukan, guru yang membelanjakan,
              guru yang melaporkan. Karsa hanya menyediakan jembatan paling pendek antara
              niat baik Anda dan piring murid mereka.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-surface rounded-2xl border border-border/60 p-5">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary grid place-items-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="mt-3 font-bold">Kampanye Anti Stunting</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Guru menggalang dana mikro untuk makan bergizi di sekolahnya, dengan laporan
                transparan yang bisa dipantau siapa pun.
              </p>
            </div>
            <div className="bg-surface rounded-2xl border border-border/60 p-5">
              <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent grid place-items-center">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="mt-3 font-bold">Edu Co-pilot</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Pendamping mengajar berbasis AI: RPP, flashcard, dan materi yang bisa diunduh
                dan tetap berfungsi tanpa internet.
              </p>
            </div>
            <div className="bg-surface rounded-2xl border border-border/60 p-5">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary grid place-items-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="mt-3 font-bold">Identitas Terverifikasi</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Setiap guru divalidasi lewat NUPTK/PegID + NPSN. Tidak ada akun anonim,
                tidak ada kampanye fiktif.
              </p>
            </div>
            <div className="bg-surface rounded-2xl border border-border/60 p-5">
              <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent grid place-items-center">
                <WifiOff className="w-5 h-5" />
              </div>
              <h3 className="mt-3 font-bold">Dibuat untuk Sinyal Tipis</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Hemat data, bisa dipasang di layar utama, dan tetap bisa diakses
                meski koneksi datang dan pergi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cara Kerja */}
      <section id="cara" className="max-w-6xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">Cara Kerja</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
            Dari niat baik Anda ke piring anak-anak — dalam lima langkah jelas.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Kami sengaja membuat alurnya pendek dan mudah dipantau, agar setiap donasi
            bisa Anda ikuti hingga benar-benar menjadi makanan di meja kelas.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { icon: ShieldCheck, t: "1. Verifikasi guru", d: "Identitas guru divalidasi lewat NUPTK/PegID dan NPSN sekolahnya sebelum bisa membuat kampanye." },
            { icon: FileCheck2, t: "2. Kampanye dibuka", d: "Guru menulis cerita murid-muridnya, kebutuhan gizi, target dana, dan jumlah anak yang akan terbantu." },
            { icon: Heart, t: "3. Anda berdonasi", d: "Donasi mengalir langsung ke kampanye pilihan Anda — tanpa potongan platform, sekecil apa pun nominalnya." },
            { icon: Receipt, t: "4. Guru belanja", d: "Guru membeli bahan makanan ke pemasok lokal terdekat dan menyimpan bukti belanja atau bukti makan bersama." },
            { icon: Camera, t: "5. Jurnal terbuka", d: "Foto, deskripsi alokasi, dan kesan anak-anak diunggah ke jurnal dan dipublikasikan otomatis untuk semua orang." },
          ].map((s) => (
            <div key={s.t} className="bg-surface rounded-2xl border border-border/60 p-5">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary grid place-items-center">
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 font-bold text-[15px] leading-snug">{s.t}</h3>
              <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-border/60 bg-primary-soft/40 p-6 text-center">
          <p className="text-sm text-foreground leading-relaxed max-w-3xl mx-auto">
            <span className="font-bold">Komitmen kami:</span> 100% donasi Anda sampai ke kampanye.
            Karsa tidak memotong biaya platform. Biaya operasional kami ditanggung terpisah oleh mitra,
            agar setiap rupiah benar-benar bekerja untuk anak-anak.
          </p>
        </div>
      </section>

      {/* Kampanye Aktif */}
      <section id="kampanye" className="max-w-6xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">Kampanye Aktif</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Pilih satu kelas. Ubah satu cerita.</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">Setiap kampanye di bawah ini ditulis sendiri oleh guru yang mengenal nama setiap muridnya.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(() => {
            const sorted = [...campaigns].sort((a, b) => {
              const aDone = a.pct >= 100 ? 1 : 0;
              const bDone = b.pct >= 100 ? 1 : 0;
              if (aDone !== bDone) return aDone - bDone;
              return b.boosts - a.boosts;
            });
            return sorted.map((c) => <CampaignCard key={c.id} c={c} />);
          })()}
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

      {/* FAQ */}
      <section id="faq" className="max-w-5xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">Pertanyaan yang sering ditanyakan</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Hal yang mungkin ingin Anda tahu sebelum ikut</h2>
          <p className="mt-3 text-sm text-muted-foreground">Pilih sudut pandang Anda — kami siapkan jawaban yang berbeda untuk donatur dan guru.</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-10">
          {/* Donatur */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary grid place-items-center">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-lg">Untuk Donatur</h3>
            </div>
            <div className="space-y-3">
              {[
                {
                  q: "Apakah benar 100% donasi saya sampai ke anak-anak?",
                  a: "Ya. Karsa tidak memotong biaya platform sama sekali. Yang Anda transfer adalah yang dibelanjakan guru. Biaya operasional kami ditanggung mitra di luar kanal donasi.",
                },
                {
                  q: "Bagaimana saya bisa yakin uangnya tidak disalahgunakan?",
                  a: "Setiap kampanye dibuat oleh guru yang identitasnya sudah diverifikasi (NUPTK/PegID + NPSN). Guru wajib mengunggah jurnal berisi foto bukti belanja atau bukti makan bersama, foto makanan, deskripsi alokasi, dan kesan murid — semuanya bisa Anda baca langsung di halaman kampanye.",
                },
                {
                  q: "Berapa donasi minimum?",
                  a: "Tidak ada minimum yang menyakitkan. Mulai dari nominal yang Anda nyaman — bahkan Rp 10.000 sudah cukup untuk satu porsi makan bergizi di banyak daerah.",
                },
                {
                  q: "Apakah saya dapat bukti donasi?",
                  a: "Ya. Anda akan menerima konfirmasi donasi, dan ketika jurnal kampanye diperbarui, laporannya bisa diakses publik — termasuk oleh Anda.",
                },
                {
                  q: "Apakah saya bisa memilih kampanye tertentu?",
                  a: "Tentu. Anda bebas memilih kampanye di provinsi atau sekolah yang dekat di hati Anda — bukan dana umum yang acak.",
                },
              ].map((f, i) => (
                <FaqItem key={i} q={f.q} a={f.a} />
              ))}
            </div>
          </div>

          {/* Guru */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent grid place-items-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-lg">Untuk Guru</h3>
            </div>
            <div className="space-y-3">
              {[
                {
                  q: "Siapa yang boleh membuat kampanye di Karsa?",
                  a: "Guru aktif di Indonesia yang memiliki NUPTK atau PegID dan terdaftar di sekolah ber-NPSN. Verifikasi dilakukan sebelum kampanye pertama Anda terbit.",
                },
                {
                  q: "Apa saja yang perlu saya laporkan?",
                  a: "Cukup unggah foto bukti belanja (struk/nota) atau bukti makan bersama dan foto makanan yang dibuat. Lalu isi jurnal dengan deskripsi alokasi pengeluaran, tanggal, serta kesan anak yang terbantu. Tidak perlu laporan formal yang panjang.",
                },
                {
                  q: "Apakah saya butuh internet stabil?",
                  a: "Tidak. Karsa adalah aplikasi web yang ringan, bisa dipasang di layar utama HP, dan banyak fitur — termasuk materi Edu Co-pilot — tetap bisa diakses tanpa koneksi.",
                },
                {
                  q: "Apakah ada biaya bagi guru?",
                  a: "Tidak ada. Karsa gratis untuk guru, baik untuk membuka kampanye gizi maupun memakai Edu Co-pilot.",
                },
                {
                  q: "Bagaimana jika target donasi tidak tercapai?",
                  a: "Dana yang sudah terkumpul tetap bisa Anda salurkan untuk anak-anak sesuai skala yang memungkinkan. Yang penting setiap rupiah tetap tercatat dan terlapor di jurnal.",
                },
              ].map((f, i) => (
                <FaqItem key={i} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA terakhir */}
        <div className="mt-16 rounded-3xl border border-border/60 bg-surface p-8 md:p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Satu donasi hari ini = satu piring nasi panas besok.
          </h3>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Anak-anak di pelosok tidak butuh janji besar. Mereka butuh sarapan. Guru mereka sudah hadir setiap pagi —
            sekarang giliran kita berdiri di samping mereka.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <a
              href="#kampanye"
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3.5 text-sm font-bold hover:opacity-95 transition shadow-lg shadow-primary/20"
            >
              <Heart className="w-4 h-4" /> Donasi sekarang
            </a>
            <button
              onClick={() => setPortalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold hover:bg-muted transition"
            >
              <GraduationCap className="w-4 h-4" /> Saya seorang guru
            </button>
          </div>
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


function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-surface rounded-2xl border border-border/60 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/40 transition"
        aria-expanded={open}
      >
        <span className="font-semibold text-[14px] leading-snug">{q}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 -mt-1 text-[13px] text-muted-foreground leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}
