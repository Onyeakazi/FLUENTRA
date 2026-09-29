// FLUENTRA 11-Mode Ear Training & Audio Arcade Service
import { UNIT_JOURNEYS } from '../data/unitJourneys';
import { LANGUAGE_PACKS } from '../data/curriculumContent';
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
  storyData?: {
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
  };
}

class EarTrainingService {
  public getRoundsForUnit(unitId: string, languageName = 'French'): EarGameRound[] {
    const langOpt = getLanguageOption(languageName);
    const langCode = langOpt.code || 'fr-FR';
    const canonicalName = langOpt.name;
    const unitJourney = UNIT_JOURNEYS[unitId] || UNIT_JOURNEYS['u1'];
    const pack = LANGUAGE_PACKS[canonicalName] || LANGUAGE_PACKS.French;

    const targets = unitJourney?.learningTargets || [];
    const t1 = targets[0] || { term: pack.greetingFormal.target, translation: pack.greetingFormal.trans, audioText: pack.greetingFormal.target };
    const t2 = targets[1] || { term: pack.howAreYou.target, translation: pack.howAreYou.trans, audioText: pack.howAreYou.target };
    const t3 = targets[2] || { term: pack.thankYou.target, translation: pack.thankYou.trans, audioText: pack.thankYou.target };
    const t4 = targets[3] || { term: pack.goodbye.target, translation: pack.goodbye.trans, audioText: pack.goodbye.target };

    const rounds: EarGameRound[] = [
      // 1. BLIND EAR (Pure Acoustic Comprehension)
      {
        id: `${unitId}-r1-blind`,
        roundNumber: 1,
        mode: 'blind_ear',
        title: 'Blind Ear Recognition',
        badgeLabel: '1/11 · BLIND EAR',
        instruction: 'Zero text upfront! Listen closely and identify the English meaning purely by ear:',
        audioText: t1.audioText || t1.term,
        langCode,
        targetText: t1.term,
        translation: t1.translation,
        phoneticHint: t1.phonetic,
        options: [
          { id: 'b-opt1', text: t1.translation, translation: 'Correct meaning' },
          { id: 'b-opt2', text: t2.translation, translation: 'Different phrase' },
          { id: 'b-opt3', text: t3.translation, translation: 'Different phrase' }
        ],
        correctOptionId: 'b-opt1',
        explanation: `“${t1.term}” translates directly to “${t1.translation}”. Your ear correctly decoded the acoustic pattern!`
      },

      // 2. AUDIO CLOZE (Spoken Gap-Fill)
      {
        id: `${unitId}-r2-cloze`,
        roundNumber: 2,
        mode: 'audio_cloze',
        title: 'Spoken Gap-Fill',
        badgeLabel: '2/11 · AUDIO CLOZE',
        instruction: 'Listen to the full spoken sentence. Which spoken word filled the audio gap?',
        audioText: t2.exampleUsage || `${t2.term} ${t3.term}`,
        langCode,
        sentenceWithBlank: t2.exampleUsage ? t2.exampleUsage.replace(t2.term, '[🔔]') : `[🔔] ${t3.term}`,
        translation: t2.exampleTranslation || `${t2.translation} ${t3.translation}`,
        options: [
          { id: 'c-opt1', text: t2.term, translation: t2.translation, audioText: t2.term },
          { id: 'c-opt2', text: t1.term, translation: t1.translation, audioText: t1.term },
          { id: 'c-opt3', text: t4.term, translation: t4.translation, audioText: t4.term }
        ],
        correctOptionId: 'c-opt1',
        explanation: `The missing spoken word was “${t2.term}” (${t2.translation}).`
      },

      // 3. ECHO MIMIC (Instant Shadowing & Voice Mimicry)
      {
        id: `${unitId}-r3-echo`,
        roundNumber: 3,
        mode: 'echo_mimic',
        title: 'Voice Shadowing Sprint',
        badgeLabel: '3/11 · ECHO MIMIC',
        instruction: 'Listen to native tempo and rhythm. When the countdown hits 0, speak into your mic to mimic the pitch:',
        audioText: t2.term,
        langCode,
        targetText: t2.term,
        translation: t2.translation,
        phoneticHint: t2.phonetic || '/mɛʁ.si/',
        explanation: 'Excellent acoustic resonance! Your vowels matched native cadence.'
      },

      // 4. SOUND BLITZ (Speed Audio-to-Meaning Sprint)
      {
        id: `${unitId}-r4-blitz`,
        roundNumber: 4,
        mode: 'sound_blitz',
        title: 'Sound Blitz Sprint',
        badgeLabel: '4/11 · SOUND BLITZ',
        instruction: 'Timed Blitz: Tap each card to hear its native sound, then pair with its meaning before time runs out!',
        audioText: t1.term,
        langCode,
        blitzPairs: [
          { id: 'bp-1', audioText: t1.audioText || t1.term, term: t1.term, translation: t1.translation },
          { id: 'bp-2', audioText: t2.audioText || t2.term, term: t2.term, translation: t2.translation },
          { id: 'bp-3', audioText: t3.audioText || t3.term, term: t3.term, translation: t3.translation },
          { id: 'bp-4', audioText: t4.audioText || t4.term, term: t4.term, translation: t4.translation }
        ]
      },

      // 5. MINIMAL PAIR DUEL (Acoustic Discrimination)
      {
        id: `${unitId}-r5-pair`,
        roundNumber: 5,
        mode: 'minimal_pair_duel',
        title: 'Minimal Pair Acoustic Duel',
        badgeLabel: '5/11 · ACOUSTIC DUEL',
        instruction: 'Listen carefully to the subtle vowel shaping: Which acoustic sound was produced?',
        audioText: t1.audioText || t1.term,
        langCode,
        targetText: t1.term,
        translation: t1.translation,
        options: [
          { id: 'mp-1', text: `${t1.term} (${t1.phonetic || 'Shape A'})`, audioText: t1.term, translation: t1.translation },
          { id: 'mp-2', text: `${t2.term} (${t2.phonetic || 'Shape B'})`, audioText: t2.term, translation: t2.translation }
        ],
        correctOptionId: 'mp-1',
        explanation: `Your ear detected “${t1.term}”! Recognizing subtle vowel positions prevents confusion.`
      },

      // 6. AUDIO TILE BUILDER (Reverse Dictation)
      {
        id: `${unitId}-r6-dictation`,
        roundNumber: 6,
        mode: 'audio_tile_builder',
        title: 'Reverse Audio Dictation',
        badgeLabel: '6/11 · TILE BUILDER',
        instruction: 'Listen to the full phrase with no written prompt. Tap the word chips in exact spoken order:',
        audioText: `${t1.term} ${t3.term}`,
        langCode,
        targetText: `${t1.term} ${t3.term}`,
        translation: `${t1.translation}, ${t3.translation}`,
        tileChips: [t3.term, t1.term, t4.term],
        correctWordOrder: [t1.term, t3.term],
        explanation: `Sentence accurately reconstructed: “${t1.term} ${t3.term}”.`
      },

      // 7. SPEED WARP (Normal vs Fast Native Cadence)
      {
        id: `${unitId}-r7-warp`,
        roundNumber: 7,
        mode: 'speed_warp',
        title: 'Speed Warp: 1.0x vs 1.25x Street Speed',
        badgeLabel: '7/11 · SPEED WARP',
        instruction: 'Compare normal 1.0x cadence against fast conversational 1.25x speed. What was said?',
        audioText: t3.exampleUsage || `${t1.term} ${t3.term}`,
        langCode,
        targetText: t3.exampleUsage || `${t1.term} ${t3.term}`,
        translation: t3.exampleTranslation || `${t1.translation}, ${t3.translation}`,
        options: [
          { id: 'sw-1', text: t3.exampleUsage || `${t1.term} ${t3.term}`, translation: t3.exampleTranslation || 'Authentic sentence' },
          { id: 'sw-2', text: `${t4.term} ${t2.term}`, translation: 'Distractor' },
          { id: 'sw-3', text: `${t2.term} ${t1.term}`, translation: 'Distractor' }
        ],
        correctOptionId: 'sw-1',
        explanation: 'At 1.25x speed, native speakers link words through liaisons and smooth vowel transitions.'
      },

      // 8. AUDIO TRUE / FALSE (Rapid Reality Check)
      {
        id: `${unitId}-r8-tf`,
        roundNumber: 8,
        mode: 'audio_true_false',
        title: 'Rapid Auditory Reality Check',
        badgeLabel: '8/11 · TRUE OR FALSE',
        instruction: 'Listen to the native statement. Does it match the concept card?',
        audioText: t1.term,
        langCode,
        conceptStatement: `The speaker is saying: “${t1.translation}”`,
        isTrueStatement: true,
        explanation: `Correct! “${t1.term}” means “${t1.translation}”.`
      },

      // 9. AUDIO DIALOGUE REPLY (Sound-to-Context Reaction)
      {
        id: `${unitId}-r9-dialogue`,
        roundNumber: 9,
        mode: 'audio_dialogue_reply',
        title: 'Spoken Dialogue Reaction',
        badgeLabel: '9/11 · SPOKEN DIALOGUE',
        instruction: 'You hear a native speaker say this. Listen to the 3 audio choices and pick the natural reply:',
        audioText: pack.howAreYou.target,
        langCode,
        targetText: pack.howAreYou.target,
        translation: pack.howAreYou.trans,
        options: [
          { id: 'dr-1', text: pack.fineThanks.target, translation: pack.fineThanks.trans, audioText: pack.fineThanks.target },
          { id: 'dr-2', text: pack.goodbye.target, translation: pack.goodbye.trans, audioText: pack.goodbye.target },
          { id: 'dr-3', text: pack.greetingFormal.target, translation: pack.greetingFormal.trans, audioText: pack.greetingFormal.target }
        ],
        correctOptionId: 'dr-1',
        explanation: `When someone asks “${pack.howAreYou.target}”, the natural reply is “${pack.fineThanks.target}”.`
      },

      // 10. BOSS SHADOWING TEST (Vocal Cadence Mastery)
      {
        id: `${unitId}-r10-boss`,
        roundNumber: 10,
        mode: 'boss_shadowing',
        title: 'The Boss Shadowing Test',
        badgeLabel: '10/11 · BOSS SHADOWING',
        instruction: 'The Ultimate Acoustic Challenge: Listen and shadow these 3 connected phrases back-to-back with 80%+ accuracy!',
        audioText: t1.term,
        langCode,
        bossPhrases: [
          { id: 'bp-a', audioText: t1.term, targetText: t1.term, translation: t1.translation },
          { id: 'bp-b', audioText: t2.term, targetText: t2.term, translation: t2.translation },
          { id: 'bp-c', audioText: t3.term, targetText: t3.term, translation: t3.translation }
        ],
        explanation: 'Unit Acoustic Mastery Unlocked! You repeated all 3 phrases with native cadence and clarity.'
      },

      // 11. THE NATIVE AUDIO STORY & COMPREHENSION
      (() => {
        const story = getStoryForLanguage(canonicalName);
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

interface StoryDataPayload {
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

function getStoryForLanguage(languageName: string): StoryDataPayload {
  switch (languageName) {
    case 'Chinese Mandarin':
      return {
        title: '在北京的美好一天',
        titleEnglish: 'A Wonderful Day in Beijing',
        fullStoryText: '你好！今天北京的天气非常好。我和朋友在茶馆喝茶，吃美味的点心。我们聊得很开心。这是非常美好的一天，谢谢大家！',
        fullStoryTranslation: 'Hello! Today the weather in Beijing is very good. My friend and I are drinking tea at a teahouse and eating delicious snacks. We chatted very happily. This is a wonderful day, thank you everyone!',
        sentences: [
          { id: 'st-s1', audioText: '你好！今天北京的天气非常好。', targetText: '你好！今天北京的天气非常好。', translation: 'Hello! Today the weather in Beijing is very good.' },
          { id: 'st-s2', audioText: '我和朋友在茶馆喝茶，吃美味的点心。', targetText: '我和朋友在茶馆喝茶，吃美味的点心。', translation: 'My friend and I are drinking tea at a teahouse and eating delicious snacks.' },
          { id: 'st-s3', audioText: '我们聊得很开心。', targetText: '我们聊得很开心。', translation: 'We chatted very happily.' },
          { id: 'st-s4', audioText: '这是非常美好的一天，谢谢大家！', targetText: '这是非常美好的一天，谢谢大家！', translation: 'This is a wonderful day, thank you everyone!' }
        ],
        comprehensionQuestion: {
          prompt: '根据短文，他们在一起做了什么？ (Based on the short story, what did they do together?)',
          options: [
            { id: 'sq-1', text: '喝茶、吃美味的点心并愉快地聊天 (Drank tea, ate snacks and chatted happily)', translation: 'Correct objective' },
            { id: 'sq-2', text: '在火车站焦急地等车 (Waited anxiously at the train station)', translation: 'Incorrect' },
            { id: 'sq-3', text: '去医院看医生 (Went to the hospital to see a doctor)', translation: 'Incorrect' }
          ],
          correctOptionId: 'sq-1',
          explanation: '太棒了！ The story clearly describes drinking tea in a teahouse, enjoying dim sum, and chatting happily with a friend.'
        }
      };

    case 'Spanish':
      return {
        title: 'Un hermoso día en la ciudad',
        titleEnglish: 'A Beautiful Day in the City',
        fullStoryText: '¡Hola! Hoy hace un día maravilloso aquí. Mi papá está conmigo y todo va muy bien. Tomamos un buen café y disfrutamos del sol. ¡Es fantástico! Muchas gracias y hasta pronto.',
        fullStoryTranslation: 'Hello! Today is a wonderful day here. My dad is with me and everything is going very well. We have a good coffee and enjoy the sunshine. It is fantastic! Thank you very much and see you soon.',
        sentences: [
          { id: 'st-s1', audioText: '¡Hola! Hoy hace un día maravilloso aquí.', targetText: '¡Hola! Hoy hace un día maravilloso aquí.', translation: 'Hello! Today is a wonderful day here.' },
          { id: 'st-s2', audioText: 'Mi papá está conmigo y todo va muy bien.', targetText: 'Mi papá está conmigo y todo va muy bien.', translation: 'My dad is with me and everything is going very well.' },
          { id: 'st-s3', audioText: 'Tomamos un buen café y disfrutamos del sol.', targetText: 'Tomamos un buen café y disfrutamos del sol.', translation: 'We have a good coffee and enjoy the sunshine.' },
          { id: 'st-s4', audioText: '¡Es fantástico! Muchas gracias y hasta pronto.', targetText: '¡Es fantástico! Muchas gracias y hasta pronto.', translation: 'It is fantastic! Thank you very much and see you soon.' }
        ],
        comprehensionQuestion: {
          prompt: '¿Cómo describe el narrador la experiencia en la historia?',
          options: [
            { id: 'sq-1', text: '¡Es fantástico y todo va muy bien! (It is fantastic and everything is great!)', translation: 'Correct objective' },
            { id: 'sq-2', text: 'Fue un día triste y lluvioso (It was a sad and rainy day)', translation: 'Incorrect' },
            { id: 'sq-3', text: 'El café no le gustó nada (He did not like the coffee at all)', translation: 'Incorrect' }
          ],
          correctOptionId: 'sq-1',
          explanation: '¡Excelente! The narrator happily exclaims "¡Es fantástico!" and notes that everything is going very well.'
        }
      };

    case 'German':
      return {
        title: 'Ein schöner Tag in Berlin',
        titleEnglish: 'A Beautiful Day in Berlin',
        fullStoryText: 'Hallo! Heute ist ein wunderbarer Tag hier in Berlin. Alles geht sehr gut und das Wetter ist herrlich. Wir trinken einen guten Kaffee und essen frisches Brot. Es ist fantastisch! Vielen Dank und bis bald.',
        fullStoryTranslation: 'Hello! Today is a wonderful day here in Berlin. Everything is going very well and the weather is lovely. We drink a good coffee and eat fresh bread. It is fantastic! Thank you very much and see you soon.',
        sentences: [
          { id: 'st-s1', audioText: 'Hallo! Heute ist ein wunderbarer Tag hier in Berlin.', targetText: 'Hallo! Heute ist ein wunderbarer Tag hier in Berlin.', translation: 'Hello! Today is a wonderful day here in Berlin.' },
          { id: 'st-s2', audioText: 'Alles geht sehr gut und das Wetter ist herrlich.', targetText: 'Alles geht sehr gut und das Wetter ist herrlich.', translation: 'Everything is going very well and the weather is lovely.' },
          { id: 'st-s3', audioText: 'Wir trinken einen guten Kaffee und essen frisches Brot.', targetText: 'Wir trinken einen guten Kaffee und essen frisches Brot.', translation: 'We drink a good coffee and eat fresh bread.' },
          { id: 'st-s4', audioText: 'Es ist fantastisch! Vielen Dank und bis bald.', targetText: 'Es ist fantastisch! Vielen Dank und bis bald.', translation: 'It is fantastic! Thank you very much and see you soon.' }
        ],
        comprehensionQuestion: {
          prompt: 'Wie beschreibt der Sprecher die Erfahrung in der Geschichte?',
          options: [
            { id: 'sq-1', text: 'Es ist fantastisch und alles geht sehr gut (It is fantastic and all goes well)', translation: 'Correct objective' },
            { id: 'sq-2', text: 'Das Wetter war sehr schlecht und kalt (The weather was very bad and cold)', translation: 'Incorrect' },
            { id: 'sq-3', text: 'Er war den ganzen Tag allein zu Hause (He was alone at home all day)', translation: 'Incorrect' }
          ],
          correctOptionId: 'sq-1',
          explanation: 'Ausgezeichnet! The speaker summarizes the day as fantastic ("Es ist fantastisch!") with great coffee and weather.'
        }
      };

    case 'Italian':
      return {
        title: 'Una bella giornata a Roma',
        titleEnglish: 'A Beautiful Day in Rome',
        fullStoryText: 'Ciao! Oggi è una giornata bellissima qui a Roma. Tutto va molto bene e c’è un sole splendido. Prendiamo un buon caffè insieme e del pane fresco. È magnifico! Grazie mille e a presto.',
        fullStoryTranslation: 'Hello! Today is a beautiful day here in Rome. Everything is going very well and there is splendid sunshine. We have a good coffee together and fresh bread. It is magnificent! Thank you very much and see you soon.',
        sentences: [
          { id: 'st-s1', audioText: 'Ciao! Oggi è una giornata bellissima qui a Roma.', targetText: 'Ciao! Oggi è una giornata bellissima qui a Roma.', translation: 'Hello! Today is a beautiful day here in Rome.' },
          { id: 'st-s2', audioText: 'Tutto va molto bene e c’è un sole splendido.', targetText: 'Tutto va molto bene e c’è un sole splendido.', translation: 'Everything is going very well and there is splendid sunshine.' },
          { id: 'st-s3', audioText: 'Prendiamo un buon caffè insieme e del pane fresco.', targetText: 'Prendiamo un buon caffè insieme e del pane fresco.', translation: 'We have a good coffee together and fresh bread.' },
          { id: 'st-s4', audioText: 'È magnifico! Grazie mille e a presto.', targetText: 'È magnifico! Grazie mille e a presto.', translation: 'It is magnificent! Thank you very much and see you soon.' }
        ],
        comprehensionQuestion: {
          prompt: 'Come descrive il narratore la sua giornata a Roma?',
          options: [
            { id: 'sq-1', text: 'È magnifico e c’è una giornata bellissima (It is magnificent and a beautiful day)', translation: 'Correct objective' },
            { id: 'sq-2', text: 'È stata una giornata triste e noiosa (It was a sad and boring day)', translation: 'Incorrect' },
            { id: 'sq-3', text: 'Non ha voluto prendere il caffè (Did not want to have coffee)', translation: 'Incorrect' }
          ],
          correctOptionId: 'sq-1',
          explanation: 'Bravissimo! The narrator exclaims "È magnifico!", describing a wonderful sunny day having coffee in Rome.'
        }
      };

    case 'Japanese':
      return {
        title: '東京での素晴らしい一日',
        titleEnglish: 'A Wonderful Day in Tokyo',
        fullStoryText: 'こんにちは！今日は東京でとても良い天気です。友達と一緒に美味しいお茶を飲んで、楽しく話しました。本当に素晴らしい一日でした。ありがとうございます！',
        fullStoryTranslation: 'Hello! Today the weather is very nice in Tokyo. I drank delicious tea with a friend and talked happily. It was truly a wonderful day. Thank you very much!',
        sentences: [
          { id: 'st-s1', audioText: 'こんにちは！今日は東京でとても良い天気です。', targetText: 'こんにちは！今日は東京でとても良い天気です。', translation: 'Hello! Today the weather is very nice in Tokyo.' },
          { id: 'st-s2', audioText: '友達と一緒に美味しいお茶を飲んで、楽しく話しました。', targetText: '友達と一緒に美味しいお茶を飲んで、楽しく話しました。', translation: 'I drank delicious tea with a friend and talked happily.' },
          { id: 'st-s3', audioText: '本当に素晴らしい一日でした。', targetText: '本当に素晴らしい一日でした。', translation: 'It was truly a wonderful day.' },
          { id: 'st-s4', audioText: 'ありがとうございます！', targetText: 'ありがとうございます！', translation: 'Thank you very much!' }
        ],
        comprehensionQuestion: {
          prompt: '短文によると、話し手は東京でどのように過ごしましたか？',
          options: [
            { id: 'sq-1', text: '友達とお茶を飲んで楽しく話した (Drank tea with a friend and talked happily)', translation: 'Correct objective' },
            { id: 'sq-2', text: '一日中仕事でとても疲れた (Worked all day and was very tired)', translation: 'Incorrect' },
            { id: 'sq-3', text: '雨に濡れて帰ってしまった (Got wet in the rain and went home)', translation: 'Incorrect' }
          ],
          correctOptionId: 'sq-1',
          explanation: '素晴らしい！ The story describes drinking delicious tea with a friend, chatting happily, and having a wonderful day.'
        }
      };

    case 'French':
    default:
      return {
        title: 'Une belle journée à Paris',
        titleEnglish: 'A Beautiful Day in Paris',
        fullStoryText: 'Bonjour ! Mon papa est ici aujourd’hui. Tout va très bien et il fait beau temps à Paris. Nous prenons un bon café et du pain frais. C’est magnifique ! Merci beaucoup et à bientôt.',
        fullStoryTranslation: 'Hello! My dad is here today. Everything is going very well and the weather is beautiful in Paris. We have a good coffee and fresh bread. It is magnificent! Thank you very much and see you soon.',
        sentences: [
          { id: 'st-s1', audioText: 'Bonjour ! Mon papa est ici aujourd’hui.', targetText: 'Bonjour ! Mon papa est ici aujourd’hui.', translation: 'Hello! My dad is here today.' },
          { id: 'st-s2', audioText: 'Tout va très bien et il fait beau temps à Paris.', targetText: 'Tout va très bien et il fait beau temps à Paris.', translation: 'Everything is going very well and the weather is beautiful in Paris.' },
          { id: 'st-s3', audioText: 'Nous prenons un bon café et du pain frais.', targetText: 'Nous prenons un bon café et du pain frais.', translation: 'We have a good coffee and fresh bread.' },
          { id: 'st-s4', audioText: 'C’est magnifique ! Merci beaucoup et à bientôt.', targetText: 'C’est magnifique ! Merci beaucoup et à bientôt.', translation: 'It is magnificent! Thank you very much and see you soon.' }
        ],
        comprehensionQuestion: {
          prompt: 'How did the speaker describe the experience in the story?',
          options: [
            { id: 'sq-1', text: 'C’est magnifique ! (It is magnificent)', translation: 'Correct objective' },
            { id: 'sq-2', text: 'Ce n’est pas bon (It is not good)', translation: 'Incorrect' },
            { id: 'sq-3', text: 'Il fait très froid et pluvieux (It is very cold and rainy)', translation: 'Incorrect' }
          ],
          correctOptionId: 'sq-1',
          explanation: 'Bravo! The speaker concluded by saying "C’est magnifique !", indicating a wonderful experience in Paris.'
        }
      };
  }
}

export const earTrainingService = new EarTrainingService();
