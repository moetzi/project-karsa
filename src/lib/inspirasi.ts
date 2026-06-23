import articleStunting from "@/assets/article-stunting.jpg";
import articleGiziLokal from "@/assets/article-gizi-lokal.jpg";
import articleBumdes from "@/assets/article-bumdes.jpg";
import articlePosyandu from "@/assets/article-posyandu.jpg";

export type InspirasiArticle = {
  id: string;
  tag: { id: string; en: string };
  title: { id: string; en: string };
  read: { id: string; en: string };
  hero: string;
  image: string;
};

export const INSPIRASI: InspirasiArticle[] = [
  {
    id: "1",
    tag: { id: "Kesehatan", en: "Health" },
    title: { id: "Dampak Stunting pada Fokus Belajar Anak", en: "How Stunting Affects Children's Focus in Class" },
    read: { id: "6 menit", en: "6 min" },
    hero: "linear-gradient(135deg, #0D7377 0%, #2d5016 100%)",
    image: articleStunting,
  },
  {
    id: "2",
    tag: { id: "Gizi Lokal", en: "Local Nutrition" },
    title: { id: "Inovasi Gizi Lokal: Pangan Desa untuk Nutrisi Sekolah", en: "Local Nutrition Innovation: Village Food for School Meals" },
    read: { id: "8 menit", en: "8 min" },
    hero: "linear-gradient(135deg, #F47B20 0%, #c4654a 100%)",
    image: articleGiziLokal,
  },
  {
    id: "3",
    tag: { id: "Kolaborasi", en: "Collaboration" },
    title: { id: "Peran BUMDes & Kelompok Tani dalam Mendukung Gizi Anak", en: "BUMDes & Farmer Groups: Partners in Child Nutrition" },
    read: { id: "5 menit", en: "5 min" },
    hero: "linear-gradient(135deg, #6b4423 0%, #c9614a 100%)",
    image: articleBumdes,
  },
  {
    id: "4",
    tag: { id: "Komunitas", en: "Community" },
    title: { id: "Kader Posyandu & PMT Lokal: Pemberdayaan Perempuan Cegah Stunting", en: "Posyandu Cadres & Local Supplementary Feeding: Women's Empowerment Prevents Stunting" },
    read: { id: "7 menit", en: "7 min" },
    hero: "linear-gradient(135deg, #2d7d46 0%, #8B4513 100%)",
    image: articlePosyandu,
  },
];
