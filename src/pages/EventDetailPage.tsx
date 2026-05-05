import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, MapPin, Calendar, Clock, Users,
  Banknote, Flag, Building2, FileText, Hotel,
} from 'lucide-react';
import { getEventByIdAll, allProducts } from '../data';
import { getEventVisualSetting, getEventProductAssignment } from '../utils/adminSettings';
import TagBadge from '../components/TagBadge';
import ProductCard from '../components/ProductCard';
import { trackEvent } from '../utils/analytics';
import { trackGA4 } from '../utils/ga4';

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #1e3a5f, #0d2d6b)';

const RAKUTEN_AFFILIATE_URL =
  'https://hb.afl.rakuten.co.jp/hsc/5350d40a.8d095e86.3843a301.e074fa90/?link_type=hybrid_url&ut=eyJwYWdlIjoic2hvcCIsInR5cGUiOiJoeWJyaWRfdXJsIiwiY29sIjoxLCJjYXQiOiIxMjEiLCJiYW4iOjY5Nzk2MywiYW1wIjpmYWxzZX0%3D';

const TAG_EXPERIENCE_MAP: Record<string, string> = {
  '日本海グルメ': '日本海の新鮮な海鮮料理',
  '温泉': 'レース後に行ける温泉',
  '地酒': '地元の地酒が楽しめる居酒屋',
  '城下町': '城下町の街並み散策',
  '絶景': '絶景スポット',
  '米どころ': '産地直送コシヒカリ体験',
  '佐渡': '佐渡・離島観光',
  '桜': '春の桜並木',
  '自然': '豊かな自然でリフレッシュ',
  'グルメ': '地元グルメの食べ歩き',
  '紅葉': '秋の紅葉スポット',
  '雪景色': '冬の雪景色',
};

