import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, ChevronRight, Calendar } from 'lucide-react';
import { getAllDisplayableEvents, isPastEvent } from '../data';
import type { MarathonEvent } from '../types';

const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];

type EventType = 'all' | 'road' | 'trail' | 'ultra';

function getEventType(event: MarathonEvent): 'road' | 'trail' | 'ultra' {
  if (event.tags.includes('ウルトラマラソン') || event.distances.some(d => d.includes('100km') || d.includes('ウルトラ'))) return 'ultra';
  const trailWords = ['トレイル', 'スカイ', 'バーティカル', 'サミット', 'スカイラン'];
  if (trailWords.some(w => event.name.includes(w))) return 'trail';
  return 'road';
}

const TYPE_LABELS: Record<EventType, string> = { all: 'すべて', road: 'ロード', trail: 'トレイル', ultra: 'ウルトラ' };
const TYPE_STYLES: Record<'road' | 'trail' | 'ultra', string> = {
  road: 'bg-blue-50 text-blue-700',
  trail: 'bg-green-50 text-green-700',
  ultra: 'bg-yellow-50 text-yellow-700',
};

export default function CalendarPage() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<EventType>('all');
  const [showPast, setShowPast] = useState(true);

  const events = useMemo(() => getAllDisplayableEvents(), []);

  const grouped = useMemo(() => {
    const filtered = events.filter(e => {
      if (!showPast && isPastEvent(e)) return false;
      if (typeFilter !== 'all' && getEventType(e) !== typeFilter) return false;
      return true;
    });

    const map = new Map<string, MarathonEvent[]>();
    for (const e of filtered) {
      const key = e.eventDate ? e.eventDate.slice(0, 7) : 'unknown';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    for (const evts of map.values()) {
      evts.sort((a, b) => (a.eventDate ?? '').localeCompare(b.eventDate ?? ''));
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [events, typeFilter, showPast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>新潟マラソン大会カレンダー2026 | 新潟マラソンナビ</title>
        <meta name="description" content="新潟県のマラソン・トレイルラン・ウルトラマラソン全大会を月別に一覧。日程・場所・距離をまとめた2026年版カレンダーです。" />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 pb-16">
        {/* ヘッダー */}
        <div className="pt-8 pb-6">
          <p className="text-xs font-bold text-orange-500 tracking-widest mb-1">NIIGATA 2026</p>
          <h1 className="text-2xl font-black text-navy-700 leading-tight">
            新潟のマラソン大会カレンダー
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            新潟県内で開催されるマラソン・トレイルラン・ウルトラの全大会
          </p>
          <span className="inline-block mt-2 text-xs font-bold bg-orange-500 text-white px-3 py-0.5 rounded-full">
            {events.length}大会掲載中
          </span>
        </div>

        {/* フィルター */}
        <div className="flex flex-wrap gap-2 mb-7">
          {(['all', 'road', 'trail', 'ultra'] as EventType[]).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${
                typeFilter === t
                  ? 'bg-navy-700 text-white border-navy-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
          <button
            onClick={() => setShowPast(!showPast)}
            className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${
              !showPast
                ? 'bg-navy-700 text-white border-navy-700'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {showPast ? '開催終了を表示中' : '開催終了を非表示'}
          </button>
        </div>

        {/* 月別グループ */}
        {grouped.map(([monthKey, evts]) => {
          const month = parseInt(monthKey.split('-')[1] ?? '1');
          return (
            <div key={monthKey} className="mb-8">
              {/* 月ヘッダー */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-baseline">
                  <span
                    className="text-3xl font-black text-navy-700 leading-none"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {month}
                  </span>
                  <span className="text-sm font-bold text-gray-400 ml-0.5">月</span>
                </div>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {evts.length}大会
                </span>
              </div>

              {/* 大会カード */}
              <div className="space-y-2">
                {evts.map(event => {
                  const past = isPastEvent(event);
                  const type = getEventType(event);
                  const d = event.eventDate ? new Date(event.eventDate) : null;
                  const dayNum = d ? d.getUTCDate() : null;
                  const dow = d ? DAY_NAMES[d.getUTCDay()] : null;
                  const isSun = d ? d.getUTCDay() === 0 : false;
                  const isSat = d ? d.getUTCDay() === 6 : false;

                  return (
                    <div
                      key={event.id}
                      onClick={() => navigate(`/events/${event.id}`)}
                      className={`bg-white border border-gray-200 rounded-xl p-3.5 flex items-start gap-3 cursor-pointer hover:shadow-md hover:-translate-y-px transition-all ${past ? 'opacity-60' : ''}`}
                    >
                      {/* 日付 */}
                      <div className="w-11 text-center flex-shrink-0 pt-0.5">
                        <div
                          className={`text-2xl font-black leading-none ${past ? 'text-gray-400' : 'text-navy-700'}`}
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                          {dayNum ?? '--'}
                        </div>
                        <div className={`text-xs font-bold mt-0.5 ${isSun ? 'text-red-500' : isSat ? 'text-blue-500' : 'text-gray-400'}`}>
                          {dow}
                        </div>
                      </div>

                      {/* 大会情報 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-1.5 mb-1">
                          <p className="text-sm font-bold text-gray-900 leading-snug">
                            {event.name.replace(/\n/g, ' ')}
                          </p>
                          {past && (
                            <span className="flex-shrink-0 text-xs font-bold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full mt-px">
                              終了
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
                          <span className="flex items-center gap-0.5">
                            <MapPin size={11} />
                            {event.location}
                          </span>
                          <span>{event.distances.join('・')}</span>
                        </div>
                      </div>

                      {/* 種別バッジ + 矢印 */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0 pt-0.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TYPE_STYLES[type]}`}>
                          {TYPE_LABELS[type]}
                        </span>
                        <ChevronRight size={14} className="text-orange-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {grouped.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">条件に一致する大会がありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
