import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://phflgbcqddfqrkodeyit.supabase.co';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_ANON_KEY) {
	throw new Error(
		'Falta VITE_SUPABASE_ANON_KEY. Crea un archivo .env.local en la raíz (junto a package.json) con VITE_SUPABASE_ANON_KEY=<anon public key (JWT)> y reinicia npm run dev.',
	);
}

if (SUPABASE_ANON_KEY.startsWith('sb_publishable_')) {
	const keyPreview = `${SUPABASE_ANON_KEY.slice(0, 16)}… (len ${SUPABASE_ANON_KEY.length})`;
	throw new Error(
		`VITE_SUPABASE_ANON_KEY parece ser una publishable key (${keyPreview}). Usa la "anon public key" (JWT) del proyecto (normalmente empieza con "eyJ").`,
	);
}

if (SUPABASE_ANON_KEY.startsWith('sb_secret_')) {
	throw new Error(
		'VITE_SUPABASE_ANON_KEY parece ser una service role key (sb_secret_). No la uses en el frontend. Usa la "anon public key" (JWT) del proyecto (normalmente empieza con "eyJ") y rota esa key en Supabase.',
	);
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== FUNCIONES DE AUTENTICACIÓN =====

/**
 * Registrar un nuevo usuario
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
export const signUp = async (email, password) => {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});
	if (error) throw error;
	return data;
};

/**
 * Iniciar sesión
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
export const signIn = async (email, password) => {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) throw error;
	return data;
};

/**
 * Cerrar sesión
 * @returns {Promise}
 */
export const signOut = async () => {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
};

/**
 * Obtener usuario actual
 * @returns {Promise}
 */
export const getCurrentUser = async () => {
	const { data, error } = await supabase.auth.getUser();
	if (error) throw error;
	return data.user;
};

// ===== FUNCIONES DE BASE DE DATOS =====

/**
 * Obtener todas las fundaciones
 * @returns {Promise}
 */
export const getFoundations = async () => {
	const { data, error } = await supabase.from('foundations').select('*');
	if (error) throw error;
	return data;
};

/**
 * Obtener fundación por ID
 * @param {number} id
 * @returns {Promise}
 */
export const getFoundationById = async (id) => {
	const { data, error } = await supabase.from('foundations').select('*').eq('id', id).single();
	if (error) throw error;
	return data;
};

/**
 * Crear una nueva fundación
 * @param {object} foundationData
 * @returns {Promise}
 */
export const createFoundation = async (foundationData) => {
	const { data, error } = await supabase.from('foundations').insert([foundationData]).select();
	if (error) throw error;
	return data[0];
};

/**
 * Actualizar fundación
 * @param {number} id
 * @param {object} foundationData
 * @returns {Promise}
 */
export const updateFoundation = async (id, foundationData) => {
	const { data, error } = await supabase.from('foundations').update(foundationData).eq('id', id).select();
	if (error) throw error;
	return data[0];
};

/**
 * Obtener campañas
 * @returns {Promise}
 */
export const getCampaigns = async () => {
	const { data, error } = await supabase.from('campaigns').select('*');
	if (error) throw error;
	return data;
};

/**
 * Obtener campaña por ID
 * @param {number} id
 * @returns {Promise}
 */
export const getCampaignById = async (id) => {
	const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).single();
	if (error) throw error;
	return data;
};

/**
 * Crear nueva campaña
 * @param {object} campaignData
 * @returns {Promise}
 */
export const createCampaign = async (campaignData) => {
	const { data, error } = await supabase.from('campaigns').insert([campaignData]).select();
	if (error) throw error;
	return data[0];
};

/**
 * Obtener donantes
 * @returns {Promise}
 */
export const getDonors = async () => {
	const { data, error } = await supabase.from('donors').select('*');
	if (error) throw error;
	return data;
};

/**
 * Obtener donante por ID
 * @param {number} id
 * @returns {Promise}
 */
export const getDonorById = async (id) => {
	const { data, error } = await supabase.from('donors').select('*').eq('id', id).single();
	if (error) throw error;
	return data;
};

/**
 * Crear nuevo donante
 * @param {object} donorData
 * @returns {Promise}
 */
export const createDonor = async (donorData) => {
	const { data, error } = await supabase.from('donors').insert([donorData]).select();
	if (error) throw error;
	return data[0];
};

/**
 * Actualizar donante
 * @param {number} id
 * @param {object} donorData
 * @returns {Promise}
 */
export const updateDonor = async (id, donorData) => {
	const { data, error } = await supabase.from('donors').update(donorData).eq('id', id).select();
	if (error) throw error;
	return data[0];
};

// ===== FUNCIONES DE ALMACENAMIENTO =====

/**
 * Subir archivo a Supabase Storage
 * @param {string} bucket - Nombre del bucket
 * @param {string} filePath - Ruta del archivo
 * @param {File} file - Archivo a subir
 * @returns {Promise}
 */
export const uploadFile = async (bucket, filePath, file) => {
	const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);
	if (error) throw error;
	return data;
};

/**
 * Descargar archivo desde Supabase Storage
 * @param {string} bucket - Nombre del bucket
 * @param {string} filePath - Ruta del archivo
 * @returns {Promise<string>} - URL del archivo
 */
export const downloadFile = async (bucket, filePath) => {
	const { data, error } = await supabase.storage.from(bucket).download(filePath);
	if (error) throw error;
	return URL.createObjectURL(data);
};

/**
 * Obtener URL pública del archivo
 * @param {string} bucket - Nombre del bucket
 * @param {string} filePath - Ruta del archivo
 * @returns {string} - URL pública del archivo
 */
export const getFileUrl = (bucket, filePath) => {
	const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
	return data.publicUrl;
};

/**
 * Eliminar archivo de Supabase Storage
 * @param {string} bucket - Nombre del bucket
 * @param {string} filePath - Ruta del archivo
 * @returns {Promise}
 */
export const deleteFile = async (bucket, filePath) => {
	const { error } = await supabase.storage.from(bucket).remove([filePath]);
	if (error) throw error;
};
