import type {
  FeaturedEventSetting,
  EventVisualSetting,
  ProductVisualSetting,
  MarathonEvent,
  EventProductAssignment,
} from '../types';

const KEYS = {
  featured: 'featuredEventSettings',
  eventVisual: 'eventVisualSettings',
  productVisual: 'productVisualSettings',
  adminEvents: 'adminCreatedEvents',
  hiddenEvents: 'hiddenEventIds',
  eventProducts: 'eventProductAssignments',
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
  }
}

export function unhideEventId(id: string): void {
  const hidden = getHiddenEventIds().filter((h) => h !== id);
  localStorage.setItem(KEYS.hiddenEvents, JSON.stringify(hidden));
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
