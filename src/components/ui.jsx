import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// Sección 1: En esta sección tendremos todo lo relacionado a iconografia relacionada
// con el design system de la app.
// ─── Icons ────────────────────────────────────────────────────────────────────
export function HeartIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
        </svg>
    );
}

export function SearchIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="m21 21-4.35-4.35" />
        </svg>
    );
}

export function FilterIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path strokeLinecap="round" d="M3 4h18M7 12h10M11 20h2" />
        </svg>
    );
}

export function ChevronDown({ className = "w-4 h-4" }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path strokeLinecap="round" d="m6 9 6 6 6-6" />
        </svg>
    );
}

export function ArrowLeft({ className = "w-4 h-4" }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path strokeLinecap="round" d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
    );
}

export function CheckCircleIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );
}

export function PlusIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
        </svg>
    );
}

export function DotsIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
        </svg>
    );
}

export function EditIcon({ className = "w-4 h-4" }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
        </svg>
    );
}

export function TrashIcon({ className = "w-4 h-4" }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
        </svg>
    );
}

export function CopyIcon({ className = "w-4 h-4" }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
        </svg>
    );
}

export function UserIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
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
    );
}

export function UsersIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
        </svg>
    );
}

export function CalendarIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        </svg>
    );
}

export function CloseIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

export function MenuIcon({ className = "w-6 h-6" }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

export function LogoutIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
        </svg>
    );
}

// Sección 2: Este es el logo placeholder de la app mientras definimos como vamos a manejar
// el SVG del logo definitivo.
// ─── Logo ─────────────────────────────────────────────────────────────────────
export function DonараLogo({ white = false }) {
    return (
        <div
            className={`flex items-center gap-1.5 font-bold text-xl ${white ? "text-white" : "text-gray-900"}`}
        >
            <span>Donara</span>
            <HeartIcon
                className={`w-6 h-6 ${white ? "text-blue-200" : "text-blue-600"}`}
            />
        </div>
    );
}

// Sección 3: Barra de progreso quue se modifica dinamicamente con el porcentaje.
// (El porcentaje se recive como parametro)
// ─── Progress Bar ──────────────────────────────────────────────────────────────
export function ProgressBar({ percent, className = "" }) {
    return (
        <div
            className={`h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}
        >
            <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${Math.min(percent, 100)}%` }}
            />
        </div>
    );
}

