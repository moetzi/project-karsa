import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Star, WifiOff } from "lucide-react";

export const Route = createFileRoute("/flashcard/$id")({
  head: () => ({
    meta: [{ title: "Flashcard — Karsa" }],
  }),
  component: FlashcardView,
});

const cards = [
  { letter: "A", word: "AYAM", emoji: "🐔", sentence: "Ayam berkokok di pagi hari." },
  { letter: "B", word: "BEBEK", emoji: "🦆", sentence: "Bebek berenang di kolam." },
  { letter: "C", word: "CICAK", emoji: "🦎", sentence: "Cicak menempel di dinding." },
  { letter: "D", word: "DOMBA", emoji: "🐑", sentence: "Domba memakan rumput hijau." },
  { letter: "E", word: "ELANG", emoji: "🦅", sentence: "Elang terbang tinggi di langit." },
];

function FlashcardView() {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [rating, setRating] = useState(1);
  const card = cards[i];

  const go = (d: number) => {
    setFlipped(false);
    setTimeout(() => {
      setI((prev) => (prev + d + cards.length) % cards.length);
    }, 150);
  };

  return (
    <PhoneShell>
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-center justify-between">
          <Link to="/copilot" className="w-9 h-9 rounded-full bg-surface border border-border grid place-items-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </Link>
          <div className="flex-1 px-3">
            <h1 className="font-bold text-foreground text-[17px] leading-tight">Alfabet Hewan</h1>
            <p className="text-xs">
              <span className="text-accent font-semibold">Kelas 1 SD</span>
              <span className="text-muted-foreground"> · Bahasa Indonesia</span>
            </p>
          </div>
          <span className="bg-primary-soft text-primary text-xs font-mono font-semibold px-3 py-1 rounded-full">
            {i + 1}/{cards.length}
          </span>
        </div>

        <div className="mt-8 perspective">
          <button
            onClick={() => setFlipped((f) => !f)}
            className={"flip-card w-full aspect-[5/6] " + (flipped ? "flipped" : "")}
          >
            {/* FRONT */}
            <div
              className="flip-face rounded-3xl p-6 flex flex-col items-center justify-center text-primary-foreground"
              style={{
                background: "linear-gradient(135deg, #0D7377 0%, #0a5a5d 100%)",
                boxShadow: "0 20px 40px -10px rgba(13,115,119,0.4)",
              }}
            >
              <div className="text-[160px] font-extrabold leading-none drop-shadow-md">
                {card.letter}
              </div>
              <div className="text-7xl mt-2">{card.emoji}</div>
              <div className="mt-3 font-bold tracking-[0.4em] text-2xl">{card.word}</div>
              <p className="mt-4 text-[11px] opacity-80">Ketuk untuk membalik</p>
            </div>

            {/* BACK */}
            <div
              className="flip-face flip-back rounded-3xl p-6 flex flex-col items-center justify-center bg-surface border-2 border-primary"
              style={{ boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)" }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">
                Contoh Kalimat
              </p>
              <p className="mt-5 font-serif italic text-2xl text-foreground text-center leading-snug">
                {card.sentence}
              </p>
              <div className="text-6xl mt-6">{card.emoji}</div>
              <p className="mt-6 text-[11px] text-muted-foreground">Ketuk untuk kembali</p>
            </div>
          </button>
        </div>

        {/* Dots + nav */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <button onClick={() => go(-1)} className="w-9 h-9 rounded-full border border-border grid place-items-center text-muted-foreground">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5">
            {cards.map((_, idx) => (
              <span
                key={idx}
                className={
                  "rounded-full transition-all " +
                  (idx === i ? "w-6 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-border")
                }
              />
            ))}
          </div>
          <button onClick={() => go(1)} className="w-9 h-9 rounded-full border border-border grid place-items-center text-foreground">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Rating */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)}>
                <Star
                  className={
                    "w-4 h-4 " +
                    (n <= rating ? "fill-accent text-accent" : "text-border")
                  }
                />
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">dipelajari</span>
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
          <WifiOff className="w-3 h-3" /> Simpan agar dapat digunakan tanpa internet di daerah 3T
        </p>
      </div>
    </PhoneShell>
  );
}
