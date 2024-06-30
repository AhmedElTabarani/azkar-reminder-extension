export class PushWenNotificationService {
  static push = async (duaaId, title, message) => {
    const id = `${duaaId}-${title}-${message}`;
    return await chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: '../icons/GitHub-Mark-32px.png', // TODO: change icon
      title: title,
      message: message,
    });
  };
}
