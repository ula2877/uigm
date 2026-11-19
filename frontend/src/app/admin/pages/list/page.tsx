"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  ExternalLink,
  Loader2,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Menu,
  GripVertical,
  ChevronDown,
  ChevronRight,
  ChevronDown as ChevronDownIcon,
  Copy,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  getPages,
  getPageBySlug,
  deletePage,
  publishPage,
  unpublishPage,
  getNavbarItemsAdmin,
  createNavbarItem,
  deleteNavbarItem,
  reorderNavbarItems,
  updateNavbarItem,
  getAvailablePagesForNavbar,
  updatePageSlug,
  createPage,
  getNavbarSettings,
  updateNavbarSettings,
  getFooterSettings,
  updateFooterSettings,
} from "@/services/cms";
import type { Page } from "@/types/cms";
import type { NavbarItem, AvailablePage, NavbarSettings, FooterSettings } from "@/services/cms";

export default function PagesListPage() {
  const router = useRouter();

  // Pages state
  const [pages, setPages] = useState<Page[]>([]);
  const [pagesLoading, setPagesLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Navbar state
  const [tab, setTab] = useState<"pages" | "navbar" | "footer">("pages");
  const [navbarItems, setNavbarItems] = useState<NavbarItem[]>([]);
  const [navbarLoading, setNavbarLoading] = useState(false);
  const [availablePages, setAvailablePages] = useState<AvailablePage[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newPageId, setNewPageId] = useState<number | null>(null);
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  const [navbarSaving, setNavbarSaving] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  // Slug edit modal
  const [slugEditPage, setSlugEditPage] = useState<Page | null>(null);
  const [slugEditValue, setSlugEditValue] = useState("");
  const [slugEditSaving, setSlugEditSaving] = useState(false);

  // Navbar settings
  const [navbarSettings, setNavbarSettings] = useState<NavbarSettings | null>(
    null,
  );
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Footer settings
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(
    null,
  );
  const [footerSaving, setFooterSaving] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);

  // Copy page modal
  const [copyPage, setCopyPage] = useState<Page | null>(null);
  const [copySlugValue, setCopySlugValue] = useState("");
  const [copyTitleValue, setCopyTitleValue] = useState("");
  const [copySaving, setCopySaving] = useState(false);

  // Load data halaman
  const loadPages = async () => {
    try {
      setPagesLoading(true);
      const data = await getPages();
      setPages(data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat daftar halaman");
    } finally {
      setPagesLoading(false);
    }
  };

  // Load navbar items
  const loadNavbarItems = async () => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/admin");
      return;
    }

    try {
      setNavbarLoading(true);
      const [itemsData, pagesData, settingsData] = await Promise.all([
        getNavbarItemsAdmin(),
        getAvailablePagesForNavbar(),
        getNavbarSettings(),
      ]);
      setNavbarItems(itemsData);
      setAvailablePages(pagesData);
      setNavbarSettings(settingsData);
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        router.push("/admin");
        return;
      }
      toast.error("Gagal memuat navbar");
    } finally {
      setNavbarLoading(false);
    }
  };

  // Save navbar settings
  const handleSaveSettings = async () => {
    if (!navbarSettings) return;
    try {
      setSettingsSaving(true);
      const updated = await updateNavbarSettings(navbarSettings);
      setNavbarSettings(updated);
      toast.success("Pengaturan navbar berhasil disimpan");
    } catch (error: any) {
      console.error("[Settings] Gagal simpan:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Gagal menyimpan pengaturan");
    } finally {
      setSettingsSaving(false);
    }
  };

  // Load footer settings
  const loadFooterSettings = async () => {
    try {
      setFooterLoading(true);
      const data = await getFooterSettings();
      setFooterSettings(data);
    } catch (error) {
      toast.error("Gagal memuat pengaturan footer");
    } finally {
      setFooterLoading(false);
    }
  };

  // Save footer settings
  const handleSaveFooter = async () => {
    if (!footerSettings) return;
    try {
      setFooterSaving(true);
      const updated = await updateFooterSettings(footerSettings);
      setFooterSettings(updated);
      toast.success("Pengaturan footer berhasil disimpan");
    } catch (error: any) {
      console.error("[Footer] Gagal simpan:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Gagal menyimpan pengaturan");
    } finally {
      setFooterSaving(false);
    }
  };

  useEffect(() => {
    loadPages();

    // Check hash on mount
    if (typeof window !== "undefined" && window.location.hash === "#navbar") {
      setTab("navbar");
    }
    if (typeof window !== "undefined" && window.location.hash === "#footer") {
      setTab("footer");
    }
  }, []);

  // Load navbar when tab changes
  useEffect(() => {
    if (tab === "navbar") {
      loadNavbarItems();
    }
    if (tab === "footer") {
      loadFooterSettings();
    }
  }, [tab]);

  // Toggle publish/unpublish halaman
  const handlePublishToggle = async (page: Page) => {
    try {
      setUpdatingId(page.id);
      if (page.published) {
        await unpublishPage(page.slug);
        toast.success("Halaman berhasil ditarik dari publikasi");
      } else {
        await publishPage(page.slug);
        toast.success("Halaman berhasil dipublikasikan");
      }
      await loadPages();
    } catch (error) {
      console.error(error);
      toast.error(
        page.published
          ? "Gagal menarik publikasi"
          : "Gagal mempublikasikan halaman",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Hapus halaman
  const handleDelete = async (page: Page) => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin menghapus halaman "${page.title}"?`,
      )
    ) {
      return;
    }

    try {
      setDeletingId(page.id);
      await deletePage(page.slug);
      toast.success("Halaman berhasil dihapus");
      await loadPages();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus halaman");
    } finally {
      setDeletingId(null);
    }
  };

  // Copy halaman
  const handleCopyPage = async (page: Page) => {
    try {
      const fullPage = await getPageBySlug(page.slug);
      setCopyPage(fullPage || page);
    } catch {
      setCopyPage(page);
    }
    setCopyTitleValue(`Salinan - ${page.title}`);
    setCopySlugValue(`salinan-${page.slug || "beranda"}`);
  };

  const handleCopyConfirm = async () => {
    if (!copyPage || !copySlugValue.trim()) {
      toast.error("Slug harus diisi");
      return;
    }
    try {
      setCopySaving(true);
      await createPage({
        slug: copySlugValue.trim(),
        title: copyTitleValue.trim(),
        content: copyPage.content,
        published: false,
      });
      toast.success("Halaman berhasil disalin");
      setCopyPage(null);
      await loadPages();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Gagal menyalin halaman";
      toast.error(msg);
    } finally {
      setCopySaving(false);
    }
  };

  // Edit slug
  const handleEditSlug = (page: Page) => {
    setSlugEditPage(page);
    setSlugEditValue(page.slug);
  };

  const handleSlugSave = async () => {
    if (!slugEditPage || !slugEditValue.trim()) {
      toast.error("Slug harus diisi");
      return;
    }
    try {
      setSlugEditSaving(true);
      await updatePageSlug(slugEditPage.slug, slugEditValue.trim());
      toast.success("Slug berhasil diubah");
      setSlugEditPage(null);
      await loadPages();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Gagal mengubah slug";
      toast.error(msg);
    } finally {
      setSlugEditSaving(false);
    }
  };

  // Navbar handlers
  const handleAddNavbarItem = async () => {
    if (!newLabel.trim()) {
      toast.error("Label harus diisi");
      return;
    }

    if (!newPageId) {
      toast.error("CMS Page harus dipilih");
      return;
    }

    try {
      setNavbarSaving(true);

      console.log("[ADMIN] ===== NAVBAR CREATE =====");
      console.log("[ADMIN] Form state:", {
        newLabel,
        newPageId,
        selectedParentId,
        newLabelTrimmed: newLabel.trim(),
      });

      const payload = {
        label: newLabel,
        page_id: newPageId,
        parent_id: selectedParentId || null,
      };

      console.log(
        "[ADMIN] Payload before sending:",
        JSON.stringify(payload, null, 2),
      );
      console.log("[ADMIN] Payload details:", {
        label: {
          value: payload.label,
          type: typeof payload.label,
          length: payload.label?.length,
        },
        page_id: {
          value: payload.page_id,
          type: typeof payload.page_id,
        },
        parent_id: {
          value: payload.parent_id,
          type: typeof payload.parent_id,
          isNull: payload.parent_id === null,
        },
      });

      const response = await createNavbarItem(payload);
      console.log("[ADMIN] ✓ Navbar item created successfully:");
      console.log("[ADMIN] Response:", JSON.stringify(response, null, 2));

      toast.success(
        selectedParentId
          ? "Submenu berhasil ditambahkan"
          : "Menu berhasil ditambahkan",
      );
      setNewLabel("");
      setNewPageId(null);
      setSelectedParentId(null);
      await loadNavbarItems();
    } catch (error) {
      console.error("[ADMIN] ✗ Error creating navbar item");
      console.error("[ADMIN] Error object:", error);
      const errorMsg =
        (error as any)?.response?.data?.message || "Gagal menambah menu";
      console.error("[ADMIN] Error message:", errorMsg);
      console.error(
        "[ADMIN] Full error response:",
        (error as any)?.response?.data,
      );
      console.error("[ADMIN] Error code:", (error as any)?.response?.status);
      toast.error(errorMsg);
    } finally {
      setNavbarSaving(false);
    }
  };

  const handleDeleteNavbarItem = async (id: number) => {
    if (!confirm("Hapus menu ini?")) return;

    try {
      await deleteNavbarItem(id);
      toast.success("Menu berhasil dihapus");
      await loadNavbarItems();
    } catch (error) {
      toast.error("Gagal menghapus menu");
    }
  };

  const handleToggleNavbarActive = async (item: NavbarItem) => {
    try {
      await updateNavbarItem(item.id, { active: !item.active });
      toast.success(item.active ? "Menu disembunyikan" : "Menu ditampilkan");
      await loadNavbarItems();
    } catch (error) {
      toast.error("Gagal update menu");
    }
  };

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleNavbarDragStart = (id: number) => {
    setDraggedItem(id);
  };

  const handleNavbarDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleNavbarDrop = async (targetId: number) => {
    if (!draggedItem || draggedItem === targetId) return;

    const dragged = navbarItems.find((i) => i.id === draggedItem);
    const target = navbarItems.find((i) => i.id === targetId);
    if (!dragged || !target) return;

    const sameScope =
      (dragged.parent_id || null) === (target.parent_id || null);
    if (!sameScope) return;

    const newItems = [...navbarItems];
    const draggedIndex = newItems.findIndex((i) => i.id === draggedItem);
    const targetIndex = newItems.findIndex((i) => i.id === targetId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedItemData] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItemData);

    setNavbarItems(newItems);
    setDraggedItem(null);

    try {
      const reorderedItems = newItems
        .filter(
          (i) => (i.parent_id || null) === (dragged.parent_id || null),
        )
        .map((item, idx) => ({
          id: item.id,
          order_index: idx,
        }));
      await reorderNavbarItems(reorderedItems);
      toast.success("Urutan menu berhasil diperbarui");
      await loadNavbarItems();
    } catch (error) {
      toast.error("Gagal memperbarui urutan menu");
      await loadNavbarItems();
    }
  };

  const handleEditPage = (page: Page) => {
    if (page.slug === "") {
      router.push("/admin/pages");
    } else {
      router.push(`/admin/pages/${page.slug}`);
    }
  };

  if (pagesLoading && tab === "pages") {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 text-[#FBBF24] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">
            Kelola Konten
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Kelola halaman dan navigasi website
          </p>
        </div>
        {tab === "pages" && (
          <button
            onClick={() => router.push("/admin/pages/baru")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FBBF24] text-[#0F172A] text-sm font-semibold hover:bg-[#FCD34D] transition-all"
          >
            <Plus className="w-4 h-4" />
            Halaman Baru
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setTab("pages")}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
            tab === "pages"
              ? "text-[#FBBF24] border-[#FBBF24]"
              : "text-white/50 hover:text-white border-transparent"
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Halaman
        </button>
        <button
          onClick={() => setTab("navbar")}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
            tab === "navbar"
              ? "text-[#FBBF24] border-[#FBBF24]"
              : "text-white/50 hover:text-white border-transparent"
          }`}
        >
          <Menu className="w-4 h-4 inline mr-2" />
          Navbar
        </button>
        <button
          onClick={() => setTab("footer")}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
            tab === "footer"
              ? "text-[#FBBF24] border-[#FBBF24]"
              : "text-white/50 hover:text-white border-transparent"
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Footer
        </button>
      </div>

      {/* Pages Tab */}
      {tab === "pages" && (
        <div className="space-y-4">
          {pages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 mb-4">Belum ada halaman</p>
              <button
                onClick={() => router.push("/admin/pages/baru")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                Buat Halaman Pertama
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4">
                      Judul
                    </th>
                    <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4">
                      Slug
                    </th>
                    <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4 w-32">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4 w-28">
                      Diperbarui
                    </th>
                    <th className="text-right text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4 w-40">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr
                      key={page.id}
                      onClick={() => handleEditPage(page)}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-white/30" />
                          <span className="text-white font-medium">
                            {page.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/40 font-mono text-xs">
                        {page.slug === "" ? "/" : `/${page.slug}`}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            page.published
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-yellow-500/10 text-yellow-400"
                          }`}
                        >
                          {page.published ? "Dipublikasikan" : "Draft"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white/40 text-xs">
                        {page.updated_at
                          ? new Date(page.updated_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePublishToggle(page);
                            }}
                            disabled={updatingId === page.id}
                            title={
                              page.published
                                ? "Tarik dari publikasi"
                                : "Publikasikan"
                            }
                            className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors disabled:opacity-50"
                          >
                            {updatingId === page.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : page.published ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>

                          {page.slug !== "" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPage(page);
                              }}
                              title="Salin halaman"
                              className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-blue-400 transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          )}

                          <a
                            href={page.slug === "" ? "/" : `/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Lihat"
                            className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(page);
                            }}
                            disabled={deletingId === page.id}
                            title="Hapus"
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            {deletingId === page.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Navbar Tab */}
      {tab === "navbar" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">
              Tambah Menu {selectedParentId ? "Submenu" : "Baru"}
            </h3>
            <p className="text-xs text-white/50 mb-4">
              Pilih CMS Page untuk menautkan ke menu. URL akan otomatis
              di-generate dari slug halaman.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedParentId && (
                <div className="md:col-span-3 mb-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FBBF24]/10 border border-[#FBBF24]/20">
                    <span className="text-xs text-[#FBBF24]">
                      Parent:{" "}
                      <span className="font-semibold">
                        {
                          navbarItems.find((i) => i.id === selectedParentId)
                            ?.label
                        }
                      </span>
                    </span>
                    <button
                      onClick={() => setSelectedParentId(null)}
                      className="ml-2 text-xs text-[#FBBF24] hover:text-[#FCD34D] font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Label menu (contoh: Tentang PPNS)"
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
              />

              <div className="relative">
                <button
                  onClick={() => setShowPageDropdown(!showPageDropdown)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40 text-left flex items-center justify-between hover:bg-white/8 transition-colors"
                >
                  <span className={newPageId ? "text-white" : "text-white/50"}>
                    {newPageId
                      ? availablePages.find((p) => p.id === newPageId)?.label ||
                        "Pilih halaman..."
                      : "Pilih CMS Page..."}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${showPageDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showPageDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#1E293B] border border-white/10 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {availablePages.length > 0 ? (
                      <>
                        <div className="px-3 py-2 text-xs text-white/40 font-semibold uppercase tracking-wider border-b border-white/5 sticky top-0 bg-[#1E293B]">
                          Available Pages:
                        </div>
                        {availablePages.map((page) => (
                          <button
                            key={page.id}
                            onClick={() => {
                              setNewPageId(page.id);
                              setShowPageDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors border-b border-white/5 last:border-0 ${
                              newPageId === page.id
                                ? "bg-[#FBBF24]/20 text-[#FBBF24] font-medium"
                                : "text-white/70 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span className="font-medium block">
                              {page.label}
                            </span>
                            <span className="text-white/40 text-xs">
                              {page.href}
                            </span>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="px-3 py-4 text-xs text-white/40 text-center">
                        Belum ada CMS page yang aktif
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/50">Auto-generated:</span>
                <span className="text-sm font-mono text-[#FBBF24]">
                  {newPageId
                    ? availablePages.find((p) => p.id === newPageId)?.href ||
                      "-"
                    : "-"}
                </span>
              </div>

              <button
                onClick={handleAddNavbarItem}
                disabled={navbarSaving || !newPageId}
                className="md:col-span-3 px-4 py-2 rounded-lg bg-[#FBBF24] text-[#0F172A] text-sm font-semibold hover:bg-[#FCD34D] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {navbarSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {navbarSaving ? "Menambah..." : "Tambah"}
              </button>
            </div>
          </div>

          {/* Navbar Settings */}
          {navbarSettings && (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-sm font-semibold text-white mb-4">
                Pengaturan Navbar
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">
                    Nama Situs
                  </label>
                  <input
                    type="text"
                    value={navbarSettings.site_name}
                    onChange={(e) =>
                      setNavbarSettings({
                        ...navbarSettings,
                        site_name: e.target.value,
                      })
                    }
                    placeholder="PPNS"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer">
                    <div>
                      <span className="text-sm text-white font-medium">
                        Tampilkan Admin
                      </span>
                      <p className="text-xs text-white/40 mt-0.5">
                        Tombol Admin di navbar
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={navbarSettings.show_admin}
                      onChange={(e) =>
                        setNavbarSettings({
                          ...navbarSettings,
                          show_admin: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[#FBBF24]"
                    />
                  </label>

                  <label className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer">
                    <div>
                      <span className="text-sm text-white font-medium">
                        Tampilkan Info Akademik
                      </span>
                      <p className="text-xs text-white/40 mt-0.5">
                        Tombol Info Akademik di navbar
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={navbarSettings.show_info_akademik}
                      onChange={(e) =>
                        setNavbarSettings({
                          ...navbarSettings,
                          show_info_akademik: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[#FBBF24]"
                    />
                  </label>
                </div>

                {navbarSettings.show_info_akademik && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">
                        Label Info Akademik
                      </label>
                      <input
                        type="text"
                        value={navbarSettings.info_akademik_label}
                        onChange={(e) =>
                          setNavbarSettings({
                            ...navbarSettings,
                            info_akademik_label: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">
                        Link Info Akademik
                      </label>
                      <input
                        type="text"
                        value={navbarSettings.info_akademik_href}
                        onChange={(e) =>
                          setNavbarSettings({
                            ...navbarSettings,
                            info_akademik_href: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    disabled={settingsSaving}
                    className="px-4 py-2 rounded-lg bg-[#FBBF24] text-[#0F172A] text-sm font-semibold hover:bg-[#FCD34D] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {settingsSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    {settingsSaving ? "Menyimpan..." : "Simpan Pengaturan"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {navbarLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 text-[#FBBF24] animate-spin" />
            </div>
          ) : navbarItems.filter((i) => !i.parent_id).length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/10">
              <Menu className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">Belum ada menu navbar</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="p-4 space-y-2">
                {navbarItems
                  .filter((i) => !i.parent_id)
                  .map((item) => {
                    const hasChildren = navbarItems.some(
                      (i) => i.parent_id === item.id,
                    );
                    const isExpanded = expandedItems.has(item.id);
                    const children = navbarItems.filter(
                      (i) => i.parent_id === item.id,
                    );

                    return (
                      <div key={item.id} className="space-y-1">
                        <div
                          draggable
                          onDragStart={() => handleNavbarDragStart(item.id)}
                          onDragOver={handleNavbarDragOver}
                          onDrop={() => handleNavbarDrop(item.id)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-move ${
                            draggedItem === item.id
                              ? "bg-[#FBBF24]/20 border-[#FBBF24]/40"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {hasChildren ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded(item.id);
                              }}
                              className="p-0 text-white/50 hover:text-white transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            <GripVertical className="w-4 h-4 text-white/30" />
                          )}
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">
                              {item.label}
                            </p>
                            {item.page_slug && (
                              <p className="text-white/40 text-xs">
                                → {item.page_slug}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedParentId(item.id);
                                setNewLabel("");
                                setNewPageId(null);
                              }}
                              title="Tambah submenu"
                              className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleNavbarActive(item);
                              }}
                              title={item.active ? "Sembunyikan" : "Tampilkan"}
                              className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                            >
                              {item.active ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNavbarItem(item.id);
                              }}
                              title="Hapus"
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {hasChildren && isExpanded && (
                          <div className="ml-8 space-y-1">
                            {children.map((child) => (
                              <div
                                key={child.id}
                                draggable
                                onDragStart={() =>
                                  handleNavbarDragStart(child.id)
                                }
                                onDragOver={handleNavbarDragOver}
                                onDrop={() => handleNavbarDrop(child.id)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all cursor-move ${
                                  draggedItem === child.id
                                    ? "bg-[#FBBF24]/20 border-[#FBBF24]/40"
                                    : "bg-white/[0.03] border-white/10 hover:bg-white/5"
                                }`}
                              >
                                <GripVertical className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium text-sm">
                                    {child.label}
                                  </p>
                                  {child.page_slug && (
                                    <p className="text-white/40 text-xs truncate">
                                      → {child.page_slug}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleNavbarActive(child);
                                    }}
                                    title={
                                      child.active ? "Sembunyikan" : "Tampilkan"
                                    }
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                                  >
                                    {child.active ? (
                                      <Eye className="w-4 h-4" />
                                    ) : (
                                      <EyeOff className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNavbarItem(child.id);
                                    }}
                                    title="Hapus"
                                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          <p className="text-xs text-white/30 text-center">
            Drag & drop untuk mengubah urutan menu | Klik + untuk tambah
            submenu
          </p>
        </div>
      )}

      {/* Footer Tab */}
      {tab === "footer" && (
        <div className="space-y-4">
          {footerLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 text-[#FBBF24] animate-spin" />
            </div>
          ) : !footerSettings ? (
            <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/10">
              <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">Gagal memuat pengaturan footer</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-sm font-semibold text-white mb-1">
                Pengaturan Footer
              </h3>
              <p className="text-xs text-white/50 mb-6">
                Navigasi footer otomatis mengikuti menu Navbar (tanpa submenu). Kontak otomatis mengikuti halaman Kontak.
              </p>

              <div className="space-y-6">
                {/* Branding */}
                <div>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Branding</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Nama Situs</label>
                      <input
                        type="text"
                        value={footerSettings.site_name}
                        onChange={(e) => setFooterSettings({ ...footerSettings, site_name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Tagline</label>
                      <input
                        type="text"
                        value={footerSettings.tagline}
                        onChange={(e) => setFooterSettings({ ...footerSettings, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs text-white/50 mb-1.5">Deskripsi</label>
                    <textarea
                      value={footerSettings.description}
                      onChange={(e) => setFooterSettings({ ...footerSettings, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40 resize-none"
                    />
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Media Sosial</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: "facebook_url", label: "Facebook URL" },
                      { key: "twitter_url", label: "X (Twitter) URL" },
                      { key: "instagram_url", label: "Instagram URL" },
                      { key: "linkedin_url", label: "LinkedIn URL" },
                      { key: "youtube_url", label: "YouTube URL" },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-xs text-white/50 mb-1.5">{label}</label>
                        <input
                          type="url"
                          value={(footerSettings as any)[key]}
                          onChange={(e) => setFooterSettings({ ...footerSettings, [key]: e.target.value })}
                          placeholder="https://"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Copyright */}
                <div>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Copyright</h4>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Teks Copyright</label>
                    <input
                      type="text"
                      value={footerSettings.copyright_text}
                      onChange={(e) => setFooterSettings({ ...footerSettings, copyright_text: e.target.value })}
                      placeholder="PPNS Smart Maritime Campus. All rights reserved."
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
                    />
                    <p className="text-[10px] text-white/30 mt-1">Akan ditampilkan sebagai: &copy; 2026 {footerSettings.copyright_text}</p>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Tautan Bawah</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { labelKey: "privacy_label", urlKey: "privacy_url", label: "Kebijakan Privasi" },
                      { labelKey: "terms_label", urlKey: "terms_url", label: "Syarat & Ketentuan" },
                      { labelKey: "faq_label", urlKey: "faq_url", label: "FAQ" },
                    ].map(({ labelKey, urlKey }) => (
                      <div key={labelKey} className="space-y-1">
                        <input
                          type="text"
                          value={(footerSettings as any)[labelKey]}
                          onChange={(e) => setFooterSettings({ ...footerSettings, [labelKey]: e.target.value })}
                          placeholder={labelKey.replace("_label", "")}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
                        />
                        <input
                          type="url"
                          value={(footerSettings as any)[urlKey]}
                          onChange={(e) => setFooterSettings({ ...footerSettings, [urlKey]: e.target.value })}
                          placeholder="https://"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={handleSaveFooter}
                  disabled={footerSaving}
                  className="px-4 py-2 rounded-lg bg-[#FBBF24] text-[#0F172A] text-sm font-semibold hover:bg-[#FCD34D] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {footerSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {footerSaving ? "Menyimpan..." : "Simpan Pengaturan Footer"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slug Edit Modal */}
      {slugEditPage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSlugEditPage(null)}
        >
          <div
            className="w-full max-w-md mx-4 bg-slate-800 rounded-2xl border border-white/10 shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-1">
              Ubah Slug
            </h3>
            <p className="text-sm text-white/50 mb-4">
              <span className="text-white/80">{slugEditPage.title}</span>
            </p>

            <label className="block text-sm text-white/60 mb-1.5">Slug baru</label>
            <input
              type="text"
              value={slugEditValue}
              onChange={(e) =>
                setSlugEditValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
              }
              placeholder="contoh: halaman-baru"
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors mb-4"
              autoFocus
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSlugEditPage(null)}
                className="px-4 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSlugSave}
                disabled={slugEditSaving || !slugEditValue.trim()}
                className="px-4 py-2 rounded-xl bg-[#FBBF24]/10 text-[#FBBF24] hover:bg-[#FBBF24]/20 border border-[#FBBF24]/20 transition-colors text-sm font-medium disabled:opacity-40"
              >
                {slugEditSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Page Modal */}
      {copyPage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setCopyPage(null)}
        >
          <div
            className="w-full max-w-md mx-4 bg-slate-800 rounded-2xl border border-white/10 shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-1">
              Salin Halaman
            </h3>
            <p className="text-sm text-white/50 mb-4">
              Buat salinan dari <span className="text-white/80">{copyPage.title}</span>
            </p>

            <label className="block text-sm text-white/60 mb-1.5">Judul</label>
            <input
              type="text"
              value={copyTitleValue}
              onChange={(e) => setCopyTitleValue(e.target.value)}
              placeholder="Judul halaman baru"
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors mb-4"
            />

            <label className="block text-sm text-white/60 mb-1.5">Slug</label>
            <input
              type="text"
              value={copySlugValue}
              onChange={(e) =>
                setCopySlugValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
              }
              placeholder="contoh: halaman-baru"
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors mb-4"
              autoFocus
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCopyPage(null)}
                className="px-4 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleCopyConfirm}
                disabled={copySaving || !copySlugValue.trim() || !copyTitleValue.trim()}
                className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors text-sm font-medium disabled:opacity-40"
              >
                {copySaving ? "Menyalin..." : "Salin Halaman"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
