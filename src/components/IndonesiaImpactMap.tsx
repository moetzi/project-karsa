import { useEffect, useMemo, useState } from "react";
import { MapPin, Users } from "lucide-react";
import "leaflet/dist/leaflet.css";

type Province = {
  name: string;
  capital: string;
  lat: number;
  lng: number;
  teachers: number;
  campaigns: number;
  since: string;
};

const PROVINCES: Province[] = [
  { name: "Aceh", capital: "Banda Aceh", lat: 5.548, lng: 95.3238, teachers: 4, campaigns: 3, since: "Mar 2024" },
  { name: "Sumatera Utara", capital: "Medan", lat: 3.5952, lng: 98.6722, teachers: 7, campaigns: 5, since: "Jan 2024" },
  { name: "Sumatera Barat", capital: "Padang", lat: -0.9492, lng: 100.3543, teachers: 5, campaigns: 4, since: "Feb 2024" },
  { name: "Riau", capital: "Pekanbaru", lat: 0.5104, lng: 101.4383, teachers: 3, campaigns: 2, since: "Apr 2024" },
  { name: "Kepulauan Riau", capital: "Tanjung Pinang", lat: 0.9143, lng: 104.4565, teachers: 2, campaigns: 2, since: "Mei 2024" },
  { name: "Jambi", capital: "Jambi", lat: -1.6104, lng: 103.6131, teachers: 3, campaigns: 2, since: "Mei 2024" },
  { name: "Sumatera Selatan", capital: "Palembang", lat: -2.9761, lng: 104.7754, teachers: 4, campaigns: 3, since: "Apr 2024" },
  { name: "Bangka Belitung", capital: "Pangkal Pinang", lat: -2.1204, lng: 106.1167, teachers: 2, campaigns: 1, since: "Jun 2024" },
  { name: "Bengkulu", capital: "Bengkulu", lat: -3.7858, lng: 102.2603, teachers: 2, campaigns: 1, since: "Jun 2024" },
  { name: "Lampung", capital: "Bandar Lampung", lat: -5.45, lng: 105.2667, teachers: 3, campaigns: 2, since: "Mei 2024" },
  { name: "DKI Jakarta", capital: "Jakarta", lat: -6.2088, lng: 106.8456, teachers: 12, campaigns: 9, since: "Okt 2023" },
  { name: "Jawa Barat", capital: "Bandung", lat: -6.9175, lng: 107.6191, teachers: 10, campaigns: 7, since: "Nov 2023" },
  { name: "Jawa Tengah", capital: "Semarang", lat: -6.9667, lng: 110.4167, teachers: 9, campaigns: 6, since: "Des 2023" },
  { name: "DI Yogyakarta", capital: "Yogyakarta", lat: -7.8014, lng: 110.3644, teachers: 5, campaigns: 4, since: "Jan 2024" },
  { name: "Jawa Timur", capital: "Surabaya", lat: -7.2575, lng: 112.7521, teachers: 8, campaigns: 6, since: "Nov 2023" },
  { name: "Banten", capital: "Serang", lat: -6.1136, lng: 106.1492, teachers: 3, campaigns: 2, since: "Apr 2024" },
  { name: "Bali", capital: "Denpasar", lat: -8.65, lng: 115.2167, teachers: 4, campaigns: 3, since: "Feb 2024" },
  { name: "Nusa Tenggara Barat", capital: "Mataram", lat: -8.5833, lng: 116.1167, teachers: 3, campaigns: 2, since: "Mei 2024" },
  { name: "Nusa Tenggara Timur", capital: "Kupang", lat: -10.1667, lng: 123.5833, teachers: 6, campaigns: 4, since: "Mar 2024" },
  { name: "Kalimantan Barat", capital: "Pontianak", lat: -0.0263, lng: 109.3425, teachers: 3, campaigns: 2, since: "Apr 2024" },
  { name: "Kalimantan Tengah", capital: "Palangka Raya", lat: -2.21, lng: 113.9153, teachers: 3, campaigns: 2, since: "Mei 2024" },
  { name: "Kalimantan Selatan", capital: "Banjarbaru", lat: -3.45, lng: 114.8, teachers: 3, campaigns: 2, since: "Mei 2024" },
  { name: "Kalimantan Timur", capital: "Samarinda", lat: -0.4833, lng: 117.15, teachers: 4, campaigns: 3, since: "Mar 2024" },
  { name: "Kalimantan Utara", capital: "Tanjung Selor", lat: 2.8467, lng: 117.3719, teachers: 2, campaigns: 1, since: "Jun 2024" },
  { name: "Sulawesi Utara", capital: "Manado", lat: 1.4748, lng: 124.8421, teachers: 3, campaigns: 2, since: "Apr 2024" },
  { name: "Sulawesi Tengah", capital: "Palu", lat: -0.8972, lng: 119.8703, teachers: 3, campaigns: 2, since: "Mei 2024" },
  { name: "Sulawesi Selatan", capital: "Makassar", lat: -5.1476, lng: 119.4327, teachers: 7, campaigns: 5, since: "Jan 2024" },
  { name: "Sulawesi Tenggara", capital: "Kendari", lat: -3.9667, lng: 122.5167, teachers: 2, campaigns: 1, since: "Jun 2024" },
  { name: "Gorontalo", capital: "Gorontalo", lat: 0.545, lng: 123.0581, teachers: 2, campaigns: 1, since: "Jun 2024" },
  { name: "Sulawesi Barat", capital: "Mamuju", lat: -2.6725, lng: 118.8939, teachers: 2, campaigns: 1, since: "Jun 2024" },
  { name: "Maluku", capital: "Ambon", lat: -3.6964, lng: 128.1814, teachers: 2, campaigns: 1, since: "Jun 2024" },
  { name: "Maluku Utara", capital: "Sofifi", lat: -0.7186, lng: 127.5719, teachers: 2, campaigns: 1, since: "Jun 2024" },
  { name: "Papua", capital: "Jayapura", lat: -2.5333, lng: 140.7167, teachers: 3, campaigns: 2, since: "Mar 2024" },
  { name: "Papua Barat", capital: "Manokwari", lat: -0.8667, lng: 134.0833, teachers: 2, campaigns: 1, since: "Jun 2024" },
  { name: "Papua Selatan", capital: "Merauke", lat: -8.5492, lng: 140.4044, teachers: 1, campaigns: 1, since: "Jun 2024" },
  { name: "Papua Tengah", capital: "Nabire", lat: -3.3681, lng: 135.49, teachers: 1, campaigns: 1, since: "Jun 2024" },
  { name: "Papua Pegunungan", capital: "Wamena", lat: -4.1092, lng: 138.9547, teachers: 1, campaigns: 1, since: "Jun 2024" },
  { name: "Papua Barat Daya", capital: "Sorong", lat: -0.8839, lng: 131.2533, teachers: 1, campaigns: 1, since: "Jun 2024" },
];

