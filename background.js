import { DuaaService } from './services/duaa.service.js';
import { PushWenNotificationService } from './services/push-web-notification.service..js';
import * as cache from './utils/cache.js';

chrome.alarms.create('notify', {
  periodInMinutes: 5, // TODO: change timeout to be customizable
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'notify') {
    const allDuaa = await DuaaService.loadAllDuaa();

    // get random duaa object
    const { value: randomDuaa } = DuaaService.getRandomDuaa(allDuaa);
    const { id, duaa, category } = randomDuaa;

    // duaa is an array of strings
    // so we need to get a random string from it
    const { index, value: message } = DuaaService.getRandomDuaa(duaa);

    const contextMessage = DuaaService.getDuaaContextMessage(
      allDuaa,
      id,
      index,
    );

    const duaaId = `${id}-${index}`;
    PushWenNotificationService.push({
      id: duaaId,
      title: category,
      message,
      contextMessage,
    });

    // delete notification
    setTimeout(
      () => PushWenNotificationService.delete(duaaId),
      1000 * 30,
    );
  }
});

cache.clear();
