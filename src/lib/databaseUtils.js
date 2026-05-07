import { supabase } from "./supabaseClient";

// ============================================================
// AUTH
// ============================================================

/**
 * Sign up a new donor
 * Pass role in metadata so the DB trigger creates the profiles row.
 */
export const signUpDonor = async ({
    email,
    password,
    fullName,
    phone,
    city,
    country,
}) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { role: "donor" },
        },
    });
    if (error) throw error;

    // Insert donor profile row
    const { error: profileError } = await supabase.from("donors").insert({
        user_id: data.user.id,
        full_name: fullName,
        phone,
        city,
        country,
    });
    if (profileError) throw profileError;

    return data;
};

/**
 * Sign up a new foundation (multi-step form data)
 */
export const signUpFoundation = async (formData) => {
    const {
        email,
        password,
        legalName,
        initials,
        nit,
        type,
        date,
        city,
        country,
        rep,
        docType,
        docNum,
        role: repRole,
        phone,
        description,
        category,
        coverage,
        beneficiaries,
        website,
        social,
        bank,
        accountType,
        accountNum,
        holder,
    } = formData;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { role: "foundation" },
        },
    });
    if (error) throw error;

    const { error: profileError } = await supabase.from("foundations").insert({
        user_id: data.user.id,
        legal_name: legalName,
        initials,
        nit,
        foundation_type: type,
        founded_date: date || null,
        city,
        country,
        rep_name: rep,
        rep_doc_type: docType,
        rep_doc_number: docNum,
        rep_role: repRole,
        institutional_email: email,
        phone,
        description,
        category,
        coverage: coverage || null,
        beneficiaries_desc: beneficiaries,
        website,
        social_handle: social,
        bank_name: bank,
        account_type: accountType || null,
        account_number: accountNum,
        account_holder: holder,
    });
    if (profileError) throw profileError;

    return data;
};

/**
 * Sign in with email + password
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
 * Sign in with Google OAuth
 * Call this on the "Continue with Google" button click.
 * Supabase redirects back to your app after auth.
 */
export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });
    if (error) throw error;
    return data;
};

/**
 * Sign in with Facebook OAuth
 */
export const signInWithFacebook = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });
    if (error) throw error;
    return data;
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

/**
 * Get the current logged-in user + their role from profiles table
 * Returns { user, role } or null if not logged in
 */
export const getCurrentUserWithRole = async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (error) throw error;
    return { user, role: profile.role };
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
};

// ============================================================
// DONORS
// ============================================================

/**
 * Get full donor profile by auth user ID
 */
export const getDonorProfile = async (userId) => {
    const { data, error } = await supabase
        .from("donors")
        .select("*")
        .eq("user_id", userId)
        .single();
    if (error) throw error;
    return data;
};

/**
 * Update donor profile
 * @param {string} userId
 * @param {object} updates - any subset of donor columns
 */
export const updateDonorProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from("donors")
        .update(updates)
        .eq("user_id", userId)
        .select()
        .single();
    if (error) throw error;
    return data;
};

/**
 * Upload donor avatar, return public URL
 */
