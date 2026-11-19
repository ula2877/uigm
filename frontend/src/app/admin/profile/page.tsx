"use client";

import { useEffect, useState } from "react";
import { UserCircle, Mail, Eye, EyeOff, Lock, Save, KeyRound } from "lucide-react";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { changePassword, getProfile, updateProfile } from "@/services/profile";
import type { Profile } from "@/types/admin";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    getProfile()
      .then((d) => {
        setProfile(d);
        if (d) {
          setName(d.name || "");
          setEmail(d.email || "");
        }
      })
      .catch(() => toast.error("Gagal memuat profil"))
      .finally(() => setLoading(false));
  }, []);

  const validateProfile = () => {
    if (!name.trim()) {
      toast.error("Nama lengkap wajib diisi");
      return false;
    }
    if (!email.trim()) {
      toast.error("Email wajib diisi");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Format email tidak valid");
      return false;
    }
    return true;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setSavingProfile(true);
    try {
      const updated = await updateProfile({ name: name.trim(), email: email.trim() });
      setProfile(updated);
      setName(updated.name || "");
      setEmail(updated.email || "");

      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("user");
        if (raw) {
          try {
            const current = JSON.parse(raw);
            localStorage.setItem("user", JSON.stringify({ ...current, name: updated.name, email: updated.email }));
          } catch {
            // ignore
          }
        }
      }

      toast.success("Perubahan data diri berhasil disimpan");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan perubahan data diri");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Semua field password wajib diisi");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Password baru dan konfirmasi password tidak sama");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      toast.success("Password berhasil diperbarui");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal memperbarui password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-white/5" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="h-80 rounded-2xl bg-white/5" />
          <div className="h-80 rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-10 text-center text-white/30 text-sm rounded-2xl bg-white/5 border border-white/10">
        Profil tidak ditemukan
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Profil" description="Kelola data diri dan keamanan akun Anda" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/20 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-[#FBBF24]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Data Diri</h2>
              <p className="text-xs text-white/40">Informasi akun yang sedang login</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/40 focus:border-[#FBBF24]/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@contoh.ac.id"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/40 focus:border-[#FBBF24]/40 transition-all"
                />
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FBBF24] text-[#0F172A] text-sm font-semibold hover:bg-[#FCD34D] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {savingProfile ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/20 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-[#FBBF24]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Ubah Password</h2>
              <p className="text-xs text-white/40">Perbarui password akun Anda</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Password Lama</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password lama"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/40 focus:border-[#FBBF24]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showCurrent ? "Sembunyikan password lama" : "Tampilkan password lama"}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/40 focus:border-[#FBBF24]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showNew ? "Sembunyikan password baru" : "Tampilkan password baru"}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-white/30 mt-1.5">Minimal 8 karakter.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Konfirmasi Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/40 focus:border-[#FBBF24]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showConfirm ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FBBF24] text-[#0F172A] text-sm font-semibold hover:bg-[#FCD34D] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {savingPassword ? "Menyimpan..." : "Ubah Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
