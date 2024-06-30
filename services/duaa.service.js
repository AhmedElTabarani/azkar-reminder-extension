import * as cache from '../utils/cache.js';

export class DuaaService {
  static filePath =
    '../duaa/100-duaa-from-the-book-and-authentic-sunnah.json';

  static getRandomDuaa(data) {
    return data[Math.floor(Math.random() * data.length)];
  }

  static async loadAllDuaa() {
    let data;
    data = await cache.get(this.filePath);

    if (data) {
      return data;
    }

    const res = await fetch(this.filePath);
    data = await res.json();
    cache.set(this.filePath, data);
    return data;
  }
}
