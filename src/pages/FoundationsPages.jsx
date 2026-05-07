import { useState, useEffect } from "react";
import { CAMPAIGNS } from "../lib/data";
import {
    Badge,
    ProgressBar,
    SearchIcon,
    FilterIcon,
    CheckCircleIcon,
} from "../components/ui";
import {
    getVerifiedFoundations,
    getFoundationById,
    getActiveCampaigns,
} from "../lib/databaseUtils";

// Seccion 1: Listado de fundaciones
// Esta sección muestra un listado de fundaciones con un buscador y filtros. Al hacer click en una fundación, se muestra su perfil público.
// Se utiliza el estado local para manejar el término de búsqueda y filtrar las fundaciones mostradas. También se manejan los estados de la fundación seleccionada y la campaña seleccionada para navegar entre vistas.
// =====================================================================================================================================
// ─── Foundations List ──────────────────────────────────────────────────────────
export function FoundationsPage({
    setPage,
    setSelectedFoundation,
    setSelectedCampaign,
}) {
    const [search, setSearch] = useState("");
    const [foundations, setFoundations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadFoundations = async () => {
            try {
                setLoading(true);
                const data = await getVerifiedFoundations(search);
                setFoundations(data || []);
            } catch (err) {
                console.error("Error loading foundations:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            loadFoundations();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [search]);

    const filtered = foundations;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Fundaciones
            </h1>
            <p className="text-gray-500 text-sm mb-6">
                Descubre organizaciones confiables que impulsan el cambio
            </p>

            <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                    <FilterIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar fundaciones"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <FilterIcon className="w-4 h-4" /> Filtros
                </button>
            </div>

            {loading && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Cargando fundaciones...</p>
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-700 text-sm">Error cargando fundaciones: {error}</p>
                </div>
            )}
            {!loading && filtered.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No se encontraron fundaciones</p>
                </div>
            )}
            <div className="space-y-4">
                {filtered.map((f) => (
                    <FoundationListCard
                        key={f.id}
                        foundation={f}
                        onClick={() => {
                            setSelectedFoundation(f);
                            setPage("foundation-public");
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function TransparencyBar({ level }) {
    const bars = level === "Alta" ? 4 : level === "Media" ? 3 : 2;
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className={`w-4 h-3 rounded-sm ${i <= bars ? "bg-blue-600" : "bg-blue-100"}`}
                />
            ))}
        </div>
    );
}

function FoundationListCard({ foundation: f, onClick }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: f.color || "#1d4ed8" }}
                >
                    {f.initials || f.legal_name?.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                                {f.legal_name || f.name}
                                {f.verified && (
                                    <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                                )}
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                                {f.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                                <Badge label={f.category} />
                                <span className="text-xs text-gray-400">
                                    • {f.coverage || "Local"}
                                </span>
                            </div>
                        </div>
                        {f.verified && (
                            <span className="flex items-center gap-1 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full flex-shrink-0">
                                <CheckCircleIcon className="w-3 h-3" />{" "}
                                Verificada
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                            <p className="text-xs text-gray-400">
                                Campañas ejecutadas
                            </p>
                            <p className="font-bold text-gray-900">
                                {f.campaigns_executed || 0}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">
                                Beneficiarios
                            </p>
                            <p className="font-bold text-gray-900">
                                {(f.total_beneficiaries || 0).toLocaleString("es")}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">
                                Transparencia
                            </p>
                            <TransparencyBar level={f.transparency || "Media"} />
                        </div>
                    </div>
                    <button
                        onClick={onClick}
                        className="w-full mt-4 bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors"
                    >
                        Ver perfil
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Foundation Public Profile ─────────────────────────────────────────────────
export function FoundationPublicProfile({
    foundation: f,
    setPage,
    setSelectedCampaign,
}) {
    const [foundation, setFoundation] = useState(f);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFoundationData = async () => {
            try {
                setLoading(true);
                // Load full foundation data and campaigns
                const [foundationData, campaignsData] = await Promise.all([
                    getFoundationById(f.id),
                    getActiveCampaigns("", null).then(data =>
                        (data || []).filter(c => c.foundation_id === f.id)
                    ),
                ]);
                setFoundation(foundationData);
                setCampaigns(campaignsData);
            } catch (err) {
                console.error("Error loading foundation:", err);
            } finally {
                setLoading(false);
            }
        };
        loadFoundationData();
    }, [f.id]);

    const displayFoundation = foundation || f;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
                Perfil de Fundación
            </div>

            {loading && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Cargando información de la fundación...</p>
                </div>
            )}
            {!loading && (
            <>
            {/* Header */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 flex items-center gap-5">
                <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 text-white"
                    style={{ backgroundColor: displayFoundation.color || "#1d4ed8" }}
                >
                    <span className="text-3xl font-bold">{(displayFoundation.initials || displayFoundation.legal_name || "")[0]}</span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {displayFoundation.legal_name || displayFoundation.name}
                        </h1>
                        {displayFoundation.verified && (
                            <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge label={displayFoundation.category} />
                        <span className="text-sm text-gray-500">
                            • {displayFoundation.city ? `${displayFoundation.city}, ${displayFoundation.country}` : "Local"}
                        </span>
                    </div>
                    <div className="flex gap-3 mt-3">
                        <button className="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-blue-700">
                            Donar
                        </button>
                        <button className="border border-gray-300 text-sm font-medium px-5 py-2 rounded-xl hover:bg-gray-50">
                            Reportar
                        </button>
                    </div>
                </div>
            </div>

            {/* About */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Sobre nosotros
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {displayFoundation.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { label: "Misión", value: displayFoundation.description || "" },
                        { label: "Visión", value: displayFoundation.description || "" },
                    ].map((item) => (
                        <div key={item.label}>
                            <p className="text-sm font-semibold text-gray-900">
                                {item.label}
                            </p>
                            <p className="text-sm text-gray-500">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Información de contacto
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { label: "Cobertura", value: displayFoundation.coverage || "Local" },
                        { label: "Contacto", value: displayFoundation.institutional_email || displayFoundation.contact || "" },
                        { label: "Sitio web", value: displayFoundation.website || "", link: true },
                        { label: "Redes sociales", value: null, social: true },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="border border-gray-100 rounded-xl p-4 bg-white"
                        >
                            <p className="text-xs text-gray-400 mb-1">
                                {item.label}
                            </p>
                            {item.social ? (
                                <div className="flex gap-3">
                                    {["f", "𝕏", "in"].map((s) => (
                                        <button
                                            key={s}
                                            className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-200"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            ) : item.link ? (
                                <a
                                    href="#"
                                    className="text-sm text-blue-600 font-medium"
                                >
                                    {item.value}
                                </a>
                            ) : (
                                <p className="text-sm font-medium text-gray-900">
                                    {item.value}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Impact */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Impacto y transparencia
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        {
                            label: "Beneficiarios",
                            value: (displayFoundation.total_beneficiaries || 0).toLocaleString("es"),
                        },
                        {
                            label: "Campañas ejecutadas",
                            value: displayFoundation.campaigns_executed || 0,
                        },
                        { label: "Recursos entregados", value: displayFoundation.resources || "N/A" },
                        {
                            label: "Transparencia",
                            value: displayFoundation.transparency || "Media",
                            special: true,
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm text-center"
                        >
                            <p className="text-xs text-gray-400 mb-1">
                                {s.label}
                            </p>
                            {s.special ? (
                                <div className="flex items-center justify-center gap-1">
                                    <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                                    <span className="font-bold text-gray-900">
                                        {s.value}
                                    </span>
                                </div>
                            ) : (
                                <p className="text-xl font-bold text-gray-900">
                                    {s.value}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Active campaigns */}
            {campaigns.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Campañas activas
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {campaigns.map((c) => {
                            const pct = Math.round((c.raised / c.goal) * 100);
                            return (
                                <div
                                    key={c.id}
                                    className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => {
                                        setSelectedCampaign(c);
                                        setPage("campaign-detail");
                                    }}
                                >
                                    <div
                                        className="h-32 bg-gray-200"
                                        style={{
                                            background: `url(${c.image}) center/cover`,
                                        }}
                                    />
                                    <div className="p-4">
                                        <p className="font-semibold text-gray-900 text-sm leading-snug mb-2">
                                            {c.title}
                                        </p>
                                        <ProgressBar
                                            percent={pct}
                                            className="mb-2"
                                        />
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">
                                                {pct}% completado
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                ${c.raised.toLocaleString("es")}{" "}
                                                de $
                                                {c.goal.toLocaleString("es")}
                                            </span>
                                        </div>
                                        <button className="w-full mt-3 bg-blue-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-blue-700">
                                            Ver campaña
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Donation items — pulled from this foundation's campaigns */}
            {(() => {
                const allItems = campaigns
                    .flatMap((c) => c.items || [])
                    .slice(0, 3);
                if (allItems.length === 0) return null;
                return (
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Formas de donar
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {allItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm"
                                >
                                    <p className="font-semibold text-gray-900 mb-1">
                                        {item.name}
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600 mb-1">
                                        ${item.price.toLocaleString("es")}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-3">
                                        {item.impact}
                                    </p>
                                    <button className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-blue-700">
                                        Donar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            })()}            </>
            )}
            {/* Reports */}
            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Reportes y actualizaciones
                </h2>
                <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-100 shadow-sm">
                    {[
                        {
                            title: "Informe anual 2025",
                            meta: "15/01/2026 • PDF",
                        },
                        {
                            title: "Actualización campaña educación",
                            meta: "10/04/2026 • Artículo",
                        },
                        {
                            title: "Reporte de transparencia Q1 2026",
                            meta: "01/04/2026 • PDF",
                        },
                    ].map((r) => (
                        <div
                            key={r.title}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {r.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {r.meta}
                                </p>
                            </div>
                            <button className="text-sm text-blue-600 font-medium hover:underline">
                                Ver
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

// ========================================================================================================
// TODO: Revisar que toda la información mostrada en el perfil público de la fundación se corresponda con datos reales del backend una vez esté listo, y conectar los botones de donación para que lleven al flujo de donación real. También revisar que el diseño se vea bien con diferentes longitudes de texto y tamaños de imagen, y ajustar estilos si es necesario.
