import type {
  FeaturedEventSetting,
  EventVisualSetting,
  ProductVisualSetting,
  MarathonEvent,
  EventProductAssignment,
  Accommodation,
  ModelPlan,
  LocalProduct,
  HeroImageSetting,
} from '../types';
import { saveToSupabase } from './syncDB';

const KEYS = {
  featured: 'featuredEventSettings',
  eventVisual: 'eventVisualSettings',
  productVisual: 'productVisualSettings',
  adminEvents: 'adminCreatedEvents',
  hiddenEvents: 'hiddenEventIds',
  eventProducts: 'eventProductAssignments',
  eventAccommodations: 'eventAccommodationOverrides',
  eventModelPlans: 'eventModelPlanOverrides',
  eventAdminProducts: 'eventAdminLocalProducts',
  heroImages: 'heroImages',
} as const;

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function persist<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
  saveToSupabase(key, data);
}

// --- Featured Event Settings ---

export function getFeaturedSettings(): FeaturedEventSetting[] {
  return load<FeaturedEventSetting>(KEYS.featured);
}

export function saveFeaturedSettings(settings: FeaturedEventSetting[]): void {
  persist(KEYS.featured, settings);
}

export function resetFeaturedSettings(): void {
  localStorage.removeItem(KEYS.featured);
  saveToSupabase(KEYS.featured, []);
}

// --- Event Visual Settings ---

export function getEventVisualSettings(): EventVisualSetting[] {
  return load<EventVisualSetting>(KEYS.eventVisual);
}

export function getEventVisualSetting(eventId: string): EventVisualSetting | undefined {
  return getEventVisualSettings().find((s) => s.eventId === eventId);
}

export function saveEventVisualSetting(setting: EventVisualSetting): void {
  const all = getEventVisualSettings();
  const idx = all.findIndex((s) => s.eventId === setting.eventId);
  if (idx >= 0) {
    all[idx] = setting;
  } else {
    all.push(setting);
  }
  persist(KEYS.eventVisual, all);
}

export function resetEventVisualSetting(eventId: string): void {
  const all = getEventVisualSettings().filter((s) => s.eventId !== eventId);
  persist(KEYS.eventVisual, all);
}

export function resetAllEventVisualSettings(): void {
  localStorage.removeItem(KEYS.eventVisual);
  saveToSupabase(KEYS.eventVisual, []);
}

// --- Product Visual Settings ---

export function getProductVisualSettings(): ProductVisualSetting[] {
  return load<ProductVisualSetting>(KEYS.productVisual);
}

export function getProductVisualSetting(productId: string): ProductVisualSetting | undefined {
  return getProductVisualSettings().find((s) => s.productId === productId);
}

export function saveProductVisualSetting(setting: ProductVisualSetting): void {
  const all = getProductVisualSettings();
  const idx = all.findIndex((s) => s.productId === setting.productId);
  if (idx >= 0) {
    all[idx] = setting;
  } else {
    all.push(setting);
  }
  persist(KEYS.productVisual, all);
}

export function resetProductVisualSetting(productId: string): void {
  const all = getProductVisualSettings().filter((s) => s.productId !== productId);
  persist(KEYS.productVisual, all);
}

export function resetAllProductVisualSettings(): void {
  localStorage.removeItem(KEYS.productVisual);
  saveToSupabase(KEYS.productVisual, []);
}

// --- Admin Created Events ---

export function getAdminCreatedEvents(): MarathonEvent[] {
  return load<MarathonEvent>(KEYS.adminEvents);
}

export function saveAdminCreatedEvent(event: MarathonEvent): void {
  const all = getAdminCreatedEvents();
  const idx = all.findIndex((e) => e.id === event.id);
  if (idx >= 0) {
    all[idx] = event;
  } else {
    all.push(event);
  }
  persist(KEYS.adminEvents, all);
}

export function deleteAdminCreatedEvent(eventId: string): void {
  const all = getAdminCreatedEvents().filter((e) => e.id !== eventId);
  persist(KEYS.adminEvents, all);
}

// --- Hidden Event IDs (soft-delete static events) ---

export function getHiddenEventIds(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.hiddenEvents);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function hideEventId(id: string): void {
  const hidden = getHiddenEventIds();
  if (!hidden.includes(id)) {
    hidden.push(id);
    localStorage.setItem(KEYS.hiddenEvents, JSON.stringify(hidden));
    saveToSupabase(KEYS.hiddenEvents, hidden);
  }
}

export function unhideEventId(id: string): void {
  const hidden = getHiddenEventIds().filter((h) => h !== id);
  localStorage.setItem(KEYS.hiddenEvents, JSON.stringify(hidden));
  saveToSupabase(KEYS.hiddenEvents, hidden);
}

// --- Event Product Assignments ---

export function getEventProductAssignments(): EventProductAssignment[] {
  return load<EventProductAssignment>(KEYS.eventProducts);
}

