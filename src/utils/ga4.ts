declare function gtag(...args: unknown[]): void;

export function trackGA4(
  eventName: string,
  params?: Record<string, string | number | undefined>
): void {
  try {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, params);
    }
  } catch {
    // gtag not available
  }
}
