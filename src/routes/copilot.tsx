import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useState } from "react";
import { Sparkles, Layers, Wifi, Download, Check, BookOpen, HelpCircle, Presentation, ChevronRight, Loader2, Clock } from "lucide-react";

export const Route = createFileRoute("/copilot")({
  head: () => ({
    meta: [
      { title: "AI Copilot — Karsa" },
      { name: "description", content: "Generator RPP & materi interaktif siap offline." },
    ],
  }),
  component: Copilot,
});

type Tab = "generator" | "materi";

function Copilot() {
  const [tab, setTab] = useState<Tab>("generator");
  return (
    <PhoneShell>
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-extrabold text-foreground">AI Copilot</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Buat RPP & materi interaktif siap offline.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-primary-soft text-primary text-[11px] font-semibold px-2.5 py-1 rounded-full">
            <Wifi className="w-3 h-3" /> Online
          </span>
        </div>

        {/* Segmented control */}
        <div className="mt-5 bg-muted/70 rounded-2xl p-1 grid grid-cols-2 gap-1">
          <SegBtn active={tab === "generator"} onClick={() => setTab("generator")}>
            <Sparkles className="w-4 h-4" /> Generator
          </SegBtn>
          <SegBtn active={tab === "materi"} onClick={() => setTab("materi")}>
            <Layers className="w-4 h-4" /> Materi Saya
            <span className="ml-1 bg-accent text-accent-foreground text-[10px] font-bold w-5 h-5 grid place-items-center rounded-full">3</span>
          </SegBtn>
        </div>

        <div className="mt-6">
          {tab === "generator" ? <Generator /> : <MateriSaya />}
        </div>
      </div>
    </PhoneShell>
  );
}

function SegBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={
        "flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all " +
        (active ? "bg-surface text-primary shadow-sm" : "text-muted-foreground")
      }
    >
      {children}
    </button>
  );
}

function Generator() {
  const [loading, setLoading] = useState(false);
  const [kelas, setKelas] = useState("");
  const [mapel, setMapel] = useState("");
  const [tujuan, setTujuan] = useState("");
  const canSubmit = kelas && mapel && tujuan.length > 5;

  return (
    <div className="space-y-5">
      <div className="bg-surface rounded-2xl p-5 border border-border/60 space-y-5">
        <Field label="Tingkat Kelas">
          <select
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground appearance-none border border-transparent focus:border-primary outline-none"
          >
            <option value="">Pilih kelas...</option>
            <option>Kelas 1 SD</option>
            <option>Kelas 2 SD</option>
            <option>Kelas 3 SD</option>
            <option>Kelas 4 SD</option>
            <option>Kelas 5 SD</option>
            <option>Kelas 6 SD</option>
          </select>
        </Field>

        <Field label="Mata Pelajaran">
          <select
            value={mapel}
            onChange={(e) => setMapel(e.target.value)}
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground appearance-none border border-transparent focus:border-primary outline-none"
          >
            <option value="">Pilih mata pelajaran...</option>
            <option>Bahasa Indonesia</option>
            <option>Matematika</option>
            <option>IPA</option>
            <option>IPS</option>
            <option>PPKn</option>
          </select>
        </Field>

        <Field label="Tujuan Pembelajaran">
          <textarea
            value={tujuan}
            onChange={(e) => setTujuan(e.target.value)}
            rows={4}
            placeholder="Contoh: Siswa mampu memahami konsep rantai makanan dalam ekosistem sawah dan menjelaskan peran produsen, konsumen, dan pengurai."
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground border border-transparent focus:border-primary outline-none resize-none placeholder:text-muted-foreground/70"
          />
        </Field>

        <button
          disabled={!canSubmit || loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2200);
          }}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-95 transition"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Membuat materi...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Buat Rencana & Materi</>
          )}
        </button>
      </div>

      {!loading && (
        <div className="text-center py-6">
          <BookOpen className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Isi form di atas untuk membuat RPP dan materi interaktif.
          </p>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
        {label} <span className="text-accent">*</span>
      </label>
      {children}
    </div>
  );
}

