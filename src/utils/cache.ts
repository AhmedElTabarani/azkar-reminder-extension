/**
 * Simple in-memory cache for content data
 */

const cache = new Map<string, any>();

/**
 * Store data in cache
 * @param key - Cache key
 * @param data - Data to store
 */
export const set = (key: string, data: any): void => {
  cache.set(key, data);
};

/**
 * Retrieve data from cache
 * @param key - Cache key
 * @returns Cached data or null if not found
 */
export const get = (key: string): any | null => {
  return cache.get(key) || null;
};

/**
 * Clear all cached data
 */
export const clear = (): void => {
  cache.clear();
};

/**
 * Remove specific item from cache
 * @param key - Cache key to remove
 */
export const remove = (key: string): boolean => {
  return cache.delete(key);
};

/**
 * Check if key exists in cache
 * @param key - Cache key to check
 */
export const has = (key: string): boolean => {
  return cache.has(key);
};

/**
 * Get cache size
 */
export const size = (): number => {
  return cache.size;
};
