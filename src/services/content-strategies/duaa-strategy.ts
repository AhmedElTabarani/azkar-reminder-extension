import { ContentStrategy } from './content-strategy.interface.js';
import {
  ContentType,
  QuranSource,
  SourceType,
  type BaseContentItem,
  type DuaaItem,
} from '../../types/content.types.js';
import * as cache from '../../utils/cache.js';

/**
 * Strategy for loading and normalizing Duaa content
 */
export class DuaaStrategy extends ContentStrategy {
  async loadContent(filePath: string): Promise<BaseContentItem[]> {
    let data = cache.get(filePath);

    if (!data) {
      const res = await fetch(filePath);
      data = (await res.json()) as DuaaItem[];
      cache.set(filePath, data);
    }

    return this.normalizeData(data);
  }

  normalizeData(data: DuaaItem[]): BaseContentItem[] {
    return data.map((item) => ({
      id: item.id,
      category: item.category,
      content: item.duaa, // Array of duaa strings
      type: ContentType.DUAA_100,
      source: {
        type: item.source.quran
          ? SourceType.QURAN
          : SourceType.HADITH,
        quran: item.source.quran || [],
        hadith: item.source.hadith || [],
      },
      additionalInfo: null,
    }));
  }

  /**
   * Get context message for duaa based on source
   * @param item - Duaa item
   * @param contentIndex - Index of the specific duaa text
   * @returns Context message
   */
  getContextMessage(
    item: BaseContentItem,
    contentIndex: number = 0,
  ): string | null {
    if (!item.source) return null;

    if (item.source.type === SourceType.QURAN) {
      const { surah, ayah } = item.source.quran![contentIndex];
      let message = `سورة: ${surah.name}، آية: `;

      if (ayah.from === ayah.to) {
        message += `${ayah.from}`;
      } else {
        message += `من ${ayah.from} إلى ${ayah.to}`;
      }

      return message;
    } else if (item.source.type === SourceType.HADITH) {
      const hadith = item.source.hadith![contentIndex][0];
      return `المصدر: ${hadith.book}، رقم الحديث أو الصفحة: ${hadith.numberOrPage}`;
    }

    return null;
  }
}
