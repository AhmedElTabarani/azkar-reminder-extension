import { DuaaStrategy } from './content-strategies/duaa-strategy.js';
import { AzkarMorningAndEveningStrategy } from './content-strategies/azkar-morning-and-evening-strategy.js';
import { ContentStrategy } from './content-strategies/content-strategy.interface.js';
import {
  ContentType,
  BaseContentItem,
  RandomContentResult,
} from '../types/content.types.js';

/**
 * Content Manager using Strategy Pattern
 * Manages different content loading strategies and provides normalized responses
 */
export class ContentManager {
  private strategies: Map<ContentType, ContentStrategy>;
  private contentPaths: Map<ContentType, string>;

  constructor() {
    this.strategies = new Map();
    this.contentPaths = new Map();

    this.initializeStrategies();
    this.initializeContentPaths();
  }
  /**
   * Initialize all available strategies
   */
  private initializeStrategies(): void {
    this.strategies.set(ContentType.DUAA_100, new DuaaStrategy());
    this.strategies.set(
      ContentType.AZKAR_MORNING_EVENING,
      new AzkarMorningAndEveningStrategy(),
    );
  }
  /**
   * Initialize content file paths
   */
  private initializeContentPaths(): void {
    this.contentPaths.set(
      ContentType.DUAA_100,
      '../content/100-duaa-from-the-book-and-authentic-sunnah.json',
    );
    this.contentPaths.set(
      ContentType.AZKAR_MORNING_EVENING,
      '../content/morning-and-evening/ar.json',
    );
  }
  /**
   * Load content by type using the appropriate strategy
   * @param contentType - The type of content to load
   * @returns Promise resolving to normalized content data
   * @throws Error if content type is not supported
   */
  async loadContentByType(
    contentType: ContentType,
  ): Promise<BaseContentItem[]> {
    if (contentType === ContentType.RANDOM) {
      const availableTypes = Array.from(this.strategies.keys());
      const randomIndex = Math.floor(
        Math.random() * availableTypes.length,
      );
      contentType = availableTypes[randomIndex];
    }

    const strategy = this.strategies.get(contentType);
    const filePath = this.contentPaths.get(contentType);

    if (!strategy) {
      throw new Error(
        `No strategy found for content type: ${contentType}`,
      );
    }

    if (!filePath) {
      throw new Error(
        `No file path found for content type: ${contentType}`,
      );
    }

    return await strategy.loadContent(filePath);
  }
  /**
   * Get random content from any content type
   * @param contentType - The type of content
   * @returns Promise resolving to random content with normalized structure
   */
  async getRandomContent(
    contentType: ContentType,
  ): Promise<RandomContentResult> {
    if (contentType === ContentType.RANDOM) {
      const availableTypes = Array.from(this.strategies.keys());
      const randomIndex = Math.floor(
        Math.random() * availableTypes.length,
      );
      contentType = availableTypes[randomIndex];
    }

    const data = await this.loadContentByType(contentType);
    const strategy = this.strategies.get(contentType)!;

    const { index, value: item } = strategy.getRandomContent(data);

    // Get random content from the content array
    const contentArray = item.content;
    const { index: contentIndex, value: content } =
      strategy.getRandomContent(contentArray);

    return {
      item,
      content,
      contentIndex,
      itemIndex: index,
      contextMessage: strategy.getContextMessage(item, contentIndex),
    };
  }
}
