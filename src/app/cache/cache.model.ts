export interface CachedItem<T> {
  /**
   * Timestamp when the data has been cached.
   */
  timestamp: number;
  /**
   * Number of seconds before data expires.
   */
  expiry: number;
  /**
   * Data to cache.
   */
  data: T;
}
