import { ContentManager } from './content-manager.js';
import {
  ContentType,
  BaseContentItem,
  RandomContentResult,
  UnifiedContentResponse,
} from '../types/content.types.js';

/**
 * Content Service - Handles all content types using Strategy Pattern
 * Replaces the old DuaaService with a more generic approach
 */
export class ContentService {
  private static contentManager = new ContentManager();

  /**
   * Get random content from any supported content type
   * @param contentType - The type of content
   * @returns Promise resolving to random content with normalized structure
   */
  static async getRandomContent(
    contentType: ContentType = ContentType.DUAA_100,
  ): Promise<RandomContentResult> {
    return await this.contentManager.getRandomContent(contentType);
  }

  /**
   * Load content by type using the ContentManager
   * @param contentType - The type of content to load
   * @returns Promise resolving to normalized content array
   */
  static async loadContentByType(
    contentType: ContentType,
  ): Promise<BaseContentItem[]> {
    return await this.contentManager.loadContentByType(contentType);
  }

  /**
   * Get random content with unified response structure
   * @param contentType - The type of content
   * @returns Promise resolving to unified response structure
   */
  static async getUnifiedRandomContent(
    contentType: ContentType = ContentType.DUAA_100,
  ): Promise<UnifiedContentResponse> {
    const result = await this.contentManager.getRandomContent(
      contentType,
    );

    return {
      id: `${contentType}-${result.itemIndex}-${result.contentIndex}`,
      title: result.item.category,
      message: result.content,
      contextMessage: result.contextMessage,
      type: result.item.type,
      additionalInfo: result.item.additionalInfo,
    };
  }
}
