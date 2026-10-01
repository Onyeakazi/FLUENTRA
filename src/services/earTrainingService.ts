// FLUENTRA 11-Mode Ear Training & Audio Arcade Service
// Generates exercises, audio cues, and stories strictly from what is learned in that specific lesson/unit
import { UNIT_JOURNEYS } from '../data/unitJourneys';
import { LANGUAGE_PACKS, getLessonsForUnit, getTopicSpecificCurriculumItems } from '../data/curriculumContent';
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

interface DynamicDialoguePayload {
  promptAudioText: string;
  promptTargetText: string;
  promptTranslation: string;
  options: { id: string; text: string; translation: string; audioText: string }[];
  correctOptionId: string;
  explanation: string;
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
  const unitMeta = CURRICULUM_DATA.unitsById[unitId];
  const lessonTitle = targetLesson?.title || unitMeta?.title || 'Lesson Core';

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

  // 3. Fallback from other lessons in the unit or topic items to ensure at least 4 items
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

  // 4. Enrich with topic-specific curriculum items if still needed
  if (items.length < 4 && unitMeta) {
    const { item1, item2 } = getTopicSpecificCurriculumItems(unitMeta, canonicalName);
    addCandidate(item1.target, item1.trans, item1.target);
    addCandidate(item2.target, item2.trans, item2.target);
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
 * Generates an authentic, topic-specific dialogue reaction for Round 9
 * that changes dynamically based on the unit topic and lesson context
 */
function getDynamicDialogue(
  unitId: string,
  canonicalName: string,
  lessonId: string | undefined,
  items: LessonVocabItem[]
): DynamicDialoguePayload {
  const pack = LANGUAGE_PACKS[canonicalName] || LANGUAGE_PACKS.French;
  const unitMeta = CURRICULUM_DATA.unitsById[unitId];
  const title = (unitMeta?.title || '').toLowerCase();
  const category = (unitMeta?.category || '').toLowerCase();
  const combined = `${title} ${category}`;

  const t1 = items[0] || { term: pack.greetingFormal.target, cleanAudioText: pack.greetingFormal.target, translation: pack.greetingFormal.trans };
  const t2 = items[1] || { term: pack.thankYou.target, cleanAudioText: pack.thankYou.target, translation: pack.thankYou.trans };
  const t3 = items[2] || { term: pack.goodbye.target, cleanAudioText: pack.goodbye.target, translation: pack.goodbye.trans };

  // Unit 1: Foundations & First Sounds vs First Greetings
  if (unitId === 'u1') {
    if (lessonId?.includes('-l1')) {
      // Lesson 1: Acoustic Distinction / Phonics
      switch (canonicalName) {
        case 'Chinese Mandarin':
          return {
            promptAudioText: '请听：mā 的发音在声调上是平稳高昂还是急促下降？',
            promptTargetText: 'mā（第一声）：平稳高昂还是急促下降？',
            promptTranslation: 'Tone 1 mā: Is it held high and flat, or does it drop sharply?',
            options: [
              { id: 'dr-1', text: '高而平稳（High & Flat: 55）', translation: 'Correct tone pitch', audioText: '高而平稳' },
              { id: 'dr-2', text: '急促下降（Sharp drop: 51）', translation: 'Incorrect (Tone 4)', audioText: '急促下降' },
              { id: 'dr-3', text: '先降后升（Dipping tone: 214）', translation: 'Incorrect (Tone 3)', audioText: '先降后升' }
            ],
            correctOptionId: 'dr-1',
            explanation: '第一声（mā）音高在五度标记法中为55，像唱歌一样保持平稳高昂。'
          };
        case 'Spanish':
          return {
            promptAudioText: 'En español, ¿cómo se pronuncia la letra H en la palabra ¡Hola!?',
            promptTargetText: 'En « ¡Hola! », ¿cómo se pronuncia la « H »?',
            promptTranslation: 'In "¡Hola!", how is the letter "H" pronounced?',
            options: [
              { id: 'dr-1', text: 'Es totalmente muda (se dice « Oh-la »)', translation: 'Silent H rule', audioText: 'Es totalmente muda' },
              { id: 'dr-2', text: 'Suena como una J fuerte', translation: 'Incorrect', audioText: 'Suena como una J' },
              { id: 'dr-3', text: 'Suena como una W inglesa', translation: 'Incorrect', audioText: 'Suena como W' }
            ],
            correctOptionId: 'dr-1',
            explanation: 'En español, la letra « H » nunca tiene sonido. « ¡Hola! » se pronuncia directamente /ˈo.la/.'
          };
        case 'German':
          return {
            promptAudioText: 'Wie wird der Buchstabe W im Deutschen ausgesprochen?',
            promptTargetText: 'Wie spricht man das « W » in « Wie » aus?',
            promptTranslation: 'How is the letter "W" pronounced in German words like "Wie"?',
            options: [
              { id: 'dr-1', text: 'Wie ein englisches V (/viː/)', translation: 'German W = V sound', audioText: 'Wie ein V' },
              { id: 'dr-2', text: 'Wie ein englisches W (/wiː/)', translation: 'Incorrect', audioText: 'Wie ein W' },
              { id: 'dr-3', text: 'Völlig stumm ohne Ton', translation: 'Incorrect', audioText: 'Stumm' }
            ],
            correctOptionId: 'dr-1',
            explanation: 'Im Deutschen entspricht der Buchstabe « W » immer dem stimmhaften Laut /v/.'
          };
        case 'Japanese':
          return {
            promptAudioText: '「こんにちは」の文字拍数は何拍ですか？',
            promptTargetText: '「こんにちは」のリズムは何拍ですか？',
            promptTranslation: 'How many mora beats are in "Konnichiwa"?',
            options: [
              { id: 'dr-1', text: '5拍（こ・ん・に・ち・は）', translation: '5 equal mora beats', audioText: '5拍です' },
              { id: 'dr-2', text: '3拍（こん・に・ちは）', translation: 'Incorrect', audioText: '3拍です' },
              { id: 'dr-3', text: '2拍（こん・ちわ）', translation: 'Incorrect', audioText: '2拍です' }
            ],
            correctOptionId: 'dr-1',
            explanation: '日本語はモーラ（拍）言語です。「ん」も含めて一拍ずつ等しいリズムで発音します。'
          };
        case 'Italian':
          return {
            promptAudioText: 'Nella parola Ciao, come si pronuncia il gruppo ci?',
            promptTargetText: 'In « Ciao », come si pronuncia il gruppo « ci »?',
            promptTranslation: 'In "Ciao", how is the group "ci" pronounced?',
            options: [
              { id: 'dr-1', text: 'Suono dolce « ch » come in cioccolato (/tʃ/)', translation: 'Soft Italian C', audioText: 'Suono dolce ch' },
              { id: 'dr-2', text: 'Suono duro « k » come in casa', translation: 'Incorrect', audioText: 'Suono duro k' },
              { id: 'dr-3', text: 'Suono sibilante « s » come in sole', translation: 'Incorrect', audioText: 'Suono s' }
            ],
            correctOptionId: 'dr-1',
            explanation: 'In italiano, la lettera C davanti alle vocali I ed E ha sempre un suono dolce dolce (/tʃ/).'
          };
        case 'French':
        default:
          return {
            promptAudioText: 'Dans le mot Salut, est-ce que la lettre finale t se prononce ?',
            promptTargetText: 'Dans « Salut », la consonne « t » se prononce-t-elle ?',
            promptTranslation: 'In "Salut", is the final consonant "t" voiced?',
            options: [
              { id: 'dr-1', text: 'Non, la consonne finale est muette (/sa.ly/)', translation: 'Silent consonant rule', audioText: 'Non, elle est muette' },
              { id: 'dr-2', text: 'Oui, on prononce un T très fort', translation: 'Incorrect', audioText: 'Oui, très fort' },
              { id: 'dr-3', text: 'C’est la lettre S qui est muette', translation: 'Incorrect', audioText: 'Le S est muet' }
            ],
            correctOptionId: 'dr-1',
            explanation: 'En français standard, les consonnes finales (s, t, d, x) sont silencieuses dans les mots isolés.'
          };
      }
    }

    // Lesson 2: Tone Sandhi & First Courteous Greeting
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          promptAudioText: '你好！最近好吗？很高兴见到你！',
          promptTargetText: '你好！最近好吗？',
          promptTranslation: 'Hello! How have you been? Great to see you!',
          options: [
            { id: 'dr-1', text: '你好！我很好，谢谢你！', translation: 'Hello! I am doing very well, thank you!', audioText: '你好！我很好，谢谢你！' },
            { id: 'dr-2', text: '再见，明天不用来了。', translation: 'Goodbye, no need to come tomorrow.', audioText: '再见' },
            { id: 'dr-3', text: '不用谢，请进吧。', translation: 'You are welcome, come in.', audioText: '不用谢' }
          ],
          correctOptionId: 'dr-1',
          explanation: '面对问候“你好！最近好吗？”，最自然亲切的回应是“你好！我很好，谢谢你！”。'
        };
      case 'Spanish':
        return {
          promptAudioText: '¡Hola! Buenos días, ¿cómo estás hoy?',
          promptTargetText: '¡Hola! Buenos días, ¿cómo estás?',
          promptTranslation: 'Hello! Good morning, how are you today?',
          options: [
            { id: 'dr-1', text: '¡Hola! Muy bien, muchas gracias.', translation: 'Hello! Very well, thank you very much.', audioText: '¡Hola! Muy bien, muchas gracias.' },
            { id: 'dr-2', text: 'Adiós señor, hasta el próximo año.', translation: 'Goodbye sir, until next year.', audioText: 'Adiós señor' },
            { id: 'dr-3', text: 'No gracias, no tengo hambre.', translation: 'No thanks, I am not hungry.', audioText: 'No gracias' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'La respuesta natural y cortés ante un saludo matutino es agradecer y confirmar que estás bien.'
        };
      case 'German':
        return {
          promptAudioText: 'Guten Tag! Wie geht es Ihnen heute?',
          promptTargetText: 'Guten Tag! Wie geht es Ihnen?',
          promptTranslation: 'Good day! How are you doing today?',
          options: [
            { id: 'dr-1', text: 'Guten Tag! Sehr gut, vielen Dank.', translation: 'Good day! Very well, thank you very much.', audioText: 'Guten Tag! Sehr gut, vielen Dank.' },
            { id: 'dr-2', text: 'Gute Nacht und schlaf gut.', translation: 'Good night and sleep well.', audioText: 'Gute Nacht' },
            { id: 'dr-3', text: 'Das ist falsch und unmöglich.', translation: 'That is wrong and impossible.', audioText: 'Das ist falsch' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'Auf die höfliche Begrüßung «Guten Tag!» antwortet man mit «Sehr gut, vielen Dank».'
        };
      case 'Japanese':
        return {
          promptAudioText: 'こんにちは！今日はお元気ですか？',
          promptTargetText: 'こんにちは！今日はお元気ですか？',
          promptTranslation: 'Hello! How are you doing today?',
          options: [
            { id: 'dr-1', text: 'こんにちは！はい、とても元気です。ありがとうございます！', translation: 'Hello! Yes, very well. Thank you very much!', audioText: 'こんにちは！はい、元気です。' },
            { id: 'dr-2', text: 'さようなら、もう会いません。', translation: 'Goodbye, we won’t meet again.', audioText: 'さようなら' },
            { id: 'dr-3', text: 'いいえ、わかりません。', translation: 'No, I don’t understand.', audioText: 'わかりません' }
          ],
          correctOptionId: 'dr-1',
          explanation: '挨拶「こんにちは！お元気ですか？」には、元気を伝えて感謝する返答が最も自然です。'
        };
      case 'Italian':
        return {
          promptAudioText: 'Ciao! Buongiorno, come stai oggi?',
          promptTargetText: 'Ciao! Buongiorno, come stai?',
          promptTranslation: 'Hi! Good morning, how are you today?',
          options: [
            { id: 'dr-1', text: 'Ciao! Molto bene, grazie mille.', translation: 'Hi! Very well, thank you very much.', audioText: 'Ciao! Molto bene, grazie mille.' },
            { id: 'dr-2', text: 'Buonanotte e sogni d’oro.', translation: 'Good night and sweet dreams.', audioText: 'Buonanotte' },
            { id: 'dr-3', text: 'Non mi piace per niente.', translation: 'I don’t like it at all.', audioText: 'Non mi piace' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'A un saluto affettuoso si risponde con entusiasmo: «Molto bene, grazie mille!».'
        };
      case 'French':
      default:
        return {
          promptAudioText: 'Bonjour ! Comment allez-vous aujourd’hui ?',
          promptTargetText: 'Bonjour ! Comment allez-vous ?',
          promptTranslation: 'Hello! How are you doing today?',
          options: [
            { id: 'dr-1', text: 'Bonjour ! Ça va très bien, merci beaucoup.', translation: 'Hello! I am doing very well, thank you very much.', audioText: 'Bonjour ! Ça va très bien, merci.' },
            { id: 'dr-2', text: 'Au revoir et bonne nuit.', translation: 'Goodbye and good night.', audioText: 'Au revoir et bonne nuit.' },
            { id: 'dr-3', text: 'Pardon, je ne parle pas.', translation: 'Sorry, I don’t speak.', audioText: 'Pardon' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'La formule d’étiquette standard pour répondre à « Comment allez-vous ? » est « Ça va très bien, merci ! ».'
        };
    }
  }

  // Unit 2: Nasal Vowels & Survival Words
  if (unitId === 'u2' || combined.includes('nasal')) {
    switch (canonicalName) {
      case 'French':
      default:
        return {
          promptAudioText: 'Bonjour messieurs-dames ! Qu’est-ce qui vous ferait plaisir pour le déjeuner ?',
          promptTargetText: 'Bonjour ! Qu’est-ce qui vous ferait plaisir ?',
          promptTranslation: 'Hello! What would you like for lunch?',
          options: [
            { id: 'dr-1', text: 'Un bon pain frais et un verre de vin s’il vous plaît !', translation: 'A good fresh bread and a glass of wine please!', audioText: 'Un bon pain et un verre de vin s’il vous plaît !' },
            { id: 'dr-2', text: 'Je m’appelle Thomas et j’ai faim.', translation: 'My name is Thomas and I am hungry.', audioText: 'Je m’appelle Thomas.' },
            { id: 'dr-3', text: 'Au revoir et à demain matin.', translation: 'Goodbye and see you tomorrow morning.', audioText: 'Au revoir et à demain.' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'Au restaurant ou à la boulangerie, on commande avec courtoisie : « Un bon pain... et du vin s’il vous plaît ! ».'
        };
    }
  }

  // Unit 3: Silent Letters & Sentence Stems
  if (unitId === 'u3' || combined.includes('silent')) {
    switch (canonicalName) {
      case 'French':
      default:
        return {
          promptAudioText: 'Est-ce que c’est difficile d’apprendre la prononciation française ?',
          promptTargetText: 'C’est difficile d’apprendre le français ?',
          promptTranslation: 'Is it difficult to learn French pronunciation?',
          options: [
            { id: 'dr-1', text: 'Non, ce n’est pas difficile avec de l’écoute régulière !', translation: 'No, it is not difficult with regular listening!', audioText: 'Non, ce n’est pas difficile !' },
            { id: 'dr-2', text: 'Il est trois heures et quart à la montre.', translation: 'It is a quarter past three on the watch.', audioText: 'Il est trois heures.' },
            { id: 'dr-3', text: 'Une grande baguette bien chaude.', translation: 'A large hot baguette.', audioText: 'Une grande baguette.' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'Pour exprimer une négation claire sur une difficulté, la réplique naturelle est « Ce n’est pas difficile ! ».'
        };
    }
  }

  // Unit 4: Elisions & Liaisons in Real Speech
  if (unitId === 'u4' || combined.includes('elision') || combined.includes('liaison')) {
    switch (canonicalName) {
      case 'French':
      default:
        return {
          promptAudioText: 'Pardon monsieur, vous avez le temps pour une question rapide ?',
          promptTargetText: 'Pardon, vous avez le temps ?',
          promptTranslation: 'Excuse me, do you have time for a quick question?',
          options: [
            { id: 'dr-1', text: 'Oui, j’ai cinq minutes, c’est un plaisir !', translation: 'Yes, I have five minutes, it’s a pleasure!', audioText: 'Oui, j’ai cinq minutes, c’est un plaisir !' },
            { id: 'dr-2', text: 'Au revoir et passez une bonne nuit !', translation: 'Goodbye and have a good night!', audioText: 'Au revoir et bonne nuit !' },
            { id: 'dr-3', text: 'La gare centrale est très loin.', translation: 'The central station is very far.', audioText: 'La gare est très loin.' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'À la question « Vous avez le temps ? », la réplique naturelle et courtoise est « Oui, j’ai cinq minutes, c’est un plaisir ! », en respectant l’élision (j’ai) et la liaison (c’est un).'
        };
    }
  }

  // 1. Topic: Saying / Asking Names
  if (combined.includes('name') || combined.includes('prénom') || combined.includes('称呼') || combined.includes('llam') || combined.includes('heiß')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          promptAudioText: '你好！请问你叫什么名字？',
          promptTargetText: '请问你叫什么名字？',
          promptTranslation: 'May I ask, what is your name?',
          options: [
            { id: 'dr-1', text: '我叫李明。很高兴认识你！', translation: 'My name is Li Ming. Nice to meet you!', audioText: '我叫李明。很高兴认识你！' },
            { id: 'dr-2', text: '这是一杯热咖啡。', translation: 'This is a hot coffee.', audioText: '这是一杯热咖啡。' },
            { id: 'dr-3', text: '再见，走好！', translation: 'Goodbye, take care!', audioText: '再见，走好！' }
          ],
          correctOptionId: 'dr-1',
          explanation: '面对询问姓名，使用“我叫……”介绍自己是最自然得体的回答。'
        };
      case 'Spanish':
        return {
          promptAudioText: '¡Mucho gusto! ¿Cómo te llamas tú?',
          promptTargetText: '¿Cómo te llamas tú?',
          promptTranslation: 'Pleased to meet you! What is your name?',
          options: [
            { id: 'dr-1', text: 'Me llamo Carlos. ¡Mucho gusto!', translation: 'My name is Carlos. Nice to meet you!', audioText: 'Me llamo Carlos. ¡Mucho gusto!' },
            { id: 'dr-2', text: 'La cuenta por favor señor.', translation: 'The check please sir.', audioText: 'La cuenta por favor.' },
            { id: 'dr-3', text: 'El tren sale a las cuatro.', translation: 'The train leaves at four.', audioText: 'El tren sale a las cuatro.' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'La respuesta correcta para identificarte es usar «Me llamo...» seguido de tu nombre.'
        };
      case 'German':
        return {
          promptAudioText: 'Guten Tag! Wie heißen Sie bitte?',
          promptTargetText: 'Wie heißen Sie bitte?',
          promptTranslation: 'Good day! What is your name please?',
          options: [
            { id: 'dr-1', text: 'Ich heiße Anna. Sehr angenehm!', translation: 'My name is Anna. Pleased to meet you!', audioText: 'Ich heiße Anna. Sehr angenehm!' },
            { id: 'dr-2', text: 'Ein Glas Apfelsaft bitte.', translation: 'A glass of apple juice please.', audioText: 'Ein Glas Apfelsaft bitte.' },
            { id: 'dr-3', text: 'Der Bahnhof ist dort drüben.', translation: 'The train station is over there.', audioText: 'Der Bahnhof ist dort.' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'Auf die Frage «Wie heißen Sie?» antwortet man direkt mit «Ich heiße...».'
        };
      case 'Japanese':
        return {
          promptAudioText: '初めまして！お名前は何とおっしゃいますか？',
          promptTargetText: 'お名前は何とおっしゃいますか？',
          promptTranslation: 'Nice to meet you! What is your name?',
          options: [
            { id: 'dr-1', text: '田中と申します。どうぞよろしくお願いします！', translation: 'My name is Tanaka. Pleased to meet you!', audioText: '田中と申します。よろしく！' },
            { id: 'dr-2', text: '駅はあちらにあります。', translation: 'The station is over there.', audioText: '駅はあちらです。' },
            { id: 'dr-3', text: '切符を二枚ください。', translation: 'Two tickets please.', audioText: '切符を二枚ください。' }
          ],
          correctOptionId: 'dr-1',
          explanation: '名乗りの質問には「〜と申します。どうぞよろしく」と礼儀正しく返答します。'
        };
      case 'Italian':
        return {
          promptAudioText: 'Piacere di conoscerti! Come ti chiami?',
          promptTargetText: 'Piacere! Come ti chiami?',
          promptTranslation: 'Nice to meet you! What is your name?',
          options: [
            { id: 'dr-1', text: 'Mi chiamo Marco. Molto piacere!', translation: 'My name is Marco. Very pleased to meet you!', audioText: 'Mi chiamo Marco. Molto piacere!' },
            { id: 'dr-2', text: 'Un caffè macchiato per favore.', translation: 'An espresso with milk please.', audioText: 'Un caffè macchiato.' },
            { id: 'dr-3', text: 'Il museo è chiuso il lunedì.', translation: 'The museum is closed on Monday.', audioText: 'Il museo è chiuso.' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'Alla domanda «Come ti chiami?», si risponde con «Mi chiamo...» e un cordiale piacere.'
        };
      case 'French':
      default:
        return {
          promptAudioText: 'Bonjour ! Comment vous appelez-vous ?',
          promptTargetText: 'Comment vous appelez-vous ?',
          promptTranslation: 'Hello! What is your name?',
          options: [
            { id: 'dr-1', text: 'Je m’appelle Thomas. Enchanté de faire votre connaissance !', translation: 'My name is Thomas. Delighted to meet you!', audioText: 'Je m’appelle Thomas. Enchanté !' },
            { id: 'dr-2', text: 'C’est une baguette bien cuite.', translation: 'It is a well-baked baguette.', audioText: 'Une baguette bien cuite.' },
            { id: 'dr-3', text: 'Il est trois heures et quart.', translation: 'It is a quarter past three.', audioText: 'Trois heures et quart.' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'Pour vous présenter poliment, utilisez « Je m’appelle... » suivi de la formule de politesse « Enchanté ».'
        };
    }
  }

  // 2. Topic: Where Are You From? / Origin
  if (combined.includes('where') || combined.includes('from') || combined.includes('origin') || combined.includes('d’où') || combined.includes('dónde') || combined.includes('来自')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          promptAudioText: '你中文说得真好！请问你来自哪里？',
          promptTargetText: '请问你来自哪里？',
          promptTranslation: 'You speak Chinese so well! Where are you from?',
          options: [
            { id: 'dr-1', text: '我来自北京，目前在读书。你呢？', translation: 'I am from Beijing, currently studying. And you?', audioText: '我来自北京，你呢？' },
            { id: 'dr-2', text: '不用谢，请慢走。', translation: 'You are welcome, walk slowly.', audioText: '不用谢' },
            { id: 'dr-3', text: '现在是上午十点整。', translation: 'It is 10:00 AM now.', audioText: '上午十点整' }
          ],
          correctOptionId: 'dr-1',
          explanation: '回答籍贯询问时，表达“我来自……”并礼貌反问“你呢？”最地道。'
        };
      case 'Spanish':
        return {
          promptAudioText: '¡Hablas muy bien español! ¿De dónde eres tú?',
          promptTargetText: '¿De dónde eres tú?',
          promptTranslation: 'You speak Spanish very well! Where are you from?',
          options: [
            { id: 'dr-1', text: 'Soy de Madrid, España. ¿Y tú de dónde eres?', translation: 'I am from Madrid, Spain. And where are you from?', audioText: 'Soy de Madrid, ¿y tú?' },
            { id: 'dr-2', text: 'Muchas gracias por la comida.', translation: 'Thank you very much for the meal.', audioText: 'Muchas gracias' },
            { id: 'dr-3', text: 'Hasta el próximo viernes.', translation: 'Until next Friday.', audioText: 'Hasta el viernes' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'Se responde indicando la procedencia con «Soy de...» o «Vengo de...».'
        };
      case 'French':
      default:
        return {
          promptAudioText: 'Vous avez un très bel accent ! D’où venez-vous ?',
          promptTargetText: 'D’où venez-vous ?',
          promptTranslation: 'You have a lovely accent! Where do you come from?',
          options: [
            { id: 'dr-1', text: 'Je viens de Paris, en France. Et vous ?', translation: 'I come from Paris, France. And you?', audioText: 'Je viens de Paris, et vous ?' },
            { id: 'dr-2', text: 'Deux baguettes s’il vous plaît.', translation: 'Two baguettes please.', audioText: 'Deux baguettes' },
            { id: 'dr-3', text: 'Bonne nuit et dormez bien.', translation: 'Good night and sleep well.', audioText: 'Bonne nuit' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'La réponse authentique utilise « Je viens de... » suivie du nom de votre ville ou pays.'
        };
    }
  }

  // 3. Topic: Food / Café / Ordering
  if (combined.includes('food') || combined.includes('café') || combined.includes('coffee') || combined.includes('drink') || combined.includes('order') || combined.includes('restaurant')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          promptAudioText: '您好，欢迎光临！请问今天想点些什么？',
          promptTargetText: '请问今天想喝点什么？',
          promptTranslation: 'Welcome! What would you like to drink today?',
          options: [
            { id: 'dr-1', text: '请给我一杯热咖啡和一份点心，谢谢！', translation: 'Please give me a hot coffee and snack, thank you!', audioText: '请给我一杯热咖啡和点心！' },
            { id: 'dr-2', text: '我的电话号码是八八六六。', translation: 'My phone number is 8866.', audioText: '电话号码是八八六六。' },
            { id: 'dr-3', text: '我来自加拿大。', translation: 'I come from Canada.', audioText: '我来自加拿大。' }
          ],
          correctOptionId: 'dr-1',
          explanation: '在茶馆或咖啡厅点单，使用“请给我一杯……”最礼貌顺畅。'
        };
      case 'French':
      default:
        return {
          promptAudioText: 'Bonjour messieurs-dames ! Qu’est-ce qui vous ferait plaisir ce matin ?',
          promptTargetText: 'Qu’est-ce que je vous sers ce matin ?',
          promptTranslation: 'Good morning! What can I get for you this morning?',
          options: [
            { id: 'dr-1', text: 'Je voudrais un café au lait et un croissant s’il vous plaît !', translation: 'I would like a coffee with milk and a croissant please!', audioText: 'Un café et un croissant s’il vous plaît !' },
            { id: 'dr-2', text: 'J’ai vingt-cinq ans et j’habite loin.', translation: 'I am 25 years old and live far away.', audioText: 'J’ai vingt-cinq ans.' },
            { id: 'dr-3', text: 'Au revoir et à la semaine prochaine.', translation: 'Goodbye and see you next week.', audioText: 'Au revoir.' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'La formule classique pour commander au café est « Je voudrais... s’il vous plaît ».'
        };
    }
  }

  // 4. Topic: Travel / Directions
  if (combined.includes('direction') || combined.includes('station') || combined.includes('hotel') || combined.includes('travel') || combined.includes('where is')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          promptAudioText: '打扰一下，请问火车站应该怎么走？',
          promptTargetText: '请问火车站应该怎么走？',
          promptTranslation: 'Excuse me, which way to the train station?',
          options: [
            { id: 'dr-1', text: '一直往前走两百米，然后在路口右转就到了。', translation: 'Go straight ahead 200m, then turn right at the crossing.', audioText: '一直往前走，然后右转。' },
            { id: 'dr-2', text: '今天星期五，祝你周末愉快。', translation: 'Today is Friday, have a great weekend.', audioText: '祝你周末愉快。' },
            { id: 'dr-3', text: '不用客气，再见！', translation: 'You are welcome, goodbye!', audioText: '不用客气。' }
          ],
          correctOptionId: 'dr-1',
          explanation: '指路问路的对话核心是方位指示：“一直往前走……然后右转”。'
        };
      case 'French':
      default:
        return {
          promptAudioText: 'Pardon monsieur, sauriez-vous où se trouve la gare centrale ?',
          promptTargetText: 'Où se trouve la gare s’il vous plaît ?',
          promptTranslation: 'Excuse me sir, where is the central train station?',
          options: [
            { id: 'dr-1', text: 'Allez tout droit sur cette avenue, puis tournez à droite !', translation: 'Go straight on this avenue, then turn right!', audioText: 'Allez tout droit puis tournez à droite !' },
            { id: 'dr-2', text: 'Je m’appelle Thomas et j’ai faim.', translation: 'My name is Thomas and I am hungry.', audioText: 'Je m’appelle Thomas.' },
            { id: 'dr-3', text: 'C’est une bonne baguette bien chaude.', translation: 'It is a good hot baguette.', audioText: 'Une bonne baguette.' }
          ],
          correctOptionId: 'dr-1',
          explanation: 'Pour répondre à une demande d’itinéraire, indiquez la direction : « Allez tout droit... ».'
        };
    }
  }

  // General Dynamic Fallback: build an authentic question-and-answer exchange
  const questionPrompt = t1.exampleUsage && t1.exampleUsage.includes('?')
    ? t1.exampleUsage
    : `Pardon, ${t1.exampleUsage || t1.term} ?`;
  const questionTrans = t1.exampleTranslation || `Excuse me, ${t1.translation}?`;

  const naturalReply = t2.exampleUsage
    ? `Oui, ${t2.exampleUsage}`
    : `Oui, ${t2.term}, merci !`;
  const naturalReplyTrans = t2.exampleTranslation
    ? `Yes, ${t2.exampleTranslation}`
    : `Yes, ${t2.translation}, thank you!`;

  return {
    promptAudioText: questionPrompt,
    promptTargetText: questionPrompt,
    promptTranslation: questionTrans,
    options: [
      { id: 'dr-1', text: naturalReply, translation: naturalReplyTrans, audioText: naturalReply },
      { id: 'dr-2', text: `${pack.goodbye.target} et bonne soirée !`, translation: `Goodbye and have a good evening!`, audioText: `${pack.goodbye.target} et bonne soirée !` },
      { id: 'dr-3', text: `Non désolé, je ne sais pas.`, translation: `No sorry, I do not know.`, audioText: `Non désolé, je ne sais pas.` }
    ],
    correctOptionId: 'dr-1',
    explanation: `Dans ce contexte, la réponse polie et naturelle est « ${naturalReply} » (${naturalReplyTrans}).`
  };
}

/**
 * Generates an authentic, engaging micro-story for Round 11
 * tailored specifically to the unit topic and lesson items
 */
function getDynamicStory(
  unitId: string,
  canonicalName: string,
  lessonId: string | undefined,
  items: LessonVocabItem[],
  lessonTitle?: string
): StoryDataPayload {
  const pack = LANGUAGE_PACKS[canonicalName] || LANGUAGE_PACKS.French;
  const unitMeta = CURRICULUM_DATA.unitsById[unitId];
  const title = (unitMeta?.title || '').toLowerCase();
  const category = (unitMeta?.category || '').toLowerCase();
  const combined = `${title} ${category}`;

  const t1 = items[0] || { term: pack.greetingFormal.target, cleanAudioText: pack.greetingFormal.target, translation: pack.greetingFormal.trans };
  const t2 = items[1] || { term: pack.thankYou.target, cleanAudioText: pack.thankYou.target, translation: pack.thankYou.trans };

  // Unit 1 Ground Zero: Lesson 1 (Phonics) vs Lesson 2 (Greetings)
  if (unitId === 'u1') {
    if (lessonId?.includes('-l1')) {
      switch (canonicalName) {
        case 'Chinese Mandarin':
          return {
            title: '初识汉语：四声的奥秘',
            titleEnglish: 'First Mandarin: The Secret of the 4 Tones',
            fullStoryText: '今天我们上了第一节中文发音课。老师教我们练习四个声调：mā、má、mǎ、mà。声调非常重要，声调不同，意思完全不同。比如 mā 是妈妈，mǎ 是骏马。大家认真练习，发音越来越标准！',
            fullStoryTranslation: 'Today we had our first Chinese pronunciation lesson. The teacher taught us to practice the 4 tones: mā, má, mǎ, mà. Tones are very important; different tones carry completely different meanings. For example, mā means mother, and mǎ means horse. Everyone practiced diligently and their pronunciation got better and better!',
            sentences: [
              { id: 's1', audioText: '今天我们上了第一节中文发音课。', targetText: '今天我们上了第一节中文发音课。', translation: 'Today we had our first Chinese pronunciation lesson.' },
              { id: 's2', audioText: '老师教我们练习四个声调：mā、má、mǎ、mà。', targetText: '老师教我们练习四个声调：mā、má、mǎ、mà。', translation: 'The teacher taught us to practice the 4 tones: mā, má, mǎ, mà.' },
              { id: 's3', audioText: '声调非常重要，声调不同，意思完全不同。比如 mā 是妈妈，mǎ 是马。', targetText: '声调非常重要，声调不同，意思完全不同。比如 mā 是妈妈，mǎ 是马。', translation: 'Tones are very important; different tones carry completely different meanings. For example, mā means mother, and mǎ means horse.' }
            ],
            comprehensionQuestion: {
              prompt: '根据这篇短文，本课的核心重点是什么？ (According to the story, what is the core focus of this lesson?)',
              options: [
                { id: 'sq-1', text: '汉语拼音的四个基本声调 (The 4 basic tones of Chinese Pinyin)', translation: 'Correct objective from the lesson' },
                { id: 'sq-2', text: '去超市买菜和付款 (Buying vegetables at the supermarket)', translation: 'Unrelated topic' },
                { id: 'sq-3', text: '如何在火车站改签车票 (How to exchange a train ticket)', translation: 'Unrelated topic' }
              ],
              correctOptionId: 'sq-1',
              explanation: '太棒了！ The story highlights the foundational 4 Mandarin tones (mā, má, mǎ, mà) introduced in Lesson 1.'
            }
          };
        case 'French':
        default:
          return {
            title: 'Les premiers sons du français',
            titleEnglish: 'The First Sounds of French',
            fullStoryText: 'Ce matin, dans notre cours de phonétique, nous découvrons les voyelles françaises et la règle des lettres muettes. Dans le mot « Salut », la consonne finale est silencieuse. Tout le monde écoute attentivement et répète avec soin !',
            fullStoryTranslation: 'This morning, in our phonetics class, we discover French vowels and the silent letter rule. In the word "Salut", the final consonant is silent. Everyone listens attentively and repeats with care!',
            sentences: [
              { id: 's1', audioText: 'Ce matin, dans notre cours de phonétique, nous découvrons les voyelles françaises.', targetText: 'Ce matin, dans notre cours de phonétique, nous découvrons les voyelles françaises.', translation: 'This morning, in our phonetics class, we discover French vowels.' },
              { id: 's2', audioText: 'Dans le mot « Salut », la consonne finale est silencieuse.', targetText: 'Dans le mot « Salut », la consonne finale est silencieuse.', translation: 'In the word "Salut", the final consonant is silent.' },
              { id: 's3', audioText: 'Tout le monde écoute attentivement et répète avec soin !', targetText: 'Tout le monde écoute attentivement et répète avec soin !', translation: 'Everyone listens attentively and repeats with care!' }
            ],
            comprehensionQuestion: {
              prompt: 'Quelle règle de prononciation est expliquée dans cette histoire ?',
              options: [
                { id: 'sq-1', text: 'La règle des consonnes finales muettes comme dans « Salut »', translation: 'Correct objective from the lesson' },
                { id: 'sq-2', text: 'Comment réserver une chambre d’hôtel à Paris', translation: 'Unrelated' },
                { id: 'sq-3', text: 'Comment demander l’addition au restaurant', translation: 'Unrelated' }
              ],
              correctOptionId: 'sq-1',
              explanation: 'Magnifique ! La leçon explique la règle d’or des consonnes muettes en français.'
            }
          };
      }
    }

    // Lesson 2 or general Unit 1: First greetings & warm connection
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          title: '清晨的温暖问候',
          titleEnglish: 'A Warm Morning Greeting',
          fullStoryText: '早晨阳光明媚。小明在公园散步，遇到了热情的邻居王阿姨。小明微笑着说：“王阿姨，您好！”王阿姨高兴地回应：“你好小明！祝你今天心情愉快。”大家互相问好，开启了美好的一天。',
          fullStoryTranslation: 'The morning sunshine was bright. Xiao Ming was walking in the park and met his friendly neighbor, Auntie Wang. Xiao Ming smiled and said: "Auntie Wang, hello!" Auntie Wang replied happily: "Hello Xiao Ming! Have a joyful day." Everyone greeted each other and started a wonderful day.',
          sentences: [
            { id: 's1', audioText: '早晨阳光明媚，小明在公园散步。', targetText: '早晨阳光明媚，小明在公园散步。', translation: 'The morning sunshine was bright, Xiao Ming walked in the park.' },
            { id: 's2', audioText: '小明微笑着说：“王阿姨，您好！”', targetText: '小明微笑着说：“王阿姨，您好！”', translation: 'Xiao Ming smiled and said: "Auntie Wang, hello!"' },
            { id: 's3', audioText: '王阿姨高兴地回应：“你好小明！祝你今天愉快。”', targetText: '王阿姨高兴地回应：“你好小明！祝你今天愉快。”', translation: 'Auntie Wang replied happily: "Hello Xiao Ming! Have a nice day."' }
          ],
          comprehensionQuestion: {
            prompt: '小明在公园见到邻居时，使用了本课学到的哪个礼貌问候语？ (When Xiao Ming met his neighbor, which greeting from this lesson did he use?)',
            options: [
              { id: 'sq-1', text: '您好！ (Nǐn hǎo - Respectful Hello)', translation: 'Correct objective from the lesson' },
              { id: 'sq-2', text: '对不起，请让开 (Sorry, please move)', translation: 'Incorrect' },
              { id: 'sq-3', text: '太贵了，便宜点 (Too expensive)', translation: 'Incorrect' }
            ],
            correctOptionId: 'sq-1',
            explanation: '太棒了！ The story shows Xiao Ming using the respectful polite greeting “您好！” (Nǐn hǎo) learned in this lesson.'
          }
        };
      case 'French':
      default:
        return {
          title: 'Rencontre matinale et politesse',
          titleEnglish: 'Morning Encounter and Politeness',
          fullStoryText: 'Le soleil brille sur la place du marché. Julien croise sa voisine madame Lambert et lui dit chaleureusement : « Bonjour madame ! Comment allez-vous ? ». Elle lui répond avec le sourire : « Très bien merci Julien ! ». La politesse rend chaque journée plus agréable.',
          fullStoryTranslation: 'The sun shines over the marketplace. Julien bumps into his neighbor Mrs. Lambert and says warmly: "Hello madam! How are you doing?". She smiles back: "Very well thank you Julien!". Politeness makes every day brighter.',
          sentences: [
            { id: 's1', audioText: 'Le soleil brille sur la place du marché.', targetText: 'Le soleil brille sur la place du marché.', translation: 'The sun shines over the marketplace.' },
            { id: 's2', audioText: 'Julien dit : « Bonjour madame ! Comment allez-vous ? ».', targetText: 'Julien dit : « Bonjour madame ! Comment allez-vous ? ».', translation: 'Julien says: "Hello madam! How are you doing?".' },
            { id: 's3', audioText: 'Elle lui répond avec le sourire : « Très bien merci ! ».', targetText: 'Elle lui répond avec le sourire : « Très bien merci ! ».', translation: 'She smiles back: "Very well thank you!".' }
          ],
          comprehensionQuestion: {
            prompt: 'Quelle salutation polie apprise dans cette leçon Julien utilise-t-il au marché ?',
            options: [
              { id: 'sq-1', text: '« Bonjour madame ! Comment allez-vous ? »', translation: 'Correct objective from the lesson' },
              { id: 'sq-2', text: '« Au revoir et bonne nuit »', translation: 'Incorrect' },
              { id: 'sq-3', text: '« Combien coûte cette table ? »', translation: 'Incorrect' }
            ],
            correctOptionId: 'sq-1',
            explanation: 'Bravo ! L’histoire met en pratique la salutation polie quotidienne « Bonjour ! Comment allez-vous ? ».'
          }
        };
    }
  }

  // Topic: Saying / Asking Names
  if (combined.includes('name') || combined.includes('prénom') || combined.includes('称呼') || combined.includes('llam') || combined.includes('heiß')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          title: '新同学的自我介绍',
          titleEnglish: 'A New Student’s Introduction',
          fullStoryText: '今天大学开学，来自各地的同学们聚在教室里。一位新同学微笑着站起来说：“大家好！我叫李明，来自北京。非常高兴认识大家！”教室里响起了热烈的掌声，大家纷纷欢迎他。',
          fullStoryTranslation: 'Today college began, and students from different places gathered in the classroom. A new student stood up with a smile: "Hello everyone! My name is Li Ming, and I am from Beijing. Very pleased to meet you all!" Warm applause filled the room as everyone welcomed him.',
          sentences: [
            { id: 's1', audioText: '今天大学开学，同学们聚在教室里。', targetText: '今天大学开学，同学们聚在教室里。', translation: 'Today college began, students gathered in the classroom.' },
            { id: 's2', audioText: '新同学微笑着说：“大家好！我叫李明，很高兴认识大家！”', targetText: '新同学微笑着说：“大家好！我叫李明，很高兴认识大家！”', translation: 'The new student smiled: "Hello everyone! My name is Li Ming, nice to meet you all!"' },
            { id: 's3', audioText: '教室里响起了掌声，大家热烈欢迎他。', targetText: '教室里响起了掌声，大家热烈欢迎他。', translation: 'Warm applause filled the room as everyone welcomed him.' }
          ],
          comprehensionQuestion: {
            prompt: '新同学在自我介绍时使用了哪个关键句子？ (Which key sentence did the new student use when introducing his name?)',
            options: [
              { id: 'sq-1', text: '我叫李明，很高兴认识大家！ (My name is Li Ming, pleased to meet you all!)', translation: 'Correct objective from the lesson' },
              { id: 'sq-2', text: '这碗面太辣了，我不要 (This noodle is too spicy, I don’t want it)', translation: 'Unrelated' },
              { id: 'sq-3', text: '明天我们要去长城旅游 (Tomorrow we will visit the Great Wall)', translation: 'Unrelated' }
            ],
            correctOptionId: 'sq-1',
            explanation: '太棒了！ The story reinforces stating your name using “我叫……” (My name is...), the focus of this lesson.'
          }
        };
      case 'French':
      default:
        return {
          title: 'Présentations au premier jour',
          titleEnglish: 'First Day Introductions',
          fullStoryText: 'C’est le premier jour de cours à l’université. Une nouvelle étudiante s’avance vers le groupe et déclare avec enthousiasme : « Bonjour à tous ! Je m’appelle Sophie et je suis ravie d’être ici ». Ses camarades lui répondent en chœur : « Bienvenue Sophie, enchantés ! ».',
          fullStoryTranslation: 'It is the first day of class at the university. A new student steps forward and says with enthusiasm: "Hello everyone! My name is Sophie and I am thrilled to be here". Her classmates reply together: "Welcome Sophie, delighted to meet you!".',
          sentences: [
            { id: 's1', audioText: 'C’est le premier jour de cours à l’université.', targetText: 'C’est le premier jour de cours à l’université.', translation: 'It is the first day of class at the university.' },
            { id: 's2', audioText: 'Elle dit : « Bonjour à tous ! Je m’appelle Sophie. ».', targetText: 'Elle dit : « Bonjour à tous ! Je m’appelle Sophie. ».', translation: 'She says: "Hello everyone! My name is Sophie."' },
            { id: 's3', audioText: 'Ses camarades lui répondent : « Bienvenue Sophie, enchantés ! ».', targetText: 'Ses camarades lui répondent : « Bienvenue Sophie, enchantés ! ».', translation: 'Her classmates reply: "Welcome Sophie, delighted to meet you!".' }
          ],
          comprehensionQuestion: {
            prompt: 'Comment la nouvelle étudiante s’est-elle présentée à ses camarades ?',
            options: [
              { id: 'sq-1', text: 'Elle a dit : « Je m’appelle Sophie »', translation: 'Correct objective from the lesson' },
              { id: 'sq-2', text: 'Elle a demandé où était le train pour Lyon', translation: 'Unrelated' },
              { id: 'sq-3', text: 'Elle a commandé un café et un croissant', translation: 'Unrelated' }
            ],
            correctOptionId: 'sq-1',
            explanation: 'Excellent ! L’histoire met en valeur l’expression clé « Je m’appelle... » pour se présenter.'
          }
        };
    }
  }

  // Topic: Where Are You From? / Origin
  if (combined.includes('where') || combined.includes('from') || combined.includes('origin') || combined.includes('d’où') || combined.includes('dónde') || combined.includes('来自')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          title: '国际青年的友好交流',
          titleEnglish: 'An International Gathering',
          fullStoryText: '在国际文化节上，来自各国的年轻人聚在一起喝茶。大卫热情地询问：“小林，请问你来自哪里？”小林微笑着回答：“我来自中国北京，那是一座历史悠久的城市。你呢？”大卫说他来自加拿大。大家开心地交流起各地的风土人情。',
          fullStoryTranslation: 'At the international cultural festival, young people from various countries gathered to drink tea. David asked warmly: "Xiao Lin, where are you from?" Xiao Lin smiled: "I come from Beijing, China, a historic city. And you?" David said he comes from Canada. Everyone happily shared stories of their hometowns.',
          sentences: [
            { id: 's1', audioText: '在国际文化节上，青年们聚在一起喝茶。', targetText: '在国际文化节上，青年们聚在一起喝茶。', translation: 'At the international festival, youths gathered to drink tea.' },
            { id: 's2', audioText: '小林微笑着回答：“我来自中国北京，你呢？”', targetText: '小林微笑着回答：“我来自中国北京，你呢？”', translation: 'Xiao Lin smiled: "I come from Beijing, China, and you?"' },
            { id: 's3', audioText: '大家开心地交流起各地的风土人情。', targetText: '大家开心地交流起各地的风土人情。', translation: 'Everyone happily shared stories of their hometowns.' }
          ],
          comprehensionQuestion: {
            prompt: '根据短文，小林向大卫介绍了自己的家乡在哪里？ (According to the story, where did Xiao Lin say his hometown is?)',
            options: [
              { id: 'sq-1', text: '中国北京 (Beijing, China)', translation: 'Correct objective from the lesson' },
              { id: 'sq-2', text: '法国巴黎 (Paris, France)', translation: 'Unrelated' },
              { id: 'sq-3', text: '西班牙马德里 (Madrid, Spain)', translation: 'Unrelated' }
            ],
            correctOptionId: 'sq-1',
            explanation: '太棒了！ 小林用本课学到的“我来自……”清楚地说明了自己来自中国北京。'
          }
        };
      case 'French':
      default:
        return {
          title: 'Rencontre internationale à l’auberge',
          titleEnglish: 'International Meetup at the Hostel',
          fullStoryText: 'Sur la terrasse d’une auberge à Nice, des voyageurs partagent un verre au coucher du soleil. Marc demande à Maria : « D’où venez-vous Maria ? ». Elle répond fièrement : « Je viens de Rome, en Italie. Et vous ? ». Marc lui explique qu’il vient de Lyon. Ils deviennent rapidement de très bons amis.',
          fullStoryTranslation: 'On the terrace of a hostel in Nice, travelers share a drink at sunset. Marc asks Maria: "Where do you come from Maria?". She replies proudly: "I come from Rome, Italy. And you?". Marc explains he comes from Lyon. They quickly become great friends.',
          sentences: [
            { id: 's1', audioText: 'Des voyageurs partagent un verre au coucher du soleil.', targetText: 'Des voyageurs partagent un verre au coucher du soleil.', translation: 'Travelers share a drink at sunset.' },
            { id: 's2', audioText: 'Maria répond fièrement : « Je viens de Rome, en Italie. ».', targetText: 'Maria répond fièrement : « Je viens de Rome, en Italie. ».', translation: 'Maria replies proudly: "I come from Rome, Italy."' },
            { id: 's3', audioText: 'Marc lui explique qu’il vient de Lyon.', targetText: 'Marc lui explique qu’il vient de Lyon.', translation: 'Marc explains he comes from Lyon.' }
          ],
          comprehensionQuestion: {
            prompt: 'D’où vient Maria selon l’histoire apprise dans cette leçon ?',
            options: [
              { id: 'sq-1', text: 'Elle a répondu : « Je viens de Rome, en Italie »', translation: 'Correct objective from the lesson' },
              { id: 'sq-2', text: 'Elle a dit qu’elle habitait à Tokyo', translation: 'Unrelated' },
              { id: 'sq-3', text: 'Elle a dit qu’elle était perdue', translation: 'Unrelated' }
            ],
            correctOptionId: 'sq-1',
            explanation: 'Parfait ! L’histoire met en pratique l’expression d’origine « Je viens de... ».'
          }
        };
    }
  }

  // Topic: Café / Ordering / Food
  if (combined.includes('food') || combined.includes('café') || combined.includes('coffee') || combined.includes('drink') || combined.includes('order') || combined.includes('restaurant')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          title: '惬意的茶馆时光',
          titleEnglish: 'Relaxing Time at the Teahouse',
          fullStoryText: '下午三点，阳光透过窗户洒在桌上。小王来到繁华街角的茶馆，礼貌地对服务员说：“请给我一杯热绿茶和一份新鲜的点心，谢谢！”服务员微笑着把茶点端上来。小王静静地享受着美味与悠闲。',
          fullStoryTranslation: 'At 3:00 PM, sunlight poured onto the table through the window. Xiao Wang arrived at a bustling teahouse on the corner and politely said to the waiter: "Please give me a cup of hot green tea and a fresh snack, thank you!" The waiter brought the order with a smile. Xiao Wang quietly enjoyed the delicious treats.',
          sentences: [
            { id: 's1', audioText: '小王来到街角的茶馆坐下。', targetText: '小王来到街角的茶馆坐下。', translation: 'Xiao Wang sat down at the corner teahouse.' },
            { id: 's2', audioText: '他对服务员说：“请给我一杯热绿茶和点心，谢谢！”', targetText: '他对服务员说：“请给我一杯热绿茶和点心，谢谢！”', translation: 'He said to the waiter: "Please give me hot tea and snacks, thanks!"' },
            { id: 's3', audioText: '服务员微笑着送上美味的茶点。', targetText: '服务员微笑着送上美味的茶点。', translation: 'The waiter brought the delicious refreshments with a smile.' }
          ],
          comprehensionQuestion: {
            prompt: '小王在茶馆向服务员点了什么？ (What did Xiao Wang order from the waiter?)',
            options: [
              { id: 'sq-1', text: '一杯热绿茶和一份新鲜的点心 (A hot green tea and fresh snack)', translation: 'Correct objective from the lesson' },
              { id: 'sq-2', text: '一张去北京的火车票 (A train ticket to Beijing)', translation: 'Unrelated' },
              { id: 'sq-3', text: '一本红色的中文笔记本 (A red Chinese notebook)', translation: 'Unrelated' }
            ],
            correctOptionId: 'sq-1',
            explanation: '太棒了！ 小王使用了本课的核心点餐句型“请给我一杯……”。'
          }
        };
      case 'French':
      default:
        return {
          title: 'Pause gourmande au bistrot',
          titleEnglish: 'Gourmet Break at the Bistro',
          fullStoryText: 'Il est huit heures du matin dans une rue animée de Paris. Antoine s’installe à la terrasse du bistrot et dit au garçon : « Bonjour ! Je voudrais un café au lait et un croissant s’il vous plaît ». Le serveur apporte rapidement la commande avec un grand verre d’eau fraîche. Quelle belle façon de démarrer la journée !',
          fullStoryTranslation: 'It is 8:00 AM on a lively Paris street. Antoine sits down at the bistro terrace and says to the waiter: "Hello! I would like a coffee with milk and a croissant please". The waiter quickly brings the order along with a large glass of fresh water. What a wonderful way to begin the day!',
          sentences: [
            { id: 's1', audioText: 'Antoine s’installe à la terrasse du bistrot parisien.', targetText: 'Antoine s’installe à la terrasse du bistrot parisien.', translation: 'Antoine sits at the Parisian bistro terrace.' },
            { id: 's2', audioText: 'Il dit : « Je voudrais un café au lait et un croissant s’il vous plaît ».', targetText: 'Il dit : « Je voudrais un café au lait et un croissant s’il vous plaît ».', translation: 'He says: "I would like a coffee with milk and a croissant please".' },
            { id: 's3', audioText: 'Le serveur apporte rapidement la commande bien chaude.', targetText: 'Le serveur apporte rapidement la commande bien chaude.', translation: 'The waiter quickly brings the hot order.' }
          ],
          comprehensionQuestion: {
            prompt: 'Qu’a commandé Antoine à la terrasse du bistrot ?',
            options: [
              { id: 'sq-1', text: 'Un café au lait et un croissant', translation: 'Correct objective from the lesson' },
              { id: 'sq-2', text: 'Un billet de train pour Marseille', translation: 'Unrelated' },
              { id: 'sq-3', text: 'Deux valises pour le voyage', translation: 'Unrelated' }
            ],
            correctOptionId: 'sq-1',
            explanation: 'Parfait ! L’histoire met en application la commande de café : « Je voudrais un café... s’il vous plaît ».'
          }
        };
    }
  }

  // Dynamic Context Story for any other Unit across the curriculum:
  // Weaves together the actual practical topic and target phrases into a realistic narrative
  const targetTopic = unitMeta?.title || lessonTitle || 'Leçon Pratique';

  return {
    title: `${targetTopic} : Histoire en situation`,
    titleEnglish: `${targetTopic}: Story in Real Context`,
    fullStoryText: `Dans cette situation quotidienne, tout commence par une communication claire. Le locuteur exprime avec assurance : « ${t1.cleanAudioText} ». Son interlocuteur l'écoute attentivement et lui répond naturellement : « ${t2.cleanAudioText} ». C'est ainsi que la maîtrise pratique de la langue se construit jour après jour.`,
    fullStoryTranslation: `In this everyday situation, everything begins with clear communication. The speaker expresses with confidence: "${t1.cleanAudioText}". The listener pays close attention and responds naturally: "${t2.cleanAudioText}". This is how practical language fluency is built day by day.`,
    sentences: [
      { id: 's1', audioText: 'Dans cette situation quotidienne, tout commence par une communication claire.', targetText: 'Dans cette situation quotidienne, tout commence par une communication claire.', translation: 'In this everyday situation, everything begins with clear communication.' },
      { id: 's2', audioText: `Le locuteur dit : « ${t1.cleanAudioText} » et on lui répond : « ${t2.cleanAudioText} ».`, targetText: `Le locuteur dit : « ${t1.cleanAudioText} » et on lui répond : « ${t2.cleanAudioText} ».`, translation: `The speaker says: "${t1.cleanAudioText}" and gets answered: "${t2.cleanAudioText}".` },
      { id: 's3', audioText: 'C’est ainsi que la maîtrise pratique de la langue se construit.', targetText: 'C’est ainsi que la maîtrise pratique de la langue se construit.', translation: 'This is how practical fluency is built.' }
    ],
    comprehensionQuestion: {
      prompt: `Quelle expression essentielle de cette leçon a été prononcée dans la scène ?`,
      options: [
        { id: 'sq-1', text: `${t1.term} (${t1.translation})`, translation: 'Correct objective from the lesson' },
        { id: 'sq-2', text: `${pack.goodbye.target} (${pack.goodbye.trans})`, translation: 'Unrelated' },
        { id: 'sq-3', text: `${pack.howAreYou.target} (${pack.howAreYou.trans})`, translation: 'Unrelated' }
      ],
      correctOptionId: 'sq-1',
      explanation: `Bravo ! La scène illustre parfaitement l'usage actif de « ${t1.term} » (${t1.translation}).`
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
    const n = Math.max(items.length, 1);
    const t1 = items[0];
    const t2 = items[1 % n] || items[0];
    const t3 = items[2 % n] || items[1 % n] || items[0];
    const t4 = items[3 % n] || items[2 % n] || items[0];
    const t5 = items[4 % n] || items[3 % n] || items[0];

    // 2. Generate dynamic topic dialogue for Round 9
    const dialogue = getDynamicDialogue(unitId, canonicalName, lessonId, [t1, t2, t3, t4, t5]);

    // 3. Generate dynamic topic story for Round 11
    const story = getDynamicStory(unitId, canonicalName, lessonId, [t1, t2, t3, t4, t5], lessonTitle);

    // Dynamic tile builder sentence selection
    const tileCandidate = [t3.exampleUsage, t4.exampleUsage, t5.exampleUsage, t1.exampleUsage].find(
      s => s && s.split(/\s+/).length >= 3 && s.split(/\s+/).length <= 6
    ) || `${t3.term} ${t2.term}`;
    const tileTrans = (tileCandidate === t3.exampleUsage ? t3.exampleTranslation : tileCandidate === t4.exampleUsage ? t4.exampleTranslation : tileCandidate === t5.exampleUsage ? t5.exampleTranslation : tileCandidate === t1.exampleUsage ? t1.exampleTranslation : `${t3.translation} ${t2.translation}`) || t3.translation;
    const tileWords = tileCandidate.replace(/[.,?!:;]/g, '').trim().split(/\s+/);
    const extraWord = (t5.term.split(/\s+/)[0] !== tileWords[0] ? t5.term.split(/\s+/)[0] : t2.term.split(/\s+/)[0]) || 'ici';
    const tileChips = [...tileWords, extraWord].sort(() => 0.5 - Math.random());

    // Dynamic speed warp sentence selection with authentic options
    const warpTarget = t5.exampleUsage || t3.exampleUsage || t4.exampleUsage || `${t3.term} ${t2.term}`;
    const warpTargetTrans = t5.exampleTranslation || t3.exampleTranslation || t4.exampleTranslation || `${t3.translation} ${t2.translation}`;
    const warpDistractor1 = t1.exampleUsage || `${t1.term} s’il vous plaît.`;
    const warpDistractor1Trans = t1.exampleTranslation || `${t1.translation}, please.`;
    const warpDistractor2 = (t4.exampleUsage && t4.exampleUsage !== warpTarget ? t4.exampleUsage : t2.exampleUsage) || `${t4.term} ici.`;
    const warpDistractor2Trans = (t4.exampleUsage && t4.exampleUsage !== warpTarget ? t4.exampleTranslation : t2.exampleTranslation) || `${t4.translation} here.`;

    // Dynamic cloze sentence
    const clozeSentence = (t2.exampleUsage && t2.exampleUsage.includes(t2.term))
      ? t2.exampleUsage
      : (t3.exampleUsage || `${t3.term} ${t2.term}`);
    const clozeWithBlank = clozeSentence.includes(t2.term)
      ? clozeSentence.replace(t2.term, '[🔔]')
      : `${t3.term}, [🔔]`;

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
        audioText: clozeSentence,
        langCode,
        targetText: t2.term,
        sentenceWithBlank: clozeWithBlank,
        translation: t2.exampleTranslation || t2.translation,
        options: [
          { id: 'c-opt1', text: t2.term, translation: t2.translation, audioText: t2.cleanAudioText },
          { id: 'c-opt2', text: t3.term, translation: t3.translation, audioText: t3.cleanAudioText },
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
        audioText: t3.cleanAudioText,
        langCode,
        targetText: t3.term,
        translation: t3.translation,
        phoneticHint: t3.phonetic || '',
        explanation: `Excellent acoustic resonance! You mirrored “${t3.term}” (${t3.translation}) with native cadence.`
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
        audioText: t4.cleanAudioText,
        langCode,
        targetText: t4.term,
        translation: t4.translation,
        options: [
          { id: 'mp-1', text: t4.term, audioText: t4.cleanAudioText, translation: t4.translation },
          { id: 'mp-2', text: t5.term, audioText: t5.cleanAudioText, translation: t5.translation }
        ],
        correctOptionId: 'mp-1',
        explanation: `Your ear detected “${t4.term}”! Recognizing acoustic nuances learned in this lesson builds fluency.`
      },

      // 6. AUDIO TILE BUILDER (Reverse Dictation)
      {
        id: `${unitId}-r6-dictation`,
        roundNumber: 6,
        mode: 'audio_tile_builder',
        title: 'Reverse Audio Dictation',
        badgeLabel: '6/11 · TILE BUILDER',
        instruction: 'Listen to the full phrase with no written prompt. Tap the word chips in exact spoken order:',
        audioText: tileCandidate,
        langCode,
        targetText: tileCandidate,
        translation: tileTrans,
        tileChips: tileChips,
        correctWordOrder: tileWords,
        explanation: `Sentence accurately reconstructed from this lesson: “${tileCandidate}”.`
      },

      // 7. SPEED WARP (Normal vs Fast Native Cadence)
      {
        id: `${unitId}-r7-warp`,
        roundNumber: 7,
        mode: 'speed_warp',
        title: 'Speed Warp: 1.0x vs 1.25x Street Speed',
        badgeLabel: '7/11 · SPEED WARP',
        instruction: 'Compare normal 1.0x cadence against fast conversational 1.25x speed. What was said?',
        audioText: warpTarget,
        langCode,
        targetText: warpTarget,
        translation: warpTargetTrans,
        options: [
          { id: 'sw-1', text: warpTarget, translation: warpTargetTrans },
          { id: 'sw-2', text: warpDistractor1, translation: warpDistractor1Trans },
          { id: 'sw-3', text: warpDistractor2, translation: warpDistractor2Trans }
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
        audioText: t5.cleanAudioText,
        langCode,
        conceptStatement: `The speaker is saying: “${t5.translation}”`,
        isTrueStatement: true,
        explanation: `Correct! In this lesson, “${t5.term}” means “${t5.translation}”.`
      },

      // 9. AUDIO DIALOGUE REPLY (Topic-Driven Conversational Reaction)
      {
        id: `${unitId}-r9-dialogue`,
        roundNumber: 9,
        mode: 'audio_dialogue_reply',
        title: 'Spoken Dialogue Reaction',
        badgeLabel: '9/11 · SPOKEN DIALOGUE',
        instruction: 'You hear a native speaker say this in context. Listen to the choices and select the natural reply:',
        audioText: dialogue.promptAudioText,
        langCode,
        targetText: dialogue.promptTargetText,
        translation: dialogue.promptTranslation,
        options: dialogue.options,
        correctOptionId: dialogue.correctOptionId,
        explanation: dialogue.explanation
      },

      // 10. BOSS SHADOWING TEST (Vocal Cadence Mastery)
      {
        id: `${unitId}-r10-boss`,
        roundNumber: 10,
        mode: 'boss_shadowing',
        title: 'The Boss Shadowing Test',
        badgeLabel: '10/11 · BOSS SHADOWING',
        instruction: 'The Ultimate Acoustic Challenge: Pronounce each of the 3 phrases one by one to complete the streak!',
        audioText: t1.exampleUsage || t1.cleanAudioText,
        langCode,
        bossPhrases: [
          { id: 'bp-a', audioText: t1.exampleUsage || t1.cleanAudioText, targetText: t1.exampleUsage || t1.term, translation: t1.exampleTranslation || t1.translation },
          { id: 'bp-b', audioText: t3.exampleUsage || t3.cleanAudioText, targetText: t3.exampleUsage || t3.term, translation: t3.exampleTranslation || t3.translation },
          { id: 'bp-c', audioText: t5.exampleUsage || t5.cleanAudioText, targetText: t5.exampleUsage || t5.term, translation: t5.exampleTranslation || t5.translation }
        ],
        explanation: `Lesson Acoustic Mastery Unlocked! You successfully shadowed all 3 key phrases one by one with native cadence and clarity.`
      },

      // 11. THE NATIVE AUDIO STORY & COMPREHENSION (Mode 11)
      {
        id: `${unitId}-r11-story`,
        roundNumber: 11,
        mode: 'audio_story',
        title: 'Native Short Story & Audio',
        badgeLabel: '11/11 · SHORT STORY',
        instruction: 'Read the short story and listen as it is read aloud in the language. Then, answer the question by selecting the correct objective below:',
        audioText: story.fullStoryText,
        langCode,
        storyData: story
      }
    ];

    return rounds;
  }
}

export const earTrainingService = new EarTrainingService();
