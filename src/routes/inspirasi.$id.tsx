import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, BookOpen, Sprout, ExternalLink, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { INSPIRASI } from "@/lib/inspirasi";
import articleStunting from "@/assets/article-stunting.jpg";
import articleGiziLokal from "@/assets/article-gizi-lokal.jpg";
import articleBumdes from "@/assets/article-bumdes.jpg";

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
      { name: "description", content: "Artikel inspiratif berbasis bukti untuk guru tentang gizi & tumbuh kembang anak Indonesia." },
    ],
  }),
  component: Article,
});

type Section =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "stat"; value: string; label: string; cite?: string }
  | { kind: "quote"; text: string; by: string }
  | { kind: "figure"; src: string; alt: string; caption: string };

type Source = { label: string; org: string; url: string };

type ArticleData = {
  title: string;
  kicker: string;
  read: string;
  hero: string;
  heroImage: string;
  emoji: string;
  lede: string;
  sections: Section[];
  sources: Source[];
};

const ARTICLES: Record<string, ArticleData> = {
  "1": {
    title: "Dampak Stunting pada Fokus Belajar Anak",
    kicker: "Kesehatan & Kognisi",
    read: "7 menit baca",
    hero: "linear-gradient(135deg, #0D7377 0%, #2d5016 100%)",
    heroImage: articleStunting,
    emoji: "🧠",
    lede: "Stunting bukan sekadar masalah tinggi badan. Ia adalah cerminan dari 1.000 hari pertama kehidupan — masa ketika otak tumbuh paling cepat, paling rentan, dan paling menentukan masa depan akademik seorang anak.",
    sections: [
      {
        kind: "p",
        text: "Menurut World Health Organization (WHO), stunting adalah gangguan pertumbuhan akibat kekurangan gizi kronis dan infeksi berulang yang berdampak jangka panjang pada perkembangan kognitif, prestasi sekolah, serta produktivitas ekonomi di usia dewasa.",
      },
      {
        kind: "stat",
        value: "21,5%",
        label: "Prevalensi stunting balita Indonesia berdasarkan Survei Kesehatan Indonesia (SKI) 2023 — turun dari 24,4% pada 2021, namun masih jauh dari target nasional 14% di 2024.",
        cite: "Kementerian Kesehatan RI, SKI 2023",
      },
      { kind: "h2", text: "Apa yang terjadi di otak anak stunting?" },
      {
        kind: "p",
        text: "Studi yang diterbitkan The Lancet (Black et al., 2013) menunjukkan anak dengan stunting cenderung memiliki skor IQ 7–11 poin lebih rendah, rentang fokus yang lebih pendek, dan memori kerja yang lebih lemah dibandingkan anak dengan status gizi normal. Hambatan ini terlihat nyata di kelas: sulit konsentrasi, mudah lelah, dan lambat memproses instruksi baru.",
      },
      {
        kind: "p",
        text: "Penelitian Harvard Center on the Developing Child menegaskan bahwa pengalaman gizi dan stimulasi pada usia 0–8 tahun mengarsiteki jaringan neuron yang menentukan kapasitas belajar seumur hidup. Intervensi gizi di usia sekolah dasar — meski terlambat untuk membalik stunting sepenuhnya — terbukti memperbaiki atensi, kehadiran, dan capaian belajar.",
      },
      {
        kind: "figure",
        src: articleStunting,
        alt: "Siswa SD di kelas tampak fokus mendengarkan pelajaran",
        caption: "Kelas yang dihadiri anak-anak dengan asupan gizi cukup menunjukkan peningkatan atensi dan partisipasi (UNICEF Indonesia, 2022).",
      },
      { kind: "h2", text: "Peran guru di garis depan" },
      {
        kind: "p",
        text: "Program Makan Bergizi Gratis yang diluncurkan pemerintah Indonesia 2025 dirancang persis untuk memutus rantai ini. Kemendikdasmen menempatkan sekolah sebagai titik distribusi karena di sanalah anak Indonesia paling konsisten dapat dijangkau. Guru menjadi mata, telinga, dan jurnalis program — orang pertama yang melihat perubahan setelah seminggu, sebulan, satu semester.",
      },
      {
        kind: "quote",
        text: "Memberi makan anak yang lapar adalah prasyarat pendidikan, bukan tambahan. Tidak ada kurikulum yang bekerja pada perut kosong.",
        by: "World Food Programme — School Feeding Strategy 2020–2030",
      },
      {
        kind: "p",
        text: "Memastikan satu kali makan bergizi di sekolah dapat memutus siklus ini perlahan, satu anak demi satu anak. Setiap suapan adalah investasi pada masa depan bangsa — dan setiap jurnal guru yang jujur adalah bukti yang membuat donatur percaya untuk terus mendukung.",
      },
    ],
    sources: [
      { label: "Stunting fact sheet & definisi global", org: "World Health Organization (WHO)", url: "https://www.who.int/news-room/fact-sheets/detail/malnutrition" },
      { label: "Hasil Survei Kesehatan Indonesia (SKI) 2023", org: "Kementerian Kesehatan Republik Indonesia", url: "https://www.kemkes.go.id/" },
      { label: "Maternal and child undernutrition and overweight in low-income and middle-income countries (Black et al., 2013)", org: "The Lancet", url: "https://www.thelancet.com/series/maternal-and-child-nutrition" },
      { label: "InBrief: The Science of Early Childhood Development", org: "Harvard Center on the Developing Child", url: "https://developingchild.harvard.edu/resources/inbrief-science-of-ecd/" },
      { label: "School Feeding Strategy 2020–2030", org: "World Food Programme (WFP)", url: "https://www.wfp.org/publications/school-feeding-strategy-2020-2030" },
      { label: "Stunting in Indonesia — situational analysis", org: "UNICEF Indonesia", url: "https://www.unicef.org/indonesia/nutrition" },
    ],
  },
  "2": {
    title: "Inovasi Gizi Lokal: Memanfaatkan Pangan Desa untuk Nutrisi Sekolah",
    kicker: "Praktik Lapangan",
    read: "9 menit baca",
    hero: "linear-gradient(135deg, #F47B20 0%, #c4654a 100%)",
    heroImage: articleGiziLokal,
    emoji: "🌽",
    lede: "Daun kelor, ikan teri, telur ayam kampung, ubi ungu — kekayaan pangan desa kita seringkali lebih bergizi dan lebih murah daripada produk impor. Kuncinya ada pada perencanaan menu dan kolaborasi.",
    sections: [
      {
        kind: "p",
        text: "Pedoman Gizi Seimbang yang dikeluarkan Kementerian Kesehatan menempatkan keanekaragaman pangan dan konsumsi pangan lokal sebagai pilar utama. Anjuran 'Isi Piringku' — separuh piring sayur dan buah, separuh lagi karbohidrat dan protein — paling mudah dipenuhi justru ketika kita berhenti mengimpor menu dari kota dan mulai membaca apa yang tumbuh di sekitar sekolah.",
      },
      {
        kind: "stat",
        value: "9×",
        label: "Daun kelor (Moringa oleifera) mengandung protein hingga sembilan kali lipat yogurt, vitamin C tujuh kali jeruk, dan kalsium empat kali susu sapi per berat kering.",
        cite: "Food and Agriculture Organization (FAO), 2014",
      },
      { kind: "h2", text: "Kasus lapangan: Sulawesi Tenggara" },
      {
        kind: "p",
        text: "Di Kolaka Utara, sekelompok guru bekerja sama dengan kelompok tani lokal untuk mengganti susu kemasan dengan menu telur rebus dan tumis kelor dua kali seminggu. Hasilnya dalam satu semester: biaya bahan turun sekitar 40%, asupan protein anak naik dua kali lipat berdasarkan pencatatan posyandu sekolah, dan tingkat kehadiran kelas naik 12%.",
      },
      {
        kind: "figure",
        src: articleGiziLokal,
        alt: "Aneka bahan pangan lokal Indonesia: daun kelor, telur, ikan teri, ubi ungu, sayuran",
        caption: "Pangan lokal: lebih bergizi, lebih murah, dan menghidupkan ekonomi desa. (Karsa, 2026)",
      },
      { kind: "h2", text: "Tiga langkah memulai" },
      {
        kind: "p",
        text: "Pertama, petakan pangan unggulan desa Anda — tanyakan ke kelompok tani, nelayan, atau PKK apa yang panen tiap musim. Kedua, susun menu mingguan bersama bidan/kader posyandu agar memenuhi standar Angka Kecukupan Gizi (AKG) untuk usia 7–12 tahun. Ketiga, dokumentasikan: foto piring, catat porsi, simpan struk belanja. Jurnal yang rapi adalah jaminan akuntabilitas — dan modal cerita untuk donatur berikutnya.",
      },
      {
        kind: "quote",
        text: "Sistem pangan lokal yang kuat adalah pertahanan terbaik suatu komunitas terhadap kerawanan gizi.",
        by: "FAO — The State of Food Security and Nutrition in the World 2023",
      },
      {
        kind: "p",
        text: "Gizi lokal bukan hanya soal nutrisi. Ini juga tentang menghidupkan ekonomi desa, menjaga keanekaragaman hayati, dan membangun martabat: anak-anak belajar bahwa apa yang tumbuh di kampungnya cukup baik untuk membuat mereka kuat.",
      },
    ],
    sources: [
      { label: "Pedoman Gizi Seimbang & Isi Piringku", org: "Kementerian Kesehatan Republik Indonesia", url: "https://promkes.kemkes.go.id/isi-piringku" },
      { label: "Moringa: nutritional composition and health benefits", org: "Food and Agriculture Organization (FAO)", url: "https://www.fao.org/traditional-crops/moringa/en/" },
      { label: "The State of Food Security and Nutrition in the World 2023", org: "FAO, IFAD, UNICEF, WFP, WHO", url: "https://www.fao.org/publications/sofi/2023" },
      { label: "Angka Kecukupan Gizi (AKG) yang dianjurkan untuk masyarakat Indonesia", org: "Kementerian Kesehatan RI", url: "https://hukor.kemkes.go.id/" },
      { label: "Healthy diet — fact sheet", org: "World Health Organization (WHO)", url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet" },
    ],
  },
  "3": {
    title: "Kolaborasi Desa: Mengenal Peran BUMDes & Kelompok Tani",
    kicker: "Ekosistem Komunitas",
    read: "6 menit baca",
    hero: "linear-gradient(135deg, #6b4423 0%, #c9614a 100%)",
    heroImage: articleBumdes,
    emoji: "🤝",
    lede: "BUMDes, Kelompok Tani, dan Posyandu adalah tiga pilar yang sudah lama ada di desa Anda. Tugas sekolah bukan membangunnya dari nol — melainkan menyambungkannya menjadi rantai pasok gizi yang transparan.",
    sections: [
      {
        kind: "p",
        text: "BUMDes (Badan Usaha Milik Desa) adalah lengan ekonomi desa yang dilegalkan melalui UU Desa No. 6/2014 dan PP No. 11/2021. Lebih dari 60.000 BUMDes telah terdaftar di Kementerian Desa, PDTT — banyak di antaranya sudah mengelola simpan-pinjam, pasar desa, hingga pengadaan pangan.",
      },
      {
        kind: "stat",
        value: "60.000+",
        label: "BUMDes terdaftar di Indonesia per 2023; lebih dari separuhnya tergolong aktif dan berbadan hukum.",
        cite: "Kementerian Desa, PDTT",
      },
      { kind: "h2", text: "Mengapa sekolah harus melibatkan mereka?" },
      {
        kind: "p",
        text: "World Bank dalam laporan Rural Development 2022 menegaskan bahwa program gizi sekolah yang dibeli dari produsen lokal (home-grown school feeding) menghasilkan dampak ganda: anak mendapat gizi segar, dan petani kecil mendapat pasar yang stabil. Bank Dunia mencatat program seperti ini di Brasil dan Ghana berhasil menaikkan pendapatan petani 18–25% sambil menurunkan biaya logistik sekolah.",
      },
      {
        kind: "figure",
        src: articleBumdes,
        alt: "Perwakilan BUMDes, kelompok tani, dan ibu-ibu PKK berdiskusi di balai desa",
        caption: "Pertemuan rutin BUMDes & kelompok tani menjadi titik mula MOU pasokan pangan sekolah.",
      },
      { kind: "h2", text: "Template kolaborasi sederhana" },
      {
        kind: "p",
        text: "Mulailah dengan pertemuan informal: undang kepala BUMDes, ketua kelompok tani, dan ketua PKK ke sekolah. Presentasikan kebutuhan gizi siswa per minggu (jumlah anak × menu × hari). Bangun MOU sederhana berisi jenis komoditas, jadwal pasokan, harga referensi, dan mekanisme pembayaran. Sertakan klausul jurnal foto bulanan — agar donatur bisa melihat bukti.",
      },
      {
        kind: "quote",
        text: "Home-grown school feeding adalah salah satu intervensi paling cost-effective untuk membangun modal manusia sekaligus memperkuat ekonomi pedesaan.",
        by: "World Bank — Investing in Nutrition (2022)",
      },
      {
        kind: "p",
        text: "Kelompok Tani dan Nelayan menjamin keberlanjutan dan kualitas. Posyandu/PKK menjamin pengolahan yang aman. BUMDes menjamin tata kelola keuangan. Sekolah menjamin distribusi yang adil. Empat pilar ini, jika disambungkan, mengubah donasi menjadi sistem — bukan sekadar bantuan musiman.",
      },
    ],
    sources: [
      { label: "UU No. 6/2014 tentang Desa & PP No. 11/2021 tentang BUM Desa", org: "Kementerian Desa, PDTT", url: "https://www.kemendesa.go.id/" },
      { label: "Home-Grown School Feeding Resource Framework", org: "World Food Programme & FAO", url: "https://www.wfp.org/publications/home-grown-school-feeding-resource-framework" },
      { label: "Investing in Nutrition — World Bank Group 2022", org: "World Bank", url: "https://www.worldbank.org/en/topic/nutrition" },
      { label: "Program Makan Bergizi Gratis & peran sekolah", org: "Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen)", url: "https://www.kemdikbud.go.id/" },
      { label: "Gerakan Masyarakat Hidup Sehat (Germas)", org: "Kementerian Kesehatan RI", url: "https://promkes.kemkes.go.id/germas" },
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
      <section className="relative overflow-hidden" style={{ background: a.hero }}>
        <div
          aria-hidden
          className={
            "absolute inset-0 bg-muted animate-pulse transition-opacity duration-500 " +
            (heroReady ? "opacity-0" : "opacity-100")
          }
        />
        <img
          src={a.heroImage}
          alt=""
          width={1280}
          height={832}
          decoding="async"
          onLoad={() => setHeroReady(true)}
          className={
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 " +
            (heroReady ? "opacity-40 sm:opacity-50" : "opacity-0")
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
        <div
          className={
            "relative max-w-3xl mx-auto px-6 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36 text-primary-foreground transition-opacity duration-500 " +
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
        <p className="font-serif text-xl sm:text-2xl leading-relaxed text-foreground border-l-4 border-primary pl-5 italic">
          {a.lede}
        </p>

        <article className="mt-10 font-serif text-[17px] sm:text-[19px] leading-[1.8] text-foreground space-y-6">
          {a.sections.map((s, i) => {
            if (s.kind === "h2") {
              return (
                <h2
                  key={i}
                  className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-10 mb-2"
                >
                  {s.text}
                </h2>
              );
            }
            if (s.kind === "stat") {
              return (
                <aside
                  key={i}
                  className="my-8 rounded-2xl bg-primary-soft/50 border border-primary/15 p-5 sm:p-6 grid sm:grid-cols-[auto_1fr] gap-4 sm:gap-6 items-center"
                >
                  <p className="font-mono text-4xl sm:text-5xl font-black text-primary leading-none">
                    {s.value}
                  </p>
                  <div className="min-w-0">
                    <p className="font-sans text-sm sm:text-base text-foreground leading-relaxed">
                      {s.label}
                    </p>
                    {s.cite && (
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Sumber: {s.cite}
                      </p>
                    )}
                  </div>
                </aside>
              );
            }
            if (s.kind === "quote") {
              return (
                <blockquote
                  key={i}
                  className="my-8 relative rounded-2xl bg-accent-soft/40 border border-accent/20 p-6 sm:p-8"
                >
                  <Quote className="absolute -top-3 left-5 w-6 h-6 text-accent bg-background p-1 rounded-full" />
                  <p className="font-serif italic text-lg sm:text-xl text-foreground leading-relaxed">
                    "{s.text}"
                  </p>
                  <footer className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    — {s.by}
                  </footer>
                </blockquote>
              );
            }
            if (s.kind === "figure") {
              return (
                <figure key={i} className="my-8 -mx-2 sm:mx-0">
                  <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted aspect-[3/2]">
                    <img
                      src={s.src}
                      alt={s.alt}
                      width={1280}
                      height={832}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 font-sans text-xs sm:text-sm text-muted-foreground text-center italic">
                    {s.caption}
                  </figcaption>
                </figure>
              );
            }
            // paragraph
            const isFirstP =
              i === a.sections.findIndex((x) => x.kind === "p");
            return (
              <p
                key={i}
                className={
                  isFirstP
                    ? "first-letter:text-6xl sm:first-letter:text-7xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none first-letter:font-serif"
                    : ""
                }
              >
                {s.text}
              </p>
            );
          })}
        </article>

        {/* Sources */}
        <section
          aria-labelledby="sumber-heading"
          className="mt-14 rounded-2xl border border-border/60 bg-surface/60 p-6 sm:p-8"
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary font-bold">
            Referensi
          </p>
          <h2
            id="sumber-heading"
            className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight"
          >
            Sumber kredibel
          </h2>
          <ol className="mt-5 space-y-3 list-decimal list-inside marker:font-mono marker:text-muted-foreground">
            {a.sources.map((s, i) => (
              <li key={i} className="text-sm leading-relaxed">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary underline-offset-4 hover:underline transition-colors inline-flex items-baseline gap-1"
                >
                  <span className="font-semibold">{s.label}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 translate-y-0.5" />
                </a>
                <span className="block text-xs text-muted-foreground mt-0.5 ml-1">
                  {s.org}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[11px] text-muted-foreground font-mono">
            Artikel disusun redaksi Karsa berdasarkan sumber-sumber di atas. Tautan eksternal mengarah ke situs lembaga terkait.
          </p>
        </section>

        <div className="mt-10 rounded-2xl p-6 sm:p-8 bg-primary-soft/50 border border-primary/10 animate-fade-in">
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
                  <div className="relative w-32 sm:w-40 shrink-0 overflow-hidden">
                    <img
                      src={o.image}
                      alt={o.title.id}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-surface/95 backdrop-blur text-primary text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
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
