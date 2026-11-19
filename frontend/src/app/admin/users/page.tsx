"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getUser } from "@/services/auth";
import { createUser, deleteUser, getUsers, updateUser, type ManagedUser } from "@/services/cmsUsers";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const emptyForm: FormState = { name: "", email: "", password: "", confirmPassword: "" };

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

export default function UsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const currentUser = getUser();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal memuat daftar user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setShowPassword(false);
    setShowConfirm(false);
    setShowForm(true);
  };

  const openEdit = (u: ManagedUser) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: "", confirmPassword: "" });
    setErrors({});
    setShowPassword(false);
    setShowConfirm(false);
    setShowForm(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) errs.name = "Nama lengkap wajib diisi";
    if (!email) errs.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Format email tidak valid";

    if (!editing) {
      if (!form.password) errs.password = "Password wajib diisi";
      else if (form.password.length < 8) errs.password = "Password minimal 8 karakter";
      if (!form.confirmPassword) errs.confirmPassword = "Konfirmasi password wajib diisi";
      else if (form.password !== form.confirmPassword) errs.confirmPassword = "Konfirmasi password tidak sama";
    } else if (form.password || form.confirmPassword) {
      if (form.password.length < 8) errs.password = "Password minimal 8 karakter";
      if (form.password !== form.confirmPassword) errs.confirmPassword = "Konfirmasi password tidak sama";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        const payload: { name: string; email: string; password?: string; confirmPassword?: string } = {
          name: form.name.trim(),
          email: form.email.trim(),
        };
        if (form.password) {
          payload.password = form.password;
          payload.confirmPassword = form.confirmPassword;
        }
        await updateUser(editing.id, payload);
        toast.success("User berhasil diperbarui");
      } else {
        await createUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        });
        toast.success("User berhasil ditambahkan");
      }
      setShowForm(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      toast.success("User berhasil dihapus");
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menghapus user");
    } finally {
      setDeleting(false);
    }
  };

  const isSelf = (u: ManagedUser) => currentUser && Number(currentUser.id) === u.id;

  return (
    <div>
      <AdminPageHeader title="User" description="Manajemen akun Administrator">
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FBBF24] text-[#0F172A] text-sm font-semibold hover:bg-[#FCD34D] transition-all hover:scale-[1.02] shadow-lg shadow-[#FBBF24]/20"
        >
          <Plus className="w-4 h-4" />
          Tambah User
        </button>
      </AdminPageHeader>

      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-white/10">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/40 focus:border-[#FBBF24]/40 transition-all"
            />
          </div>
          <p className="text-xs text-white/40">Total: <span className="text-white/70 font-medium">{users.length}</span> user</p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-white/30 text-sm">Memuat data...</div>
        ) : paged.length === 0 ? (
          <div className="p-10 text-center text-white/30 text-sm">
            {search ? "Tidak ada user yang cocok" : "Belum ada user"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4 w-16">No</th>
                  <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4">Nama Lengkap</th>
                  <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4">Email</th>
                  <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4">Role</th>
                  <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4">Tanggal Dibuat</th>
                  <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((u, idx) => (
                  <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-white/50">{(safePage - 1) * perPage + idx + 1}</td>
                    <td className="py-3 px-4 text-white font-medium">{u.name}</td>
                    <td className="py-3 px-4 text-white/50">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[#FBBF24] text-xs font-medium">
                        {u.role || "admin"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/50">{formatDate(u.created_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-[#FBBF24] transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          disabled={!!isSelf(u)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={isSelf(u) ? "Tidak dapat menghapus akun sendiri" : "Hapus"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-t border-white/10">
            <p className="text-xs text-white/30">
              Menampilkan {(safePage - 1) * perPage + 1}-{Math.min(safePage * perPage, filtered.length)} dari {filtered.length} user
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, safePage - 1))}
                  disabled={safePage === 1}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-white/40 px-2">Halaman {safePage} dari {totalPages}</span>
                <button
                  onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                  disabled={safePage === totalPages}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] sm:pt-[12vh] p-4 bg-black/60 backdrop-blur-sm overflow-y-auto modal-scroll"
          onClick={() => !saving && setShowForm(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[#1E293B] border border-white/10 p-6 shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-white mb-4">{editing ? "Edit User" : "Tambah User"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Nama Lengkap</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/40"
                  placeholder="Nama lengkap"
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/40"
                  placeholder="email@contoh.ac.id"
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">
                  {editing ? "Password (opsional)" : "Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/40 pr-10"
                    placeholder={editing ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Konfirmasi Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/40 pr-10"
                    placeholder="Ulangi password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
              </div>
              <p className="text-[11px] text-white/30">Role otomatis ditetapkan sebagai <span className="text-white/50">admin</span>.</p>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-[#FBBF24] text-[#0F172A] hover:bg-[#FCD34D] transition-all disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && !deleting && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus User"
        description={deleteTarget ? `Apakah Anda yakin ingin menghapus user "${deleteTarget.name}"? Tindakan ini tidak dapat dibatalkan.` : "Apakah Anda yakin ingin menghapus user ini?"}
        loading={deleting}
      />
    </div>
  );
}
