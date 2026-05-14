import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
// BOM(﻿)など見えない文字が混入することがあるため除去する
const supabaseServiceKey = (import.meta.env.VITE_SUPABASE_SERVICE_KEY as string ?? '').replace(/^﻿/, '').trim();

// persistSession: false でブラウザのログインセッションを共有しない。
// これにより Storage 操作が service_role キーで実行され RLS をバイパスできる。
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export const STORAGE_BUCKET = 'event-images';
export const STORAGE_PUBLIC_BASE = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}`;
