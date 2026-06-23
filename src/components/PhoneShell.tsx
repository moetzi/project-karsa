import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Leaf, User, WifiOff } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useT } from "@/lib/i18n";

function OfflineBanner() {
  const t = useT();
  const [online, setOnline] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  if (!mounted || online) return null;
  return (
    <div className="bg-accent/15 text-accent flex items-center gap-2 px-4 py-1.5 text-[11px] font-semibold border-b border-accent/20">
      <WifiOff className="w-3 h-3" />
      {t("Mode offline — materi tersimpan tetap bisa diakses", "Offline mode — saved materials still accessible")}
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-semibold text-foreground/80">
      <span className="font-mono">09:41</span>
      <span className="text-[11px] tracking-[0.2em] text-primary font-bold">KARSA</span>
      <span className="flex items-center gap-1">
        <span className="text-xs">●●●●</span>
      </span>
    </div>
  );
}

function BottomNav() {
  const t = useT();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items: Array<{ to: string; label: string; icon: typeof Home; match: (p: string) => boolean; dot?: boolean }> = [
    { to: "/beranda", label: t("Beranda", "Home"), icon: Home, match: (p) => p.startsWith("/beranda") },
    { to: "/copilot", label: t("Copilot", "Copilot"), icon: BookOpen, match: (p) => p.startsWith("/copilot") },
    { to: "/nutrisi", label: t("Nutrisi", "Nutrition"), icon: Leaf, match: (p) => p.startsWith("/nutrisi"), dot: true },
    { to: "/profil", label: t("Profil", "Profile"), icon: User, match: (p) => p.startsWith("/profil") },
  ];
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border/60 px-2 pt-2 pb-5">
      <ul className="flex justify-around items-center">
        {items.map((it) => {
          const active = it.match(pathname);
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <Link
                to={it.to as "/beranda"}
                className="flex flex-col items-center gap-1 px-2 py-1 relative"
              >
                <span
                  className={
                    "relative grid place-items-center w-10 h-10 rounded-full transition-colors " +
                    (active ? "bg-primary-soft text-primary" : "text-muted-foreground")
                  }
                >
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 1.8} />
                  {it.dot && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
                  )}
                </span>
                <span
                  className={
                    "text-[11px] " +
                    (active ? "text-primary font-semibold" : "text-muted-foreground")
                  }
                >
                  {it.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function PhoneShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8" style={{ background: "#2d2d35" }}>
      <div className="phone-shell flex flex-col">
        <StatusBar />
        <OfflineBanner />
        <div className={"flex-1 overflow-y-auto " + (hideNav ? "pb-4" : "pb-28")}>
          {children}
        </div>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}
