import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useState } from "react";
import { useLang, useT } from "@/lib/i18n";
import { Settings, Languages, ShieldCheck, HelpCircle, ChevronRight, ChevronDown, Lock, LogOut, Award, MessageCircle, Mail, X, Send, Phone, ExternalLink, CheckCircle2, LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil — Karsa" },
      { name: "description", content: "Profil guru, pengaturan aplikasi, bantuan & keamanan." },
    ],
  }),
  component: Profil,
});

function Profil() {
  const t = useT();
  return (
    <PhoneShell>
      <div className="px-6 pt-4 pb-6 space-y-6">
        <h1 className="text-[28px] font-extrabold text-foreground">{t("Profil", "Profile")}</h1>

        {/* Identity */}
        <section className="bg-surface rounded-2xl p-5 border border-border/60">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full grid place-items-center text-2xl font-extrabold text-primary-foreground shrink-0"
              style={{ background: "linear-gradient(135deg, #0D7377 0%, #F47B20 100%)" }}
            >
              SD
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-extrabold text-foreground leading-tight">Ibu Sari Dewi</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug">SDN 047 Kolaka Utara</p>
              <p className="text-[11px] font-mono text-primary mt-0.5">NPSN: 10200101</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/60 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-accent-soft/60 text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ color: "var(--accent)" }}>
              <Award className="w-3 h-3" /> {t("Guru Aktif", "Active Teacher")}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              {t("3 kampanye · 12 materi", "3 campaigns · 12 materials")}
            </span>
          </div>
        </section>

        <SettingsSection />
        <HelpSection />

        <button className="w-full bg-muted/60 text-foreground rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 border border-border">
          <LogOut className="w-4 h-4" /> {t("Keluar", "Sign Out")}
        </button>

        <p className="text-center text-[11px] font-mono text-muted-foreground">
          KARSA · v1.0.0
        </p>
      </div>
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

function SettingsSection() {
  const t = useT();
  const { lang, setLang } = useLang();

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

        <div className="border-t border-border/60 px-4 py-3.5 flex items-center justify-between hover:bg-muted/40 transition-colors cursor-pointer">
          <span className="text-[13px] text-foreground">{t("Notifikasi", "Notifications")}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="border-t border-border/60 px-4 py-3.5 flex items-center justify-between hover:bg-muted/40 transition-colors cursor-pointer">
          <span className="text-[13px] text-foreground">{t("Mode Hemat Data", "Data Saver Mode")}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
}

function HelpSection() {
  const t = useT();
  const [openFaq, setOpenFaq] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: t("Bagaimana dana disalurkan ke sekolah?", "How are funds delivered to schools?"),
      a: t(
        "Dana tidak dipegang oleh sekolah secara tunai. Semua donasi langsung diteruskan ke rekening pemasok lokal (BUMDes/Kelompok Tani) yang terdaftar dan diverifikasi, lalu pemasok mengirim bahan pangan ke sekolah.",
        "Funds are never held by the school in cash. All donations are forwarded directly to the registered, verified local supplier's account (BUMDes/Farmer Group), who then delivers food supplies to the school.",
      ),
    },
    {
      q: t("Apakah aplikasi ini bisa digunakan tanpa kuota?", "Can this app be used without an internet connection?"),
      a: t(
        "Ya. Semua materi yang telah Anda unduh di tab Copilot dapat diakses tanpa internet. Hanya fitur Generator AI dan kampanye baru yang membutuhkan koneksi.",
        "Yes. All materials you've downloaded in the Copilot tab can be accessed offline. Only the AI Generator and new campaigns require a connection.",
      ),
    },
    {
      q: t("Bagaimana NPSN saya diverifikasi?", "How is my NPSN verified?"),
      a: t(
        "NPSN dicocokkan dengan basis data resmi Kemendikbud secara otomatis dalam 1×24 jam setelah kampanye diajukan.",
        "Your NPSN is matched against the official Ministry of Education database automatically within 24 hours of submission.",
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
              {t("3 pertanyaan populer", "3 popular questions")}
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

        {/* Privacy Policy */}
        <div className="border-t border-border/60 px-4 py-4 flex items-center gap-3 hover:bg-muted/40 transition-colors cursor-pointer">
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
        </div>
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
