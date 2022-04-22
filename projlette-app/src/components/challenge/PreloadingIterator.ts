// Iterator Pattern

interface IIterator<T> {
  next(): T;
  // Return the object in collection
  hasNext(): boolean;
  // Returns Boolean whether at end of collection or not
}

/**
 * @class PreloadingIterator
 * @implements IIterator
 * @description Iterator for infinitely preload and cache items from a source
 */
export default class PreloadingIterator<T> implements IIterator<T> {
  private collection: T[];
  private position: number;
  private generator: (count) => T[];
  private chunkSize: number;

  constructor(generator: (count) => T[], chunkSize: number) {
    this.collection = [];
    this.position = 0;
    this.generator = generator;
    this.chunkSize = chunkSize;
  }

  preloadCache(count: number = this.chunkSize): void {
    this.collection = this.collection.concat(this.generator(count));
  }

  next(): T {
    if (this.position >= this.collection.length - 1 - this.chunkSize) {
      this.preloadCache(this.chunkSize);
    }
    const item = this.collection[this.position];
    this.position++;
    return item;
  }

  hasNext(): boolean {
    return true;
  }

  get(index: number): T {
    return this.collection[index];
  }

  map<K>(callback: (item: T, index?: number) => K): K[] {
    return this.collection.map(callback);
  }
}
