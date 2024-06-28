import * as cache from './utils/cache.js';

chrome.windows.onRemove.addListener(async (windowId) => {
    await cache.clear();
 })