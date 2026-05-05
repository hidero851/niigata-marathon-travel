export { allProducts } from './products';

import { allEvents as baseEvents } from './events';
import { allProducts } from './products';
import { niigataMarathonEventsDraft } from './niigata-events-draft';
import type { MarathonEvent, LocalProduct } from '../types';
import {
  getAdminCreatedEvents, getHiddenEventIds, getEventVisualSettings,
  getEventAccommodationOverride, getEventModelPlanOverride, getEventAdminLocalProducts,
} from '../utils/adminSettings';

/** YYYY-MM-DD → "YYYY年M月D日（曜）" */
export function formatEventDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const dow = days[d.getUTCDay()];
  return `${y}年${m}月${day}日（${dow}）`;
}

/** 旧データ＋新データをマージ。同IDは新データが優先。 */
function mergeEvents(base: MarathonEvent[], overrides: MarathonEvent[]): MarathonEvent[] {
  const map = new Map<string, MarathonEvent>();
  for (const e of base) map.set(e.id, e);
  for (const e of overrides) map.set(e.id, e);
  return Array.from(map.values());
}

export const allEvents: MarathonEvent[] = mergeEvents(baseEvents, niigataMarathonEventsDraft);

export function getEventById(id: string): MarathonEvent | undefined {
  return allEvents.find((e) => e.id === id);
}

export function getProductById(id: string): LocalProduct | undefined {
  const global = allProducts.find((p) => p.id === id);
  if (global) return global;
  for (const event of allEvents) {
    const local = event.localProducts.find((p) => p.id === id);
    if (local) return local;
  }
  return undefined;
}

export function getDisplayableEvents(): MarathonEvent[] {
  return allEvents.filter((e) => e.sourceInfo.every((s) => s.usageAllowed));
}

function applyDateOverride(event: MarathonEvent, visualSettings: ReturnType<typeof getEventVisualSettings>): MarathonEvent {
  const vs = visualSettings.find((s) => s.eventId === event.id);
  if (vs?.eventDate) {
    const formatted = formatEventDate(vs.eventDate);
    const month = String(parseInt(vs.eventDate.split('-')[1] ?? '1'));
    return { ...event, date: formatted, month, eventDate: vs.eventDate };
  }
  return event;
}

function applyAdminOverrides(event: MarathonEvent, visualSettings: ReturnType<typeof getEventVisualSettings>): MarathonEvent {
  let e = applyDateOverride(event, visualSettings);
  const accOverride = getEventAccommodationOverride(e.id);
  if (accOverride !== undefined) e = { ...e, accommodations: accOverride };
  const planOverride = getEventModelPlanOverride(e.id);
  if (planOverride !== undefined) e = { ...e, modelPlans: planOverride };
  const adminProducts = getEventAdminLocalProducts(e.id);
  if (adminProducts.length > 0) e = { ...e, localProducts: [...e.localProducts, ...adminProducts] };
  return e;
}

export function getAllDisplayableEvents(): MarathonEvent[] {
  try {
    const hidden = getHiddenEventIds();
    const adminCreated = getAdminCreatedEvents();
    const visualSettings = getEventVisualSettings();
    const staticEvents = getDisplayableEvents().filter((e) => !hidden.includes(e.id));
    return [...staticEvents, ...adminCreated].map((e) => applyAdminOverrides(e, visualSettings));
  } catch {
    return getDisplayableEvents();
  }
}

export function getEventByIdAll(id: string): MarathonEvent | undefined {
  try {
    const adminCreated = getAdminCreatedEvents();
    const event = adminCreated.find((e) => e.id === id) ?? getEventById(id);
    if (!event) return undefined;
    const visualSettings = getEventVisualSettings();
    return applyAdminOverrides(event, visualSettings);
  } catch {
    return getEventById(id);
  }
}

export function getDisplayableProducts(): LocalProduct[] {
  return allProducts.filter((p) => p.sourceInfo.every((s) => s.usageAllowed));
}

export const ALL_TAGS = [
  '日本海グルメ', '温泉', '地酒', '米どころ', '城下町',
  '紅葉', '雪景色', '佐渡', '絶景', '桜', '自然', 'グルメ',
  '家族向け', '離島', '都市型', '初心者向け',
  'ウルトラマラソン', '里山', '挑戦', '島旅', 'コシヒカリ',
  '海沿い', '潮風', '初夏', '観光', '海鮮',
];

export const ALL_REGIONS = [
  '新潟市', '南魚沼市', '佐渡市', '上越市', '村上市',
  '魚沼市', '五泉市', '柏崎市',
];

export const ALL_MONTHS = ['4', '5', '6', '9', '10', '11'];
