import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useEffect, useState } from "react";
import { useLang, useT } from "@/lib/i18n";
import { Settings, Languages, ShieldCheck, HelpCircle, ChevronRight, ChevronDown, Lock, LogOut, Award, MessageCircle, Mail, X, Send, Phone, ExternalLink, CheckCircle2, LifeBuoy, Bell, PartyPopper, NotebookPen, Info, Wifi, WifiOff, Download, RefreshCw, Image as ImageIcon, CloudOff, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications, useUnreadCount, markAllRead, markRead, clearNotifications, type AppNotification } from "@/lib/notificationsStore";
import { useDataSaver } from "@/lib/dataSaverStore";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil — Karsa" },
      { name: "description", content: "Profil guru, pengaturan aplikasi, bantuan & keamanan." },
    ],
  }),
  component: Profil,
});

type TeacherInfo = {
  fullName: string;
  email: string;
  school: string;
  npsn: string;
  idType: string;
  idNumber: string;
};

function Profil() {
  const t = useT();
  const navigate = useNavigate();
  const [info, setInfo] = useState<TeacherInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }
      const meta = (user.user_metadata ?? {}) as Record<string, string>;
      let fullName = meta.full_name ?? "";
      let school = meta.school ?? "";
      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, school")
        .eq("id", user.id)
        .maybeSingle();
      if (prof) {
        fullName = prof.full_name ?? fullName;
        school = prof.school ?? school;
      }
      if (cancelled) return;
      setInfo({
        fullName: fullName || (user.email ?? "Guru"),
        email: user.email ?? "",
        school: school || "—",
        npsn: meta.npsn ?? "—",
        idType: meta.nuptk_type ?? "NUPTK",
        idNumber: meta.nuptk ?? "—",
      });
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const initials =
    (info?.fullName ?? "G")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "G";

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  const [notifOpen, setNotifOpen] = useState(false);
  const unread = useUnreadCount();

  return (
    <PhoneShell>
      <div className="px-6 pt-4 pb-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-extrabold text-foreground">{t("Profil", "Profile")}</h1>
          <button
            onClick={() => setNotifOpen(true)}
            aria-label={t("Notifikasi", "Notifications")}
            className="relative w-11 h-11 rounded-full bg-surface border border-border/60 grid place-items-center hover:bg-muted/40 transition"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold grid place-items-center border-2 border-surface">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
        </div>

        {/* Identity */}
        <section className="bg-surface rounded-2xl p-5 border border-border/60">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full grid place-items-center text-2xl font-extrabold text-primary-foreground shrink-0"
              style={{ background: "linear-gradient(135deg, #0D7377 0%, #F47B20 100%)" }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-extrabold text-foreground leading-tight truncate">
                {loading ? t("Memuat…", "Loading…") : info?.fullName ?? t("Tamu", "Guest")}
              </h2>
              <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug truncate">{info?.school ?? "—"}</p>
              {info?.email && (
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{info.email}</p>
              )}
              <p className="text-[11px] font-mono text-primary mt-0.5">NPSN: {info?.npsn ?? "—"}</p>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                {info?.idType ?? "NUPTK"}: {info?.idNumber ?? "—"}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/60 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-accent-soft/60 text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ color: "var(--accent)" }}>
              <Award className="w-3 h-3" /> {t("Guru Aktif", "Active Teacher")}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              {info ? t("Terverifikasi", "Verified") : t("Belum masuk", "Not signed in")}
            </span>
          </div>
        </section>

        <SettingsSection onOpenNotifications={() => setNotifOpen(true)} />
        <HelpSection />
        <AboutSection />

        <button
          onClick={handleSignOut}
          className="w-full bg-muted/60 text-foreground rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 border border-border hover:bg-muted transition"
        >
          <LogOut className="w-4 h-4" /> {t("Keluar", "Sign Out")}
        </button>

        <p className="text-center text-[11px] font-mono text-muted-foreground">
          KARSA · v1.0.0
        </p>
      </div>
      {notifOpen && <NotificationsSheet onClose={() => setNotifOpen(false)} />}
    </PhoneShell>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-2 px-1">
      <span className="text-primary">{icon}</span>
      <h3 className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">{title}</h3>
    </div>
  );
}

