import type { BaseContentItem } from '../../types/content.types.js';

/**
 * Abstract base class for content loading strategies
 * Implements the Strategy Pattern for different content types
 */
export abstract class ContentStrategy {
  /**
   * Load content from the specified file path
   * @param filePath - The path to the content file
   * @returns Promise resolving to normalized content array
   */
  abstract loadContent(filePath: string): Promise<BaseContentItem[]>;

  /**
   * Normalize the loaded data to a standard format
   * @param data - Raw data from the file
   * @returns Normalized data structure
   */
  abstract normalizeData(data: any): BaseContentItem[];

  /**
   * Get context message for the content item
   * @param item - Content item
   * @param contentIndex - Index of the specific content text
   * @returns Context message or null
   */
  abstract getContextMessage(
    item: BaseContentItem,
    contentIndex?: number,
  ): string | null;

  /**
   * Get random content from the data array
   * @param data - Array of content items
   * @returns Object with index and value
   */
  getRandomContent<T>(data: T[]): { index: number; value: T } {
    const index = Math.floor(Math.random() * data.length);
    return {
      index,
      value: data[index],
    };
  }
}
