import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Mountain, Fish, Flame, Leaf, Building2, Snowflake } from 'lucide-react';
import { getAllDisplayableEvents, ALL_TAGS, getPublishedDisplayableProducts } from '../data';
import EntryAlertSection from '../components/EntryAlertSection';
import { getFeaturedSettings, getEventEntryDates, isEntryFinished } from '../utils/adminSettings';
import EventCard from '../components/EventCard';
import ProductCard from '../components/ProductCard';
import AutoScrollCarousel from '../components/AutoScrollCarousel';
import { trackEvent } from '../utils/analytics';

const TAG_ICONS: Record<string, React.ReactNode> = {
  '日本海グルメ': <Fish size={16} />,
  '温泉': <Flame size={16} />,
  '地酒': <span className="text-sm">🍶</span>,
  '米どころ': <Leaf size={16} />,
  '城下町': <Building2 size={16} />,
  '紅葉': <span className="text-sm">🍂</span>,
  '雪景色': <Snowflake size={16} />,
  '佐渡': <span className="text-sm">🏝️</span>,
  '絶景': <Mountain size={16} />,
};

const FEATURED_TAGS = ['日本海グルメ', '温泉', '地酒', '米どころ', '城下町', '紅葉', '雪景色', '佐渡'];

const CONCEPT_STEPS = [
  {
    step: '01',
    icon: '🏃',
    title: '大会を選ぶ',
    desc: <>距離・コース・時期から<br className="md:hidden" />大会を探せます。</>,
    badgeClass: 'from-blue-600 to-blue-900',
  },
  {
    step: '02',
    icon: '🏨',
    title: '宿泊を決める',
    desc: '会場近くの旅館・ホテルをまとめて確認。',
    badgeClass: 'from-teal-500 to-green-800',
  },
  {
    step: '03',
    icon: '🍱',
    title: '旅を楽しむ',
    desc: <>レース後の楽しみも<br className="md:hidden" />計画しよう。</>,
    badgeClass: 'from-amber-500 to-orange-700',
  },
];

