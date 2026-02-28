const NAMESPACE = 'invoice-generator';

function getKey(key: string): string {
  return `${NAMESPACE}:${key}`;
}

export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(getKey(key));
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getKey(key), JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save to localStorage: ${key}`, error);
  }
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(getKey(key));
  } catch (error) {
    console.error(`Failed to remove from localStorage: ${key}`, error);
  }
}

export function getAllKeys(): string[] {
  if (typeof window === 'undefined') return [];
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(NAMESPACE + ':')) {
      keys.push(key.replace(NAMESPACE + ':', ''));
    }
  }
  return keys;
}
