import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus('sending');
    try {
      const res = await fetch(import.meta.env.VITE_FORMSPREE_URL, {
        method: 'POST',
        body: new FormData(formRef.current),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('success');
        formRef.current.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Helmet>
        <title>お問い合わせ | 新潟マラソンナビ</title>
        <meta name="description" content="新潟マラソンナビへのお問い合わせはこちら。" />
      </Helmet>

      <h1 className="text-2xl font-black text-navy-800 mb-2">お問い合わせ</h1>
      <p className="text-sm text-gray-500 mb-8">
        ご質問・掲載のご希望など、お気軽にご連絡ください。<br />
        2〜3営業日以内にご返信いたします。
      </p>

      {status === 'success' ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="font-bold text-green-800 text-lg mb-2">送信が完了しました</p>
          <p className="text-sm text-green-700">
            お問い合わせありがとうございます。<br />
            2〜3営業日以内にご連絡いたします。
          </p>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              お問い合わせ種別 <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              required
              defaultValue=""
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              <option value="" disabled>選択してください</option>
              <option value="大会情報掲載希望">大会情報掲載希望</option>
              <option value="特産品情報掲載希望">特産品情報掲載希望</option>
              <option value="宿泊掲載希望">宿泊掲載希望</option>
              <option value="その他">その他</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                お名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="山田 太郎"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                事業者名
                <span className="text-gray-400 font-normal text-xs ml-1">（掲載希望の方）</span>
              </label>
              <input
                type="text"
                name="company_name"
                placeholder="○○旅館"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="info@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                電話番号
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="025-000-0000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              お問い合わせ内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="お問い合わせ内容をご記入ください。"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              送信に失敗しました。時間をおいて再度お試しいただくか、直接メールでご連絡ください。
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            {status === 'sending' ? '送信中...' : '送信する'}
          </button>
        </form>
      )}
    </div>
  );
}
