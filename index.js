import * as cache from './utils/cache.js';

const arBtn = document.getElementById('ar-btn');
const enBtn = document.getElementById('en-btn');
const morningTab = document.getElementById('morning');
const eveningTab = document.getElementById('evening');
const morningBtn = document.getElementById('morning-btn');
const eveningBtn = document.getElementById('evening-btn');

let currentLanguage = 'ar';

const loadAzkar = async (language) => {
  const filePath = `/azkar/morning-and-evening/${language}.json`;

  const data = await cache.get(filePath);
  if (data) return displayAzkar(data, language);

  fetch(filePath)
    .then((response) => response.json())
    .then((data) => {
      displayAzkar(data, language);
      cache.set(filePath, data);
    });
};

const displayAzkar = (azkarData, language) => {
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

loadAzkar(currentLanguage);
