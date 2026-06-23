import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, MapPin, Truck, ChevronRight, ArrowLeft, Share2, Sprout, Clock, Heart, NotebookPen, Users } from "lucide-react";
import { useT } from "@/lib/i18n";
import { campaigns, getCountdown } from "@/routes/nutrisi";
import { DonateSheet } from "@/components/DonateSheet";
import { useDonations } from "@/lib/donationStore";
import { useJournals } from "@/lib/journalsStore";
import { useCampaignClosed } from "@/lib/campaignStatusStore";

const ORIGIN = "https://project-karsa.lovable.app";

function findCampaign(id: string) {
  return campaigns.find((c) => c.id === id);
}

export const Route = createFileRoute("/k/$id")({
  loader: ({ params }) => {
    const c = findCampaign(params.id);
    if (!c) throw notFound();
    return { c };
  },
  head: ({ params, loaderData }) => {
    const c = loaderData?.c;
    const url = `${ORIGIN}/k/${params.id}`;
    if (!c) {
      return {
        meta: [
          { title: "Kampanye — Karsa" },
          { name: "description", content: "Dukung kampanye gizi sekolah di Karsa." },
          { property: "og:url", content: url },
        ],
      };
    }
    const title = `${c.title} — ${c.school}`;
    const desc = c.description.length > 200 ? c.description.slice(0, 197) + "…" : c.description;
    const image = c.hero.startsWith("http") ? c.hero : `${ORIGIN}${c.hero}`;
    return {
      meta: [
        { title: `${title} · Karsa` },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "og:image:alt", content: title },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DonateAction",
            name: c.title,
            description: desc,
            recipient: { "@type": "EducationalOrganization", name: c.school, address: c.region },
            url,
            image,
          }),
        },
      ],
    };
  },
  component: CampaignPublicPage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-6 text-center">
      <div>
        <h1 className="text-2xl font-extrabold">Kampanye tidak ditemukan</h1>
        <p className="text-sm text-muted-foreground mt-2">Tautan mungkin sudah berakhir atau salah ketik.</p>
        <Link to="/" className="inline-flex items-center gap-1 mt-5 text-primary font-semibold">
          <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
        </Link>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-6 text-center">
      <div>
        <h1 className="text-2xl font-extrabold">Gagal memuat kampanye</h1>
        <Link to="/" className="inline-flex items-center gap-1 mt-5 text-primary font-semibold">
          <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
        </Link>
      </div>
    </div>
  ),
});

