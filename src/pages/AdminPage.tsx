import { useState, useEffect, useCallback } from 'react';
import {
  Save, RotateCcw, Star, Image, ShoppingBag, Plus, Trash2,
  Link2, CalendarDays, Pencil, X, BarChart2, Hotel, Route, Package,
} from 'lucide-react';
import { getAllDisplayableEvents, allProducts, formatEventDate } from '../data';
import type { MarathonEvent, Accommodation, ModelPlan, LocalProduct } from '../types';
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
  getProductVisualSetting,
  saveProductVisualSetting,
  resetProductVisualSetting,
  resetAllEventVisualSettings,
  resetAllProductVisualSettings,
  getAdminCreatedEvents,
  saveAdminCreatedEvent,
  deleteAdminCreatedEvent,
  hideEventId,
  getEventProductAssignment,
  saveEventProductAssignment,
  getEventAccommodationOverride,
  saveEventAccommodationOverride,
  getEventModelPlanOverride,
  saveEventModelPlanOverride,
  getEventAdminLocalProducts,
  saveEventAdminLocalProducts,
} from '../utils/adminSettings';
import { getLogs, clearLogs } from '../utils/analytics';
import { logoutAdmin } from '../utils/auth';

type Tab = 'featured' | 'eventManage' | 'data';
type EventSubTab = 'visual' | 'accommodations' | 'modelPlans' | 'products' | 'productAssign' | 'localProductsAdmin';

// --- Toast ---

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-navy-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg">
      {message}
    </div>
  );
}

// --- Shared FormField ---

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

// --- EventVisualPanel (per-event visual settings, accepts eventId as prop) ---

const EMPTY_HIGHLIGHT: EventHighlightSetting = {
  id: '', title: '', description: '', imageUrl: '', imageAlt: '',
};

