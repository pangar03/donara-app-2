import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
    ProgressBar,
    Badge,
    SearchIcon,
    FilterIcon,
    ArrowLeft,
    UsersIcon,
    CalendarIcon,
    CheckCircleIcon,
} from "../components/ui";
import {
    getActiveCampaigns,
    getCampaignById,
    makeDonation,
    getPlatformStats,
} from "../lib/databaseUtils";

// Sección 1: Páginas relacionadas a los donantes =====================================================================================
// ─── Donor Home ────────────────────────────────────────────────────────────────
export function DonorHome({ setPage, setSelectedCampaign }) {
    const [campaigns, setCampaigns] = useState([]);
    const [stats, setStats] = useState({
        activeCampaigns: 0,
        verifiedFoundations: 0,
        totalDonors: 0,
        totalDonations: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [campaignsData, statsData] = await Promise.all([
                    getActiveCampaigns(),
                    getPlatformStats(),
                ]);
                setCampaigns((campaignsData || []).slice(0, 3));
                setStats(statsData);
            } catch (err) {
                console.error("Error loading data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const featured = campaigns;
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 sm:p-12 text-white mb-10 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-full opacity-10">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        <circle cx="160" cy="40" r="80" fill="white" />
                        <circle cx="40" cy="160" r="60" fill="white" />
                    </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 max-w-xl">
                    Haz la diferencia hoy
                </h1>
                <p className="text-blue-100 mb-6 max-w-lg text-lg">
                    Apoya causas que transforman vidas. Cada donación cuenta.
                </p>
                <button
                    onClick={() => setPage("campaigns")}
                    className="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                    Explorar campañas
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {[
                    { label: "Campañas activas", value: stats.activeCampaigns },
                    { label: "Fundaciones", value: stats.verifiedFoundations },
                    { label: "Donantes activos", value: stats.totalDonors },
                    { label: "Vidas impactadas", value: stats.totalDonations },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm"
                    >
                        <p className="text-2xl font-bold text-blue-600">
                            {loading ? "-" : s.value}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Featured campaigns */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                    Campañas destacadas
                </h2>
                <button
                    onClick={() => setPage("campaigns")}
                    className="text-sm text-blue-600 font-medium hover:underline"
                >
                    Ver todas
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featured.map((c) => (
                    <CampaignCard
                        key={c.id}
                        campaign={c}
                        onClick={() => {
                            setSelectedCampaign(c);
                            setPage("campaign-detail");
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

// ─── Campaign Card ─────────────────────────────────────────────────────────────
export function CampaignCard({ campaign, onClick }) {
    const pct = Math.round((campaign.raised / campaign.goal) * 100); // Porcentaje recaudado para mostrar en la barra de progreso
    return (
        <div
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-44 object-cover"
            />
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">
                        {campaign.foundation_name}
                    </span>
                    <span className="text-gray-300">•</span>
                    <Badge label={campaign.category} />
                </div>
                <h3 className="font-semibold text-gray-900 leading-snug mb-3 line-clamp-2">
                    {campaign.title}
                </h3>
                <ProgressBar percent={pct} className="mb-2" />
                <div className="flex justify-between text-sm mt-1">
                    <span className="font-semibold text-gray-900">
                        ${campaign.raised.toLocaleString("es")}
                    </span>
                    <span className="text-gray-400">{pct}% completado</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                    Meta: ${campaign.goal.toLocaleString("es")}
                </p>
                <button className="w-full mt-4 bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors">
                    Ver campaña
                </button>
            </div>
        </div>
    );
}

// ─── Campaigns List ────────────────────────────────────────────────────────────
export function CampaignsPage({ setPage, setSelectedCampaign }) {
    const [search, setSearch] = useState("");
    const [selectedCat, setSelectedCat] = useState("Todas");
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const cats = [
        "Todas",
        "Educación",
        "Salud",
        "Animales",
        "Medio Ambiente",
        "Alimentación",
    ];

    useEffect(() => {
        const loadCampaigns = async () => {
            try {
                setLoading(true);
                const category = selectedCat === "Todas" ? null : selectedCat;
                const data = await getActiveCampaigns(search, category);
                setCampaigns(data || []);
            } catch (err) {
                console.error("Error loading campaigns:", err);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            loadCampaigns();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [search, selectedCat]);

    const filtered = campaigns;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Explorar Campañas
            </h1>
            <p className="text-gray-500 mb-6 text-sm">
                Encuentra causas que te inspiren y haz la diferencia
            </p>

            {/* Search + filters */}
            <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar campañas, fundaciones o categorías..."
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <FilterIcon className="w-4 h-4" /> Filtros
                </button>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
                {cats.map((c) => (
                    <button
                        key={c}
                        onClick={() => setSelectedCat(c)}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCat === c ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {loading && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Cargando campañas...</p>
                </div>
            )}
            {!loading && filtered.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No se encontraron campañas</p>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((c) => (
                    <CampaignCard
                        key={c.id}
                        campaign={c}
                        onClick={() => {
                            setSelectedCampaign(c);
                            setPage("campaign-detail");
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

// ─── Campaign Detail ───────────────────────────────────────────────────────────
export function CampaignDetailPage({ campaign, setPage, setSelectedItem }) {
    const [campaignData, setCampaignData] = useState(campaign);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCampaign = async () => {
            try {
                setLoading(true);
                const data = await getCampaignById(campaign.id);
                setCampaignData(data);
            } catch (err) {
                console.error("Error loading campaign:", err);
                setCampaignData(campaign);
            } finally {
                setLoading(false);
            }
        };
        loadCampaign();
    }, [campaign.id, campaign]);

    const displayCampaign = campaignData;
    const pct = Math.round(
        (displayCampaign.raised / displayCampaign.goal) * 100,
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <button
                onClick={() => setPage("campaigns")}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-5"
            >
                <ArrowLeft /> Volver a campañas
            </button>

            {loading && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Cargando campaña...</p>
                </div>
            )}
            {!loading && (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left */}
                    <div className="flex-1 min-w-0">
                        <div className="relative">
                            <img
                                src={
                                    displayCampaign.image ||
                                    displayCampaign.cover_image
                                }
                                alt={displayCampaign.title}
                                className="w-full h-64 sm:h-80 object-cover rounded-2xl"
                            />
                            <div className="absolute top-3 left-3 flex gap-2">
                                {(displayCampaign.tags || []).map((t) => (
                                    <Badge key={t} label={t} />
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-blue-600 font-medium">
                                    {displayCampaign.foundation_name ||
                                        displayCampaign.foundations?.legal_name}
                                </span>
                                <span className="text-gray-300">•</span>
                                <Badge label={displayCampaign.category} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                {displayCampaign.title}
                            </h1>
                            <ProgressBar percent={pct} className="mb-3" />
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">
                                        $
                                        {(
                                            displayCampaign.raised || 0
                                        ).toLocaleString("es")}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Meta: $
                                        {(
                                            displayCampaign.goal || 0
                                        ).toLocaleString("es")}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {pct}%
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Completado
                                    </p>
                                </div>
                            </div>

                            {/* Donors + Deadline */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                                    <UsersIcon className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-lg font-bold text-gray-900">
                                            {displayCampaign.donor_count || 0}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Donantes
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            {displayCampaign.deadline ||
                                                "Abierta"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Fecha límite
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                Descripción
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                {displayCampaign.description}
                            </p>

                            {(displayCampaign.campaign_updates || []).length >
                                0 && (
                                <>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                        Actualizaciones
                                    </h2>
                                    <div className="space-y-2">
                                        {displayCampaign.campaign_updates.map(
                                            (u, i) => (
                                                <div
                                                    key={i}
                                                    className="border border-gray-100 rounded-xl p-3"
                                                >
                                                    <p className="text-xs text-gray-400 mb-1">
                                                        {new Date(
                                                            u.created_at,
                                                        ).toLocaleDateString(
                                                            "es",
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-gray-700">
                                                        {u.update_text}
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right – Donation items */}
                    <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Formas de donar
                        </h2>
                        <div className="space-y-4">
                            {(displayCampaign.donation_items || []).map(
                                (item) => (
                                    <DonationItemCard
                                        key={item.id}
                                        item={item}
                                        onClick={() => {
                                            setSelectedItem({
                                                item,
                                                campaign: displayCampaign,
                                            });
                                            setPage("confirm-donation");
                                        }}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Donation Item Card ────────────────────────────────────────────────────────
function DonationItemCard({ item, onClick }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-36 object-cover"
                />
                {item.tag && (
                    <span className="absolute top-2 right-2">
                        <Badge label={item.tag} />
                    </span>
                )}
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <Badge label={item.category} />
                </div>
                <p className="text-xs text-gray-500 mb-2">
                    {item.description || ""}
                </p>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                    ${item.price.toLocaleString("es")}
                </p>
                <p className="text-xs text-gray-500 mb-1">{item.impact}</p>
                {item.available <= 5 && item.available > 0 && (
                    <p className="text-xs text-red-500 mb-3">
                        Disponibles: {item.available}
                    </p>
                )}
                <button
                    onClick={onClick}
                    className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors mt-2"
                >
                    Donar
                </button>
            </div>
        </div>
    );
}

// ─── Confirm Donation ──────────────────────────────────────────────────────────
export function ConfirmDonationPage({ data, setPage, onSuccess }) {
    const { item, campaign } = data;
    const [qty, setQty] = useState(1);
    const [anon, setAnon] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const total = item.price * qty;

    const handleConfirmDonation = async () => {
        try {
            setLoading(true);
            const donationData = {
                donor_id: user?.id,
                campaign_id: campaign.id,
                item_id: item.id,
                foundation_id: campaign.foundation_id,
                quantity: qty,
                amount: total,
                anonymous: anon,
                status: "pending",
            };
            await makeDonation(donationData);
            onSuccess && onSuccess();
        } catch (err) {
            console.error("Error making donation:", err);
            alert("Error al procesar la donación. Por favor intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            <button
                onClick={() => setPage("campaign-detail")}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft /> Volver
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Confirmar donación
            </h1>
            <p className="text-gray-500 text-sm mb-6">
                Revisa los detalles antes de continuar
            </p>

            {/* Summary */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-4">
                <h2 className="font-semibold text-gray-900 mb-4">
                    Resumen de donación
                </h2>
                <div className="space-y-3 divide-y divide-gray-100">
                    {[
                        { label: "Campaña", value: campaign.title },
                        { label: "Fundación", value: campaign.foundation_name },
                    ].map((r) => (
                        <div key={r.label} className="pt-3 first:pt-0">
                            <p className="text-xs text-gray-400 mb-0.5">
                                {r.label}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {r.value}
                            </p>
                        </div>
                    ))}
                    <div className="pt-3">
                        <p className="text-xs text-gray-400 mb-0.5">
                            Ítem seleccionado
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                            {item.name}
                        </p>
                    </div>
                    <div className="pt-3">
                        <p className="text-xs text-gray-400 mb-0.5">Impacto</p>
                        <p className="text-sm font-medium text-blue-600">
                            {item.impact}
                        </p>
                    </div>
                    <div className="pt-3">
                        <p className="text-xs text-gray-400 mb-2">Cantidad</p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() =>
                                    setQty((q) => Math.max(1, q - 1))
                                }
                                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50"
                            >
                                −
                            </button>
                            <span className="text-sm font-semibold w-6 text-center">
                                {qty}
                            </span>
                            <button
                                onClick={() => setQty((q) => q + 1)}
                                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-4 bg-blue-50 rounded-xl p-4 flex justify-between items-center">
                    <p className="font-semibold text-gray-800">Total a donar</p>
                    <p className="text-2xl font-bold text-blue-600">
                        ${total.toLocaleString("es")}
                    </p>
                </div>
            </div>

            {/* Payment method */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-4">
                <h2 className="font-semibold text-gray-900 mb-4">
                    Método de pago
                </h2>
                <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-400 rounded-md flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                VISA
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Visa •••• 4242
                            </p>
                            <p className="text-xs text-gray-500">Vence 12/28</p>
                        </div>
                    </div>
                    <button className="text-sm text-blue-600 font-medium hover:underline">
                        Cambiar
                    </button>
                </div>
            </div>

            {/* Anon */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={anon}
                        onChange={(e) => setAnon(e.target.checked)}
                        className="rounded text-blue-600 w-5 h-5"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        Donar anónimamente
                    </span>
                </label>
            </div>

            <button
                onClick={handleConfirmDonation}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-base hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading
                    ? "Procesando..."
                    : `Confirmar donación de $${total.toLocaleString("es")}`}
            </button>
        </div>
    );
}

// ─── Donation Success ──────────────────────────────────────────────────────────
export function DonationSuccessPage({ amount, impact, setPage }) {
    return (
        <div className="max-w-md mx-auto px-4 sm:px-6 py-20 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Donación exitosa!
            </h1>
            <p className="text-gray-500 mb-2">
                Tu donación de{" "}
                <span className="font-bold text-blue-600">
                    ${amount?.toLocaleString("es")}
                </span>{" "}
                ha sido procesada correctamente
            </p>
            <div className="bg-blue-50 rounded-2xl p-4 mb-8">
                <p className="text-sm text-gray-600">Impacto logrado</p>
                <p className="font-semibold text-blue-700 mt-1">{impact}</p>
            </div>
            <button
                onClick={() => setPage("campaigns")}
                className="w-full border-2 border-blue-600 text-blue-600 font-bold py-3 rounded-2xl hover:bg-blue-50 transition-colors"
            >
                Ver otras campañas
            </button>
        </div>
    );
}

// ========================================================================================================
// TODO: Chequear el flujo de donación completo y conectar con el backend para manejar donaciones reales una vez esté listo.
