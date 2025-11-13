// utils/languages.js

/**
 * Comprehensive list of supported languages for the SCUM Calculator
 */
export function getLanguages() {
    return [
        {
            code: 'en',
            name: 'English',
            nativeName: 'English',
            emoji: '🇺🇸',
            direction: 'ltr'
        },
        {
            code: 'hr',
            name: 'Croatian',
            nativeName: 'Hrvatski',
            emoji: '🇭🇷',
            direction: 'ltr'
        },
        {
            code: 'sl',
            name: 'Slovenian',
            nativeName: 'Slovenščina',
            emoji: '🇸🇮',
            direction: 'ltr'
        },
        {
            code: 'es',
            name: 'Spanish',
            nativeName: 'Español',
            emoji: '🇪🇸',
            direction: 'ltr'
        },
        {
            code: 'fr',
            name: 'French',
            nativeName: 'Français',
            emoji: '🇫🇷',
            direction: 'ltr'
        },
        {
            code: 'de',
            name: 'German',
            nativeName: 'Deutsch',
            emoji: '🇩🇪',
            direction: 'ltr'
        },
        {
            code: 'it',
            name: 'Italian',
            nativeName: 'Italiano',
            emoji: '🇮🇹',
            direction: 'ltr'
        },
        {
            code: 'pt',
            name: 'Portuguese',
            nativeName: 'Português',
            emoji: '🇵🇹',
            direction: 'ltr'
        },
        {
            code: 'ru',
            name: 'Russian',
            nativeName: 'Русский',
            emoji: '🇷🇺',
            direction: 'ltr'
        },
        {
            code: 'zh',
            name: 'Chinese (Simplified)',
            nativeName: '简体中文',
            emoji: '🇨🇳',
            direction: 'ltr'
        },
        {
            code: 'ja',
            name: 'Japanese',
            nativeName: '日本語',
            emoji: '🇯🇵',
            direction: 'ltr'
        },
        {
            code: 'ko',
            name: 'Korean',
            nativeName: '한국어',
            emoji: '🇰🇷',
            direction: 'ltr'
        },
        {
            code: 'ar',
            name: 'Arabic',
            nativeName: 'العربية',
            emoji: '🇸🇦',
            direction: 'rtl'
        },
        {
            code: 'tr',
            name: 'Turkish',
            nativeName: 'Türkçe',
            emoji: '🇹🇷',
            direction: 'ltr'
        },
        {
            code: 'nl',
            name: 'Dutch',
            nativeName: 'Nederlands',
            emoji: '🇳🇱',
            direction: 'ltr'
        },
        {
            code: 'pl',
            name: 'Polish',
            nativeName: 'Polski',
            emoji: '🇵🇱',
            direction: 'ltr'
        },
        {
            code: 'uk',
            name: 'Ukrainian',
            nativeName: 'Українська',
            emoji: '🇺🇦',
            direction: 'ltr'
        },
        {
            code: 'cs',
            name: 'Czech',
            nativeName: 'Čeština',
            emoji: '🇨🇿',
            direction: 'ltr'
        },
        {
            code: 'sk',
            name: 'Slovak',
            nativeName: 'Slovenčina',
            emoji: '🇸🇰',
            direction: 'ltr'
        },
        {
            code: 'hu',
            name: 'Hungarian',
            nativeName: 'Magyar',
            emoji: '🇭🇺',
            direction: 'ltr'
        },
        {
            code: 'ro',
            name: 'Romanian',
            nativeName: 'Română',
            emoji: '🇷🇴',
            direction: 'ltr'
        },
        {
            code: 'bg',
            name: 'Bulgarian',
            nativeName: 'Български',
            emoji: '🇧🇬',
            direction: 'ltr'
        },
        {
            code: 'el',
            name: 'Greek',
            nativeName: 'Ελληνικά',
            emoji: '🇬🇷',
            direction: 'ltr'
        },
        {
            code: 'fi',
            name: 'Finnish',
            nativeName: 'Suomi',
            emoji: '🇫🇮',
            direction: 'ltr'
        },
        {
            code: 'sv',
            name: 'Swedish',
            nativeName: 'Svenska',
            emoji: '🇸🇪',
            direction: 'ltr'
        },
        {
            code: 'no',
            name: 'Norwegian',
            nativeName: 'Norsk',
            emoji: '🇳🇴',
            direction: 'ltr'
        },
        {
            code: 'da',
            name: 'Danish',
            nativeName: 'Dansk',
            emoji: '🇩🇰',
            direction: 'ltr'
        },
        {
            code: 'vi',
            name: 'Vietnamese',
            nativeName: 'Tiếng Việt',
            emoji: '🇻🇳',
            direction: 'ltr'
        },
        {
            code: 'th',
            name: 'Thai',
            nativeName: 'ไทย',
            emoji: '🇹🇭',
            direction: 'ltr'
        },
        {
            code: 'id',
            name: 'Indonesian',
            nativeName: 'Bahasa Indonesia',
            emoji: '🇮🇩',
            direction: 'ltr'
        },
        {
            code: 'ms',
            name: 'Malay',
            nativeName: 'Bahasa Melayu',
            emoji: '🇲🇾',
            direction: 'ltr'
        },
        {
            code: 'hi',
            name: 'Hindi',
            nativeName: 'हिन्दी',
            emoji: '🇮🇳',
            direction: 'ltr'
        },
        {
            code: 'bn',
            name: 'Bengali',
            nativeName: 'বাংলা',
            emoji: '🇧🇩',
            direction: 'ltr'
        },
        {
            code: 'fa',
            name: 'Persian',
            nativeName: 'فارسی',
            emoji: '🇮🇷',
            direction: 'rtl'
        },
        {
            code: 'he',
            name: 'Hebrew',
            nativeName: 'עברית',
            emoji: '🇮🇱',
            direction: 'rtl'
        }
    ];
}

