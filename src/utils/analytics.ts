import type { UserEventLog } from '../types';

const LOG_KEY = 'niigata_marathon_logs';

export function trackEvent(log: Omit<UserEventLog, 'timestamp'>): void {
  const fullLog: UserEventLog = { ...log, timestamp: new Date().toISOString() };

  console.log('[Analytics]', fullLog);

  try {
    const existing = localStorage.getItem(LOG_KEY);
    const logs: UserEventLog[] = existing ? JSON.parse(existing) : [];
    logs.push(fullLog);
    localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(-500)));
  } catch {
    // localStorage unavailable
  }

  // Future: await fetch('/api/analytics', { method: 'POST', body: JSON.stringify(fullLog) });
}

export function getLogs(): UserEventLog[] {
  try {
    const existing = localStorage.getItem(LOG_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch {
    return [];
  }
}

export function clearLogs(): void {
  localStorage.removeItem(LOG_KEY);
}
