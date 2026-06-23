import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function extractJson(raw: string): unknown {
  let cleaned = raw
    .replace(/^```json\s*/im, "")
    .replace(/^```\s*/im, "")
    .replace(/```\s*$/im, "")
    .trim();
  if (!cleaned.startsWith("{") && !cleaned.startsWith("[")) {
    const objStart = cleaned.indexOf("{");
    const arrStart = cleaned.indexOf("[");
    const isArray = arrStart !== -1 && (objStart === -1 || arrStart < objStart);
    const start = isArray ? arrStart : objStart;
    const end = isArray ? cleaned.lastIndexOf("]") : cleaned.lastIndexOf("}");
    if (start === -1 || end <= start) throw new Error("Output AI bukan JSON valid.");
    cleaned = cleaned.slice(start, end + 1);
  }
  return JSON.parse(cleaned);
}

const GenerateMaterialInput = z.object({
  kelas: z.string().min(1),
  mapel: z.string().min(1),
  format: z.enum(["quiz", "flashcard", "slides"]),
  tujuan: z.string().min(5).max(1000),
  konteks: z.string().max(1000).optional().default(""),
});

const QuizSchema = z.object({
  judul: z.string(),
  ringkasan_rpp: z.string(),
  cerita_literasi: z.string(),
  selipan_gizi: z.string(),
  soal: z.array(
    z.object({
      pertanyaan: z.string(),
      pilihan: z.array(z.string()),
      jawaban_index: z.number().int(),
    }),
  ),
});

const FlashcardSchema = z.object({
  judul: z.string(),
  ringkasan_rpp: z.string(),
  cerita_literasi: z.string(),
  selipan_gizi: z.string(),
  kartu: z.array(
    z.object({ depan: z.string(), belakang: z.string() }),
  ),
});

const SlidesSchema = z.object({
  judul: z.string(),
  ringkasan_rpp: z.string(),
  cerita_literasi: z.string(),
  selipan_gizi: z.string(),
  slide: z.array(
    z.object({ judul: z.string(), poin: z.array(z.string()) }),
  ),
});

export const generateMaterial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => GenerateMaterialInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Lovable AI belum dikonfigurasi.");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const schema =
      data.format === "quiz" ? QuizSchema :
      data.format === "flashcard" ? FlashcardSchema : SlidesSchema;

    const system = `Anda adalah Edu Copilot untuk guru honorer di daerah 3T (Terdepan, Terluar, Tertinggal) Indonesia.
Buat materi pembelajaran yang:
- Sesuai kurikulum SD Indonesia
- Menggunakan konteks lokal (pertanian, nelayan, alam sekitar)
- Menyelipkan edukasi gizi sederhana (telur, ikan, sayur lokal, daun kelor)
- Bahasa sederhana, mudah dipahami anak SD
- Praktis untuk kelas dengan keterbatasan alat`;

    const skeleton =
      data.format === "quiz"
        ? `{
  "judul": "string",
  "ringkasan_rpp": "string",
  "cerita_literasi": "string",
  "selipan_gizi": "string",
  "soal": [ { "pertanyaan": "string", "pilihan": ["a","b","c","d"], "jawaban_index": 0 } ]
}`
        : data.format === "flashcard"
        ? `{
  "judul": "string",
  "ringkasan_rpp": "string",
  "cerita_literasi": "string",
  "selipan_gizi": "string",
  "kartu": [ { "depan": "string", "belakang": "string" } ]
}`
        : `{
  "judul": "string",
  "ringkasan_rpp": "string",
  "cerita_literasi": "string",
  "selipan_gizi": "string",
  "slide": [ { "judul": "string", "poin": ["string"] } ]
}`;

    const contentKey =
      data.format === "quiz" ? "soal (5-10 item)" :
      data.format === "flashcard" ? "kartu (6-15 item)" : "slide (5-10 item)";

    const prompt = `Buat materi format ${data.format.toUpperCase()} untuk:
- Tingkat: ${data.kelas}
- Mata Pelajaran: ${data.mapel}
- Tujuan Pembelajaran: ${data.tujuan}
${data.konteks ? `- Konteks Lokal: ${data.konteks}` : ""}

WAJIB kembalikan HANYA JSON valid (tanpa markdown fence, tanpa penjelasan) dengan struktur PERSIS seperti contoh berikut. Nama field harus identik (dalam bahasa Indonesia), jangan diterjemahkan atau diganti:
${skeleton}

Catatan isi:
- judul: judul materi singkat
- ringkasan_rpp: 3-5 kalimat rencana pembelajaran
- cerita_literasi: cerita 2-3 paragraf bertema lokal
- selipan_gizi: 1-2 kalimat tips gizi
- ${contentKey}`;

    try {
      const { text } = await generateText({ model, system, prompt });
      let raw: unknown;
      try {
        raw = extractJson(text);
      } catch (e) {
        console.error("[generateMaterial] invalid JSON:", text);
        throw e;
      }
      const result = schema.safeParse(raw);
      if (!result.success) {
        console.error("[generateMaterial] schema mismatch. Raw:", text, "Issues:", result.error.issues);
        throw new Error("Format respons AI tidak sesuai. Silakan coba lagi.");
      }
      return { format: data.format, json: JSON.stringify(result.data) };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429")) throw new Error("Batas permintaan tercapai. Coba lagi sebentar.");
      if (msg.includes("402")) throw new Error("Kuota AI habis. Tambahkan kredit di pengaturan workspace.");
      throw new Error(`Gagal membuat materi: ${msg}`);
    }
  });

/* ===================== AI Meal Planner (Sen–Jum) ===================== */

const MealPlanInput = z.object({
  region: z.string().min(1).max(120),
  recipients: z.number().int().min(1).max(2000),
  target_amount: z.number().int().min(1).max(1_000_000_000),
  supplier: z.string().max(200).optional().default(""),
  catatan: z.string().max(500).optional().default(""),
});

const MealPlanSchema = z.object({
  ringkasan: z.string(),
  estimasi_per_porsi: z.number(),
  estimasi_total_5hari: z.number(),
  menu: z.array(
    z.object({
      hari: z.string(),
      menu: z.string(),
      bahan_lokal: z.array(z.string()),
      kandungan_gizi: z.string(),
    }),
  ),
  tips: z.string(),
});

export const generateMealPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => MealPlanInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Lovable AI belum dikonfigurasi.");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const budgetPerPorsi = Math.round(data.target_amount / data.recipients / 5);

    const system = `Anda adalah ahli gizi & meal planner untuk program makan siang sekolah di daerah 3T (Terdepan, Terluar, Tertinggal) Indonesia.
Aturan wajib:
- Gunakan bahan pangan LOKAL khas wilayah yang disebutkan (ikan, sayur, umbi, daun kelor, dll)
- Menu seimbang: karbohidrat + protein hewani/nabati + sayur, sesekali buah
- Realistis untuk dimasak Posyandu/PKK desa
- Hemat: sesuai anggaran per porsi
- Variasi 5 hari, tidak boleh menu sama 2 hari berturut-turut`;

    const skeleton = `{
  "ringkasan": "string",
  "estimasi_per_porsi": 0,
  "estimasi_total_5hari": 0,
  "menu": [
    { "hari": "Senin", "menu": "string", "bahan_lokal": ["string"], "kandungan_gizi": "string" },
    { "hari": "Selasa", "menu": "string", "bahan_lokal": ["string"], "kandungan_gizi": "string" },
    { "hari": "Rabu", "menu": "string", "bahan_lokal": ["string"], "kandungan_gizi": "string" },
    { "hari": "Kamis", "menu": "string", "bahan_lokal": ["string"], "kandungan_gizi": "string" },
    { "hari": "Jumat", "menu": "string", "bahan_lokal": ["string"], "kandungan_gizi": "string" }
  ],
  "tips": "string"
}`;

    const prompt = `Buat meal plan makan siang sekolah Senin–Jumat:
- Wilayah: ${data.region}
- Jumlah penerima: ${data.recipients} siswa
- Anggaran total: Rp ${data.target_amount.toLocaleString("id-ID")} (~Rp ${budgetPerPorsi.toLocaleString("id-ID")}/porsi/hari)
${data.supplier ? `- Pemasok lokal: ${data.supplier}` : ""}
${data.catatan ? `- Catatan: ${data.catatan}` : ""}

WAJIB kembalikan HANYA JSON valid (tanpa markdown fence, tanpa penjelasan) dengan struktur PERSIS seperti contoh berikut. Nama field harus identik (bahasa Indonesia), jangan diterjemahkan atau diganti. Tidak boleh ada field yang undefined/null — isi semua field untuk setiap hari Senin–Jumat:
${skeleton}

Catatan isi:
- ringkasan: 1-2 kalimat tema meal plan
- estimasi_per_porsi: angka rupiah per porsi/hari (number, bukan string)
- estimasi_total_5hari: angka rupiah total 5 hari untuk semua siswa (number)
- menu: array berisi 5 objek (Senin–Jumat). Setiap objek WAJIB punya "hari", "menu" (nama menu lengkap), "bahan_lokal" (array string, minimal 3 bahan), "kandungan_gizi" (1 kalimat)
- tips: 1 kalimat tips memasak untuk tim PKK/Posyandu`;

    try {
      const { text } = await generateText({ model, system, prompt });
      let raw: unknown;
      try {
        raw = extractJson(text);
      } catch (e) {
        console.error("[generateMealPlan] invalid JSON:", text);
        throw e;
      }
      const result = MealPlanSchema.safeParse(raw);
      if (!result.success) {
        console.error("[generateMealPlan] schema mismatch. Raw:", text, "Issues:", result.error.issues);
        throw new Error("Format respons AI tidak sesuai. Silakan coba lagi.");
      }
      return { json: JSON.stringify(result.data) };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429")) throw new Error("Batas permintaan tercapai. Coba lagi sebentar.");
      if (msg.includes("402")) throw new Error("Kuota AI habis. Tambahkan kredit di pengaturan workspace.");
      throw new Error(`Gagal membuat meal plan: ${msg}`);
    }
  });
