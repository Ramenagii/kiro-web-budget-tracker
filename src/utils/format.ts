export function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat(navigator.language || 'en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function getStorageSize(): number {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += (localStorage[key].length + key.length) * 2;
    }
  }
  return total / (1024 * 1024);
}

const QUOTA_WARN_MB = 4;

export function isStorageNearQuota(): boolean {
  const size = getStorageSize();
  return size >= QUOTA_WARN_MB;
}
