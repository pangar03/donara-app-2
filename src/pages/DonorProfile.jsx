import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { DONOR_HISTORY, FOUNDATIONS } from "../lib/data";
import { Badge } from "../components/ui";

// Sección: Página de perfil del donante ==============================================================================================
// ─── Donor Profile ─────────────────────────────────────────────────────────────
export function DonorProfilePage({ setPage, setSelectedFoundation }) {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || "María González",
        location: user?.location || "Cali, Colombia",
        phone: "+57 311 123 4567",
        donationType: "Puntual",
        range: "$10.000 - $30.000",
        causes: ["Educación", "Salud", "Animales", "Medio Ambiente"],
        anon: false,
        notifications: true,
    });
    const [draft, setDraft] = useState(form);
    const setD = (key) => (val) => setDraft((d) => ({ ...d, [key]: val }));
    const toggleCause = (c) =>
        setDraft((d) => ({
            ...d,
            causes: d.causes.includes(c)
                ? d.causes.filter((x) => x !== c)
                : [...d.causes, c],
        }));

    const saveEdit = () => {
        setForm(draft);
        setEditing(false);
    };
    const cancelEdit = () => {
        setDraft(form);
        setEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
                Perfil del Donante
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {form.name}
                    </h1>
                    <p className="text-sm text-gray-500">{form.location}</p>
                    <button
                        onClick={() => {
                            setDraft(form);
                            setEditing(true);
                        }}
                        className="mt-2 text-sm border border-gray-300 px-4 py-1.5 rounded-lg hover:bg-gray-50 font-medium"
                    >
                        Editar perfil
                    </button>
                </div>
            </div>

            {/* Edit form */}
            {editing && (
                <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm mb-8">
                    <h2 className="font-bold text-gray-900 mb-5">
                        Editar perfil
                    </h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    Nombre completo
                                </label>
                                <input
                                    value={draft.name}
                                    onChange={(e) =>
                                        setD("name")(e.target.value)
                                    }
                                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    Ubicación
                                </label>
                                <input
                                    value={draft.location}
                                    onChange={(e) =>
                                        setD("location")(e.target.value)
                                    }
                                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    Teléfono
                                </label>
                                <input
                                    value={draft.phone}
                                    onChange={(e) =>
                                        setD("phone")(e.target.value)
                                    }
                                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    Tipo de donación
                                </label>
                                <select
                                    value={draft.donationType}
                                    onChange={(e) =>
                                        setD("donationType")(e.target.value)
                                    }
                                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {["Puntual", "Recurrente", "Ambos"].map(
                                        (o) => (
                                            <option key={o}>{o}</option>
                                        ),
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    Rango de aporte
                                </label>
                                <select
                                    value={draft.range}
                                    onChange={(e) =>
                                        setD("range")(e.target.value)
                                    }
                                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {[
                                        "$5.000 - $20.000",
                                        "$10.000 - $30.000",
                                        "$20.000 - $50.000",
                                        "Más de $50.000",
                                    ].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Causas de interés
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {[
                                    "Educación",
                                    "Salud",
                                    "Animales",
                                    "Medio Ambiente",
                                    "Alimentación",
                                    "Deportes",
                                ].map((c) => (
                                    <label
                                        key={c}
                                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={draft.causes.includes(c)}
                                            onChange={() => toggleCause(c)}
                                            className="rounded text-blue-600"
                                        />
                                        {c}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={draft.anon}
                                    onChange={(e) =>
                                        setD("anon")(e.target.checked)
                                    }
                                    className="rounded text-blue-600"
                                />
                                Preferir anonimato en donaciones
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={draft.notifications}
                                    onChange={(e) =>
                                        setD("notifications")(e.target.checked)
                                    }
                                    className="rounded text-blue-600"
                                />
                                Recibir notificaciones sobre campañas
                            </label>
                        </div>

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
                </div>
            )}

            {/* Stats */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total donado", value: "$245.000" },
                    { label: "Campañas apoyadas", value: "18" },
                    { label: "Última donación", value: "15/04/2026" },
                    { label: "Impacto", value: "120 personas" },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm"
                    >
                        <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                        <p className="text-xl font-bold text-gray-900">
                            {s.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Impact */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Tu impacto
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    Tus donaciones ayudaron a:
                </p>
                <div className="space-y-2">
                    {[
                        "45 niños recibieron educación",
                        "28 familias accedieron a agua potable",
                        "12 animales fueron rescatados",
                    ].map((item) => (
                        <div
                            key={item}
                            className="flex items-center gap-2 text-sm text-gray-700"
                        >
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* History table */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                Historial de actividad
            </h2>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                {[
                                    "Campaña",
                                    "Ítem donado",
                                    "Fecha",
                                    "Monto",
                                    "Estado",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left px-4 py-3 font-medium"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {DONOR_HISTORY.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {row.campaign}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {row.item}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {row.date}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-gray-900">
                                        ${row.amount.toLocaleString("es")}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === "Entregado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Preferences */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                Preferencias
            </h2>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8 space-y-4">
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                        Causas de interés
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {form.causes.map((c) => (
                            <Badge key={c} label={c} />
                        ))}
                    </div>
                </div>
                {[
                    { label: "Tipo de donación", value: form.donationType },
                    { label: "Rango de aporte", value: form.range },
                    {
                        label: "Preferencia de anonimato",
                        value: form.anon
                            ? "Donar de forma anónima"
                            : "Mostrar mi nombre en las donaciones",
                    },
                    {
                        label: "Notificaciones",
                        value: form.notifications
                            ? "Recibir actualizaciones por email"
                            : "Sin notificaciones",
                    },
                ].map((p) => (
                    <div key={p.label}>
                        <p className="text-sm font-semibold text-gray-700">
                            {p.label}
                        </p>
                        <p className="text-sm text-gray-500">{p.value}</p>
                    </div>
                ))}
            </div>

            {/* Followed foundations */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                Fundaciones seguidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {FOUNDATIONS.slice(0, 3).map((f) => (
                    <div
                        key={f.id}
                        className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm"
                    >
                        <p className="font-semibold text-gray-900">{f.name}</p>
                        <p className="text-xs text-gray-500 mb-3">
                            {f.activeCampaigns} campañas activas
                        </p>
                        <button
                            onClick={() => {
                                setSelectedFoundation(f);
                                setPage("foundation-public");
                            }}
                            className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-blue-700"
                        >
                            Ver perfil
                        </button>
                    </div>
                ))}
            </div>

            {/* Security */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                Seguridad y control
            </h2>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                {[
                    "Métodos de pago",
                    "Configuración de privacidad",
                    "Descargar comprobantes",
                ].map((item, i) => (
                    <button
                        key={item}
                        className={`w-full text-left px-5 py-4 flex justify-between items-center text-sm font-medium text-gray-700 hover:bg-gray-50 ${i > 0 ? "border-t border-gray-100" : ""}`}
                    >
                        {item}
                        <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── My Donations ──────────────────────────────────────────────────────────────
export function MyDonationsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Mis donaciones
            </h1>
            <p className="text-gray-500 text-sm mb-6">
                Historial completo de tus contribuciones
            </p>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {[
                    {
                        label: "Total donado",
                        value: "$245.000",
                        color: "text-blue-600",
                    },
                    {
                        label: "Donaciones realizadas",
                        value: "18",
                        color: "text-gray-900",
                    },
                    {
                        label: "Fundaciones apoyadas",
                        value: "5",
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

            {/* History */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                {[
                                    "Campaña",
                                    "Ítem donado",
                                    "Fecha",
                                    "Monto",
                                    "Estado",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left px-4 py-3 font-medium"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[...DONOR_HISTORY, ...DONOR_HISTORY].map(
                                (row, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {row.campaign}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {row.item}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {row.date}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-gray-900">
                                            ${row.amount.toLocaleString("es")}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === "Entregado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                                            >
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ========================================================================================================
// TODO: Revisar todo el flujo de edición de perfil y preferencias, y conectar con el backend para guardar cambios reales una vez esté listo. También revisar que los datos mostrados (como el resumen e impacto) se correspondan con datos reales del usuario autenticado.
