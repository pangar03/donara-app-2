import { supabase } from './supabaseClient';

// ===== UTILIDADES DE DONANTES =====

/**
 * Obtener perfil completo del donante
 * @param {string} userId - ID del usuario
 * @returns {Promise}
 */
export const getDonorProfile = async (userId) => {
	const { data, error } = await supabase.from('donors').select('*').eq('user_id', userId).single();
	if (error) throw error;
	return data;
};

/**
 * Actualizar perfil del donante
 * @param {string} userId - ID del usuario
 * @param {object} updates - Datos a actualizar
 * @returns {Promise}
 */
export const updateDonorProfile = async (userId, updates) => {
	const { data, error } = await supabase.from('donors').update(updates).eq('user_id', userId).select().single();
	if (error) throw error;
	return data;
};

// ===== UTILIDADES DE FUNDACIONES =====

/**
 * Obtener perfil completo de la fundación
 * @param {string} userId - ID del usuario
 * @returns {Promise}
 */
export const getFoundationProfile = async (userId) => {
	const { data, error } = await supabase.from('foundations').select('*').eq('user_id', userId).single();
	if (error) throw error;
	return data;
};

/**
 * Actualizar perfil de la fundación
 * @param {string} userId - ID del usuario
 * @param {object} updates - Datos a actualizar
 * @returns {Promise}
 */
export const updateFoundationProfile = async (userId, updates) => {
	const { data, error } = await supabase.from('foundations').update(updates).eq('user_id', userId).select().single();
	if (error) throw error;
	return data;
};

// ===== UTILIDADES DE CAMPAÑAS =====

/**
 * Obtener campañas activas de una fundación
 * @param {number} foundationId - ID de la fundación
 * @returns {Promise}
 */
export const getFoundationCampaigns = async (foundationId) => {
	const { data, error } = await supabase.from('campaigns').select('*').eq('foundation_id', foundationId);
	if (error) throw error;
	return data;
};

/**
 * Obtener donaciones de una campaña
 * @param {number} campaignId - ID de la campaña
 * @returns {Promise}
 */
export const getCampaignDonations = async (campaignId) => {
	const { data, error } = await supabase.from('donations').select('*').eq('campaign_id', campaignId);
	if (error) throw error;
	return data;
};

/**
 * Crear donación
 * @param {object} donationData - Datos de la donación
 * @returns {Promise}
 */
export const makeDonation = async (donationData) => {
	const { data, error } = await supabase.from('donations').insert([donationData]).select();
	if (error) throw error;
	return data[0];
};

/**
 * Obtener donaciones de un donante
 * @param {number} donorId - ID del donante
 * @returns {Promise}
 */
export const getDonorDonations = async (donorId) => {
	const { data, error } = await supabase.from('donations').select('*').eq('donor_id', donorId);
	if (error) throw error;
	return data;
};

// ===== UTILIDADES DE BÚSQUEDA Y FILTRADO =====

/**
 * Buscar fundaciones por nombre o categoría
 * @param {string} searchTerm - Término de búsqueda
 * @param {string} category - Categoría opcional
 * @returns {Promise}
 */
export const searchFoundations = async (searchTerm, category = null) => {
	let query = supabase.from('foundations').select('*');

	if (searchTerm) {
		query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
	}

	if (category) {
		query = query.eq('category', category);
	}

	const { data, error } = await query;
	if (error) throw error;
	return data;
};

/**
 * Buscar campañas activas
 * @returns {Promise}
 */
export const getActiveCampaigns = async () => {
	const { data, error } = await supabase
		.from('campaigns')
		.select('*')
		.eq('status', 'active')
		.order('created_at', { ascending: false });
	if (error) throw error;
	return data;
};

/**
 * Obtener fundaciones verificadas
 * @returns {Promise}
 */
export const getVerifiedFoundations = async () => {
	const { data, error } = await supabase.from('foundations').select('*').eq('verified', true);
	if (error) throw error;
	return data;
};

// ===== UTILIDADES DE IMÁGENES =====

/**
 * Subir imagen de perfil de donante
 * @param {number} donorId - ID del donante
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - URL de la imagen
 */
export const uploadDonorProfileImage = async (donorId, file) => {
	const fileName = `donor-${donorId}-${Date.now()}`;
	const { data, error } = await supabase.storage.from('donor-profiles').upload(fileName, file);

	if (error) throw error;

	const { data: publicUrl } = supabase.storage.from('donor-profiles').getPublicUrl(fileName);

	return publicUrl.publicUrl;
};

/**
 * Subir imagen de portada de fundación
 * @param {number} foundationId - ID de la fundación
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - URL de la imagen
 */
export const uploadFoundationImage = async (foundationId, file) => {
	const fileName = `foundation-${foundationId}-${Date.now()}`;
	const { data, error } = await supabase.storage.from('foundation-images').upload(fileName, file);

	if (error) throw error;

	const { data: publicUrl } = supabase.storage.from('foundation-images').getPublicUrl(fileName);

	return publicUrl.publicUrl;
};

/**
 * Subir imagen de campaña
 * @param {number} campaignId - ID de la campaña
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - URL de la imagen
 */
export const uploadCampaignImage = async (campaignId, file) => {
	const fileName = `campaign-${campaignId}-${Date.now()}`;
	const { data, error } = await supabase.storage.from('campaign-images').upload(fileName, file);

	if (error) throw error;

	const { data: publicUrl } = supabase.storage.from('campaign-images').getPublicUrl(fileName);

	return publicUrl.publicUrl;
};
