import { useState } from 'react';
import { allEvents, allProducts } from '../data';
import { getLogs } from '../utils/analytics';
import type { SourceInfo } from '../types';

type DataEntry = {
  dataName: string;
  dataType: 'event' | 'product' | 'accommodation' | 'product_in_event';
  sourceInfo: SourceInfo;
};

const SOURCE_TYPE_LABELS: Record<SourceInfo['sourceType'], string> = {
  official_event: '大会公式',
  municipality: '自治体公式',
  tourism_association: '観光協会/DMO',
  open_data: 'オープンデータ',
  permission_obtained: '許諾取得済み',
  manual_created: '手動作成（仮データ）',
};

const SOURCE_TYPE_COLORS: Record<SourceInfo['sourceType'], string> = {
  official_event: 'bg-blue-100 text-blue-800',
  municipality: 'bg-green-100 text-green-800',
  tourism_association: 'bg-teal-100 text-teal-800',
  open_data: 'bg-purple-100 text-purple-800',
  permission_obtained: 'bg-emerald-100 text-emerald-800',
  manual_created: 'bg-gray-100 text-gray-700',
};

function collectEntries(): DataEntry[] {
  const entries: DataEntry[] = [];

  for (const event of allEvents) {
    for (const s of event.sourceInfo) {
      entries.push({ dataName: event.name, dataType: 'event', sourceInfo: s });
    }
    for (const acc of event.accommodations) {
      for (const s of acc.sourceInfo) {
        entries.push({ dataName: `${event.name} > ${acc.areaName}`, dataType: 'accommodation', sourceInfo: s });
      }
    }
  }

  for (const product of allProducts) {
    for (const s of product.sourceInfo) {
      entries.push({ dataName: product.name, dataType: 'product', sourceInfo: s });
    }
  }

  return entries;
}

export default function DataSourcePage() {
  const entries = collectEntries();
  const [filterType, setFilterType] = useState<'' | SourceInfo['sourceType']>('');
  const [filterAllowed, setFilterAllowed] = useState<'' | 'true' | 'false'>('');
  const [showLogs, setShowLogs] = useState(false);
  const logs = getLogs();

  const filtered = entries.filter((e) => {
    if (filterType && e.sourceInfo.sourceType !== filterType) return false;
    if (filterAllowed === 'true' && !e.sourceInfo.usageAllowed) return false;
    if (filterAllowed === 'false' && e.sourceInfo.usageAllowed) return false;
    return true;
  });

  const notAllowed = entries.filter((e) => !e.sourceInfo.usageAllowed);
  const notChecked = entries.filter((e) => !e.sourceInfo.termsChecked);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-navy-800 mb-2">データソース確認メモ</h1>
        <p className="text-gray-600">各大会・特産データの出典確認状況。開発者用ページです。</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-3xl font-black text-navy-800">{entries.length}</div>
          <div className="text-sm text-gray-500 mt-1">総データ数</div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center">
          <div className="text-3xl font-black text-emerald-700">
            {entries.filter((e) => e.sourceInfo.usageAllowed).length}
          </div>
          <div className="text-sm text-emerald-700 mt-1">利用可</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center">
          <div className="text-3xl font-black text-red-700">{notAllowed.length}</div>
          <div className="text-sm text-red-700 mt-1">利用不可 / 要確認</div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-center">
          <div className="text-3xl font-black text-amber-700">{notChecked.length}</div>
          <div className="text-sm text-amber-700 mt-1">規約未確認</div>
        </div>
      </div>

      {notAllowed.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 mb-6">
          <p className="text-red-800 font-bold text-sm mb-2">⚠️ 掲載停止対象データ（usageAllowed: false）</p>
          {notAllowed.map((e, i) => (
            <p key={i} className="text-red-700 text-xs">{e.dataName} — {e.sourceInfo.usageNote}</p>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">ソース種別</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy-500"
          >
            <option value="">すべて</option>
            {(Object.keys(SOURCE_TYPE_LABELS) as SourceInfo['sourceType'][]).map((t) => (
              <option key={t} value={t}>{SOURCE_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">利用可否</label>
          <select
            value={filterAllowed}
            onChange={(e) => setFilterAllowed(e.target.value as typeof filterAllowed)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy-500"
          >
            <option value="">すべて</option>
            <option value="true">利用可</option>
            <option value="false">利用不可</option>
          </select>
        </div>
        <div className="flex items-end">
          <span className="text-sm text-gray-500">{filtered.length} 件表示</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-bold text-gray-700 w-48">データ名</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700 w-28">種別</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700 w-40">ソース名</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700 w-32">ソース種別</th>
                <th className="text-center px-4 py-3 font-bold text-gray-700 w-24">規約確認</th>
                <th className="text-center px-4 py-3 font-bold text-gray-700 w-24">利用可否</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">メモ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => (
                <tr key={i} className={`border-b border-gray-100 hover:bg-gray-50 ${!entry.sourceInfo.usageAllowed ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3 text-gray-800 font-medium">{entry.dataName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      entry.dataType === 'event' ? 'bg-blue-100 text-blue-700' :
                      entry.dataType === 'product' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {entry.dataType === 'event' ? '大会' : entry.dataType === 'product' ? '特産' : '宿泊'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{entry.sourceInfo.sourceName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${SOURCE_TYPE_COLORS[entry.sourceInfo.sourceType]}`}>
                      {SOURCE_TYPE_LABELS[entry.sourceInfo.sourceType]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {entry.sourceInfo.termsChecked ? (
                      <span className="text-emerald-600">✅</span>
                    ) : (
                      <span className="text-amber-500">⚠️</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {entry.sourceInfo.usageAllowed ? (
                      <span className="text-emerald-600 font-medium">✅ 可</span>
                    ) : (
                      <span className="text-red-600 font-medium">❌ 不可</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{entry.sourceInfo.usageNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Logs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-navy-800 text-lg">独自クリックログ（localStorage）</h2>
          <div className="flex gap-3">
            <span className="text-sm text-gray-500">{logs.length} 件</span>
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="text-sm text-navy-600 hover:text-navy-800 font-medium"
            >
              {showLogs ? '隠す' : '表示する'}
            </button>
          </div>
        </div>

        {showLogs && (
          logs.length === 0 ? (
            <p className="text-sm text-gray-500">ログはまだありません。大会ページや特産ページを閲覧するとログが記録されます。</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-bold text-gray-600">eventType</th>
                    <th className="text-left px-3 py-2 font-bold text-gray-600">marathonEventId</th>
                    <th className="text-left px-3 py-2 font-bold text-gray-600">productId</th>
                    <th className="text-left px-3 py-2 font-bold text-gray-600">timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {[...logs].reverse().slice(0, 50).map((log, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 font-mono text-navy-700">{log.eventType}</td>
                      <td className="px-3 py-2 text-gray-600">{log.marathonEventId ?? '-'}</td>
                      <td className="px-3 py-2 text-gray-600">{log.productId ?? '-'}</td>
                      <td className="px-3 py-2 text-gray-500">{new Date(log.timestamp).toLocaleString('ja-JP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {logs.length > 50 && (
                <p className="text-xs text-gray-400 mt-2 px-3">（最新50件を表示中 / 全{logs.length}件）</p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