function EventVisualPanel({ eventId, onSave }: { eventId: string; onSave: (msg: string) => void }) {
  const events = getAllDisplayableEvents();

  function buildForm(id: string): EventVisualSetting {
    const saved = getEventVisualSetting(id);
    const event = events.find((e) => e.id === id);
    return {
      eventId: id,
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

  const [form, setForm] = useState<EventVisualSetting>(() => buildForm(eventId));

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
    resetEventVisualSetting(eventId);
    setForm(buildForm(eventId));
    onSave('大会ビジュアル設定をリセットしました');
  };

  return (
    <div className="space-y-5">
      <FormField
        label="公式サイトURL"
        value={form.officialUrl}
        onChange={(v) => setField('officialUrl', v)}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">開催日</label>
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

      <div className="flex gap-3 pt-2">
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

// --- ProductVisualPanel (global product settings) ---

function ProductVisualPanel({ onSave }: { onSave: (msg: string) => void }) {
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
    onSave('特産品設定を保存しました');
  };

  const handleReset = () => {
    resetProductVisualSetting(selectedId);
    setForm(buildForm(selectedId));
    onSave('特産品設定をリセットしました');
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        特産品の画像・説明文などを編集します。ここでの設定はすべての大会共通です。大会ごとの購入場所テキストは「特産品紐づけ」タブで設定できます。
      </p>
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
          label="購入場所テキスト（共通・文章形式）"
          value={form.whereToBuy ?? ''}
          onChange={(v) => setField('whereToBuy', v)}
          multiline
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">販売場所リスト（1行1件）</label>
          <textarea
            value={(form.salesLocations ?? []).join('\n')}
            onChange={(e) =>
              setField('salesLocations', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))
            }
            rows={4}
            placeholder={`道の駅\n駅構内の売店\n観光物産センター`}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none"
          />
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

// --- ProductAssignPanel (assign products to event + per-event whereToBuy overrides) ---

function ProductAssignPanel({ eventId, onSave }: { eventId: string; onSave: (msg: string) => void }) {
  const events = getAllDisplayableEvents();
  const products = allProducts.filter((p) => p.sourceInfo.every((s) => s.usageAllowed));

  const getInitialState = (eid: string) => {
    const assignment = getEventProductAssignment(eid);
    if (assignment) {
      const ovs: Record<string, string> = {};
      if (assignment.productOverrides) {
        for (const [pid, ov] of Object.entries(assignment.productOverrides)) {
          ovs[pid] = ov.whereToBuy ?? '';
        }
      }
      return { productIds: assignment.productIds, overrides: ovs };
    }
    const event = events.find((e) => e.id === eid);
    return { productIds: event?.localProducts.map((p) => p.id) ?? [], overrides: {} as Record<string, string> };
  };

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(() => getInitialState(eventId).productIds);
  const [overrides, setOverrides] = useState<Record<string, string>>(() => getInitialState(eventId).overrides);

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const setOverride = (productId: string, value: string) => {
    setOverrides((prev) => ({ ...prev, [productId]: value }));
  };

  const handleSave = () => {
    const productOverrides: Record<string, { whereToBuy?: string }> = {};
    for (const [pid, val] of Object.entries(overrides)) {
      if (val.trim()) productOverrides[pid] = { whereToBuy: val.trim() };
    }
    saveEventProductAssignment({
      eventId,
      productIds: selectedProductIds,
      productOverrides: Object.keys(productOverrides).length > 0 ? productOverrides : undefined,
    });
    onSave('特産品の紐付けを保存しました');
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-5">
        この大会に表示する特産品を選択します。チェックした特産品には、この大会専用の「購入場所テキスト」を設定できます。
      </p>

      <div className="space-y-3 mb-6">
        {products.map((product) => {
          const isSelected = selectedProductIds.includes(product.id);
          return (
            <div
              key={product.id}
              className={`border rounded-xl p-4 transition-colors ${isSelected ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white'}`}
            >
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected}
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
              {isSelected && (
                <div className="mt-3 ml-7">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    購入場所テキスト（この大会専用。未入力なら共通設定を使用）
                  </label>
                  <textarea
                    value={overrides[product.id] ?? ''}
                    onChange={(e) => setOverride(product.id, e.target.value)}
                    rows={2}
                    placeholder="例: 会場内の物産コーナー、上越駅前の土産店"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none"
                  />
                </div>
              )}
            </div>
          );
        })}
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

// --- AccommodationPanel ---

const EMPTY_ACC = { label: '', areaName: '', distanceToVenue: '', description: '', priceRange: '', externalUrl: '', rakutenTravelUrl: '' };

function AccommodationPanel({ eventId, onSave }: { eventId: string; onSave: (msg: string) => void }) {
  const events = getAllDisplayableEvents();
  const event = events.find((e) => e.id === eventId);
  const [items, setItems] = useState<Accommodation[]>(() => getEventAccommodationOverride(eventId) ?? event?.accommodations ?? []);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_ACC });
  const setF = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const persistItems = (updated: Accommodation[]) => {
    setItems(updated);
    saveEventAccommodationOverride(eventId, updated);
  };

  const handleAdd = () => {
    if (!form.areaName.trim()) { alert('エリア名は必須です'); return; }
    persistItems([...items, {
      id: `acc-admin-${Date.now()}`, ...form,
      label: form.label || undefined,
      rakutenTravelUrl: form.rakutenTravelUrl || undefined, sourceInfo: [ADMIN_SOURCE],
    }]);
    setForm({ ...EMPTY_ACC }); setShowAddForm(false); onSave('宿泊エリアを追加しました');
  };

  const handleEditSave = () => {
    if (editIdx === null) return;
    if (!form.areaName.trim()) { alert('エリア名は必須です'); return; }
    persistItems(items.map((item, i) => i === editIdx ? { ...item, ...form, rakutenTravelUrl: form.rakutenTravelUrl || undefined } : item));
    setEditIdx(null); setForm({ ...EMPTY_ACC }); onSave('宿泊エリアを更新しました');
  };

  const handleEditStart = (idx: number) => {
    const item = items[idx];
    setForm({ label: item.label ?? '', areaName: item.areaName, distanceToVenue: item.distanceToVenue, description: item.description, priceRange: item.priceRange, externalUrl: item.externalUrl, rakutenTravelUrl: item.rakutenTravelUrl ?? '' });
    setEditIdx(idx); setShowAddForm(false);
  };

  const handleDelete = (idx: number) => {
    if (!window.confirm('この宿泊エリアを削除しますか？')) return;
    persistItems(items.filter((_, i) => i !== idx)); onSave('宿泊エリアを削除しました');
  };

  const AccForm = () => (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3 mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField label="ラベル（例：当日ラク重視）" value={form.label} onChange={(v) => setF('label', v)} />
        <FormField label="エリア名 *" value={form.areaName} onChange={(v) => setF('areaName', v)} />
        <FormField label="会場からの距離" value={form.distanceToVenue} onChange={(v) => setF('distanceToVenue', v)} />
        <FormField label="価格帯" value={form.priceRange} onChange={(v) => setF('priceRange', v)} />
        <FormField label="楽天トラベルURL" value={form.rakutenTravelUrl} onChange={(v) => setF('rakutenTravelUrl', v)} />
        <div className="md:col-span-2"><FormField label="説明文" value={form.description} onChange={(v) => setF('description', v)} multiline /></div>
      </div>
      <div className="flex gap-2">
        <button onClick={editIdx !== null ? handleEditSave : handleAdd} className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
          <Save size={13} /> {editIdx !== null ? '更新' : '追加'}
        </button>
        <button onClick={() => { setShowAddForm(false); setEditIdx(null); setForm({ ...EMPTY_ACC }); }} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
          <X size={13} /> キャンセル
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">ランナー向け宿泊エリアを管理します。設定するとデフォルトデータを上書きします。</p>
      {items.length > 0 ? (
        <div className="space-y-2 mb-4">
          {items.map((item, idx) => (
            <div key={item.id}>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-navy-800 text-sm">{item.areaName}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.distanceToVenue} / {item.priceRange}</div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => handleEditStart(idx)} className="p-1.5 text-gray-400 hover:text-orange-500 rounded transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(idx)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              {editIdx === idx && AccForm()}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4 mb-4">宿泊エリアがありません</p>
      )}
      {showAddForm && editIdx === null && AccForm()}
      {!showAddForm && editIdx === null && (
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={14} /> 宿泊エリアを追加
        </button>
      )}
    </div>
  );
}

// --- ModelPlanPanel ---

const EMPTY_PLAN = { title: '', steps: [''] };

function ModelPlanPanel({ eventId, onSave }: { eventId: string; onSave: (msg: string) => void }) {
  const events = getAllDisplayableEvents();
  const event = events.find((e) => e.id === eventId);
  const [plans, setPlans] = useState<ModelPlan[]>(() => getEventModelPlanOverride(eventId) ?? event?.modelPlans ?? []);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_PLAN });

  const persistPlans = (updated: ModelPlan[]) => {
    setPlans(updated); saveEventModelPlanOverride(eventId, updated);
  };

  const handleAdd = () => {
    if (!form.title.trim()) { alert('タイトルは必須です'); return; }
    persistPlans([...plans, { title: form.title, steps: form.steps.filter((s) => s.trim()) }]);
    setForm({ ...EMPTY_PLAN }); setShowAddForm(false); onSave('プランを追加しました');
  };

  const handleEditSave = () => {
    if (editIdx === null) return;
    if (!form.title.trim()) { alert('タイトルは必須です'); return; }
    persistPlans(plans.map((p, i) => i === editIdx ? { title: form.title, steps: form.steps.filter((s) => s.trim()) } : p));
    setEditIdx(null); setForm({ ...EMPTY_PLAN }); onSave('プランを更新しました');
  };

  const handleEditStart = (idx: number) => {
    const p = plans[idx];
    setForm({ title: p.title, steps: p.steps.length > 0 ? [...p.steps] : [''] });
    setEditIdx(idx); setShowAddForm(false);
  };

  const handleDelete = (idx: number) => {
    if (!window.confirm('このプランを削除しますか？')) return;
    persistPlans(plans.filter((_, i) => i !== idx)); onSave('プランを削除しました');
  };

  const addStep = () => setForm((p) => ({ ...p, steps: [...p.steps, ''] }));
  const removeStep = (i: number) => setForm((p) => ({ ...p, steps: p.steps.filter((_, si) => si !== i) }));
  const setStep = (i: number, v: string) => setForm((p) => ({ ...p, steps: p.steps.map((s, si) => si === i ? v : s) }));

  const PlanForm = () => (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3 mt-2">
      <FormField label="プランタイトル *" value={form.title} onChange={(v) => setForm((p) => ({ ...p, title: v }))} />
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">ステップ</label>
          <button onClick={addStep} className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"><Plus size={12} /> 追加</button>
        </div>
        <div className="space-y-2">
          {form.steps.map((step, i) => (
            <div key={i} className="flex gap-2">
              <input value={step} onChange={(e) => setStep(i, e.target.value)} placeholder={`ステップ ${i + 1}`}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400" />
              {form.steps.length > 1 && (
                <button onClick={() => removeStep(i)} className="text-red-400 hover:text-red-600 p-1"><X size={14} /></button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={editIdx !== null ? handleEditSave : handleAdd} className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
          <Save size={13} /> {editIdx !== null ? '更新' : '追加'}
        </button>
        <button onClick={() => { setShowAddForm(false); setEditIdx(null); setForm({ ...EMPTY_PLAN }); }} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
          <X size={13} /> キャンセル
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">おすすめ参加プランを管理します。設定するとデフォルトデータを上書きします。</p>
      {plans.length > 0 ? (
        <div className="space-y-2 mb-4">
          {plans.map((plan, idx) => (
            <div key={idx}>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-medium text-navy-800 text-sm">{plan.title}</div>
                  <ol className="mt-2 space-y-0.5">
                    {plan.steps.map((step, si) => (
                      <li key={si} className="text-xs text-gray-600 flex gap-1.5">
                        <span className="text-orange-400 font-bold flex-shrink-0">{si + 1}.</span>{step}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => handleEditStart(idx)} className="p-1.5 text-gray-400 hover:text-orange-500 rounded transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(idx)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              {editIdx === idx && PlanForm()}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4 mb-4">参加プランがありません</p>
      )}
      {showAddForm && editIdx === null && PlanForm()}
      {!showAddForm && editIdx === null && (
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={14} /> プランを追加
        </button>
      )}
    </div>
  );
}

// --- LocalProductAdminPanel ---

const EMPTY_LP = { name: '', area: '', shortDescription: '', description: '', recommendedPoint: '', whereToBuy: '', externalUrl: '', imageUrl: '' };

function LocalProductAdminPanel({ eventId, onSave }: { eventId: string; onSave: (msg: string) => void }) {
  const [products, setProducts] = useState<LocalProduct[]>(() => getEventAdminLocalProducts(eventId));
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_LP });
  const setF = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const persistProducts = (updated: LocalProduct[]) => {
    setProducts(updated); saveEventAdminLocalProducts(eventId, updated);
  };

  const handleAdd = () => {
    if (!form.name.trim()) { alert('名称は必須です'); return; }
    persistProducts([...products, { id: `lp-admin-${Date.now()}`, ...form, relatedEventIds: [eventId], sourceInfo: [ADMIN_SOURCE] }]);
    setForm({ ...EMPTY_LP }); setShowAddForm(false); onSave('特産品を追加しました');
  };

  const handleEditSave = () => {
    if (editIdx === null) return;
    if (!form.name.trim()) { alert('名称は必須です'); return; }
    persistProducts(products.map((p, i) => i === editIdx ? { ...p, ...form } : p));
    setEditIdx(null); setForm({ ...EMPTY_LP }); onSave('特産品を更新しました');
  };

  const handleEditStart = (idx: number) => {
    const p = products[idx];
    setForm({ name: p.name, area: p.area, shortDescription: p.shortDescription, description: p.description, recommendedPoint: p.recommendedPoint, whereToBuy: p.whereToBuy, externalUrl: p.externalUrl, imageUrl: p.imageUrl });
    setEditIdx(idx); setShowAddForm(false);
  };

  const handleDelete = (idx: number) => {
    if (!window.confirm('この特産品を削除しますか？')) return;
    persistProducts(products.filter((_, i) => i !== idx)); onSave('特産品を削除しました');
  };

  const LpForm = () => (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField label="名称 *" value={form.name} onChange={(v) => setF('name', v)} />
        <FormField label="エリア" value={form.area} onChange={(v) => setF('area', v)} />
        <FormField label="短い説明" value={form.shortDescription} onChange={(v) => setF('shortDescription', v)} />
        <FormField label="おすすめポイント" value={form.recommendedPoint} onChange={(v) => setF('recommendedPoint', v)} />
        <FormField label="購入場所" value={form.whereToBuy} onChange={(v) => setF('whereToBuy', v)} />
        <FormField label="外部リンクURL" value={form.externalUrl} onChange={(v) => setF('externalUrl', v)} />
        <FormField label="画像URL" value={form.imageUrl} onChange={(v) => setF('imageUrl', v)} preview={!!form.imageUrl} previewUrl={form.imageUrl} />
        <div className="md:col-span-2"><FormField label="詳細説明" value={form.description} onChange={(v) => setF('description', v)} multiline /></div>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={editIdx !== null ? handleEditSave : handleAdd} className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
          <Save size={13} /> {editIdx !== null ? '更新' : '追加'}
        </button>
        <button onClick={() => { setShowAddForm(false); setEditIdx(null); setForm({ ...EMPTY_LP }); }} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
          <X size={13} /> キャンセル
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">この大会専用の特産品・グルメ情報を追加できます。グローバル特産品の紐づけは「特産品紐づけ」タブをご利用ください。</p>
      {products.length > 0 ? (
        <div className="space-y-2 mb-4">
          {products.map((product, idx) => (
            <div key={product.id}>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-navy-800 text-sm">{product.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{product.area}</div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">{product.shortDescription}</div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => handleEditStart(idx)} className="p-1.5 text-gray-400 hover:text-orange-500 rounded transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(idx)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              {editIdx === idx && LpForm()}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4 mb-4">追加された特産品がありません</p>
      )}
      {showAddForm && editIdx === null && LpForm()}
      {!showAddForm && editIdx === null && (
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={14} /> 特産品を追加
        </button>
      )}
    </div>
  );
}

// --- EventManageContainer (event list + sub-tabs) ---

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

const EVENT_SUBTABS: { id: EventSubTab; label: string; icon: React.ReactNode }[] = [
  { id: 'visual', label: 'ビジュアル', icon: <Image size={14} /> },
  { id: 'accommodations', label: '宿泊エリア', icon: <Hotel size={14} /> },
  { id: 'modelPlans', label: '参加プラン', icon: <Route size={14} /> },
  { id: 'products', label: '特産品設定', icon: <ShoppingBag size={14} /> },
  { id: 'productAssign', label: '特産品紐づけ', icon: <Link2 size={14} /> },
  { id: 'localProductsAdmin', label: '独自特産品', icon: <Package size={14} /> },
];

function EventManageContainer({ onSave }: { onSave: (msg: string) => void }) {
  const [events, setEvents] = useState<MarathonEvent[]>(() => getAllDisplayableEvents());
  const [adminIds, setAdminIds] = useState<Set<string>>(
    () => new Set(getAdminCreatedEvents().map((e) => e.id))
  );
  const [form, setForm] = useState({ ...INIT_FORM });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState('');
  const [adminEditId, setAdminEditId] = useState<string | null>(null);
  const [adminEditForm, setAdminEditForm] = useState({ ...INIT_FORM });

  const [selectedEventId, setSelectedEventId] = useState(() => getAllDisplayableEvents()[0]?.id ?? '');
  const [subTab, setSubTab] = useState<EventSubTab>('visual');

  const refresh = () => {
    const updated = getAllDisplayableEvents();
    setEvents(updated);
    setAdminIds(new Set(getAdminCreatedEvents().map((e) => e.id)));
    if (updated.length > 0 && !updated.find((e) => e.id === selectedEventId)) {
      setSelectedEventId(updated[0].id);
    }
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

  const handleAdminEditStart = (event: MarathonEvent) => {
    setAdminEditId(event.id);
    setAdminEditForm({
      name: event.name, eventDate: event.eventDate ?? '', location: event.location,
      venue: event.venue ?? '', distances: event.distances.join(', '), catchCopy: event.catchCopy,
      fee: event.fee, capacity: event.capacity, timeLimit: event.timeLimit,
      startPoint: event.startPoint, goalPoint: event.goalPoint,
      entryPeriod: event.entryPeriod ?? '', organizer: event.organizer ?? '',
      officialUrl: event.officialUrl, rakutenTravelUrl: event.accommodations[0]?.rakutenTravelUrl ?? '',
      heroImageUrl: event.heroImageUrl ?? '', tags: event.tags.join(', '), notes: event.notes ?? '',
    });
  };

  const handleAdminEditSave = (eventId: string) => {
    const f = adminEditForm;
    const stored = getAdminCreatedEvents().find((e) => e.id === eventId);
    if (!stored) return;
    const date = f.eventDate ? formatEventDate(f.eventDate) : stored.date;
    const month = f.eventDate ? String(parseInt(f.eventDate.split('-')[1] ?? '1')) : stored.month;
    const updated: MarathonEvent = {
      ...stored, name: f.name, eventDate: f.eventDate || undefined, date, month,
      location: f.location || stored.location, venue: f.venue || undefined,
      distances: f.distances ? f.distances.split(',').map((s) => s.trim()).filter(Boolean) : stored.distances,
      catchCopy: f.catchCopy, fee: f.fee || stored.fee, capacity: f.capacity || stored.capacity,
      timeLimit: f.timeLimit || stored.timeLimit, startPoint: f.startPoint || stored.startPoint,
      goalPoint: f.goalPoint || stored.goalPoint, entryPeriod: f.entryPeriod || undefined,
      organizer: f.organizer || undefined, officialUrl: f.officialUrl, entryUrl: f.officialUrl,
      heroImageUrl: f.heroImageUrl || undefined,
      tags: f.tags ? f.tags.split(',').map((s) => s.trim()).filter(Boolean) : stored.tags,
      notes: f.notes || undefined,
    };
    saveAdminCreatedEvent(updated);
    refresh(); setAdminEditId(null); onSave('大会情報を更新しました');
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
      {/* Section 1: Event list */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-4">
          大会の新規登録・削除・開催日変更ができます。静的データの削除は非表示扱いになります。
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-5">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">登録済み大会一覧</span>
            <span className="text-xs text-gray-400">{events.length}件</span>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
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
                      onClick={() => {
                        if (adminIds.has(event.id)) {
                          adminEditId === event.id ? setAdminEditId(null) : handleAdminEditStart(event);
                        } else {
                          editingId === event.id ? setEditingId(null) : handleEditStart(event);
                        }
                      }}
                      className={`p-1 rounded transition-colors ${(editingId === event.id || adminEditId === event.id) ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                      title={adminIds.has(event.id) ? '大会情報を編集' : '開催日を編集'}
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
                {editingId === event.id && (
                  <div className="px-4 pb-4 bg-orange-50 border-t border-orange-100">
                    <p className="text-xs text-orange-700 font-medium pt-3 mb-2">開催日を変更</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400" />
                      {editDate && (
                        <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                          表示: {formatEventDate(editDate)}
                        </span>
                      )}
                      <button onClick={() => handleEditSave(event.id)}
                        className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors">
                        <Save size={13} /> 保存
                      </button>
                      <button onClick={() => setEditingId(null)}
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs px-2 py-1.5 rounded-lg transition-colors">
                        <X size={13} /> キャンセル
                      </button>
                    </div>
                  </div>
                )}
                {adminEditId === event.id && (
                  <div className="px-4 pb-5 bg-orange-50 border-t border-orange-100">
                    <p className="text-xs text-orange-700 font-medium pt-3 mb-3">大会情報を編集</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2"><FormField label="大会名 *" value={adminEditForm.name} onChange={(v) => setAdminEditForm((p) => ({ ...p, name: v }))} /></div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">開催日</label>
                        <input type="date" value={adminEditForm.eventDate} onChange={(e) => setAdminEditForm((p) => ({ ...p, eventDate: e.target.value }))}
                          className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                      </div>
                      <FormField label="開催エリア" value={adminEditForm.location} onChange={(v) => setAdminEditForm((p) => ({ ...p, location: v }))} />
                      <FormField label="会場" value={adminEditForm.venue} onChange={(v) => setAdminEditForm((p) => ({ ...p, venue: v }))} />
                      <FormField label="種目（カンマ区切り）" value={adminEditForm.distances} onChange={(v) => setAdminEditForm((p) => ({ ...p, distances: v }))} />
                      <FormField label="タグ（カンマ区切り）" value={adminEditForm.tags} onChange={(v) => setAdminEditForm((p) => ({ ...p, tags: v }))} />
                      <FormField label="参加費" value={adminEditForm.fee} onChange={(v) => setAdminEditForm((p) => ({ ...p, fee: v }))} />
                      <FormField label="制限時間" value={adminEditForm.timeLimit} onChange={(v) => setAdminEditForm((p) => ({ ...p, timeLimit: v }))} />
                      <FormField label="定員" value={adminEditForm.capacity} onChange={(v) => setAdminEditForm((p) => ({ ...p, capacity: v }))} />
                      <FormField label="申込期間" value={adminEditForm.entryPeriod} onChange={(v) => setAdminEditForm((p) => ({ ...p, entryPeriod: v }))} />
                      <FormField label="公式サイトURL" value={adminEditForm.officialUrl} onChange={(v) => setAdminEditForm((p) => ({ ...p, officialUrl: v }))} />
                      <FormField label="楽天トラベルURL" value={adminEditForm.rakutenTravelUrl} onChange={(v) => setAdminEditForm((p) => ({ ...p, rakutenTravelUrl: v }))} />
                      <div className="md:col-span-2"><FormField label="キャッチコピー" value={adminEditForm.catchCopy} onChange={(v) => setAdminEditForm((p) => ({ ...p, catchCopy: v }))} multiline /></div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => handleAdminEditSave(event.id)}
                        className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors">
                        <Save size={13} /> 保存
                      </button>
                      <button onClick={() => setAdminEditId(null)}
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs px-2 py-1.5 rounded-lg transition-colors">
                        <X size={13} /> キャンセル
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

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
              <FormField label="種目（カンマ区切り）" value={form.distances} onChange={(v) => setField('distances', v)} />
              <FormField label="申込期間" value={form.entryPeriod} onChange={(v) => setField('entryPeriod', v)} />
              <FormField label="主催者" value={form.organizer} onChange={(v) => setField('organizer', v)} />
              <FormField label="定員" value={form.capacity} onChange={(v) => setField('capacity', v)} />
              <FormField label="スタート地点" value={form.startPoint} onChange={(v) => setField('startPoint', v)} />
              <FormField label="ゴール地点" value={form.goalPoint} onChange={(v) => setField('goalPoint', v)} />
              <FormField label="公式サイトURL" value={form.officialUrl} onChange={(v) => setField('officialUrl', v)} />
              <FormField label="楽天トラベルURL" value={form.rakutenTravelUrl} onChange={(v) => setField('rakutenTravelUrl', v)} />
              <FormField label="ヒーロー画像URL" value={form.heroImageUrl} onChange={(v) => setField('heroImageUrl', v)} />
              <FormField label="タグ（カンマ区切り）" value={form.tags} onChange={(v) => setField('tags', v)} />
              <div className="md:col-span-2">
                <FormField label="キャッチコピー" value={form.catchCopy} onChange={(v) => setField('catchCopy', v)} multiline />
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

      {/* Section 2: Per-event detail settings */}
      {events.length > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-sm font-bold text-gray-700 mb-4">大会詳細設定</h3>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">設定する大会</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 w-full max-w-md"
            >
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
            {EVENT_SUBTABS.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setSubTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                  subTab === id ? 'bg-white text-navy-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Sub-tab content — key forces re-mount on event change */}
          <div>
            {subTab === 'visual' && (
              <EventVisualPanel key={selectedEventId} eventId={selectedEventId} onSave={onSave} />
            )}
            {subTab === 'accommodations' && (
              <AccommodationPanel key={selectedEventId} eventId={selectedEventId} onSave={onSave} />
            )}
            {subTab === 'modelPlans' && (
              <ModelPlanPanel key={selectedEventId} eventId={selectedEventId} onSave={onSave} />
            )}
            {subTab === 'products' && (
              <ProductVisualPanel onSave={onSave} />
            )}
            {subTab === 'productAssign' && (
              <ProductAssignPanel key={selectedEventId} eventId={selectedEventId} onSave={onSave} />
            )}
            {subTab === 'localProductsAdmin' && (
              <LocalProductAdminPanel key={selectedEventId} eventId={selectedEventId} onSave={onSave} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- DataTab (analytics dashboard) ---

function DataTab({ onSave }: { onSave: (msg: string) => void }) {
  const events = getAllDisplayableEvents();
  const [logs, setLogs] = useState(() => getLogs());

  const refresh = () => setLogs(getLogs());

  const handleClear = () => {
    if (!window.confirm('アクセスログをすべて削除しますか？')) return;
    clearLogs();
    setLogs([]);
    onSave('ログを削除しました');
  };

  const handleResetAll = () => {
    if (!window.confirm('管理設定（注目大会・ビジュアル・特産品）をすべてリセットしますか？')) return;
    resetAllEventVisualSettings();
    resetAllProductVisualSettings();
    onSave('すべての管理設定をリセットしました');
  };

  // Aggregate event stats
  const eventStats = events
    .map((event) => ({
      event,
      views: logs.filter((l) => l.marathonEventId === event.id && l.eventType === 'view_event').length,
      details: logs.filter((l) => l.marathonEventId === event.id && l.eventType === 'click_event_detail').length,
      accommodation: logs.filter((l) => l.marathonEventId === event.id && l.eventType === 'click_accommodation').length,
      official: logs.filter((l) => l.marathonEventId === event.id && l.eventType === 'click_official_site').length,
    }))
    .filter((s) => s.views + s.details + s.accommodation + s.official > 0)
    .sort((a, b) => b.views + b.details - (a.views + a.details));

  // Aggregate product stats
  const productStats = allProducts
    .map((product) => ({
      product,
      clicks: logs.filter(
        (l) => l.productId === product.id && (l.eventType === 'click_product' || l.eventType === 'click_product_external')
      ).length,
    }))
    .filter((s) => s.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks);

  // Aggregate tag/search stats
  const tagFreq: Record<string, number> = {};
  for (const log of logs) {
    if ((log.eventType === 'search' || log.eventType === 'filter') && log.tags) {
      for (const tag of log.tags) {
        tagFreq[tag] = (tagFreq[tag] ?? 0) + 1;
      }
    }
  }
  const tagStats = Object.entries(tagFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">このブラウザで記録されたアクセスログの集計です。</p>
      <p className="text-xs text-gray-400 mb-6">総ログ件数: {logs.length} 件</p>

      {/* Event access table */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-700 mb-3">大会別アクセス集計</h3>
        {eventStats.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-200">
                  <th className="px-4 py-2 text-left font-medium">大会名</th>
                  <th className="px-4 py-2 text-center font-medium">閲覧</th>
                  <th className="px-4 py-2 text-center font-medium">詳細クリック</th>
                  <th className="px-4 py-2 text-center font-medium">宿泊クリック</th>
                  <th className="px-4 py-2 text-center font-medium">公式サイト</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {eventStats.map(({ event, views, details, accommodation, official }) => (
                  <tr key={event.id}>
                    <td className="px-4 py-3 font-medium text-navy-800">{event.name}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{views}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{details}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{accommodation}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{official}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 bg-gray-50 rounded-2xl text-center">
            <p className="text-sm text-gray-400">大会閲覧データがありません（まだログが記録されていません）</p>
          </div>
        )}
      </div>

      {/* Product stats */}
      {productStats.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">特産品クリック集計</h3>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-200">
                  <th className="px-4 py-2 text-left font-medium">特産品名</th>
                  <th className="px-4 py-2 text-center font-medium">クリック数</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productStats.map(({ product, clicks }) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 font-medium text-navy-800">{product.name}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tag stats */}
      {tagStats.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">検索・フィルタタグ集計（Top 10）</h3>
          <div className="flex flex-wrap gap-2">
            {tagStats.map(([tag, count]) => (
              <span
                key={tag}
                className="bg-orange-50 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-full border border-orange-200"
              >
                {tag}: {count}回
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={refresh}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <RotateCcw size={15} /> 表示を更新
        </button>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <Trash2 size={15} /> ログを削除
        </button>
        <button
          onClick={handleResetAll}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <Trash2 size={15} /> 全管理設定をリセット
        </button>
      </div>
    </div>
  );
}

// --- Main AdminPage ---

const MAIN_TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'featured', label: 'トップ表示', icon: <Star size={15} /> },
  { id: 'eventManage', label: '大会管理', icon: <CalendarDays size={15} /> },
  { id: 'data', label: 'データ確認', icon: <BarChart2 size={15} /> },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('featured');
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg: string) => setToast(msg), []);
  const hideToast = useCallback(() => setToast(''), []);

  const handleLogout = () => {
    logoutAdmin();
    window.location.href = '/admin/login';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-navy-800 mb-1">管理画面</h1>
          <p className="text-sm text-gray-500">設定はブラウザのlocalStorageに保存されます。</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 font-medium transition-colors"
        >
          ログアウト
        </button>
      </div>

      {/* Main tab bar */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-2xl p-1">
        {MAIN_TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex-1 justify-center ${
              tab === id ? 'bg-white text-navy-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {tab === 'featured' && <FeaturedTab onSave={showToast} />}
        {tab === 'eventManage' && <EventManageContainer onSave={showToast} />}
        {tab === 'data' && <DataTab onSave={showToast} />}
      </div>

      {toast && <Toast message={toast} onClose={hideToast} />}
    </div>
  );
}