function SettingsSection({ onOpenNotifications }: { onOpenNotifications: () => void }) {
  const t = useT();
  const { lang, setLang } = useLang();
  const [dataSaverOpen, setDataSaverOpen] = useState(false);
  const [dataSaver] = useDataSaver();

  return (
    <section>
      <SectionHeader icon={<Settings className="w-3.5 h-3.5" />} title={t("Pengaturan Aplikasi", "App Settings")} />
      <div className="bg-surface rounded-2xl border border-border/60 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0">
              <Languages className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-foreground">
                {t("Setelan Bahasa", "Language Settings")}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {t("Pilih bahasa antarmuka aplikasi", "Choose your interface language")}
              </p>
            </div>
          </div>

          <div className="mt-4 bg-muted/70 rounded-2xl p-1 grid grid-cols-2 gap-1">
            <button
              onClick={() => setLang("id")}
              className={
                "py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 " +
                (lang === "id" ? "bg-surface text-primary shadow-sm" : "text-muted-foreground")
              }
            >
              <span>🇮🇩</span> Bahasa Indonesia
            </button>
            <button
              onClick={() => setLang("en")}
              className={
                "py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 " +
                (lang === "en" ? "bg-surface text-primary shadow-sm" : "text-muted-foreground")
              }
            >
              <span>🇬🇧</span> English
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenNotifications}
          className="w-full border-t border-border/60 px-4 py-3.5 flex items-center justify-between hover:bg-muted/40 transition-colors text-left"
        >
          <span className="text-[13px] text-foreground inline-flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" /> {t("Notifikasi", "Notifications")}
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          type="button"
          onClick={() => setDataSaverOpen(true)}
          className="w-full border-t border-border/60 px-4 py-3.5 flex items-center justify-between hover:bg-muted/40 transition-colors text-left"
        >
          <span className="text-[13px] text-foreground inline-flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-primary" /> {t("Mode Hemat Data", "Data Saver Mode")}
          </span>
          <span className="flex items-center gap-2">
            <span
              className={
                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full " +
                (dataSaver
                  ? "bg-primary-soft text-primary"
                  : "bg-muted text-muted-foreground")
              }
            >
              {dataSaver ? t("Aktif", "On") : t("Nonaktif", "Off")}
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </span>
        </button>
      </div>
      {dataSaverOpen && <DataSaverSheet onClose={() => setDataSaverOpen(false)} />}
    </section>
  );
}

