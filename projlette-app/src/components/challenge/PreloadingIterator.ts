// Iterator Pattern

interface IIterator {
  next(): IAggregate;
  // Return the object in collection
  hasNext(): boolean;
  // Returns Boolean whether at end of collection or not
}

/**
 * @class PreloadingIterator
 * @implements IIterator
 * @description Iterator for infinitely preload and cache items from a source
 */
export default class PreloadingIterator implements IIterator {
  private collection: IAggregate[];
  private position: number;
  private generator: (count) => IAggregate[];
  private chunkSize: number;

  constructor(generator: (count) => IAggregate[], chunkSize: number) {
    this.collection = [];
    this.position = 0;
    this.generator = generator;
    this.chunkSize = chunkSize;
  }

  preloadCache(count: number = this.chunkSize): void {
    this.collection = this.collection.concat(this.generator(count));
  }

  next(): IAggregate {
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

  get(index: number): IAggregate {
    return this.collection[index];
  }

  map(callback: (item: IAggregate) => IAggregate): IAggregate[] {
    return this.collection.map(callback);
  }
}
