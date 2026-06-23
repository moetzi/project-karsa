import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useEffect, useState, useCallback } from "react";
import { Sparkles, Layers, Wifi, Download, Check, BookOpen, HelpCircle, Presentation, ChevronRight, Loader2, Clock, Trash2, AlertCircle } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useServerFn } from "@tanstack/react-start";
import { generateMaterial } from "@/lib/ai.functions";
import { listMateri, saveMateri, deleteMateri, type StoredMateri, type MateriFormat } from "@/lib/materiStore";

export const Route = createFileRoute("/copilot")({
  ssr: false,
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
  const t = useT();
  const [tab, setTab] = useState<Tab>("generator");
  const [materi, setMateri] = useState<StoredMateri[]>([]);
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  const refresh = useCallback(async () => {
    setMateri(await listMateri());
  }, []);

  useEffect(() => {
    refresh();
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, [refresh]);

  return (
    <PhoneShell>
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-extrabold text-foreground">{t("AI Copilot", "AI Copilot")}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("Buat RPP & materi interaktif siap offline.", "Build lesson plans & interactive materials, offline-ready.")}
            </p>
          </div>
          <span className={"inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full " + (online ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground")}>
            <Wifi className="w-3 h-3" /> {online ? t("Online", "Online") : t("Offline", "Offline")}
          </span>
        </div>

        <div className="mt-5 bg-muted/70 rounded-2xl p-1 grid grid-cols-2 gap-1">
          <SegBtn active={tab === "generator"} onClick={() => setTab("generator")}>
            <Sparkles className="w-4 h-4" /> {t("Generator", "Generator")}
          </SegBtn>
          <SegBtn active={tab === "materi"} onClick={() => setTab("materi")}>
            <Layers className="w-4 h-4" /> {t("Materi Saya", "My Materials")}
            <span className="ml-1 bg-accent text-accent-foreground text-[10px] font-bold min-w-5 h-5 px-1 grid place-items-center rounded-full">{materi.length}</span>
          </SegBtn>
        </div>

        <div className="mt-6">
          {tab === "generator" ? (
            <Generator
              online={online}
              onSaved={async () => { await refresh(); setTab("materi"); }}
            />
          ) : (
            <MateriSaya items={materi} onDelete={async (id) => { await deleteMateri(id); await refresh(); }} />
          )}
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

function Generator({ online, onSaved }: { online: boolean; onSaved: () => void | Promise<void> }) {
  const t = useT();
  const generate = useServerFn(generateMaterial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kelas, setKelas] = useState("");
  const [mapel, setMapel] = useState("");
  const [format, setFormat] = useState<MateriFormat | "">("");
  const [tujuan, setTujuan] = useState("");
  const [konteks, setKonteks] = useState("");
  const canSubmit = !!kelas && !!mapel && !!format && tujuan.length > 5 && online;

  async function handleSubmit() {
    if (!canSubmit || !format) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generate({ data: { kelas, mapel, format, tujuan, konteks } });
      const parsed = JSON.parse(res.json) as Record<string, unknown>;
      await saveMateri({
        format: res.format,
        kelas, mapel, tujuan, konteks,
        data: parsed,
      });
      setKelas(""); setMapel(""); setFormat(""); setTujuan(""); setKonteks("");
      await onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="bg-surface rounded-2xl p-5 border border-border/60 space-y-5">
        <Field label={t("Tingkat Kelas", "Grade Level")}>
          <select
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground appearance-none border border-transparent focus:border-primary outline-none"
          >
            <option value="">{t("Pilih kelas...", "Select grade...")}</option>
            {["Kelas 1 SD","Kelas 2 SD","Kelas 3 SD","Kelas 4 SD","Kelas 5 SD","Kelas 6 SD"].map(k => <option key={k}>{k}</option>)}
          </select>
        </Field>

        <Field label={t("Mata Pelajaran", "Subject")}>
          <select
            value={mapel}
            onChange={(e) => setMapel(e.target.value)}
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground appearance-none border border-transparent focus:border-primary outline-none"
          >
            <option value="">{t("Pilih mata pelajaran...", "Select subject...")}</option>
            {["Bahasa Indonesia","Matematika","IPA","IPS","PPKn"].map(m => <option key={m}>{m}</option>)}
          </select>
        </Field>

        <Field label={t("Format Materi", "Material Format")}>
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: "quiz" as const, label: t("Quiz", "Quiz"), icon: <HelpCircle className="w-4 h-4" /> },
              { key: "flashcard" as const, label: t("Flashcard", "Flashcard"), icon: <Layers className="w-4 h-4" /> },
              { key: "slides" as const, label: t("Slide PPT", "PPT Slide"), icon: <Presentation className="w-4 h-4" /> },
            ]).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setFormat(opt.key)}
                className={
                  "flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-xs font-semibold transition border " +
                  (format === opt.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/60 text-foreground border-transparent hover:border-primary/30")
                }
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label={t("Tujuan Pembelajaran", "Learning Objective")}>
          <textarea
            value={tujuan}
            onChange={(e) => setTujuan(e.target.value)}
            rows={4}
            placeholder={t(
              "Contoh: Siswa mampu memahami konsep rantai makanan dalam ekosistem sawah dan menjelaskan peran produsen, konsumen, dan pengurai.",
              "Example: Students can understand food chains in rice-field ecosystems and explain the roles of producers, consumers, and decomposers.",
            )}
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground border border-transparent focus:border-primary outline-none resize-none placeholder:text-muted-foreground/70"
          />
        </Field>

        <Field label={t("Konteks Lokal (Opsional)", "Local Context (Optional)")}>
          <textarea
            value={konteks}
            onChange={(e) => setKonteks(e.target.value)}
            rows={3}
            placeholder={t(
              "Contoh: Mayoritas anak nelayan, sedang musim ikan tongkol...",
              "Example: Most children are from fishing families, currently tuna season...",
            )}
            className="w-full bg-muted/60 rounded-xl px-4 py-3 text-sm text-foreground border border-transparent focus:border-primary outline-none resize-none placeholder:text-muted-foreground/70"
          />
        </Field>

        {error && (
          <div className="flex items-start gap-2 bg-destructive/10 text-destructive rounded-xl p-3 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!online && (
          <div className="flex items-start gap-2 bg-muted text-muted-foreground rounded-xl p-3 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{t("Generator butuh koneksi. Materi yang sudah dibuat tetap bisa dibuka offline.", "Generator needs a connection. Saved materials still work offline.")}</span>
          </div>
        )}

        <button
          disabled={!canSubmit || loading}
          onClick={handleSubmit}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-95 transition"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {t("Membuat materi...", "Generating materials...")}</>
          ) : (
            <><Sparkles className="w-4 h-4" /> {t("Buat Rencana & Materi", "Generate Plan & Materials")}</>
          )}
        </button>
      </div>

      {!loading && (
        <div className="text-center py-6">
          <BookOpen className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {t("Isi form di atas untuk membuat RPP dan materi interaktif.", "Fill the form above to generate lesson plans and interactive materials.")}
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

function timeAgo(ts: number, t: ReturnType<typeof useT>) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return t("Baru saja", "Just now");
  if (m < 60) return t(`${m} menit lalu`, `${m} min ago`);
  const h = Math.floor(m / 60);
  if (h < 24) return t(`${h} jam lalu`, `${h}h ago`);
  const d = Math.floor(h / 24);
  return t(`${d} hari lalu`, `${d}d ago`);
}

function MateriSaya({ items, onDelete }: { items: StoredMateri[]; onDelete: (id: string) => void }) {
  const t = useT();

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-surface rounded-2xl border border-dashed border-border">
        <Layers className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
        <p className="text-sm font-semibold text-foreground">{t("Belum ada materi", "No materials yet")}</p>
        <p className="text-xs text-muted-foreground mt-1 px-6">
          {t("Buat materi pertama Anda dari tab Generator. Semua tersimpan offline.", "Create your first material from the Generator tab. All saved offline.")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        {t(`${items.length} materi tersimpan · Semua bisa digunakan tanpa internet`, `${items.length} saved · All usable offline`)}
      </p>
      {items.map((m) => (
        <MateriCard key={m.id} item={m} onDelete={() => onDelete(m.id)} />
      ))}
      <div className="pt-2">
        <Link
          to="/flashcard/$id"
          params={{ id: "alfabet-hewan" }}
          className="block bg-muted/60 rounded-xl p-4 border border-border/60 hover:border-primary/30 transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground">{t("Contoh: Alfabet Hewan", "Sample: Animal Alphabet")}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t("26 kartu bawaan · Demo flashcard", "26 built-in cards · Flashcard demo")}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>
      </div>
    </div>
  );
}

const tone: Record<MateriFormat, { ring: string; iconBg: string; iconColor: string; label: string; icon: React.ReactNode }> = {
  flashcard: { ring: "border-primary/30", iconBg: "bg-primary-soft", iconColor: "text-primary", label: "Flashcard", icon: <Layers className="w-5 h-5" /> },
  quiz: { ring: "border-accent/30", iconBg: "bg-accent-soft", iconColor: "text-accent", label: "Quiz", icon: <HelpCircle className="w-5 h-5" /> },
  slides: { ring: "border-border", iconBg: "bg-muted", iconColor: "text-muted-foreground", label: "Slide", icon: <Presentation className="w-5 h-5" /> },
};

function MateriCard({ item, onDelete }: { item: StoredMateri; onDelete: () => void }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const tn = tone[item.format];
  const d = item.data as Record<string, unknown>;
  const judul = (d.judul as string) ?? t("Materi tanpa judul", "Untitled material");

  return (
    <div className={"bg-surface rounded-2xl p-4 border " + tn.ring}>
      <div className="flex items-start gap-3">
        <div className={"w-10 h-10 rounded-xl grid place-items-center shrink-0 " + tn.iconBg + " " + tn.iconColor}>
          {tn.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-[15px] text-foreground">{judul}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded-full whitespace-nowrap">
              <Download className="w-2.5 h-2.5" /> {t("Offline", "Offline")}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">{tn.label} · {item.kelas} · {item.mapel}</p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> {timeAgo(item.createdAt, t)}
          </p>
        </div>
      </div>

      {open && <MateriDetail format={item.format} data={d} />}

      <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2">
        <button
          onClick={() => setOpen((s) => !s)}
          className="bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" /> {open ? t("Tutup", "Close") : t("Buka Materi", "Open Material")}
        </button>
        <button className="bg-primary-soft text-primary rounded-xl px-3 py-2.5 text-xs font-semibold border border-primary/30 flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" /> {t("Tersimpan", "Saved")}
        </button>
        <button
          onClick={onDelete}
          className="bg-muted text-muted-foreground rounded-xl px-3 py-2.5 hover:bg-destructive/10 hover:text-destructive transition"
          aria-label={t("Hapus", "Delete")}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function MateriDetail({ format, data }: { format: MateriFormat; data: Record<string, unknown> }) {
  const t = useT();
  const rpp = data.ringkasan_rpp as string | undefined;
  const cerita = data.cerita_literasi as string | undefined;
  const gizi = data.selipan_gizi as string | undefined;

  return (
    <div className="mt-4 space-y-3 border-t border-border/60 pt-4">
      {rpp && (
        <Section label={t("Ringkasan RPP", "Lesson Plan Summary")}>
          <p className="text-[13px] text-foreground/85 leading-relaxed">{rpp}</p>
        </Section>
      )}
      {cerita && (
        <Section label={t("Cerita Literasi", "Literacy Story")}>
          <p className="text-[13px] text-foreground/85 leading-relaxed whitespace-pre-line">{cerita}</p>
        </Section>
      )}
      {gizi && (
        <Section label={t("Selipan Gizi", "Nutrition Tip")}>
          <p className="text-[13px] text-foreground/85 leading-relaxed bg-accent-soft/40 rounded-lg p-2.5">🥚 {gizi}</p>
        </Section>
      )}

      {format === "quiz" && Array.isArray(data.soal) && (
        <Section label={t("Soal", "Questions")}>
          <ol className="space-y-3 text-[13px]">
            {(data.soal as Array<{ pertanyaan: string; pilihan: string[]; jawaban_index: number }>).map((q, i) => (
              <li key={i} className="bg-muted/40 rounded-lg p-3">
                <p className="font-semibold text-foreground">{i + 1}. {q.pertanyaan}</p>
                <ul className="mt-2 space-y-1">
                  {q.pilihan.map((p, pi) => (
                    <li key={pi} className={"px-2 py-1 rounded " + (pi === q.jawaban_index ? "bg-primary/15 text-primary font-semibold" : "text-foreground/80")}>
                      {String.fromCharCode(65 + pi)}. {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {format === "flashcard" && Array.isArray(data.kartu) && (
        <Section label={t("Kartu", "Cards")}>
          <div className="grid grid-cols-2 gap-2">
            {(data.kartu as Array<{ depan: string; belakang: string }>).map((k, i) => (
              <div key={i} className="bg-muted/40 rounded-lg p-3 text-[12px]">
                <p className="font-bold text-foreground">{k.depan}</p>
                <p className="text-muted-foreground mt-1">{k.belakang}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {format === "slides" && Array.isArray(data.slide) && (
        <Section label={t("Slide", "Slides")}>
          <ol className="space-y-2 text-[13px]">
            {(data.slide as Array<{ judul: string; poin: string[] }>).map((s, i) => (
              <li key={i} className="bg-muted/40 rounded-lg p-3">
                <p className="font-semibold text-foreground">{i + 1}. {s.judul}</p>
                <ul className="mt-1.5 list-disc list-inside text-foreground/80 space-y-0.5">
                  {s.poin.map((p, pi) => <li key={pi}>{p}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </Section>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1.5">{label}</p>
      {children}
    </div>
  );
}
