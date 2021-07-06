import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            '<0>breachDate</0>': '<0>Breach date</0>',
            '<0>trusted</0>': '<0>Trusted</0>',
            '<0>warning</0>': '<0>Warning</0>'
        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
