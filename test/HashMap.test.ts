import { HashMap } from '../src/index';

const testEntries: [number, string][] = [
  [0, 'a'],
  [1, 'b'],
  [2, 'c'],
];

const testComplexEntries: [object | string, string][] = [
  [{ idx: 0, flag: true }, 'a'],
  [{ flag: true, idx: 1 }, 'b'],
  [{ idx: 2, flag: true }, 'c'],
  // Test objectSorter representation for collisions
  ['{flag:1,idx:0}', 'not a'],
  ['{flag:1,idx:1}', 'not b'],
  ['{flag:1,idx:2}', 'not c'],
  // Test JSON representation for collisions
  [JSON.stringify({ idx: 0, flag: true }), 'not a'],
  [JSON.stringify({ flag: true, idx: 1 }), 'not b'],
  [JSON.stringify({ idx: 2, flag: true }), 'not c'],
  [[0], 'a'],
  [[1], 'b'],
  [[2], 'c'],
];

describe('HashMap', () => {
  it('is an ES6 Map', () => {
    expect(new HashMap()).toBeInstanceOf(Map);
  });

  describe('clear', () => {
    it('empties the map', () => {
      const map = new HashMap(testEntries);
      expect(map.size).toBeGreaterThan(0);
      map.clear();
      expect(map.size).toBe(0);
    });
  });

  describe('delete', () => {
    it('removes an entry from the map', () => {
      const map = new HashMap(testEntries);
      expect(map.delete(0)).toBe(true);
      expect(map.get(0)).toBeUndefined();
    });
    it('returns false if the key is not in the map', () => {
      const map = new HashMap(testEntries);
      expect(map.delete(-1)).toBe(false);
    });
  });

  describe('forEach', () => {
    it('iterates over the map and invokes a callback on each entry', () => {
      const map = new HashMap(testEntries);
      const callback = jest.fn();
      map.forEach(callback);
      expect(callback).toBeCalledTimes(map.size);
      for (const [key, value] of testEntries) {
        expect(callback).toBeCalledWith(value, key, map);
      }
    });
    it('optionally provides thisArg to the callback', () => {
      const map = new HashMap(testEntries);
      const thisArg = {};
      map.forEach(function (this: unknown) {
        expect(this).toBeUndefined();
      }, undefined);
      map.forEach(function (this: unknown) {
        expect(this).toBeUndefined();
      }, null);
      map.forEach(function (this: unknown) {
        expect(this).toBe(thisArg);
      }, thisArg);
    });
  });

  describe('get', () => {
    it('gets a value from the map', () => {
      const map = new HashMap(testEntries);
      expect(map.get(1)).toBe('b');
    });
    it('returns undefined if the key is not in the map', () => {
      const map = new HashMap(testEntries);
      expect(map.get(-1)).toBeUndefined();
    });
    it('supports object and array keys', () => {
      const map = new HashMap(testComplexEntries);
      expect(map.get({ idx: 0, flag: true })).toBe('a');
      expect(map.get({ flag: true, idx: 0 })).toBe('a');
      expect(map.get({ idx: -1 })).toBeUndefined();
      expect(map.get([0])).toBe('a');
      expect(map.get([-1])).toBeUndefined();
    });
  });

  describe('has', () => {
    it('returns true if the key is in the map', () => {
      const map = new HashMap(testEntries);
      expect(map.has(1)).toBe(true);
    });
    it('returns false if the key is not in the map', () => {
      const map = new HashMap(testEntries);
      expect(map.has(-1)).toBe(false);
    });
    it('supports object and array keys', () => {
      const map = new HashMap(testComplexEntries);
      expect(map.has({ idx: 0, flag: true })).toBe(true);
      expect(map.has({ idx: -1 })).toBe(false);
      expect(map.has([0])).toBe(true);
      expect(map.has([-1])).toBe(false);
    });
  });

  describe('set', () => {
    it('sets a key-value pair', () => {
      const map = new HashMap(testEntries);
      expect(map.get(3)).toBeUndefined();
      map.set(3, 'd');
      expect(map.get(3)).toBe('d');
    });
    it('overwrites existing values', () => {
      const map = new HashMap(testEntries);
      expect(map.get(0)).toBe('a');
      map.set(0, 'd');
      expect(map.get(0)).toBe('d');
    });
    it('supports object and array keys', () => {
      const map = new HashMap(testComplexEntries);
      map.set({ foo: 'bar' }, 'z');
      map.set(['foo', 'bar', 'baz'], 'a');
      expect(map.get({ foo: 'bar' })).toBe('z');
      expect(map.get(['foo', 'bar', 'baz'])).toBe('a');
    });
    it('has a fluent interface', () => {
      const map = new HashMap(testEntries);
      expect(map.set(3, 'd')).toBe(map);
    });
  });

  describe('size', () => {
    it('counts the number of entries in the map', () => {
      const map = new HashMap(testEntries);
      expect(map.size).toBe(testEntries.length);
    });
  });

  describe('entries', () => {
    it('iterates over all entries in the map', () => {
      const map = new HashMap(testEntries);
      const entries = [...map.entries()];
      expect(entries).toEqual(testEntries);
    });
  });

  describe('keys', () => {
    it('iterates over all keys in the map', () => {
      const map = new HashMap(testEntries);
      const keys = [...map.keys()];
      expect(keys).toEqual(testEntries.map((entry) => entry[0]));
    });
  });

  describe('values', () => {
    it('iterates over all values in the map', () => {
      const map = new HashMap(testEntries);
      const values = [...map.values()];
      expect(values).toEqual(testEntries.map((entry) => entry[1]));
    });
  });

  describe('[Symbol.iterator]', () => {
    it('iterates over all entries in the map', () => {
      const map = new HashMap(testEntries);
      const entries = [...map];
      expect(entries).toEqual(testEntries);
    });
  });

  describe('[Symbol.toStringTag]', () => {
    it('has a custom string tag', () => {
      expect(new HashMap().toString()).toBe('[object Map]');
    });
  });
});