export const uploadDonorProfileImage = async (donorId, file) => {
    const ext = file.name.split(".").pop();
    const fileName = `donor-${donorId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from("donor-profiles")
        .upload(fileName, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from("donor-profiles")
        .getPublicUrl(fileName);
    return data.publicUrl;
};

// ============================================================
// FOUNDATIONS
// ============================================================

/**
 * Get full foundation profile by auth user ID
 */
export const getFoundationProfile = async (userId) => {
    const { data, error } = await supabase
        .from("foundations")
        .select("*")
        .eq("user_id", userId)
        .single();
    if (error) throw error;
    return data;
};

/**
 * Update foundation profile
 */
export const updateFoundationProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from("foundations")
        .update(updates)
        .eq("user_id", userId)
        .select()
        .single();
    if (error) throw error;
    return data;
};

/**
 * Upload foundation logo, return public URL
 */
export const uploadFoundationImage = async (foundationId, file) => {
    const ext = file.name.split(".").pop();
    const fileName = `foundation-${foundationId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from("foundation-images")
        .upload(fileName, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from("foundation-images")
        .getPublicUrl(fileName);
    return data.publicUrl;
};

/**
 * Upload a foundation legal document (RUT, cámara, etc.)
 * Returns the storage path (not a public URL — bucket is private)
 */
export const uploadFoundationDocument = async (foundationId, docKey, file) => {
    const ext = file.name.split(".").pop();
    const storagePath = `${foundationId}/${docKey}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from("foundation-docs")
        .upload(storagePath, file, { upsert: true });
    if (uploadError) throw uploadError;

    // Upsert the metadata row
    const { data, error } = await supabase
        .from("foundation_documents")
        .upsert(
            {
                foundation_id: foundationId,
                doc_key: docKey,
                file_name: file.name,
                storage_path: storagePath,
            },
            { onConflict: "foundation_id,doc_key" },
        )
        .select()
        .single();
    if (error) throw error;
    return data;
};

/**
 * Get all uploaded documents for a foundation
 */
export const getFoundationDocuments = async (foundationId) => {
    const { data, error } = await supabase
        .from("foundation_documents")
        .select("*")
        .eq("foundation_id", foundationId);
    if (error) throw error;
    return data;
};

/**
 * Get all verified foundations (for the public Fundaciones list)
 */
export const getVerifiedFoundations = async (
    searchTerm = "",
    category = null,
) => {
    let query = supabase
        .from("foundations")
        .select(
            `
      id, legal_name, initials, color, description, category,
      coverage, verified, logo_url, total_beneficiaries,
      campaigns_executed, transparency
    `,
        )
        .eq("verified", true);

    if (searchTerm) {
        query = query.or(
            `legal_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`,
        );
    }
    if (category) {
        query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
};

// kept for backwards compatibility with original utils
export const searchFoundations = getVerifiedFoundations;

/**
 * Get a single foundation by ID (public profile view)
 */
export const getFoundationById = async (foundationId) => {
    const { data, error } = await supabase
        .from("foundations")
        .select("*")
        .eq("id", foundationId)
        .single();
    if (error) throw error;
    return data;
};

// ============================================================
// CAMPAIGNS
// ============================================================

/**
 * Get all active campaigns (donor explore page)
 */
export const getActiveCampaigns = async (searchTerm = "", category = null) => {
    let query = supabase
        .from("campaigns_with_foundation") // uses the view
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

    if (category) {
        query = query.eq("category", category);
    }
    if (searchTerm) {
        query = query.ilike("title", `%${searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
};

/**
 * Get all campaigns for a foundation (foundation dashboard)
 */
export const getFoundationCampaigns = async (foundationId) => {
    const { data, error } = await supabase
        .from("campaigns")
        .select("*, campaign_updates(*), donation_items(*)")
        .eq("foundation_id", foundationId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
};

/**
 * Get a single campaign with its items and updates
 */
export const getCampaignById = async (campaignId) => {
    const { data, error } = await supabase
        .from("campaigns")
        .select(
            `
      *,
      foundations (legal_name, logo_url, color, initials, verified),
      campaign_updates (*),
      donation_items (*)
    `,
        )
        .eq("id", campaignId)
        .single();
    if (error) throw error;
    return data;
};

/**
 * Create a campaign
 */
export const createCampaign = async (foundationId, campaignData) => {
    const { data, error } = await supabase
        .from("campaigns")
        .insert({ foundation_id: foundationId, ...campaignData })
        .select()
        .single();
    if (error) throw error;
    return data;
};

/**
 * Update a campaign
 */
export const updateCampaign = async (campaignId, updates) => {
    const { data, error } = await supabase
        .from("campaigns")
        .update(updates)
        .eq("id", campaignId)
        .select()
        .single();
    if (error) throw error;
    return data;
};

/**
 * Delete a campaign
 */
export const deleteCampaign = async (campaignId) => {
    const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", campaignId);
    if (error) throw error;
};

/**
 * Upload campaign cover image
 */
export const uploadCampaignImage = async (campaignId, file) => {
    const ext = file.name.split(".").pop();
    const fileName = `campaign-${campaignId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from("campaign-images")
        .upload(fileName, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from("campaign-images")
        .getPublicUrl(fileName);
    return data.publicUrl;
};

/**
 * Add an update entry to a campaign
 */
export const addCampaignUpdate = async (campaignId, text) => {
    const { data, error } = await supabase
        .from("campaign_updates")
        .insert({ campaign_id: campaignId, update_text: text })
        .select()
        .single();
    if (error) throw error;
    return data;
};

// ============================================================
// DONATION ITEMS
// ============================================================

/**
 * Get all donation items for a foundation
 */
export const getFoundationItems = async (foundationId) => {
    const { data, error } = await supabase
        .from("donation_items")
        .select("*")
        .eq("foundation_id", foundationId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
};

/**
 * Create a donation item
 */
export const createDonationItem = async (foundationId, itemData) => {
    const { data, error } = await supabase
        .from("donation_items")
        .insert({ foundation_id: foundationId, ...itemData })
        .select()
        .single();
    if (error) throw error;
    return data;
};

/**
 * Update a donation item
 */
export const updateDonationItem = async (itemId, updates) => {
    const { data, error } = await supabase
        .from("donation_items")
        .update(updates)
        .eq("id", itemId)
        .select()
        .single();
    if (error) throw error;
    return data;
};

/**
 * Delete a donation item
 */
export const deleteDonationItem = async (itemId) => {
    const { error } = await supabase
        .from("donation_items")
        .delete()
        .eq("id", itemId);
    if (error) throw error;
};

/**
 * Toggle item active/inactive
 */
export const toggleDonationItem = async (itemId, active) => {
    return updateDonationItem(itemId, { active });
};

/**
 * Upload donation item image
 */
export const uploadDonationItemImage = async (itemId, file) => {
    const ext = file.name.split(".").pop();
    const fileName = `item-${itemId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from("donation-item-images")
        .upload(fileName, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from("donation-item-images")
        .getPublicUrl(fileName);
    return data.publicUrl;
};

// ============================================================
// DONATIONS
// ============================================================

/**
 * Make a donation
 * @param {object} donationData - { donor_id, campaign_id, item_id, foundation_id, quantity, amount, anonymous }
 */
export const makeDonation = async (donationData) => {
    const { data, error } = await supabase
        .from("donations")
        .insert([donationData])
        .select()
        .single();
    if (error) throw error;
    return data;
    // NOTE: The DB trigger automatically updates campaigns.raised + campaigns.donor_count
};

/**
 * Get all donations for a donor (their history page)
 */
export const getDonorDonations = async (donorId) => {
    const { data, error } = await supabase
        .from("donor_donation_history") // uses the view
        .select("*")
        .eq("donor_id", donorId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
};

/**
 * Get all donations to a specific campaign
 */
export const getCampaignDonations = async (campaignId) => {
    const { data, error } = await supabase
        .from("donations")
        .select("*, donors(full_name, anonymous, avatar_url)")
        .eq("campaign_id", campaignId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
};

/**
 * Get donation summary for a donor (total donated, campaigns count)
 */
export const getDonorStats = async (donorId) => {
    const { data, error } = await supabase
        .from("donations")
        .select("amount, campaign_id")
        .eq("donor_id", donorId)
        .eq("status", "confirmed");
    if (error) throw error;

    const totalDonated = data.reduce((sum, d) => sum + Number(d.amount), 0);
    const campaignsSupported = new Set(data.map((d) => d.campaign_id)).size;
    return { totalDonated, campaignsSupported };
};

// ============================================================
// FOUNDATION FOLLOWERS
// ============================================================

/**
 * Follow a foundation
 */
export const followFoundation = async (donorId, foundationId) => {
    const { error } = await supabase
        .from("foundation_followers")
        .insert({ donor_id: donorId, foundation_id: foundationId });
    if (error) throw error;
};

/**
 * Unfollow a foundation
 */
export const unfollowFoundation = async (donorId, foundationId) => {
    const { error } = await supabase
        .from("foundation_followers")
        .delete()
        .eq("donor_id", donorId)
        .eq("foundation_id", foundationId);
    if (error) throw error;
};

/**
 * Get foundations a donor follows
 */
export const getFollowedFoundations = async (donorId) => {
    const { data, error } = await supabase
        .from("foundation_followers")
        .select("foundations(*)")
        .eq("donor_id", donorId);
    if (error) throw error;
    return data.map((f) => f.foundations);
};

// ============================================================
// REPORTS
// ============================================================

/**
 * Report a foundation
 */
export const reportFoundation = async (donorId, foundationId, reason) => {
    const { error } = await supabase
        .from("foundation_reports")
        .insert({ donor_id: donorId, foundation_id: foundationId, reason });
    if (error) throw error;
};
