import * as cache from '../utils/cache.js';

export class DuaaService {
  static filePath =
    '../duaa/100-duaa-from-the-book-and-authentic-sunnah.json';

  static getRandomDuaa(data) {
    const index = Math.floor(Math.random() * data.length);
    return {
      index,
      value: data[index],
    };
  }

  static getDuaaContextMessage(data, id, index) {
    const duaa = data[id - 1];
    if (duaa.source.quran != null) {
      const { surah, ayah } = duaa.source.quran[index];
      let message = `سورة: ${surah.name}، آية: `;

      if (ayah.from === ayah.to) message += `${ayah.from}`;
      else message += `من ${ayah.from} إلى ${ayah.to}`;

      return message;
    }

    if (duaa.source.hadith != null) {
      const hadith = duaa.source.hadith[index][0];
      return `المصدر: ${hadith.book}، رقم الحديث أوالصفحة: ${hadith.numberOrPage}`;
    }
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
