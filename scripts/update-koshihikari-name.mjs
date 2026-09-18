import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function loadEnvLocal() {
  const envPath = resolve(ROOT, '.env.local');
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, 'utf-8').replace(/^﻿/, '');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ VITE_SUPABASE_URL または VITE_SUPABASE_SERVICE_KEY が未設定');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('value')
    .eq('id', 'adminCreatedEvents')
    .single();

  if (error || !data) {
    console.error('❌ adminCreatedEvents 取得失敗:', error?.message);
    process.exit(1);
  }

  const events = data.value;
  // 「越後妙高コシヒカリマラソン」に絞る
  const koshihikariEvents = events.filter(e => e.name && e.name.includes('コシヒカリ'));
  console.log('コシヒカリ含む大会一覧:', koshihikariEvents.map(e => e.name));

  const target = events.find(e => e.name && e.name.includes('妙高') && e.name.includes('コシヒカリ'));

  if (!target) {
    console.error('❌ 越後妙高コシヒカリマラソンのイベントが見つかりません');
    process.exit(1);
  }

  console.log('現在の大会名:', target.name);

  const oldName = target.name;
  // 既に回数が入っていれば置換、なければ先頭に追加
  let newName;
  if (oldName.includes('第56回')) {
    newName = oldName.replace('第56回', '第57回');
  } else if (oldName.includes('第57回')) {
    console.log('✓ 既に「第57回」になっています:', oldName);
    process.exit(0);
  } else {
    newName = '第57回' + oldName;
  }

  target.name = newName;

  const { error: updateError } = await supabase
    .from('admin_settings')
    .update({ value: events })
    .eq('id', 'adminCreatedEvents');

  if (updateError) {
    console.error('❌ 更新失敗:', updateError.message);
    process.exit(1);
  }

  console.log('✓ 大会名を更新しました');
  console.log('  変更前:', oldName);
  console.log('  変更後:', newName);
}

main().catch(e => {
  console.error('❌ エラー:', e.message);
  process.exit(1);
});