function CampaignPublicPage() {
  const t = useT();
  const { c } = Route.useLoaderData();
  const [donateOpen, setDonateOpen] = useState(false);
  const donations = useDonations(c.id);
  const journals = useJournals(c.id);
  const closed = useCampaignClosed(c.id);
  const closingJournal = journals.find((j) => j.kind === "closing");
  const dailyJournals = journals.filter((j) => j.kind === "daily");

  const newRaised = donations.reduce((s, d) => s + d.amount, 0);
  const totalRaised = c.raised * 1_000_000 + newRaised;
  const targetRp = c.target * 1_000_000;
  const rawPct = Math.min(100, Math.round((totalRaised / targetRp) * 100));
  const pct = closed ? 100 : rawPct;
  const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");
  const disbursedAt = closed?.closedAt
    ? new Date(closed.closedAt).toISOString()
    : ("disbursedAt" in c ? (c as { disbursedAt?: string }).disbursedAt : undefined);

  const shareUrl = `${ORIGIN}/k/${c.id}`;
  const onShare = async () => {
    const data = { title: c.title, text: `Dukung "${c.title}" di Karsa.`, url: shareUrl };
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share(data); return; } catch {}
    }
    try { await navigator.clipboard?.writeText(shareUrl); } catch {}
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border/60">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="w-7 h-7 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <Sprout className="w-4 h-4" />
            </span>
            <span>Karsa</span>
          </Link>
          <button
            onClick={onShare}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border border-primary/30 bg-primary-soft/60 text-primary"
          >
            <Share2 className="w-3.5 h-3.5" /> {t("Bagikan", "Share")}
          </button>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-5 pb-32">
        <div className="relative h-56 sm:h-80 mt-5 rounded-2xl overflow-hidden">
          <img src={c.hero} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
          <div className="relative z-10 h-full p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 bg-surface/95 text-primary text-[11px] font-semibold px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3 h-3" /> {t("Terverifikasi", "Verified")}
              </span>
              {pct >= 100 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-primary text-primary-foreground">
                  {t("Dana Tersalurkan", "Funds Disbursed")}
                  {disbursedAt
                    ? ` · ${new Date(disbursedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`
                    : ""}
                </span>
              )}
            </div>
            <div className="text-white">
              {c.tmp && (
                <span className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm border border-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> {t("Dimasak oleh", "Cooked by")} {c.tmp}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold drop-shadow leading-tight">{c.title}</h1>
              <p className="text-xs flex items-center gap-1 mt-1 opacity-90">
                <MapPin className="w-3 h-3" /> {c.school} · {c.region}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-mono font-extrabold text-foreground">{fmt(totalRaised)}</span>
            <span className="font-mono text-muted-foreground">{t(`dari Rp ${c.target}jt`, `of Rp ${c.target}M`)}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full progress-gradient rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[11px]">
            <p className="text-muted-foreground">{t(`${pct}% terkumpul`, `${pct}% raised`)} · {c.recipients} {t("penerima", "recipients")}</p>
            {pct < 100 && (() => {
              const cd = getCountdown(("deadline" in c ? (c as { deadline?: string }).deadline : undefined));
              if (!cd) return null;
              return (
                <span className={"inline-flex items-center gap-1 font-mono font-semibold " + (cd.urgent ? "text-accent" : "text-foreground")}>
                  <Clock className="w-3 h-3" /> {t(cd.id, cd.en)}
                </span>
              );
            })()}
          </div>
        </div>

        <section className="mt-7">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold mb-2">
            {t("Deskripsi Kampanye", "Campaign Description")}
          </p>
          <p className="font-serif text-[14px] text-foreground leading-relaxed whitespace-pre-line">
            {c.description}
          </p>
        </section>

        <section className="mt-7 rounded-2xl border border-border/60 p-4 space-y-2 text-[13px]">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
            {t("Rantai Akuntabilitas", "Accountability Chain")}
          </p>
          <p className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-primary shrink-0" /><span className="text-muted-foreground">{t("Pemasok:", "Supplier:")}</span><span className="font-semibold text-foreground">{c.supplier}</span></p>
          {c.tmp && <p className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" /><span className="text-muted-foreground">{t("Dimasak:", "Cooked by:")}</span><span className="font-semibold text-foreground">{c.tmp}</span></p>}
          <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary shrink-0" /><span className="text-foreground">{c.region}</span></p>
        </section>

        {(pct >= 100 || closingJournal) && (
          <section className="mt-7 bg-primary-soft/40 rounded-2xl p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
              {t("Jurnal Penutup", "Closing Journal")} — {c.teacher.toUpperCase()}
            </p>
            <p className="font-serif italic text-[14px] text-foreground mt-2 leading-relaxed">
              "{closingJournal?.story || c.journal}"
            </p>
            {closingJournal && closingJournal.photos.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {closingJournal.photos.slice(0, 4).map((src, i) => (
                  <img key={i} src={src} alt="" className="aspect-square w-full object-cover rounded-lg border border-border/60" />
                ))}
              </div>
            )}
          </section>
        )}

        {dailyJournals.length > 0 && (
          <section className="mt-7">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                  {t("Jurnal Lapangan", "Field Journals")}
                </p>
                <h2 className="text-[18px] font-extrabold text-foreground mt-0.5">
                  {t("Bukti dari guru", "Proof from the teacher")}
                </h2>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                {dailyJournals.length} {t("entri", "entries")}
              </span>
            </div>
            <ul className="space-y-3">
              {dailyJournals.map((j) => (
                <li key={j.id} className="bg-surface rounded-2xl border border-border/60 overflow-hidden">
                  {j.photos.length > 0 && (
                    <div className={"grid gap-0.5 " + (j.photos.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                      {j.photos.slice(0, 4).map((src, i) => (
                        <img key={i} src={src} alt="" className="aspect-square w-full object-cover" />
                      ))}
                    </div>
                  )}
                  <div className="p-3.5 space-y-1.5">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <NotebookPen className="w-3 h-3" /> {new Date(j.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                    <p className="text-xs font-semibold text-foreground">🍽 {j.menu}</p>
                    <p className="text-[13px] font-serif text-foreground/85 leading-relaxed">"{j.story}"</p>
                    {(j.attendance || j.mood) && (
                      <p className="text-[11px] text-muted-foreground inline-flex items-center gap-2 pt-1">
                        {j.attendance != null && (<span className="inline-flex items-center gap-1"><Users className="w-3 h-3" /> {j.attendance} {t("anak", "kids")}</span>)}
                        {j.mood && <span>· {j.mood}</span>}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-8 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> {t("Semua kampanye", "All campaigns")}
          </Link>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ChevronRight className="w-3 h-3" /> {shareUrl}
          </span>
        </div>
      </article>

      {/* Sticky donate bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted-foreground">{t(`${pct}% dari ${fmt(targetRp)}`, `${pct}% of ${fmt(targetRp)}`)}</p>
            <p className="font-mono font-extrabold text-foreground text-sm truncate">{fmt(totalRaised)}</p>
          </div>
          {pct >= 100 ? (
            <span className="inline-flex items-center gap-1 text-primary font-bold text-sm">
              {t("Target Terpenuhi 🎉", "Target Met 🎉")}
            </span>
          ) : (
            <button
              onClick={() => setDonateOpen(true)}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground rounded-xl px-5 py-3 text-sm font-bold"
            >
              <Heart className="w-4 h-4" /> {t("Donasi Sekarang", "Donate Now")}
            </button>
          )}
        </div>
      </div>

      {donateOpen && (
        <DonateSheet
          campaign={{ id: c.id, title: c.title, school: c.school }}
          onClose={() => setDonateOpen(false)}
        />
      )}
    </div>
  );
}
