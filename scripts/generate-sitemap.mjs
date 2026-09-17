import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// .env.local が存在すればロード（Vercel ではプロセス環境変数が直接渡される）
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
const SITE_URL = 'https://marathon-navi.com';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ VITE_SUPABASE_URL または VITE_SUPABASE_SERVICE_KEY が未設定です');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchSetting(key) {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('value')
    .eq('id', key)
    .single();
  if (error || !data) return null;
  return data.value;
}

function calcPriority(eventDate, eventDateEnd) {
  if (!eventDate) return { priority: '0.7', changefreq: 'monthly' };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(eventDateEnd || eventDate);
  const daysUntil = (target - today) / (1000 * 60 * 60 * 24);
  if (daysUntil < 0)  return { priority: '0.7', changefreq: 'monthly' };
  if (daysUntil <= 60) return { priority: '0.9', changefreq: 'weekly' };
  return { priority: '0.8', changefreq: 'monthly' };
}

function urlEntry(loc, lastmod, changefreq, priority) {
  const lastmodLine = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  return `  <url>\n    <loc>${loc}</loc>${lastmodLine}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);

  const [adminCreatedEvents, hiddenEventIds] = await Promise.all([
    fetchSetting('adminCreatedEvents'),
    fetchSetting('hiddenEventIds'),
  ]);

  const events = (adminCreatedEvents || []).filter(
    (e) => !e.draft && !(hiddenEventIds || []).includes(e.id)
  );

  const entries = [
    urlEntry(`${SITE_URL}/`,         null,  'weekly',  '1.0'),
    urlEntry(`${SITE_URL}/events`,   null,  'weekly',  '0.9'),
    urlEntry(`${SITE_URL}/calendar`, null,  'weekly',  '0.9'),
  ];

  for (const event of events) {
    const { priority, changefreq } = calcPriority(event.eventDate, event.eventDateEnd);
    entries.push(urlEntry(`${SITE_URL}/events/${event.id}`, today, changefreq, priority));
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');

  writeFileSync(resolve(ROOT, 'public', 'sitemap.xml'), xml, 'utf-8');
  console.log(`✓ sitemap.xml 生成完了: ${events.length}件の大会 + 2静的ページ = 計${events.length + 2} URL`);
}

main().catch((e) => {
  console.error('❌ sitemap生成失敗:', e.message);
  process.exit(1);
});
