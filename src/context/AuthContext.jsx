import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import {
    signUpDonor,
    signUpFoundation,
    signIn,
    signOut,
    getCurrentUserWithRole,
} from "../lib/databaseUtils";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null); // "donor" | "foundation"
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const applyAuthenticatedUser = async (sessionUser, source) => {
        if (!sessionUser) return;

        setUser(sessionUser);

        const metadataRole =
            sessionUser.app_metadata?.role ||
            sessionUser.user_metadata?.role ||
            null;

        if (metadataRole) {
            setUserType(metadataRole);
        }

        try {
            const result = await getCurrentUserWithRole();
            console.log(
                `[AuthContext] ${source} profile lookup result=`,
                result,
            );
            if (result?.user) {
                setUser(result.user);
            }
            if (result?.role) {
                setUserType(result.role);
            } else if (metadataRole) {
                setUserType(metadataRole);
            }
        } catch (err) {
            console.error(
                `[AuthContext] ${source} profile lookup failed:`,
                err.message,
            );
            if (!metadataRole) {
                setUserType(null);
            }
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            try {
                console.log("[AuthContext] checkUser: starting");
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                console.log("[AuthContext] checkUser: session=", session);
                if (session?.user) {
                    setUser(session.user);
                    setUserType(
                        session.user.app_metadata?.role ||
                            session.user.user_metadata?.role ||
                            null,
                    );
                    setIsLoading(false);
                    void applyAuthenticatedUser(session.user, "checkUser");
                    return;
                } else {
                    const result = await getCurrentUserWithRole();
                    console.log("[AuthContext] checkUser: result=", result);
                    if (result?.user) {
                        setUser(result.user);
                        setUserType(result.role || null);
                    }
                }
            } catch (err) {
                console.error("Error verificando usuario:", err.message);
            } finally {
                setIsLoading(false);
            }
        };

        checkUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("[AuthContext] onAuthStateChange", {
                event,
                session,
            });
            if (session?.user) {
                try {
                    setUser(session.user);
                    setUserType(
                        session.user.app_metadata?.role ||
                            session.user.user_metadata?.role ||
                            null,
                    );
                    setIsLoading(false);
                    void applyAuthenticatedUser(
                        session.user,
                        "onAuthStateChange",
                    );
                } catch (err) {
                    console.error("Error actualizando usuario:", err.message);
                }
            } else {
                console.log(
                    "[AuthContext] onAuthStateChange: no session — clearing user",
                );
                setUser(null);
                setUserType(null);
            }
        });

        return () => subscription?.unsubscribe();
    }, []);

    // Función para registrarse
    const signup = async (email, password, userData, type) => {
        try {
            setError(null);
            let newUser;
            console.log("[AuthContext] signup start", { email, type });

            if (type === "donor") {
                const result = await signUpDonor({
                    email,
                    password,
                    fullName: userData.fullName || userData.name || "",
                    phone: userData.phone || "",
                    city: userData.city || "",
                    country: userData.country || "",
                    dontation_type: userData.donation_type || "",
                    donation_range: userData.range || "",
                    causes: userData.causes || [],
                    anonymous: userData.anonymous || false,
                    notifications: userData.notifications || false,
                });
                newUser = result.user;
            } else if (type === "foundation") {
                const result = await signUpFoundation({
                    email,
                    password,
                    ...userData,
                });
                newUser = result.user;
            } else {
                throw new Error("Tipo de usuario inválido");
            }

            setUser(newUser);
            setUserType(type);
            console.log("[AuthContext] signup done", { user: newUser, type });
            return newUser;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Función para iniciar sesión
    const login = async (email, password) => {
        try {
            setError(null);
            console.log("[AuthContext] login start", { email });
            const signInData = await signIn(email, password);
            console.log("[AuthContext] signInData=", signInData);

            // Get user with role
            const result = await getCurrentUserWithRole();
            console.log(
                "[AuthContext] getCurrentUserWithRole after signIn=",
                result,
            );
            if (result) {
                setUser(result.user);
                setUserType(result.role);
            }

            return signInData?.user || null;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Función para cerrar sesión
    const logout = async () => {
        try {
            setError(null);
            console.log("[AuthContext] logout start");
            await signOut();
            setUser(null);
            setUserType(null);
            console.log("[AuthContext] logout done");
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, userType, login, logout, signup, isLoading, error }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
