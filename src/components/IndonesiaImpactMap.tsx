import { useMemo, useState } from "react";
import indonesiaMapAsset from "@/assets/indonesia-map.png.asset.json";
import { MapPin, Users } from "lucide-react";

const indonesiaMap = indonesiaMapAsset.url;

type Province = {
  name: string;
  capital: string;
  lat: number;
  lng: number;
  teachers: number;
  campaigns: number;
  since: string;
};

// Real coordinates of provincial capitals where Karsa campaigns are active.
const PROVINCES: Province[] = [
  { name: "Aceh", capital: "Banda Aceh", lat: 5.55, lng: 95.32, teachers: 4, campaigns: 3, since: "Mar 2024" },
  { name: "Sumatera Utara", capital: "Medan", lat: 3.59, lng: 98.67, teachers: 7, campaigns: 5, since: "Jan 2024" },
  { name: "Sumatera Barat", capital: "Padang", lat: -0.95, lng: 100.35, teachers: 5, campaigns: 4, since: "Feb 2024" },
  { name: "Sumatera Selatan", capital: "Palembang", lat: -2.99, lng: 104.76, teachers: 4, campaigns: 3, since: "Apr 2024" },
  { name: "Lampung", capital: "Bandar Lampung", lat: -5.43, lng: 105.27, teachers: 3, campaigns: 2, since: "Mei 2024" },
  { name: "DKI Jakarta", capital: "Jakarta", lat: -6.21, lng: 106.85, teachers: 12, campaigns: 9, since: "Okt 2023" },
  { name: "Jawa Barat", capital: "Bandung", lat: -6.91, lng: 107.61, teachers: 10, campaigns: 7, since: "Nov 2023" },
  { name: "Jawa Tengah", capital: "Semarang", lat: -6.99, lng: 110.42, teachers: 9, campaigns: 6, since: "Des 2023" },
  { name: "DI Yogyakarta", capital: "Yogyakarta", lat: -7.80, lng: 110.36, teachers: 5, campaigns: 4, since: "Jan 2024" },
  { name: "Jawa Timur", capital: "Surabaya", lat: -7.25, lng: 112.75, teachers: 8, campaigns: 6, since: "Nov 2023" },
  { name: "Bali", capital: "Denpasar", lat: -8.65, lng: 115.22, teachers: 4, campaigns: 3, since: "Feb 2024" },
  { name: "Nusa Tenggara Timur", capital: "Kupang", lat: -10.18, lng: 123.61, teachers: 6, campaigns: 4, since: "Mar 2024" },
  { name: "Kalimantan Barat", capital: "Pontianak", lat: -0.03, lng: 109.33, teachers: 3, campaigns: 2, since: "Apr 2024" },
  { name: "Kalimantan Selatan", capital: "Banjarmasin", lat: -3.32, lng: 114.59, teachers: 3, campaigns: 2, since: "Mei 2024" },
  { name: "Kalimantan Timur", capital: "Samarinda", lat: -0.50, lng: 117.15, teachers: 4, campaigns: 3, since: "Mar 2024" },
  { name: "Sulawesi Selatan", capital: "Makassar", lat: -5.13, lng: 119.42, teachers: 7, campaigns: 5, since: "Jan 2024" },
  { name: "Sulawesi Tengah", capital: "Palu", lat: -0.90, lng: 119.87, teachers: 3, campaigns: 2, since: "Mei 2024" },
  { name: "Sulawesi Utara", capital: "Manado", lat: 1.49, lng: 124.84, teachers: 3, campaigns: 2, since: "Apr 2024" },
  { name: "Maluku", capital: "Ambon", lat: -3.70, lng: 128.18, teachers: 2, campaigns: 1, since: "Jun 2024" },
  { name: "Papua Barat", capital: "Manokwari", lat: -0.86, lng: 134.06, teachers: 2, campaigns: 1, since: "Jun 2024" },
  { name: "Papua", capital: "Jayapura", lat: -2.54, lng: 140.72, teachers: 3, campaigns: 2, since: "Mar 2024" },
];

// Calibrated linear projection from lat/lng → image % coordinates.
// Anchored on Banda Aceh (top-left) and Jayapura (right side) of the rendered map.
function project(lat: number, lng: number) {
  const x = (lng - 95) * 1.816 + 9;
  const y = 32 - (lat - 5.5) * 3.93;
  return { x, y };
}

