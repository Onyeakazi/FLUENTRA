// FLUENTRA 11-Mode Ear Training & Audio Arcade Service
// Generates exercises, audio cues, and stories strictly from what is learned in that specific lesson/unit
import { UNIT_JOURNEYS } from '../data/unitJourneys';
import { LANGUAGE_PACKS, getLessonsForUnit } from '../data/curriculumContent';
import { CURRICULUM_DATA } from '../data/curriculumRegistry';
import { getLanguageOption } from '../data/languages';

export type EarGameModeType =
  | 'blind_ear'
  | 'audio_cloze'
  | 'echo_mimic'
  | 'sound_blitz'
  | 'minimal_pair_duel'
  | 'audio_tile_builder'
  | 'speed_warp'
  | 'audio_true_false'
  | 'audio_dialogue_reply'
  | 'boss_shadowing'
  | 'audio_story';

export interface EarGameRound {
  id: string;
  roundNumber: number;
  mode: EarGameModeType;
  title: string;
  badgeLabel: string;
  instruction: string;
  audioText: string;
  langCode: string;
  targetText?: string;
  translation?: string;
  phoneticHint?: string;
  explanation?: string;
  // Blind Ear / Cloze / Pair Duel / Speed Warp / Dialogue Reply options
  options?: { id: string; text: string; translation?: string; audioText?: string }[];
  correctOptionId?: string;
  // Audio Cloze
  sentenceWithBlank?: string;
  // Sound Blitz
  blitzPairs?: { id: string; audioText: string; term: string; translation: string }[];
  // Audio Tile Builder
  tileChips?: string[];
  correctWordOrder?: string[];
  // Audio True / False
  conceptStatement?: string;
  isTrueStatement?: boolean;
  // Boss Shadowing
  bossPhrases?: { id: string; audioText: string; targetText: string; translation: string }[];
  // Audio Story (Mode 11)
  storyData?: StoryDataPayload;
}

export interface StoryDataPayload {
  title: string;
  titleEnglish: string;
  fullStoryText: string;
  fullStoryTranslation: string;
  sentences: { id: string; audioText: string; targetText: string; translation: string }[];
  comprehensionQuestion: {
    prompt: string;
    options: { id: string; text: string; translation?: string }[];
    correctOptionId: string;
    explanation: string;
  };
}

export interface LessonVocabItem {
  term: string;
  cleanAudioText: string;
  translation: string;
  phonetic?: string;
  exampleUsage?: string;
  exampleTranslation?: string;
}

/**
 * Strips formatting annotations so speech synthesis produces clean native words
 */
function cleanAudioSpeechText(raw: string): string {
  if (!raw) return '';
  let str = raw.trim();

  // If format is like "Tone 1 (mā)" or "Tone 3 (mǎ)"
  const toneMatch = str.match(/tone\s*\d+\s*\(([^)]+)\)/i);
  if (toneMatch) {
    return toneMatch[1].trim();
  }

  // If format is like "mā (妈 - Mother)", take "mā" or "妈"
  const leadingMatch = str.match(/^([^(]+)\s*\(([^)]+)\)/);
  if (leadingMatch) {
    const p1 = leadingMatch[1].trim();
    if (!/tone|rule|level/i.test(p1)) {
      return p1;
    }
    const inside = leadingMatch[2].split(/[-–—:]/)[0].trim();
    return inside;
  }

  // Remove slash phonetic notations like /sa.ly/
  str = str.replace(/\/.*?\/[a-z]*/g, '').trim();
  // Strip trailing punctuation
  return str.replace(/[!?,.:;]+$/, '').trim() || raw.trim();
}

/**
 * Extracts vocabulary, target phrases, and sentences directly from the active lesson/unit
 */
