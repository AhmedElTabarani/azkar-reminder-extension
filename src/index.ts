import * as cache from './utils/cache.js';
import {
  ContentType,
  ExtensionSettings,
} from './types/content.types.js';

interface AzkarItem {
  content: string;
  translation: string;
  transliteration: string;
  count: number;
  count_description: string;
  fadl: string;
  source: string;
  hadith_text: string;
  explanation_of_hadith_vocabulary: string;
  type: number;
}

// DOM elements
const arBtn = document.getElementById('ar-btn') as HTMLButtonElement;
const enBtn = document.getElementById('en-btn') as HTMLButtonElement;
const morningTab = document.getElementById(
  'morning',
) as HTMLDivElement;
const eveningTab = document.getElementById(
  'evening',
) as HTMLDivElement;
const morningBtn = document.getElementById(
  'morning-btn',
) as HTMLButtonElement;
const eveningBtn = document.getElementById(
  'evening-btn',
) as HTMLButtonElement;

// Settings elements
const settingsToggle = document.getElementById(
  'settings-toggle',
) as HTMLButtonElement;
const settingsPanel = document.getElementById(
  'settings-panel',
) as HTMLDivElement;
const notificationsToggle = document.getElementById(
  'notifications-toggle',
) as HTMLInputElement;
const timerInterval = document.getElementById(
  'timer-interval',
) as HTMLSelectElement;
const contentSelector = document.getElementById(
  'content-selector',
) as HTMLSelectElement;
const saveSettingsBtn = document.getElementById(
  'save-settings',
) as HTMLButtonElement;
const testNotificationBtn = document.getElementById(
  'test-notification-btn',
) as HTMLButtonElement;

let currentLanguage: 'ar' | 'en' = 'ar';

const loadAzkar = async (language: 'ar' | 'en'): Promise<void> => {
  const filePath = `/content/morning-and-evening/${language}.json`;

  const data = cache.get(filePath);
  if (data) return displayAzkar(data, language);

  try {
    const response = await fetch(filePath);
    const azkarData: AzkarItem[] = await response.json();
    displayAzkar(azkarData, language);
    cache.set(filePath, azkarData);
  } catch (error) {
    console.error('Error loading azkar:', error);
  }
};

const displayAzkar = (
  azkarData: AzkarItem[],
  language: 'ar' | 'en',
): void => {
  const isMorning = morningTab.style.display !== 'none';
  const tab = isMorning ? morningTab : eveningTab;

  const azkar = isMorning
    ? azkarData.filter(
        (azkar) => azkar.type === 1 || azkar.type === 0,
      )
    : azkarData.filter(
        (azkar) => azkar.type === 2 || azkar.type === 0,
      );

  tab.innerHTML = '';
  azkar.forEach((zikr) => {
    const azkarElement = document.createElement('div');
    azkarElement.classList.add('card');

    switch (language) {
      case 'ar':
        azkarElement.innerHTML = `
          <p class="content">${zikr.content}</p>
          <hr />
          <div class="zikr-info">
            <p><span class="info-subtitle">عدد مرات الذكر:</span> ${
              zikr.count
            } - ${zikr.count_description}</p>
            <p><span class="info-subtitle">فضل الذكر:</span> ${
              zikr.fadl
            }</p>
            <p><span class="info-subtitle">المصدر:</span> ${
              zikr.source
            }</p>
            ${
              zikr.hadith_text !== ''
                ? `<p><span class="info-subtitle">الحديث:</span> ${zikr.hadith_text}</p>`
                : ''
            }
            ${
              zikr.explanation_of_hadith_vocabulary !== ''
                ? `<p><span class="info-subtitle">شرح ألفاظ الحديث:</span> ${zikr.explanation_of_hadith_vocabulary}</p>`
                : ''
            }
          </div>
        `;
        break;
      case 'en':
        azkarElement.classList.add('text-left');
        azkarElement.innerHTML = `
          <p class="content">${zikr.translation}</p>
          <p><span class="info-subtitle">Transliteration:</span> ${zikr.transliteration}</p>
          <hr />
          <div class="zikr-info">
            <p><span class="info-subtitle">Count:</span> ${zikr.count} - ${zikr.count_description}</p>
            <p><span class="info-subtitle">Benefit of The Zikr:</span> ${zikr.fadl}</p>
            <p><span class="info-subtitle">Source:</span> ${zikr.source}</p>
          </div>
        `;
        break;
    }

    tab.appendChild(azkarElement);
  });
};

// Event listeners
morningBtn.addEventListener('click', () => {
  morningBtn.classList.add('active');
  morningTab.style.display = 'block';

  eveningBtn.classList.remove('active');
  eveningTab.style.display = 'none';

  loadAzkar(currentLanguage);
});

eveningBtn.addEventListener('click', () => {
  eveningBtn.classList.add('active');
  eveningTab.style.display = 'block';

  morningBtn.classList.remove('active');
  morningTab.style.display = 'none';

  loadAzkar(currentLanguage);
});

arBtn.addEventListener('click', () => {
  currentLanguage = 'ar';
  morningBtn.innerText = 'أذكار الصباح';
  eveningBtn.innerText = 'أذكار المساء';
  loadAzkar(currentLanguage);
});

enBtn.addEventListener('click', () => {
  currentLanguage = 'en';
  morningBtn.innerText = 'Morning Azkar';
  eveningBtn.innerText = 'Evening Azkar';
  loadAzkar(currentLanguage);
});

// Settings functionality
settingsToggle.addEventListener('click', () => {
  settingsPanel.classList.toggle('hidden');
});

// Load saved settings
const loadSettings = async (): Promise<void> => {
  const settings = (await chrome.storage.sync.get([
    'notificationsEnabled',
    'timerInterval',
    'contentType',
  ])) as Partial<ExtensionSettings>;
  notificationsToggle.checked =
    settings.notificationsEnabled !== false;
  timerInterval.value = (settings.timerInterval || 5).toString();
  contentSelector.value =
    settings.contentType || ContentType.DUAA_100;
};

// Save settings
saveSettingsBtn.addEventListener('click', async () => {
  const settings: ExtensionSettings = {
    notificationsEnabled: notificationsToggle.checked,
    timerInterval: parseInt(timerInterval.value),
    contentType: contentSelector.value as ContentType,
  };

  await chrome.storage.sync.set(settings);

  // Send message to background script to update alarms
  chrome.runtime.sendMessage({
    action: 'updateSettings',
    settings: settings,
  });

  // Show success message
  saveSettingsBtn.textContent = 'تم الحفظ ✓';
  setTimeout(() => {
    saveSettingsBtn.textContent = 'حفظ الإعدادات';
  }, 2000);
});

// Test notification functionality
testNotificationBtn.addEventListener('click', async () => {
  testNotificationBtn.disabled = true;
  testNotificationBtn.textContent = 'جاري الإرسال...';

  try {
    // Send test notification through background script
    chrome.runtime.sendMessage({
      action: 'testNotification',
      settings: {
        contentType: contentSelector.value as ContentType,
      },
    });

    testNotificationBtn.textContent = 'تم الإرسال ✓';
    setTimeout(() => {
      testNotificationBtn.disabled = false;
      testNotificationBtn.textContent = 'اختبار الإشعار';
    }, 3000);
  } catch (error) {
    testNotificationBtn.textContent = 'خطأ في الإرسال';
    setTimeout(() => {
      testNotificationBtn.disabled = false;
      testNotificationBtn.textContent = 'اختبار الإشعار';
    }, 3000);
  }
});

// Initialize settings on load
loadSettings();
loadAzkar(currentLanguage);
