import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MapPin, Calendar, Clock, Users, Banknote, Flag, ChevronRight, Building2, FileText } from 'lucide-react';
import { getEventByIdAll, allProducts } from '../data';
import { getEventVisualSetting, getEventProductAssignment } from '../utils/adminSettings';
import TagBadge from '../components/TagBadge';
import ProductCard from '../components/ProductCard';
import AccommodationCard from '../components/AccommodationCard';
import { trackEvent } from '../utils/analytics';

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #1e3a5f, #0d2d6b)';

function buildBgImage(imageUrl: string, fallbackGradient: string): string {
  const alt = imageUrl.endsWith('.png')
    ? imageUrl.replace('.png', '.jpg')
    : imageUrl.replace(/\.jpe?g$/, '.png');
  return `url("${imageUrl}"), url("${alt}"), ${fallbackGradient}`;
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const event = id ? getEventByIdAll(id) : undefined;

  useEffect(() => {
    if (event) {
      trackEvent({ eventType: 'view_event', marathonEventId: event.id });
      window.scrollTo(0, 0);
    }
  }, [event]);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-xl font-bold text-gray-600 mb-4">大会が見つかりませんでした</p>
        <button onClick={() => navigate('/events')} className="btn-primary">
          大会一覧に戻る
        </button>
      </div>
    );
  }

  // 管理画面で割り当てた特産品を優先、なければ大会データの特産品を使用
  const productAssignment = getEventProductAssignment(event.id);
  const displayableProducts = (() => {
    if (productAssignment && productAssignment.productIds.length > 0) {
      return allProducts.filter(
        (p) => productAssignment.productIds.includes(p.id) && p.sourceInfo.every((s) => s.usageAllowed)
      );
    }
    return event.localProducts.filter((p) => p.sourceInfo.every((s) => s.usageAllowed));
  })();

  const displayableAccommodations = event.accommodations.filter((a) =>
    a.sourceInfo.every((s) => s.usageAllowed)
  );

  const visualSetting = getEventVisualSetting(event.id);
  const displayCatchCopy = visualSetting?.catchCopy || event.catchCopy;
  const displayHeroImageUrl = visualSetting?.heroImageUrl || event.heroImageUrl;
  const displayHighlights = (visualSetting?.highlights && visualSetting.highlights.length > 0)
    ? visualSetting.highlights.map((h) => ({
        title: h.title,
        description: h.description,
        imageUrl: h.imageUrl,
        gradient: h.gradient,
      }))
    : event.highlights;

  // 管理画面で設定したofficialUrlを優先
  const displayOfficialUrl =
    (visualSetting?.officialUrl && visualSetting.officialUrl.trim() !== '')
      ? visualSetting.officialUrl
      : event.officialUrl;

  const heroBg = event.imageGradient ?? DEFAULT_GRADIENT;

  type InfoItem = { icon: React.ReactNode; label: string; value: string };

  const allInfoItems: InfoItem[] = [
    { icon: <Flag size={16} />, label: '距離', value: event.distances.join(' / ') || '確認中' },
    { icon: <Calendar size={16} />, label: '開催日', value: event.date || '確認中' },
    { icon: <Clock size={16} />, label: '制限時間', value: event.timeLimit || '確認中' },
    { icon: <Banknote size={16} />, label: '参加費', value: event.fee || '確認中' },
    { icon: <MapPin size={16} />, label: 'スタート', value: event.startPoint || '確認中' },
    { icon: <MapPin size={16} />, label: 'ゴール', value: event.goalPoint || '確認中' },
    { icon: <Users size={16} />, label: '定員', value: event.capacity || '確認中' },
  ];
  if (event.venue) allInfoItems.push({ icon: <Building2 size={16} />, label: '会場', value: event.venue });
  if (event.entryPeriod) allInfoItems.push({ icon: <Calendar size={16} />, label: '申込期間', value: event.entryPeriod });
  if (event.organizer) allInfoItems.push({ icon: <Users size={16} />, label: '主催者', value: event.organizer });
  if (event.access) allInfoItems.push({ icon: <MapPin size={16} />, label: 'アクセス', value: event.access });

  return (
    <div>
      {/* Hero — full screen */}
      <div className="relative min-h-[85vh] flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: displayHeroImageUrl
              ? buildBgImage(displayHeroImageUrl, heroBg)
              : heroBg,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/85 md:hidden" />
        <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black/85 via-black/50 to-black/10" />

        <div className="absolute top-4 right-4 z-20">
          <span className="text-xs text-white/60 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
            ※ 画像はイメージです
          </span>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 pb-16 pt-24">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={14} />
            大会一覧に戻る
          </button>

          <div className="max-w-2xl">
            <p className="italic text-orange-400 text-lg md:text-xl font-medium mb-3 leading-snug">
              {displayCatchCopy}
            </p>
            {visualSetting?.subtitle && (
              <p className="text-blue-200 text-base mb-2 leading-snug">{visualSetting.subtitle}</p>
            )}

            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {event.name}
            </h1>

            <div className="flex flex-wrap gap-2 mb-7">
              <span className="flex items-center gap-1.5 text-sm bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">
                <MapPin size={13} /> {event.location}
              </span>
              <span className="flex items-center gap-1.5 text-sm bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">
                <Calendar size={13} /> {event.date}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mb-7">
              {displayOfficialUrl && displayOfficialUrl !== '#' ? (
                <a
                  href={displayOfficialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent({ eventType: 'click_official_site', marathonEventId: event.id })}
                  className="btn-primary"
                >
                  <ExternalLink size={16} />
                  公式サイトを見る
                </a>
              ) : (
                <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white/50 font-semibold text-sm border border-white/20 cursor-not-allowed">
                  <ExternalLink size={16} />
                  公式サイト（設定中）
                </span>
              )}
              {displayableAccommodations.length > 0 && (
                <a
                  href="#accommodations"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm text-white font-semibold text-sm hover:bg-white/25 transition-colors border border-white/30"
                >
                  宿泊候補を見る
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} size="sm" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Highlights */}
        {displayHighlights && displayHighlights.length > 0 && (
          <section className="mb-14">
            <h2 className="section-title">この大会で楽しめること</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayHighlights.map((h) => (
                <div
                  key={h.title}
                  className="relative rounded-2xl overflow-hidden h-48 shadow-md"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: h.imageUrl
                        ? buildBgImage(h.imageUrl, h.gradient || DEFAULT_GRADIENT)
                        : h.gradient || DEFAULT_GRADIENT,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-bold text-sm leading-tight">{h.title}</p>
                    <p className="text-white/80 text-xs mt-1 leading-snug line-clamp-2">{h.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Basic Info */}
        <section className="mb-12">
          <h2 className="section-title">大会基本情報</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {allInfoItems.map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-5 border-b border-gray-100 last:border-b-0 md:odd:border-r">
                  <span className="text-navy-500 flex-shrink-0 mt-0.5">{icon}</span>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                    <div className="text-sm font-medium text-gray-800">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 備考 */}
            {event.notes && (
              <div className="flex items-start gap-3 p-5 border-t border-gray-100 bg-amber-50">
                <FileText size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-amber-700 mb-0.5">備考</div>
                  <div className="text-sm text-amber-900">{event.notes}</div>
                </div>
              </div>
            )}

            <div className="p-5 border-t border-gray-100 bg-gray-50">
              {displayOfficialUrl && displayOfficialUrl !== '#' ? (
                <a
                  href={displayOfficialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent({ eventType: 'click_official_site', marathonEventId: event.id })}
                  className="flex items-center gap-2 text-sm text-navy-700 hover:text-navy-900 font-medium transition-colors"
                >
                  <ExternalLink size={14} />
                  公式サイトで最新情報を確認する
                </a>
              ) : (
                <span className="flex items-center gap-2 text-sm text-gray-400">
                  <ExternalLink size={14} />
                  公式サイトURL（管理画面から設定できます）
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3 mt-3">
            ⚠️ 上記は仮データです。参加費・定員・日程などの正確な情報は必ず公式サイトでご確認ください。
          </p>
        </section>

        {/* Accommodations */}
        {displayableAccommodations.length > 0 && (
          <section id="accommodations" className="mb-12">
            <h2 className="section-title">宿泊おすすめエリア</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayableAccommodations.map((acc) => (
                <AccommodationCard
                  key={acc.id}
                  accommodation={acc}
                  marathonEventId={event.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* Local Products */}
        {displayableProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="section-title">食・特産・お土産</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayableProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  marathonEventId={event.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* Model Plans */}
        {event.modelPlans.length > 0 && (
          <section className="mb-12">
            <h2 className="section-title">モデルプラン</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {event.modelPlans.map((plan) => (
                <div key={plan.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-navy-800 text-lg mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">📅</span>
                    {plan.title}
                  </h3>
                  <ol className="space-y-3">
                    {plan.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Re-engagement */}
        <section className="bg-gradient-to-r from-navy-800 to-navy-700 rounded-2xl p-8 text-white">
          <h2 className="text-xl font-black mb-6">来年も走りたい、新潟をもっと知りたい</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/events" className="bg-white/10 hover:bg-white/20 rounded-xl p-4 text-center transition-colors">
              <div className="text-3xl mb-2">🏃</div>
              <div className="font-bold text-sm">この地域の他の大会</div>
            </Link>
            <Link to={`/events?tag=${encodeURIComponent(event.tags[0] ?? '')}`} className="bg-white/10 hover:bg-white/20 rounded-xl p-4 text-center transition-colors">
              <div className="text-3xl mb-2">🗺️</div>
              <div className="font-bold text-sm">「{event.tags[0]}」の大会を探す</div>
            </Link>
            <Link to="/events" className="bg-orange-500 hover:bg-orange-600 rounded-xl p-4 text-center transition-colors">
              <div className="text-3xl mb-2">🔍</div>
              <div className="font-bold text-sm">
                大会一覧に戻る
                <ChevronRight size={14} className="inline ml-1" />
              </div>
            </Link>
          </div>
        </section>

        {/* Source info */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium mb-2">出典・利用規約確認状況</p>
          {event.sourceInfo.map((s, i) => (
            <div key={i} className="text-xs text-gray-500">
              <span className="font-medium">{s.sourceName}</span> — {s.usageNote}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
