import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
    Badge,
    Toggle,
    ProgressBar,
    PlusIcon,
    DotsIcon,
    EditIcon,
    TrashIcon,
    CopyIcon,
    CloseIcon,
    CheckCircleIcon,
} from "../components/ui";
import {
    getFoundationCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign as deleteCampaignById,
    getFoundationItems,
    createDonationItem,
    updateDonationItem,
    deleteDonationItem,
    toggleDonationItem,
    getFoundationProfile,
    getCampaignDonations,
} from "../lib/databaseUtils";

// Seccion 1: Dashboard principal de la fundación, con estadísticas, acceso rápido a secciones clave y vista previa de campañas activas. Desde aquí la fundación puede navegar a la gestión de campañas, ítems de donación y perfil. =============================================
// ─── Foundation Home / Dashboard ───────────────────────────────────────────────
export function FoundationHome({ setPage }) {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [stats, setStats] = useState({
        totalRecaudado: 0,
        campaignasActivas: 0,
        itemsCount: 0,
        donantesTotales: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFoundationData = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const [campaignsData, itemsData, foundationData] =
                    await Promise.all([
                        getFoundationCampaigns(user.id),
                        getFoundationItems(user.id),
                        getFoundationProfile(user.id),
                    ]);

                setCampaigns(campaignsData || []);

                // Calculate stats
                const activeCampaigns = (campaignsData || []).filter(
                    (c) => c.status === "active" || !c.status,
                ).length;
                const totalRaised = (campaignsData || []).reduce(
                    (sum, c) => sum + (c.raised || 0),
                    0,
                );
                const totalDonors = new Set(
                    (campaignsData || []).flatMap((c) => c.donor_count || 0),
                ).size;

                setStats({
                    totalRecaudado: totalRaised,
                    campaignasActivas: activeCampaigns,
                    itemsCount: (itemsData || []).length,
                    donantesTotales: totalDonors,
                });
            } catch (err) {
                console.error("Error loading foundation data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadFoundationData();
    }, [user?.id]);
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Welcome */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-48 h-full opacity-10">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        <circle cx="160" cy="40" r="80" fill="white" />
                        <circle cx="40" cy="160" r="60" fill="white" />
                    </svg>
                </div>
                <p className="text-blue-200 text-sm mb-1">Panel de gestión</p>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    {user?.name || "Fundación Educativa"}
                </h1>
                <p className="text-blue-100 text-sm">
                    Administra tus campañas e ítems de donación
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                    {
                        label: "Total recaudado",
                        value: `$${stats.totalRecaudado.toLocaleString("es")}`,
                        color: "text-blue-600",
                    },
                    {
                        label: "Campañas activas",
                        value: stats.campaignasActivas,
                        color: "text-gray-900",
                    },
                    {
                        label: "Ítems de donación",
                        value: stats.itemsCount,
                        color: "text-gray-900",
                    },
                    {
                        label: "Donantes totales",
                        value: stats.donantesTotales,
                        color: "text-gray-900",
                    },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
                    >
                        <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                        <p className={`text-2xl font-bold ${s.color}`}>
                            {s.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">
                Acciones rápidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                    {
                        label: "Crear campaña",
                        desc: "Lanza una nueva campaña de recaudación",
                        page: "manage-campaigns",
                        icon: "🚀",
                    },
                    {
                        label: "Gestionar ítems",
                        desc: "Administra tus ítems de donación",
                        page: "manage-items",
                        icon: "📦",
                    },
                    {
                        label: "Ver mi perfil",
                        desc: "Edita la información de tu fundación",
                        page: "foundation-profile",
                        icon: "🏛️",
                    },
                ].map((a) => (
                    <button
                        key={a.label}
                        onClick={() => setPage(a.page)}
                        className="bg-white border border-gray-100 rounded-2xl p-5 text-left hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm"
                    >
                        <span className="text-2xl mb-2 block">{a.icon}</span>
                        <p className="font-semibold text-gray-900">{a.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
                    </button>
                ))}
            </div>

            {/* Active campaigns preview */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">
                Campañas activas
            </h2>
            <div className="space-y-3">
                {loading ? (
                    <p className="text-gray-500">Cargando campañas...</p>
                ) : campaigns.length === 0 ? (
                    <p className="text-gray-500">No hay campañas activas</p>
                ) : (
                    campaigns.map((c) => {
                        const pct = Math.round(
                            ((c.raised || 0) / (c.goal || 1)) * 100,
                        );
                        return (
                            <div
                                key={c.id}
                                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-5"
                            >
                                <img
                                    src={
                                        c.image ||
                                        c.cover_image ||
                                        "https://via.placeholder.com/56"
                                    }
                                    alt={c.title}
                                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">
                                        {c.title}
                                    </p>
                                    <ProgressBar
                                        percent={pct}
                                        className="mt-2 mb-1"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>
                                            $
                                            {(c.raised || 0).toLocaleString(
                                                "es",
                                            )}{" "}
                                            recaudados
                                        </span>
                                        <span>{pct}%</span>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-gray-400">
                                        Donantes
                                    </p>
                                    <p className="font-bold text-gray-900">
                                        {c.donor_count || 0}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// ─── Manage Donation Items ──────────────────────────────────────────────────────
export function ManageItemsPage() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [openMenu, setOpenMenu] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadItems = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const data = await getFoundationItems(user.id);
                setItems(data || []);
            } catch (err) {
                console.error("Error loading items:", err);
            } finally {
                setLoading(false);
            }
        };
        loadItems();
    }, [user?.id]);

    const toggleActive = async (id) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;
        try {
            await toggleDonationItem(id, !item.active);
            setItems(
                items.map((i) =>
                    i.id === id ? { ...i, active: !i.active } : i,
                ),
            );
        } catch (err) {
            console.error("Error toggling item:", err);
        }
    };

    const deleteItem = async (id) => {
        try {
            await deleteDonationItem(id);
            setItems(items.filter((i) => i.id !== id));
            setDeleteConfirm(null);
        } catch (err) {
            console.error("Error deleting item:", err);
        }
    };

    const duplicateItem = async (item) => {
        try {
            setSaving(true);
            const newItem = {
                ...item,
                name: item.name + " (copia)",
                active: true,
            };
            delete newItem.id;
            const created = await createDonationItem(user.id, newItem);
            setItems([...items, created]);
            setOpenMenu(null);
        } catch (err) {
            console.error("Error duplicating item:", err);
        } finally {
            setSaving(false);
        }
    };

    const openCreate = () => {
        setEditItem(null);
        setShowModal(true);
    };
    const openEdit = (item) => {
        setEditItem(item);
        setShowModal(true);
        setOpenMenu(null);
    };

    const saveItem = async (data) => {
        try {
            setSaving(true);
            if (editItem) {
                await updateDonationItem(editItem.id, data);
                setItems(
                    items.map((i) =>
                        i.id === editItem.id ? { ...i, ...data } : i,
                    ),
                );
            } else {
                const created = await createDonationItem(user.id, {
                    ...data,
                    active: true,
                });
                setItems([...items, created]);
            }
            setShowModal(false);
            setEditItem(null);
        } catch (err) {
            console.error("Error saving item:", err);
            alert("Error al guardar el ítem. Por favor intenta de nuevo.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Gestión de donaciones
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Administra los ítems de donación disponibles para tu
                        fundación
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" /> Crear nuevo ítem
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">Cargando ítems...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">
                            No hay ítems de donación creados
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-gray-100">
                                <tr>
                                    {[
                                        "Ítem",
                                        "Categoría",
                                        "Valor",
                                        "Impacto",
                                        "Estado",
                                        "Disponibles",
                                        "Actualizado",
                                        "",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left px-4 py-4 font-medium text-gray-600 text-xs"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-4">
                                            <p className="font-medium text-gray-900">
                                                {item.name}
                                            </p>
                                            {item.tag && (
                                                <Badge label={item.tag} />
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <Badge
                                                label={item.category || "Otros"}
                                            />
                                        </td>
                                        <td className="px-4 py-4 font-semibold text-gray-900">
                                            $
                                            {(item.price || 0).toLocaleString(
                                                "es",
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-gray-500 max-w-xs truncate">
                                            {item.impact}
                                        </td>
                                        <td className="px-4 py-4">
                                            <Toggle
                                                checked={item.active}
                                                onChange={() =>
                                                    toggleActive(item.id)
                                                }
                                            />
                                        </td>
                                        <td
                                            className={`px-4 py-4 font-semibold ${item.available === 0 ? "text-red-500" : "text-gray-900"}`}
                                        >
                                            {item.available}
                                        </td>
                                        <td className="px-4 py-4 text-gray-400 text-xs">
                                            {item.updated}
                                        </td>
                                        <td className="px-4 py-4 relative">
                                            <button
                                                onClick={() =>
                                                    setOpenMenu(
                                                        openMenu === item.id
                                                            ? null
                                                            : item.id,
                                                    )
                                                }
                                                className="text-gray-400 hover:text-gray-600 p-1 rounded"
                                            >
                                                <DotsIcon />
                                            </button>
                                            {openMenu === item.id && (
                                                <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 w-36">
                                                    <button
                                                        onClick={() =>
                                                            openEdit(item)
                                                        }
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <EditIcon /> Editar
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            duplicateItem(item)
                                                        }
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <CopyIcon /> Duplicar
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setDeleteConfirm(
                                                                item.id,
                                                            );
                                                            setOpenMenu(null);
                                                        }}
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                                                    >
                                                        <TrashIcon /> Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete confirm */}
            {deleteConfirm && (
                <Modal
                    title="Eliminar ítem"
                    onClose={() => setDeleteConfirm(null)}
                >
                    <p className="text-sm text-gray-600 mb-6">
                        ¿Estás seguro de que deseas eliminar este ítem? Esta
                        acción no se puede deshacer.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setDeleteConfirm(null)}
                            className="border border-gray-300 px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => deleteItem(deleteConfirm)}
                            className="bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-700"
                        >
                            Eliminar
                        </button>
                    </div>
                </Modal>
            )}

            {/* Create / Edit modal */}
            {showModal && (
                <ItemFormModal
                    initial={editItem}
                    onSave={saveItem}
                    onClose={() => {
                        setShowModal(false);
                        setEditItem(null);
                    }}
                />
            )}
        </div>
    );
}

// ─── Modal wrapper ─────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

// ─── Item Form Modal ───────────────────────────────────────────────────────────
function ItemFormModal({ initial, onSave, onClose }) {
    const [form, setForm] = useState({
        name: initial?.name || "",
        category: initial?.category || "",
        price: initial?.price || "",
        available: initial?.available || "",
        impact: initial?.impact || "",
        tag: initial?.tag || "",
        active: initial?.active ?? true,
    });
    const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

    const isEdit = !!initial;

    return (
        <Modal
            title={
                isEdit
                    ? "Editar ítem de donación"
                    : "Crear nuevo ítem de donación"
            }
            onClose={onClose}
        >
            <p className="text-sm text-gray-500 mb-5">
                Completa la información del ítem que los usuarios podrán donar
            </p>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                        Nombre del ítem
                    </label>
                    <input
                        value={form.name}
                        onChange={(e) => set("name")(e.target.value)}
                        placeholder="Ej: Kit escolar completo"
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                        Categoría
                    </label>
                    <select
                        value={form.category}
                        onChange={(e) => set("category")(e.target.value)}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona una categoría</option>
                        {[
                            "Educación",
                            "Salud",
                            "Animales",
                            "Medio Ambiente",
                            "Alimentación",
                            "Infraestructura",
                            "Capacitación",
                            "Material",
                        ].map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Valor de donación ($)
                        </label>
                        <input
                            type="number"
                            value={form.price}
                            onChange={(e) => set("price")(e.target.value)}
                            placeholder="0"
                            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Cantidad disponible
                        </label>
                        <input
                            type="number"
                            value={form.available}
                            onChange={(e) => set("available")(e.target.value)}
                            placeholder="0"
                            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                        Impacto estimado
                    </label>
                    <input
                        value={form.impact}
                        onChange={(e) => set("impact")(e.target.value)}
                        placeholder="Ej: Un niño podrá estudiar todo el año"
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                        Etiqueta
                    </label>
                    <select
                        value={form.tag}
                        onChange={(e) => set("tag")(e.target.value)}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Sin etiqueta</option>
                        {["Popular", "Urgente", "Recomendado"].map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                    <Toggle
                        checked={form.active}
                        onChange={(val) => set("active")(val)}
                    />
                    <span className="text-sm text-gray-700">
                        Ítem activo y visible para donantes
                    </span>
                </label>
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="border border-gray-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onSave(form)}
                        className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// ─── Manage Campaigns ──────────────────────────────────────────────────────────
export function ManageCampaignsPage() {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [editCampaign, setEditCampaign] = useState(null); // campaign being edited
    const [campaignToDelete, setCampaignToDelete] = useState(null); // campaign pending delete confirm
    const [newCampaign, setNewCampaign] = useState({
        title: "",
        category: "",
        goal: "",
        deadline: "",
        description: "",
    });
    const set = (key) => (val) => setNewCampaign((f) => ({ ...f, [key]: val }));
    const setE = (key) => (val) =>
        setEditCampaign((c) => ({ ...c, [key]: val }));

    useEffect(() => {
        const loadCampaigns = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await getFoundationCampaigns(user.id);
                setCampaigns(data || []);
            } catch (err) {
                console.error("Error loading campaigns:", err);
            } finally {
                setLoading(false);
            }
        };

        loadCampaigns();
    }, [user?.id]);

    const saveCampaign = async () => {
        if (!user?.id) return;
        try {
            setSaving(true);
            const created = await createCampaign(user.id, {
                title: newCampaign.title,
                category: newCampaign.category,
                goal: Number(newCampaign.goal) || 0,
                deadline: newCampaign.deadline || null,
                description: newCampaign.description,
                status: "active",
                raised: 0,
                donor_count: 0,
            });
            setCampaigns((prev) => [created, ...prev]);
            setShowCreate(false);
            setNewCampaign({
                title: "",
                category: "",
                goal: "",
                deadline: "",
                description: "",
            });
        } catch (err) {
            console.error("Error creating campaign:", err);
            alert("No se pudo crear la campaña");
        } finally {
            setSaving(false);
        }
    };

    const saveEdit = async () => {
        if (!editCampaign?.id) return;
        try {
            setSaving(true);
            const updated = await updateCampaign(editCampaign.id, {
                title: editCampaign.title,
                category: editCampaign.category,
                goal: Number(editCampaign.goal) || 0,
                description: editCampaign.description,
            });
            setCampaigns((prev) =>
                prev.map((c) =>
                    c.id === updated.id ? { ...c, ...updated } : c,
                ),
            );
            setEditCampaign(null);
        } catch (err) {
            console.error("Error updating campaign:", err);
            alert("No se pudo actualizar la campaña");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!campaignToDelete?.id) return;
        try {
            setSaving(true);
            await deleteCampaignById(campaignToDelete.id);
            setCampaigns((prev) =>
                prev.filter((c) => c.id !== campaignToDelete.id),
            );
            setCampaignToDelete(null);
        } catch (err) {
            console.error("Error deleting campaign:", err);
            alert("No se pudo eliminar la campaña");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Mis campañas
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Gestiona y crea campañas de recaudación
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-700"
                >
                    <PlusIcon className="w-4 h-4" /> Nueva campaña
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? (
                    <p className="text-gray-500">Cargando campañas...</p>
                ) : (
                    campaigns.map((c) => {
                        const goal = c.goal || 0;
                        const raised = c.raised || 0;
                        const pct =
                            goal > 0 ? Math.round((raised / goal) * 100) : 0;
                        return (
                            <div
                                key={c.id}
                                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
                            >
                                <img
                                    src={
                                        c.cover_image ||
                                        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80"
                                    }
                                    alt={c.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge
                                            label={c.category || "General"}
                                        />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-3 leading-snug">
                                        {c.title}
                                    </h3>
                                    <ProgressBar
                                        percent={pct}
                                        className="mb-2"
                                    />
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-semibold text-blue-600">
                                            ${raised.toLocaleString("es")}
                                        </span>
                                        <span className="text-gray-400">
                                            {pct}% de $
                                            {goal.toLocaleString("es")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 mb-4">
                                        <span>
                                            {c.donor_count || 0} donantes
                                        </span>
                                        <span>
                                            Límite: {c.deadline || "Sin fecha"}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                setEditCampaign({
                                                    ...c,
                                                    goal: String(c.goal || 0),
                                                })
                                            }
                                            className="flex-1 border border-gray-200 text-sm font-medium py-2 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-1"
                                        >
                                            <EditIcon /> Editar
                                        </button>
                                        <button
                                            onClick={() =>
                                                setCampaignToDelete(c)
                                            }
                                            className="flex-1 border border-red-100 text-red-500 text-sm font-medium py-2 rounded-xl hover:bg-red-50 flex items-center justify-center gap-1"
                                        >
                                            <TrashIcon /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Add new card */}
                <button
                    onClick={() => setShowCreate(true)}
                    className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-400 hover:text-blue-600 min-h-64"
                >
                    <PlusIcon className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">
                        Crear nueva campaña
                    </span>
                </button>
            </div>

            {/* Delete confirm modal */}
            {campaignToDelete && (
                <Modal
                    title="Eliminar campaña"
                    onClose={() => setCampaignToDelete(null)}
                >
                    <p className="text-sm text-gray-600 mb-2">
                        ¿Estás seguro de que deseas eliminar esta campaña?
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mb-6">
                        "{campaignToDelete.title}"
                    </p>
                    <p className="text-xs text-gray-400 mb-6">
                        Esta acción no se puede deshacer. Los datos de
                        recaudación se perderán.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setCampaignToDelete(null)}
                            className="border border-gray-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={confirmDelete}
                            disabled={saving}
                            className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700"
                        >
                            Eliminar campaña
                        </button>
                    </div>
                </Modal>
            )}

            {/* Edit campaign modal */}
            {editCampaign && (
                <Modal
                    title="Editar campaña"
                    onClose={() => setEditCampaign(null)}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                Título de la campaña *
                            </label>
                            <input
                                value={editCampaign.title}
                                onChange={(e) => setE("title")(e.target.value)}
                                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    Categoría
                                </label>
                                <select
                                    value={editCampaign.category}
                                    onChange={(e) =>
                                        setE("category")(e.target.value)
                                    }
                                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {[
                                        "Educación",
                                        "Salud",
                                        "Animales",
                                        "Medio Ambiente",
                                        "Alimentación",
                                    ].map((c) => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    Meta ($)
                                </label>
                                <input
                                    type="number"
                                    value={editCampaign.goal}
                                    onChange={(e) =>
                                        setE("goal")(e.target.value)
                                    }
                                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                Descripción
                            </label>
                            <textarea
                                value={editCampaign.description}
                                onChange={(e) =>
                                    setE("description")(e.target.value)
                                }
                                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setEditCampaign(null)}
                                className="border border-gray-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveEdit}
                                disabled={saving}
                                className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Create modal */}
            {showCreate && (
                <Modal
                    title="Crear nueva campaña"
                    onClose={() => setShowCreate(false)}
                >
                    <p className="text-sm text-gray-500 mb-5">
                        Define los detalles de tu campaña de recaudación
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                Título de la campaña *
                            </label>
                            <input
                                value={newCampaign.title}
                                onChange={(e) => set("title")(e.target.value)}
                                placeholder="Ej: Educación para niños rurales"
                                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    Categoría *
                                </label>
                                <select
                                    value={newCampaign.category}
                                    onChange={(e) =>
                                        set("category")(e.target.value)
                                    }
                                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Selecciona...</option>
                                    {[
                                        "Educación",
                                        "Salud",
                                        "Animales",
                                        "Medio Ambiente",
                                        "Alimentación",
                                    ].map((c) => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    Meta ($) *
                                </label>
                                <input
                                    type="number"
                                    value={newCampaign.goal}
                                    onChange={(e) =>
                                        set("goal")(e.target.value)
                                    }
                                    placeholder="100000"
                                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                Fecha límite
                            </label>
                            <input
                                type="date"
                                value={newCampaign.deadline}
                                onChange={(e) =>
                                    set("deadline")(e.target.value)
                                }
                                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                Descripción *
                            </label>
                            <textarea
                                value={newCampaign.description}
                                onChange={(e) =>
                                    set("description")(e.target.value)
                                }
                                placeholder="Describe el objetivo de tu campaña..."
                                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setShowCreate(false)}
                                className="border border-gray-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveCampaign}
                                disabled={saving}
                                className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700"
                            >
                                Crear campaña
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// ─── Foundation Profile ────────────────────────────────────────────────────────
export function FoundationProfilePage() {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || "Fundación Educativa",
        description:
            "Fundación Educativa trabaja desde 2010 para garantizar el acceso a educación de calidad en comunidades vulnerables.",
        mission:
            "Promover el derecho a la educación de niños y jóvenes en situación de vulnerabilidad.",
        vision: "Un país donde todos los niños tengan acceso a educación de calidad.",
        category: "Educación",
        coverage: "Nacional",
        contact: "contacto@fundacioneducativa.org",
        website: "www.fundacioneducativa.org",
    });
    const [draft, setDraft] = useState(form);

    const startEdit = () => {
        setDraft(form);
        setEditing(true);
    };
    const cancelEdit = () => {
        setDraft(form);
        setEditing(false);
    };
    const saveEdit = () => {
        setForm(draft);
        setEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
                Perfil de Fundación
            </div>

            {/* Header */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl font-bold text-white">FE</span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {form.name}
                        </h1>
                        <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge label={form.category} />
                        <span className="text-sm text-gray-500">
                            • {user?.location || "Buenos Aires, Argentina"}
                        </span>
                    </div>
                    <button
                        onClick={startEdit}
                        className="mt-3 text-sm border border-gray-300 px-4 py-1.5 rounded-lg hover:bg-white font-medium"
                    >
                        {editing ? "Cancelar edición" : "Editar perfil"}
                    </button>
                </div>
            </div>

            {editing ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 mb-6">
                    <h2 className="font-bold text-gray-900 mb-2">
                        Editar información
                    </h2>
                    {[
                        { key: "name", label: "Nombre", type: "input" },
                        {
                            key: "description",
                            label: "Descripción",
                            type: "textarea",
                        },
                        { key: "mission", label: "Misión", type: "textarea" },
                        { key: "vision", label: "Visión", type: "textarea" },
                        {
                            key: "contact",
                            label: "Email de contacto",
                            type: "input",
                        },
                        { key: "website", label: "Sitio web", type: "input" },
                    ].map((f) => (
                        <div key={f.key}>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                {f.label}
                            </label>
                            {f.type === "textarea" ? (
                                <textarea
                                    value={draft[f.key]}
                                    onChange={(e) =>
                                        setDraft((prev) => ({
                                            ...prev,
                                            [f.key]: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                                />
                            ) : (
                                <input
                                    value={draft[f.key]}
                                    onChange={(e) =>
                                        setDraft((prev) => ({
                                            ...prev,
                                            [f.key]: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={cancelEdit}
                            className="border border-gray-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={saveEdit}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* About */}
                    <section className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Sobre nosotros
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {form.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    Misión
                                </p>
                                <p className="text-sm text-gray-500">
                                    {form.mission}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    Visión
                                </p>
                                <p className="text-sm text-gray-500">
                                    {form.vision}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Información de contacto
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { label: "Cobertura", value: form.coverage },
                                { label: "Contacto", value: form.contact },
                                { label: "Sitio web", value: form.website },
                                { label: "Categoría", value: form.category },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="border border-gray-100 rounded-xl p-4 bg-white"
                                >
                                    <p className="text-xs text-gray-400 mb-1">
                                        {item.label}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Stats */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Impacto y transparencia
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { label: "Beneficiarios", value: "2.450" },
                                { label: "Campañas ejecutadas", value: "87" },
                                {
                                    label: "Recursos entregados",
                                    value: "$8.5M",
                                },
                                { label: "Transparencia", value: "Alta" },
                            ].map((s) => (
                                <div
                                    key={s.label}
                                    className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm text-center"
                                >
                                    <p className="text-xs text-gray-400 mb-1">
                                        {s.label}
                                    </p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {s.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
// =========================================================================================================
// TODO: Revisar todo el flujo de edición de perfil y creación/edición de campañas, y conectar con el backend para guardar cambios reales una vez esté listo. También revisar que los datos mostrados (como el impacto y estadísticas) se correspondan con datos reales del usuario autenticado.
