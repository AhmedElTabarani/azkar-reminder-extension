import { ContentStrategy } from './content-strategy.interface.js';
import {
  type BaseContentItem,
  type AzkarItem,
  SourceType,
  ContentType,
} from '../../types/content.types.js';
import * as cache from '../../utils/cache.js';

/**
 * Strategy for loading and normalizing Azkar content
 */
export class AzkarMorningAndEveningStrategy extends ContentStrategy {
  async loadContent(filePath: string): Promise<BaseContentItem[]> {
    let data = cache.get(filePath);

    if (!data) {
      const res = await fetch(filePath);
      data = (await res.json()) as AzkarItem[];
      cache.set(filePath, data);
    }

    return this.normalizeData(data);
  }

  normalizeData(data: AzkarItem[]): BaseContentItem[] {
    return data.map((item) => ({
      id: item.order,
      category: item.type === 0 ? 'أذكار الصباح والمساء' : 'أذكار',
      content: [item.content], // Wrap single content in array for consistency with other strategies
      type: ContentType.AZKAR_MORNING_EVENING,
      source: {
        text: item.source,
        type: SourceType.MIXED,
      },
      additionalInfo: {
        fadl: item.fadl,
        count: item.count,
        countDescription: item.count_description,
        order: item.order,
        audio: item.audio,
        hadithText: item.hadith_text,
        explanationOfHadithVocabulary:
          item.explanation_of_hadith_vocabulary,
      },
    }));
  }

  /**
   * Get context message for Azkar
   * @param item - Azkar item
   * @returns Context message
   */
  getContextMessage(item: BaseContentItem): string {
    let context = item.source.text || '';
    if (item.additionalInfo?.countDescription) {
      context += ` - ${item.additionalInfo.countDescription}`;
    }
    return context;
  }
}
