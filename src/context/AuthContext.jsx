import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Sección 1: Creamos el contexto de autenticación
// Este contexto almacenará la información del usuario autenticado y su tipo (donante o fundación).
// Servirá para conocer el estado de autenticación en toda la aplicación y para proteger rutas según el tipo de usuario.
const AuthContext = createContext(null);

// Sección 2: Creamos el proveedor del contexto.
export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [userType, setUserType] = useState(null); // "donor" | "foundation"
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// Verificar sesión existente al montar el componente
	useEffect(() => {
		const checkUser = async () => {
			try {
				const {
					data: { user: supabaseUser },
				} = await supabase.auth.getUser();

				if (supabaseUser) {
					setUser(supabaseUser);
					// Obtener el tipo de usuario desde la tabla de donantes o fundaciones
					const { data: donor } = await supabase.from('donors').select('*').eq('user_id', supabaseUser.id).single();

					if (donor) {
						setUserType('donor');
					} else {
						const { data: foundation } = await supabase
							.from('foundations')
							.select('*')
							.eq('user_id', supabaseUser.id)
							.single();

						if (foundation) {
							setUserType('foundation');
						}
					}
				}
			} catch (err) {
				console.error('Error verificando usuario:', err.message);
			} finally {
				setIsLoading(false);
			}
		};

		checkUser();

		// Suscribirse a cambios de autenticación
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (session?.user) {
				setUser(session.user);
			} else {
				setUser(null);
				setUserType(null);
			}
		});

		return () => {
			subscription?.unsubscribe();
		};
	}, []);

	// Función para registrarse
	const signup = async (email, password, userData, type) => {
		try {
			setError(null);
			const {
				data: { user: newUser },
				error: signUpError,
			} = await supabase.auth.signUp({
				email,
				password,
			});

			if (signUpError) throw signUpError;

			// Crear perfil del usuario en la tabla correspondiente
			if (type === 'donor') {
				await supabase.from('donors').insert([
					{
						user_id: newUser.id,
						email,
						...userData,
					},
				]);
			} else if (type === 'foundation') {
				await supabase.from('foundations').insert([
					{
						user_id: newUser.id,
						email,
						...userData,
					},
				]);
			}

			setUser(newUser);
			setUserType(type);
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
			const {
				data: { user: signInUser },
				error: signInError,
			} = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (signInError) throw signInError;

			setUser(signInUser);

			// Obtener el tipo de usuario
			const { data: donor } = await supabase.from('donors').select('*').eq('user_id', signInUser.id).single();

			if (donor) {
				setUserType('donor');
			} else {
				const { data: foundation } = await supabase
					.from('foundations')
					.select('*')
					.eq('user_id', signInUser.id)
					.single();

				if (foundation) {
					setUserType('foundation');
				}
			}

			return signInUser;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	// Función para cerrar sesión
	const logout = async () => {
		try {
			setError(null);
			await supabase.auth.signOut();
			setUser(null);
			setUserType(null);
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	// El proveedor del contexto envuelve a los componentes hijos.
	return (
		<AuthContext.Provider
			value={{
				user,
				userType,
				login,
				logout,
				signup,
				isLoading,
				error,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

// Sección 3: Hook personalizado para acceder al contexto de autenticación
export function useAuth() {
	return useContext(AuthContext);
}