export function IndonesiaImpactMap() {
  const [selectedId, setSelectedId] = useState<string>("DKI Jakarta");

  const totals = useMemo(() => {
    const teachers = PROVINCES.reduce((s, p) => s + p.teachers, 0);
    const campaigns = PROVINCES.reduce((s, p) => s + p.campaigns, 0);
    return { teachers, campaigns, provinces: PROVINCES.length };
  }, []);

  const selected = PROVINCES.find((p) => p.name === selectedId) ?? PROVINCES[0];

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-stretch">
      {/* Map */}
      <div className="relative rounded-2xl border border-border/60 bg-surface overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 55%, rgba(13,115,119,0.18), transparent 70%)",
          }}
        />
        <div className="relative aspect-[16/9]">
          <img
            src={indonesiaMap}
            alt="Peta sebaran kampanye Karsa di Indonesia"
            loading="lazy"
            width={1536}
            height={1024}
            className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
            draggable={false}
          />

          {/* Legend overlay */}
          <div className="absolute top-3 left-3 z-10 rounded-xl border border-border/60 bg-background/85 backdrop-blur px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Legenda</p>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full bg-[#5eead4] shrink-0"
                style={{ boxShadow: "0 0 0 3px rgba(94,234,212,0.25), 0 0 10px 3px rgba(94,234,212,0.7)" }}
              />
              <span className="text-[11px] font-semibold">Titik guru Karsa</span>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">Klik untuk detail provinsi</p>
          </div>

          {/* Points */}
          {PROVINCES.map((p) => {
            const { x, y } = project(p.lat, p.lng);
            const isActive = p.name === selected.name;
            const size = Math.min(14, 6 + Math.sqrt(p.teachers) * 1.6);
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => setSelectedId(p.name)}
                aria-label={`${p.name} — ${p.teachers} guru`}
                aria-pressed={isActive}
                className="group absolute -translate-x-1/2 -translate-y-1/2 z-20 focus:outline-none"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      width: size * 4,
                      height: size * 4,
                      background:
                        "radial-gradient(circle, rgba(94,234,212,0.45), transparent 70%)",
                      animation: "karsa-ring 1.8s ease-out infinite",
                    }}
                  />
                )}
                <span
                  className="block rounded-full bg-[#5eead4] transition-transform group-hover:scale-125"
                  style={{
                    width: size,
                    height: size,
                    boxShadow: isActive
                      ? "0 0 0 3px rgba(94,234,212,0.35), 0 0 18px 6px rgba(94,234,212,0.9), 0 0 36px 12px rgba(13,115,119,0.6)"
                      : "0 0 0 2px rgba(94,234,212,0.25), 0 0 10px 3px rgba(94,234,212,0.6), 0 0 22px 7px rgba(13,115,119,0.45)",
                    animation: "karsa-glow 2.4s ease-in-out infinite",
                  }}
                />
                <span
                  className="pointer-events-none absolute left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap rounded-md bg-foreground text-background px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition"
                >
                  {p.name} · {p.teachers} guru
                </span>
              </button>
            );
          })}
        </div>
        <style>{`
          @keyframes karsa-glow {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.75; }
          }
          @keyframes karsa-ring {
            0% { transform: translate(-50%, -50%) scale(0.4); opacity: 0.9; }
            100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
          }
        `}</style>
      </div>

      {/* Stats + detail panel */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          <MiniStat label="Provinsi" value={totals.provinces} />
          <MiniStat label="Guru" value={totals.teachers} />
          <MiniStat label="Kampanye" value={totals.campaigns} />
        </div>

        <div className="rounded-2xl border border-primary/30 bg-primary-soft/40 p-5 relative">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">Detail provinsi</p>
              <p className="mt-1 text-lg font-extrabold leading-tight">{selected.name}</p>
              <p className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {selected.capital}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-background/70 p-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Guru aktif</p>
              <p className="mt-0.5 text-xl font-extrabold flex items-center gap-1">
                <Users className="w-4 h-4 text-primary" /> {selected.teachers}
              </p>
            </div>
            <div className="rounded-lg bg-background/70 p-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Kampanye</p>
              <p className="mt-0.5 text-xl font-extrabold">{selected.campaigns}</p>
            </div>
          </div>
          <p className="mt-3 text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
            Sejak {selected.since}
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-surface p-4 max-h-56 overflow-auto">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Semua provinsi</p>
          <ul className="space-y-1">
            {PROVINCES.map((p) => (
              <li key={p.name}>
                <button
                  type="button"
                  onClick={() => setSelectedId(p.name)}
                  className={`w-full flex items-center justify-between text-left text-xs px-2 py-1.5 rounded-md transition ${
                    p.name === selected.name
                      ? "bg-primary text-primary-foreground font-bold"
                      : "hover:bg-muted"
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="font-mono opacity-80">{p.teachers}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface p-3 text-center">
      <p className="text-2xl font-extrabold leading-none">{value}</p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
