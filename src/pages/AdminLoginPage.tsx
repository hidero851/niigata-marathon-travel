import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { loginAdmin } from '../utils/auth';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/admin';

  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error: err } = await loginAdmin(password);
    setLoading(false);
    if (!err) {
      navigate(from, { replace: true });
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-navy-800 flex items-center justify-center">
            <Lock size={20} className="text-white" />
          </div>
        </div>

        <h1 className="text-xl font-black text-navy-800 text-center mb-1">管理画面</h1>
        <p className="text-sm text-gray-500 text-center mb-8">パスワードを入力してください</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="パスワード"
            autoFocus
            disabled={loading}
            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 ${
              error ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {error && (
            <p className="text-xs text-red-500 text-center">パスワードが正しくありません</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  );
}
