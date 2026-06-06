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
  label?: string;
  areaName: string;
  distanceToVenue: string;
  description: string;
  priceRange: string;
  externalUrl: string;
  rakutenTravelUrl?: string;
  experiences?: string[];
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
  rakutenUrl?: string;
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
  rakutenSearchKeyword?: string;
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
  draft?: boolean;
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
  hideImageNote?: boolean;
  imagePosition?: string;
  imageSize?: string;
};

export type EventVisualSetting = {
  eventId: string;
  heroImageUrl: string;
  heroImageAlt: string;
  catchCopy: string;
  subtitle: string;
  officialUrl: string;
  eventDate?: string;
  prevNightRakutenUrl?: string;
  areaRakutenUrl?: string;
  areaKankoUrl?: string;
  areaGourmetUrl?: string;
  areaMemoryUrl?: string;
  highlights: EventHighlightSetting[];
  hiddenSections?: string[];
  hideHeroImageNote?: boolean;
  heroImagePosition?: string;
  heroImageSize?: string;
};

export type ProductShop = {
  name: string;
  address?: string;
  hours?: string;
  closedDays?: string;
  description?: string;
  mapUrl?: string;
  mapEmbedUrl?: string;
};

export type GalleryImage = {
  url: string;
  position?: string;
  size?: string;
};

export type ProductVisualSetting = {
  productId: string;
  imageUrl: string;        // ヒーロー画像
  imageAlt: string;
  imagePosition?: string;  // ヒーロー表示位置
  imageSize?: string;      // ヒーローズーム
  cardImageUrl?: string;   // カード画像（未設定時はヒーロー画像）
  cardImagePosition?: string;
  cardImageSize?: string;
  shortDescription: string;
  description: string;
  externalUrl: string;
  salesLocations?: string[];
  whereToBuy?: string;
  images?: GalleryImage[];
  shops?: ProductShop[];
  shopMessage?: string;
  hiddenSections?: string[];
  hideImageNote?: boolean;
};
