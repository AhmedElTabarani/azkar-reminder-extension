import { ContentStrategy } from './content-strategy.interface.js';
import {
  ContentType,
  SourceType,
  type BaseContentItem,
  type MagmuAzkarRawItem,
} from '../../types/content.types.js';
import * as cache from '../../utils/cache.js';

export class MagmuAzkarStrategy extends ContentStrategy {
  async loadContent(filePath: string): Promise<BaseContentItem[]> {
    let data = cache.get(filePath);

    if (!data) {
      const res = await fetch(filePath);
      data = (await res.json()) as MagmuAzkarRawItem[];
      cache.set(filePath, data);
    }

    return this.normalizeData(data);
  }

  normalizeData(data: MagmuAzkarRawItem[]): BaseContentItem[] {
    return data.map((item) => {
      const sourceType =
        item.type === 'quran' || item.type === 'quran-derived'
          ? SourceType.QURAN
          : SourceType.HADITH;

      return {
        id: item.id,
        category: 'أدعية من كتاب مجموع الأذكار',
        content: item.text,
        type: ContentType.DUAA_MAGMU_AZKAR,
        source:
          sourceType === SourceType.QURAN
            ? {
                type: SourceType.QURAN,
                quran: item.quranSource
                  ? [item.quranSource]
                  : [],
              }
            : {
                type: SourceType.HADITH,
                hadith: item.hadithSources
                  ? [
                      item.hadithSources.map((hs) => ({
                        hadithId: hs.hadithId,
                        hadithText: hs.hadithText,
                        rawi: hs.rawi,
                        mohdith: hs.mohdith,
                        book: hs.book,
                        numberOrPage: hs.numberOrPage,
                        grade: hs.grade,
                        takhrij: hs.takhrij,
                      })),
                    ]
                  : [],
              },
        additionalInfo: {
          footnote: item.footnote,
          sourceType: item.type,
          ...(item.narrations
            ? { narrations: item.narrations }
            : {}),
        },
      };
    });
  }

  getContextMessage(item: BaseContentItem): string | null {
    if (item.additionalInfo?.footnote) {
      return item.additionalInfo.footnote;
    }

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