function LeafletMap({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (name: string) => void;
}) {
  const [Comp, setComp] = useState<null | {
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    CircleMarker: typeof import("react-leaflet").CircleMarker;
    Tooltip: typeof import("react-leaflet").Tooltip;
  }>(null);

  useEffect(() => {
    let mounted = true;
    import("react-leaflet").then((mod) => {
      if (mounted) {
        setComp({
          MapContainer: mod.MapContainer,
          TileLayer: mod.TileLayer,
          CircleMarker: mod.CircleMarker,
          Tooltip: mod.Tooltip,
        });
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!Comp) {
    return (
      <div className="absolute inset-0 grid place-items-center text-xs font-mono text-muted-foreground">
        Memuat peta…
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Tooltip } = Comp;

  return (
    <MapContainer
      center={[-2.5, 118]}
      zoom={4}
      minZoom={4}
      maxZoom={8}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", background: "#021b1e" }}
      worldCopyJump={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {PROVINCES.map((p) => {
        const isActive = p.name === selectedId;
        const radius = Math.min(14, 5 + Math.sqrt(p.teachers) * 1.6);
        return (
          <CircleMarker
            key={p.name}
            center={[p.lat, p.lng]}
            radius={radius}
            pathOptions={{
              color: "#5eead4",
              weight: isActive ? 3 : 1.5,
              fillColor: "#5eead4",
              fillOpacity: isActive ? 0.95 : 0.75,
            }}
            className={isActive ? "karsa-marker-active" : "karsa-marker"}
            eventHandlers={{
              click: () => onSelect(p.name),
            }}
          >
            <Tooltip direction="top" offset={[0, -radius]} opacity={1}>
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {p.name} · {p.teachers} guru
              </span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
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
      <div className="relative rounded-2xl border border-border/60 bg-[#021b1e] overflow-hidden">
        <div className="relative aspect-[16/9]">
          <LeafletMap selectedId={selectedId} onSelect={setSelectedId} />

          {/* Legend overlay */}
          <div className="absolute top-3 left-3 z-[400] rounded-xl border border-border/60 bg-background/85 backdrop-blur px-3 py-2 pointer-events-none">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Legenda</p>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full bg-[#5eead4] shrink-0"
                style={{ boxShadow: "0 0 0 3px rgba(94,234,212,0.25), 0 0 10px 3px rgba(94,234,212,0.7)" }}
              />
              <span className="text-[11px] font-semibold">Titik guru Karsa</span>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">Klik titik untuk detail provinsi</p>
          </div>
        </div>

        <style>{`
          .leaflet-container { font-family: inherit; }
          .leaflet-tile-pane { filter: hue-rotate(150deg) saturate(1.4) brightness(0.95); }
          .karsa-marker path,
          .karsa-marker-active path { filter: drop-shadow(0 0 6px rgba(94,234,212,0.9)) drop-shadow(0 0 14px rgba(13,115,119,0.7)); }
          .karsa-marker-active { animation: karsa-pulse 1.8s ease-in-out infinite; }
          @keyframes karsa-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.55; }
          }
          .leaflet-tooltip {
            background: hsl(var(--foreground)) !important;
            color: hsl(var(--background)) !important;
            border: none !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
          }
          .leaflet-tooltip-top:before { border-top-color: hsl(var(--foreground)) !important; }
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
