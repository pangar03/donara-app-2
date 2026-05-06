import { useState } from "react";
import { CAMPAIGNS } from "../lib/data";
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

// Sección 1: Páginas relacionadas a los donantes =====================================================================================
// ─── Donor Home ────────────────────────────────────────────────────────────────
export function DonorHome({ setPage, setSelectedCampaign }) {
    const featured = CAMPAIGNS.slice(0, 3);
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
                    { label: "Campañas activas", value: "42" },
                    { label: "Fundaciones verificadas", value: "18" },
                    { label: "Donantes activos", value: "3.2K" },
                    { label: "Vidas impactadas", value: "75K+" },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm"
                    >
                        <p className="text-2xl font-bold text-blue-600">
                            {s.value}
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
    const cats = [
        "Todas",
        "Educación",
        "Salud",
        "Animales",
        "Medio Ambiente",
        "Alimentación",
    ];

    const filtered = CAMPAIGNS.filter((c) => {
        const matchCat = selectedCat === "Todas" || c.category === selectedCat;
        const matchSearch =
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.foundation_name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

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
    const pct = Math.round((campaign.raised / campaign.goal) * 100);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <button
                onClick={() => setPage("campaigns")}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-5"
            >
                <ArrowLeft /> Volver a campañas
            </button>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left */}
                <div className="flex-1 min-w-0">
                    <div className="relative">
                        <img
                            src={campaign.image}
                            alt={campaign.title}
                            className="w-full h-64 sm:h-80 object-cover rounded-2xl"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                            {campaign.tags.map((t) => (
                                <Badge key={t} label={t} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-blue-600 font-medium">
                                {campaign.foundation_name}
                            </span>
                            <span className="text-gray-300">•</span>
                            <Badge label={campaign.category} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            {campaign.title}
                        </h1>
                        <ProgressBar percent={pct} className="mb-3" />
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-2xl font-bold text-blue-600">
                                    ${campaign.raised.toLocaleString("es")}
                                </p>
                                <p className="text-sm text-gray-400">
                                    Meta: ${campaign.goal.toLocaleString("es")}
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
                                        {campaign.donors}
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
                                        {campaign.deadline}
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
                            {campaign.description}
                        </p>

                        {campaign.updates.length > 0 && (
                            <>
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                    Actualizaciones
                                </h2>
                                <div className="space-y-2">
                                    {campaign.updates.map((u, i) => (
                                        <div
                                            key={i}
                                            className="border border-gray-100 rounded-xl p-3"
                                        >
                                            <p className="text-xs text-gray-400 mb-1">
                                                {u.date}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                {u.text}
                                            </p>
                                        </div>
                                    ))}
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
                        {campaign.items.map((item) => (
                            <DonationItemCard
                                key={item.id}
                                item={item}
                                onClick={() => {
                                    setSelectedItem({ item, campaign });
                                    setPage("confirm-donation");
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
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
    const total = item.price * qty;

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
                onClick={onSuccess}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-base hover:bg-blue-700 transition-colors"
            >
                Confirmar donación de ${total.toLocaleString("es")}
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
