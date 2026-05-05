const SESSION_KEY = 'admin_auth_session';

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(SESSION_KEY) === '1';
}

export function loginAdmin(password: string): boolean {
  const correct = import.meta.env.VITE_ADMIN_PASSWORD;
  if (correct && password === correct) {
    localStorage.setItem(SESSION_KEY, '1');
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  localStorage.removeItem(SESSION_KEY);
}
