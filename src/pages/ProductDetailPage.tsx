import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MapPin, ShoppingBag, Star, Store } from 'lucide-react';
import { getProductById, getEventById } from '../data';
import { getProductVisualSetting } from '../utils/adminSettings';
import GradientImage from '../components/GradientImage';
import { trackEvent } from '../utils/analytics';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const baseProduct = id ? getProductById(id) : undefined;
  const visualSetting = id ? getProductVisualSetting(id) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
    whereToBuy: visualSetting?.whereToBuy || baseProduct.whereToBuy,
    salesLocations:
      visualSetting?.salesLocations && visualSetting.salesLocations.length > 0
        ? visualSetting.salesLocations
        : baseProduct.salesLocations,
  };

  const relatedEvents = product.relatedEventIds
    .map((eid) => getEventById(eid))
    .filter(Boolean);

  const handleExternalClick = () => {
    trackEvent({ eventType: 'click_product_external', productId: product.id });
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
        <GradientImage
          gradient={baseProduct.imageGradient}
          name={product.name}
          height="h-64"
        />
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <MapPin size={14} />
            {product.area}
          </div>
          <h1 className="text-3xl font-black text-navy-800 mb-3">{product.name}</h1>
          <p className="text-gray-600 text-lg leading-relaxed">{product.shortDescription}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2 space-y-8">
          {/* Description */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-navy-800 text-lg mb-4 flex items-center gap-2">
              <span className="text-orange-500">📖</span> この特産について
            </h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </section>

          {/* Recommended point */}
          <section className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <h2 className="font-bold text-orange-800 text-lg mb-3 flex items-center gap-2">
              <Star size={18} className="text-orange-500 fill-orange-500" />
              マラソンとの相性
            </h2>
            <p className="text-orange-900 leading-relaxed">{product.recommendedPoint}</p>
          </section>

          {/* Sales locations (array) */}
          {product.salesLocations && product.salesLocations.length > 0 ? (
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
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* External link */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-navy-800 mb-4">外部リンク</h3>
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
                  公式サイト・購入先を見る
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

          {/* Related events */}
          {relatedEvents.length > 0 && (
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
    </div>
  );
}