/**
 * Get language by code
 */
export function getLanguageByCode(code) {
    return getLanguages().find(lang => lang.code === code);
}

/**
 * Get language name by code
 */
export function getLanguageName(code) {
    const lang = getLanguageByCode(code);
    return lang ? lang.name : code;
}

/**
 * Get native language name by code
 */
export function getNativeLanguageName(code) {
    const lang = getLanguageByCode(code);
    return lang ? lang.nativeName : code;
}

/**
 * Get language emoji by code
 */
export function getLanguageEmoji(code) {
    const lang = getLanguageByCode(code);
    return lang ? lang.emoji : '🌐';
}

/**
 * Get language direction by code
 */
export function getLanguageDirection(code) {
    const lang = getLanguageByCode(code);
    return lang ? lang.direction : 'ltr';
}

/**
 * Check if language is RTL
 */
export function isRTL(code) {
    return getLanguageDirection(code) === 'rtl';
}

/**
 * List of languages that have existing translation files
 * Update this array as you add more translation files
 */
export const availableLanguages = [
    'en',  // English
    'hr',  // Croatian
    'de',  // German
    'es',  // Spanish
    'fr',  // French
    'it',  // Italian
    'ko',  // Korean
    'nl',  // Dutch
    'ru',  // Russian
    'sl',  // Slovenian
    'sv',  // Swedish
    'zh'   // Chinese
];

/**
 * Check if a language has an existing translation file
 */
export function isLanguageAvailable(code) {
    return availableLanguages.includes(code);
}

/**
 * Get available languages (those with translation files)
 */
export function getAvailableLanguages() {
    return getLanguages().filter(lang => availableLanguages.includes(lang.code));
}

/**
 * Get languages that need translation (no translation file yet)
 */
export function getLanguagesNeedingTranslation() {
    return getLanguages().filter(lang => !availableLanguages.includes(lang.code));
}

/**
 * Search languages by name, native name, or code
 */