export function getEventProductAssignment(eventId: string): EventProductAssignment | undefined {
  return getEventProductAssignments().find((a) => a.eventId === eventId);
}

export function saveEventProductAssignment(assignment: EventProductAssignment): void {
  const all = getEventProductAssignments();
  const idx = all.findIndex((a) => a.eventId === assignment.eventId);
  if (idx >= 0) {
    all[idx] = assignment;
  } else {
    all.push(assignment);
  }
  persist(KEYS.eventProducts, all);
}

export function resetEventProductAssignment(eventId: string): void {
  const all = getEventProductAssignments().filter((a) => a.eventId !== eventId);
  persist(KEYS.eventProducts, all);
}

// --- Accommodation Overrides ---

type AccommodationOverrideEntry = { eventId: string; accommodations: Accommodation[] };

export function getEventAccommodationOverride(eventId: string): Accommodation[] | undefined {
  return load<AccommodationOverrideEntry>(KEYS.eventAccommodations).find((a) => a.eventId === eventId)?.accommodations;
}

export function saveEventAccommodationOverride(eventId: string, accommodations: Accommodation[]): void {
  const all = load<AccommodationOverrideEntry>(KEYS.eventAccommodations);
  const idx = all.findIndex((a) => a.eventId === eventId);
  if (idx >= 0) { all[idx] = { eventId, accommodations }; } else { all.push({ eventId, accommodations }); }
  persist(KEYS.eventAccommodations, all);
}

// --- Model Plan Overrides ---

type ModelPlanOverrideEntry = { eventId: string; modelPlans: ModelPlan[] };

export function getEventModelPlanOverride(eventId: string): ModelPlan[] | undefined {
  return load<ModelPlanOverrideEntry>(KEYS.eventModelPlans).find((a) => a.eventId === eventId)?.modelPlans;
}

export function saveEventModelPlanOverride(eventId: string, modelPlans: ModelPlan[]): void {
  const all = load<ModelPlanOverrideEntry>(KEYS.eventModelPlans);
  const idx = all.findIndex((a) => a.eventId === eventId);
  if (idx >= 0) { all[idx] = { eventId, modelPlans }; } else { all.push({ eventId, modelPlans }); }
  persist(KEYS.eventModelPlans, all);
}

// --- Admin-Added Local Products (appended to event) ---

type AdminLocalProductEntry = { eventId: string; localProducts: LocalProduct[] };

export function getEventAdminLocalProducts(eventId: string): LocalProduct[] {
  return load<AdminLocalProductEntry>(KEYS.eventAdminProducts).find((a) => a.eventId === eventId)?.localProducts ?? [];
}

export function getAllAdminLocalProducts(): LocalProduct[] {
  return load<AdminLocalProductEntry>(KEYS.eventAdminProducts).flatMap((e) => e.localProducts ?? []);
}

export function saveEventAdminLocalProducts(eventId: string, localProducts: LocalProduct[]): void {
  const all = load<AdminLocalProductEntry>(KEYS.eventAdminProducts);
  const idx = all.findIndex((a) => a.eventId === eventId);
  if (idx >= 0) { all[idx] = { eventId, localProducts }; } else { all.push({ eventId, localProducts }); }
  persist(KEYS.eventAdminProducts, all);
}

// --- Entry Date Settings ---

export type EntryDateEntry = { eventId: string; entryStartDate?: string; entryEndDate?: string; entryStatusNote?: string; entryFinished?: boolean };

export function isEntryFinished(eventId: string): boolean {
  const entry = getEventEntryDates().find((e) => e.eventId === eventId);
  if (entry?.entryFinished) return true;
  if (entry?.entryEndDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(entry.entryEndDate);
    end.setHours(0, 0, 0, 0);
    return end < today;
  }
  return false;
}

export function getEventEntryDates(): EntryDateEntry[] {
  return load<EntryDateEntry>('eventEntryDates');
}

export function saveEventEntryDate(entry: EntryDateEntry): void {
  const all = getEventEntryDates();
  const idx = all.findIndex((e) => e.eventId === entry.eventId);
  if (idx >= 0) { all[idx] = entry; } else { all.push(entry); }
  persist('eventEntryDates', all);
}

export function getEntryAlertDays(): number {
  try {
    const raw = localStorage.getItem('entryAlertDays');
    return raw ? Number(JSON.parse(raw)) : 14;
  } catch { return 14; }
}

export function saveEntryAlertDays(days: number): void {
  localStorage.setItem('entryAlertDays', JSON.stringify(days));
  saveToSupabase('entryAlertDays', days);
}

// --- Top Page Hero Background Images ---

export function getHeroImages(): HeroImageSetting[] {
  return load<HeroImageSetting>(KEYS.heroImages);
}

export function saveHeroImages(images: HeroImageSetting[]): void {
  persist(KEYS.heroImages, images);
}