function buildBgImage(imageUrl: string, fallbackGradient: string): string {
  const alt = imageUrl.endsWith('.png')
    ? imageUrl.replace('.png', '.jpg')
    : imageUrl.replace(/\.jpe?g$/, '.png');
  return `url("${imageUrl}"), url("${alt}"), ${fallbackGradient}`;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getPrevDay(isoDate: string): string {
  const d = new Date(isoDate);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function formatShortDate(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getUTCMonth() + 1}月${d.getUTCDate()}日`;
}

function buildRakutenSearchUrl(keyword: string, checkin?: string, checkout?: string): string {
  let url = `https://travel.rakuten.co.jp/keyword/?f_teikei=travel&f_keyword=${encodeURIComponent(keyword)}`;
  if (checkin) url += `&f_checkin=${checkin}`;
  if (checkout) url += `&f_checkout=${checkout}`;
  return url;
}

function RakutenButton({ label, className = '', onClick, href }: { label: string; className?: string; onClick?: () => void; href?: string }) {
  return (
    <a
      href={href || RAKUTEN_AFFILIATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-3 px-5 rounded-xl transition-colors ${className}`}
    >
      <ExternalLink size={15} />
      {label}
    </a>
  );
}

type StayCardProps = {
  rank: string;
  priority: string;
  area: string;
  description: string;
  experiences: string[];
  priceRange?: string;
  onRakutenClick?: () => void;
  rakutenUrl?: string;
};

function StayCard({ rank, priority, area, description, experiences, priceRange, onRakutenClick, rakutenUrl }: StayCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl flex-shrink-0">{rank}</span>
        <div>
          <div className="font-black text-navy-800 text-lg leading-tight">{priority}</div>
          <div className="text-sm text-gray-500 mt-0.5">{area}</div>
          {priceRange && (
            <div className="text-xs text-orange-600 font-medium mt-0.5">{priceRange}</div>
          )}
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed mb-4">{description}</p>
      {experiences.length > 0 && (
        <div className="mb-5 flex-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            このエリアで楽しめること
          </p>
          <ul className="space-y-1.5">
            {experiences.map((exp, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                {exp}
              </li>
            ))}
          </ul>
        </div>
      )}
      <RakutenButton label="楽天トラベルでこのエリアの宿を探す" className="w-full mt-auto" onClick={onRakutenClick} href={rakutenUrl} />
    </div>
  );
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const event = id ? getEventByIdAll(id) : undefined;
  const stayRef = useRef<HTMLElement>(null);
  const [isStayVisible, setIsStayVisible] = useState(false);

  useEffect(() => {
    if (event) {
      trackEvent({ eventType: 'view_event', marathonEventId: event.id });
      trackGA4('view_event_detail', { event_id: event.id, event_name: event.name });
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    const el = stayRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStayVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

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

  const productAssignment = getEventProductAssignment(event.id);
  const displayableProducts = (() => {
    if (productAssignment && productAssignment.productIds.length > 0) {
      return allProducts.filter(
        (p) =>
          productAssignment.productIds.includes(p.id) &&
          p.sourceInfo.every((s) => s.usageAllowed)
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
  const displayHighlights =
    visualSetting?.highlights && visualSetting.highlights.length > 0
      ? visualSetting.highlights.map((h) => ({
          title: h.title,
          description: h.description,
          imageUrl: h.imageUrl,
          gradient: h.gradient,
        }))
      : event.highlights;

  const displayOfficialUrl =
    visualSetting?.officialUrl && visualSetting.officialUrl.trim() !== ''
      ? visualSetting.officialUrl
      : event.officialUrl;

  const heroBg = event.imageGradient ?? DEFAULT_GRADIENT;

  // 前泊推奨日
  const isoDate = event.eventDate;
  const checkinDate = isoDate ? getPrevDay(isoDate) : null;
  const checkoutDate = isoDate ?? null;

  const venueKeyword = event.rakutenSearchKeyword || event.location;
  const venueRakutenUrl = buildRakutenSearchUrl(venueKeyword, checkinDate ?? undefined, checkoutDate ?? undefined);
  const rakutenSearchUrl = venueRakutenUrl;

  // 体験リスト
  const highlightTitles = (displayHighlights ?? []).map((h) => h.title);
  const tagExperiences = event.tags
    .map((t) => TAG_EXPERIENCE_MAP[t])
    .filter((e): e is string => Boolean(e));
  const allExperiences = [...new Set([...highlightTitles, ...tagExperiences])];

  // 宿泊カード
  const stayCards: StayCardProps[] = [
    {
      rank: '🥇',
      priority: '当日ラク重視',
      area: displayableAccommodations[0]?.areaName || `${event.location}・会場周辺`,
      description:
        displayableAccommodations[0]?.description ||
        '会場まで徒歩圏内のエリア。スタート前の移動ストレスをゼロにして、朝の準備に余裕を持てます。',
      experiences:
        allExperiences.slice(0, 3).length > 0
          ? allExperiences.slice(0, 3)
          : ['会場へ徒歩でアクセス', '朝の準備に余裕ができる', 'レース後もすぐ休憩できる'],
      priceRange: displayableAccommodations[0]?.priceRange,
      onRakutenClick: () => trackGA4('click_rakuten_stay_area', { event_id: event.id, rank: '1_gold' }),
      rakutenUrl: displayableAccommodations[0]?.rakutenTravelUrl || venueRakutenUrl,
    },
    {
      rank: '🥈',
      priority: '前泊バランス重視',
      area: displayableAccommodations[1]?.areaName || `${event.location}・駅周辺`,
      description:
        displayableAccommodations[1]?.description ||
        '飲食店・コンビニが充実した前泊向きエリア。前夜に地元グルメを楽しんで翌朝会場へ移動するプランに最適です。',
      experiences:
        allExperiences.slice(1, 4).length > 0
          ? allExperiences.slice(1, 4)
          : ['地元グルメの食べ歩き', '飲食店・居酒屋が豊富', '翌朝の移動も便利'],
      priceRange: displayableAccommodations[1]?.priceRange,
      onRakutenClick: () => trackGA4('click_rakuten_stay_area', { event_id: event.id, rank: '2_silver' }),
      rakutenUrl: displayableAccommodations[1]?.rakutenTravelUrl || venueRakutenUrl,
    },
    {
      rank: '🥉',
      priority: '観光も楽しむ',
      area: displayableAccommodations[2]?.areaName || `${event.prefecture || '新潟県'}・広域エリア`,
      description:
        displayableAccommodations[2]?.description ||
        '大会＋観光・温泉をセットで楽しみたい人向け。車移動や家族旅行との相性が良いエリアです。',
      experiences:
        allExperiences.slice(2, 5).length > 0
          ? allExperiences.slice(2, 5)
          : ['温泉でリカバリー', '観光スポットへのアクセス', '家族旅行にも最適'],
      priceRange: displayableAccommodations[2]?.priceRange,
      onRakutenClick: () => trackGA4('click_rakuten_stay_area', { event_id: event.id, rank: '3_bronze' }),
      rakutenUrl: displayableAccommodations[2]?.rakutenTravelUrl || venueRakutenUrl,
    },
  ];


  // 大会基本情報
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

  const entryLink = event.entryUrl && event.entryUrl !== '#'
    ? event.entryUrl
    : (displayOfficialUrl && displayOfficialUrl !== '#' ? displayOfficialUrl : null);

  return (
    <div className="pb-16">
      {/* スティッキーCTAバナー（宿泊セクションが見えていない間のみ表示） */}
      {!isStayVisible && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-3 shadow-2xl"
          style={{ background: '#1a2e5a' }}
        >
          <div className="flex items-center gap-2 text-white min-w-0">
            <Hotel size={18} className="flex-shrink-0 text-blue-300" />
            <span className="text-sm font-medium truncate">この大会の宿泊を今すぐ予約</span>
          </div>
          <button
            onClick={() => { scrollToId('stay'); trackGA4('click_sticky_banner', { event_id: event.id }); }}
            className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-2 px-4 rounded-xl transition-colors whitespace-nowrap"
          >
            予約する →
          </button>
        </div>
      )}

      {/* ① ヒーロー */}
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
              {event.modelPlans.length > 0 && (
                <button onClick={() => scrollToId('plan')} className="btn-primary">
                  参加プランを見る
                </button>
              )}
              <button
                onClick={() => scrollToId('stay')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm text-white font-semibold text-sm hover:bg-white/25 transition-colors border border-white/30"
              >
                🏨 宿泊エリアを見る
              </button>
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

        {/* ② 大会基本情報 */}
        <section className="mb-12">
          <h2 className="section-title">大会基本情報</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {allInfoItems.map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 p-5 border-b border-gray-100 last:border-b-0 md:odd:border-r"
                >
                  <span className="text-navy-500 flex-shrink-0 mt-0.5">{icon}</span>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                    <div className="text-sm font-medium text-gray-800">{value}</div>
                  </div>
                </div>
              ))}
            </div>
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
                  onClick={() => {
                    trackEvent({ eventType: 'click_official_site', marathonEventId: event.id });
                    trackGA4('click_official_site', { event_id: event.id });
                  }}
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

          {/* 前泊推奨日カード */}
          {checkinDate && checkoutDate && (
            <div
              className="mt-4 rounded-xl border-l-4 border-blue-400 p-4"
              style={{ background: '#eff6ff' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">📅</span>
                <span className="text-sm font-bold text-blue-800">
                  前泊推奨：{formatShortDate(checkinDate)} チェックイン
                </span>
              </div>
              <a
                href={rakutenSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGA4('click_rakuten_prev_night', { event_id: event.id })}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
              >
                🏨 残室・料金を確認する →
              </a>
            </div>
          )}
        </section>

        {/* ③ このレースで楽しめること */}
        {displayHighlights && displayHighlights.length > 0 && (
          <section className="mb-14">
            <h2 className="section-title">このレースで楽しめること</h2>
            <p className="text-gray-500 text-sm mb-6 -mt-3">
              走るだけじゃない、{event.location}ならではの体験。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayHighlights.map((h) => (
                <div key={h.title} className="relative rounded-2xl overflow-hidden h-48 shadow-md">
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
                    <p className="text-white/80 text-xs mt-1 leading-snug line-clamp-2">
                      {h.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ④ 参加プラン */}
        {event.modelPlans.length > 0 && (
          <section id="plan" className="mb-14 scroll-mt-20">
            <h2 className="section-title">おすすめ参加プラン</h2>
            <p className="text-gray-500 text-sm mb-6 -mt-3">
              エントリー前に当日の動きをイメージしておきましょう。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {event.modelPlans.map((plan) => (
                <div key={plan.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-navy-800 text-lg mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">
                      📅
                    </span>
                    {plan.title}
                  </h3>
                  <ol className="mb-5">
                    {plan.steps.map((step, i) => (
                      <li key={i}>
                        <div className="flex items-start gap-3 text-sm text-gray-700">
                          <span className="w-5 h-5 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {step}
                        </div>
                        {i < plan.steps.length - 1 && (
                          <div className="flex items-center gap-3 py-1">
                            <span className="w-5 flex items-center justify-center flex-shrink-0 text-gray-300 text-base leading-none">↓</span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">このプランで宿泊を探す</p>
                    <RakutenButton
                      label="楽天トラベルで宿泊エリアを探す"
                      className="w-full"
                      href={venueRakutenUrl}
                      onClick={() => trackGA4('click_rakuten_plan', { event_id: event.id, plan_title: plan.title })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ④ 宿泊セクション */}
        <section id="stay" ref={stayRef as React.RefObject<HTMLDivElement>} className="mb-8 scroll-mt-20">
          <h2 className="section-title">ランナー向けおすすめ宿泊エリア</h2>
          <p className="text-gray-500 text-sm mb-6 -mt-3">
            宿泊先が決まると参加への迷いがなくなります。目的に合わせて選んでください。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {stayCards.map((card) => (
              <StayCard key={card.rank} {...card} />
            ))}
          </div>

          <div className="bg-navy-50 border border-navy-100 rounded-2xl p-6">
            <h3 className="font-black text-navy-800 text-lg mb-5">
              {event.location}エリアの魅力
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🗺️', title: '観光', label: '観光スポットを探す', gaKey: 'kanko' },
                { icon: '🍽️', title: '地元グルメ', label: 'グルメ・飲食店を探す', gaKey: 'gourmet' },
                { icon: '📸', title: '旅の思い出', label: 'お土産・特産を探す', gaKey: 'memory' },
              ].map((item) => (
                <a
                  key={item.gaKey}
                  href={buildRakutenSearchUrl(venueKeyword)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackGA4(`click_rakuten_area_${item.gaKey}`, { event_id: event.id })}
                  className="flex flex-col items-center text-center bg-white rounded-xl p-3 md:p-4 border border-navy-100 hover:border-orange-300 hover:shadow-md transition-all group"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-bold text-navy-800 text-xs md:text-sm mb-1">{item.title}</div>
                  <div className="text-xs text-orange-500 group-hover:text-orange-600 font-medium">{item.label} →</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ⑤ エントリー誘導（宿泊後） */}
        {entryLink && (
          <div
            className="mb-12 rounded-xl border-l-4 border-green-400 p-5"
            style={{ background: '#f0fdf4' }}
          >
            <p className="text-sm font-bold text-green-800 mb-3">
              ✅ 宿泊の手配が終わったら…
            </p>
            <a
              href={entryLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent({ eventType: 'click_official_site', marathonEventId: event.id });
                trackGA4('click_entry_link', { event_id: event.id });
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:text-green-900 transition-colors"
            >
              <ExternalLink size={14} />
              大会にエントリーする →（RUNNET等）
            </a>
          </div>
        )}

        {/* ⑦ お土産・特産 */}
        {displayableProducts.length > 0 && (
          <section className="mb-14">
            <h2 className="section-title">食・特産・お土産</h2>
            <p className="text-gray-500 text-sm mb-6 -mt-3">
              帰る前に立ち寄りたい、{event.location}ならではの特産品。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayableProducts.map((product) => (
                <ProductCard key={product.id} product={product} marathonEventId={event.id} />
              ))}
            </div>
          </section>
        )}

        {/* ⑧ 注意バナー */}
        <div className="mb-12 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <p className="text-amber-800 text-sm leading-relaxed">
            大会当日は会場周辺の宿が早めに埋まる可能性があります。エントリー前後に宿泊を確認しておくと安心です。
          </p>
        </div>

        {/* ⑨ 最終CTA */}
        <section className="bg-gradient-to-r from-navy-800 to-navy-700 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-xl font-black mb-2">
            参加前に、宿泊と当日の動きも確認しておきましょう
          </h2>
          <p className="text-blue-200 text-sm mb-6">
            エントリー後は宿が埋まりやすくなります。今のうちに宿泊エリアをチェックしてください。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <RakutenButton
              label="宿泊を楽天トラベルで探す"
              className="flex-1 py-4 text-base"
              href={venueRakutenUrl}
              onClick={() => trackGA4('click_rakuten_final_cta', { event_id: event.id })}
            />
            {entryLink ? (
              <a
                href={entryLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent({ eventType: 'click_official_site', marathonEventId: event.id });
                  trackGA4('click_entry_final_cta', { event_id: event.id });
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-4 px-5 rounded-xl transition-colors text-sm"
              >
                <ExternalLink size={15} />
                エントリーする
              </a>
            ) : (
              <span className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white/40 font-bold text-sm py-4 px-5 rounded-xl border border-white/20 cursor-not-allowed">
                <ExternalLink size={15} />
                エントリーサイト（設定中）
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-5 border-t border-white/20">
            <Link
              to="/events"
              className="bg-white/10 hover:bg-white/20 rounded-xl p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-1">🏃</div>
              <div className="font-bold text-sm">他の大会を探す</div>
            </Link>
            <Link
              to={`/events?tag=${encodeURIComponent(event.tags[0] ?? '')}`}
              className="bg-white/10 hover:bg-white/20 rounded-xl p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-1">🗺️</div>
              <div className="font-bold text-sm">「{event.tags[0]}」の大会を探す</div>
            </Link>
          </div>
        </section>

        {/* 出典 */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
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