// Sección 4: Badges (chips) para mostrar categorías, estados o cualquier etiqueta relevante en la app.
// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ label }) {
    const colors = {
        Popular: "bg-blue-100 text-blue-700",
        Urgente: "bg-red-100 text-red-700",
        Recomendado: "bg-green-100 text-green-700",
        Educación: "bg-blue-100 text-blue-700",
        Salud: "bg-red-100 text-red-700",
        Animales: "bg-green-100 text-green-700",
        "Medio Ambiente": "bg-emerald-100 text-emerald-700",
        Alimentación: "bg-orange-100 text-orange-700",
        Material: "bg-yellow-100 text-yellow-700",
        Capacitación: "bg-purple-100 text-purple-700",
        Infraestructura: "bg-gray-100 text-gray-700",
        Plantación: "bg-green-100 text-green-700",
        Equipamiento: "bg-teal-100 text-teal-700",
    };
    return (
        <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[label] || "bg-gray-100 text-gray-600"}`}
        >
            {label}
        </span>
    );
}

// Sección 5: Componente de toggle para activar/desactivar opciones en la app, como filtros, items, etc.
// ─── Toggle ───────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-gray-900" : "bg-gray-300"}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
            />
        </button>
    );
}

// Seccion 6: Navbar compartida entre ambos perfiles. Se usa en la landing.
// TODO: Revisar componente
// ─── Navbar (Public) ──────────────────────────────────────────────────────────
export function PublicNavbar({ onLogin, onRegister }) {
    const [open, setOpen] = useState(false);
    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <DonараLogo />
                <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
                    <a href="#" className="hover:text-gray-900">
                        Home
                    </a>
                    <a href="#" className="hover:text-gray-900">
                        Servicios
                    </a>
                    <a href="#" className="hover:text-gray-900">
                        Únete a nosotros
                    </a>
                    <a href="#" className="hover:text-gray-900">
                        Contáctanos
                    </a>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <button
                        onClick={onLogin}
                        className="text-sm text-gray-700 hover:text-gray-900 font-medium px-3 py-2"
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={onRegister}
                        className="text-sm bg-blue-600 text-white font-medium px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                        Registrarse
                    </button>
                </div>
                <button className="md:hidden" onClick={() => setOpen(!open)}>
                    <MenuIcon />
                </button>
            </div>
            {open && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
                    <a href="#" className="block text-sm text-gray-700">
                        Home
                    </a>
                    <a href="#" className="block text-sm text-gray-700">
                        Servicios
                    </a>
                    <a href="#" className="block text-sm text-gray-700">
                        Únete a nosotros
                    </a>
                    <a href="#" className="block text-sm text-gray-700">
                        Contáctanos
                    </a>
                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={onLogin}
                            className="flex-1 text-sm border border-gray-300 rounded-lg py-2"
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={onRegister}
                            className="flex-1 text-sm bg-blue-600 text-white rounded-lg py-2"
                        >
                            Registrarse
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

// Sección 7: Navbars especificas para cada perfil. =====================================================================
// ─── Navbar (App – Donor) ─────────────────────────────────────────────────────
export function DonorNavbar({ page, setPage }) {
    const { logout, user } = useAuth();
    const [open, setOpen] = useState(false);
    const links = [
        { key: "home", label: "Home" },
        { key: "campaigns", label: "Campañas" },
        { key: "foundations", label: "Fundaciones" },
        { key: "my-donations", label: "Mis donaciones" },
    ];
    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <button onClick={() => setPage("home")}>
                    <DonараLogo />
                </button>
                <div className="hidden md:flex items-center gap-6 text-sm">
                    {links.map((l) => (
                        <button
                            key={l.key}
                            onClick={() => setPage(l.key)}
                            className={`font-medium ${page === l.key ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <button
                        onClick={() => setPage("profile")}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1.5"
                    >
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        Mi perfil
                    </button>
                    <button
                        onClick={logout}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <LogoutIcon className="w-5 h-5" />
                    </button>
                </div>
                <button className="md:hidden" onClick={() => setOpen(!open)}>
                    <MenuIcon />
                </button>
            </div>
            {open && (
                <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
                    {links.map((l) => (
                        <button
                            key={l.key}
                            onClick={() => {
                                setPage(l.key);
                                setOpen(false);
                            }}
                            className="block text-sm text-gray-700 w-full text-left"
                        >
                            {l.label}
                        </button>
                    ))}
                    <button
                        onClick={() => {
                            setPage("profile");
                            setOpen(false);
                        }}
                        className="block text-sm text-blue-600 font-medium w-full text-left"
                    >
                        Mi perfil
                    </button>
                    <button
                        onClick={logout}
                        className="block text-sm text-red-500 w-full text-left"
                    >
                        Cerrar sesión
                    </button>
                </div>
            )}
        </nav>
    );
}

// ─── Navbar (App – Foundation) ────────────────────────────────────────────────
export function FoundationNavbar({ page, setPage }) {
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);
    const links = [
        { key: "foundation-home", label: "Home" },
        { key: "manage-items", label: "Ítems de donación" },
        { key: "manage-campaigns", label: "Mis campañas" },
        { key: "foundation-profile", label: "Mi perfil" },
    ];
    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <button onClick={() => setPage("foundation-home")}>
                    <DonараLogo />
                </button>
                <div className="hidden md:flex items-center gap-6 text-sm">
                    {links.map((l) => (
                        <button
                            key={l.key}
                            onClick={() => setPage(l.key)}
                            className={`font-medium ${page === l.key ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={logout}
                    className="text-gray-500 hover:text-gray-700 hidden md:block"
                >
                    <LogoutIcon className="w-5 h-5" />
                </button>
                <button className="md:hidden" onClick={() => setOpen(!open)}>
                    <MenuIcon />
                </button>
            </div>
            {open && (
                <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
                    {links.map((l) => (
                        <button
                            key={l.key}
                            onClick={() => {
                                setPage(l.key);
                                setOpen(false);
                            }}
                            className="block text-sm text-gray-700 w-full text-left"
                        >
                            {l.label}
                        </button>
                    ))}
                    <button
                        onClick={logout}
                        className="block text-sm text-red-500 w-full text-left"
                    >
                        Cerrar sesión
                    </button>
                </div>
            )}
        </nav>
    );
}
// ====================================================================================================================
