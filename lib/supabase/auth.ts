import { supabase, WIZARD_TREE_COMPANY_ID } from './client';

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  company_id: string | null;
}

/**
 * Signs in an admin user and strictly verifies their profile belongs
 * to the configured Wizard Trees company ID.
 */
export async function loginAdmin(email: string, password: string): Promise<AdminProfile> {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    throw new Error(authError?.message || 'Authentication failed');
  }

  // Fetch the user's profile to check company association
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, full_name, company_id')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    throw new Error('User profile could not be verified.');
  }

  // Strict company verification guard
  if (!WIZARD_TREE_COMPANY_ID || profile.company_id !== WIZARD_TREE_COMPANY_ID) {
    await supabase.auth.signOut();
    throw new Error(
      'Access Denied: This account is not authorized for the Wizard Trees company workspace.'
    );
  }

  return profile as AdminProfile;
}

/**
 * Registers a new Admin account and automatically associates their profile
 * with the Wizard Trees company ID (without referencing any nonexistent role column).
 */
export async function registerAdmin(
  email: string,
  password: string,
  fullName: string
): Promise<AdminProfile> {
  if (!WIZARD_TREE_COMPANY_ID) {
    throw new Error('Company ID is not configured in the application environment.');
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (authError || !authData.user) {
    throw new Error(authError?.message || 'Registration failed');
  }

  // Ensure profile has company_id set to Wizard Trees
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: authData.user.id,
        email,
        full_name: fullName,
        company_id: WIZARD_TREE_COMPANY_ID,
      },
      { onConflict: 'id' }
    )
    .select('id, email, full_name, company_id')
    .single();

  if (profileError) {
    throw new Error(`Profile creation error: ${profileError.message}`);
  }

  return profile as AdminProfile;
}

/**
 * Checks current active session and profile.
 */
export async function getCurrentAdmin(): Promise<AdminProfile | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, company_id')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.company_id !== WIZARD_TREE_COMPANY_ID) {
    return null;
  }

  return profile as AdminProfile;
}

/**
 * Logs out the admin.
 */
export async function logoutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}
