export class PushWenNotificationService {
  static push = async ({
    id,
    title,
    message,
    contextMessage = null,
  }) => {
    return await chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: '../icons/GitHub-Mark-32px.png', // TODO: change icon
      title: title,
      message: message,
      contextMessage: contextMessage,
      requireInteraction: true,
    });
  };
}
