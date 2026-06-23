import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

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

    const system = `Anda adalah AI Copilot untuk guru honorer di daerah 3T (Terdepan, Terluar, Tertinggal) Indonesia.
Buat materi pembelajaran yang:
- Sesuai kurikulum SD Indonesia
- Menggunakan konteks lokal (pertanian, nelayan, alam sekitar)
- Menyelipkan edukasi gizi sederhana (telur, ikan, sayur lokal, daun kelor)
- Bahasa sederhana, mudah dipahami anak SD
- Praktis untuk kelas dengan keterbatasan alat`;

    const prompt = `Buat materi format ${data.format.toUpperCase()} untuk:
- Tingkat: ${data.kelas}
- Mata Pelajaran: ${data.mapel}
- Tujuan Pembelajaran: ${data.tujuan}
${data.konteks ? `- Konteks Lokal: ${data.konteks}` : ""}

Wajib sertakan:
1. ringkasan_rpp: ringkasan rencana pembelajaran 3-5 kalimat
2. cerita_literasi: cerita pendek 2-3 paragraf bertema lokal yang menguatkan tujuan
3. selipan_gizi: tips gizi sederhana 1-2 kalimat yang relevan dengan cerita
4. konten format (${data.format === "quiz" ? "5-10 soal pilihan ganda" : data.format === "flashcard" ? "6-15 kartu" : "5-10 slide"})`;

    try {
      const { text } = await generateText({
        model,
        system,
        prompt: `${prompt}\n\nKembalikan HANYA JSON valid (tanpa penjelasan, tanpa markdown fence) sesuai struktur yang diminta.`,
      });
      const parsed = schema.parse(extractJson(text));
      return { format: data.format, json: JSON.stringify(parsed) };
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

    const prompt = `Buat meal plan makan siang sekolah Senin–Jumat:
- Wilayah: ${data.region}
- Jumlah penerima: ${data.recipients} siswa
- Anggaran total: Rp ${data.target_amount.toLocaleString("id-ID")} (~Rp ${budgetPerPorsi.toLocaleString("id-ID")}/porsi/hari)
${data.supplier ? `- Pemasok lokal: ${data.supplier}` : ""}
${data.catatan ? `- Catatan: ${data.catatan}` : ""}

Hasilkan:
1. ringkasan: 1-2 kalimat tema meal plan
2. estimasi_per_porsi: estimasi biaya per porsi/hari (rupiah, angka saja)
3. estimasi_total_5hari: estimasi total 5 hari untuk semua siswa (rupiah, angka saja)
4. menu[5]: Senin–Jumat — setiap hari: nama menu lengkap, daftar bahan lokal, ringkasan kandungan gizi
5. tips: 1 kalimat tips memasak/penyajian untuk tim PKK/Posyandu`;

    try {
      const { text } = await generateText({
        model,
        system,
        prompt: `${prompt}\n\nKembalikan HANYA JSON valid (tanpa penjelasan, tanpa markdown fence) sesuai struktur yang diminta.`,
      });
      const parsed = MealPlanSchema.parse(extractJson(text));
      return { json: JSON.stringify(parsed) };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429")) throw new Error("Batas permintaan tercapai. Coba lagi sebentar.");
      if (msg.includes("402")) throw new Error("Kuota AI habis. Tambahkan kredit di pengaturan workspace.");
      throw new Error(`Gagal membuat meal plan: ${msg}`);
    }
  });
