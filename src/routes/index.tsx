import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, GraduationCap, ShieldCheck, X, Sprout, Clock, BookOpen, Brain, HeartHandshake, WifiOff, FileCheck2, Camera, Receipt, ChevronDown, ChevronLeft, ChevronRight, Languages } from "lucide-react";
import { campaigns, CampaignCard } from "@/routes/nutrisi";
import { INSPIRASI } from "@/lib/inspirasi";
import { IndonesiaImpactMap } from "@/components/IndonesiaImpactMap";
import { useClosedMap } from "@/lib/campaignStatusStore";
import { useLang, useT } from "@/lib/i18n";

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

function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "id" ? "en" : "id")}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted transition"
      aria-label="Toggle language"
      title={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
    >
      <Languages className="w-3.5 h-3.5" />
      {lang === "id" ? "EN" : "ID"}
    </button>
  );
}

function Landing() {
  const [portalOpen, setPortalOpen] = useState(false);
  const closedMap = useClosedMap();
  const t = useT();
  const { lang } = useLang();

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
            <a href="#tentang" className="hover:text-foreground">{t("Tentang", "About")}</a>
            <a href="#cara" className="hover:text-foreground">{t("Cara Kerja", "How it Works")}</a>
            <a href="#dampak" className="hover:text-foreground">{t("Dampak", "Impact")}</a>
            <a href="#kampanye" className="hover:text-foreground">{t("Kampanye", "Campaigns")}</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={() => setPortalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
            >
              <GraduationCap className="w-4 h-4" />
              {t("Portal Guru", "Teacher Portal")}
            </button>
          </div>
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
              <ShieldCheck className="w-3.5 h-3.5" /> {t("Diverifikasi NUPTK & Dapodik", "Verified via NUPTK & Dapodik")}
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              {t("Di pelosok negeri,", "In the most remote corners,")}<br />
              <span className="text-primary">{t("seorang guru menolak menyerah.", "a teacher refuses to give up.")}</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              {t(
                "Mereka tahu nama setiap muridnya. Mereka tahu siapa yang datang ke sekolah dengan perut kosong. Karsa berdiri di samping mereka — agar setiap rupiah donasi Anda berubah menjadi sepiring makanan hangat hari ini, bukan janji bertahun kemudian.",
                "They know every student by name. They know who comes to school on an empty stomach. Karsa stands beside them — so every rupiah you give becomes a warm plate of food today, not a promise years from now."
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#kampanye"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3.5 text-sm font-bold hover:opacity-95 transition shadow-lg shadow-primary/20"
              >
                <Heart className="w-4 h-4" /> {t("Mulai Berdonasi", "Start Donating")}
              </a>
              <a
                href="#cara"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-semibold hover:bg-muted transition"
              >
                {t("Lihat Cara Kerja", "See How It Works")}
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {(() => {
                const completed = campaigns.filter((c) => c.pct >= 100 || closedMap[c.id]);
                const recipients = completed.reduce((s, c) => s + c.recipients, 0);
                const teachers = 142;
                const completedRaised = completed.reduce((s, c) => s + (closedMap[c.id] ? c.target : c.raised), 0);
                const completedTarget = completed.reduce((s, c) => s + c.target, 0);
                const dana = completedTarget > 0 ? Math.min(100, Math.round((completedRaised / completedTarget) * 100)) : 0;
                const locale = lang === "en" ? "en-US" : "id-ID";
                return [
                  { v: recipients.toLocaleString(locale), l: t("Anak terbantu", "Children helped") },
                  { v: teachers.toLocaleString(locale), l: t("Guru aktif", "Active teachers") },
                  { v: `${dana}%`, l: t("Dana tersalur", "Funds distributed") },
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
            {(() => {
              const hero = campaigns[0]!;
              const photo = hero.journalPhotos?.[0];
              return (
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-border/60 relative">
                  {photo && (
                    <img
                      src={photo}
                      alt={t("Jurnal Pak Budi — Robinson makan bergizi", "Pak Budi's journal — Robinson eating a nutritious meal")}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute left-4 right-4 top-4 rounded-2xl border border-white/30 bg-white/15 backdrop-blur-xl p-4 shadow-lg">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/90 font-bold">
                      {t("Jurnal Guru", "Teacher's Journal")} · {hero.teacher}
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-white line-clamp-5">
                      {hero.description}
                    </p>
                  </div>
                </div>
              );
            })()}
            <div className="absolute -bottom-6 -left-6 bg-surface rounded-2xl border border-border/60 shadow-lg p-4 max-w-[220px]">
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">{t("Kampanye Aktif", "Active Campaign")}</p>
              <p className="mt-1 text-sm font-bold leading-snug">{t("Gizi Sehat Desa Kolaka", "Healthy Meals, Kolaka Village")}</p>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-accent" style={{ width: "56%" }} />
              </div>
              <p className="mt-1 text-[10px] font-mono text-muted-foreground">{t("56% dari Rp 15jt", "56% of Rp 15M")}</p>
            </div>
          </div>

        </div>
      </section>

      {/* Dampak */}
      <section id="dampak" className="max-w-6xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">{t("Dampak Karsa", "Karsa's Impact")}</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">{t("Sebaran kampanye di seluruh Nusantara", "Campaigns spread across the archipelago")}</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {t(
              "Setiap titik bercahaya adalah seorang guru Karsa yang sedang memimpin kampanye gizi di provinsinya. Hover pada titik untuk melihat detail.",
              "Each glowing dot is a Karsa teacher leading a nutrition campaign in their province. Hover a dot to see details."
            )}
          </p>
        </div>
        <div className="mt-10">
          <IndonesiaImpactMap />
        </div>
      </section>

      {/* Tentang */}
      <section id="tentang" className="max-w-6xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">{t("Tentang Karsa", "About Karsa")}</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
              {t("Bukan platform donasi biasa.", "Not your ordinary donation platform.")}<br />
              <span className="text-primary">{t("Ini ruang kerja para guru.", "This is the teachers' workspace.")}</span>
            </h2>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              {lang === "id" ? (
                <>Karsa adalah aplikasi web (PWA) ringan yang dirancang khusus untuk guru-guru di wilayah <span className="font-semibold text-foreground">Terdepan, Terluar, dan Tertinggal (3T)</span> — tempat sinyal sering hilang, perangkat terbatas, dan satu guru sering menanggung banyak peran sekaligus.</>
              ) : (
                <>Karsa is a lightweight progressive web app built for teachers in Indonesia's <span className="font-semibold text-foreground">frontier, outermost, and underdeveloped (3T) regions</span> — where signal disappears, devices are limited, and a single teacher often carries many roles at once.</>
              )}
            </p>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              {t(
                "Kami percaya orang yang paling tahu kebutuhan seorang anak adalah gurunya sendiri. Maka kami serahkan kendalinya: guru yang mengajukan, guru yang membelanjakan, guru yang melaporkan. Karsa hanya menyediakan jembatan paling pendek antara niat baik Anda dan piring murid mereka.",
                "We believe the person who knows a child's needs best is their own teacher. So we hand over the controls: teachers propose, teachers spend, teachers report. Karsa simply provides the shortest bridge between your goodwill and their students' plates."
              )}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: HeartHandshake, color: "primary", t: t("Kampanye Anti Stunting", "Anti-Stunting Campaigns"), d: t("Guru menggalang dana mikro untuk makan bergizi di sekolahnya, dengan laporan transparan yang bisa dipantau siapa pun.", "Teachers raise micro-funds for nutritious meals at their schools, with transparent reports anyone can follow.") },
              { icon: Brain, color: "accent", t: t("Edu Co-pilot", "Edu Co-pilot"), d: t("Pendamping mengajar berbasis AI: RPP, flashcard, dan materi yang bisa diunduh dan tetap berfungsi tanpa internet.", "An AI teaching companion: lesson plans, flashcards, and materials that can be downloaded and used offline.") },
              { icon: ShieldCheck, color: "primary", t: t("Identitas Terverifikasi", "Verified Identity"), d: t("Setiap guru divalidasi lewat NUPTK/PegID + NPSN. Tidak ada akun anonim, tidak ada kampanye fiktif.", "Every teacher is validated via NUPTK/PegID + NPSN. No anonymous accounts, no fictitious campaigns.") },
              { icon: WifiOff, color: "accent", t: t("Dibuat untuk Sinyal Tipis", "Built for Weak Signal"), d: t("Hemat data, bisa dipasang di layar utama, dan tetap bisa diakses meski koneksi datang dan pergi.", "Data-light, installable on the home screen, and still accessible when the connection comes and goes.") },
            ].map((card) => (
              <div key={card.t} className="bg-surface rounded-2xl border border-border/60 p-5">
                <div className={`w-10 h-10 rounded-xl ${card.color === "primary" ? "bg-primary-soft text-primary" : "bg-accent-soft text-accent"} grid place-items-center`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <h3 className="mt-3 font-bold">{card.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara Kerja */}
      <section id="cara" className="max-w-6xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">{t("Cara Kerja", "How It Works")}</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
            {t(
              "Dari niat baik Anda ke piring anak-anak — dalam lima langkah jelas.",
              "From your goodwill to the children's plates — in five clear steps."
            )}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {t(
              "Kami sengaja membuat alurnya pendek dan mudah dipantau, agar setiap donasi bisa Anda ikuti hingga benar-benar menjadi makanan di meja kelas.",
              "We deliberately kept the flow short and easy to follow, so you can trace every donation until it really becomes food on a classroom table."
            )}
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { icon: ShieldCheck, t: t("1. Verifikasi guru", "1. Teacher verified"), d: t("Identitas guru divalidasi lewat NUPTK/PegID dan NPSN sekolahnya sebelum bisa membuat kampanye.", "A teacher's identity is validated via NUPTK/PegID and their school's NPSN before they can launch a campaign.") },
            { icon: FileCheck2, t: t("2. Kampanye dibuka", "2. Campaign opens"), d: t("Guru menulis cerita murid-muridnya, kebutuhan gizi, target dana, dan jumlah anak yang akan terbantu.", "The teacher writes their students' story, nutrition needs, funding target, and how many children will benefit.") },
            { icon: Heart, t: t("3. Anda berdonasi", "3. You donate"), d: t("Donasi mengalir langsung ke kampanye pilihan Anda — tanpa potongan platform, sekecil apa pun nominalnya.", "Your donation flows directly to the campaign you choose — with no platform cut, however small the amount.") },
            { icon: Receipt, t: t("4. Guru belanja", "4. Teacher shops"), d: t("Guru membeli bahan makanan ke pemasok lokal terdekat dan menyimpan bukti belanja atau bukti makan bersama.", "The teacher buys food from the nearest local supplier and keeps the shopping receipt or proof of the shared meal.") },
            { icon: Camera, t: t("5. Jurnal terbuka", "5. Open journal"), d: t("Foto, deskripsi alokasi, dan kesan anak-anak diunggah ke jurnal dan dipublikasikan otomatis untuk semua orang.", "Photos, allocation notes, and the children's impressions are uploaded to the journal and published automatically for everyone.") },
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
            <span className="font-bold">{t("Komitmen kami:", "Our commitment:")}</span>{" "}
            {t(
              "100% donasi Anda sampai ke kampanye. Karsa tidak memotong biaya platform. Biaya operasional kami ditanggung terpisah oleh mitra, agar setiap rupiah benar-benar bekerja untuk anak-anak.",
              "100% of your donation reaches the campaign. Karsa takes no platform fee. Our operating costs are covered separately by partners, so every rupiah truly works for the children."
            )}
          </p>
        </div>
      </section>

      {/* Kampanye */}
      <section id="kampanye" className="max-w-6xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">{t("Kampanye Aktif", "Active Campaigns")}</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">{t("Pilih satu kelas. Ubah satu cerita.", "Pick one classroom. Change one story.")}</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">{t("Setiap kampanye di bawah ini ditulis sendiri oleh guru yang mengenal nama setiap muridnya.", "Every campaign below is written by a teacher who knows every student by name.")}</p>
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

      {/* Inspirasi */}
      <section id="inspirasi" className="max-w-6xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">{t("Pojok Inspirasi Guru", "Teachers' Inspiration Corner")}</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">{t("Bacaan pilihan untuk donatur", "Curated reads for donors")}</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">{t("Pahami konteks gizi anak Indonesia & dampak nyata dari donasi Anda.", "Understand the context of child nutrition in Indonesia & the real impact of your donation.")}</p>
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
                  alt={a.title[lang]}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 bg-surface/95 backdrop-blur text-primary text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  {a.tag[lang]}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="flex-1 font-serif text-base leading-snug text-foreground line-clamp-3">{a.title[lang]}</h3>
                <div className="mt-auto pt-4 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-muted-foreground inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {a.read[lang]}
                  </span>
                  <span className="text-accent font-semibold inline-flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                    <BookOpen className="w-3 h-3" /> {t("Baca", "Read")}
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
          <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">{t("Pertanyaan yang sering ditanyakan", "Frequently asked questions")}</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">{t("Hal yang mungkin ingin Anda tahu sebelum ikut", "Things you might want to know before joining")}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{t("Pilih sudut pandang Anda — kami siapkan jawaban yang berbeda untuk donatur dan guru.", "Pick your perspective — we've prepared different answers for donors and teachers.")}</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-10">
          {/* Donatur */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary grid place-items-center">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-lg">{t("Untuk Donatur", "For Donors")}</h3>
            </div>
            <div className="space-y-3">
              {[
                {
                  q: t("Apakah benar 100% donasi saya sampai ke anak-anak?", "Does 100% of my donation really reach the children?"),
                  a: t(
                    "Ya. Karsa tidak memotong biaya platform sama sekali. Yang Anda transfer adalah yang dibelanjakan guru. Biaya operasional kami ditanggung mitra di luar kanal donasi.",
                    "Yes. Karsa takes no platform fee at all. What you transfer is what the teacher spends. Our operating costs are covered by partners outside the donation channel."
                  ),
                },
                {
                  q: t("Bagaimana saya bisa yakin uangnya tidak disalahgunakan?", "How can I be sure the funds are not misused?"),
                  a: t(
                    "Setiap kampanye dibuat oleh guru yang identitasnya sudah diverifikasi (NUPTK/PegID + NPSN). Guru wajib mengunggah jurnal berisi foto bukti belanja atau bukti makan bersama, foto makanan, deskripsi alokasi, dan kesan murid — semuanya bisa Anda baca langsung di halaman kampanye.",
                    "Every campaign is created by a teacher whose identity is verified (NUPTK/PegID + NPSN). Teachers must upload a journal with shopping or shared-meal proof, food photos, allocation notes, and student impressions — all readable directly on the campaign page."
                  ),
                },
                {
                  q: t("Berapa donasi minimum?", "What's the minimum donation?"),
                  a: t(
                    "Tidak ada minimum yang menyakitkan. Mulai dari nominal yang Anda nyaman — bahkan Rp 10.000 sudah cukup untuk satu porsi makan bergizi di banyak daerah.",
                    "No painful minimum. Start with whatever you're comfortable with — even Rp 10,000 is enough for one nutritious meal in many regions."
                  ),
                },
                {
                  q: t("Apakah saya dapat bukti donasi?", "Will I get a donation receipt?"),
                  a: t(
                    "Ya. Anda akan menerima konfirmasi donasi, dan ketika jurnal kampanye diperbarui, laporannya bisa diakses publik — termasuk oleh Anda.",
                    "Yes. You'll receive a donation confirmation, and when the campaign journal is updated, the report becomes publicly accessible — including to you."
                  ),
                },
                {
                  q: t("Apakah saya bisa memilih kampanye tertentu?", "Can I choose a specific campaign?"),
                  a: t(
                    "Tentu. Anda bebas memilih kampanye di provinsi atau sekolah yang dekat di hati Anda — bukan dana umum yang acak.",
                    "Of course. You're free to choose a campaign in the province or school closest to your heart — not a random general fund."
                  ),
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
              <h3 className="font-extrabold text-lg">{t("Untuk Guru", "For Teachers")}</h3>
            </div>
            <div className="space-y-3">
              {[
                {
                  q: t("Siapa yang boleh membuat kampanye di Karsa?", "Who is allowed to create a campaign on Karsa?"),
                  a: t(
                    "Guru aktif di Indonesia yang memiliki NUPTK atau PegID dan terdaftar di sekolah ber-NPSN. Verifikasi dilakukan sebelum kampanye pertama Anda terbit.",
                    "Active teachers in Indonesia with a NUPTK or PegID, registered at a school with an NPSN. Verification happens before your first campaign goes live."
                  ),
                },
                {
                  q: t("Apa saja yang perlu saya laporkan?", "What do I need to report?"),
                  a: t(
                    "Cukup unggah foto bukti belanja (struk/nota) atau bukti makan bersama dan foto makanan yang dibuat. Lalu isi jurnal dengan deskripsi alokasi pengeluaran, tanggal, serta kesan anak yang terbantu. Tidak perlu laporan formal yang panjang.",
                    "Just upload a photo of the shopping proof (receipt/invoice) or proof of the shared meal, plus a photo of the food. Then fill the journal with a description of how funds were allocated, the date, and the children's impressions. No long formal report needed."
                  ),
                },
                {
                  q: t("Apakah saya butuh internet stabil?", "Do I need a stable internet connection?"),
                  a: t(
                    "Tidak. Karsa adalah aplikasi web yang ringan, bisa dipasang di layar utama HP, dan banyak fitur — termasuk materi Edu Co-pilot — tetap bisa diakses tanpa koneksi.",
                    "No. Karsa is a lightweight web app, installable on your phone's home screen, and many features — including Edu Co-pilot materials — remain accessible offline."
                  ),
                },
                {
                  q: t("Apakah ada biaya bagi guru?", "Is there any cost for teachers?"),
                  a: t(
                    "Tidak ada. Karsa gratis untuk guru, baik untuk membuka kampanye gizi maupun memakai Edu Co-pilot.",
                    "None. Karsa is free for teachers, both for opening nutrition campaigns and for using Edu Co-pilot."
                  ),
                },
                {
                  q: t("Bagaimana jika target donasi tidak tercapai?", "What if the donation target isn't met?"),
                  a: t(
                    "Dana yang sudah terkumpul tetap bisa Anda salurkan untuk anak-anak sesuai skala yang memungkinkan. Yang penting setiap rupiah tetap tercatat dan terlapor di jurnal.",
                    "The funds already collected can still be distributed to the children at whatever scale is feasible. What matters is that every rupiah remains recorded and reported in the journal."
                  ),
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
            {t(
              "Satu donasi hari ini = satu piring nasi panas besok.",
              "One donation today = one warm plate of rice tomorrow."
            )}
          </h3>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t(
              "Anak-anak di pelosok tidak butuh janji besar. Mereka butuh sarapan. Guru mereka sudah hadir setiap pagi — sekarang giliran kita berdiri di samping mereka.",
              "Children in remote areas don't need grand promises. They need breakfast. Their teachers already show up every morning — now it's our turn to stand beside them."
            )}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <a
              href="#kampanye"
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3.5 text-sm font-bold hover:opacity-95 transition shadow-lg shadow-primary/20"
            >
              <Heart className="w-4 h-4" /> {t("Donasi sekarang", "Donate now")}
            </a>
            <button
              onClick={() => setPortalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold hover:bg-muted transition"
            >
              <GraduationCap className="w-4 h-4" /> {t("Saya seorang guru", "I'm a teacher")}
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10 text-center text-xs text-muted-foreground">
        {t("© 2026 Karsa · Untuk anak-anak Indonesia", "© 2026 Karsa · For the children of Indonesia")}
      </footer>

      {portalOpen && <TeacherPortalModal onClose={() => setPortalOpen(false)} />}
    </div>
  );
}

function TeacherPortalModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const t = useT();
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-md bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="font-bold">{t("Portal Guru", "Teacher Portal")}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            {t(
              "Hanya guru terverifikasi (NUPTK / PegID + NPSN) yang dapat membuat kampanye.",
              "Only verified teachers (NUPTK / PegID + NPSN) can create campaigns."
            )}
          </p>
          <button
            onClick={() => { onClose(); navigate({ to: "/auth" }); }}
            className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-bold text-sm hover:opacity-95 transition inline-flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> {t("Masuk / Daftar", "Sign in / Register")}
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
