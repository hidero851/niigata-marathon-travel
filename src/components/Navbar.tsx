import { Link, useLocation } from 'react-router-dom';
import { MapPin, Menu, X } from 'lucide-react';
import { useState } from 'react';

const LOGO_SRC = '/images/logo.png?v=2';

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/events', label: '大会を探す' },
    { to: '/datasource', label: 'データ確認' },
    { to: '/admin', label: '管理' },
  ];

  const [logoError, setLogoError] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-[90px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          {!logoError ? (
            <img
              src={LOGO_SRC}
              alt="マラソンナビ"
              className="h-[70px] w-auto object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-navy-800 flex items-center justify-center">
                <MapPin size={18} className="text-white" />
              </div>
              <div className="leading-tight">
                <div className="font-black text-navy-800 text-base tracking-tight">マラソンナビ</div>
                <div className="text-xs text-gray-500 -mt-0.5">MARATHON NAVI</div>
              </div>
            </>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname.startsWith(to)
                  ? 'bg-navy-700 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/events"
            className="ml-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2 px-4 rounded-xl transition-colors shadow-sm"
          >
            新潟の大会を探す
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/events"
            onClick={() => setOpen(false)}
            className="block text-center mt-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2 px-4 rounded-xl transition-colors"
          >
            新潟の大会を探す
          </Link>
        </div>
      )}
    </header>
  );
}
