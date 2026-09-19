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
    const unitJourney = UNIT_JOURNEYS[unitId] || UNIT_JOURNEYS['u1'];
    const pack = LANGUAGE_PACKS[languageName] || LANGUAGE_PACKS.French;

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

      // 11. THE NATIVE AUDIO STORY (Micro-Tale with English Review Toggle)
      {
        id: `${unitId}-r11-story`,
        roundNumber: 11,
        mode: 'audio_story',
        title: 'Native Audio Story & English Review',
        badgeLabel: '11/11 · AUDIO STORY',
        instruction: 'Immerse your ears in an authentic micro-tale. Listen sentence by sentence, then tap "Review in English" to inspect the story!',
        audioText: t1.term,
        langCode,
        storyData: {
          title: languageName === 'French'
            ? `Une belle rencontre à Paris`
            : languageName === 'Spanish'
            ? `Un buen día en la ciudad`
            : languageName === 'German'
            ? `Ein schöner Tag in Berlin`
            : languageName === 'Italian'
            ? `Un incontro speciale a Roma`
            : languageName === 'Chinese Mandarin'
            ? `在北京的美好一天`
            : `東京での素晴らしい一日`,
          titleEnglish: `A Wonderful Day in the City`,
          sentences: [
            {
              id: 'st-s1',
              audioText: languageName === 'French'
                ? `Bonjour ! Mon papa est ici aujourd'hui.`
                : `${t1.term}. ${t2.term}.`,
              targetText: languageName === 'French'
                ? `Bonjour ! Mon papa est ici aujourd'hui.`
                : `${t1.term}. ${t2.term}.`,
              translation: languageName === 'French'
                ? `Hello! My dad is here today.`
                : `Hello! ${t2.translation}.`
            },
            {
              id: 'st-s2',
              audioText: languageName === 'French'
                ? `Tout va très bien et il fait beau temps.`
                : `${t3.term}, ${t2.term}.`,
              targetText: languageName === 'French'
                ? `Tout va très bien et il fait beau temps.`
                : `${t3.term}, ${t2.term}.`,
              translation: languageName === 'French'
                ? `Everything is going very well and the weather is fine.`
                : `${t3.translation}, ${t2.translation}.`
            },
            {
              id: 'st-s3',
              audioText: languageName === 'French'
                ? `Nous prenons un bon pain et du vin.`
                : `${t1.term}, ${t3.term}.`,
              targetText: languageName === 'French'
                ? `Nous prenons un bon pain et du vin.`
                : `${t1.term}, ${t3.term}.`,
              translation: languageName === 'French'
                ? `We have good bread and wine.`
                : `We enjoy good moments together.`
            },
            {
              id: 'st-s4',
              audioText: languageName === 'French'
                ? `C’est magnifique ! Merci beaucoup et à bientôt.`
                : `${t3.term}! ${t4.term}!`,
              targetText: languageName === 'French'
                ? `C’est magnifique ! Merci beaucoup et à bientôt.`
                : `${t3.term}! ${t4.term}!`,
              translation: languageName === 'French'
                ? `It is magnificent! Thank you very much and see you soon.`
                : `${t3.translation}! ${t4.translation}!`
            }
          ],
          comprehensionQuestion: {
            prompt: languageName === 'French'
              ? 'How did the speaker describe the experience at the end of the story?'
              : 'What was the overall tone of the conversation?',
            options: [
              {
                id: 'sq-1',
                text: languageName === 'French' ? 'C’est magnifique ! (It is magnificent)' : 'Very positive and polite',
                translation: 'Correct narrative reflection'
              },
              {
                id: 'sq-2',
                text: languageName === 'French' ? 'Ce n’est pas bon (It is not good)' : 'Upset and complaining',
                translation: 'Incorrect'
              },
              {
                id: 'sq-3',
                text: languageName === 'French' ? 'Au revoir seulement' : 'Confusing and strange',
                translation: 'Incorrect'
              }
            ],
            correctOptionId: 'sq-1',
            explanation: 'Bravo! You followed the entire narrative arc purely by ear, verified the English translation, and answered accurately.'
          }
        }
      }
    ];

    return rounds;
  }
}

export const earTrainingService = new EarTrainingService();
