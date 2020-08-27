import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          'My Assets': 'My Assets'
        }
      },
      zh: {
        translation: {
          'My Assets': '我的地址'
        }
      }
    }
  });

export default i18n;
