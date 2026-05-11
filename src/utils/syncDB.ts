import { supabaseAdmin } from './supabaseAdmin';

export async function saveToSupabase(key: string, value: unknown): Promise<void> {
  try {
    await supabaseAdmin.from('admin_settings').upsert({ id: key, value, updated_at: new Date().toISOString() });
  } catch {
    // localStorage is the fallback
  }
}

export async function loadFromSupabase(): Promise<void> {
  try {
    const { data } = await supabaseAdmin.from('admin_settings').select('id, value');
    if (!data) return;
    for (const row of data) {
      localStorage.setItem(row.id, JSON.stringify(row.value));
    }
  } catch {
    // use existing localStorage
  }
}
