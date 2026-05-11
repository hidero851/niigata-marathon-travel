import { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, Image, CheckCircle, AlertCircle, Loader, X } from 'lucide-react';
import { parseExcelToEvent, type ImportedEventData } from '../../utils/excelImport';
import { uploadEventImage, type ImageRole } from '../../utils/imageUpload';
import { saveAdminCreatedEvent, saveEventEntryDate, getAdminCreatedEvents } from '../../utils/adminSettings';

type Step = 'idle' | 'preview' | 'images' | 'done';
type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

type ImageSlot = {
  role: ImageRole;
  label: string;
  file: File | null;
  previewUrl: string;
  uploadedUrl: string;
  status: UploadStatus;
};

function buildImageSlots(event: ImportedEventData): ImageSlot[] {
  const slots: ImageSlot[] = [
    { role: 'hero', label: 'ヒーロー画像', file: null, previewUrl: '', uploadedUrl: event.heroImageUrl ?? '', status: 'idle' },
  ];
  (event.highlights ?? []).forEach((h, i) => {
    slots.push({
      role: `highlight-${i}`,
      label: `ハイライト${i + 1}「${h.title}」`,
      file: null,
      previewUrl: '',
      uploadedUrl: h.imageUrl ?? '',
      status: 'idle',
    });
  });
  return slots;
}

