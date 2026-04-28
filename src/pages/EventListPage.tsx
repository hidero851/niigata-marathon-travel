import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { getAllDisplayableEvents, ALL_TAGS, ALL_REGIONS } from '../data';
import EventCard from '../components/EventCard';
import TagBadge from '../components/TagBadge';
import { trackEvent } from '../utils/analytics';

const MONTH_LABELS: Record<string, string> = {
  '4': '4月', '5': '5月', '6': '6月', '9': '9月', '10': '10月', '11': '11月',
};

const DISTANCE_OPTIONS = ['フルマラソン', 'ハーフマラソン', '10km', '5km', '3km'];

export default function EventListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const regionParam = searchParams.get('region') ?? '';
  const monthParam = searchParams.get('month') ?? '';
  const distanceParam = searchParams.get('distance') ?? '';
  const tagParam = searchParams.get('tag') ?? '';

  const [region, setRegion] = useState(regionParam);
  const [month, setMonth] = useState(monthParam);
  const [distance, setDistance] = useState(distanceParam);
  const [selectedTag, setSelectedTag] = useState(tagParam);

  const allEvents = getAllDisplayableEvents();

  const filtered = useMemo(() => {
    return allEvents.filter((e) => {
      if (region && e.location !== region) return false;
      if (month && e.month !== month) return false;
      if (distance && !e.distances.some((d) => d.includes(distance))) return false;
      if (selectedTag && !e.tags.includes(selectedTag)) return false;
      return true;
    });
  }, [allEvents, region, month, distance, selectedTag]);

  const applyFilter = (key: string, value: string) => {
    trackEvent({ eventType: 'filter', tags: [value] });
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const clearAll = () => {
    setRegion(''); setMonth(''); setDistance(''); setSelectedTag('');
    setSearchParams({});
  };

  const hasFilters = region || month || distance || selectedTag;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-navy-800 mb-2">新潟のマラソン大会</h1>
        <p className="text-gray-600">大会名だけでなく、地域の魅力で選ぼう</p>
      </div>

      {/* Filter toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-gray-300 hover:border-navy-400 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <SlidersHorizontal size={15} />
            絞り込み
          </button>
          {hasFilters && (
            <button onClick={clearAll} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
              <X size={13} /> すべてクリア
            </button>
          )}
        </div>
        <span className="text-sm text-gray-500">{filtered.length}件の大会</span>
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {region && (
            <span className="flex items-center gap-1 bg-navy-100 text-navy-800 text-xs px-3 py-1 rounded-full">
              地域: {region}
              <button onClick={() => { setRegion(''); applyFilter('region', ''); }}><X size={11} /></button>
            </span>
          )}
          {month && (
            <span className="flex items-center gap-1 bg-navy-100 text-navy-800 text-xs px-3 py-1 rounded-full">
              {MONTH_LABELS[month]}
              <button onClick={() => { setMonth(''); applyFilter('month', ''); }}><X size={11} /></button>
            </span>
          )}
          {distance && (
            <span className="flex items-center gap-1 bg-navy-100 text-navy-800 text-xs px-3 py-1 rounded-full">
              {distance}
              <button onClick={() => { setDistance(''); applyFilter('distance', ''); }}><X size={11} /></button>
            </span>
          )}
          {selectedTag && (
            <TagBadge tag={selectedTag} />
          )}
        </div>
      )}

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">地域</label>
            <select
              value={region}
              onChange={(e) => { setRegion(e.target.value); applyFilter('region', e.target.value); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy-500"
            >
              <option value="">すべて</option>
              {ALL_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">開催月</label>
            <select
              value={month}
              onChange={(e) => { setMonth(e.target.value); applyFilter('month', e.target.value); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy-500"
            >
              <option value="">すべて</option>
              {Object.entries(MONTH_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">距離</label>
            <select
              value={distance}
              onChange={(e) => { setDistance(e.target.value); applyFilter('distance', e.target.value); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy-500"
            >
              <option value="">すべて</option>
              {DISTANCE_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">魅力タグ</label>
            <select
              value={selectedTag}
              onChange={(e) => { setSelectedTag(e.target.value); applyFilter('tag', e.target.value); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy-500"
            >
              <option value="">すべて</option>
              {ALL_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Events grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-bold text-lg mb-2">条件に合う大会が見つかりませんでした</p>
          <button onClick={clearAll} className="text-orange-500 hover:text-orange-600 text-sm font-medium mt-2">
            絞り込みをクリアする
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
        <p className="text-amber-800 text-xs">
          ⚠️ 掲載情報はすべて仮データ（MVP開発用）です。実際の大会情報は各公式サイトでご確認ください。
        </p>
      </div>
    </div>
  );
}
