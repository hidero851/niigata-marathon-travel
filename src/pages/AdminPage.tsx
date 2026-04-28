import { useState, useEffect, useCallback } from 'react';
import { Save, RotateCcw, Star, Image, ShoppingBag, Database, Plus, Trash2, Link2, CalendarDays, Pencil, X } from 'lucide-react';
import { getAllDisplayableEvents, allProducts, formatEventDate } from '../data';
import type { MarathonEvent } from '../types';
import type {
  FeaturedEventSetting,
  EventVisualSetting,
  EventHighlightSetting,
  ProductVisualSetting,
} from '../types';
import {
  getFeaturedSettings,
  saveFeaturedSettings,
  resetFeaturedSettings,
  getEventVisualSetting,
  saveEventVisualSetting,
  resetEventVisualSetting,
  getEventVisualSettings,
  getProductVisualSetting,
  saveProductVisualSetting,
  resetProductVisualSetting,
  getProductVisualSettings,
  resetAllEventVisualSettings,
  resetAllProductVisualSettings,
  getAdminCreatedEvents,
  saveAdminCreatedEvent,
  deleteAdminCreatedEvent,
  hideEventId,
  getEventProductAssignment,
  saveEventProductAssignment,
} from '../utils/adminSettings';

type Tab = 'featured' | 'eventManage' | 'eventVisual' | 'productVisual' | 'productAssign' | 'data';

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-navy-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg animate-fade-in">
      {message}
    </div>
  );
}

// --- Tab: Featured Events ---

