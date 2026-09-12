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
  French: '🇫🇷',
  Spanish: '🇪🇸',
  German: '🇩🇪',
  Japanese: '🇯🇵',
  Italian: '🇮🇹'
};

export const getLanguageOption = (langIdOrName: string): LanguageOption => {
  const found = AVAILABLE_LANGUAGES.find(
    l => l.id.toLowerCase() === langIdOrName.toLowerCase() ||
         l.name.toLowerCase() === langIdOrName.toLowerCase() ||
         l.code.toLowerCase() === langIdOrName.toLowerCase()
  );
  return found || AVAILABLE_LANGUAGES[0]; // Chinese Mandarin fallback
};