function extractLessonVocab(
  unitId: string,
  canonicalName: string,
  lessonId?: string
): { items: LessonVocabItem[]; lessonTitle: string } {
  const pack = LANGUAGE_PACKS[canonicalName] || LANGUAGE_PACKS.French;
  const lessons = getLessonsForUnit(unitId, canonicalName);
  const targetLesson = (lessonId ? lessons.find((l) => l.id === lessonId) : null) || lessons[0];
  const lessonTitle = targetLesson?.title || CURRICULUM_DATA.unitsById[unitId]?.title || 'Lesson Core';

  // 1. If French with dedicated 10-step journey targets
  if (canonicalName === 'French' && UNIT_JOURNEYS[unitId]?.learningTargets?.length) {
    const journey = UNIT_JOURNEYS[unitId];
    const items = journey.learningTargets.map((t) => ({
      term: t.term,
      cleanAudioText: cleanAudioSpeechText(t.audioText || t.term),
      translation: t.translation,
      phonetic: t.phonetic,
      exampleUsage: t.exampleUsage,
      exampleTranslation: t.exampleTranslation
    }));
    return { items, lessonTitle: journey.title };
  }

  // 2. Extract from the lesson's interactive exercises
  const items: LessonVocabItem[] = [];
  const seenTerms = new Set<string>();

  const addCandidate = (
    term: string,
    translation: string,
    audio?: string,
    phonetic?: string,
    usage?: string,
    usageTrans?: string
  ) => {
    if (!term || !translation) return;
    const cleanSpeech = cleanAudioSpeechText(audio || term);
    if (!cleanSpeech) return;
    const key = cleanSpeech.toLowerCase();
    if (seenTerms.has(key)) return;
    seenTerms.add(key);

    items.push({
      term: term.trim(),
      cleanAudioText: cleanSpeech,
      translation: translation.trim(),
      phonetic,
      exampleUsage: usage,
      exampleTranslation: usageTrans
    });
  };

  const exercisePool = targetLesson?.exercises || [];
  for (const ex of exercisePool) {
    // If exercise has matchPairs (e.g. Tone 1 -> High Flat, Bonjour -> Good morning)
    if (ex.matchPairs) {
      for (const pair of ex.matchPairs) {
        addCandidate(pair.left, pair.right, pair.left);
      }
    }

    // Direct targetText and audioText
    if (ex.audioText && ex.translation) {
      addCandidate(
        ex.audioText,
        ex.translation.split(/[-–—(]/)[0].trim(),
        ex.audioText,
        ex.phoneticHint,
        ex.targetText,
        ex.translation
      );
    } else if (ex.targetText && ex.translation) {
      addCandidate(
        ex.targetText,
        ex.translation.split(/[-–—(]/)[0].trim(),
        ex.audioText || ex.targetText,
        ex.phoneticHint
      );
    }

    // Exercise options with audioText or translation
    if (ex.options) {
      for (const opt of ex.options) {
        if (opt.audioText && opt.translation) {
          addCandidate(opt.audioText, opt.translation, opt.audioText);
        }
      }
    }
  }

  // 3. Fallback from other lessons in the unit or language pack to ensure at least 4 items
  if (items.length < 4 && lessons.length > 1) {
    for (const otherLesson of lessons) {
      if (otherLesson.id === targetLesson?.id) continue;
      for (const ex of otherLesson.exercises) {
        if (ex.audioText && ex.translation) {
          addCandidate(ex.audioText, ex.translation.split(/[-–—(]/)[0].trim(), ex.audioText, ex.phoneticHint);
        }
      }
    }
  }

  if (items.length < 4) {
    // Safe language pack fallback using authentic phrases
    const fallbacks = [
      { term: pack.greetingFormal.target, trans: pack.greetingFormal.trans, audio: pack.greetingFormal.target, hint: pack.greetingFormal.hint },
      { term: pack.greetingInformal.target, trans: pack.greetingInformal.trans, audio: pack.greetingInformal.target, hint: pack.greetingInformal.hint },
      { term: pack.thankYou.target, trans: pack.thankYou.trans, audio: pack.thankYou.target, hint: pack.thankYou.hint },
      { term: pack.goodbye.target, trans: pack.goodbye.trans, audio: pack.goodbye.target, hint: pack.goodbye.hint },
      { term: pack.fineThanks.target, trans: pack.fineThanks.trans, audio: pack.fineThanks.target, hint: pack.fineThanks.hint }
    ];
    for (const fb of fallbacks) {
      addCandidate(fb.term, fb.trans, fb.audio, fb.hint);
      if (items.length >= 4) break;
    }
  }

  return { items, lessonTitle };
}

/**
 * Constructs a short story, audio narration, and comprehension question
 * built exclusively around what was learned in that lesson/unit
 */
function getStoryForLesson(
  unitId: string,
  languageName: string,
  items: LessonVocabItem[],
  lessonTitle?: string
): StoryDataPayload {
  const pack = LANGUAGE_PACKS[languageName] || LANGUAGE_PACKS.French;
  const t1 = items[0] || { term: pack.greetingFormal.target, cleanAudioText: pack.greetingFormal.target, translation: pack.greetingFormal.trans };
  const t2 = items[1] || { term: pack.thankYou.target, cleanAudioText: pack.thankYou.target, translation: pack.thankYou.trans };
  const t3 = items[2] || { term: pack.goodbye.target, cleanAudioText: pack.goodbye.target, translation: pack.goodbye.trans };

  // Ground Zero (Unit 1): Specific authentic short story centered on first lesson concepts
  if (unitId === 'u1') {
    switch (languageName) {
      case 'Chinese Mandarin':
        return {
          title: '初识汉语：声调与“你好”',
          titleEnglish: 'First Mandarin: Tones & "Nǐ Hǎo"',
          fullStoryText: '你好！今天我们在第一课学习了汉语的基本发音。妈妈（mā）在说话。mā、má、mǎ、mà 是四个基本声调。我们还学会了用“你好”来友好地打招呼。你好！',
          fullStoryTranslation: 'Hello! Today in Lesson 1 we learned the basic pronunciation of Chinese. Mother (mā) is speaking. mā, má, mǎ, mà are the four basic tones. We also learned to greet warmly with "Hello" (Nǐ hǎo). Hello!',
          sentences: [
            { id: 'st-s1', audioText: '你好！今天我们在第一课学习了汉语的基本发音。', targetText: '你好！今天我们在第一课学习了汉语的基本发音。', translation: 'Hello! Today in Lesson 1 we learned the basic pronunciation of Chinese.' },
            { id: 'st-s2', audioText: '妈妈在说话。mā、má、mǎ、mà 是四个基本声调。', targetText: '妈妈在说话。mā、má、mǎ、mà 是四个基本声调。', translation: 'Mother is speaking. mā, má, mǎ, mà are the four basic tones.' },
            { id: 'st-s3', audioText: '我们还学会了用“你好”来友好地打招呼。你好！', targetText: '我们还学会了用“你好”来友好地打招呼。你好！', translation: 'We also learned to greet warmly with "Hello". Hello!' }
          ],
          comprehensionQuestion: {
            prompt: '根据这篇短文，我们在本课中学到的最基本的中文问候语是什么？ (Based on this short story, what essential Chinese greeting was learned in this lesson?)',
            options: [
              { id: 'sq-1', text: '你好 (Nǐ hǎo - Hello / Hi)', translation: 'Correct objective from the lesson' },
              { id: 'sq-2', text: '再见 (Zàijiàn - Goodbye)', translation: 'Parting phrase' },
              { id: 'sq-3', text: '对不起 (Duìbuqǐ - Sorry)', translation: 'Apology' }
            ],
            correctOptionId: 'sq-1',
            explanation: '太棒了！ The story emphasizes “你好” (Nǐ hǎo), the primary greeting learned in this lesson along with tone sandhi.'
          }
        };

      case 'Spanish':
        return {
          title: 'Primeros saludos cordiales',
          titleEnglish: 'First Warm Greetings',
          fullStoryText: '¡Hola! Buenos días a todos. Mi amigo está aquí hoy. Muchas gracias por su ayuda y atención. ¡Adiós y hasta pronto!',
          fullStoryTranslation: 'Hello! Good morning everyone. My friend is here today. Thank you very much for your help and attention. Goodbye and see you soon!',
          sentences: [
            { id: 'st-s1', audioText: '¡Hola! Buenos días a todos.', targetText: '¡Hola! Buenos días a todos.', translation: 'Hello! Good morning everyone.' },
            { id: 'st-s2', audioText: 'Mi amigo está aquí hoy.', targetText: 'Mi amigo está aquí hoy.', translation: 'My friend is here today.' },
            { id: 'st-s3', audioText: 'Muchas gracias por su ayuda y atención.', targetText: 'Muchas gracias por su ayuda y atención.', translation: 'Thank you very much for your help and attention.' },
            { id: 'st-s4', audioText: '¡Adiós y hasta pronto!', targetText: '¡Adiós y hasta pronto!', translation: 'Goodbye and see you soon!' }
          ],
          comprehensionQuestion: {
            prompt: '¿Qué saludo cortés aprendido en esta lección se usa para decir hola al inicio? (Which polite greeting learned in this lesson is used to say hello at the beginning?)',
            options: [
              { id: 'sq-1', text: '¡Hola! Buenos días (Hello! Good morning)', translation: 'Correct objective from the lesson' },
              { id: 'sq-2', text: 'Buenas noches (Good night)', translation: 'Night greeting' },
              { id: 'sq-3', text: 'Hasta luego solamente (Only see you later)', translation: 'Parting phrase' }
            ],
            correctOptionId: 'sq-1',
            explanation: '¡Excelente! The passage opens directly with “¡Hola! Buenos días”, the core greetings practiced in this lesson.'
          }
        };

      case 'German':
        return {
          title: 'Erste Begrüßungen und Höflichkeit',
          titleEnglish: 'First Greetings and Politeness',
          fullStoryText: 'Guten Tag! Wie geht es Ihnen? Vielen Dank für Ihre Unterstützung. Bitte sehr und auf Wiedersehen! Tschüss!',
          fullStoryTranslation: 'Good day! How are you? Thank you very much for your support. You are welcome and goodbye! Bye!',
          sentences: [
            { id: 'st-s1', audioText: 'Guten Tag! Wie geht es Ihnen?', targetText: 'Guten Tag! Wie geht es Ihnen?', translation: 'Good day! How are you?' },
            { id: 'st-s2', audioText: 'Vielen Dank für Ihre Unterstützung.', targetText: 'Vielen Dank für Ihre Unterstützung.', translation: 'Thank you very much for your support.' },
            { id: 'st-s3', audioText: 'Bitte sehr und auf Wiedersehen! Tschüss!', targetText: 'Bitte sehr und auf Wiedersehen! Tschüss!', translation: 'You are welcome and goodbye! Bye!' }
          ],
          comprehensionQuestion: {
            prompt: 'Welche Begrüßung aus dieser Lektion wird zu Beginn verwendet? (Which greeting from this lesson is used at the beginning?)',
            options: [
              { id: 'sq-1', text: 'Guten Tag (Good day / Hello)', translation: 'Correct objective from the lesson' },
              { id: 'sq-2', text: 'Gute Nacht (Good night)', translation: 'Night greeting' },
              { id: 'sq-3', text: 'Schönes Wochenende (Have a nice weekend)', translation: 'Weekend wish' }
            ],
            correctOptionId: 'sq-1',
            explanation: 'Ausgezeichnet! The passage begins with “Guten Tag”, the daytime greeting mastered in this lesson.'
          }
        };

      case 'Japanese':
        return {
          title: '基本の挨拶と感謝',
          titleEnglish: 'Basic Greetings and Gratitude',
          fullStoryText: 'こんにちは！すみません、少し失礼します。どうもありがとうございます。それでは、さようなら！',
          fullStoryTranslation: 'Hello! Excuse me for a moment. Thank you very much. Well then, goodbye!',
          sentences: [
            { id: 'st-s1', audioText: 'こんにちは！すみません、少し失礼します。', targetText: 'こんにちは！すみません、少し失礼します。', translation: 'Hello! Excuse me for a moment.' },
            { id: 'st-s2', audioText: 'どうもありがとうございます。', targetText: 'どうもありがとうございます。', translation: 'Thank you very much.' },
            { id: 'st-s3', audioText: 'それでは、さようなら！', targetText: 'それでは、さようなら！', translation: 'Well then, goodbye!' }
          ],
          comprehensionQuestion: {
            prompt: 'このレッスンで学んだ丁寧な感謝の言葉は何ですか？ (What polite expression of gratitude learned in this lesson was spoken?)',
            options: [
              { id: 'sq-1', text: 'どうもありがとうございます (Thank you very much)', translation: 'Correct objective from the lesson' },
              { id: 'sq-2', text: 'ごめんなさい (I am sorry)', translation: 'Casual apology' },
              { id: 'sq-3', text: 'おやすみなさい (Good night)', translation: 'Night greeting' }
            ],
            correctOptionId: 'sq-1',
            explanation: '素晴らしい！ The story uses “どうもありがとうございます”, the deep gratitude phrase learned in this lesson.'
          }
        };

      case 'Italian':
        return {
          title: 'Primi saluti e cortesia',
          titleEnglish: 'First Greetings and Courtesy',
          fullStoryText: 'Ciao! Buongiorno a tutti gli amici. Per favore, un momento. Grazie mille per il vostro aiuto. Arrivederci!',
          fullStoryTranslation: 'Hi! Good morning to all friends. Please, one moment. A thousand thanks for your help. Goodbye!',
          sentences: [
            { id: 'st-s1', audioText: 'Ciao! Buongiorno a tutti gli amici.', targetText: 'Ciao! Buongiorno a tutti gli amici.', translation: 'Hi! Good morning to all friends.' },
            { id: 'st-s2', audioText: 'Per favore, un momento. Grazie mille per il vostro aiuto.', targetText: 'Per favore, un momento. Grazie mille per il vostro aiuto.', translation: 'Please, one moment. A thousand thanks for your help.' },
            { id: 'st-s3', audioText: 'Arrivederci!', targetText: 'Arrivederci!', translation: 'Goodbye!' }
          ],
          comprehensionQuestion: {
            prompt: 'Quale espressione di gratitudine appresa in questa lezione viene usata? (Which gratitude phrase learned in this lesson is used?)',
            options: [
              { id: 'sq-1', text: 'Grazie mille (A thousand thanks)', translation: 'Correct objective from the lesson' },
              { id: 'sq-2', text: 'Prego (You are welcome)', translation: 'Reply to thanks' },
              { id: 'sq-3', text: 'Scusa (Excuse me)', translation: 'Casual apology' }
            ],
            correctOptionId: 'sq-1',
            explanation: 'Bravissimo! The passage prominently features “Grazie mille”, the core gratitude phrase taught in this lesson.'
          }
        };

      case 'French':
      default:
        return {
          title: 'Premiers sons et salutations',
          titleEnglish: 'First Sounds & Greetings',
          fullStoryText: 'Bonjour ! Mon papa est ici aujourd’hui. Tu dis salut et merci beaucoup. Tout va très bien. Au revoir !',
          fullStoryTranslation: 'Hello! My dad is here today. You say hi and thank you very much. Everything is going very well. Goodbye!',
          sentences: [
            { id: 'st-s1', audioText: 'Bonjour ! Mon papa est ici aujourd’hui.', targetText: 'Bonjour ! Mon papa est ici aujourd’hui.', translation: 'Hello! My dad is here today.' },
            { id: 'st-s2', audioText: 'Tu dis salut et merci beaucoup.', targetText: 'Tu dis salut et merci beaucoup.', translation: 'You say hi and thank you very much.' },
            { id: 'st-s3', audioText: 'Tout va très bien. Au revoir !', targetText: 'Tout va très bien. Au revoir !', translation: 'Everything is going very well. Goodbye!' }
          ],
          comprehensionQuestion: {
            prompt: 'Quel mot de politesse appris dans cette leçon est utilisé pour remercier ? (Which courtesy word learned in this lesson is used to say thank you?)',
            options: [
              { id: 'sq-1', text: 'Merci beaucoup (Thank you very much)', translation: 'Correct objective from the lesson' },
              { id: 'sq-2', text: 'Pardon (Sorry / Excuse me)', translation: 'Apology' },
              { id: 'sq-3', text: 'Non merci (No thank you)', translation: 'Declining' }
            ],
            correctOptionId: 'sq-1',
            explanation: 'Magnifique ! “Merci beaucoup” was the courtesy expression learned in this lesson.'
          }
        };
    }
  }

  // Units 2+ across the entire curriculum:
  // Dynamically constructed narrative weaving together the exact vocabulary and sentences learned in that lesson
  const displayTitle = lessonTitle || `${pack.name} Practicum`;

  if (languageName === 'Chinese Mandarin') {
    return {
      title: `${displayTitle}：情境微短文`,
      titleEnglish: `${displayTitle}: Context Micro-Story`,
      fullStoryText: `你好！在这一课中，我们掌握了重要的表达：“${t1.cleanAudioText}”。在实际对话中，“${t2.cleanAudioText}”。非常感谢大家的认真练习！`,
      fullStoryTranslation: `Hello! In this lesson, we mastered the key expression: "${t1.cleanAudioText}". In real conversation: "${t2.cleanAudioText}". Thank you very much for your dedicated practice!`,
      sentences: [
        { id: 's1', audioText: `你好！在这一课中，我们掌握了重要的表达：“${t1.cleanAudioText}”。`, targetText: `你好！在这一课中，我们掌握了重要的表达：“${t1.cleanAudioText}”。`, translation: `Hello! In this lesson, we mastered: "${t1.cleanAudioText}".` },
        { id: 's2', audioText: `在实际对话中，“${t2.cleanAudioText}”。`, targetText: `在实际对话中，“${t2.cleanAudioText}”。`, translation: `In real conversation: "${t2.cleanAudioText}".` },
        { id: 's3', audioText: '非常感谢大家的认真练习！', targetText: '非常感谢大家的认真练习！', translation: 'Thank you very much for your dedicated practice!' }
      ],
      comprehensionQuestion: {
        prompt: `在短文中，说话人使用了本课所学的哪个关键表达？ (Which key expression learned in this lesson did the speaker use?)`,
        options: [
          { id: 'sq-1', text: `${t1.term} (${t1.translation})`, translation: 'Correct objective from the lesson' },
          { id: 'sq-2', text: `${pack.goodbye.target} (${pack.goodbye.trans})`, translation: 'Different phrase' },
          { id: 'sq-3', text: `${pack.howAreYou.target} (${pack.howAreYou.trans})`, translation: 'Different phrase' }
        ],
        correctOptionId: 'sq-1',
        explanation: `太棒了！ The passage explicitly highlights “${t1.term}” (${t1.translation}), which was the focal point of this lesson.`
      }
    };
  }

  if (languageName === 'Spanish') {
    return {
      title: `${displayTitle}: Historia en contexto`,
      titleEnglish: `${displayTitle}: Story in Context`,
      fullStoryText: `¡Hola! En esta lección aprendimos una expresión clave: "${t1.cleanAudioText}". En situaciones cotidianas decimos: "${t2.cleanAudioText}". ¡Muchas gracias por practicar con dedicación!`,
      fullStoryTranslation: `Hello! In this lesson we learned a key expression: "${t1.cleanAudioText}". In everyday situations we say: "${t2.cleanAudioText}". Thank you very much for practicing with dedication!`,
      sentences: [
        { id: 's1', audioText: `¡Hola! En esta lección aprendimos una expresión clave: "${t1.cleanAudioText}".`, targetText: `¡Hola! En esta lección aprendimos una expresión clave: "${t1.cleanAudioText}".`, translation: `Hello! In this lesson we learned: "${t1.cleanAudioText}".` },
        { id: 's2', audioText: `En situaciones cotidianas decimos: "${t2.cleanAudioText}".`, targetText: `En situaciones cotidianas decimos: "${t2.cleanAudioText}".`, translation: `In everyday situations we say: "${t2.cleanAudioText}".` },
        { id: 's3', audioText: '¡Muchas gracias por practicar con dedicación!', targetText: '¡Muchas gracias por practicar con dedicación!', translation: 'Thank you very much for practicing with dedication!' }
      ],
      comprehensionQuestion: {
        prompt: `¿Qué expresión clave aprendida en esta lección se destaca en la historia?`,
        options: [
          { id: 'sq-1', text: `${t1.term} (${t1.translation})`, translation: 'Correct objective from the lesson' },
          { id: 'sq-2', text: `${pack.goodbye.target} (${pack.goodbye.trans})`, translation: 'Different phrase' },
          { id: 'sq-3', text: `${pack.howAreYou.target} (${pack.howAreYou.trans})`, translation: 'Different phrase' }
        ],
        correctOptionId: 'sq-1',
        explanation: `¡Excelente! The story reinforces “${t1.term}” (${t1.translation}), the exact phrase mastered in this lesson.`
      }
    };
  }

  if (languageName === 'German') {
    return {
      title: `${displayTitle}: Geschichte im Kontext`,
      titleEnglish: `${displayTitle}: Story in Context`,
      fullStoryText: `Guten Tag! In dieser Lektion haben wir einen wichtigen Ausdruck geübt: „${t1.cleanAudioText}“. Im Alltag sagen wir: „${t2.cleanAudioText}“. Vielen Dank für Ihre tolle Aufmerksamkeit!`,
      fullStoryTranslation: `Good day! In this lesson we practiced an important expression: "${t1.cleanAudioText}". In daily life we say: "${t2.cleanAudioText}". Thank you very much for your great attention!`,
      sentences: [
        { id: 's1', audioText: `Guten Tag! In dieser Lektion haben wir einen wichtigen Ausdruck geübt: „${t1.cleanAudioText}“.`, targetText: `Guten Tag! In dieser Lektion haben wir einen wichtigen Ausdruck geübt: „${t1.cleanAudioText}“.`, translation: `Good day! In this lesson we practiced: "${t1.cleanAudioText}".` },
        { id: 's2', audioText: `Im Alltag sagen wir: „${t2.cleanAudioText}“.`, targetText: `Im Alltag sagen wir: „${t2.cleanAudioText}“.`, translation: `In daily life we say: "${t2.cleanAudioText}".` },
        { id: 's3', audioText: 'Vielen Dank für Ihre tolle Aufmerksamkeit!', targetText: 'Vielen Dank für Ihre tolle Aufmerksamkeit!', translation: 'Thank you very much for your great attention!' }
      ],
      comprehensionQuestion: {
        prompt: `Welcher Schlüsselausdruck aus dieser Lektion wird in der Geschichte hervorgehoben?`,
        options: [
          { id: 'sq-1', text: `${t1.term} (${t1.translation})`, translation: 'Correct objective from the lesson' },
          { id: 'sq-2', text: `${pack.goodbye.target} (${pack.goodbye.trans})`, translation: 'Different phrase' },
          { id: 'sq-3', text: `${pack.howAreYou.target} (${pack.howAreYou.trans})`, translation: 'Different phrase' }
        ],
        correctOptionId: 'sq-1',
        explanation: `Sehr gut! The story highlights “${t1.term}” (${t1.translation}), the core phrase learned in this lesson.`
      }
    };
  }

  if (languageName === 'Japanese') {
    return {
      title: `${displayTitle}：ショートストーリー`,
      titleEnglish: `${displayTitle}: Short Story in Context`,
      fullStoryText: `こんにちは！このレッスンでは、大切な表現「${t1.cleanAudioText}」を学びました。会話では「${t2.cleanAudioText}」のように使います。どうもありがとうございます！`,
      fullStoryTranslation: `Hello! In this lesson, we learned the important expression: "${t1.cleanAudioText}". In conversation we use: "${t2.cleanAudioText}". Thank you very much!`,
      sentences: [
        { id: 's1', audioText: `こんにちは！このレッスンでは、大切な表現「${t1.cleanAudioText}」を学びました。`, targetText: `こんにちは！このレッスンでは、大切な表現「${t1.cleanAudioText}」を学びました。`, translation: `Hello! In this lesson, we learned: "${t1.cleanAudioText}".` },
        { id: 's2', audioText: `会話では「${t2.cleanAudioText}」のように使います。`, targetText: `会話では「${t2.cleanAudioText}」のように使います。`, translation: `In conversation we use: "${t2.cleanAudioText}".` },
        { id: 's3', audioText: 'どうもありがとうございます！', targetText: 'どうもありがとうございます！', translation: 'Thank you very much!' }
      ],
      comprehensionQuestion: {
        prompt: `この物語で強調されている、レッスンで学んだ重要な表現はどれですか？`,
        options: [
          { id: 'sq-1', text: `${t1.term} (${t1.translation})`, translation: 'Correct objective from the lesson' },
          { id: 'sq-2', text: `${pack.goodbye.target} (${pack.goodbye.trans})`, translation: 'Different phrase' },
          { id: 'sq-3', text: `${pack.howAreYou.target} (${pack.howAreYou.trans})`, translation: 'Different phrase' }
        ],
        correctOptionId: 'sq-1',
        explanation: `素晴らしい！ The story focuses on “${t1.term}” (${t1.translation}), which was taught in this lesson.`
      }
    };
  }

  if (languageName === 'Italian') {
    return {
      title: `${displayTitle}: Storia in contesto`,
      titleEnglish: `${displayTitle}: Story in Context`,
      fullStoryText: `Ciao! In questa lezione abbiamo imparato un'espressione chiave: "${t1.cleanAudioText}". Nella conversazione diciamo: "${t2.cleanAudioText}". Grazie mille per il vostro impegno!`,
      fullStoryTranslation: `Hi! In this lesson we learned a key expression: "${t1.cleanAudioText}". In conversation we say: "${t2.cleanAudioText}". A thousand thanks for your dedication!`,
      sentences: [
        { id: 's1', audioText: `Ciao! In questa lezione abbiamo imparato un'espressione chiave: "${t1.cleanAudioText}".`, targetText: `Ciao! In questa lezione abbiamo imparato un'espressione chiave: "${t1.cleanAudioText}".`, translation: `Hi! In this lesson we learned: "${t1.cleanAudioText}".` },
        { id: 's2', audioText: `Nella conversazione diciamo: "${t2.cleanAudioText}".`, targetText: `Nella conversazione diciamo: "${t2.cleanAudioText}".`, translation: `In conversation we say: "${t2.cleanAudioText}".` },
        { id: 's3', audioText: 'Grazie mille per il vostro impegno!', targetText: 'Grazie mille per il vostro impegno!', translation: 'A thousand thanks for your dedication!' }
      ],
      comprehensionQuestion: {
        prompt: `Quale espressione chiave appresa in questa lezione è evidenziata nella storia?`,
        options: [
          { id: 'sq-1', text: `${t1.term} (${t1.translation})`, translation: 'Correct objective from the lesson' },
          { id: 'sq-2', text: `${pack.goodbye.target} (${pack.goodbye.trans})`, translation: 'Different phrase' },
          { id: 'sq-3', text: `${pack.howAreYou.target} (${pack.howAreYou.trans})`, translation: 'Different phrase' }
        ],
        correctOptionId: 'sq-1',
        explanation: `Bravissimo! “${t1.term}” (${t1.translation}) is the target expression mastered in this lesson.`
      }
    };
  }

  // French (Default for Units 2+)
  return {
    title: `${displayTitle} : Petite histoire en contexte`,
    titleEnglish: `${displayTitle}: Context Story`,
    fullStoryText: `Bonjour ! Dans cette leçon, nous avons appris une expression clé : « ${t1.cleanAudioText} ». Par exemple, on dit : « ${t2.cleanAudioText} ». Merci beaucoup pour votre excellente pratique !`,
    fullStoryTranslation: `Hello! In this lesson, we learned a key expression: "${t1.cleanAudioText}". For example, we say: "${t2.cleanAudioText}". Thank you very much for your excellent practice!`,
    sentences: [
      { id: 's1', audioText: `Bonjour ! Dans cette leçon, nous avons appris une expression clé : « ${t1.cleanAudioText} ».`, targetText: `Bonjour ! Dans cette leçon, nous avons appris une expression clé : « ${t1.cleanAudioText} ».`, translation: `Hello! In this lesson, we learned: "${t1.cleanAudioText}".` },
      { id: 's2', audioText: `Par exemple, on dit : « ${t2.cleanAudioText} ».`, targetText: `Par exemple, on dit : « ${t2.cleanAudioText} ».`, translation: `For example, we say: "${t2.cleanAudioText}".` },
      { id: 's3', audioText: 'Merci beaucoup pour votre excellente pratique !', targetText: 'Merci beaucoup pour votre excellente pratique !', translation: 'Thank you very much for your excellent practice!' }
    ],
    comprehensionQuestion: {
      prompt: `Quelle expression clé apprise dans cette leçon est mise en valeur dans l'histoire ?`,
      options: [
        { id: 'sq-1', text: `${t1.term} (${t1.translation})`, translation: 'Correct objective from the lesson' },
        { id: 'sq-2', text: `${pack.goodbye.target} (${pack.goodbye.trans})`, translation: 'Different phrase' },
        { id: 'sq-3', text: `${pack.howAreYou.target} (${pack.howAreYou.trans})`, translation: 'Different phrase' }
      ],
      correctOptionId: 'sq-1',
      explanation: `Magnifique ! L'histoire met en valeur « ${t1.term} » (${t1.translation}), l'expression centrale de cette leçon.`
    }
  };
}

class EarTrainingService {
  /**
   * Generates all 11 Ear Games specifically tailored to what was learned in that lesson/unit
   */
  public getRoundsForUnit(unitId: string, languageName = 'French', lessonId?: string): EarGameRound[] {
    const langOpt = getLanguageOption(languageName);
    const langCode = langOpt.code || 'fr-FR';
    const canonicalName = langOpt.name;

    // 1. Extract vocabulary strictly from the active lesson
    const { items, lessonTitle } = extractLessonVocab(unitId, canonicalName, lessonId);
    const t1 = items[0];
    const t2 = items[1] || items[0];
    const t3 = items[2] || items[0];
    const t4 = items[3] || items[1] || items[0];

    const rounds: EarGameRound[] = [
      // 1. BLIND EAR (Pure Acoustic Comprehension)
      {
        id: `${unitId}-r1-blind`,
        roundNumber: 1,
        mode: 'blind_ear',
        title: 'Blind Ear Recognition',
        badgeLabel: '1/11 · BLIND EAR',
        instruction: 'Zero text upfront! Listen closely and identify the English meaning purely by ear:',
        audioText: t1.cleanAudioText,
        langCode,
        targetText: t1.term,
        translation: t1.translation,
        phoneticHint: t1.phonetic,
        options: [
          { id: 'b-opt1', text: t1.translation, translation: 'Correct meaning from lesson' },
          { id: 'b-opt2', text: t2.translation, translation: 'Different term from lesson' },
          { id: 'b-opt3', text: t3.translation, translation: 'Different term from lesson' }
        ],
        correctOptionId: 'b-opt1',
        explanation: `“${t1.term}” was taught in this lesson as “${t1.translation}”. Your ear correctly decoded the acoustic pattern!`
      },

      // 2. AUDIO CLOZE (Spoken Gap-Fill)
      {
        id: `${unitId}-r2-cloze`,
        roundNumber: 2,
        mode: 'audio_cloze',
        title: 'Spoken Gap-Fill',
        badgeLabel: '2/11 · AUDIO CLOZE',
        instruction: 'Listen to the full spoken sentence. Which spoken word filled the audio gap?',
        audioText: t2.exampleUsage || `${t1.cleanAudioText}, ${t2.cleanAudioText}`,
        langCode,
        sentenceWithBlank: t2.exampleUsage && t2.exampleUsage.includes(t2.term)
          ? t2.exampleUsage.replace(t2.term, '[🔔]')
          : `${t1.term}, [🔔]`,
        translation: t2.exampleTranslation || `${t1.translation}, ${t2.translation}`,
        options: [
          { id: 'c-opt1', text: t2.term, translation: t2.translation, audioText: t2.cleanAudioText },
          { id: 'c-opt2', text: t1.term, translation: t1.translation, audioText: t1.cleanAudioText },
          { id: 'c-opt3', text: t4.term, translation: t4.translation, audioText: t4.cleanAudioText }
        ],
        correctOptionId: 'c-opt1',
        explanation: `The missing spoken word from this lesson was “${t2.term}” (${t2.translation}).`
      },

      // 3. ECHO MIMIC (Instant Shadowing & Voice Mimicry)
      {
        id: `${unitId}-r3-echo`,
        roundNumber: 3,
        mode: 'echo_mimic',
        title: 'Voice Shadowing Sprint',
        badgeLabel: '3/11 · ECHO MIMIC',
        instruction: 'Listen to native tempo and rhythm. When the countdown hits 0, speak into your mic to mimic the pitch:',
        audioText: t2.cleanAudioText,
        langCode,
        targetText: t2.term,
        translation: t2.translation,
        phoneticHint: t2.phonetic || '',
        explanation: `Excellent acoustic resonance! You mirrored “${t2.term}” (${t2.translation}) with native cadence.`
      },

      // 4. SOUND BLITZ (Speed Audio-to-Meaning Sprint)
      {
        id: `${unitId}-r4-blitz`,
        roundNumber: 4,
        mode: 'sound_blitz',
        title: 'Sound Blitz Sprint',
        badgeLabel: '4/11 · SOUND BLITZ',
        instruction: 'Timed Blitz: Tap each card to hear its native sound, then pair with its meaning before time runs out!',
        audioText: t1.cleanAudioText,
        langCode,
        blitzPairs: [t1, t2, t3, t4].map((item, idx) => ({
          id: `bp-${idx + 1}`,
          audioText: item.cleanAudioText,
          term: item.term,
          translation: item.translation
        }))
      },

      // 5. MINIMAL PAIR DUEL (Acoustic Discrimination)
      {
        id: `${unitId}-r5-pair`,
        roundNumber: 5,
        mode: 'minimal_pair_duel',
        title: 'Minimal Pair Acoustic Duel',
        badgeLabel: '5/11 · ACOUSTIC DUEL',
        instruction: 'Listen carefully to the acoustic shaping: Which term from this lesson was spoken?',
        audioText: t1.cleanAudioText,
        langCode,
        targetText: t1.term,
        translation: t1.translation,
        options: [
          { id: 'mp-1', text: `${t1.term} (${t1.translation})`, audioText: t1.cleanAudioText, translation: t1.translation },
          { id: 'mp-2', text: `${t2.term} (${t2.translation})`, audioText: t2.cleanAudioText, translation: t2.translation }
        ],
        correctOptionId: 'mp-1',
        explanation: `Your ear detected “${t1.term}”! Recognizing acoustic nuances learned in this lesson builds fluency.`
      },

      // 6. AUDIO TILE BUILDER (Reverse Dictation)
      {
        id: `${unitId}-r6-dictation`,
        roundNumber: 6,
        mode: 'audio_tile_builder',
        title: 'Reverse Audio Dictation',
        badgeLabel: '6/11 · TILE BUILDER',
        instruction: 'Listen to the full phrase with no written prompt. Tap the word chips in exact spoken order:',
        audioText: `${t1.cleanAudioText} ${t2.cleanAudioText}`,
        langCode,
        targetText: `${t1.term} ${t2.term}`,
        translation: `${t1.translation} · ${t2.translation}`,
        tileChips: [t2.term, t1.term, t3.term],
        correctWordOrder: [t1.term, t2.term],
        explanation: `Sentence accurately reconstructed from this lesson: “${t1.term} ${t2.term}”.`
      },

      // 7. SPEED WARP (Normal vs Fast Native Cadence)
      {
        id: `${unitId}-r7-warp`,
        roundNumber: 7,
        mode: 'speed_warp',
        title: 'Speed Warp: 1.0x vs 1.25x Street Speed',
        badgeLabel: '7/11 · SPEED WARP',
        instruction: 'Compare normal 1.0x cadence against fast conversational 1.25x speed. What was said?',
        audioText: t3.exampleUsage || `${t1.cleanAudioText} ${t2.cleanAudioText}`,
        langCode,
        targetText: t3.exampleUsage || `${t1.term} ${t2.term}`,
        translation: t3.exampleTranslation || `${t1.translation} · ${t2.translation}`,
        options: [
          { id: 'sw-1', text: t3.exampleUsage || `${t1.term} ${t2.term}`, translation: t3.exampleTranslation || `${t1.translation} · ${t2.translation}` },
          { id: 'sw-2', text: `${t4.term} ${t2.term}`, translation: 'Distractor' },
          { id: 'sw-3', text: `${t2.term} ${t1.term}`, translation: 'Distractor' }
        ],
        correctOptionId: 'sw-1',
        explanation: 'At 1.25x speed, native speakers link words through smooth acoustic transitions.'
      },

      // 8. AUDIO TRUE / FALSE (Rapid Reality Check)
      {
        id: `${unitId}-r8-tf`,
        roundNumber: 8,
        mode: 'audio_true_false',
        title: 'Rapid Auditory Reality Check',
        badgeLabel: '8/11 · TRUE OR FALSE',
        instruction: 'Listen to the native statement. Does it match the concept card?',
        audioText: t1.cleanAudioText,
        langCode,
        conceptStatement: `The speaker is saying: “${t1.translation}”`,
        isTrueStatement: true,
        explanation: `Correct! In this lesson, “${t1.term}” means “${t1.translation}”.`
      },

      // 9. AUDIO DIALOGUE REPLY (Sound-to-Context Reaction)
      {
        id: `${unitId}-r9-dialogue`,
        roundNumber: 9,
        mode: 'audio_dialogue_reply',
        title: 'Spoken Dialogue Reaction',
        badgeLabel: '9/11 · SPOKEN DIALOGUE',
        instruction: 'You hear this statement from the lesson. Listen to the choices and pick the natural reply:',
        audioText: t1.cleanAudioText,
        langCode,
        targetText: t1.term,
        translation: t1.translation,
        options: [
          { id: 'dr-1', text: t2.term, translation: t2.translation, audioText: t2.cleanAudioText },
          { id: 'dr-2', text: t3.term, translation: t3.translation, audioText: t3.cleanAudioText },
          { id: 'dr-3', text: t4.term, translation: t4.translation, audioText: t4.cleanAudioText }
        ],
        correctOptionId: 'dr-1',
        explanation: `When someone says “${t1.term}” (${t1.translation}), responding with “${t2.term}” (${t2.translation}) is natural in this lesson's context.`
      },

      // 10. BOSS SHADOWING TEST (Vocal Cadence Mastery)
      {
        id: `${unitId}-r10-boss`,
        roundNumber: 10,
        mode: 'boss_shadowing',
        title: 'The Boss Shadowing Test',
        badgeLabel: '10/11 · BOSS SHADOWING',
        instruction: 'The Ultimate Acoustic Challenge: Listen and shadow these 3 connected phrases from this lesson back-to-back!',
        audioText: t1.cleanAudioText,
        langCode,
        bossPhrases: [
          { id: 'bp-a', audioText: t1.cleanAudioText, targetText: t1.term, translation: t1.translation },
          { id: 'bp-b', audioText: t2.cleanAudioText, targetText: t2.term, translation: t2.translation },
          { id: 'bp-c', audioText: t3.cleanAudioText, targetText: t3.term, translation: t3.translation }
        ],
        explanation: `Lesson Acoustic Mastery Unlocked! You repeated all 3 key phrases from this lesson with native cadence and clarity.`
      },

      // 11. THE NATIVE AUDIO STORY & COMPREHENSION (Mode 11)
      (() => {
        const story = getStoryForLesson(unitId, canonicalName, [t1, t2, t3, t4], lessonTitle);
        return {
          id: `${unitId}-r11-story`,
          roundNumber: 11,
          mode: 'audio_story' as EarGameModeType,
          title: 'Native Short Story & Audio',
          badgeLabel: '11/11 · SHORT STORY',
          instruction: 'Read the short story and listen as it is read aloud in the language. Then, answer the question by selecting the correct objective below:',
          audioText: story.fullStoryText,
          langCode,
          storyData: story
        };
      })()
    ];

    return rounds;
  }
}

export const earTrainingService = new EarTrainingService();
