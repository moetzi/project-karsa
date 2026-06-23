import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useT } from "@/lib/i18n";
import {
  ArrowLeft,
  Brain,
  HeartHandshake,
  MapPin,
  Sprout,
  WifiOff,
} from "lucide-react";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang Karsa — Karsa" },
      {
        name: "description",
        content:
          "Karsa adalah progressive web app dengan pendekatan dual pilar: Edu Co-pilot dan Kampanye Mikro Anti Stunting untuk guru di wilayah frontier (3T).",
      },
      { property: "og:title", content: "Tentang Karsa — Karsa" },
      {
        property: "og:description",
        content:
          "Progressive web app untuk guru Indonesia: pendamping pengajaran offline dan kampanye gizi sekolah transparan di daerah 3T.",
      },
    ],
  }),
  component: TentangPage,
});

function TentangPage() {
  const t = useT();

  return (
    <PhoneShell hideNav>
      <div className="px-6 pt-4 pb-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            to="/profil"
            className="w-10 h-10 rounded-full bg-surface border border-border/60 grid place-items-center hover:bg-muted/40 transition"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-[22px] font-extrabold text-foreground">
            {t("Tentang Karsa", "About Karsa")}
          </h1>
        </div>

        {/* Hero */}
        <section className="bg-surface rounded-2xl p-5 border border-border/60 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-[11px] font-bold uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5" />
            {t("v1.0.0 · PWA", "v1.0.0 · PWA")}
          </div>
          <p className="text-[15px] font-semibold leading-snug text-foreground">
            {t(
              "Karsa adalah progressive web app yang dibangun dengan pendekatan dual pilar: sebuah Edu Co-pilot dan Kampanye Mikro Anti Stunting, khusus untuk guru-guru Indonesia di wilayah frontier (3T).",
              "Karsa is a progressive web app built on a dual-pillar approach: an Edu Co-pilot and an Anti Stunting Micro Campaign, made for Indonesia's teachers in frontier (3T) regions.",
            )}
          </p>
          <p className="text-[13px] leading-relaxed text-muted-foreground font-serif">
            {t(
              "Didesain agar ringan, bisa diinstal ke layar utama, dan tetap berfungsi meski koneksi internet terbatas.",
              "Designed to be lightweight, installable on your home screen, and functional even when internet connectivity is limited.",
            )}
          </p>
        </section>

        {/* Dual pillars */}
        <section className="space-y-3">
          <h2 className="px-1 text-[14px] font-extrabold text-foreground">
            {t("Dua Pilar Karsa", "Karsa's Two Pillars")}
          </h2>

          <div className="bg-surface rounded-2xl p-5 border border-border/60 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary grid place-items-center">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-bold text-foreground">
                {t("Edu Co-pilot", "Edu Co-pilot")}
              </h3>
            </div>
            <p className="text-[13px] leading-relaxed text-muted-foreground font-serif">
              {t(
                "Asisten pengajar berbasis AI yang membantu guru merancang rencana pelaksanaan pembelajaran (RPP), materi flashcard, inspirasi kelas, dan bahan ajar yang bisa diunduh untuk diakses secara offline.",
                "An AI-powered teaching assistant that helps teachers design lesson plans (RPP), flashcards, classroom inspiration, and downloadable teaching materials for offline use.",
              )}
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-5 border border-border/60 space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-bold text-foreground">
                {t("Kampanye Mikro Anti Stunting", "Anti Stunting Micro Campaign")}
              </h3>
            </div>
            <p className="text-[13px] leading-relaxed text-muted-foreground font-serif">
              {t(
                "Platform galang dana dan transparansi gizi sekolah. Guru dapat mencatat jurnal harian pembelian, menu, serta dampak program, sementara publik dapat melihat perkembangan kampanye secara real-time.",
                "A school-nutrition fundraising and transparency platform. Teachers log daily purchase journals, menus, and program impact, while the public can follow each campaign's progress in real time.",
              )}
            </p>
          </div>
        </section>

        {/* Built for frontier */}
        <section className="bg-surface rounded-2xl p-5 border border-border/60 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent grid place-items-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-[15px] font-bold text-foreground">
              {t("Untuk Wilayah Frontier (3T)", "Built for Frontier (3T) Regions")}
            </h3>
          </div>
          <p className="text-[13px] leading-relaxed text-muted-foreground font-serif">
            {t(
              "Karsa dibuat dengan memperhatikan kondisi daerah Terdepan, Terluar, dan Tertinggal: sinyal tidak stabil, perangkat terbatas, dan kebutuhan akan solusi yang hemat data namun tetap powerful.",
              "Karsa is built with frontier, outermost, and disadvantaged regions in mind: unstable signal, limited devices, and the need for a data-light yet powerful solution.",
            )}
          </p>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-accent bg-accent-soft/40 rounded-xl px-3 py-2">
            <WifiOff className="w-3.5 h-3.5" />
            {t(
              "Materi tersimpan tetap bisa diakses tanpa internet.",
              "Saved materials remain accessible without the internet.",
            )}
          </div>
        </section>

        {/* Mission */}
        <section className="rounded-2xl p-5 space-y-3 progress-gradient text-white">
          <h3 className="text-[16px] font-extrabold">
            {t("Misi Kami", "Our Mission")}
          </h3>
          <p className="text-[13px] leading-relaxed opacity-90 font-serif">
            {t(
              "Memberdayakan guru sebagai agen perubahan: mengurangi beban administrasi, meningkatkan kualitas pembelajaran, dan memastikan setiap anak di daerah 3T mendapat gizi serta pendidikan yang layak.",
              "To empower teachers as agents of change: reducing administrative burden, improving lesson quality, and ensuring every child in 3T regions receives proper nutrition and education.",
            )}
          </p>
        </section>

        <p className="text-center text-[11px] font-mono text-muted-foreground pt-2">
          KARSA · 2026
        </p>
      </div>
    </PhoneShell>
  );
}
