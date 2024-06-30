import * as cache from './utils/cache.js';

// TODO: Add the rest of 100 duaa from the book and authentic sunnah
// SEE https://nuqayah.com/f/100-duaa.pdf

const filePath =
  '/duaa/100-duaa-from-the-book-and-authentic-sunnah.json';
setInterval(() => {
  displayRandomDuaa();
}, 1000 * 60 * 5); // TODO: change timeout to be customizable

const getRandomDuaa = (data) => {
  return data[Math.floor(Math.random() * data.length)];
};

const displayRandomDuaa = async () => {
  const data = await cache.get(filePath);

  if (data) {
    const { duaa, category: title } = getRandomDuaa(data);
    return pushWebNotificationRandomDuaa(title, duaa);
  }

  fetch(filePath)
    .then((response) => response.json())
    .then((data) => {
      const { duaa, category: title } = getRandomDuaa(data);
      pushWebNotificationRandomDuaa(title, duaa);
      cache.set(filePath, data);
    });
};

const pushWebNotificationRandomDuaa = async (title, duaa) => {
  await chrome.notifications.create(null, {
    type: 'basic',
    iconUrl: '/icons/GitHub-Mark-32px.png', // TODO: change icon
    title: title,
    message: duaa.join('\n'),
  });
};
