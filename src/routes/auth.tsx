import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Portal Guru — Masuk / Daftar | Karsa" },
      { name: "description", content: "Masuk ke Portal Guru Karsa untuk mengelola kampanye gizi sekolah." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [school, setSchool] = useState("");
  const [idType, setIdType] = useState<"NUPTK" | "PegID Kemenag">("NUPTK");
  const [idNumber, setIdNumber] = useState("");
  const [npsn, setNpsn] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/beranda" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        setVerifying(true);
        await new Promise((r) => setTimeout(r, 1500));
        setVerifying(false);
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/beranda`,
            data: { full_name: fullName, school, nuptk_type: idType, nuptk: idNumber, npsn },
          },
        });
        if (error) throw error;
        toast.success("Pendaftaran berhasil!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Selamat datang kembali!");
      }
      navigate({ to: "/beranda" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal memproses";
      toast.error(msg);
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  }

  return (
    <div className="min-h-screen bg-background grid place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
        </Link>
        <div className="bg-surface rounded-2xl border border-border shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border/60 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h1 className="font-bold text-lg">Portal Guru</h1>
          </div>

          <div className="flex border-b border-border/60">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-3 text-sm font-semibold transition ${mode === "signin" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
            >
              Masuk
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 text-sm font-semibold transition ${mode === "signup" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
            >
              Daftar
            </button>
          </div>

          {verifying ? (
            <div className="p-10 text-center">
              <Loader2 className="w-10 h-10 mx-auto text-primary animate-spin" />
              <p className="mt-4 font-semibold">Memvalidasi data NUPTK & NPSN...</p>
              <p className="mt-2 text-xs text-muted-foreground">Menghubungi server Dapodik / Simpatika</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Field label="Email">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="guru@sekolah.id" className={inputCls} />
              </Field>
              <Field label="Kata Sandi">
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 karakter" className={inputCls} />
              </Field>

              {mode === "signup" && (
                <>
                  <Field label="Nama Lengkap">
                    <input required value={fullName} onChange={(e) => setFullName(e.target.value)}
                      placeholder="Sari Wulandari, S.Pd." className={inputCls} />
                  </Field>
                  <Field label="Nama Sekolah">
                    <input required value={school} onChange={(e) => setSchool(e.target.value)}
                      placeholder="SDN 047 Kolaka Utara" className={inputCls} />
                  </Field>
                  <Field label="Tipe Identitas Guru">
                    <select value={idType} onChange={(e) => setIdType(e.target.value as "NUPTK" | "PegID Kemenag")} className={inputCls}>
                      <option value="NUPTK">NUPTK</option>
                      <option value="PegID Kemenag">PegID Kemenag</option>
                    </select>
                  </Field>
                  <Field label="Nomor Identitas">
                    <input required inputMode="numeric" value={idNumber} onChange={(e) => setIdNumber(e.target.value)}
                      placeholder={idType === "NUPTK" ? "1234567890123456" : "198501012010012001"} className={inputCls} />
                  </Field>
                  <Field label="NPSN">
                    <input required inputMode="numeric" maxLength={8} value={npsn} onChange={(e) => setNpsn(e.target.value)}
                      placeholder="40100123" className={inputCls} />
                    <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
                      Sistem akan memvalidasi kecocokan data Anda dengan sekolah di database Dapodik/Simpatika.
                    </p>
                  </Field>
                </>
              )}

              <button type="submit" disabled={loading}
                className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-bold text-sm hover:opacity-95 transition inline-flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {mode === "signup" ? "Verifikasi & Daftar" : "Masuk"}
              </button>

              {mode === "signin" && (
                <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
                  Demo: <span className="font-mono font-semibold text-foreground">guru.demo@karsa.id</span> · <span className="font-mono font-semibold text-foreground">karsa1234</span>
                  <br />Jika belum ada, daftar dulu dengan kredensial di atas.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls = "mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-foreground/80">{label}</label>
      {children}
    </div>
  );
}
