// Data dummy prevalensi stunting per provinsi, berdasarkan informasi yang diberikan pengguna.
// Nilai top 5 bersumber dari laporan BKPK Kemenkes / SKI:
//   - Papua Tengah: 39,4%
//   - Nusa Tenggara Timur (NTT): 37,0% – 37,9% (diambil 37,5% sebagai perkiraan tengah)
//   - Papua Pegunungan: 37,3%
//   - Sulawesi Barat: 35,4%
//   - Papua Barat Daya: 30,5%
// Rata-rata nasional: 19,8%.
// Nilai untuk provinsi lainnya adalah dummy/estimasi agar dataset lengkap bisa langsung dipakai.

export interface StuntingRecord {
  rank?: number;
  province: string;
  prevalence: number; // persentase (%)
  isVerified: boolean; // true jika angka berasal dari data yang diberikan pengguna
}

export const NATIONAL_STUNTING_AVERAGE = 19.8;

export const TOP_STUNTING_PROVINCES: StuntingRecord[] = [
  { rank: 1, province: "Papua Tengah", prevalence: 39.4, isVerified: true },
  { rank: 2, province: "Nusa Tenggara Timur", prevalence: 37.5, isVerified: true },
  { rank: 3, province: "Papua Pegunungan", prevalence: 37.3, isVerified: true },
  { rank: 4, province: "Sulawesi Barat", prevalence: 35.4, isVerified: true },
  { rank: 5, province: "Papua Barat Daya", prevalence: 30.5, isVerified: true },
];

export const PROVINCE_STUNTING_RATES: StuntingRecord[] = [
  { rank: 1, province: "Papua Tengah", prevalence: 39.4, isVerified: true },
  { rank: 2, province: "Nusa Tenggara Timur", prevalence: 37.5, isVerified: true },
  { rank: 3, province: "Papua Pegunungan", prevalence: 37.3, isVerified: true },
  { rank: 4, province: "Sulawesi Barat", prevalence: 35.4, isVerified: true },
  { rank: 5, province: "Papua Barat Daya", prevalence: 30.5, isVerified: true },
  { rank: 6, province: "Papua Selatan", prevalence: 29.0, isVerified: false },
  { rank: 7, province: "Papua", prevalence: 28.0, isVerified: false },
  { rank: 8, province: "Papua Barat", prevalence: 27.0, isVerified: false },
  { rank: 9, province: "Nusa Tenggara Barat", prevalence: 25.0, isVerified: false },
  { rank: 10, province: "Maluku", prevalence: 24.0, isVerified: false },
  { rank: 11, province: "Kalimantan Barat", prevalence: 23.0, isVerified: false },
  { rank: 12, province: "Maluku Utara", prevalence: 22.0, isVerified: false },
  { rank: 13, province: "Sulawesi Tengah", prevalence: 26.0, isVerified: false },
  { rank: 14, province: "Sulawesi Tenggara", prevalence: 21.0, isVerified: false },
  { rank: 15, province: "Gorontalo", prevalence: 20.0, isVerified: false },
  { rank: 16, province: "Kalimantan Tengah", prevalence: 20.0, isVerified: false },
  { rank: 17, province: "Sulawesi Utara", prevalence: 19.0, isVerified: false },
  { rank: 18, province: "Sumatera Selatan", prevalence: 19.0, isVerified: false },
  { rank: 19, province: "Sulawesi Selatan", prevalence: 18.0, isVerified: false },
  { rank: 20, province: "Kalimantan Selatan", prevalence: 18.0, isVerified: false },
  { rank: 21, province: "Jambi", prevalence: 18.0, isVerified: false },
  { rank: 22, province: "Bengkulu", prevalence: 18.0, isVerified: false },
  { rank: 23, province: "Aceh", prevalence: 17.0, isVerified: false },
  { rank: 24, province: "Sumatera Utara", prevalence: 17.0, isVerified: false },
  { rank: 25, province: "Bangka Belitung", prevalence: 17.0, isVerified: false },
  { rank: 26, province: "Lampung", prevalence: 16.0, isVerified: false },
  { rank: 27, province: "Sumatera Barat", prevalence: 16.0, isVerified: false },
  { rank: 28, province: "Kalimantan Timur", prevalence: 16.0, isVerified: false },
  { rank: 29, province: "Kalimantan Utara", prevalence: 15.0, isVerified: false },
  { rank: 30, province: "Riau", prevalence: 15.0, isVerified: false },
  { rank: 31, province: "Kepulauan Riau", prevalence: 14.0, isVerified: false },
  { rank: 32, province: "Jawa Barat", prevalence: 14.0, isVerified: false },
  { rank: 33, province: "Jawa Tengah", prevalence: 13.0, isVerified: false },
  { rank: 34, province: "Jawa Timur", prevalence: 13.0, isVerified: false },
  { rank: 35, province: "Banten", prevalence: 13.0, isVerified: false },
  { rank: 36, province: "Bali", prevalence: 12.0, isVerified: false },
  { rank: 37, province: "DKI Jakarta", prevalence: 11.0, isVerified: false },
  { rank: 38, province: "DI Yogyakarta", prevalence: 10.0, isVerified: false },
];

export function getStuntingRate(provinceName: string): number | undefined {
  return PROVINCE_STUNTING_RATES.find((r) => r.province === provinceName)?.prevalence;
}
