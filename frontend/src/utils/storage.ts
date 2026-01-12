const STORAGE_PREFIX = 'vibesnet:'

export function saveToStorage<T> (key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data)
    localStorage.setItem(STORAGE_PREFIX + key, serialized)
  } catch (error) {
    console.error(`Failed to save to localStorage: ${key}`, error)
  }
}

export function loadFromStorage<T> (key: string): T | null {
  try {
    const serialized = localStorage.getItem(STORAGE_PREFIX + key)
    if (serialized === null) return null
    return JSON.parse(serialized) as T
  } catch (error) {
    console.error(`Failed to load from localStorage: ${key}`, error)
    return null
  }
}

export function removeFromStorage (key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key)
}
