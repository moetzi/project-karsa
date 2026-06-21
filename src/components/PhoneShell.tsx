import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Leaf } from "lucide-react";
import type { ReactNode } from "react";

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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    { to: "/", label: "Beranda", icon: Home, match: (p: string) => p === "/" },
    { to: "/copilot", label: "Copilot", icon: BookOpen, match: (p: string) => p.startsWith("/copilot") },
    { to: "/nutrisi", label: "Nutrisi", icon: Leaf, match: (p: string) => p.startsWith("/nutrisi"), dot: true },
  ] as const;
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border/60 px-4 pt-2 pb-5">
      <ul className="flex justify-around items-center">
        {items.map((it) => {
          const active = it.match(pathname);
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className="flex flex-col items-center gap-1 px-3 py-1 relative"
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
        <div className={"flex-1 overflow-y-auto " + (hideNav ? "pb-4" : "pb-28")}>
          {children}
        </div>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}
