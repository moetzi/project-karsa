import indonesiaMap from "@/assets/indonesia-map.png";

type Point = {
  name: string;
  // percentage coordinates relative to the map image
  x: number;
  y: number;
  teachers: number;
};

const POINTS: Point[] = [
  { name: "Aceh", x: 9, y: 32, teachers: 4 },
  { name: "Sumatera Utara", x: 13, y: 43, teachers: 7 },
  { name: "Sumatera Barat", x: 15, y: 55, teachers: 5 },
  { name: "Lampung", x: 25, y: 70, teachers: 3 },
  { name: "DKI Jakarta", x: 32, y: 78, teachers: 12 },
  { name: "Jawa Tengah", x: 38, y: 80, teachers: 9 },
  { name: "Jawa Timur", x: 44, y: 80, teachers: 8 },
  { name: "Bali", x: 50, y: 82, teachers: 4 },
  { name: "NTT", x: 62, y: 86, teachers: 6 },
  { name: "Kalimantan Barat", x: 36, y: 50, teachers: 3 },
  { name: "Kalimantan Timur", x: 49, y: 50, teachers: 4 },
  { name: "Sulawesi Selatan", x: 55, y: 65, teachers: 7 },
  { name: "Sulawesi Utara", x: 64, y: 45, teachers: 3 },
  { name: "Maluku", x: 75, y: 60, teachers: 2 },
  { name: "Papua Barat", x: 83, y: 55, teachers: 2 },
  { name: "Papua", x: 92, y: 58, teachers: 3 },
];

export function IndonesiaImpactMap() {
  const totalTeachers = POINTS.reduce((s, p) => s + p.teachers, 0);
  const totalProvinces = POINTS.length;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-stretch">
      {/* Map */}
      <div className="relative rounded-2xl border border-border/60 bg-surface overflow-hidden">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(13,115,119,0.12), transparent 70%)",
          }}
        />
        <div className="relative aspect-[16/9]">
          <img
            src={indonesiaMap}
            alt="Peta sebaran kampanye Karsa di Indonesia"
            loading="lazy"
            width={1536}
            height={1024}
            className="absolute inset-0 w-full h-full object-contain"
          />
          {POINTS.map((p) => (
            <div
              key={p.name}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span
                className="block w-2.5 h-2.5 rounded-full bg-[#5eead4]"
                style={{
                  boxShadow:
                    "0 0 0 3px rgba(94,234,212,0.25), 0 0 12px 4px rgba(94,234,212,0.7), 0 0 24px 8px rgba(13,115,119,0.5)",
                  animation: "karsa-glow 2.4s ease-in-out infinite",
                }}
              />
              <span
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-md bg-foreground text-background px-2 py-1 text-[10px] font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 transition"
              >
                {p.name} · {p.teachers} guru
              </span>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes karsa-glow {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.35); opacity: 0.75; }
          }
        `}</style>
        <div className="relative flex items-center gap-3 px-5 py-3 border-t border-border/60 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#5eead4]" style={{ boxShadow: "0 0 6px 2px rgba(94,234,212,0.7)" }} />
            Titik guru Karsa
          </span>
          <span className="opacity-40">·</span>
          <span>Update terkini</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-4">
        <Stat label="Provinsi terjangkau" value={totalProvinces} suffix="prov." />
        <Stat label="Guru Karsa aktif" value={totalTeachers} suffix="guru" />
        <Stat label="Kampanye berjalan" value={38} suffix="kampanye" />
        <Stat label="Anak penerima manfaat" value={2480} suffix="anak" />
        <div className="rounded-2xl border border-border/60 bg-primary-soft/40 p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">Provinsi terbaru</p>
          <p className="mt-1 text-sm font-bold leading-snug">Papua Barat & Maluku</p>
          <p className="mt-1 text-xs text-muted-foreground">Inisiasi kampanye baru bulan ini.</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
        {value.toLocaleString("id-ID")}
        <span className="ml-1 text-xs font-mono font-normal text-muted-foreground uppercase tracking-widest">{suffix}</span>
      </p>
    </div>
  );
}
