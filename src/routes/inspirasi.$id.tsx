import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock, BookOpen, Sprout, ExternalLink, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { INSPIRASI } from "@/lib/inspirasi";
import { PhoneShell } from "@/components/PhoneShell";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";
import articleStunting from "@/assets/article-stunting.jpg";
import articleGiziLokal from "@/assets/article-gizi-lokal.jpg";
import articleBumdes from "@/assets/article-bumdes.jpg";
import articlePosyandu from "@/assets/article-posyandu.jpg";

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

type Bi = { id: string; en: string };

type Section =
  | { kind: "p"; text: Bi }
  | { kind: "h2"; text: Bi }
  | { kind: "stat"; value: string; label: Bi; cite?: Bi }
  | { kind: "quote"; text: Bi; by: Bi }
  | { kind: "figure"; src: string; alt: Bi; caption: Bi };

type Source = { label: Bi; org: Bi; url: string };

type ArticleData = {
  title: Bi;
  kicker: Bi;
  read: Bi;
  hero: string;
  heroImage: string;
  emoji: string;
  lede: Bi;
  sections: Section[];
  sources: Source[];
};

const ARTICLES: Record<string, ArticleData> = {
  "1": {
    title: {
      id: "Dampak Stunting pada Fokus Belajar Anak",
      en: "How Stunting Affects Children's Focus in Class",
    },
    kicker: { id: "Kesehatan & Kognisi", en: "Health & Cognition" },
    read: { id: "7 menit baca", en: "7 min read" },
    hero: "linear-gradient(135deg, #0D7377 0%, #2d5016 100%)",
    heroImage: articleStunting,
    emoji: "🧠",
    lede: {
      id: "Stunting bukan sekadar masalah tinggi badan. Ia adalah cerminan dari 1.000 hari pertama kehidupan — masa ketika otak tumbuh paling cepat, paling rentan, dan paling menentukan masa depan akademik seorang anak.",
      en: "Stunting is not merely about height. It mirrors the first 1,000 days of life — when the brain grows fastest, is most vulnerable, and most decisively shapes a child's academic future.",
    },
    sections: [
      {
        kind: "p",
        text: {
          id: "Menurut World Health Organization (WHO), stunting adalah gangguan pertumbuhan akibat kekurangan gizi kronis dan infeksi berulang yang berdampak jangka panjang pada perkembangan kognitif, prestasi sekolah, serta produktivitas ekonomi di usia dewasa.",
          en: "According to the World Health Organization (WHO), stunting is impaired growth caused by chronic undernutrition and repeated infections, with long-term consequences for cognitive development, school performance, and adult economic productivity.",
        },
      },
      {
        kind: "stat",
        value: "21.5%",
        label: {
          id: "Prevalensi stunting balita Indonesia berdasarkan Survei Kesehatan Indonesia (SKI) 2023 — turun dari 24,4% pada 2021, namun masih jauh dari target nasional 14% di 2024.",
          en: "Prevalence of stunting among Indonesian under-fives based on the 2023 Indonesia Health Survey (SKI) — down from 24.4% in 2021, but still far from the national 14% target for 2024.",
        },
        cite: { id: "Kementerian Kesehatan RI, SKI 2023", en: "Indonesian Ministry of Health, SKI 2023" },
      },
      { kind: "h2", text: { id: "Apa yang terjadi di otak anak stunting?", en: "What happens in a stunted child's brain?" } },
      {
        kind: "p",
        text: {
          id: "Studi yang diterbitkan The Lancet (Black et al., 2013) menunjukkan anak dengan stunting cenderung memiliki skor IQ 7–11 poin lebih rendah, rentang fokus yang lebih pendek, dan memori kerja yang lebih lemah dibandingkan anak dengan status gizi normal. Hambatan ini terlihat nyata di kelas: sulit konsentrasi, mudah lelah, dan lambat memproses instruksi baru.",
          en: "A study in The Lancet (Black et al., 2013) shows stunted children tend to score 7–11 IQ points lower, have shorter attention spans, and weaker working memory than well-nourished peers. The effects are visible in class: difficulty concentrating, fatigue, and slower processing of new instructions.",
        },
      },
      {
        kind: "p",
        text: {
          id: "Penelitian Harvard Center on the Developing Child menegaskan bahwa pengalaman gizi dan stimulasi pada usia 0–8 tahun mengarsiteki jaringan neuron yang menentukan kapasitas belajar seumur hidup. Intervensi gizi di usia sekolah dasar — meski terlambat untuk membalik stunting sepenuhnya — terbukti memperbaiki atensi, kehadiran, dan capaian belajar.",
          en: "Research from the Harvard Center on the Developing Child confirms that nutrition and stimulation between ages 0–8 architect the neural networks that govern lifelong learning capacity. Nutrition interventions at primary-school age — though too late to fully reverse stunting — proven improve attention, attendance, and learning outcomes.",
        },
      },
      {
        kind: "figure",
        src: articleStunting,
        alt: {
          id: "Siswa SD di kelas tampak fokus mendengarkan pelajaran",
          en: "Primary-school students focused in class",
        },
        caption: {
          id: "Kelas yang dihadiri anak-anak dengan asupan gizi cukup menunjukkan peningkatan atensi dan partisipasi (UNICEF Indonesia, 2022).",
          en: "Classrooms with well-nourished children show higher attention and participation (UNICEF Indonesia, 2022).",
        },
      },
      { kind: "h2", text: { id: "Peran guru di garis depan", en: "Teachers on the front line" } },
      {
        kind: "p",
        text: {
          id: "Program Makan Bergizi Gratis yang diluncurkan pemerintah Indonesia 2025 dirancang persis untuk memutus rantai ini. Kemendikdasmen menempatkan sekolah sebagai titik distribusi karena di sanalah anak Indonesia paling konsisten dapat dijangkau. Guru menjadi mata, telinga, dan jurnalis program — orang pertama yang melihat perubahan setelah seminggu, sebulan, satu semester.",
          en: "Indonesia's Free Nutritious Meals program, launched in 2025, was designed to break this chain. The Ministry of Primary & Secondary Education uses schools as distribution points because that is where children are reached most consistently. Teachers become the program's eyes, ears, and journalists — the first to see change after a week, a month, a semester.",
        },
      },
      {
        kind: "quote",
        text: {
          id: "Memberi makan anak yang lapar adalah prasyarat pendidikan, bukan tambahan. Tidak ada kurikulum yang bekerja pada perut kosong.",
          en: "Feeding a hungry child is a prerequisite of education, not an add-on. No curriculum works on an empty stomach.",
        },
        by: {
          id: "World Food Programme — School Feeding Strategy 2020–2030",
          en: "World Food Programme — School Feeding Strategy 2020–2030",
        },
      },
      {
        kind: "p",
        text: {
          id: "Memastikan satu kali makan bergizi di sekolah dapat memutus siklus ini perlahan, satu anak demi satu anak. Setiap suapan adalah investasi pada masa depan bangsa — dan setiap jurnal guru yang jujur adalah bukti yang membuat donatur percaya untuk terus mendukung.",
          en: "One nutritious meal at school can break this cycle slowly, one child at a time. Every bite is an investment in the nation's future — and every honest teacher's journal is the proof that keeps donors believing and giving.",
        },
      },
    ],
    sources: [
      { label: { id: "Stunting fact sheet & definisi global", en: "Stunting fact sheet & global definition" }, org: { id: "World Health Organization (WHO)", en: "World Health Organization (WHO)" }, url: "https://www.who.int/news-room/fact-sheets/detail/malnutrition" },
      { label: { id: "Hasil Survei Kesehatan Indonesia (SKI) 2023", en: "Indonesia Health Survey (SKI) 2023 results" }, org: { id: "Kementerian Kesehatan Republik Indonesia", en: "Indonesian Ministry of Health" }, url: "https://www.kemkes.go.id/" },
      { label: { id: "Maternal and child undernutrition and overweight in low-income and middle-income countries (Black et al., 2013)", en: "Maternal and child undernutrition and overweight in low- and middle-income countries (Black et al., 2013)" }, org: { id: "The Lancet", en: "The Lancet" }, url: "https://www.thelancet.com/series/maternal-and-child-nutrition" },
      { label: { id: "InBrief: The Science of Early Childhood Development", en: "InBrief: The Science of Early Childhood Development" }, org: { id: "Harvard Center on the Developing Child", en: "Harvard Center on the Developing Child" }, url: "https://developingchild.harvard.edu/resources/inbrief-science-of-ecd/" },
      { label: { id: "School Feeding Strategy 2020–2030", en: "School Feeding Strategy 2020–2030" }, org: { id: "World Food Programme (WFP)", en: "World Food Programme (WFP)" }, url: "https://www.wfp.org/publications/school-feeding-strategy-2020-2030" },
      { label: { id: "Stunting in Indonesia — situational analysis", en: "Stunting in Indonesia — situational analysis" }, org: { id: "UNICEF Indonesia", en: "UNICEF Indonesia" }, url: "https://www.unicef.org/indonesia/nutrition" },
    ],
  },
  "2": {
    title: {
      id: "Inovasi Gizi Lokal: Memanfaatkan Pangan Desa untuk Nutrisi Sekolah",
      en: "Local Nutrition Innovation: Village Food for School Meals",
    },
    kicker: { id: "Praktik Lapangan", en: "Field Practice" },
    read: { id: "9 menit baca", en: "9 min read" },
    hero: "linear-gradient(135deg, #F47B20 0%, #c4654a 100%)",
    heroImage: articleGiziLokal,
    emoji: "🌽",
    lede: {
      id: "Daun kelor, ikan teri, telur ayam kampung, ubi ungu — kekayaan pangan desa kita seringkali lebih bergizi dan lebih murah daripada produk impor. Kuncinya ada pada perencanaan menu dan kolaborasi.",
      en: "Moringa leaves, anchovies, free-range eggs, purple sweet potato — our village foods are often more nutritious and cheaper than imported products. The key is menu planning and collaboration.",
    },
    sections: [
      {
        kind: "p",
        text: {
          id: "Pedoman Gizi Seimbang yang dikeluarkan Kementerian Kesehatan menempatkan keanekaragaman pangan dan konsumsi pangan lokal sebagai pilar utama. Anjuran 'Isi Piringku' — separuh piring sayur dan buah, separuh lagi karbohidrat dan protein — paling mudah dipenuhi justru ketika kita berhenti mengimpor menu dari kota dan mulai membaca apa yang tumbuh di sekitar sekolah.",
          en: "The Balanced Nutrition Guidelines from the Ministry of Health put food diversity and local-food consumption at the center. The 'Fill My Plate' rule — half vegetables and fruit, half carbohydrates and protein — is easiest to meet when we stop importing menus from cities and start reading what grows around the school.",
        },
      },
      {
        kind: "stat",
        value: "9×",
        label: {
          id: "Daun kelor (Moringa oleifera) mengandung protein hingga sembilan kali lipat yogurt, vitamin C tujuh kali jeruk, dan kalsium empat kali susu sapi per berat kering.",
          en: "Moringa leaves (Moringa oleifera) contain up to nine times the protein of yogurt, seven times the vitamin C of oranges, and four times the calcium of cow's milk by dry weight.",
        },
        cite: { id: "Food and Agriculture Organization (FAO), 2014", en: "Food and Agriculture Organization (FAO), 2014" },
      },
      { kind: "h2", text: { id: "Kasus lapangan: Sulawesi Tenggara", en: "Field case: Southeast Sulawesi" } },
      {
        kind: "p",
        text: {
          id: "Di Kolaka Utara, sekelompok guru bekerja sama dengan kelompok tani lokal untuk mengganti susu kemasan dengan menu telur rebus dan tumis kelor dua kali seminggu. Hasilnya dalam satu semester: biaya bahan turun sekitar 40%, asupan protein anak naik dua kali lipat berdasarkan pencatatan posyandu sekolah, dan tingkat kehadiran kelas naik 12%.",
          en: "In North Kolaka, a group of teachers partnered with a local farmers' group to replace packaged milk with boiled eggs and sautéed moringa twice a week. In one semester: ingredient costs fell roughly 40%, children's protein intake doubled per school health-post records, and class attendance rose 12%.",
        },
      },
      {
        kind: "figure",
        src: articleGiziLokal,
        alt: {
          id: "Aneka bahan pangan lokal Indonesia: daun kelor, telur, ikan teri, ubi ungu, sayuran",
          en: "Assorted Indonesian local foods: moringa leaves, eggs, anchovies, purple sweet potato, vegetables",
        },
        caption: {
          id: "Pangan lokal: lebih bergizi, lebih murah, dan menghidupkan ekonomi desa. (Karsa, 2026)",
          en: "Local foods: more nutritious, cheaper, and reviving the village economy. (Karsa, 2026)",
        },
      },
      { kind: "h2", text: { id: "Tiga langkah memulai", en: "Three steps to start" } },
      {
        kind: "p",
        text: {
          id: "Pertama, petakan pangan unggulan desa Anda — tanyakan ke kelompok tani, nelayan, atau PKK apa yang panen tiap musim. Kedua, susun menu mingguan bersama bidan/kader posyandu agar memenuhi standar Angka Kecukupan Gizi (AKG) untuk usia 7–12 tahun. Ketiga, dokumentasikan: foto piring, catat porsi, simpan struk belanja. Jurnal yang rapi adalah jaminan akuntabilitas — dan modal cerita untuk donatur berikutnya.",
          en: "First, map your village's flagship foods — ask the farmers' group, fishers, or PKK what is in season. Second, draft a weekly menu with midwives or health-post cadres to meet the Recommended Dietary Allowance (AKG) for ages 7–12. Third, document: photograph the plate, log portions, save receipts. A tidy journal is your accountability guarantee — and the story that recruits the next donor.",
        },
      },
      {
        kind: "quote",
        text: {
          id: "Sistem pangan lokal yang kuat adalah pertahanan terbaik suatu komunitas terhadap kerawanan gizi.",
          en: "A strong local food system is a community's best defense against nutritional insecurity.",
        },
        by: {
          id: "FAO — The State of Food Security and Nutrition in the World 2023",
          en: "FAO — The State of Food Security and Nutrition in the World 2023",
        },
      },
      {
        kind: "p",
        text: {
          id: "Gizi lokal bukan hanya soal nutrisi. Ini juga tentang menghidupkan ekonomi desa, menjaga keanekaragaman hayati, dan membangun martabat: anak-anak belajar bahwa apa yang tumbuh di kampungnya cukup baik untuk membuat mereka kuat.",
          en: "Local nutrition is more than nutrients. It is reviving the village economy, protecting biodiversity, and building dignity: children learn that what grows in their own village is good enough to make them strong.",
        },
      },
    ],
    sources: [
      { label: { id: "Pedoman Gizi Seimbang & Isi Piringku", en: "Balanced Nutrition Guidelines & 'Fill My Plate'" }, org: { id: "Kementerian Kesehatan Republik Indonesia", en: "Indonesian Ministry of Health" }, url: "https://promkes.kemkes.go.id/isi-piringku" },
      { label: { id: "Moringa: nutritional composition and health benefits", en: "Moringa: nutritional composition and health benefits" }, org: { id: "Food and Agriculture Organization (FAO)", en: "Food and Agriculture Organization (FAO)" }, url: "https://www.fao.org/traditional-crops/moringa/en/" },
      { label: { id: "The State of Food Security and Nutrition in the World 2023", en: "The State of Food Security and Nutrition in the World 2023" }, org: { id: "FAO, IFAD, UNICEF, WFP, WHO", en: "FAO, IFAD, UNICEF, WFP, WHO" }, url: "https://www.fao.org/publications/sofi/2023" },
      { label: { id: "Angka Kecukupan Gizi (AKG) yang dianjurkan untuk masyarakat Indonesia", en: "Recommended Dietary Allowance (AKG) for Indonesians" }, org: { id: "Kementerian Kesehatan RI", en: "Indonesian Ministry of Health" }, url: "https://hukor.kemkes.go.id/" },
      { label: { id: "Healthy diet — fact sheet", en: "Healthy diet — fact sheet" }, org: { id: "World Health Organization (WHO)", en: "World Health Organization (WHO)" }, url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet" },
    ],
  },
  "3": {
    title: {
      id: "Kolaborasi Desa: Mengenal Peran BUMDes & Kelompok Tani",
      en: "Village Collaboration: The Role of BUMDes & Farmer Groups",
    },
    kicker: { id: "Ekosistem Komunitas", en: "Community Ecosystem" },
    read: { id: "6 menit baca", en: "6 min read" },
    hero: "linear-gradient(135deg, #6b4423 0%, #c9614a 100%)",
    heroImage: articleBumdes,
    emoji: "🤝",
    lede: {
      id: "BUMDes, Kelompok Tani, dan Posyandu adalah tiga pilar yang sudah lama ada di desa Anda. Tugas sekolah bukan membangunnya dari nol — melainkan menyambungkannya menjadi rantai pasok gizi yang transparan.",
      en: "BUMDes, farmer groups, and health posts are three pillars long present in your village. The school's job is not to build them from scratch — but to link them into a transparent nutrition supply chain.",
    },
    sections: [
      {
        kind: "p",
        text: {
          id: "BUMDes (Badan Usaha Milik Desa) adalah lengan ekonomi desa yang dilegalkan melalui UU Desa No. 6/2014 dan PP No. 11/2021. Lebih dari 60.000 BUMDes telah terdaftar di Kementerian Desa, PDTT — banyak di antaranya sudah mengelola simpan-pinjam, pasar desa, hingga pengadaan pangan.",
          en: "BUMDes (Village-Owned Enterprises) are the economic arm of the village, legalized by Village Law No. 6/2014 and Government Regulation No. 11/2021. More than 60,000 BUMDes are registered with the Ministry of Villages — many already run savings & loans, village markets, and food procurement.",
        },
      },
      {
        kind: "stat",
        value: "60,000+",
        label: {
          id: "BUMDes terdaftar di Indonesia per 2023; lebih dari separuhnya tergolong aktif dan berbadan hukum.",
          en: "BUMDes registered in Indonesia as of 2023; more than half are classified as active legal entities.",
        },
        cite: { id: "Kementerian Desa, PDTT", en: "Ministry of Villages (PDTT)" },
      },
      { kind: "h2", text: { id: "Mengapa sekolah harus melibatkan mereka?", en: "Why schools should involve them" } },
      {
        kind: "p",
        text: {
          id: "World Bank dalam laporan Rural Development 2022 menegaskan bahwa program gizi sekolah yang dibeli dari produsen lokal (home-grown school feeding) menghasilkan dampak ganda: anak mendapat gizi segar, dan petani kecil mendapat pasar yang stabil. Bank Dunia mencatat program seperti ini di Brasil dan Ghana berhasil menaikkan pendapatan petani 18–25% sambil menurunkan biaya logistik sekolah.",
          en: "In its 2022 Rural Development report, the World Bank shows that home-grown school feeding — buying from local producers — yields a double impact: children get fresh nutrition, and smallholder farmers get a stable market. Such programs in Brazil and Ghana raised farmer incomes by 18–25% while cutting school logistics costs.",
        },
      },
      {
        kind: "figure",
        src: articleBumdes,
        alt: {
          id: "Perwakilan BUMDes, kelompok tani, dan ibu-ibu PKK berdiskusi di balai desa",
          en: "BUMDes, farmer-group, and PKK women representatives meeting at the village hall",
        },
        caption: {
          id: "Pertemuan rutin BUMDes & kelompok tani menjadi titik mula MOU pasokan pangan sekolah.",
          en: "Regular BUMDes & farmer-group meetings become the starting point for a school-food supply MOU.",
        },
      },
      { kind: "h2", text: { id: "Template kolaborasi sederhana", en: "A simple collaboration template" } },
      {
        kind: "p",
        text: {
          id: "Mulailah dengan pertemuan informal: undang kepala BUMDes, ketua kelompok tani, dan ketua PKK ke sekolah. Presentasikan kebutuhan gizi siswa per minggu (jumlah anak × menu × hari). Bangun MOU sederhana berisi jenis komoditas, jadwal pasokan, harga referensi, dan mekanisme pembayaran. Sertakan klausul jurnal foto bulanan — agar donatur bisa melihat bukti.",
          en: "Start with an informal meeting: invite the BUMDes head, farmer-group chair, and PKK chair to the school. Present students' weekly nutrition needs (children × menu × days). Draft a simple MOU covering commodities, supply schedule, reference prices, and payment terms. Include a monthly photo-journal clause — so donors can see the proof.",
        },
      },
      {
        kind: "quote",
        text: {
          id: "Home-grown school feeding adalah salah satu intervensi paling cost-effective untuk membangun modal manusia sekaligus memperkuat ekonomi pedesaan.",
          en: "Home-grown school feeding is one of the most cost-effective interventions to build human capital while strengthening the rural economy.",
        },
        by: {
          id: "World Bank — Investing in Nutrition (2022)",
          en: "World Bank — Investing in Nutrition (2022)",
        },
      },
      {
        kind: "p",
        text: {
          id: "Kelompok Tani dan Nelayan menjamin keberlanjutan dan kualitas. Posyandu/PKK menjamin pengolahan yang aman. BUMDes menjamin tata kelola keuangan. Sekolah menjamin distribusi yang adil. Empat pilar ini, jika disambungkan, mengubah donasi menjadi sistem — bukan sekadar bantuan musiman.",
          en: "Farmer and fisher groups secure sustainability and quality. Posyandu/PKK ensures safe food preparation. BUMDes ensures financial governance. The school ensures fair distribution. Connected, these four pillars turn donations into a system — not just seasonal aid.",
        },
      },
    ],
    sources: [
      { label: { id: "UU No. 6/2014 tentang Desa & PP No. 11/2021 tentang BUM Desa", en: "Law No. 6/2014 on Villages & Gov. Reg. No. 11/2021 on BUMDes" }, org: { id: "Kementerian Desa, PDTT", en: "Ministry of Villages (PDTT)" }, url: "https://www.kemendesa.go.id/" },
      { label: { id: "Home-Grown School Feeding Resource Framework", en: "Home-Grown School Feeding Resource Framework" }, org: { id: "World Food Programme & FAO", en: "World Food Programme & FAO" }, url: "https://www.wfp.org/publications/home-grown-school-feeding-resource-framework" },
      { label: { id: "Investing in Nutrition — World Bank Group 2022", en: "Investing in Nutrition — World Bank Group 2022" }, org: { id: "World Bank", en: "World Bank" }, url: "https://www.worldbank.org/en/topic/nutrition" },
      { label: { id: "Program Makan Bergizi Gratis & peran sekolah", en: "Free Nutritious Meals Program & the role of schools" }, org: { id: "Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen)", en: "Ministry of Primary & Secondary Education (Kemendikdasmen)" }, url: "https://www.kemdikbud.go.id/" },
      { label: { id: "Gerakan Masyarakat Hidup Sehat (Germas)", en: "Healthy Living Community Movement (Germas)" }, org: { id: "Kementerian Kesehatan RI", en: "Indonesian Ministry of Health" }, url: "https://promkes.kemkes.go.id/germas" },
    ],
  },
  "4": {
    title: {
      id: "Kader Posyandu & PMT Lokal: Pemberdayaan Perempuan Cegah Stunting",
      en: "Posyandu Cadres & Local Supplementary Feeding: Women's Empowerment Prevents Stunting",
    },
    kicker: { id: "Pemberdayaan Perempuan", en: "Women's Empowerment" },
    read: { id: "7 menit baca", en: "7 min read" },
    hero: "linear-gradient(135deg, #2d7d46 0%, #8B4513 100%)",
    heroImage: articlePosyandu,
    emoji: "🤱",
    lede: {
      id: "Di balik angka stunting turun 21,5% ada jaringan ibu-ibu desa yang bangun pagi lebih dulu: menimbang balita, mencatat pertumbuhan, menyajikan makanan tambahan, dan mengajari tetangga cara masak bergizi. Mereka adalah kader Posyandu — sebagian besar juga anggota PKK, Kelompok Wanita Tani, atau ibu rumah tangga biasa yang menjadi pelopor kesehatan di desanya.",
      en: "Behind the drop in stunting to 21.5% is a network of village women who rise earlier than anyone: weighing toddlers, logging growth, serving supplementary meals, and teaching neighbours to cook nutritiously. They are Posyandu cadres — most also PKK members, Women Farmer Group members, or ordinary mothers who became health pioneers in their village.",
    },
    sections: [
      {
        kind: "p",
        text: {
          id: "Kementerian Kesehatan RI menegaskan bahwa Posyandu adalah garda depan pemantauan tumbuh kembang balita dan pencegahan stunting di tingkat desa. Dalam Buku Saku Kader Kesehatan Pemberian Makanan Tambahan (PMT) Penyuluhan Balita 6–59 Bulan, kader dilatih untuk menimbang berat badan, mengukur tinggi badan, mendeteksi pertumbuhan yang tidak naik, dan memberikan edukasi gizi kepada ibu serta pengasuh.",
          en: "The Indonesian Ministry of Health affirms that Posyandu (integrated village health posts) are the front line for monitoring under-five growth and preventing stunting at the village level. The Cadre Pocketbook on Supplementary Feeding (PMT) for Children 6–59 Months trains cadres to weigh, measure height, detect faltering growth, and educate mothers and caregivers on nutrition.",
        },
      },
      {
        kind: "stat",
        value: "21.5%",
        label: {
          id: "Prevalensi stunting balita Indonesia menurut Survei Kesehatan Indonesia 2023; penurunan ini tidak lepas dari peran Posyandu dan kader dalam deteksi dini serta edukasi gizi di desa.",
          en: "Prevalence of stunting in Indonesian under-fives per the 2023 Indonesia Health Survey; the decline is inseparable from Posyandu cadres' early-detection and nutrition-education work in villages.",
        },
        cite: { id: "Kementerian Kesehatan RI, SKI 2023", en: "Indonesian Ministry of Health, SKI 2023" },
      },
      { kind: "h2", text: { id: "Apa itu PMT Lokal dan mengapa penting?", en: "What is local PMT and why does it matter?" } },
      {
        kind: "p",
        text: {
          id: "Pemberian Makanan Tambahan (PMT) Berbahan Pangan Lokal adalah upaya pemulihan gizi balita dengan memanfaatkan bahan pangan yang tersedia di sekitar desa — telur, ikan, kedelai, kelor, ubi, jagung, dan sayuran. Berdasarkan Peraturan Dirjen Kesehatan Masyarakat No. HK.02.02/B/1622/2023, PMT lokal dirancang untuk meningkatkan asupan gizi, mempercepat pemulihan balita gizi kurang, dan membangun kebiasaan makan bergizi yang berkelanjutan.",
          en: "Local-Food Supplementary Feeding (PMT) is a nutrition-recovery program for under-fives using ingredients available around the village — eggs, fish, soy, moringa, sweet potato, corn, vegetables. Under Public Health Directorate Regulation No. HK.02.02/B/1622/2023, local PMT is designed to improve intake, speed recovery of undernourished toddlers, and build lasting healthy-eating habits.",
        },
      },
      {
        kind: "figure",
        src: articlePosyandu,
        alt: {
          id: "Kader Posyandu menyiapkan makanan tambahan lokal bersama ibu-ibu dan balita",
          en: "Posyandu cadres preparing local supplementary meals with mothers and toddlers",
        },
        caption: {
          id: "Kader Posyandu menyiapkan PMT lokal bersama ibu-ibu di balai desa (Karsa, 2026).",
          en: "Posyandu cadres prepare local PMT meals with mothers at the village hall (Karsa, 2026).",
        },
      },
      { kind: "h2", text: { id: "Kader Posyandu sebagai wajah pemberdayaan perempuan", en: "Posyandu cadres as the face of women's empowerment" } },
      {
        kind: "p",
        text: {
          id: "Mayoritas kader Posyandu adalah perempuan. Banyak di antaranya juga aktif di Tim Penggerak PKK sebagai ketua seksi kesehatan, atau di Kelompok Wanita Tani (KWT) yang menyuplai bahan pangan segar untuk PMT. Ketiga peran ini saling menguatkan: PKK menggerakkan partisipasi keluarga, KWT menjamin ketersediaan pangan bergizi, dan Posyandu memastikan sasaran tepat serta hasil terukur.",
          en: "Most Posyandu cadres are women. Many also serve in the PKK movement as health-section chairs, or in Women Farmer Groups (KWT) supplying fresh ingredients for PMT. The three roles reinforce each other: PKK mobilizes family participation, KWT secures nutritious food supply, and Posyandu ensures the right beneficiaries and measurable outcomes.",
        },
      },
      {
        kind: "p",
        text: {
          id: "Sebuah studi pengabdian masyarakat di Desa Torobulu, Sulawesi Tenggara, menunjukkan bahwa pelatihan kader Posyandu dan ibu-ibu PKK secara signifikan meningkatkan pengetahuan serta praktik pencegahan stunting, termasuk pemberian ASI eksklusif, MPASI bergizi, dan kebersihan lingkungan. Kolaborasi antar-kelompok perempuan inilah yang membuat intervensi gizi tidak lagi sekadar program, tapi budaya desa.",
          en: "A community-service study in Torobulu Village, Southeast Sulawesi, showed that training Posyandu cadres and PKK mothers significantly improved knowledge and practice in preventing stunting — exclusive breastfeeding, nutritious complementary feeding, and environmental hygiene. Collaboration between women's groups turns nutrition intervention from a program into a village culture.",
        },
      },
      {
        kind: "quote",
        text: {
          id: "Kesehatan ibu dan anak adalah fondasi pembangunan keluarga. Pemberdayaan perempuan melalui PKK dan Posyandu adalah investasi strategis untuk generasi yang sehat, cerdas, dan berdaya.",
          en: "Maternal and child health is the foundation of family development. Empowering women through PKK and Posyandu is a strategic investment in a healthy, smart, and empowered generation.",
        },
        by: { id: "Tim Penggerak PKK Pusat", en: "Central PKK Mobilization Team" },
      },
      {
        kind: "p",
        text: {
          id: "Untuk sekolah dan kampanye gizi, kader Posyandu adalah mitra terdekat. Libatkan mereka dalam merancang menu, mengidentifikasi siswa berisiko, dan menyiapkan bahan makanan dari KWT setempat. Jurnal guru yang mencatat kolaborasi ini bukan hanya bukti transparansi — itu adalah catatan bagaimana donasi Anda mengalir menjadi tenaga, pengetahuan, dan hidangan di tangan perempuan-perempuan desa.",
          en: "For schools and nutrition campaigns, Posyandu cadres are the closest partners. Involve them in designing menus, identifying at-risk students, and sourcing ingredients from the local KWT. Teacher journals documenting this collaboration are more than proof of transparency — they record how your donation flows into the labor, knowledge, and meals of village women.",
        },
      },
    ],
    sources: [
      { label: { id: "Buku Saku Kader Kesehatan PMT Penyuluhan Balita 6-59 Bulan", en: "Health Cadre Pocketbook on PMT for Children 6–59 Months" }, org: { id: "Kementerian Kesehatan RI", en: "Indonesian Ministry of Health" }, url: "https://ayosehat.kemkes.go.id/buku-saku-kader-kesehatan-pemberian-makanan-tambahan-pmt-penyuluhan-balita-6-59-bulan" },
      { label: { id: "Juknis Pemberian Makanan Tambahan (PMT) Berbahan Pangan Lokal", en: "Technical Guidelines on Local-Food Supplementary Feeding (PMT)" }, org: { id: "Kementerian Kesehatan RI", en: "Indonesian Ministry of Health" }, url: "https://ayosehat.kemkes.go.id/juknis-pemberian-makanan-tambahan-pmt-berbahan-pangan-lokal-untuk-balita-dan-ibu-hamil" },
      { label: { id: "Petunjuk Teknis PMT Berbahan Pangan Lokal Bagi Ibu Hamil dan Balita", en: "Technical Guidelines on Local-Food PMT for Pregnant Women and Toddlers" }, org: { id: "Ditjen Kesehatan Masyarakat Kemenkes RI", en: "Directorate General of Public Health, Ministry of Health" }, url: "https://dinaspmk.benermeriahkab.go.id/media/2024.08/perdirjen_juknis_pmt_lokal_v25_20240130_ed_revisi_20241.pdf" },
      { label: { id: "Survei Kesehatan Indonesia (SKI) 2023", en: "Indonesia Health Survey (SKI) 2023" }, org: { id: "Kementerian Kesehatan RI", en: "Indonesian Ministry of Health" }, url: "https://www.kemkes.go.id/" },
      { label: { id: "Pemberdayaan Kader Posyandu dan Ibu-Ibu PKK untuk Pencegahan Stunting", en: "Empowering Posyandu Cadres and PKK Mothers for Stunting Prevention" }, org: { id: "Jurnal Mandala Pengabdian Masyarakat", en: "Mandala Community Service Journal" }, url: "https://jurnal-pharmaconmw.com/jmpm/index.php/jmpm/article/view/291" },
      { label: { id: "Tentang Tim Penggerak PKK", en: "About the PKK Mobilization Team" }, org: { id: "Tim Penggerak PKK Pusat", en: "Central PKK Mobilization Team" }, url: "https://pkkpusat.id/" },
    ],
  },
};

function Article() {
  const t = useT();
  const { id } = Route.useParams();
  const a = ARTICLES[id] ?? ARTICLES["1"];
  const others = INSPIRASI.filter((x) => x.id !== id);
  const currentIndex = INSPIRASI.findIndex((x) => x.id === id);
  const prev = currentIndex > 0 ? INSPIRASI[currentIndex - 1] : null;
  const next = currentIndex < INSPIRASI.length - 1 ? INSPIRASI[currentIndex + 1] : null;
  const [heroReady, setHeroReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setHeroReady(true));
    return () => cancelAnimationFrame(raf);
  }, [id]);
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setIsAuthed(!!data.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session?.user);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const inner = (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgress />

      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {isAuthed ? (
            <>
              <Link
                to="/beranda"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> {t("Beranda", "Home")}
              </Link>
              <span className="font-mono text-[10px] tracking-[0.2em] text-primary font-bold">KARSA</span>
            </>
          ) : (
            <>
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
                <ArrowLeft className="w-4 h-4" /> {t("Beranda", "Home")}
              </Link>
            </>
          )}
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
            {t(a.kicker.id, a.kicker.en)}
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight drop-shadow-sm">
            {t(a.title.id, a.title.en)}
          </h1>
          <div className="mt-6 flex items-center gap-4 font-mono text-[11px] sm:text-xs uppercase tracking-widest opacity-90">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {t(a.read.id, a.read.en)}
            </span>
            <span className="opacity-60">•</span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> {t("Inspirasi Guru", "Teacher's Inspiration")}
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16 lg:py-20 animate-fade-in">
        <p className="font-serif text-xl sm:text-2xl leading-relaxed text-foreground border-l-4 border-primary pl-5 italic">
          {t(a.lede.id, a.lede.en)}
        </p>

        <article className="mt-10 font-serif text-[17px] sm:text-[19px] leading-[1.8] text-foreground space-y-6">
          {a.sections.map((s, i) => {
            if (s.kind === "h2") {
              return (
                <h2
                  key={i}
                  className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-10 mb-2"
                >
                  {t(s.text.id, s.text.en)}
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
                      {t(s.label.id, s.label.en)}
                    </p>
                    {s.cite && (
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {t("Sumber:", "Source:")} {t(s.cite.id, s.cite.en)}
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
                    "{t(s.text.id, s.text.en)}"
                  </p>
                  <footer className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    — {t(s.by.id, s.by.en)}
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
                      alt={t(s.alt.id, s.alt.en)}
                      width={1280}
                      height={832}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 font-sans text-xs sm:text-sm text-muted-foreground text-center italic">
                    {t(s.caption.id, s.caption.en)}
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
                {t(s.text.id, s.text.en)}
              </p>
            );
          })}
        </article>

        {/* Sources */}
        <section
          aria-labelledby="sumber-heading"
          className="mt-14 rounded-2xl border border-border/60 bg-surface/60 p-6 sm:p-8"
        >
          <h2
            id="sumber-heading"
            className="font-mono text-base sm:text-lg uppercase tracking-widest text-primary font-bold"
          >
            {t("Referensi", "References")}
          </h2>
          <ol className="mt-5 space-y-3 list-decimal list-inside marker:font-mono marker:text-muted-foreground">
            {a.sources.map((s, i) => (
              <li key={i} className="text-sm leading-relaxed">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary underline-offset-4 hover:underline transition-colors inline"
                >
                  <span className="font-semibold break-words">{t(s.label.id, s.label.en)}</span>
                  <ExternalLink className="inline-block w-3 h-3 shrink-0 align-middle ml-1 translate-y-[-0.5px]" />
                </a>
                <span className="block text-xs text-muted-foreground mt-0.5 ml-1">
                  {t(s.org.id, s.org.en)}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[11px] text-muted-foreground font-mono">
            {t(
              "Artikel disusun redaksi Karsa berdasarkan sumber-sumber di atas. Tautan eksternal mengarah ke situs lembaga terkait.",
              "Compiled by the Karsa editorial team based on the sources above. External links point to the respective institutions.",
            )}
          </p>
        </section>

        <div className="mt-10 grid sm:grid-cols-2 gap-4 animate-fade-in">
          {prev && (
            <Link
              to="/inspirasi/$id"
              params={{ id: prev.id }}
              className="group flex flex-col rounded-2xl border border-border/60 bg-surface p-5 hover:border-primary/30 hover:bg-primary-soft/30 transition-colors"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <ArrowLeft className="w-3 h-3" /> {t("Bacaan sebelumnya", "Previous read")}
              </span>
              <span className="mt-2 font-serif text-base sm:text-lg text-foreground leading-snug group-hover:text-primary transition-colors">
                {t(prev.title.id, prev.title.en)}
              </span>
            </Link>
          )}
          {next && (
            <Link
              to="/inspirasi/$id"
              params={{ id: next.id }}
              className={`group flex flex-col rounded-2xl border border-border/60 bg-surface p-5 hover:border-primary/30 hover:bg-primary-soft/30 transition-colors ${prev ? "sm:items-end sm:text-right" : "sm:col-span-2 sm:items-center sm:text-center"}`}
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {t("Bacaan berikutnya", "Next read")} <ArrowRight className="w-3 h-3" />
              </span>
              <span className="mt-2 font-serif text-base sm:text-lg text-foreground leading-snug group-hover:text-primary transition-colors">
                {t(next.title.id, next.title.en)}
              </span>
            </Link>
          )}
        </div>
      </section>

      {/* More articles */}
      {others.length > 0 && (
        <section className="border-t border-border/60 bg-surface/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
              {t("Bacaan Lainnya", "More Reads")}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t("Jelajahi inspirasi lain", "Explore more inspiration")}
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
                      alt={t(o.title.id, o.title.en)}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-surface/95 backdrop-blur text-primary text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {t(o.tag.id, o.tag.en)}
                    </span>
                  </div>
                  <div className="flex-1 p-4 sm:p-5 flex flex-col">
                    <h3 className="font-serif text-base sm:text-lg leading-snug text-foreground line-clamp-3 group-hover:text-primary transition-colors">
                      {t(o.title.id, o.title.en)}
                    </h3>
                    <div className="mt-auto pt-3 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-muted-foreground inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {t(o.read.id, o.read.en)}
                      </span>
                      <span className="text-accent font-semibold inline-flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                        <BookOpen className="w-3 h-3" /> {t("Baca", "Read")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {!isAuthed && (
        <footer className="border-t border-border/60 py-10 text-center text-xs text-muted-foreground">
          {t("© 2026 Karsa · Untuk anak-anak Indonesia", "© 2026 Karsa · For the children of Indonesia")}
        </footer>
      )}
    </div>
  );

  if (isAuthed) {
    return <PhoneShell hideNav>{inner}</PhoneShell>;
  }
  return inner;
}
