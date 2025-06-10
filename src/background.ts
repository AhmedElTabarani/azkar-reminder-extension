import { ContentService } from './services/content.service.js';
import { PushWebNotificationService } from './services/push-web-notification.service.js';
import {
  ContentType,
  ExtensionSettings,
  NotificationContent,
} from './types/content.types.js';
import * as cache from './utils/cache.js';

/**
 * Initialize alarms with default settings
 */
const initializeAlarms = async (): Promise<void> => {
  const settings = (await chrome.storage.sync.get([
    'notificationsEnabled',
    'timerInterval',
  ])) as Partial<ExtensionSettings>;
  const notificationsEnabled =
    settings.notificationsEnabled !== false;
  const interval = settings.timerInterval || 5;

  // Clear existing alarms
  chrome.alarms.clear('notify');

  // Create new alarm if notifications are enabled
  if (notificationsEnabled) {
    chrome.alarms.create('notify', {
      periodInMinutes: interval,
    });
  }
};

/**
 * Handle settings update messages
 */
const handleSettingsUpdate = async (
  settings: Partial<ExtensionSettings>,
): Promise<{ success: boolean }> => {
  const { notificationsEnabled, timerInterval } = settings;

  // Clear existing alarms
  chrome.alarms.clear('notify');

  // Create new alarm if notifications are enabled
  if (notificationsEnabled && timerInterval) {
    chrome.alarms.create('notify', {
      periodInMinutes: timerInterval,
    });
  }

  return { success: true };
};

/**
 * Handle test notification requests
 */
const handleTestNotification = async (
  settings: Partial<ExtensionSettings>,
): Promise<{ success: boolean; error?: string }> => {
  const contentType = settings.contentType || ContentType.DUAA_100;

  try {
    const testContent = await ContentService.getUnifiedRandomContent(
      contentType,
    );
    // Add test prefix to the title
    testContent.title = `${testContent.title} (اختبار)`;
    testContent.id = `test-${Date.now()}`;

    console.log('Test content generated:', testContent);
    PushWebNotificationService.push(testContent);

    // Delete test notification after 15 seconds
    setTimeout(
      () => PushWebNotificationService.delete(testContent.id),
      15000,
    );

    return { success: true };
  } catch (error) {
    console.error('Error generating test notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Handle alarm notifications
 */
const handleAlarmNotification = async (): Promise<void> => {
  try {
    // Check if notifications are still enabled
    const settings = (await chrome.storage.sync.get([
      'notificationsEnabled',
      'contentType',
    ])) as Partial<ExtensionSettings>;
    if (settings.notificationsEnabled === false) {
      return;
    }

    const contentType = settings.contentType || ContentType.DUAA_100;

    // Get unified random content using the new ContentService
    const randomContent =
      await ContentService.getUnifiedRandomContent(contentType);
    if (randomContent) {
      PushWebNotificationService.push(randomContent);

      // Delete notification after 30 seconds
      setTimeout(
        () => PushWebNotificationService.delete(randomContent.id),
        30000,
      );
    }
  } catch (error) {
    console.error('Error generating notification:', error);
  }
};

// Initialize on startup
initializeAlarms();

// Listen for messages from popup
chrome.runtime.onMessage.addListener(
  async (message, sender, sendResponse) => {
    if (message.action === 'updateSettings') {
      const result = await handleSettingsUpdate(message.settings);
      sendResponse(result);
    }

    if (message.action === 'testNotification') {
      const result = await handleTestNotification(message.settings);
      sendResponse(result);
    }
  },
);

// Handle alarm events
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'notify') {
    await handleAlarmNotification();
  }
});

// Clear cache on startup
cache.clear();
