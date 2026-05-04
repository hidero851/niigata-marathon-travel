import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy-800 text-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="font-black text-xl mb-2">マラソンナビ</div>
            <p className="text-navy-200 text-sm leading-relaxed">
              マラソン大会をきっかけに、宿泊・食・特産までまとめて見つけられる地域体験プラットフォーム
            </p>
          </div>

          <div>
            <div className="font-bold mb-3 text-navy-100">サイトマップ</div>
            <ul className="space-y-2 text-sm text-navy-300">
              <li><Link to="/" className="hover:text-white transition-colors">トップ</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">大会一覧</Link></li>
              <li><Link to="/datasource" className="hover:text-white transition-colors">データソース確認</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold mb-3 text-navy-100">免責・利用について</div>
            <p className="text-navy-300 text-xs leading-relaxed">
              掲載情報は仮データです。実際の大会情報・宿泊情報・特産品情報については、各公式サイトでご確認ください。
              掲載内容の正確性について保証しません。
            </p>
          </div>
        </div>

        <div className="border-t border-navy-700 pt-6 text-center text-navy-400 text-xs">
          <p>© 2026 マラソンナビ</p>
          <p className="mt-1">本サイトは開発中のMVPです。掲載情報はすべて仮データです。</p>
        </div>
      </div>
    </footer>
  );
}
