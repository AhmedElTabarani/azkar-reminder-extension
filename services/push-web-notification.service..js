export class PushWenNotificationService {
  static push = async ({
    id,
    title,
    message,
    contextMessage = null,
  }) => {
    return await chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: '../icons/icon128.png',
      title: title,
      message: message,
      contextMessage: contextMessage,
      requireInteraction: true,
    });
  };

  static delete = async (id) => {
    return await chrome.notifications.clear(id);
  };
}
