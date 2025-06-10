import { NotificationContent } from '../types/content.types.js';

/**
 * Service for handling web notifications in the Chrome extension
 */
export class PushWebNotificationService {
  /**
   * Push a notification to the user
   * @param notification - The notification content
   * @returns Promise resolving to the notification ID
   */
  static async push(
    notification: NotificationContent,
  ): Promise<string> {
    const {
      id,
      title,
      message,
      contextMessage = null,
    } = notification;

    return await chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: '../icons/icon128.png',
      title: title,
      message: message,
      contextMessage: contextMessage || undefined,
      requireInteraction: true,
    });
  }

  /**
   * Delete/clear a notification
   * @param id - The notification ID to clear
   * @returns Promise resolving to whether the notification was cleared
   */
  static async delete(id: string): Promise<boolean> {
    return await chrome.notifications.clear(id);
  }
  /**
   * Get all active notifications
   * @returns Promise resolving to a map of notification IDs to notification objects
   */
  static async getAll(): Promise<Record<string, any>> {
    return await chrome.notifications.getAll();
  }

  /**
   * Update an existing notification
   * @param id - The notification ID to update
   * @param options - The new notification options
   * @returns Promise resolving to whether the notification was updated
   */
  static async update(
    id: string,
    options: chrome.notifications.NotificationOptions,
  ): Promise<boolean> {
    return await chrome.notifications.update(id, options);
  }
}
