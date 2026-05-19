import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MapPin, ShoppingBag, Store, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductById, getEventByIdAll } from '../data';
import { getProductVisualSetting, getEventProductAssignment } from '../utils/adminSettings';
import GradientImage from '../components/GradientImage';
import { trackEvent } from '../utils/analytics';
import { trackGA4 } from '../utils/ga4';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromEventId = (location.state as { fromEventId?: string } | null)?.fromEventId;
  const baseProduct = id ? getProductById(id) : undefined;
  const visualSetting = id ? getProductVisualSetting(id) : undefined;
  const eventOverrideWhereToBuy =
    fromEventId && id
      ? getEventProductAssignment(fromEventId)?.productOverrides?.[id]?.whereToBuy
      : undefined;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex]);

  if (!baseProduct) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-xl font-bold text-gray-600 mb-4">特産品が見つかりませんでした</p>
        <button onClick={() => navigate(-1)} className="btn-primary">
          戻る
        </button>
      </div>
    );
  }

  // ビジュアル設定がある場合は上書き
  const product = {
    ...baseProduct,
    imageUrl: visualSetting?.imageUrl || baseProduct.imageUrl,
    shortDescription: visualSetting?.shortDescription || baseProduct.shortDescription,
    description: visualSetting?.description || baseProduct.description,
    externalUrl: visualSetting?.externalUrl || baseProduct.externalUrl,
    whereToBuy: eventOverrideWhereToBuy || visualSetting?.whereToBuy || baseProduct.whereToBuy,
    salesLocations:
      visualSetting?.salesLocations && visualSetting.salesLocations.length > 0
        ? visualSetting.salesLocations
        : baseProduct.salesLocations,
  };
  const rawImages: unknown[] = (visualSetting?.images as unknown as unknown[] | undefined) ?? [];
  const galleryImages = rawImages.length > 0
    ? rawImages.map((item) => typeof item === 'string' ? { url: item as string } : item as import('../types').GalleryImage)
    : [];
  const shops = visualSetting?.shops ?? [];
  const shopMessage = visualSetting?.shopMessage ?? '';
  const hiddenSections = visualSetting?.hiddenSections ?? [];

  const relatedEvents = product.relatedEventIds
    .map((eid) => getEventByIdAll(eid))
    .filter(Boolean);

  const handleExternalClick = () => {
    trackEvent({ eventType: 'click_product_external', productId: product.id });
    trackGA4('click_product_external', { product_id: product.id, product_name: product.name, event_id: fromEventId });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> 戻る
      </button>

      {/* Hero */}
      <div className="card mb-8 overflow-hidden">
        <div className="relative">
          {product.imageUrl ? (
            <div
              className="h-64 bg-no-repeat"
              style={{
                backgroundImage: `url("${product.imageUrl}")`,
                backgroundSize: visualSetting?.imageSize || 'cover',
                backgroundPosition: visualSetting?.imagePosition || 'center',
              }}
            />
          ) : (
            <GradientImage
              gradient={baseProduct.imageGradient}
              name={product.name}
              height="h-64"
            />
          )}
          {!visualSetting?.hideImageNote && (
            <div className="absolute top-3 right-3 z-10">
              <span className="text-xs text-white/60 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                ※ 画像はイメージです
              </span>
            </div>
          )}
        </div>
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <MapPin size={14} />
            {product.area}
          </div>
          <h1 className="text-3xl font-black text-navy-800 mb-3">{product.name}</h1>
          <p className="text-gray-600 text-lg leading-relaxed">{product.shortDescription}</p>
        </div>
      </div>

      {/* 横スクロール画像ギャラリー */}
      {!hiddenSections.includes('gallery') && galleryImages.length > 0 && (
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="flex-shrink-0 w-56 h-40 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-100 bg-no-repeat cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  backgroundImage: `url("${img.url}")`,
                  backgroundSize: img.size || 'cover',
                  backgroundPosition: img.position || 'center',
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2 space-y-8">

          {/* Description */}
          {!hiddenSections.includes('description') && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-navy-800 text-lg mb-4 flex items-center gap-2">
                <span className="text-orange-500">📖</span> この特産について
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </section>
          )}

          {/* Sales locations */}
          {!hiddenSections.includes('salesLocations') && (
            product.salesLocations && product.salesLocations.length > 0 ? (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-navy-800 text-lg mb-4 flex items-center gap-2">
                  <Store size={18} className="text-navy-500" /> 購入できる場所
                </h2>
                <ul className="space-y-2">
                  {product.salesLocations.map((loc, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                      <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                      {loc}
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-navy-800 text-lg mb-4 flex items-center gap-2">
                  <ShoppingBag size={18} className="text-navy-500" /> どこで買えるか
                </h2>
                <p className="text-gray-700 leading-relaxed">{product.whereToBuy}</p>
              </section>
            )
          )}

          {/* お店からの一言 */}
          {!hiddenSections.includes('shopMessage') && shopMessage && (
            <section className="bg-orange-50 rounded-2xl border border-orange-100 p-6">
              <h2 className="font-bold text-navy-800 text-lg mb-3 flex items-center gap-2">
                <span className="text-orange-500">💬</span> お店からの一言
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{shopMessage}</p>
            </section>
          )}

          {/* お店情報・地図 */}
          {!hiddenSections.includes('shops') && shops.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-navy-800 text-lg mb-5 flex items-center gap-2">
                <span className="text-orange-500">🏪</span> お店で買う
              </h2>
              <div className="space-y-8">
                {shops.map((shop, i) => (
                  <div key={i} className={i < shops.length - 1 ? 'pb-8 border-b border-gray-100' : ''}>
                    <h3 className="font-bold text-navy-800 text-base mb-2">{shop.name}</h3>
                    {shop.address && (
                      <p className="flex items-start gap-1.5 text-sm text-gray-500 mb-1">
                        <MapPin size={13} className="flex-shrink-0 mt-0.5" /> {shop.address}
                      </p>
                    )}
                    {shop.hours && (
                      <p className="text-sm text-gray-500 mb-1">🕐 {shop.hours}</p>
                    )}
                    {shop.description && (
                      <p className="text-sm text-gray-700 mt-2 mb-3 leading-relaxed">{shop.description}</p>
                    )}
                    {shop.mapEmbedUrl && (
                      <div className="rounded-xl overflow-hidden mb-3 border border-gray-100">
                        <iframe
                          src={shop.mapEmbedUrl}
                          width="100%"
                          height="220"
                          style={{ border: 0, display: 'block' }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={shop.name}
                        />
                      </div>
                    )}
                    {shop.mapUrl && (
                      <a
                        href={shop.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-navy-600 hover:text-navy-800 font-medium transition-colors"
                      >
                        <MapPin size={13} /> Google Mapsで見る →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* External link */}
          {!hiddenSections.includes('externalLink') && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-navy-800 mb-4">公式サイト</h3>
              <div className="space-y-3">
                {product.externalUrl && product.externalUrl !== '#' ? (
                  <a
                    href={product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleExternalClick}
                    className="flex items-center gap-2 w-full bg-navy-700 hover:bg-navy-800 text-white text-sm font-bold py-3 px-4 rounded-xl transition-colors"
                  >
                    <ExternalLink size={15} />
                    公式サイトを見る
                  </a>
                ) : (
                  <span className="flex items-center gap-2 w-full bg-gray-100 text-gray-400 text-sm font-bold py-3 px-4 rounded-xl cursor-not-allowed">
                    <ExternalLink size={15} />
                    公式サイト（設定中）
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                ※ 外部リンクは参考です。購入は公式サイトや現地でご確認ください。
              </p>
            </div>
          )}

          {/* Related events */}
          {!hiddenSections.includes('relatedEvents') && relatedEvents.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-navy-800 mb-4">関連する大会</h3>
              <div className="space-y-3">
                {relatedEvents.map((event) => event && (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="block rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="h-16 relative" style={{ background: event.imageGradient }}>
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold px-3 text-center group-hover:opacity-90">
                        {event.name}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-t-0 border-gray-200 rounded-b-xl">
                      <div className="text-xs text-gray-500">{event.location} · {event.date}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Source info */}
      <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-500 font-medium mb-2">出典・利用規約確認状況</p>
        {baseProduct.sourceInfo.map((s, i) => (
          <div key={i} className="text-xs text-gray-500">
            <span className="font-medium">{s.sourceName}</span>
            {' — '}ソース種別: {s.sourceType}
            {' — '}利用可否: {s.usageAllowed ? '✅ 利用可' : '❌ 利用不可'}
            {' — '}{s.usageNote}
          </div>
        ))}
      </div>

      {/* ライトボックス */}
      {lightboxIndex !== null && galleryImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={28} />
          </button>
          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
            >
              <ChevronLeft size={36} />
            </button>
          )}
          {lightboxIndex < galleryImages.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
            >
              <ChevronRight size={36} />
            </button>
          )}
          <img
            src={galleryImages[lightboxIndex].url}
            alt={`${product.name} ${lightboxIndex + 1}`}
            className="max-w-[92vw] max-h-[88vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 text-white/50 text-sm">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
