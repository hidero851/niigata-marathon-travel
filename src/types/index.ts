export type SourceInfo = {
  sourceName: string;
  sourceUrl: string;
  sourceType:
    | "official_event"
    | "municipality"
    | "tourism_association"
    | "open_data"
    | "permission_obtained"
    | "manual_created";
  retrievedAt: string;
  termsChecked: boolean;
  usageAllowed: boolean;
  usageNote: string;
};

export type Accommodation = {
  id: string;
  areaName: string;
  distanceToVenue: string;
  description: string;
  priceRange: string;
  externalUrl: string;
  rakutenTravelUrl?: string;
  sourceInfo: SourceInfo[];
};

export type LocalProduct = {
  id: string;
  name: string;
  area: string;
  imageUrl: string;
  imageGradient?: string;
  shortDescription: string;
  description: string;
  recommendedPoint: string;
  whereToBuy: string;
  salesLocations?: string[];
  externalUrl: string;
  relatedEventIds: string[];
  sourceInfo: SourceInfo[];
};

export type EventHighlight = {
  title: string;
  description: string;
  imageUrl: string;
  gradient?: string;
};

export type ModelPlan = {
  title: string;
  steps: string[];
};

export type MarathonEvent = {
  id: string;
  name: string;
  location: string;
  prefecture: string;
  date: string;
  eventDate?: string;
  month: string;
  distances: string[];
  catchCopy: string;
  imageUrl: string;
  imageGradient?: string;
  heroImageUrl?: string;
  tags: string[];
  entryUrl: string;
  officialUrl: string;
  fee: string;
  capacity: string;
  timeLimit: string;
  startPoint: string;
  goalPoint: string;
  venue?: string;
  entryPeriod?: string;
  organizer?: string;
  access?: string;
  notes?: string;
  highlights?: EventHighlight[];
  sourceInfo: SourceInfo[];
  accommodations: Accommodation[];
  localProducts: LocalProduct[];
  modelPlans: ModelPlan[];
};

export type EventProductAssignment = {
  eventId: string;
  productIds: string[];
  // 大会ごとの特産品テキスト上書き（同じ特産品でも大会によって購入場所を変えられる）
  productOverrides?: Record<string, { whereToBuy?: string }>;
};

export type UserEventLog = {
  eventType:
    | "view_event"
    | "click_event_detail"
    | "click_accommodation"
    | "click_product"
    | "click_product_external"
    | "click_official_site"
    | "search"
    | "filter";
  marathonEventId?: string;
  productId?: string;
  accommodationId?: string;
  tags?: string[];
  timestamp: string;
};

export type SearchFilter = {
  region: string;
  month: string;
  distance: string;
  tag: string;
};

export type FeaturedEventSetting = {
  eventId: string;
  isFeatured: boolean;
  displayOrder: number;
};

export type EventHighlightSetting = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  gradient?: string;
};

export type EventVisualSetting = {
  eventId: string;
  heroImageUrl: string;
  heroImageAlt: string;
  catchCopy: string;
  subtitle: string;
  officialUrl: string;
  eventDate?: string;
  highlights: EventHighlightSetting[];
};

export type ProductVisualSetting = {
  productId: string;
  imageUrl: string;
  imageAlt: string;
  shortDescription: string;
  description: string;
  externalUrl: string;
  salesLocations?: string[];
  whereToBuy?: string;
};
