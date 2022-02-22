import equal from 'fast-deep-equal';
import objectSorter, {
  SorterOptions,
  StringifyFn,
} from 'node-object-hash/dist/objectSorter';

export type HashKey = string | number | symbol;
export type Entry<K, V> = [K, V];
export type Bucket<K, V> = Entry<K, V>[];

/**
 * HashMap implementation capable of supporting object and array keys.
 * `node-object-hash` is used for hashing.
 * `fast-deep-equal` is used for key comparison.
 *
 * @export
 * @class HashMap
 * @implements {Map<K, V>}
 * @template K key type
 * @template V value type
 */
export class HashMap<K, V> extends Map<K, V> {
  protected readonly stringify: StringifyFn;
  protected readonly map: Map<HashKey, Bucket<K, V>>;

  constructor(entries?: Entry<K, V>[] | null, options?: SorterOptions) {
    super();
    this.stringify = objectSorter(options);
    this.map = new Map<HashKey, Bucket<K, V>>();
    for (const [key, value] of entries ?? []) {
      this.set(key, value);
    }
  }

  /** Hashes a key to a value type. */
  protected hash(key: K): HashKey {
    return this.stringify(key);
  }

  /** Determines if keys are equivalent. */
  protected is(a: K, b: K): boolean {
    return equal(a, b);
  }

  clear(): void {
    this.map.clear();
  }

  delete(key: K): boolean {
    const hashKey = this.hash(key);
    // Find bucket
    const bucket = this.map.get(hashKey);
    if (!bucket) {
      return false;
    }

    // Find entry
    const idx = bucket.findIndex((entry) => this.is(key, entry[0]));
    if (idx === -1) {
      return false;
    }

    // Delete entry from bucket
    bucket.splice(idx, 1);

    // Delete bucket if empty
    if (bucket.length === 0) {
      this.map.delete(hashKey);
    }

    return true;
  }

  forEach(
    callbackfn: (value: V, key: K, map: this) => void,
    thisArg?: any
  ): void {
    // Bind thisArg to callback
    if (thisArg != null) {
      callbackfn = callbackfn.bind(thisArg);
    }
    this.map.forEach((bucket) => {
      bucket.forEach((entry) => {
        callbackfn(entry[1], entry[0], this);
      }, thisArg);
    });
  }

  get(key: K): V | undefined {
    const hashKey = this.hash(key);
    const bucket = this.map.get(hashKey);
    const entry = bucket?.find((entry) => this.is(key, entry[0]));
    return entry?.[1];
  }

  has(key: K): boolean {
    const hashKey = this.hash(key);
    const bucket = this.map.get(hashKey);
    const entry = bucket?.find((entry) => this.is(key, entry[0]));
    return !!entry;
  }

  set(key: K, value: V): this {
    const newEntry: Entry<K, V> = [key, value];
    const hashKey = this.hash(key);
    let bucket = this.map.get(hashKey);
    if (!bucket) {
      // Create a new bucket if needed
      this.map.set(hashKey, [newEntry]);
    } else {
      // Check if the key is in the bucket
      const idx = bucket.findIndex((entry) => this.is(key, entry[0]));
      if (idx < 0) {
        // Add the entry to the bucket
        bucket.push(newEntry);
      } else {
        // Overwrite the existing entry
        bucket[idx] = newEntry;
      }
    }
    return this;
  }

  get size(): number {
    let size = 0;
    for (const bucket of this.map.values()) {
      size += bucket.length;
    }
    return size;
  }

  /**
   * Returns an iterable of entries in the map.
   */
  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  /**
   * Returns an iterable of key, value pairs for every entry in the map.
   */
  *entries(): IterableIterator<[K, V]> {
    for (const bucket of this.map.values()) {
      for (const entry of bucket) {
        yield entry;
      }
    }
  }

  /**
   * Returns an iterable of keys in the map
   */
  *keys(): IterableIterator<K> {
    for (const entry of this.entries()) {
      yield entry[0];
    }
  }

  /**
   * Returns an iterable of values in the map
   */
  *values(): IterableIterator<V> {
    for (const entry of this.entries()) {
      yield entry[1];
    }
  }
}