function DataSaverSheet({ onClose }: { onClose: () => void }) {
  const t = useT();
  const [enabled, setEnabled] = useDataSaver();
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const steps: { icon: React.ReactNode; title: string; desc: string }[] = [
    {
      icon: <Download className="w-4 h-4" />,
      title: t("Unduh materi saat ada Wi-Fi", "Download materials on Wi-Fi"),
      desc: t(
        "Buka Edu Co-pilot lalu ketuk ikon unduh pada modul yang ingin dipakai offline. Materi tersimpan permanen di perangkat sampai Anda menghapusnya.",
        "Open Edu Co-pilot and tap the download icon on the modules you want offline. Materials stay on your device until you delete them.",
      ),
    },
    {
      icon: <NotebookPen className="w-4 h-4" />,
      title: t("Tulis jurnal tanpa sinyal", "Write journals without signal"),
      desc: t(
        "Jurnal harian yang Anda simpan saat offline akan masuk antrean lokal dan otomatis tersinkron ke kampanye publik begitu perangkat kembali online.",
        "Daily journals saved while offline are queued locally and automatically sync to the public campaign once the device reconnects.",
      ),
    },
    {
      icon: <RefreshCw className="w-4 h-4" />,
      title: t("Sinkron otomatis saat online", "Auto-sync when back online"),
      desc: t(
        "Karsa mendeteksi koneksi pulih dan mengirim antrean jurnal, status kampanye, serta statistik Anak Terbantu tanpa perlu tindakan tambahan.",
        "Karsa detects when the connection returns and pushes queued journals, campaign status, and Children Helped stats automatically.",
      ),
    },
    {
      icon: <ImageIcon className="w-4 h-4" />,
      title: t("Hemat gambar & video", "Save images & video"),
      desc: t(
        "Saat Mode Hemat Data aktif, foto kampanye dimuat dalam resolusi rendah dan video pratinjau dimatikan untuk menghemat kuota.",
        "When Data Saver is on, campaign photos load at low resolution and video previews are disabled to save bandwidth.",
      ),
    },
  ];

  return (
    <BottomSheet onClose={onClose} title={t("Mode Hemat Data", "Data Saver Mode")} icon={<WifiOff className="w-4 h-4" />}>
      <div className="px-5 py-5 space-y-5">
        {/* Status */}
        <div
          className={
            "rounded-2xl border p-4 flex items-center gap-3 " +
            (online
              ? "bg-emerald-50 border-emerald-200"
              : "bg-amber-50 border-amber-200")
          }
        >
          <div
            className={
              "w-10 h-10 rounded-full grid place-items-center shrink-0 " +
              (online ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")
            }
          >
            {online ? <Wifi className="w-5 h-5" /> : <CloudOff className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-foreground">
              {online ? t("Perangkat Online", "Device Online") : t("Perangkat Offline", "Device Offline")}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
              {online
                ? t("Sinkronisasi jurnal & kampanye berjalan normal.", "Journal & campaign sync running normally.")
                : t("Jurnal akan tersimpan lokal dan terkirim saat online.", "Journals are saved locally and sent once online.")}
            </p>
          </div>
        </div>

        {/* Toggle */}
        <div className="bg-surface rounded-2xl border border-border/60 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-foreground">
              {t("Aktifkan Mode Hemat Data", "Enable Data Saver")}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
              {t(
                "Memuat gambar resolusi rendah, mematikan autoplay video, & menunda pre-fetch.",
                "Loads low-res images, disables video autoplay & pauses pre-fetch.",
              )}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled(!enabled)}
            className={
              "w-12 h-7 rounded-full relative transition-colors shrink-0 " +
              (enabled ? "bg-primary" : "bg-muted-foreground/30")
            }
          >
            <span
              className={
                "absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform " +
                (enabled ? "translate-x-5" : "translate-x-0")
              }
            />
          </button>
        </div>

        {/* Offline guide */}
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold mb-2 px-1">
            {t("Panduan Offline", "Offline Guide")}
          </h4>
          <ol className="space-y-2">
            {steps.map((s, i) => (
              <li key={i} className="bg-surface rounded-2xl border border-border/60 p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0 relative">
                  {s.icon}
                  <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-foreground leading-snug">{s.title}</p>
                  <p className="font-serif text-[12px] text-muted-foreground leading-relaxed mt-1">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed px-1">
          {t(
            "Tips: untuk pengalaman offline terbaik, unduh materi & buka kampanye Anda minimal sekali saat tersambung internet.",
            "Tip: for the best offline experience, download materials and open your campaigns at least once while connected.",
          )}
        </p>
      </div>
    </BottomSheet>
  );
}

function HelpSection() {
  const t = useT();
  const [openFaq, setOpenFaq] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: t("Apa itu Lean Disbursement di Karsa?", "What is Lean Disbursement in Karsa?"),
      a: t(
        "Lean Disbursement adalah mekanisme penyaluran dana yang ringkas dan transparan: donasi masuk ke kampanye sekolah, dicatat sebagai saldo terkumpul, lalu guru mencairkan dana tersebut secara bertahap melalui jurnal harian pembelian bahan pangan. Setiap pencairan langsung memperbarui dana tersalurkan dan tercermin real-time di halaman publik.",
        "Lean Disbursement is a simple and transparent fund distribution mechanism: donations enter a school campaign, are recorded as collected balance, and teachers disburse the funds gradually through daily purchase journals. Every disbursement immediately updates the amount distributed and is reflected in real time on the public campaign page.",
      ),
    },
    {
      q: t("Bagaimana cara kerja Karsa saat offline?", "How does Karsa work offline?"),
      a: t(
        "Setelah login pertama kali, Karsa menyimpan data penting di perangkat Anda. Materi yang sudah diunduh dari Edu Co-pilot, daftar kampanye, dan jurnal tersimpan tetap bisa dibaca tanpa internet. Saat Anda menulis jurnal baru tanpa sinyal, Karsa akan menampungnya secara lokal dan otomatis menyinkronkan begitu perangkat kembali online.",
        "After your first login, Karsa stores essential data on your device. Downloaded Edu Co-pilot materials, campaign lists, and saved journals remain readable without internet. When you write a new journal while offline, Karsa queues it locally and automatically syncs once the device is back online.",
      ),
    },
    {
      q: t("Bagaimana prosedur verifikasi guru dan sekolah?", "What is the teacher and school verification procedure?"),
      a: t(
        "Akun guru diverifikasi saat pendaftaran melalui email institusi atau dokumen identitas keguruan (NUPTK/NIDN). NPSN sekolah dicocokkan dengan data Kemendikbud untuk memastikan keabsahan. Kampanye baru juga melewati pemeriksaan kelengkapan data sebelum ditampilkan di halaman publik.",
        "Teacher accounts are verified during registration via institutional email or teaching credentials (NUPTK/NIDN). The school's NPSN is cross-checked with the Ministry of Education database to ensure validity. New campaigns also undergo a completeness review before being shown on the public page.",
      ),
    },
    {
      q: t("Apa saja fitur unggulan Anti Stunting Micro Campaign?", "What are the key features of the Anti Stunting Micro Campaign?"),
      a: t(
        "Kampanye ini menghubungkan guru, donatur, dan pemasok lokal. Guru mengajukan kebutuhan gizi sekolah, menerima donasi, mencatat jurnal harian pembelian/menu, dan menutup kampanye dengan laporan penutup. Publik dapat melihat transparansi dana, jurnal, serta jumlah anak terbantu secara real-time.",
        "This campaign connects teachers, donors, and local suppliers. Teachers submit school nutrition needs, receive donations, log daily purchase/menu journals, and close the campaign with a final report. The public can view fund transparency, journals, and the number of children helped in real time.",
      ),
    },
    {
      q: t("Mengapa notifikasi muncul saat kampanye mencapai 100%?", "Why do notifications appear when a campaign reaches 100%?"),
      a: t(
        "Notifikasi 100% Dana Tersalurkan adalah pengingat agar guru segera membuat jurnal harian atau jurnal penutup. Dengan satu ketukan, Anda bisa langsung membuka lembar jurnal tanpa menyegarkan halaman, sehingga transparansi kampanye tetap terjaga dan statistik Anak Terbantu dapat diperbarui otomatis.",
        "The 100% Funds Disbursed notification reminds teachers to create a daily or closing journal immediately. With one tap, you can open the journal sheet without refreshing the page, keeping campaign transparency intact and automatically updating the Children Helped statistics.",
      ),
    },
  ];

  return (
    <section>
      <SectionHeader icon={<ShieldCheck className="w-3.5 h-3.5" />} title={t("Pusat Bantuan & Keamanan", "Help & Security Center")} />
      <div className="bg-surface rounded-2xl border border-border/60 overflow-hidden">
        {/* FAQ row */}
        <button
          onClick={() => setOpenFaq((o) => !o)}
          className="w-full px-4 py-4 flex items-center gap-3 hover:bg-muted/40 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-foreground">
              {t("FAQ / Tanya Jawab", "FAQ / Questions")}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {t("5 pertanyaan populer", "5 popular questions")}
            </p>
          </div>
          <ChevronDown className={"w-4 h-4 text-muted-foreground transition-transform " + (openFaq ? "rotate-180" : "")} />
        </button>

        {openFaq && (
          <div className="px-4 pb-4 space-y-2 border-t border-border/60 pt-3 bg-muted/20">
            {faqs.map((f, i) => {
              const open = openIdx === i;
              return (
                <div key={i} className="bg-surface rounded-xl border border-border/60 overflow-hidden">
                  <button
                    onClick={() => setOpenIdx(open ? null : i)}
                    className="w-full px-3.5 py-3 flex items-center justify-between gap-3 text-left"
                  >
                    <span className="text-[13px] font-semibold text-foreground leading-snug">{f.q}</span>
                    <ChevronDown className={"w-4 h-4 text-primary shrink-0 transition-transform " + (open ? "rotate-180" : "")} />
                  </button>
                  {open && (
                    <p className="px-3.5 pb-3.5 font-serif text-[13px] leading-relaxed text-foreground/80 border-t border-border/60 pt-3">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Contact actions */}
        <ContactRows />

        {/* Privacy Policy */}
        <PrivacyRow />
      </div>

      <p className="mt-3 px-1 text-[11px] text-muted-foreground leading-relaxed">
        {t(
          "Karsa mematuhi UU Perlindungan Data Pribadi (PDP). Kami tidak pernah membagikan data Anda tanpa izin.",
          "Karsa complies with Indonesia's Personal Data Protection Law (PDP). We never share your data without consent.",
        )}
      </p>
    </section>
  );
}

function AboutSection() {
  const t = useT();
  return (
    <section>
      <SectionHeader icon={<Info className="w-3.5 h-3.5" />} title={t("Tentang Aplikasi", "About the App")} />
      <div className="bg-surface rounded-2xl border border-border/60 overflow-hidden">
        <Link
          to="/tentang"
          className="w-full px-4 py-4 flex items-center gap-3 hover:bg-muted/40 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-foreground">
              {t("Tentang Karsa", "About Karsa")}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {t("Misi, visi, dan cara kerja aplikasi", "Mission, vision, and how the app works")}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>
    </section>
  );
}

function ContactRows() {
  const t = useT();
  const [chatOpen, setChatOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setChatOpen(true)}
        className="w-full border-t border-border/60 px-4 py-4 flex items-center gap-3 hover:bg-muted/40 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0">
          <MessageCircle className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-bold text-foreground">
            {t("Chat Dukungan Karsa", "Karsa Support Chat")}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            {t("Online · biasanya balas <5 menit", "Online · usually replies <5 min")}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>

      <button
        onClick={() => setTicketOpen(true)}
        className="w-full border-t border-border/60 px-4 py-4 flex items-center gap-3 hover:bg-muted/40 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-xl bg-accent-soft grid place-items-center shrink-0" style={{ color: "var(--accent)" }}>
          <Mail className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-bold text-foreground">
            {t("Kirim Email / Tiket", "Email / Ticket")}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
            bantuan@karsa.id
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>

      {chatOpen && <SupportChatSheet onClose={() => setChatOpen(false)} />}
      {ticketOpen && <TicketSheet onClose={() => setTicketOpen(false)} />}
    </>
  );
}

function PrivacyRow() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full border-t border-border/60 px-4 py-4 flex items-center gap-3 hover:bg-muted/40 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-bold text-foreground">
            {t("Kebijakan Keamanan & Privasi", "Privacy & Security Policy")}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {t("Transparansi data & kepatuhan", "Data transparency & compliance")}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>
      {open && <PrivacySheet onClose={() => setOpen(false)} />}
    </>
  );
}

/* ---------- Bottom Sheet Primitive ---------- */
function BottomSheet({ title, onClose, children, icon }: { title: string; onClose: () => void; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 animate-in fade-in" onClick={onClose} />
      <div className="relative w-full bg-background rounded-t-3xl shadow-2xl max-h-[85%] flex flex-col animate-in slide-in-from-bottom-8">
        <div className="pt-2 pb-1 grid place-items-center">
          <span className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="px-5 py-3 flex items-center gap-2 border-b border-border/60">
          {icon && <span className="text-primary">{icon}</span>}
          <h3 className="text-[16px] font-extrabold text-foreground flex-1">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full grid place-items-center hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Support Chat ---------- */
type Msg = { from: "agent" | "user"; text: string };
function SupportChatSheet({ onClose }: { onClose: () => void }) {
  const t = useT();
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "agent", text: t("Halo Bu Sari! Saya Rani dari Tim Karsa. Ada yang bisa dibantu hari ini? 👋", "Hi Ms. Sari! I'm Rani from Karsa Support. How can I help you today? 👋") },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    const v = input.trim();
    if (!v) return;
    setMsgs((m) => [...m, { from: "user", text: v }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { from: "agent", text: t("Terima kasih, pesan Anda sudah kami terima. Tim akan menindaklanjuti dalam 1×24 jam. ✅", "Thanks, we've received your message. Our team will follow up within 24 hours. ✅") },
      ]);
    }, 700);
  };

  return (
    <BottomSheet onClose={onClose} title={t("Chat Dukungan", "Support Chat")} icon={<LifeBuoy className="w-4 h-4" />}>
      <div className="px-5 py-4 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={"flex " + (m.from === "user" ? "justify-end" : "justify-start")}>
            <div
              className={
                "max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-snug " +
                (m.from === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md")
              }
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 bg-background border-t border-border/60 px-3 py-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          maxLength={500}
          placeholder={t("Tulis pesan…", "Type a message…")}
          className="flex-1 bg-muted/60 rounded-full px-4 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          onClick={send}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground grid place-items-center shrink-0 disabled:opacity-40"
          disabled={!input.trim()}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </BottomSheet>
  );
}

/* ---------- Ticket / Email Form ---------- */
function TicketSheet({ onClose }: { onClose: () => void }) {
  const t = useT();
  const [topic, setTopic] = useState("");
  const [email, setEmail] = useState("sari.dewi@sdn047.sch.id");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  const topics = [
    t("Verifikasi NPSN", "NPSN Verification"),
    t("Pencairan Dana", "Fund Disbursement"),
    t("Bug / Error Aplikasi", "App Bug / Error"),
    t("Lainnya", "Other"),
  ];

  const valid = topic && /^\S+@\S+\.\S+$/.test(email) && body.trim().length >= 10;

  if (sent) {
    return (
      <BottomSheet onClose={onClose} title={t("Tiket Terkirim", "Ticket Submitted")} icon={<Mail className="w-4 h-4" />}>
        <div className="px-6 py-10 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 grid place-items-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-[16px] font-extrabold text-foreground">
            {t("Pesan terkirim!", "Message sent!")}
          </h4>
          <p className="font-serif text-[13px] text-muted-foreground leading-relaxed">
            {t(
              "Nomor tiket #KRS-20260621-04. Balasan akan kami kirim ke email Anda dalam 1×24 jam.",
              "Ticket #KRS-20260621-04. We'll reply to your email within 24 hours.",
            )}
          </p>
          <button onClick={onClose} className="mt-2 bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-bold">
            {t("Selesai", "Done")}
          </button>
        </div>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet onClose={onClose} title={t("Kirim Tiket Bantuan", "Submit Support Ticket")} icon={<Mail className="w-4 h-4" />}>
      <div className="px-5 py-4 space-y-4">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
            {t("Topik", "Topic")}
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {topics.map((tp) => (
              <button
                key={tp}
                onClick={() => setTopic(tp)}
                className={
                  "py-2.5 px-3 rounded-xl text-[12px] font-semibold border transition-colors text-left " +
                  (topic === tp
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-surface border-border/60 text-foreground hover:bg-muted/40")
                }
              >
                {tp}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
            {t("Email Balasan", "Reply Email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            className="mt-2 w-full bg-surface border border-border/60 rounded-xl px-3.5 py-2.5 text-[13px] font-mono outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
            {t("Pesan", "Message")}
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={1000}
            rows={5}
            placeholder={t("Jelaskan masalah Anda secara detail…", "Describe your issue in detail…")}
            className="mt-2 w-full bg-surface border border-border/60 rounded-xl px-3.5 py-2.5 text-[13px] font-serif leading-relaxed outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
          <p className="mt-1 text-[10px] font-mono text-muted-foreground text-right">{body.length}/1000</p>
        </div>

        <button
          disabled={!valid}
          onClick={() => setSent(true)}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <Send className="w-4 h-4" /> {t("Kirim Tiket", "Send Ticket")}
        </button>

        <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-muted-foreground">
          <a href="tel:+622150505050" className="flex items-center gap-1.5 hover:text-primary">
            <Phone className="w-3.5 h-3.5" /> +62 21 5050 5050
          </a>
          <span>·</span>
          <a href="mailto:bantuan@karsa.id" className="flex items-center gap-1.5 hover:text-primary font-mono">
            bantuan@karsa.id
          </a>
        </div>
      </div>
    </BottomSheet>
  );
}

/* ---------- Privacy Policy Sheet ---------- */
function PrivacySheet({ onClose }: { onClose: () => void }) {
  const t = useT();
  const sections = [
    {
      h: t("Data yang Kami Kumpulkan", "Data We Collect"),
      p: t(
        "Hanya data esensial: nama guru, email, NPSN sekolah, dan riwayat kampanye. Tidak ada data siswa pribadi yang disimpan di server kami.",
        "Only essential data: teacher name, email, school NPSN, and campaign history. No personal student data is stored on our servers.",
      ),
    },
    {
      h: t("Bagaimana Data Digunakan", "How Data Is Used"),
      p: t(
        "Untuk verifikasi kampanye, menyalurkan donasi ke pemasok lokal terverifikasi, dan menampilkan laporan transparansi kepada donatur.",
        "To verify campaigns, route donations to verified local suppliers, and display transparency reports to donors.",
      ),
    },
    {
      h: t("Keamanan & Penyimpanan", "Security & Storage"),
      p: t(
        "Semua data dienkripsi saat transit (TLS 1.3) dan saat disimpan (AES-256). Server berada di Indonesia sesuai PP 71/2019.",
        "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Servers are located in Indonesia per Gov. Regulation 71/2019.",
      ),
    },
    {
      h: t("Hak Anda", "Your Rights"),
      p: t(
        "Anda berhak meminta salinan, perbaikan, atau penghapusan data kapan saja sesuai UU PDP No. 27/2022.",
        "You may request a copy, correction, or deletion of your data at any time under PDP Law No. 27/2022.",
      ),
    },
  ];

  return (
    <BottomSheet onClose={onClose} title={t("Kebijakan Privasi", "Privacy Policy")} icon={<ShieldCheck className="w-4 h-4" />}>
      <div className="px-5 py-4 space-y-5">
        <div className="bg-primary-soft/60 border border-primary/20 rounded-2xl p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
            {t("Ringkasan", "Summary")}
          </p>
          <p className="mt-2 font-serif text-[13px] leading-relaxed text-foreground/85">
            {t(
              "Karsa hanya mengumpulkan data yang diperlukan untuk menjalankan program nutrisi sekolah. Data Anda tidak pernah dijual, dan dapat dihapus kapan saja.",
              "Karsa only collects data needed to operate the school nutrition program. Your data is never sold, and can be deleted at any time.",
            )}
          </p>
        </div>

        {sections.map((s) => (
          <div key={s.h}>
            <h4 className="text-[14px] font-extrabold text-foreground">{s.h}</h4>
            <p className="mt-1.5 font-serif text-[13px] leading-relaxed text-foreground/80">{s.p}</p>
          </div>
        ))}

        <div className="border-t border-border/60 pt-4 space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
            {t("Tautan Resmi", "Official Links")}
          </p>
          {[
            { label: t("Kebijakan Privasi Lengkap", "Full Privacy Policy"), href: "https://karsa.id/privacy" },
            { label: t("Syarat & Ketentuan", "Terms of Service"), href: "https://karsa.id/terms" },
            { label: t("UU PDP No. 27/2022", "PDP Law No. 27/2022"), href: "https://peraturan.bpk.go.id/Details/229798" },
            { label: t("Hubungi Petugas Pelindungan Data (DPO)", "Contact Data Protection Officer (DPO)"), href: "mailto:dpo@karsa.id" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-surface border border-border/60 hover:bg-muted/40 transition-colors"
            >
              <span className="text-[13px] font-semibold text-foreground">{l.label}</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </a>
          ))}
        </div>

        <p className="text-center text-[10px] font-mono text-muted-foreground pb-2">
          {t("Diperbarui terakhir", "Last updated")}: 2026-06-01 · v1.0
        </p>
      </div>
    </BottomSheet>
  );
}

function fmtNotifTime(ts: number, lang: "id" | "en") {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return lang === "id" ? "baru saja" : "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j`;
  return `${Math.floor(diff / 86400)}h`;
}

function NotificationsSheet({ onClose }: { onClose: () => void }) {
  const t = useT();
  const { lang } = useLang();
  const items = useNotifications();

  useEffect(() => {
    const id = setTimeout(() => markAllRead(), 400);
    return () => clearTimeout(id);
  }, []);

  return (
    <BottomSheet onClose={onClose} title={t("Notifikasi", "Notifications")} icon={<Bell className="w-4 h-4" />}>
      <div className="p-4 space-y-3">
        {items.length === 0 ? (
          <div className="py-10 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-muted grid place-items-center text-muted-foreground">
              <Bell className="w-6 h-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {t("Belum ada notifikasi", "No notifications yet")}
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              {t(
                "Pemberitahuan saat kampanye 100% akan muncul di sini.",
                "You'll be notified here when a campaign reaches 100%.",
              )}
            </p>
          </div>
        ) : (
          <>
            <ul className="space-y-2">
              {items.map((n) => (
                <NotificationRow key={n.id} n={n} lang={lang} onClose={onClose} />
              ))}
            </ul>
            <button
              type="button"
              onClick={() => clearNotifications()}
              className="w-full mt-2 text-[12px] text-muted-foreground hover:text-foreground py-2"
            >
              {t("Hapus semua", "Clear all")}
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  );
}

function NotificationRow({ n, lang, onClose }: { n: AppNotification; lang: "id" | "en"; onClose: () => void }) {
  const isFunded = n.kind === "campaign_funded";
  const Icon = isFunded ? PartyPopper : Bell;
  return (
    <li
      className={
        "rounded-xl border p-3 flex items-start gap-3 " +
        (n.read ? "bg-surface border-border/60" : "bg-primary-soft/30 border-primary/30")
      }
    >
      <div
        className={
          "w-9 h-9 rounded-full grid place-items-center shrink-0 " +
          (isFunded ? "bg-accent text-accent-foreground" : "bg-primary-soft text-primary")
        }
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-bold text-foreground truncate">{n.title}</p>
          <span className="text-[10px] font-mono text-muted-foreground shrink-0">{fmtNotifTime(n.createdAt, lang)}</span>
        </div>
        <p className="mt-0.5 text-[12px] text-muted-foreground leading-snug">{n.body}</p>
        {isFunded && n.campaignId && (
          <Link
            to="/beranda"
            search={{ journal: "1" } as never}
            onClick={() => { markRead(n.id); onClose(); }}
            className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline"
          >
            <NotebookPen className="w-3.5 h-3.5" />
            {lang === "id" ? "Buat Jurnal Harian" : "Create Daily Journal"}
          </Link>
        )}
      </div>
    </li>
  );
}