function FeaturedTab({ onSave }: { onSave: (msg: string) => void }) {
  const events = getAllDisplayableEvents();
  const [settings, setSettings] = useState<FeaturedEventSetting[]>(() => {
    const saved = getFeaturedSettings();
    if (saved.length > 0) return saved;
    return events.map((e, i) => ({ eventId: e.id, isFeatured: i < 3, displayOrder: i }));
  });

  const toggle = (eventId: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.eventId === eventId ? { ...s, isFeatured: !s.isFeatured } : s))
    );
  };

  const setOrder = (eventId: string, order: number) => {
    setSettings((prev) =>
      prev.map((s) => (s.eventId === eventId ? { ...s, displayOrder: order } : s))
    );
  };

  const handleSave = () => {
    saveFeaturedSettings(settings);
    onSave('注目大会設定を保存しました');
  };

  const handleReset = () => {
    resetFeaturedSettings();
    setSettings(events.map((e, i) => ({ eventId: e.id, isFeatured: i < 3, displayOrder: i })));
    onSave('注目大会設定をリセットしました');
  };

  const featuredCount = settings.filter((s) => s.isFeatured).length;

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        トップページの「注目の大会」に表示する大会を選択してください。
      </p>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="grid grid-cols-[auto_1fr_auto] gap-0 divide-y divide-gray-100">
          <div className="contents text-xs text-gray-500 font-medium bg-gray-50">
            <div className="px-4 py-2">表示</div>
            <div className="px-4 py-2">大会名</div>
            <div className="px-4 py-2 text-center">表示順</div>
          </div>
          {settings.map((s) => {
            const event = events.find((e) => e.id === s.eventId);
            if (!event) return null;
            return (
              <div key={s.eventId} className="contents">
                <div className="px-4 py-3 flex items-center">
                  <input
                    type="checkbox"
                    checked={s.isFeatured}
                    onChange={() => toggle(s.eventId)}
                    className="w-4 h-4 accent-orange-500"
                  />
                </div>
                <div className="px-4 py-3">
                  <div className="text-sm font-medium text-navy-800">{event.name}</div>
                  <div className="text-xs text-gray-500">{event.location} / {event.date}</div>
                </div>
                <div className="px-4 py-3 flex items-center justify-center">
                  <input
                    type="number"
                    value={s.displayOrder}
                    min={0}
                    max={99}
                    onChange={(e) => setOrder(s.eventId, Number(e.target.value))}
                    className="w-16 text-center border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-orange-400"
                    disabled={!s.isFeatured}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">{featuredCount} 件が注目大会に設定されています</p>

      <div className="flex gap-3">
        <button onClick={handleSave} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
          <Save size={15} /> 保存
        </button>
        <button onClick={handleReset} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
          <RotateCcw size={15} /> リセット
        </button>
      </div>
    </div>
  );
}

// --- Tab: Event Management (Register / Delete) ---

const ADMIN_SOURCE = {
  sourceName: '管理画面から登録',
  sourceUrl: '',
  sourceType: 'manual_created' as const,
  retrievedAt: new Date().toISOString().split('T')[0],
  termsChecked: false,
  usageAllowed: true,
  usageNote: '管理画面から登録した仮データです。',
};

const INIT_FORM = {
  name: '', eventDate: '', location: '', venue: '',
  distances: '', catchCopy: '', fee: '', capacity: '', timeLimit: '',
  startPoint: '', goalPoint: '', entryPeriod: '', organizer: '',
  officialUrl: '', rakutenTravelUrl: '', heroImageUrl: '', tags: '', notes: '',
};

function EventManageTab({ onSave }: { onSave: (msg: string) => void }) {
  const [events, setEvents] = useState<MarathonEvent[]>(() => getAllDisplayableEvents());
  const [adminIds, setAdminIds] = useState<Set<string>>(
    () => new Set(getAdminCreatedEvents().map((e) => e.id))
  );
  const [form, setForm] = useState({ ...INIT_FORM });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState('');

  const refresh = () => {
    setEvents(getAllDisplayableEvents());
    setAdminIds(new Set(getAdminCreatedEvents().map((e) => e.id)));
  };

  const handleDelete = (eventId: string, name: string) => {
    if (!window.confirm(`「${name}」を削除しますか？\nこの操作は元に戻せません。`)) return;
    if (adminIds.has(eventId)) {
      deleteAdminCreatedEvent(eventId);
    } else {
      hideEventId(eventId);
    }
    refresh();
    onSave('大会を削除しました');
  };

  const handleEditStart = (event: MarathonEvent) => {
    setEditingId(event.id);
    setEditDate(event.eventDate ?? '');
  };

  const handleEditSave = (eventId: string) => {
    if (adminIds.has(eventId)) {
      const stored = getAdminCreatedEvents().find((e) => e.id === eventId);
      if (stored) {
        const updated: MarathonEvent = {
          ...stored,
          eventDate: editDate || undefined,
          date: editDate ? formatEventDate(editDate) : stored.date,
          month: editDate ? String(parseInt(editDate.split('-')[1] ?? '1')) : stored.month,
        };
        saveAdminCreatedEvent(updated);
      }
    } else {
      const existing = getEventVisualSetting(eventId);
      const base = events.find((e) => e.id === eventId);
      saveEventVisualSetting({
        eventId,
        heroImageUrl: existing?.heroImageUrl ?? base?.heroImageUrl ?? '',
        heroImageAlt: existing?.heroImageAlt ?? '',
        catchCopy: existing?.catchCopy ?? base?.catchCopy ?? '',
        subtitle: existing?.subtitle ?? '',
        officialUrl: existing?.officialUrl ?? base?.officialUrl ?? '',
        eventDate: editDate || undefined,
        highlights: existing?.highlights ?? [],
      });
    }
    refresh();
    setEditingId(null);
    onSave('開催日を更新しました');
  };

  const setField = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleCreate = () => {
    if (!form.name.trim()) { alert('大会名は必須です'); return; }
    const id = `admin-${Date.now()}`;
    const date = form.eventDate ? formatEventDate(form.eventDate) : '未定';
    const month = form.eventDate ? String(parseInt(form.eventDate.split('-')[1] ?? '1')) : '1';
    const newEvent: MarathonEvent = {
      id,
      name: form.name,
      location: form.location || '未設定',
      prefecture: '新潟県',
      date,
      month,
      eventDate: form.eventDate || undefined,
      distances: form.distances ? form.distances.split(',').map((s) => s.trim()).filter(Boolean) : [],
      catchCopy: form.catchCopy,
      imageUrl: '',
      imageGradient: 'linear-gradient(135deg, #1e3a5f, #0d2d6b)',
      heroImageUrl: form.heroImageUrl || undefined,
      tags: form.tags ? form.tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
      entryUrl: form.officialUrl,
      officialUrl: form.officialUrl,
      fee: form.fee || '要確認',
      capacity: form.capacity || '要確認',
      timeLimit: form.timeLimit || '要確認',
      startPoint: form.startPoint || '要確認',
      goalPoint: form.goalPoint || '要確認',
      venue: form.venue || undefined,
      entryPeriod: form.entryPeriod || undefined,
      organizer: form.organizer || undefined,
      notes: form.notes || undefined,
      sourceInfo: [ADMIN_SOURCE],
      accommodations: form.rakutenTravelUrl
        ? [{
            id: `${id}-acc`,
            areaName: `${form.location || ''}周辺`,
            distanceToVenue: '要確認',
            description: `${form.location || ''}周辺の宿泊施設`,
            priceRange: '要確認',
            externalUrl: form.rakutenTravelUrl,
            rakutenTravelUrl: form.rakutenTravelUrl,
            sourceInfo: [ADMIN_SOURCE],
          }]
        : [],
      localProducts: [],
      modelPlans: [],
    };
    saveAdminCreatedEvent(newEvent);
    refresh();
    setForm({ ...INIT_FORM });
    setShowForm(false);
    onSave('大会を登録しました');
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        大会の新規登録・削除・開催日変更ができます。静的データの削除は非表示扱いになります。
      </p>

      {/* Event list */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">登録済み大会一覧</span>
          <span className="text-xs text-gray-400">{events.length}件</span>
        </div>
        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {events.map((event) => (
            <div key={event.id}>
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-navy-800">{event.name}</div>
                  <div className="text-xs text-gray-500">{event.location} / {event.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  {adminIds.has(event.id) && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">管理登録</span>
                  )}
                  <button
                    onClick={() => editingId === event.id ? setEditingId(null) : handleEditStart(event)}
                    className={`p-1 rounded transition-colors ${editingId === event.id ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                    title="開催日を編集"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id, event.name)}
                    className="text-red-400 hover:text-red-600 p-1 rounded transition-colors"
                    title="削除"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Inline date editor */}
              {editingId === event.id && (
                <div className="px-4 pb-4 bg-orange-50 border-t border-orange-100">
                  <p className="text-xs text-orange-700 font-medium pt-3 mb-2">開催日を変更</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400"
                    />
                    {editDate && (
                      <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                        表示: {formatEventDate(editDate)}
                      </span>
                    )}
                    <button
                      onClick={() => handleEditSave(event.id)}
                      className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors"
                    >
                      <Save size={13} /> 保存
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs px-2 py-1.5 rounded-lg transition-colors"
                    >
                      <X size={13} /> キャンセル
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toggle form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={15} /> 新しい大会を登録
        </button>
      ) : (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">新しい大会を登録</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField label="大会名 *" value={form.name} onChange={(v) => setField('name', v)} />
            </div>
            {/* Date picker */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">開催日</label>
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => setField('eventDate', e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              />
              {form.eventDate && (
                <span className="ml-3 text-xs text-gray-500">表示: {formatEventDate(form.eventDate)}</span>
              )}
            </div>
            <FormField label="開催エリア" value={form.location} onChange={(v) => setField('location', v)} />
            <FormField label="会場" value={form.venue} onChange={(v) => setField('venue', v)} />
            <FormField label="制限時間" value={form.timeLimit} onChange={(v) => setField('timeLimit', v)} />
            <FormField label="参加費 / 会費" value={form.fee} onChange={(v) => setField('fee', v)} />
            <FormField label="種目（カンマ区切り: フルマラソン,ハーフマラソン）" value={form.distances} onChange={(v) => setField('distances', v)} />
            <FormField label="申込期間" value={form.entryPeriod} onChange={(v) => setField('entryPeriod', v)} />
            <FormField label="主催者" value={form.organizer} onChange={(v) => setField('organizer', v)} />
            <FormField label="定員" value={form.capacity} onChange={(v) => setField('capacity', v)} />
            <FormField label="スタート地点" value={form.startPoint} onChange={(v) => setField('startPoint', v)} />
            <FormField label="ゴール地点" value={form.goalPoint} onChange={(v) => setField('goalPoint', v)} />
            <FormField label="公式サイトURL" value={form.officialUrl} onChange={(v) => setField('officialUrl', v)} />
            <FormField label="楽天トラベルURL（宿泊エリア検索）" value={form.rakutenTravelUrl} onChange={(v) => setField('rakutenTravelUrl', v)} />
            <FormField label="ヒーロー画像URL" value={form.heroImageUrl} onChange={(v) => setField('heroImageUrl', v)} />
            <FormField label="タグ（カンマ区切り）" value={form.tags} onChange={(v) => setField('tags', v)} />
            <div className="md:col-span-2">
              <FormField label="大会説明・キャッチコピー" value={form.catchCopy} onChange={(v) => setField('catchCopy', v)} multiline />
            </div>
            <div className="md:col-span-2">
              <FormField label="備考" value={form.notes} onChange={(v) => setField('notes', v)} multiline />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Save size={15} /> 登録する
            </button>
            <button
              onClick={() => { setShowForm(false); setForm({ ...INIT_FORM }); }}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Tab: Event Visual Settings ---

const EMPTY_HIGHLIGHT: EventHighlightSetting = {
  id: '', title: '', description: '', imageUrl: '', imageAlt: '',
};

function EventVisualTab({ onSave }: { onSave: (msg: string) => void }) {
  const events = getAllDisplayableEvents();
  const [selectedId, setSelectedId] = useState(events[0]?.id ?? '');
  const [form, setForm] = useState<EventVisualSetting>(() => buildForm(events[0]?.id ?? ''));

  function buildForm(eventId: string): EventVisualSetting {
    const saved = getEventVisualSetting(eventId);
    const event = events.find((e) => e.id === eventId);
    return {
      eventId,
      heroImageUrl: saved?.heroImageUrl ?? event?.heroImageUrl ?? '',
      heroImageAlt: saved?.heroImageAlt ?? '',
      catchCopy: saved?.catchCopy ?? event?.catchCopy ?? '',
      subtitle: saved?.subtitle ?? '',
      officialUrl: saved?.officialUrl ?? event?.officialUrl ?? '',
      eventDate: saved?.eventDate ?? event?.eventDate ?? '',
      highlights: saved?.highlights ?? (event?.highlights ?? []).map((h, i) => ({
        id: String(i),
        title: h.title,
        description: h.description,
        imageUrl: h.imageUrl ?? '',
        imageAlt: '',
        gradient: h.gradient,
      })),
    };
  }

  const handleSelectEvent = (id: string) => {
    setSelectedId(id);
    setForm(buildForm(id));
  };

  const setField = <K extends keyof EventVisualSetting>(key: K, value: EventVisualSetting[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addHighlight = () => {
    setForm((prev) => ({
      ...prev,
      highlights: [...prev.highlights, { ...EMPTY_HIGHLIGHT, id: String(Date.now()) }],
    }));
  };

  const removeHighlight = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx),
    }));
  };

  const setHighlightField = (idx: number, key: keyof EventHighlightSetting, value: string) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => (i === idx ? { ...h, [key]: value } : h)),
    }));
  };

  const handleSave = () => {
    saveEventVisualSetting(form);
    onSave('大会ビジュアル設定を保存しました');
  };

  const handleReset = () => {
    resetEventVisualSetting(selectedId);
    setForm(buildForm(selectedId));
    onSave('大会ビジュアル設定をリセットしました');
  };

  return (
    <div>
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">大会を選択</label>
        <select
          value={selectedId}
          onChange={(e) => handleSelectEvent(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 w-full max-w-md"
        >
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-5">
        <FormField
          label="公式サイトURL（設定すると大会詳細画面のボタンに反映されます）"
          value={form.officialUrl}
          onChange={(v) => setField('officialUrl', v)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            開催日（設定するとトップ・一覧・詳細画面の日付に反映されます）
          </label>
          <input
            type="date"
            value={form.eventDate ?? ''}
            onChange={(e) => setField('eventDate', e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 w-full max-w-xs"
          />
          {form.eventDate && (
            <p className="text-xs text-gray-500 mt-1">表示: {formatEventDate(form.eventDate)}</p>
          )}
        </div>
        <FormField
          label="ヒーロー画像URL"
          value={form.heroImageUrl}
          onChange={(v) => setField('heroImageUrl', v)}
          preview={!!form.heroImageUrl}
          previewUrl={form.heroImageUrl}
        />
        <FormField
          label="ヒーロー画像 Alt テキスト"
          value={form.heroImageAlt}
          onChange={(v) => setField('heroImageAlt', v)}
        />
        <FormField
          label="キャッチコピー"
          value={form.catchCopy}
          onChange={(v) => setField('catchCopy', v)}
        />
        <FormField
          label="サブタイトル（任意）"
          value={form.subtitle}
          onChange={(v) => setField('subtitle', v)}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">見どころカード</label>
            <button
              onClick={addHighlight}
              className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium"
            >
              <Plus size={13} /> 追加
            </button>
          </div>
          <div className="space-y-3">
            {form.highlights.map((h, idx) => (
              <div key={h.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500">カード {idx + 1}</span>
                  <button onClick={() => removeHighlight(idx)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="タイトル"
                    value={h.title}
                    onChange={(e) => setHighlightField(idx, 'title', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400"
                  />
                  <input
                    type="text"
                    placeholder="画像URL"
                    value={h.imageUrl}
                    onChange={(e) => setHighlightField(idx, 'imageUrl', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400"
                  />
                  <input
                    type="text"
                    placeholder="説明文"
                    value={h.description}
                    onChange={(e) => setHighlightField(idx, 'description', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400 md:col-span-2"
                  />
                </div>
                {h.imageUrl && (
                  <div
                    className="mt-2 h-16 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url("${h.imageUrl}")` }}
                  />
                )}
              </div>
            ))}
            {form.highlights.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">見どころカードなし。「追加」で作成できます。</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={handleSave} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
          <Save size={15} /> 保存
        </button>
        <button onClick={handleReset} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
          <RotateCcw size={15} /> この大会をリセット
        </button>
      </div>
    </div>
  );
}

// --- Tab: Product Visual Settings ---

function ProductVisualTab({ onSave }: { onSave: (msg: string) => void }) {
  const products = allProducts.filter((p) => p.sourceInfo.every((s) => s.usageAllowed));
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? '');
  const [form, setForm] = useState<ProductVisualSetting>(() => buildForm(products[0]?.id ?? ''));

  function buildForm(productId: string): ProductVisualSetting {
    const saved = getProductVisualSetting(productId);
    const product = products.find((p) => p.id === productId);
    return {
      productId,
      imageUrl: saved?.imageUrl ?? product?.imageUrl ?? '',
      imageAlt: saved?.imageAlt ?? '',
      shortDescription: saved?.shortDescription ?? product?.shortDescription ?? '',
      description: saved?.description ?? product?.description ?? '',
      externalUrl: saved?.externalUrl ?? product?.externalUrl ?? '',
      salesLocations: saved?.salesLocations ?? product?.salesLocations ?? [],
      whereToBuy: saved?.whereToBuy ?? product?.whereToBuy ?? '',
    };
  }

  const handleSelectProduct = (id: string) => {
    setSelectedId(id);
    setForm(buildForm(id));
  };

  const setField = <K extends keyof ProductVisualSetting>(key: K, value: ProductVisualSetting[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveProductVisualSetting(form);
    onSave('特産ビジュアル設定を保存しました');
  };

  const handleReset = () => {
    resetProductVisualSetting(selectedId);
    setForm(buildForm(selectedId));
    onSave('特産ビジュアル設定をリセットしました');
  };

  return (
    <div>
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">特産品を選択</label>
        <select
          value={selectedId}
          onChange={(e) => handleSelectProduct(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 w-full max-w-md"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-5">
        <FormField
          label="画像URL"
          value={form.imageUrl}
          onChange={(v) => setField('imageUrl', v)}
          preview={!!form.imageUrl}
          previewUrl={form.imageUrl}
        />
        <FormField
          label="画像 Alt テキスト"
          value={form.imageAlt}
          onChange={(v) => setField('imageAlt', v)}
        />
        <FormField
          label="短い説明文（カード表示）"
          value={form.shortDescription}
          onChange={(v) => setField('shortDescription', v)}
        />
        <FormField
          label="詳細説明文"
          value={form.description}
          onChange={(v) => setField('description', v)}
          multiline
        />
        <FormField
          label="外部リンクURL"
          value={form.externalUrl}
          onChange={(v) => setField('externalUrl', v)}
        />
        <FormField
          label="購入場所テキスト（文章形式）"
          value={form.whereToBuy ?? ''}
          onChange={(v) => setField('whereToBuy', v)}
          multiline
        />

        {/* Sales locations array */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">販売場所リスト（1行1件）</label>
          </div>
          <textarea
            value={(form.salesLocations ?? []).join('\n')}
            onChange={(e) =>
              setField(
                'salesLocations',
                e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
              )
            }
            rows={5}
            placeholder={`道の駅\n駅構内の売店\n地元スーパー\n観光物産センター\n公式オンラインショップ`}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">1行に1つずつ入力してください。設定するとリスト形式で詳細画面に表示されます。</p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={handleSave} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
          <Save size={15} /> 保存
        </button>
        <button onClick={handleReset} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
          <RotateCcw size={15} /> この特産品をリセット
        </button>
      </div>
    </div>
  );
}

// --- Tab: Product Assignment per Event ---

function ProductAssignTab({ onSave }: { onSave: (msg: string) => void }) {
  const events = getAllDisplayableEvents();
  const products = allProducts.filter((p) => p.sourceInfo.every((s) => s.usageAllowed));
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? '');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(() => {
    if (!events[0]) return [];
    const assignment = getEventProductAssignment(events[0].id);
    if (assignment) return assignment.productIds;
    return events[0].localProducts.map((p) => p.id);
  });

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
    const assignment = getEventProductAssignment(eventId);
    if (assignment) {
      setSelectedProductIds(assignment.productIds);
    } else {
      const event = events.find((e) => e.id === eventId);
      setSelectedProductIds(event?.localProducts.map((p) => p.id) ?? []);
    }
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSave = () => {
    saveEventProductAssignment({ eventId: selectedEventId, productIds: selectedProductIds });
    onSave('特産品の紐付けを保存しました');
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        大会詳細画面に表示する特産品を大会ごとに設定します。
      </p>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">大会を選択</label>
        <select
          value={selectedEventId}
          onChange={(e) => handleEventChange(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 w-full max-w-md"
        >
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
        {products.map((product) => (
          <label
            key={product.id}
            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedProductIds.includes(product.id)}
              onChange={() => toggleProduct(product.id)}
              className="w-4 h-4 accent-orange-500 flex-shrink-0"
            />
            <div
              className="w-8 h-8 rounded-lg flex-shrink-0"
              style={{ background: product.imageGradient || '#ddd' }}
            />
            <div>
              <div className="text-sm font-medium text-navy-800">{product.name}</div>
              <div className="text-xs text-gray-500">{product.area}</div>
            </div>
          </label>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-4">{selectedProductIds.length} 件選択中</p>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
      >
        <Save size={15} /> 保存
      </button>
    </div>
  );
}

// --- Tab: Data View ---

function DataTab({ onSave }: { onSave: (msg: string) => void }) {
  const [data, setData] = useState(() => ({
    featuredEventSettings: getFeaturedSettings(),
    eventVisualSettings: getEventVisualSettings(),
    productVisualSettings: getProductVisualSettings(),
  }));

  const refresh = () => {
    setData({
      featuredEventSettings: getFeaturedSettings(),
      eventVisualSettings: getEventVisualSettings(),
      productVisualSettings: getProductVisualSettings(),
    });
  };

  const handleResetAll = () => {
    resetFeaturedSettings();
    resetAllEventVisualSettings();
    resetAllProductVisualSettings();
    refresh();
    onSave('すべての管理設定をリセットしました');
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">localStorage に保存されている管理設定の現在値です。</p>
      <pre className="bg-gray-900 text-green-300 text-xs rounded-xl p-5 overflow-auto max-h-[500px] leading-relaxed mb-5">
        {JSON.stringify(data, null, 2)}
      </pre>
      <div className="flex gap-3">
        <button onClick={refresh} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
          <RotateCcw size={15} /> 表示を更新
        </button>
        <button
          onClick={handleResetAll}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <Trash2 size={15} /> 全設定をリセット
        </button>
      </div>
    </div>
  );
}

// --- Shared FormField component ---

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  preview?: boolean;
  previewUrl?: string;
  multiline?: boolean;
}

function FormField({ label, value, onChange, preview, previewUrl, multiline }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
        />
      )}
      {preview && previewUrl && (
        <div
          className="mt-2 h-28 rounded-xl bg-cover bg-center border border-gray-200"
          style={{ backgroundImage: `url("${previewUrl}")` }}
        />
      )}
    </div>
  );
}

// --- Main AdminPage ---

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'featured', label: 'トップ表示', icon: <Star size={15} /> },
  { id: 'eventManage', label: '大会管理', icon: <CalendarDays size={15} /> },
  { id: 'eventVisual', label: '大会ビジュアル', icon: <Image size={15} /> },
  { id: 'productVisual', label: '特産品設定', icon: <ShoppingBag size={15} /> },
  { id: 'productAssign', label: '特産品紐づけ', icon: <Link2 size={15} /> },
  { id: 'data', label: 'データ確認', icon: <Database size={15} /> },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('featured');
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg: string) => setToast(msg), []);
  const hideToast = useCallback(() => setToast(''), []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-navy-800 mb-1">管理画面</h1>
        <p className="text-sm text-gray-500">設定はブラウザのlocalStorageに保存されます。認証なし・MVPモード。</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-2xl p-1 flex-wrap">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex-1 justify-center min-w-0 ${
              tab === id
                ? 'bg-white text-navy-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {tab === 'featured' && <FeaturedTab onSave={showToast} />}
        {tab === 'eventManage' && <EventManageTab onSave={showToast} />}
        {tab === 'eventVisual' && <EventVisualTab onSave={showToast} />}
        {tab === 'productVisual' && <ProductVisualTab onSave={showToast} />}
        {tab === 'productAssign' && <ProductAssignTab onSave={showToast} />}
        {tab === 'data' && <DataTab onSave={showToast} />}
      </div>

      {toast && <Toast message={toast} onClose={hideToast} />}
    </div>
  );
}
