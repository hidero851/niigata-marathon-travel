import * as XLSX from 'xlsx';
import type { MarathonEvent, EventHighlight, LocalProduct, Accommodation, ModelPlan } from '../types';

type Row = (string | number | undefined)[];

function cell(row: Row, col: number): string {
  const v = row[col];
  return v !== undefined && v !== null ? String(v).trim() : '';
}

function parseHighlights(ws: XLSX.WorkSheet): EventHighlight[] {
  const rows: Row[] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  const results: EventHighlight[] = [];
  // 入力行は row index 7〜10 (0-based)
  for (let i = 7; i <= 10; i++) {
    const row = rows[i] ?? [];
    const title = cell(row, 1);
    const description = cell(row, 2);
    if (!title) continue;
    results.push({ title, description, imageUrl: cell(row, 3) });
    if (results.length >= 4) break;
  }
  return results;
}

function parseLocalProducts(ws: XLSX.WorkSheet): LocalProduct[] {
  const rows: Row[] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  const results: LocalProduct[] = [];
  for (let i = 7; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const name = cell(row, 1);
    if (!name) continue;
    const area = cell(row, 2);
    const shortDescription = cell(row, 3);
    const description = cell(row, 4);
    const whereToBuy = cell(row, 5);
    const id = `imported-product-${Date.now()}-${results.length}`;
    results.push({
      id,
      name,
      area,
      imageUrl: '',
      shortDescription,
      description,
      recommendedPoint: shortDescription,
      whereToBuy,
      salesLocations: whereToBuy ? [whereToBuy] : [],
      externalUrl: '',
      relatedEventIds: [],
      sourceInfo: [],
    });
  }
  return results;
}

function parseAccommodations(ws: XLSX.WorkSheet): Accommodation[] {
  const rows: Row[] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  const results: Accommodation[] = [];
  const rkBase = 'https://travel.rakuten.co.jp/yado/search/?f_ken=15&f_keyword=';
  for (let i = 7; i <= 9; i++) {
    const row = rows[i] ?? [];
    const label = cell(row, 0).replace(/^[🥇🥈🥉]\s*/, '').trim();
    const areaName = cell(row, 1);
    if (!areaName) continue;
    const distanceToVenue = cell(row, 2);
    const priceRange = cell(row, 3);
    const description = cell(row, 4);
    const features = cell(row, 5);
    const fullDesc = features ? `${description}${description ? ' ' : ''}${features}` : description;
    const searchKw = encodeURIComponent(areaName.split('・')[0] ?? areaName);
    const id = `imported-acc-${Date.now()}-${results.length}`;
    results.push({
      id,
      label,
      areaName,
      distanceToVenue,
      description: fullDesc,
      priceRange,
      externalUrl: `${rkBase}${searchKw}`,
      rakutenTravelUrl: `${rkBase}${searchKw}`,
      sourceInfo: [],
    });
  }
  return results;
}

function parseModelPlans(ws: XLSX.WorkSheet): ModelPlan[] {
  const rows: Row[] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  const plans: ModelPlan[] = [];

  // プラン1: row 11(title col1), rows 12-17(steps col1)
  const plan1Title = cell(rows[11] ?? [], 1);
  if (plan1Title) {
    const steps: string[] = [];
    for (let i = 12; i <= 17; i++) {
      const s = cell(rows[i] ?? [], 1);
      if (s) steps.push(s);
    }
    if (steps.length) plans.push({ title: plan1Title, steps });
  }

  // プラン2: row 26(title col1), rows 27-32(steps col1)
  const plan2Title = cell(rows[26] ?? [], 1);
  if (plan2Title) {
    const steps: string[] = [];
    for (let i = 27; i <= 32; i++) {
      const s = cell(rows[i] ?? [], 1);
      if (s) steps.push(s);
    }
    if (steps.length) plans.push({ title: plan2Title, steps });
  }

  return plans;
}

export type ImportedEventData = MarathonEvent & {
  entryStartDate?: string;
  entryEndDate?: string;
};

export function parseExcelToEvent(buffer: ArrayBuffer): ImportedEventData {
  const wb = XLSX.read(buffer, { type: 'array' });
  const ws1 = wb.Sheets[wb.SheetNames[0]];
  const rows: Row[] = XLSX.utils.sheet_to_json(ws1, { header: 1, defval: '' });

  const v = (r: number) => cell(rows[r] ?? [], 2);
  const d = (r: number, yearCol = 2) => {
    const year = cell(rows[r] ?? [], yearCol);
    const month = cell(rows[r] ?? [], yearCol + 1);
    const day = cell(rows[r] ?? [], yearCol + 2);
    if (!year || !month || !day) return '';
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const name = v(5);
  const location = v(6);
  const eventDateIso = v(9);
  const month = v(11);
  const distancesRaw = v(13);
  const distances = distancesRaw
    ? distancesRaw.split(/[/／]/).map((s) => s.trim()).filter(Boolean)
    : [];

  const entryStartDate = d(26);
  const entryEndDate = d(27);

  const tags = v(40)
    ? v(40).split(/[,、,]/).map((t) => t.trim()).filter(Boolean)
    : [];

  // Row 46 (0-indexed: 45) = 大会ID入力欄
  const id = v(45).trim() || `imported-${Date.now()}`;

  const highlights = parseHighlights(wb.Sheets[wb.SheetNames[1]]);
  const localProducts = parseLocalProducts(wb.Sheets[wb.SheetNames[2]]);
  const accommodations = parseAccommodations(wb.Sheets[wb.SheetNames[3]]);
  const modelPlans = parseModelPlans(wb.Sheets[wb.SheetNames[4]]);

  // localProducts に relatedEventIds をセット（後でIDが確定したら更新）
  localProducts.forEach((p) => { p.relatedEventIds = [id]; });

  return {
    id,
    name,
    location,
    prefecture: v(7) || '新潟県',
    date: v(8),
    eventDate: eventDateIso,
    month: month || String(parseInt(eventDateIso.split('-')[1] ?? '1', 10)),
    distances,
    catchCopy: v(15),
    imageUrl: '',
    imageGradient: 'linear-gradient(135deg, #1e3a5f, #0d2d6b)',
    heroImageUrl: v(38),
    tags,
    entryUrl: v(34),
    officialUrl: v(35),
    fee: v(19),
    capacity: v(20),
    timeLimit: v(21),
    startPoint: v(22),
    goalPoint: v(23),
    rakutenSearchKeyword: v(36) || location,
    venue: v(24),
    entryPeriod: v(25),
    organizer: v(29),
    access: v(30),
    notes: v(31),
    draft: true,
    sourceInfo: [{
      sourceName: '大会運営者提供情報',
      sourceUrl: v(35),
      sourceType: 'official_event',
      retrievedAt: new Date().toISOString().slice(0, 10),
      termsChecked: true,
      usageAllowed: true,
      usageNote: 'Excelフォームから運営者が入力した情報をインポート',
    }],
    highlights,
    localProducts,
    accommodations,
    modelPlans,
    entryStartDate,
    entryEndDate,
  };
}
