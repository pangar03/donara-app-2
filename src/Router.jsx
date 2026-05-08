import { useState } from "react";
import { useAuth } from "./context/AuthContext";

// Auth pages
import {
    LoginPage,
    RegisterTypePage,
    DonorRegisterPage,
    FoundationRegisterPage,
} from "./pages/AuthPages";

// Donor pages
import {
    DonorHome,
    CampaignsPage,
    CampaignDetailPage,
    ConfirmDonationPage,
    DonationSuccessPage,
} from "./pages/DonorPages";
import { DonorProfilePage, MyDonationsPage } from "./pages/DonorProfile";
import {
    FoundationsPage,
    FoundationPublicProfile,
} from "./pages/FoundationsPages";

// Foundation pages
import {
    FoundationHome,
    ManageItemsPage,
    ManageCampaignsPage,
    FoundationProfilePage,
} from "./pages/FoundationDashboard";

// Shared nav
import { DonorNavbar, FoundationNavbar } from "./components/ui";

// ─── Auth flow ─────────────────────────────────────────────────────────────────
function AuthFlow({ onLoggedIn }) {
    const [screen, setScreen] = useState("login"); // login | register-type | donor-register | foundation-register

    if (screen === "register-type")
        return (
            <RegisterTypePage
                onSelect={(type) =>
                    setScreen(
                        type === "donor"
                            ? "donor-register"
                            : "foundation-register",
                    )
                }
                onBack={() => setScreen("login")}
            />
        );
    if (screen === "donor-register")
        return (
            <DonorRegisterPage
                onBack={() => setScreen("register-type")}
                onComplete={onLoggedIn}
            />
        );
    if (screen === "foundation-register")
        return (
            <FoundationRegisterPage
                onBack={() => setScreen("register-type")}
                onComplete={onLoggedIn}
            />
        );
    return (
        <LoginPage
            onRegister={() => setScreen("register-type")}
            onLoggedIn={onLoggedIn}
        />
    );
}

// Seccion 1: App del donante, con su propio estado de navegación interna para manejar las diferentes páginas del flujo de donación, exploración de campañas y fundaciones, perfil, etc. Cada página se renderiza condicionalmente según el estado "page", y se pasan funciones para actualizar el estado y manejar selecciones (como campaña o fundación seleccionada) a los componentes hijos según sea necesario.
// ─── Donor App ─────────────────────────────────────────────────────────────────
function DonorApp() {
    const [page, setPage] = useState("home");
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null); // { item, campaign }
    const [selectedFoundation, setSelectedFoundation] = useState(null);
    const [successData, setSuccessData] = useState(null);

    const handleDonationSuccess = () => {
        setSuccessData({
            amount: selectedItem?.item?.price,
            impact: selectedItem?.item?.impact,
        });
        setPage("donation-success");
    };

    const renderPage = () => {
        switch (page) {
            case "home":
                return (
                    <DonorHome
                        setPage={setPage}
                        setSelectedCampaign={setSelectedCampaign}
                    />
                );

            case "campaigns":
                return (
                    <CampaignsPage
                        setPage={setPage}
                        setSelectedCampaign={setSelectedCampaign}
                    />
                );

            case "campaign-detail":
                return selectedCampaign ? (
                    <CampaignDetailPage
                        campaign={selectedCampaign}
                        setPage={setPage}
                        setSelectedItem={setSelectedItem}
                    />
                ) : (
                    <CampaignsPage
                        setPage={setPage}
                        setSelectedCampaign={setSelectedCampaign}
                    />
                );

            case "confirm-donation":
                return selectedItem ? (
                    <ConfirmDonationPage
                        data={selectedItem}
                        setPage={setPage}
                        onSuccess={handleDonationSuccess}
                    />
                ) : (
                    <CampaignsPage
                        setPage={setPage}
                        setSelectedCampaign={setSelectedCampaign}
                    />
                );

            case "donation-success":
                return (
                    <DonationSuccessPage
                        amount={successData?.amount}
                        impact={successData?.impact}
                        setPage={setPage}
                    />
                );

            case "foundations":
                return (
                    <FoundationsPage
                        setPage={setPage}
                        setSelectedFoundation={setSelectedFoundation}
                        setSelectedCampaign={setSelectedCampaign}
                    />
                );

            case "foundation-public":
                return selectedFoundation ? (
                    <FoundationPublicProfile
                        foundation={selectedFoundation}
                        setPage={setPage}
                        setSelectedCampaign={setSelectedCampaign}
                    />
                ) : (
                    <FoundationsPage
                        setPage={setPage}
                        setSelectedFoundation={setSelectedFoundation}
                        setSelectedCampaign={setSelectedCampaign}
                    />
                );

            case "my-donations":
                return <MyDonationsPage />;

            case "profile":
                return (
                    <DonorProfilePage
                        setPage={setPage}
                        setSelectedFoundation={setSelectedFoundation}
                    />
                );

            default:
                return (
                    <DonorHome
                        setPage={setPage}
                        setSelectedCampaign={setSelectedCampaign}
                    />
                );
        }
    };

    // Hide navbar on success / confirm screens for focus
    const hideNav = page === "donation-success";

    return (
        <div className="min-h-screen bg-gray-50">
            {!hideNav && <DonorNavbar page={page} setPage={setPage} />}
            <main>{renderPage()}</main>
        </div>
    );
}

// Seccion 2: App de la fundación, con su propio estado de navegación interna para manejar las diferentes páginas del dashboard de la fundación, como gestión de campañas, ítems, perfil, etc. Cada página se renderiza condicionalmente según el estado "page", y se pasan funciones para actualizar el estado a los componentes hijos según sea necesario.
// ─── Foundation App ────────────────────────────────────────────────────────────
function FoundationApp() {
    const [page, setPage] = useState("foundation-home");

    const renderPage = () => {
        switch (page) {
            case "foundation-home":
                return <FoundationHome setPage={setPage} />;
            case "manage-items":
                return <ManageItemsPage />;
            case "manage-campaigns":
                return <ManageCampaignsPage />;
            case "foundation-profile":
                return <FoundationProfilePage />;
            default:
                return <FoundationHome setPage={setPage} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <FoundationNavbar page={page} setPage={setPage} />
            <main>{renderPage()}</main>
        </div>
    );
}

// Seccion 3: Router principal de la aplicación, que decide qué flujo mostrar (auth, donante o fundación) según el estado de autenticación y tipo de usuario obtenido del contexto de autenticación.
// ─── Root Router ───────────────────────────────────────────────────────────────
export function AppRouter() {
    const { user, userType, isLoading } = useAuth();
    console.log("[AppRouter] render decision", { user, userType });

    if (isLoading) {
        console.log("[AppRouter] auth still loading — waiting to render route");
        return <div className="min-h-screen bg-gray-50" />;
    }

    if (!user) {
        console.log("[AppRouter] no user — rendering AuthFlow");
        return <AuthFlow onLoggedIn={() => {}} />;
    }

    console.log("[AppRouter] authenticated, userType=", userType);
    if (userType === "foundation") return <FoundationApp />;
    return <DonorApp />;
}
