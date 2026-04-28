import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, MapPin, Mountain, Fish, Flame, Leaf, Building2, Snowflake } from 'lucide-react';
import { getAllDisplayableEvents, ALL_TAGS } from '../data';
import { getFeaturedSettings } from '../utils/adminSettings';
import EventCard from '../components/EventCard';
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

export default function TopPage() {
  const navigate = useNavigate();
  const [searchRegion, setSearchRegion] = useState('');
  const [searchMonth, setSearchMonth] = useState('');
  const [searchDistance, setSearchDistance] = useState('');

  const events = getAllDisplayableEvents();
  const featuredSettings = getFeaturedSettings();
  const featured = featuredSettings.length > 0
    ? featuredSettings
        .filter((s) => s.isFeatured)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((s) => events.find((e) => e.id === s.eventId))
        .filter((e): e is typeof events[0] => e !== undefined)
    : events.slice(0, 3);

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
      {/* Hero */}
      <section
        className="relative min-h-[560px] flex items-center"
        style={{ background: 'linear-gradient(135deg, #0a2540 0%, #1e3a5f 50%, #1a5276 100%)' }}
      >
        {/* Decorative overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 10% 90%, rgba(255,165,0,0.4) 0%, transparent 40%), radial-gradient(circle at 90% 10%, rgba(0,150,200,0.4) 0%, transparent 40%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 py-20 text-white">
          <div className="max-w-2xl">
            <p className="text-orange-400 font-bold text-sm tracking-widest mb-4 uppercase">
              Niigata Marathon Travel
            </p>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              走る旅を、<br />新潟で。
            </h1>
            <p className="text-lg text-blue-200 mb-10 leading-relaxed">
              マラソン大会をきっかけに、宿泊・食・特産までまとめて見つけられる地域体験プラットフォーム
            </p>

            {/* Search box */}
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
                  <label className="block text-xs text-blue-200 mb-1 font-medium">距離</label>
                  <select
                    value={searchDistance}
                    onChange={(e) => setSearchDistance(e.target.value)}
                    className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  >
                    <option value="" className="text-gray-800">すべての距離</option>
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
                新潟の大会を探す
              </button>
            </div>

            {/* Featured tags */}
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

      {/* Concept */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-navy-800 mb-4">マラソンは、旅の入り口。</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            新潟の大会に出るなら、温泉も、コシヒカリも、地酒も、一緒に楽しみたい。<br />
            走ることをきっかけに、新潟の魅力をもっと深く体験しよう。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: '🏃', title: '大会を選ぶ', desc: '新潟各地のマラソン大会。コースの特徴・距離・開催時期で探せます。' },
              { icon: '🏨', title: '宿泊を見つける', desc: '会場近くのおすすめ宿泊エリア。温泉旅館から市内ホテルまで導線あり。' },
              { icon: '🍱', title: '特産を楽しむ', desc: 'コシヒカリ、のどぐろ、地酒…走り終えた後のご褒美を事前に計画。' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors">
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="font-bold text-navy-800 text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/events')}
              className="btn-primary"
            >
              新潟の大会をすべて見る
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Tag Browse */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-black text-navy-800 mb-2 text-center">
            魅力で大会を探す
          </h2>
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

      {/* Data disclaimer */}
      <section className="bg-amber-50 border-t border-amber-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-amber-800 text-sm">
            ⚠️ 本サイトの大会・宿泊・特産情報はすべて<strong>仮データ（MVP開発用）</strong>です。
            実際の情報は各公式サイトでご確認ください。
          </p>
        </div>
      </section>
    </div>
  );
}