export function searchLanguages(query) {
    if (!query) return getLanguages().slice(0, 10);

    const searchTerm = query.toLowerCase();
    return getLanguages().filter(lang =>
        lang.name.toLowerCase().includes(searchTerm) ||
        lang.nativeName.toLowerCase().includes(searchTerm) ||
        lang.code.toLowerCase().includes(searchTerm)
    );
}

/**
 * Get popular languages (most commonly used)
 */
export function getPopularLanguages() {
    const popularCodes = ['en', 'es', 'fr', 'de', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar'];
    return getLanguages().filter(lang => popularCodes.includes(lang.code));
}

/**
 * Get European languages
 */
export function getEuropeanLanguages() {
    const europeanCodes = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl', 'pl', 'uk', 'cs', 'sk', 'hu', 'ro', 'bg', 'el', 'fi', 'sv', 'no', 'da', 'hr'];
    return getLanguages().filter(lang => europeanCodes.includes(lang.code));
}

/**
 * Get Asian languages
 */
export function getAsianLanguages() {
    const asianCodes = ['zh', 'ja', 'ko', 'vi', 'th', 'id', 'ms', 'hi', 'bn'];
    return getLanguages().filter(lang => asianCodes.includes(lang.code));
}

/**
 * Get Middle Eastern languages
 */
export function getMiddleEasternLanguages() {
    const middleEasternCodes = ['ar', 'tr', 'fa', 'he'];
    return getLanguages().filter(lang => middleEasternCodes.includes(lang.code));
}

/**
 * Sort languages alphabetically by name
 */
export function getSortedLanguages() {
    return getLanguages().sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get language suggestions based on user's browser language
 */
export function getSuggestedLanguages() {
    const browserLang = navigator.language.split('-')[0]; // Get base language code
    const userLangs = navigator.languages.map(lang => lang.split('-')[0]);

    const suggestions = new Set();

    // Add browser language if available
    if (getLanguageByCode(browserLang)) {
        suggestions.add(browserLang);
    }

    // Add other user languages
    userLangs.forEach(lang => {
        if (getLanguageByCode(lang)) {
            suggestions.add(lang);
        }
    });

    // Add English as fallback
    suggestions.add('en');

    // Convert to array of language objects
    return Array.from(suggestions)
        .map(code => getLanguageByCode(code))
        .filter(Boolean)
        .slice(0, 5); // Return top 5 suggestions
}

/**
 * Validate language code
 */
export function isValidLanguageCode(code) {
    return getLanguages().some(lang => lang.code === code);
}

/**
 * Get default language (English)
 */
export function getDefaultLanguage() {
    return getLanguageByCode('en');
}

/**
 * Format language for display
 */
export function formatLanguageDisplay(code, format = 'full') {
    const lang = getLanguageByCode(code);
    if (!lang) return code;

    switch (format) {
        case 'name-only':
            return lang.name;
        case 'native-only':
            return lang.nativeName;
        case 'code-only':
            return lang.code;
        case 'emoji-name':
            return `${lang.emoji} ${lang.name}`;
        case 'emoji-native':
            return `${lang.emoji} ${lang.nativeName}`;
        case 'full':
        default:
            return `${lang.emoji} ${lang.name} (${lang.nativeName}) - ${lang.code}`;
    }
}

export default {
    getLanguages,
    getLanguageByCode,
    getLanguageName,
    getNativeLanguageName,
    getLanguageEmoji,
    getLanguageDirection,
    isRTL,
    availableLanguages,
    isLanguageAvailable,
    getAvailableLanguages,
    getLanguagesNeedingTranslation,
    searchLanguages,
    getPopularLanguages,
    getEuropeanLanguages,
    getAsianLanguages,
    getMiddleEasternLanguages,
    getSortedLanguages,
    getSuggestedLanguages,
    isValidLanguageCode,
    getDefaultLanguage,
    formatLanguageDisplay
};