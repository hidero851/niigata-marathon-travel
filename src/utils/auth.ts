import { supabase } from './supabase';

export async function loginAdmin(password: string): Promise<{ error: string | null }> {
  const email = import.meta.env.VITE_ADMIN_EMAIL;
  if (!email) return { error: 'VITE_ADMIN_EMAIL が設定されていません' };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'パスワードが正しくありません' };
  return { error: null };
}

export async function logoutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getAdminSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
