import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, BookOpen, Sprout } from "lucide-react";
import { useEffect, useState } from "react";
import { INSPIRASI } from "@/lib/inspirasi";

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      setProgress(height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 h-1 bg-transparent pointer-events-none"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full progress-gradient transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}


export const Route = createFileRoute("/inspirasi/$id")({
  head: () => ({
    meta: [
      { title: "Pojok Inspirasi Guru — Karsa" },
      { name: "description", content: "Artikel inspiratif untuk guru tentang gizi & tumbuh kembang anak." },
    ],
  }),
  component: Article,
});

type ArticleData = {
  title: string;
  kicker: string;
  read: string;
  hero: string;
  emoji: string;
  body: string[];
};

const ARTICLES: Record<string, ArticleData> = {
  "1": {
    title: "Dampak Stunting pada Fokus Belajar Anak",
    kicker: "Kesehatan & Kognisi",
    read: "6 menit baca",
    hero: "linear-gradient(135deg, #0D7377 0%, #2d5016 100%)",
    emoji: "🧠",
    body: [
      "Stunting bukan sekadar masalah tinggi badan. Ia adalah cerminan dari ribuan hari pertama kehidupan seorang anak — masa ketika otak tumbuh paling cepat dan paling rentan.",
      "Penelitian menunjukkan anak dengan stunting cenderung memiliki rentang fokus yang lebih pendek, daya ingat kerja yang lebih rendah, dan kesulitan memproses informasi baru. Di kelas, ini terlihat sebagai 'anak yang mudah lelah', 'sulit konsentrasi', atau 'lambat memahami'.",
      "Sebagai guru, kita berada di garis depan. Kita melihat dampaknya setiap hari — dan kita juga bagian dari solusinya. Memastikan satu kali makan bergizi di sekolah dapat memutus siklus ini perlahan, satu anak demi satu anak.",
      "Mari bergerak bersama. Setiap suapan adalah investasi pada masa depan bangsa.",
    ],
  },
  "2": {
    title: "Inovasi Gizi Lokal: Memanfaatkan Pangan Desa untuk Nutrisi Sekolah",
    kicker: "Praktik Lapangan",
    read: "8 menit baca",
    hero: "linear-gradient(135deg, #F47B20 0%, #c4654a 100%)",
    emoji: "🌽",
    body: [
      "Daun kelor, ikan teri, telur ayam kampung, ubi ungu — kekayaan pangan desa kita seringkali lebih bergizi daripada produk impor yang mahal.",
      "Di Sulawesi Tenggara, sekelompok guru bekerja sama dengan kelompok tani lokal untuk mengganti susu kemasan dengan menu telur rebus dan tumis kelor. Hasilnya: biaya turun 40%, asupan protein anak naik dua kali lipat.",
      "Kuncinya adalah kolaborasi. Mulailah dengan memetakan pangan unggulan desa Anda, lalu rancang menu mingguan yang variatif dan terjangkau.",
      "Gizi lokal bukan hanya soal nutrisi — ini juga tentang menghidupkan ekonomi desa.",
    ],
  },
  "3": {
    title: "Kolaborasi Desa: Mengenal Peran BUMDes & Kelompok Tani",
    kicker: "Ekosistem Komunitas",
    read: "5 menit baca",
    hero: "linear-gradient(135deg, #6b4423 0%, #c9614a 100%)",
    emoji: "🤝",
    body: [
      "BUMDes (Badan Usaha Milik Desa) adalah lengan ekonomi desa yang bisa menjadi mitra strategis sekolah. Mereka punya akses ke petani, peternak, dan nelayan lokal.",
      "Dengan menjalin kerja sama formal, sekolah dapat memperoleh pasokan bahan pangan segar secara rutin, dengan harga yang adil bagi produsen lokal.",
      "Kelompok Tani dan Nelayan juga punya peran penting: mereka memastikan keberlanjutan pasokan dan menjaga kualitas hasil panen.",
      "Mulailah dengan pertemuan sederhana. Undang perwakilan BUMDes ke sekolah, presentasikan kebutuhan gizi siswa, dan bangun MOU yang saling menguntungkan.",
    ],
  },
};

function Article() {
  const { id } = Route.useParams();
  const a = ARTICLES[id] ?? ARTICLES["1"];
  const others = INSPIRASI.filter((x) => x.id !== id);
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setHeroReady(true));
    return () => cancelAnimationFrame(raf);
  }, [id]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgress />

      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <Sprout className="w-4 h-4" />
            </span>
            <span className="text-lg">Karsa</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: heroReady ? a.hero : undefined }}
      >
        {/* Skeleton shimmer while hero gradient mounts */}
        <div
          aria-hidden
          className={
            "absolute inset-0 bg-muted animate-pulse transition-opacity duration-500 " +
            (heroReady ? "opacity-0" : "opacity-100")
          }
        />
        <div
          className={
            "absolute inset-0 opacity-20 transition-opacity duration-700 " +
            (heroReady ? "opacity-20" : "opacity-0")
          }
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.25) 0%, transparent 50%)",
          }}
        />
        <div
          className={
            "relative max-w-3xl mx-auto px-6 sm:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32 text-primary-foreground transition-opacity duration-500 " +
            (heroReady ? "opacity-100 animate-fade-in" : "opacity-0")
          }
        >
          <div className="text-5xl sm:text-6xl mb-5 drop-shadow-lg">{a.emoji}</div>

          <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] opacity-90">
            {a.kicker}
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight drop-shadow-sm">
            {a.title}
          </h1>
          <div className="mt-6 flex items-center gap-4 font-mono text-[11px] sm:text-xs uppercase tracking-widest opacity-90">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {a.read}
            </span>
            <span className="opacity-60">•</span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Inspirasi Guru
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16 lg:py-20 animate-fade-in">
        <article className="font-serif text-[17px] sm:text-[19px] leading-[1.8] text-foreground space-y-6">
          {a.body.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "first-letter:text-6xl sm:first-letter:text-7xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none first-letter:font-serif"
                  : ""
              }
            >
              {p}
            </p>
          ))}
        </article>

        <div className="mt-12 rounded-2xl p-6 sm:p-8 bg-primary-soft/50 border border-primary/10 animate-fade-in">
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary font-bold">
            Aksi Selanjutnya
          </p>
          <p className="font-serif italic text-base sm:text-lg text-foreground mt-2 leading-relaxed">
            "Setiap hari adalah kesempatan baru untuk mengubah hidup seorang anak."
          </p>
        </div>
      </section>

      {/* More articles */}
      {others.length > 0 && (
        <section className="border-t border-border/60 bg-surface/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
              Bacaan Lainnya
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Jelajahi inspirasi lain
            </h2>
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              {others.map((o) => (
                <Link
                  key={o.id}
                  to="/inspirasi/$id"
                  params={{ id: o.id }}
                  className="group bg-surface rounded-2xl border border-border/60 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex"
                >
                  <div
                    className="relative w-32 sm:w-40 shrink-0 flex items-end p-4"
                    style={{ background: o.hero }}
                  >
                    <span className="absolute top-3 right-3 text-2xl drop-shadow">{o.emoji}</span>
                    <span className="bg-surface/95 backdrop-blur text-primary text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {o.tag.id}
                    </span>
                  </div>
                  <div className="flex-1 p-4 sm:p-5 flex flex-col">
                    <h3 className="font-serif text-base sm:text-lg leading-snug text-foreground line-clamp-3 group-hover:text-primary transition-colors">
                      {o.title.id}
                    </h3>
                    <div className="mt-auto pt-3 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-muted-foreground inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {o.read.id}
                      </span>
                      <span className="text-accent font-semibold inline-flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                        <BookOpen className="w-3 h-3" /> Baca
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-border/60 py-10 text-center text-xs text-muted-foreground">
        © 2026 Karsa · Untuk anak-anak Indonesia
      </footer>
    </div>
  );
}
