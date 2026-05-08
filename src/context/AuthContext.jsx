import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [userType, setUserType] = useState(null); // "donor" | "foundation"
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const checkUser = async () => {
			try {
				const {
					data: { user: supabaseUser },
				} = await supabase.auth.getUser();

				if (supabaseUser) {
					setUser(supabaseUser);
					const { data: donor } = await supabase.from('donors').select('*').eq('user_id', supabaseUser.id).single();

					if (donor) {
						setUserType('donor');
					} else {
						const { data: foundation } = await supabase
							.from('foundations')
							.select('*')
							.eq('user_id', supabaseUser.id)
							.single();

						if (foundation) setUserType('foundation');
					}
				}
			} catch (err) {
				console.error('Error verificando usuario:', err.message);
			} finally {
				setIsLoading(false);
			}
		};

		checkUser();

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

		return () => subscription?.unsubscribe();
	}, []);

	// Función para registrarse
	const signup = async (email, password, userData, type) => {
		try {
			setError(null);
			const { data, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
			});

			if (signUpError) throw signUpError;

			const newUser = data?.user;
			if (!newUser?.id) {
				throw new Error('No se pudo crear el usuario. Por favor intenta de nuevo.');
			}

			if (type === 'donor') {
				const { error: insertError } = await supabase
					.from('donors')
					.insert([{ user_id: newUser.id, email, ...userData }]);
				if (insertError) throw insertError;
			} else if (type === 'foundation') {
				const payload = { user_id: newUser.id, email, ...userData };
				const { error: insertError } = await supabase.from('foundations').insert([payload]);
				if (insertError) {
					const isUnknownColumn =
						insertError.code === '42703' ||
						/column .* does not exist/i.test(insertError.message || '') ||
						/could not find/i.test(insertError.message || '');

					if (!isUnknownColumn) throw insertError;

					const fallbackPayload = {
						user_id: newUser.id,
						email,
						name: userData?.legal_name ?? userData?.name ?? '',
						initials: userData?.initials ?? null,
						description: userData?.description ?? null,
						category: userData?.category ?? null,
						coverage: userData?.coverage ?? null,
						contact: userData?.phone ?? email,
						website: userData?.website ?? null,
					};

					const { error: fallbackError } = await supabase.from('foundations').insert([fallbackPayload]);
					if (fallbackError) throw fallbackError;
				}
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
			} = await supabase.auth.signInWithPassword({ email, password });

			if (signInError) throw signInError;

			setUser(signInUser);

			const { data: donor } = await supabase.from('donors').select('*').eq('user_id', signInUser.id).single();

			if (donor) {
				setUserType('donor');
			} else {
				const { data: foundation } = await supabase
					.from('foundations')
					.select('*')
					.eq('user_id', signInUser.id)
					.single();

				if (foundation) setUserType('foundation');
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

	return (
		<AuthContext.Provider value={{ user, userType, login, logout, signup, isLoading, error }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
