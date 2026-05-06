import { createContext, useContext, useState } from "react";

// Sección 1: Creamos el contexto de autenticación
// Este contexto almacenará la información del usuario autenticado y su tipo (donante o fundación).
// Servirá para conocer el estado de autenticación en toda la aplicación y para proteger rutas según el tipo de usuario.
const AuthContext = createContext(null);

// Sección 2: Creamos el proveedor del contexto.
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null); // "donor" | "foundation"

    // Los actions especificos para modificar el estado de autenticación, como login y logout.
    const login = (userData, type) => {
        setUser(userData);
        setUserType(type);
    };

    const logout = () => {
        setUser(null);
        setUserType(null);
    };

    // El proveedor del contexto envuelve a los componentes hijos. Se utiliza dentro de App.jsx para envolver toda la aplicación.
    return (
        <AuthContext.Provider value={{ user, userType, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Sección 3: Creamos un hook personalizado para acceder al contexto de autenticación de manera más sencilla en los componentes.
// TODO: Conectar las utils de supabase al contexto para manejar la autenticación con Supabase directamente desde el contexto.
export function useAuth() {
    return useContext(AuthContext);
}
