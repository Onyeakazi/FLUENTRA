// FLUENTRA Supported Language Courses & Global Registry
export interface LanguageOption {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  tagline: string;
  color?: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  {
    id: 'Chinese Mandarin',
    code: 'zh-CN',
    name: 'Chinese Mandarin',
    nativeName: '普通话 (Hànyǔ)',
    flag: '🇨🇳',
    tagline: 'Tones, Pinyin, Hanzi radicals & 5,000 years of culture',
    color: '#FF4B4B'
  },
  {
    id: 'French',
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    tagline: 'Bonjour, nasal vowels, liaison & poetic elegance',
    color: '#3B82F6'
  },
  {
    id: 'Spanish',
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    tagline: '¡Hola! Vibrant rhythm, rolled R & global fluency',
    color: '#F59E0B'
  },
  {
    id: 'German',
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    tagline: 'Guten Tag! Compound logic, precision & cases',
    color: '#10B981'
  },
  {
    id: 'Japanese',
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語 (Nihongo)',
    flag: '🇯🇵',
    tagline: 'Konnichiwa! Hiragana, Katakana, Kanji & polite nuances',
    color: '#EC4899'
  },
  {
    id: 'Italian',
    code: 'it-IT',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    tagline: 'Ciao! Melodic gestures, culinary arts & passion',
    color: '#06B6D4'
  }
];

export const LANG_FLAGS: Record<string, string> = {
  'Chinese Mandarin': '🇨🇳',
  Chinese: '🇨🇳',
  China: '🇨🇳',
  Mandarin: '🇨🇳',
  French: '🇫🇷',
  France: '🇫🇷',
  Spanish: '🇪🇸',
  Spain: '🇪🇸',
  German: '🇩🇪',
  Germany: '🇩🇪',
  Japanese: '🇯🇵',
  Japan: '🇯🇵',
  Italian: '🇮🇹',
  Italy: '🇮🇹'
};

export const getLanguageOption = (langIdOrName: string = ''): LanguageOption => {
  const query = (langIdOrName || '').trim().toLowerCase();
  if (!query) {
    return AVAILABLE_LANGUAGES[1]; // French default
  }

  // Country & language alias mappings
  if (query === 'china' || query === 'chinese' || query === 'mandarin' || query === 'zh' || query === 'zh-cn' || query === 'chinese mandarin') {
    return AVAILABLE_LANGUAGES[0];
  }
  if (query === 'france' || query === 'french' || query === 'fr' || query === 'fr-fr') {
    return AVAILABLE_LANGUAGES[1];
  }
  if (query === 'spain' || query === 'spanish' || query === 'es' || query === 'es-es') {
    return AVAILABLE_LANGUAGES[2];
  }
  if (query === 'germany' || query === 'german' || query === 'de' || query === 'de-de') {
    return AVAILABLE_LANGUAGES[3];
  }
  if (query === 'japan' || query === 'japanese' || query === 'ja' || query === 'ja-jp') {
    return AVAILABLE_LANGUAGES[4];
  }
  if (query === 'italy' || query === 'italian' || query === 'it' || query === 'it-it') {
    return AVAILABLE_LANGUAGES[5];
  }

  const found = AVAILABLE_LANGUAGES.find(
    l => l.id.toLowerCase() === query ||
         l.name.toLowerCase() === query ||
         l.code.toLowerCase() === query
  );
  return found || AVAILABLE_LANGUAGES[1]; // Default to French
};

