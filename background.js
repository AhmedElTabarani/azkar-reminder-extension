import { DuaaService } from './services/duaa.service.js';
import { PushWenNotificationService } from './services/push-web-notification.service..js';
import * as cache from './utils/cache.js';

// TODO: Add the rest of 100 duaa from the book and authentic sunnah
// SEE https://nuqayah.com/f/100-duaa.pdf

chrome.alarms.create('notify', {
  periodInMinutes: 1, // TODO: change timeout to be customizable
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'notify') {
    const allDuaa = await DuaaService.loadAllDuaa();

    // get random duaa object
    const randomDuaa = DuaaService.getRandomDuaa(allDuaa);
    const { id, duaa, category: title } = randomDuaa;

    // duaa is an array of strings
    // so we need to get a random string from it
    const message = DuaaService.getRandomDuaa(duaa);
    PushWenNotificationService.push(id, title, message);
  }
});

cache.clear();