function DropZone({ label, accept, onFile }: { label: string; accept: string; onFile: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
      onClick={() => ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
    >
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <Upload className="mx-auto mb-2 text-gray-400" size={24} />
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xs text-gray-400 mt-1">クリックまたはドラッグ&ドロップ</p>
    </div>
  );
}

export default function ImportPanel() {
  const [step, setStep] = useState<Step>('idle');
  const [event, setEvent] = useState<ImportedEventData | null>(null);
  const [eventId, setEventId] = useState('');
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([]);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');

  function handleExcelFile(file: File) {
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const parsed = parseExcelToEvent(buffer);
        setEvent(parsed);
        setEventId(parsed.id);
        setImageSlots(buildImageSlots(parsed));
        setStep('preview');
      } catch (err) {
        setError(`Excelの読み込みに失敗しました: ${String(err)}`);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function updateSlotFile(index: number, file: File) {
    const url = URL.createObjectURL(file);
    setImageSlots((prev) =>
      prev.map((s, i) => i === index ? { ...s, file, previewUrl: url, status: 'idle' } : s)
    );
  }

  function removeSlotFile(index: number) {
    setImageSlots((prev) =>
      prev.map((s, i) => i === index ? { ...s, file: null, previewUrl: '', status: 'idle' } : s)
    );
  }

  async function handleUploadImages() {
    if (!event) return;
    setImporting(true);
    setError('');
    const finalId = eventId.trim() || event.id;
    const updatedSlots = [...imageSlots];

    for (let i = 0; i < updatedSlots.length; i++) {
      const slot = updatedSlots[i];
      if (!slot.file) continue;
      updatedSlots[i] = { ...slot, status: 'uploading' };
      setImageSlots([...updatedSlots]);
      try {
        const url = await uploadEventImage(finalId, slot.role, slot.file);
        updatedSlots[i] = { ...updatedSlots[i], uploadedUrl: url, status: 'done' };
      } catch (err) {
        updatedSlots[i] = { ...updatedSlots[i], status: 'error' };
        setError(`画像アップロード失敗: ${String(err)}`);
      }
      setImageSlots([...updatedSlots]);
    }
    setImporting(false);
  }

  async function handleImport() {
    if (!event) return;
    setImporting(true);
    setError('');
    try {
      const finalId = eventId.trim() || event.id;

      // 画像URLをイベントデータに反映
      const heroSlot = imageSlots.find((s) => s.role === 'hero');
      const heroUrl = heroSlot?.uploadedUrl || event.heroImageUrl || '';

      const highlights = (event.highlights ?? []).map((h, i) => {
        const slot = imageSlots.find((s) => s.role === `highlight-${i}`);
        return { ...h, imageUrl: slot?.uploadedUrl || h.imageUrl || '' };
      });

      const existing = getAdminCreatedEvents();
      const duplicate = existing.find((e) => e.id === finalId);
      if (duplicate && !window.confirm(`ID「${finalId}」は既に存在します。上書きしますか？`)) {
        setImporting(false);
        return;
      }

      const finalEvent = {
        ...event,
        id: finalId,
        heroImageUrl: heroUrl,
        highlights,
        localProducts: event.localProducts.map((p) => ({ ...p, relatedEventIds: [finalId] })),
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { entryStartDate, entryEndDate, ...eventData } = finalEvent;
      saveAdminCreatedEvent(eventData);

      if (entryStartDate || entryEndDate) {
        saveEventEntryDate({ eventId: finalId, entryStartDate, entryEndDate });
      }

      setStep('done');
    } catch (err) {
      setError(`インポートに失敗しました: ${String(err)}`);
    }
    setImporting(false);
  }

  function reset() {
    setStep('idle');
    setEvent(null);
    setEventId('');
    setImageSlots([]);
    setError('');
  }

  if (step === 'done') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <CheckCircle className="mx-auto mb-3 text-green-500" size={48} />
        <h3 className="text-xl font-bold text-green-800 mb-2">インポート完了！</h3>
        <p className="text-green-700 mb-4">「{event?.name}」を管理画面に登録しました。</p>
        <button onClick={reset} className="btn-primary">続けてインポート</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Excel選択 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileSpreadsheet className="text-green-600" size={24} />
          <h3 className="text-lg font-bold text-navy-800">Step 1：Excelファイルを選択</h3>
        </div>
        {step === 'idle' ? (
          <DropZone label="大会情報入力テンプレート（.xlsx）" accept=".xlsx" onFile={handleExcelFile} />
        ) : (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <CheckCircle size={18} />
            <span>{event?.name} を読み込みました</span>
            <button onClick={reset} className="ml-auto text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
        )}
      </div>

      {/* Step 2: プレビュー・ID確認 */}
      {step !== 'idle' && event && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-navy-800 mb-4">Step 2：内容確認・ID設定</h3>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">大会ID（Excelから自動読み取り・編集可）</label>
            <input
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm font-mono ${eventId.startsWith('imported-') ? 'border-orange-300 bg-orange-50' : 'border-gray-300'}`}
              placeholder="例: takada-castle-road-race"
            />
            {eventId.startsWith('imported-') && (
              <p className="text-xs text-orange-500 mt-1">⚠ ExcelのシートにIDが未入力です。このまま登録すると自動IDになります。</p>
            )}
            {!eventId.startsWith('imported-') && (
              <p className="text-xs text-gray-400 mt-1">既存のIDを入力すると上書きになります</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['大会名', event.name],
              ['開催地', `${event.prefecture} ${event.location}`],
              ['開催日', event.date],
              ['種目', event.distances.join(' / ')],
              ['参加費', event.fee],
              ['キャッチコピー', event.catchCopy],
              ['エントリー', event.entryPeriod ?? ''],
              ['主催者', event.organizer ?? ''],
            ].map(([k, v]) => (
              <div key={k} className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-0.5">{k}</div>
                <div className="font-medium text-gray-800 line-clamp-2">{v || '—'}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-500 space-y-0.5">
            <div>ハイライト: {event.highlights?.length ?? 0}件 ／ 特産品: {event.localProducts?.length ?? 0}件 ／ 宿泊エリア: {event.accommodations?.length ?? 0}件 ／ モデルプラン: {event.modelPlans?.length ?? 0}件</div>
            {event.entryStartDate && <div>エントリー開始: {event.entryStartDate} ／ 締切: {event.entryEndDate}</div>}
          </div>
        </div>
      )}

      {/* Step 3: 画像アップロード */}
      {step !== 'idle' && event && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Image className="text-blue-600" size={24} />
            <h3 className="text-lg font-bold text-navy-800">Step 3：画像アップロード（任意）</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imageSlots.map((slot, i) => (
              <div key={slot.role} className="border border-gray-200 rounded-xl p-4">
                <div className="text-sm font-bold text-gray-700 mb-2">{slot.label}</div>
                {slot.previewUrl || slot.uploadedUrl ? (
                  <div className="relative">
                    <img
                      src={slot.previewUrl || slot.uploadedUrl}
                      alt={slot.label}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    {slot.status === 'done' && <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">アップロード済</div>}
                    {slot.status === 'uploading' && <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><Loader size={10} className="animate-spin" />アップロード中</div>}
                    {slot.file && slot.status !== 'done' && (
                      <button onClick={() => removeSlotFile(i)} className="text-xs text-red-500 hover:text-red-700">削除して選び直す</button>
                    )}
                  </div>
                ) : (
                  <DropZone label="画像を選択（JPG / PNG）" accept="image/*" onFile={(f) => updateSlotFile(i, f)} />
                )}
              </div>
            ))}
          </div>
          {imageSlots.some((s) => s.file && s.status === 'idle') && (
            <button
              onClick={handleUploadImages}
              disabled={importing}
              className="mt-4 w-full btn-primary flex items-center justify-center gap-2"
            >
              {importing ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
              画像をアップロード
            </button>
          )}
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* インポート実行ボタン */}
      {step !== 'idle' && event && (
        <button
          onClick={handleImport}
          disabled={importing}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-lg rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {importing ? <Loader size={20} className="animate-spin" /> : <CheckCircle size={20} />}
          大会情報をインポート
        </button>
      )}
    </div>
  );
}