export default function TopPage() {
  const navigate = useNavigate();
  const [searchRegion, setSearchRegion] = useState('');
  const [searchMonth, setSearchMonth] = useState('');
  const [searchDistance, setSearchDistance] = useState('');
  const events = getAllDisplayableEvents();

  // おすすめ大会のデフォルト（コード固定）
  // 将来: バックエンド導入後は管理画面の設定をDBから取得してここを上書きする
  const DEFAULT_FEATURED_IDS = [
    'takada-castle-road-race',
    'minamiuonuma-gourmet-marathon',
    'sado-toki-marathon',
  ];

  const featuredSettings = getFeaturedSettings();
  const adminFeatured = featuredSettings.filter((s) => s.isFeatured);

  // エントリー受付中のイベントを自動で注目に追加
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const entryOpenIds = getEventEntryDates()
    .filter((entry) => {
      if (!entry.entryStartDate) return false;
      const start = new Date(entry.entryStartDate);
      const end = entry.entryEndDate ? new Date(entry.entryEndDate) : null;
      return start <= today && (end === null || end >= today);
    })
    .map((entry) => entry.eventId);

  const featuredIds = adminFeatured.length > 0
    ? [...new Set([
        ...adminFeatured.sort((a, b) => a.displayOrder - b.displayOrder).map((s) => s.eventId),
        ...entryOpenIds,
      ])]
    : [...new Set([...DEFAULT_FEATURED_IDS, ...entryOpenIds])];

  const featured = featuredIds
    .map((id) => events.find((e) => e.id === id))
    .filter((e): e is typeof events[0] => e !== undefined)
    .filter((e) => !isEntryFinished(e.id))
    .slice(0, 10);

  // 公開済み特産品をシャッフル（ページロード時に1回固定）
  const publishedProducts = useMemo(() => {
    const products = getPublishedDisplayableProducts();
    for (let i = products.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [products[i], products[j]] = [products[j], products[i]];
    }
    return products;
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchRegion) params.set('region', searchRegion);
    if (searchMonth) params.set('month', searchMonth);
    if (searchDistance) params.set('distance', searchDistance);
    trackEvent({ eventType: 'search', tags: [searchRegion, searchMonth, searchDistance].filter(Boolean) });
    navigate(`/events?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    trackEvent({ eventType: 'filter', tags: [tag] });
    navigate(`/events?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <div>
      <Helmet>
        <title>新潟マラソンナビ | 走る旅で、新潟をもっと好きになる。</title>
        <meta name="description" content="新潟のマラソン大会情報と旅の楽しみ方を一緒にお届け。宿泊・グルメ・観光スポットまで、ランナーのための旅ガイドです。" />
        <meta property="og:title" content="新潟マラソンナビ | 走る旅で、新潟をもっと好きになる。" />
        <meta property="og:description" content="新潟のマラソン大会情報と旅の楽しみ方を一緒にお届け。宿泊・グルメ・観光スポットまで、ランナーのための旅ガイドです。" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://marathon-navi.com" />
        <meta property="og:image" content="https://marathon-navi.com/images/ogp.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://marathon-navi.com/images/ogp.png" />
      </Helmet>
      {/* ヒーロー */}
      <section
        className="relative min-h-[540px] flex items-center"
        style={{ background: 'linear-gradient(135deg, #0b1d51 0%, #1e5fa8 55%, #f97316 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 100%, rgba(249,115,22,0.5) 0%, transparent 45%), radial-gradient(circle at 10% 20%, rgba(14,165,233,0.4) 0%, transparent 40%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 py-20 text-white">
          <div className="max-w-2xl">
            <p className="text-amber-400 font-bold text-sm tracking-widest mb-4 uppercase">
              Niigata Marathon Navi
            </p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">
              走る旅で、<br />新潟をもっと<br />好きになる。
            </h1>
            <p className="text-lg text-blue-200 mb-10 leading-relaxed">
              マラソン大会をきっかけに、<br className="md:hidden" />宿泊・食・観光まで<br className="hidden md:block" />まとめて見つけられる<br className="md:hidden" />地域体験プラットフォーム
            </p>

            {/* 検索UI */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-xs text-blue-200 mb-1 font-medium">地域</label>
                  <select
                    value={searchRegion}
                    onChange={(e) => setSearchRegion(e.target.value)}
                    className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  >
                    <option value="" className="text-gray-800">すべての地域</option>
                    <option value="新潟市" className="text-gray-800">新潟市</option>
                    <option value="南魚沼市" className="text-gray-800">南魚沼市</option>
                    <option value="佐渡市" className="text-gray-800">佐渡市</option>
                    <option value="上越市" className="text-gray-800">上越市</option>
                    <option value="村上市" className="text-gray-800">村上市</option>
                    <option value="魚沼市" className="text-gray-800">魚沼市</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-blue-200 mb-1 font-medium">開催月</label>
                  <select
                    value={searchMonth}
                    onChange={(e) => setSearchMonth(e.target.value)}
                    className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  >
                    <option value="" className="text-gray-800">すべての月</option>
                    {['4', '5', '6', '9', '10', '11'].map((m) => (
                      <option key={m} value={m} className="text-gray-800">{m}月</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-blue-200 mb-1 font-medium">種目</label>
                  <select
                    value={searchDistance}
                    onChange={(e) => setSearchDistance(e.target.value)}
                    className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  >
                    <option value="" className="text-gray-800">すべての種目</option>
                    <option value="フルマラソン" className="text-gray-800">フルマラソン</option>
                    <option value="ハーフマラソン" className="text-gray-800">ハーフマラソン</option>
                    <option value="10km" className="text-gray-800">10km</option>
                    <option value="5km" className="text-gray-800">5km以下</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Search size={18} />
                大会から旅を探す
              </button>
            </div>

            {/* タグ */}
            <div className="flex flex-wrap gap-2">
              {FEATURED_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                >
                  {TAG_ICONS[tag]}
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* コンセプト */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-amber-600 font-bold text-xs tracking-widest mb-3 uppercase">How It Works</p>
          <h2 className="text-3xl font-black text-navy-800 mb-4">マラソンは、旅の入り口。</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-14">
            新潟の大会に出るなら、<br className="md:hidden" />温泉も、コシヒカリも、地酒も、一緒に楽しみたい。<br />
            走ることをきっかけに、<br className="md:hidden" />新潟の魅力をもっと深く体験しよう。
          </p>

          <div className="grid grid-cols-3 gap-3 md:gap-8">
            {CONCEPT_STEPS.map(({ step, icon, title, desc, badgeClass }) => (
              <div key={title} className="text-center p-3 md:p-8 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors">
                <div
                  className={`inline-flex items-center justify-center w-7 h-7 md:w-11 md:h-11 rounded-full bg-gradient-to-br ${badgeClass} text-white font-black text-xs md:text-sm mb-2 md:mb-3`}
                >
                  {step}
                </div>
                <div className="text-3xl md:text-5xl mb-2 md:mb-3">{icon}</div>
                <h3 className="font-bold text-navy-800 text-xs md:text-xl mb-1 md:mb-2 leading-tight">{title}</h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-3 md:line-clamp-none">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* エントリーアラート */}
      <EntryAlertSection events={events} />

      {/* 注目の大会 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-navy-800">注目の大会</h2>
              <p className="text-gray-500 text-sm mt-1">新潟を走る旅の出発点として人気の大会</p>
            </div>
            <button
              onClick={() => navigate('/events')}
              className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-bold text-sm transition-colors"
            >
              すべて見る <ChevronRight size={16} />
            </button>
          </div>

          <AutoScrollCarousel
            items={featured.map((event) => (
              <EventCard key={event.id} event={event} source="featured" />
            ))}
            pcVisible={3}
            interval={4500}
          />

          <div className="text-center mt-10">
            <button onClick={() => navigate('/events')} className="btn-primary">
              新潟の大会をすべて見る
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 地元の特産品 */}
      {publishedProducts.length > 0 && (
        <section className="bg-white py-16 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <h2 className="text-2xl font-black text-navy-800 mb-1">地元の特産品</h2>
            <p className="text-gray-500 text-sm">走った後に出会いたい、新潟の美味しいもの</p>
          </div>
          <div className="overflow-hidden">
            <div
              className="marquee-track flex gap-4"
              style={{ width: `${publishedProducts.length * 2 * 220}px` }}
            >
              {[...publishedProducts, ...publishedProducts].map((product, i) => (
                <div key={i} className="w-52 flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ⑤ タグで探す */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-black text-navy-800 mb-2 text-center">魅力で大会を探す</h2>
          <p className="text-gray-500 text-sm text-center mb-8">気になる体験テーマから新潟の大会を見つけよう</p>
          <div className="flex flex-wrap justify-center gap-3">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-navy-400 hover:bg-navy-50 text-gray-700 hover:text-navy-800 font-medium px-4 py-2 rounded-xl transition-all text-sm"
              >
                {TAG_ICONS[tag] && <span>{TAG_ICONS[tag]}</span>}
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
