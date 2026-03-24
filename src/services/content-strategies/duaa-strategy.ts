import { ContentStrategy } from './content-strategy.interface.js';
import {
  ContentType,
  SourceType,
  type BaseContentItem,
  type Duaa100RawItem,
  type Duaa100RawQuranRef,
  type Duaa100RawHadithRef,
} from '../../types/content.types.js';
import * as cache from '../../utils/cache.js';

export class DuaaStrategy extends ContentStrategy {
  async loadContent(filePath: string): Promise<BaseContentItem[]> {
    let data = cache.get(filePath);

    if (!data) {
      const res = await fetch(filePath);
      data = (await res.json()) as Duaa100RawItem[];
      cache.set(filePath, data);
    }

    return this.normalizeData(data);
  }

  normalizeData(data: Duaa100RawItem[]): BaseContentItem[] {
    const items: BaseContentItem[] = [];

    for (const rawItem of data) {
      for (const duaaEntry of rawItem.duaa) {
        const sourceType =
          duaaEntry.source.type === 'quran'
            ? SourceType.QURAN
            : SourceType.HADITH;

        items.push({
          id: rawItem.id,
          category: rawItem.category,
          content: duaaEntry.text,
          type: ContentType.DUAA_100,
          source:
            sourceType === SourceType.QURAN
              ? {
                  type: SourceType.QURAN,
                  quran: (
                    duaaEntry.source
                      .references as Duaa100RawQuranRef[]
                  ).map((ref) => ({
                    surah: {
                      number: ref.surah.number,
                      name: ref.surah.name,
                    },
                    ayah: ref.ayah,
                  })),
                }
              : {
                  type: SourceType.HADITH,
                  hadith: [
                    (
                      duaaEntry.source
                        .references as Duaa100RawHadithRef[]
                    ).map((ref) => ({
                      rawi: ref.rawi,
                      mohdith: ref.mohdith,
                      book: ref.book,
                      numberOrPage: ref.numberOrPage,
                      grade: ref.grade,
                      takhrij: ref.takhrij,
                    })),
                  ],
                },
          additionalInfo: duaaEntry.vocabulary
            ? { vocabulary: duaaEntry.vocabulary }
            : null,
        });
      }
    }

    return items;
  }

  getContextMessage(item: BaseContentItem): string | null {
    if (!item.source) return null;

    if (
      item.source.type === SourceType.QURAN &&
      item.source.quran?.length
    ) {
      const { surah, ayah } = item.source.quran[0];
      let message = `سورة: ${surah.name}، آية: `;

      if (ayah.from === ayah.to) {
        message += `${ayah.from}`;
      } else {
        message += `من ${ayah.from} إلى ${ayah.to}`;
      }

      return message;
    } else if (
      item.source.type === SourceType.HADITH &&
      item.source.hadith?.length &&
      item.source.hadith[0]?.length
    ) {
      const hadith = item.source.hadith[0][0];
      return `المصدر: ${hadith.book}، رقم الحديث أو الصفحة: ${hadith.numberOrPage}`;
    }

    return null;
  }
}
