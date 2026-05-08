import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet>
        <title>プライバシーポリシー | 新潟マラソンナビ</title>
        <meta name="description" content="新潟マラソンナビのプライバシーポリシーです。" />
      </Helmet>

      <h1 className="text-2xl font-black text-navy-800 mb-8">プライバシーポリシー</h1>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-navy-800 mb-3">1. 基本方針</h2>
          <p>新潟マラソンナビ（以下「当サイト」）は、利用者の個人情報の保護を重要と考え、適切な管理・利用に努めます。</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-navy-800 mb-3">2. アクセス解析ツールについて</h2>
          <p>当サイトでは、Googleが提供するアクセス解析ツール「Google アナリティクス」を利用しています。Google アナリティクスはCookieを使用してデータを収集しますが、このデータは匿名で収集されており、個人を特定するものではありません。</p>
          <p className="mt-2">Google アナリティクスのデータ収集を無効にする場合は、<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">Google アナリティクス オプトアウト アドオン</a>をご利用ください。</p>
          <p className="mt-2">Google のプライバシーポリシーについては<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">こちら</a>をご確認ください。</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-navy-800 mb-3">3. Cookieについて</h2>
          <p>当サイトではアクセス解析のためにCookieを使用しています。ブラウザの設定によりCookieを無効にすることが可能ですが、一部機能が利用できなくなる場合があります。</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-navy-800 mb-3">4. アフィリエイトについて</h2>
          <p>当サイトは楽天アフィリエイトプログラムに参加しています。宿泊施設へのリンクをクリックし予約が成立した場合、当サイトに報酬が発生することがあります。利用者の方に追加費用は一切発生しません。</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-navy-800 mb-3">5. 免責事項</h2>
          <p>当サイトに掲載している情報の正確性には万全を期していますが、内容の完全性・正確性・有用性を保証するものではありません。掲載情報は予告なく変更される場合があります。当サイトの利用によって生じた損害について、一切の責任を負いかねます。</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-navy-800 mb-3">6. 著作権</h2>
          <p>当サイトのコンテンツ（文章・画像等）の著作権は当サイト運営者に帰属します。無断転載・複製を禁止します。</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-navy-800 mb-3">7. プライバシーポリシーの変更</h2>
          <p>本ポリシーは必要に応じて変更することがあります。変更後のポリシーはこのページに掲載した時点から効力を生じます。</p>
        </section>

        <p className="text-xs text-gray-400 pt-4">制定日：2026年5月</p>
      </div>
    </div>
  );
}
