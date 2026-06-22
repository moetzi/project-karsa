import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";

export const Route = createFileRoute("/inspirasi/$id")({
  head: () => ({
    meta: [
      { title: "Pojok Inspirasi Guru — Karsa" },
      { name: "description", content: "Artikel inspiratif untuk guru tentang gizi & tumbuh kembang anak." },
    ],
  }),
  component: Article,
});

type Article = {
  title: string;
  kicker: string;
  read: string;
  hero: string;
  body: string[];
};

const ARTICLES: Record<string, Article> = {
  "1": {
    title: "Dampak Stunting pada Fokus Belajar Anak",
    kicker: "Kesehatan & Kognisi",
    read: "6 menit baca",
    hero: "linear-gradient(135deg, #0D7377 0%, #2d5016 100%)",
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

  return (
    <PhoneShell>
      <div>
        <div className="relative h-56 px-6 pt-4 pb-6 flex flex-col justify-between" style={{ background: a.hero }}>
          <Link to="/beranda" className="w-10 h-10 rounded-full bg-background/90 grid place-items-center text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="text-primary-foreground">
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-90">{a.kicker}</p>
            <h1 className="mt-1 text-[22px] font-extrabold leading-tight drop-shadow">{a.title}</h1>
          </div>
        </div>

        <div className="px-6 pt-5 pb-10">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {a.read}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1"><BookOpen className="w-3 h-3" /> Inspirasi Guru</span>
          </div>

          <article className="mt-5 font-serif text-[16px] leading-[1.75] text-foreground space-y-4">
            {a.body.map((p, i) => (
              <p key={i} className={i === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:font-serif" : ""}>
                {p}
              </p>
            ))}
          </article>

          <div className="mt-8 rounded-2xl p-4 bg-primary-soft/50 border border-primary/10">
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">Aksi Selanjutnya</p>
            <p className="font-serif italic text-sm text-foreground mt-1.5">
              "Setiap hari adalah kesempatan baru untuk mengubah hidup seorang anak."
            </p>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