function MateriSaya() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        3 materi tersimpan · Semua bisa digunakan tanpa internet
      </p>

      <MateriCard
        type="flashcard"
        icon={<Layers className="w-5 h-5" />}
        title="Alfabet Hewan"
        meta="26 kartu · Kelas 1 SD · Bahasa Indonesia"
        time="Hari ini, 10:30"
        desc="Kartu bergambar A-Z dengan hewan lokal Indonesia. Cocok untuk belajar alfabet Kelas 1 SD."
        cta={{ label: "Mulai Belajar", to: "/flashcard/alfabet-hewan" }}
      />

      <MateriCard
        type="quiz"
        icon={<HelpCircle className="w-5 h-5" />}
        title="Berhitung Ceria"
        meta="10 soal · Kelas 2 SD · Matematika"
        time="Kemarin, 14:15"
        desc="Berapa hasil dari 7 + 5?"
        quiz
      />

      <MateriCard
        type="slides"
        icon={<Presentation className="w-5 h-5" />}
        title="Struktur Tanaman"
        meta="12 slide · Kelas 4 SD · IPA"
        time="2 hari lalu"
        desc="Slide interaktif tentang bagian-bagian tanaman dan fungsinya."
      />
    </div>
  );
}

type CardType = "flashcard" | "quiz" | "slides";
const tone: Record<CardType, { ring: string; iconBg: string; iconColor: string }> = {
  flashcard: { ring: "border-primary/30", iconBg: "bg-primary-soft", iconColor: "text-primary" },
  quiz: { ring: "border-accent/30", iconBg: "bg-accent-soft", iconColor: "text-accent" },
  slides: { ring: "border-border", iconBg: "bg-muted", iconColor: "text-muted-foreground" },
};

function MateriCard({
  type, icon, title, meta, time, desc, cta, quiz,
}: {
  type: CardType;
  icon: React.ReactNode;
  title: string;
  meta: string;
  time: string;
  desc: string;
  cta?: { label: string; to: string };
  quiz?: boolean;
}) {
  const [saved, setSaved] = useState(true);
  const t = tone[type];

  return (
    <div className={"bg-surface rounded-2xl p-4 border " + t.ring}>
      <div className="flex items-start gap-3">
        <div className={"w-10 h-10 rounded-xl grid place-items-center shrink-0 " + t.iconBg + " " + t.iconColor}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-[15px] text-foreground">{title}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded-full whitespace-nowrap">
              <Download className="w-2.5 h-2.5" /> Offline
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">{meta}</p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> {time}
          </p>
        </div>
      </div>

      {quiz ? (
        <div className="mt-3 bg-accent-soft/40 rounded-xl p-3">
          <p className="text-xs font-semibold text-foreground mb-2">{desc}</p>
          <div className="grid grid-cols-2 gap-2">
            {["10", "11", "12", "13"].map((n) => (
              <button
                key={n}
                className={
                  "rounded-full py-1.5 text-xs font-semibold border " +
                  (n === "12"
                    ? "bg-primary/15 border-primary/30 text-primary"
                    : "bg-surface border-border text-foreground")
                }
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-[13px] text-foreground/80 leading-relaxed pl-13">{desc}</p>
      )}

      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        {cta ? (
          <Link
            to={cta.to as "/"}
            className="bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> {cta.label}
          </Link>
        ) : (
          <button className="bg-primary-soft text-primary rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" /> Buka Materi <ChevronRight className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={() => setSaved((s) => !s)}
          className={
            "rounded-xl px-4 py-2.5 text-xs font-semibold border transition-colors flex items-center gap-1.5 " +
            (saved
              ? "bg-primary-soft border-primary/30 text-primary"
              : "bg-surface border-border text-muted-foreground")
          }
        >
          {saved ? <><Check className="w-3.5 h-3.5" /> Tersimpan</> : <><Download className="w-3.5 h-3.5" /> Unduh Offline</>}
        </button>
      </div>
    </div>
  );
}
