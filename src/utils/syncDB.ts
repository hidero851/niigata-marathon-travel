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
    // data が null または空配列の場合は既存の localStorage を維持する
    // (service key が Vercel に未設定の場合 RLS で空配列が返る)
    if (!data || data.length === 0) return;
    for (const row of data) {
      localStorage.setItem(row.id, JSON.stringify(row.value));
    }
  } catch {
    // use existing localStorage
  }
}
