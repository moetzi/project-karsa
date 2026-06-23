# Karsa — Akhiri Stunting, Mulai dari Sekolah

Karsa adalah platform donasi dan edukasi untuk gerakan guru Indonesia memberi gizi sehat bagi anak-anak di pelosok. Platform ini menghubungkan publik dengan kampanye gizi sekolah yang dipimpin langsung oleh guru terverifikasi, dengan transparasi melalui jurnal terbuka.

## Teknologi

- **Framework**: [TanStack Start v1](https://tanstack.com/start) dengan React 19
- **Build tool**: Vite 7
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix UI primitives)
- **Backend / Auth / Database**: Lovable Cloud (Supabase)
- **State management**: TanStack Query + Zustand stores
- **Maps**: Leaflet + React-Leaflet
- **AI / LLM**: AI SDK dengan Lovable AI Gateway
- **PWA**: vite-plugin-pwa + Workbox

## Struktur Aplikasi

- `src/routes/` — file-based routing TanStack Start
  - `index.tsx` — landing page publik
  - `inspirasi.$id.tsx` — detail artikel inspirasi (publik)
  - `k.$id.tsx` — detail kampanye (publik)
  - `_authenticated/beranda.tsx` — beranda PWA untuk guru
  - `_authenticated/copilot.tsx` — AI copilot PWA
  - `_authenticated/nutrisi.tsx` — manajemen nutrisi PWA
  - `auth.tsx` — halaman autentikasi guru
- `src/lib/` — logika bisnis, server functions, stores, dan utilitas
- `src/components/` — komponen React reusable
- `src/integrations/supabase/` — auto-generated Supabase client & middleware
- `supabase/` — konfigurasi backend

## Menjalankan Proyek

```bash
# 1. Install dependencies
bun install

# 2. Salin file environment dan isi nilainya
cp .env.example .env

# 3. Development server
bun dev

# Build production
bun run build

# Build development mode
bun run build:dev

# Preview production build
bun run preview

# Lint & format
bun run lint
bun run format
```

## Environment Variables

Salin `.env.example` menjadi `.env`, lalu isi nilainya:

```bash
cp .env.example .env
```

| Variabel | Keterangan |
|---|---|
| `SUPABASE_URL` | URL project Supabase kamu |
| `SUPABASE_PUBLISHABLE_KEY` | Anon/public key dari Supabase (aman di-commit ke *private* repo) |
| `SUPABASE_PROJECT_ID` | ID project Supabase |
| `VITE_SUPABASE_URL` | Sama seperti `SUPABASE_URL`, untuk client-side Vite |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Sama seperti `SUPABASE_PUBLISHABLE_KEY`, untuk client-side Vite |
| `VITE_SUPABASE_PROJECT_ID` | Sama seperti `SUPABASE_PROJECT_ID`, untuk client-side Vite |

Semua nilai bisa didapat dari [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API.

> **Catatan:** `.env` sudah masuk ke `.gitignore` — jangan di-commit ke repo publik. Variabel server-side seperti `SUPABASE_SERVICE_ROLE_KEY` tidak perlu diatur secara manual di Lovable Cloud.

## Fitur Utama

- Landing page publik dengan kampanye, artikel inspirasi, dan peta dampak Indonesia
- Autentikasi guru (PWA) untuk mengakses beranda, copilot AI, dan manajemen nutrisi
- Artikel inspirasi di PWA di-lock agar hanya bisa diakses dari dalam PWA kecuali guru logout
- AI Copilot untuk bantuan materi dan rencana makan (memerlukan autentikasi)
- Donasi transparan dengan jurnal dan foto bukti penggunaan dana
- PWA support dengan service worker offline fallback

## Catatan Keamanan

- Semua server function yang memanggil LLM / AI (`generateMaterial`, `generateMealPlan`) memerlukan autentikasi guru.
- Role-based access menggunakan tabel `user_roles` terpisah dan fungsi `has_role()` dengan `SECURITY DEFINER`.
- Setiap tabel di `public` schema memiliki GRANT, RLS, dan policies yang sesuai.

---

Dibuat dengan Lovable.
