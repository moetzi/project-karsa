import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useConnectionStatus } from "@/lib/useConnectionStatus";

export function ConnectionBadge() {
  const t = useT();
  const state = useConnectionStatus();

  if (state === "syncing") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-accent-soft text-accent">
        <Loader2 className="w-3 h-3 animate-spin" /> {t("Syncing", "Syncing")}
      </span>
    );
  }
  if (state === "offline") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
        <WifiOff className="w-3 h-3" /> {t("Offline", "Offline")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary-soft text-primary">
      <Wifi className="w-3 h-3" /> {t("Online", "Online")}
    </span>
  );
}
