// FLUENTRA 10-Step Pedagogical Unit Journey Registry
// Implements Level -> Sub-Level -> Unit -> Learning Targets -> 10 Learning Steps -> Exercises -> Assessment
import {
  Lesson,
  Exercise,
  LearningTarget,
  LearningStepType,
  UnitPedagogyType
} from '../types/curriculum';

export interface UnitLearningJourney {
  unitId: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  pedagogyType: UnitPedagogyType;
  practicalOutcome: string;
  learningTargets: LearningTarget[];
  exercises: Exercise[];
}

export const UNIT_JOURNEYS: Record<string, UnitLearningJourney> = {
  // -------------------------------------------------------------
  // UNIT 1: PRONUNCIATION UNIT — Vowel Sounds & Breath
  // -------------------------------------------------------------
  u1: {
    unitId: 'u1',
    unitNumber: 1,
    title: 'Vowel Sounds & Breath',
    subtitle: 'Acoustic Precision: [a], [i], [u], [ou]',
    pedagogyType: 'pronunciation',
    practicalOutcome: 'Master accurate French vowel articulation, mouth shaping, and acoustic distinction between open [a], smiling [i], pursed [u], and deep [ou].',
    learningTargets: [
      {
        id: 't-u1-1',
        term: 'papa',
        translation: 'dad',
        phonetic: '/pa.pa/',
        context: 'Open throat and relaxed jaw. Clear, un-diphthongized French [a].',
        exampleUsage: 'Mon papa est là.',
        exampleTranslation: 'My dad is here.'
      },
      {
        id: 't-u1-2',
        term: 'ici',
        translation: 'here',
        phonetic: '/i.si/',
        context: 'Spread lips horizontally with smiling tension. High front [i].',
        exampleUsage: 'Viens ici !',
        exampleTranslation: 'Come here!'
      },
      {
        id: 't-u1-3',
        term: 'tu',
        translation: 'you (informal)',
        phonetic: '/ty/',
        context: 'Say "ee" with your tongue, but round your lips tightly like "oo". Unique French [y].',
        exampleUsage: 'Tu es prêt ?',
        exampleTranslation: 'Are you ready?'
      },
      {
        id: 't-u1-4',
        term: 'tout',
        translation: 'all / everything',
        phonetic: '/tu/',
        context: 'Lips rounded forward. Back rounded [u] sound, like "soup".',
        exampleUsage: 'Tout va bien.',
        exampleTranslation: 'Everything is going well.'
      },
      {
        id: 't-u1-5',
        term: 'bon',
        translation: 'good',
        phonetic: '/bɔ̃/',
        context: 'Nasal vowel: air flows through both mouth and nose with rounded lips.',
        exampleUsage: 'C’est très bon.',
        exampleTranslation: 'It is very good.'
      }
    ],
    exercises: [
      // STEP 1: DISCOVER
      {
        id: 'u1-s1-discover',
        type: 'target_discovery',
        stepType: 'discover',
        prompt: 'Discover the 5 core French vowel shapes and sounds for this unit:',
        xpReward: 5
      },
      // STEP 2: LISTEN
      {
        id: 'u1-s2-listen',
        type: 'listening',
        stepType: 'listen',
        prompt: 'Listen carefully: Which word contains the high, smiling French [i] sound?',
        audioText: 'ici',
        targetText: 'ici',
        translation: 'here (/i.si/)',
        explanation: '“ici” (/i.si/) uses the smiling, high front [i] sound with firm lip tension.',
        options: [
          { id: 'opt-a', text: 'ici', translation: 'here (/i.si/)' },
          { id: 'opt-b', text: 'papa', translation: 'dad (/pa.pa/)' },
          { id: 'opt-c', text: 'tout', translation: 'all (/tu/)' }
        ],
        correctOptionId: 'opt-a',
        xpReward: 5
      },
      // STEP 3: UNDERSTAND
      {
        id: 'u1-s3-understand',
        type: 'multiple_choice',
        stepType: 'understand',
        prompt: 'How do you correctly shape your mouth for the French sound in “tu” (/ty/)?',
        targetText: 'tu',
        audioText: 'tu',
        explanation: 'To produce French [y] in “tu”, place your tongue as if saying "ee", but round your lips tightly forward.',
        options: [
          { id: 'u1-3a', text: 'Tongue says "ee", lips rounded tightly forward', translation: 'Authentic French [y]' },
          { id: 'u1-3b', text: 'Tongue at the back with relaxed open mouth', translation: 'Incorrect shape' },
          { id: 'u1-3c', text: 'Teeth completely closed with biting sound', translation: 'Incorrect shape' }
        ],
        correctOptionId: 'u1-3a',
        xpReward: 5
      },
      // STEP 4: PRACTICE
      {
        id: 'u1-s4-practice',
        type: 'match_pairs',
        stepType: 'practice',
        prompt: 'Match each target vowel word with its correct English meaning:',
        matchPairs: [
          { id: 'p1', left: 'papa', right: 'dad' },
          { id: 'p2', left: 'ici', right: 'here' },
          { id: 'p3', left: 'tu', right: 'you' },
          { id: 'p4', left: 'tout', right: 'all / everything' }
        ],
        xpReward: 10
      },
      // STEP 5: SPEAK
      {
        id: 'u1-s5-speak',
        type: 'speaking',
        stepType: 'speak',
        prompt: 'Pronounce the pursed French vowel word into your microphone:',
        targetText: 'tu',
        audioText: 'tu',
        phoneticHint: '/ty/ — round your lips forward',
        translation: 'you (informal)',
        explanation: 'Focus on keeping your lips firmly pursed and rounded while maintaining the high vowel pitch.',
        xpReward: 10
      },
      // STEP 6: FEEDBACK
      {
        id: 'u1-s6-feedback',
        type: 'multiple_choice',
        stepType: 'feedback',
        prompt: 'Acoustic Check: What is the difference between “tu” (/ty/) and “tout” (/tu/)?',
        audioText: 'tu tout',
        explanation: '“tu” (/ty/) is high-front rounded, whereas “tout” (/tu/) is back-rounded like "soup". Confusing them changes the meaning from "you" to "all"!',
        options: [
          { id: 'fb-a', text: '“tu” is front-rounded (/ty/), “tout” is back-rounded (/tu/)', translation: 'Critical phonetic distinction' },
          { id: 'fb-b', text: 'They are pronounced identically in French', translation: 'Incorrect' },
          { id: 'fb-c', text: '“tout” is pronounced with a silent vowel', translation: 'Incorrect' }
        ],
        correctOptionId: 'fb-a',
        xpReward: 5
      },
      // STEP 7: REPEAT
      {
        id: 'u1-s7-repeat',
        type: 'listening',
        stepType: 'repeat',
        prompt: 'Targeted Repeat Drill: Listen and choose the word you hear:',
        audioText: 'tout',
        targetText: 'tout',
        explanation: 'You heard “tout” (/tu/) with the deeper back-rounded vowel.',
        options: [
          { id: 'rep-a', text: 'tout', translation: 'all (/tu/)' },
          { id: 'rep-b', text: 'tu', translation: 'you (/ty/)' },
          { id: 'rep-c', text: 'ici', translation: 'here (/i.si/)' }
        ],
        correctOptionId: 'rep-a',
        xpReward: 5
      },
      // STEP 8: USE
      {
        id: 'u1-s8-use',
        type: 'sentence_order',
        stepType: 'use',
        prompt: 'Build the practical phrase: “Everything is good”',
        targetText: 'Tout est bon',
        correctOrder: ['Tout', 'est', 'bon'],
        options: [
          { id: 'w1', text: 'Tout' },
          { id: 'w2', text: 'est' },
          { id: 'w3', text: 'bon' },
          { id: 'w4', text: 'ici' }
        ],
        translation: 'Everything is good',
        explanation: 'Combines the [u] in “Tout” and the nasal vowel in “bon” into an everyday French expression.',
        xpReward: 10
      },
      // STEP 9: CHALLENGE
      {
        id: 'u1-s9-challenge',
        type: 'multiple_choice',
        stepType: 'challenge',
        prompt: 'Phonetic Transfer Challenge: Which new French word contains the exact same [y] sound as “tu”?',
        targetText: 'rue',
        audioText: 'rue',
        explanation: '“rue” (/ʁy/, street) shares the exact same pursed vowel sound [y] as “tu”.',
        options: [
          { id: 'ch-a', text: 'rue (street)', translation: '/ʁy/ — same [y] vowel' },
          { id: 'ch-b', text: 'rouge (red)', translation: '/ʁuʒ/ — deep [u] sound' },
          { id: 'ch-c', text: 'rare (rare)', translation: '/ʁaʁ/ — open [a] sound' }
        ],
        correctOptionId: 'ch-a',
        xpReward: 10
      },
      // STEP 10: MASTER
      {
        id: 'u1-s10-master',
        type: 'speaking',
        stepType: 'master',
        prompt: 'Final Mastery Assessment: Speak this complete vowel-rich phrase clearly:',
        targetText: 'Tout est ici',
        audioText: 'Tout est ici',
        phoneticHint: '/tu.t‿ɛ.t‿i.si/',
        translation: 'Everything is here',
        explanation: 'Combines deep rounded [u], open [ɛ], and front smiling [i] in a single fluid cadence.',
        xpReward: 15
      }
    ]
  },

  // -------------------------------------------------------------
  // UNIT 2: VOCABULARY UNIT — Nasal Vowels & Survival Words
  // -------------------------------------------------------------
  u2: {
    unitId: 'u2',
    unitNumber: 2,
    title: 'Nasal Vowels & Survival Words',
    subtitle: 'Essential Everyday Vocabulary: un, bon, pain, vin, temps',
    pedagogyType: 'vocabulary',
    practicalOutcome: 'Instantly recognize, understand, and use foundational French survival words featuring distinct nasal vowel sounds.',
    learningTargets: [
      {
        id: 't-u2-1',
        term: 'un',
        translation: 'one / a (masculine)',
        phonetic: '/œ̃/',
        context: 'Essential counting word and masculine indefinite article.',
        exampleUsage: 'Un café, s’il vous plaît.',
        exampleTranslation: 'A coffee, please.'
      },
      {
        id: 't-u2-2',
        term: 'bon',
        translation: 'good',
        phonetic: '/bɔ̃/',
        context: 'Universal adjective for quality, food, and well-wishes.',
        exampleUsage: 'C’est un bon café.',
        exampleTranslation: 'It is a good coffee.'
      },
      {
        id: 't-u2-3',
        term: 'pain',
        translation: 'bread',
        phonetic: '/pɛ̃/',
        context: 'Iconic staple of French dining and daily bakeries (boulangerie).',
        exampleUsage: 'Du pain frais.',
        exampleTranslation: 'Fresh bread.'
      },
      {
        id: 't-u2-4',
        term: 'vin',
        translation: 'wine',
        phonetic: '/vɛ̃/',
        context: 'Cultural beverage staple across French gastronomy.',
        exampleUsage: 'Un verre de vin rouge.',
        exampleTranslation: 'A glass of red wine.'
      },
      {
        id: 't-u2-5',
        term: 'temps',
        translation: 'time / weather',
        phonetic: '/tɑ̃/',
        context: 'Double meaning: refers to chronological time or outside weather.',
        exampleUsage: 'Quel beau temps !',
        exampleTranslation: 'What beautiful weather!'
      }
    ],
    exercises: [
      // STEP 1: DISCOVER
      {
        id: 'u2-s1-discover',
        type: 'target_discovery',
        stepType: 'discover',
        prompt: 'Discover the 5 key survival words featuring distinct French nasal sounds:',
        xpReward: 5
      },
      // STEP 2: LISTEN
      {
        id: 'u2-s2-listen',
        type: 'listening',
        stepType: 'listen',
        prompt: 'Listen to the native pronunciation: Which item is being requested?',
        audioText: 'pain',
        targetText: 'pain',
        translation: 'bread (/pɛ̃/)',
        explanation: '“pain” (/pɛ̃/) features the open front nasal sound [ɛ̃].',
        options: [
          { id: 'u2-2a', text: 'pain', translation: 'bread' },
          { id: 'u2-2b', text: 'vin', translation: 'wine' },
          { id: 'u2-2c', text: 'temps', translation: 'time / weather' }
        ],
        correctOptionId: 'u2-2a',
        xpReward: 5
      },
      // STEP 3: UNDERSTAND
      {
        id: 'u2-s3-understand',
        type: 'multiple_choice',
        stepType: 'understand',
        prompt: 'Which word has the dual meaning of both "time" and "weather" in French?',
        targetText: 'temps',
        audioText: 'temps',
        explanation: 'In French, “temps” (/tɑ̃/) means both the time on a clock/duration and the meteorological weather!',
        options: [
          { id: 'u2-3a', text: 'temps', translation: 'time / weather' },
          { id: 'u2-3b', text: 'bon', translation: 'good' },
          { id: 'u2-3c', text: 'un', translation: 'one / a' }
        ],
        correctOptionId: 'u2-3a',
        xpReward: 5
      },
      // STEP 4: PRACTICE
      {
        id: 'u2-s4-practice',
        type: 'match_pairs',
        stepType: 'practice',
        prompt: 'Connect each French survival word to its English counterpart:',
        matchPairs: [
          { id: 'u2-p1', left: 'pain', right: 'bread' },
          { id: 'u2-p2', left: 'vin', right: 'wine' },
          { id: 'u2-p3', left: 'bon', right: 'good' },
          { id: 'u2-p4', left: 'temps', right: 'time / weather' }
        ],
        xpReward: 10
      },
      // STEP 5: SPEAK
      {
        id: 'u2-s5-speak',
        type: 'speaking',
        stepType: 'speak',
        prompt: 'Speak this essential bakery order into your microphone:',
        targetText: 'Un bon pain',
        audioText: 'Un bon pain',
        phoneticHint: '/œ̃ bɔ̃ pɛ̃/',
        translation: 'A good bread',
        explanation: 'Flow smoothly across three distinct nasal vowels: [œ̃] -> [ɔ̃] -> [ɛ̃].',
        xpReward: 10
      },
      // STEP 6: FEEDBACK
      {
        id: 'u2-s6-feedback',
        type: 'multiple_choice',
        stepType: 'feedback',
        prompt: 'Nasal Contrast: Do “pain” (/pɛ̃/) and “vin” (/vɛ̃/) share the same vowel sound?',
        audioText: 'pain vin',
        explanation: 'Yes! Both “pain” and “vin” share the exact same [ɛ̃] nasal vowel sound.',
        options: [
          { id: 'u2-6a', text: 'Yes, both rhyme with the [ɛ̃] nasal vowel', translation: 'Correct phonetic match' },
          { id: 'u2-6b', text: 'No, “vin” is oral and “pain” is nasal', translation: 'Incorrect' },
          { id: 'u2-6c', text: 'No, “pain” is pronounced like English "pain"', translation: 'Incorrect' }
        ],
        correctOptionId: 'u2-6a',
        xpReward: 5
      },
      // STEP 7: REPEAT
      {
        id: 'u2-s7-repeat',
        type: 'multiple_choice',
        stepType: 'repeat',
        prompt: 'Targeted Vocabulary Review: How do you say "A good wine"?',
        targetText: 'Un bon vin',
        audioText: 'Un bon vin',
        explanation: '“Un bon vin” (/œ̃ bɔ̃ vɛ̃/) uses the masculine article “Un” and masculine adjective “bon”.',
        options: [
          { id: 'u2-7a', text: 'Un bon vin', translation: 'A good wine' },
          { id: 'u2-7b', text: 'Un pain bon', translation: 'Incorrect word order' },
          { id: 'u2-7c', text: 'Temps vin', translation: 'Nonsense phrase' }
        ],
        correctOptionId: 'u2-7a',
        xpReward: 5
      },
      // STEP 8: USE
      {
        id: 'u2-s8-use',
        type: 'sentence_order',
        stepType: 'use',
        prompt: 'Arrange the words to say: “A good bread, please”',
        targetText: 'Un bon pain, s’il vous plaît',
        correctOrder: ['Un', 'bon', 'pain'],
        options: [
          { id: 'u2-w1', text: 'Un' },
          { id: 'u2-w2', text: 'bon' },
          { id: 'u2-w3', text: 'pain' },
          { id: 'u2-w4', text: 'temps' }
        ],
        translation: 'A good bread',
        explanation: 'Practical ordering phrase for French bakeries.',
        xpReward: 10
      },
      // STEP 9: CHALLENGE
      {
        id: 'u2-s9-challenge',
        type: 'multiple_choice',
        stepType: 'challenge',
        prompt: 'Real-World Context: You are at a French café and want to compliment the beverage. What do you say?',
        audioText: 'C’est très bon',
        explanation: '“C’est très bon !” (/sɛ tʁɛ bɔ̃/) means "It is very good!", universally used to compliment meals and drinks.',
        options: [
          { id: 'u2-9a', text: 'C’est très bon !', translation: 'It is very good!' },
          { id: 'u2-9b', text: 'Quel temps ?', translation: 'What weather?' },
          { id: 'u2-9c', text: 'Un vin pain !', translation: 'Incorrect phrasing' }
        ],
        correctOptionId: 'u2-9a',
        xpReward: 10
      },
      // STEP 10: MASTER
      {
        id: 'u2-s10-master',
        type: 'speaking',
        stepType: 'master',
        prompt: 'Final Mastery Check: Speak this practical French sentence with confidence:',
        targetText: 'Un bon vin et du pain',
        audioText: 'Un bon vin et du pain',
        phoneticHint: '/œ̃ bɔ̃ vɛ̃ e dy pɛ̃/',
        translation: 'A good wine and bread',
        explanation: 'Masterful production of all five vocabulary targets in a single fluent phrase.',
        xpReward: 15
      }
    ]
  },

  // -------------------------------------------------------------
  // UNIT 3: GRAMMAR UNIT — Silent Letters & Sentence Stems
  // -------------------------------------------------------------
  u3: {
    unitId: 'u3',
    unitNumber: 3,
    title: 'Silent Letters & Sentence Stems',
    subtitle: 'Core Sentence Construction: C’est, Ce n’est pas, Il est',
    pedagogyType: 'grammar',
    practicalOutcome: 'Form accurate affirmative and negative statements using the foundational French building blocks C’est, Ce n’est pas, and Il est.',
    learningTargets: [
      {
        id: 't-u3-1',
        term: 'C’est...',
        translation: 'It is / That is...',
        phonetic: '/sɛ/',
        context: 'Universal identifier used before nouns, adjectives, and demonstratives. The final "t" is silent.',
        exampleUsage: 'C’est un ami.',
        exampleTranslation: 'It is a friend.'
      },
      {
        id: 't-u3-2',
        term: 'Ce n’est pas...',
        translation: 'It is not / That is not...',
        phonetic: '/sə nɛ pa/',
        context: 'Standard negation wrapping the verb "est" with "n’... pas". The "s" in "pas" is silent.',
        exampleUsage: 'Ce n’est pas difficile.',
        exampleTranslation: 'It is not difficult.'
      },
      {
        id: 't-u3-3',
        term: 'Il est...',
        translation: 'He is / It is (masculine)...',
        phonetic: '/i.l‿ɛ/',
        context: 'Used specifically for professions, time of day, and personal characteristics.',
        exampleUsage: 'Il est midi.',
        exampleTranslation: 'It is noon.'
      },
      {
        id: 't-u3-4',
        term: 'Est-ce que... ?',
        translation: 'Is it that...? / (Question marker)',
        phonetic: '/ɛs kə/',
        context: 'Standard formula placed before any statement to turn it into a question.',
        exampleUsage: 'Est-ce que c’est bon ?',
        exampleTranslation: 'Is it good?'
      },
      {
        id: 't-u3-5',
        term: 'Oui, c’est vrai',
        translation: 'Yes, that’s true',
        phonetic: '/wi sɛ vʁɛ/',
        context: 'Natural conversational confirmation in dialogue.',
        exampleUsage: 'Oui, c’est vrai, merci.',
        exampleTranslation: 'Yes, that is true, thank you.'
      }
    ],
    exercises: [
      // STEP 1: DISCOVER
      {
        id: 'u3-s1-discover',
        type: 'target_discovery',
        stepType: 'discover',
        prompt: 'Discover the core sentence building blocks of French grammar:',
        xpReward: 5
      },
      // STEP 2: LISTEN
      {
        id: 'u3-s2-listen',
        type: 'listening',
        stepType: 'listen',
        prompt: 'Listen to the sentence: Is it affirmative ("It is") or negative ("It is not")?',
        audioText: 'Ce n’est pas bon',
        targetText: 'Ce n’est pas bon',
        translation: 'It is not good',
        explanation: '“Ce n’est pas...” (/sə nɛ pa/) signals negative structure with the wrapper “n’... pas”.',
        options: [
          { id: 'u3-2a', text: 'Negative: “Ce n’est pas bon”', translation: 'It is not good', audioText: 'Ce n’est pas bon' },
          { id: 'u3-2b', text: 'Affirmative: “C’est bon”', translation: 'It is good', audioText: 'C’est bon' }
        ],
        correctOptionId: 'u3-2a',
        xpReward: 5
      },
      // STEP 3: UNDERSTAND
      {
        id: 'u3-s3-understand',
        type: 'multiple_choice',
        stepType: 'understand',
        prompt: 'Grammar Rule: Are the final letters "t" in “C’est” and "s" in “pas” pronounced?',
        explanation: 'In standard French, final consonants like "t" in “est” and "s" in “pas” are silent unless followed by a liaison vowel.',
        options: [
          { id: 'u3-3a', text: 'No, both are silent letters in standard speech', translation: 'Silent final consonant rule' },
          { id: 'u3-3b', text: 'Yes, every letter in French is always spoken', translation: 'Incorrect' },
          { id: 'u3-3c', text: 'Only the "s" is pronounced with a buzzing sound', translation: 'Incorrect' }
        ],
        correctOptionId: 'u3-3a',
        xpReward: 5
      },
      // STEP 4: PRACTICE
      {
        id: 'u3-s4-practice',
        type: 'sentence_order',
        stepType: 'practice',
        prompt: 'Construct the negative sentence: “It is not here”',
        targetText: 'Ce n’est pas ici',
        correctOrder: ['Ce', 'n’est', 'pas', 'ici'],
        options: [
          { id: 'u3-w1', text: 'Ce' },
          { id: 'u3-w2', text: 'n’est' },
          { id: 'u3-w3', text: 'pas' },
          { id: 'u3-w4', text: 'ici' },
          { id: 'u3-w5', text: 'bon' }
        ],
        translation: 'It is not here',
        explanation: '“Ce n’est pas ici” illustrates correct grammatical negation around the verb.',
        xpReward: 10
      },
      // STEP 5: SPEAK
      {
        id: 'u3-s5-speak',
        type: 'speaking',
        stepType: 'speak',
        prompt: 'Speak this essential agreement phrase into your microphone:',
        targetText: 'Oui, c’est vrai',
        audioText: 'Oui, c’est vrai',
        phoneticHint: '/wi sɛ vʁɛ/',
        translation: 'Yes, that’s true',
        explanation: 'Remember the "t" in “c’est” and the "s" in “pas” are silent.',
        xpReward: 10
      },
      // STEP 6: FEEDBACK
      {
        id: 'u3-s6-feedback',
        type: 'multiple_choice',
        stepType: 'feedback',
        prompt: 'Grammar Precision: When describing a person’s profession, which stem is preferred?',
        explanation: 'For professions, French uses “Il est...” / “Elle est...” directly (e.g. “Il est professeur”).',
        options: [
          { id: 'u3-6a', text: 'Il est (e.g., Il est médecin)', translation: 'Correct grammatical structure' },
          { id: 'u3-6b', text: 'Ce n’est pas médecin', translation: 'Incorrect context' }
        ],
        correctOptionId: 'u3-6a',
        xpReward: 5
      },
      // STEP 7: REPEAT
      {
        id: 'u3-s7-repeat',
        type: 'multiple_choice',
        stepType: 'repeat',
        prompt: 'Targeted Grammar Drill: How do you say "Is it true?" using the question formula?',
        targetText: 'Est-ce que c’est vrai ?',
        audioText: 'Est-ce que c’est vrai ?',
        explanation: 'Placing “Est-ce que...” before “c’est vrai” forms a clear, polite question.',
        options: [
          { id: 'u3-7a', text: 'Est-ce que c’est vrai ?', translation: 'Is that true?' },
          { id: 'u3-7b', text: 'C’est pas vrai est-ce ?', translation: 'Incorrect word order' },
          { id: 'u3-7c', text: 'Il est vrai que ce ?', translation: 'Incorrect grammar' }
        ],
        correctOptionId: 'u3-7a',
        xpReward: 5
      },
      // STEP 8: USE
      {
        id: 'u3-s8-use',
        type: 'multiple_choice',
        stepType: 'use',
        prompt: 'Realistic Scenario: Someone asks if the bread is ready, but it is not. You answer:',
        audioText: 'Non, ce n’est pas prêt',
        explanation: '“Non, ce n’est pas prêt” accurately negates the condition.',
        options: [
          { id: 'u3-8a', text: 'Non, ce n’est pas prêt.', translation: 'No, it is not ready.' },
          { id: 'u3-8b', text: 'Oui, tout ici temps.', translation: 'Nonsense words' }
        ],
        correctOptionId: 'u3-8a',
        xpReward: 10
      },
      // STEP 9: CHALLENGE
      {
        id: 'u3-s9-challenge',
        type: 'sentence_order',
        stepType: 'challenge',
        prompt: 'Grammar Transfer Challenge: Build the question “Is it good?”',
        targetText: 'Est-ce que c’est bon ?',
        correctOrder: ['Est-ce', 'que', 'c’est', 'bon', '?'],
        options: [
          { id: 'u3-ch1', text: 'Est-ce' },
          { id: 'u3-ch2', text: 'que' },
          { id: 'u3-ch3', text: 'c’est' },
          { id: 'u3-ch4', text: 'bon' },
          { id: 'u3-ch5', text: '?' },
          { id: 'u3-ch6', text: 'pas' }
        ],
        translation: 'Is it good?',
        explanation: 'Transfers the grammatical stem into question construction.',
        xpReward: 10
      },
      // STEP 10: MASTER
      {
        id: 'u3-s10-master',
        type: 'speaking',
        stepType: 'master',
        prompt: 'Final Mastery Check: Speak this complete affirmative and negative pair:',
        targetText: 'C’est bon, ce n’est pas ici',
        audioText: 'C’est bon, ce n’est pas ici',
        phoneticHint: '/sɛ bɔ̃, sə nɛ pa.z‿i.si/',
        translation: 'It is good, it is not here',
        explanation: 'Demonstrates complete control over affirmative and negative French sentence stems.',
        xpReward: 15
      }
    ]
  },

  // -------------------------------------------------------------
  // UNIT 4: LISTENING UNIT — Elisions & Liaisons in Real Speech
  // -------------------------------------------------------------
  u4: {
    unitId: 'u4',
    unitNumber: 4,
    title: 'Elisions & Liaisons in Real Speech',
    subtitle: 'Connecting Words: vous avez, les amis, c’est un',
    pedagogyType: 'listening',
    practicalOutcome: 'Decipher real spoken French by recognizing seamless liaisons (/z/, /t/) and vowel elisions (j’ai, c’est).',
    learningTargets: [
      {
        id: 't-u4-1',
        term: 'vous avez',
        translation: 'you have',
        phonetic: '/vu.za.ve/',
        context: 'Liaison: The silent "s" in "vous" joins the vowel in "avez" as a /z/ sound.',
        exampleUsage: 'Vous avez le temps ?',
        exampleTranslation: 'Do you have the time?'
      },
      {
        id: 't-u4-2',
        term: 'les amis',
        translation: 'the friends',
        phonetic: '/le.za.mi/',
        context: 'Liaison: The plural "s" creates a smooth /z/ connection before the vowel "a".',
        exampleUsage: 'Ce sont les amis de Pierre.',
        exampleTranslation: 'These are Pierre’s friends.'
      },
      {
        id: 't-u4-3',
        term: 'c’est un...',
        translation: 'it is a...',
        phonetic: '/sɛ.t‿œ̃/',
        context: 'Liaison: The silent "t" in "c’est" links to the nasal vowel "un" as a crisp /t/.',
        exampleUsage: 'C’est un bon ami.',
        exampleTranslation: 'He is a good friend.'
      },
      {
        id: 't-u4-4',
        term: 'j’ai',
        translation: 'I have',
        phonetic: '/ʒe/',
        context: 'Elision: "Je" contracts with "ai" into a single syllable "j’ai" to avoid vowel collision.',
        exampleUsage: 'J’ai un ami ici.',
        exampleTranslation: 'I have a friend here.'
      },
      {
        id: 't-u4-5',
        term: 'un grand homme',
        translation: 'a great man',
        phonetic: '/œ̃ ɡʁɑ̃.t‿ɔm/',
        context: 'Liaison: The silent "d" in "grand" links to the vowel as a /t/ sound.',
        exampleUsage: 'C’est un grand homme.',
        exampleTranslation: 'He is a great man.'
      }
    ],
    exercises: [
      // STEP 1: DISCOVER
      {
        id: 'u4-s1-discover',
        type: 'target_discovery',
        stepType: 'discover',
        prompt: 'Discover the secret of French auditory fluency — Elisions and Liaisons:',
        xpReward: 5
      },
      // STEP 2: LISTEN
      {
        id: 'u4-s2-listen',
        type: 'listening',
        stepType: 'listen',
        prompt: 'Listen to the audio: What sound links "vous" and "avez"?',
        audioText: 'Vous avez',
        targetText: 'Vous avez (/vu.za.ve/)',
        explanation: 'In “vous avez”, the silent "s" produces a distinctive buzzing /z/ sound between the two vowels.',
        options: [
          { id: 'u4-2a', text: 'A buzzing /z/ sound (“vou-Z-avez”)', translation: 'Correct liaison', audioText: 'Vous avez' },
          { id: 'u4-2b', text: 'A hard /s/ sound (“vou-S-avez”)', translation: 'Incorrect' },
          { id: 'u4-2c', text: 'No connection, separate words', translation: 'Incorrect' }
        ],
        correctOptionId: 'u4-2a',
        xpReward: 5
      },
      // STEP 3: UNDERSTAND
      {
        id: 'u4-s3-understand',
        type: 'multiple_choice',
        stepType: 'understand',
        prompt: 'Why does “Je ai” contract into “J’ai” in French?',
        explanation: 'French elision eliminates the vowel "e" before another vowel to avoid an awkward glottal stop and ensure musical flow.',
        options: [
          { id: 'u4-3a', text: 'To avoid two vowel sounds clashing back-to-back', translation: 'Vowel elision principle' },
          { id: 'u4-3b', text: 'Because "ai" is a silent word', translation: 'Incorrect' }
        ],
        correctOptionId: 'u4-3a',
        xpReward: 5
      },
      // STEP 4: PRACTICE
      {
        id: 'u4-s4-practice',
        type: 'match_pairs',
        stepType: 'practice',
        prompt: 'Match the French connected phrases with their English meanings:',
        matchPairs: [
          { id: 'u4-p1', left: 'vous avez', right: 'you have' },
          { id: 'u4-p2', left: 'les amis', right: 'the friends' },
          { id: 'u4-p3', left: 'c’est un', right: 'it is a' },
          { id: 'u4-p4', left: 'j’ai', right: 'I have' }
        ],
        xpReward: 10
      },
      // STEP 5: SPEAK
      {
        id: 'u4-s5-speak',
        type: 'speaking',
        stepType: 'speak',
        prompt: 'Speak this connected phrase into your microphone with the /z/ liaison:',
        targetText: 'Vous avez des amis',
        audioText: 'Vous avez des amis',
        phoneticHint: '/vu.za.ve de.za.mi/',
        translation: 'You have friends',
        explanation: 'Glide smoothly: “Vou-Z-avez de-Z-amis”.',
        xpReward: 10
      },
      // STEP 6: FEEDBACK
      {
        id: 'u4-s6-feedback',
        type: 'multiple_choice',
        stepType: 'feedback',
        prompt: 'Ear Training: Which phrase sounds like “sɛ.t‿œ̃ bɔ̃ pɛ̃”?',
        audioText: 'C’est un bon pain',
        explanation: '“C’est un bon pain” links the "t" to "un" (/sɛ.t‿œ̃/).',
        options: [
          { id: 'u4-6a', text: 'C’est un bon pain', translation: 'It is a good bread' },
          { id: 'u4-6b', text: 'Ce bon pain', translation: 'This good bread' }
        ],
        correctOptionId: 'u4-6a',
        xpReward: 5
      },
      // STEP 7: REPEAT
      {
        id: 'u4-s7-repeat',
        type: 'listening',
        stepType: 'repeat',
        prompt: 'Listening Dictation Drill: What is the speaker saying?',
        audioText: 'J’ai un ami ici',
        targetText: 'J’ai un ami ici',
        explanation: 'You heard “J’ai un ami ici” (/ʒe œ̃.n‿a.mi i.si/).',
        options: [
          { id: 'u4-7a', text: 'J’ai un ami ici', translation: 'I have a friend here' },
          { id: 'u4-7b', text: 'Je suis un ami', translation: 'I am a friend' }
        ],
        correctOptionId: 'u4-7a',
        xpReward: 5
      },
      // STEP 8: USE
      {
        id: 'u4-s8-use',
        type: 'sentence_order',
        stepType: 'use',
        prompt: 'Arrange the connected words: “You have a friend here”',
        targetText: 'Vous avez un ami ici',
        correctOrder: ['Vous', 'avez', 'un', 'ami', 'ici'],
        options: [
          { id: 'u4-w1', text: 'Vous' },
          { id: 'u4-w2', text: 'avez' },
          { id: 'u4-w3', text: 'un' },
          { id: 'u4-w4', text: 'ami' },
          { id: 'u4-w5', text: 'ici' },
          { id: 'u4-w6', text: 'bon' }
        ],
        translation: 'You have a friend here',
        explanation: 'Features double liaison: “vou-Z-avez un-N-ami ici”.',
        xpReward: 10
      },
      // STEP 9: CHALLENGE
      {
        id: 'u4-s9-challenge',
        type: 'multiple_choice',
        stepType: 'challenge',
        prompt: 'Liaison Transfer: In “un grand homme” (/œ̃ ɡʁɑ̃.t‿ɔm/), how does the "d" sound link?',
        explanation: 'In French liaisons, the letter "d" transforms into a /t/ sound before a vowel or silent h!',
        options: [
          { id: 'u4-9a', text: 'It transforms into a crisp /t/ sound', translation: 'Accurate French phonetic rule' },
          { id: 'u4-9b', text: 'It stays a heavy English /d/ sound', translation: 'Incorrect' }
        ],
        correctOptionId: 'u4-9a',
        xpReward: 10
      },
      // STEP 10: MASTER
      {
        id: 'u4-s10-master',
        type: 'speaking',
        stepType: 'master',
        prompt: 'Final Mastery Audio Check: Speak this natural connected French sentence:',
        targetText: 'C’est un ami et vous avez du temps',
        audioText: 'C’est un ami et vous avez du temps',
        phoneticHint: '/sɛ.t‿œ̃.n‿a.mi e vu.za.ve dy tɑ̃/',
        translation: 'He is a friend and you have time',
        explanation: 'Flawless execution of liaisons (/t/ and /z/) and rhythmic French intonation.',
        xpReward: 15
      }
    ]
  },

  // -------------------------------------------------------------
  // UNIT 5: PRACTICAL COMMUNICATION UNIT — Greetings & Etiquette
  // -------------------------------------------------------------
  u5: {
    unitId: 'u5',
    unitNumber: 5,
    title: 'Formal vs Informal Greetings',
    subtitle: 'Social Etiquette: Bonjour, Salut, Bonsoir, Comment allez-vous',
    pedagogyType: 'communication',
    practicalOutcome: 'Greet anyone in France with cultural fluency, knowing precisely when to use formal versus casual greetings across morning, evening, and social contexts.',
    learningTargets: [
      {
        id: 't-u5-1',
        term: 'Bonjour',
        translation: 'Hello / Good morning',
        phonetic: '/bɔ̃.ʒuʁ/',
        context: 'Universal, respectful daytime greeting for strangers, shops, and formal settings.',
        exampleUsage: 'Bonjour Madame Dupont.',
        exampleTranslation: 'Good morning Mrs. Dupont.'
      },
      {
        id: 't-u5-2',
        term: 'Salut',
        translation: 'Hi / Bye (casual)',
        phonetic: '/sa.ly/',
        context: 'Informal only! Used with peers, close friends, and family. The "t" is silent.',
        exampleUsage: 'Salut Marc, ça va ?',
        exampleTranslation: 'Hi Marc, how are you?'
      },
      {
        id: 't-u5-3',
        term: 'Bonsoir',
        translation: 'Good evening',
        phonetic: '/bɔ̃.swaʁ/',
        context: 'Used as both greeting and acknowledgement after roughly 6 PM.',
        exampleUsage: 'Bonsoir monsieur.',
        exampleTranslation: 'Good evening sir.'
      },
      {
        id: 't-u5-4',
        term: 'Comment allez-vous ?',
        translation: 'How are you? (Formal/Polite)',
        phonetic: '/kɔ.mɑ̃.t‿a.le vu/',
        context: 'Respectful inquiry using "vous" for elders, colleagues, and professionals.',
        exampleUsage: 'Bonjour, comment allez-vous ?',
        exampleTranslation: 'Hello, how are you?'
      },
      {
        id: 't-u5-5',
        term: 'Ça va ?',
        translation: 'How’s it going? / I’m good',
        phonetic: '/sa va/',
        context: 'Versatile casual question and answer: "Ça va ?" — "Oui, ça va !"',
        exampleUsage: 'Salut, ça va ? — Oui, ça va très bien !',
        exampleTranslation: 'Hi, how’s it going? — Yes, doing great!'
      },
      {
        id: 't-u5-6',
        term: 'Au revoir',
        translation: 'Goodbye',
        phonetic: '/o ʁə.vwaʁ/',
        context: 'Standard parting phrase for all formal and everyday situations.',
        exampleUsage: 'Au revoir et bonne journée !',
        exampleTranslation: 'Goodbye and have a nice day!'
      },
      {
        id: 't-u5-7',
        term: 'À bientôt',
        translation: 'See you soon',
        phonetic: '/a bjɛ̃.to/',
        context: 'Warm parting phrase when you expect to meet the person again soon.',
        exampleUsage: 'Merci beaucoup, à bientôt !',
        exampleTranslation: 'Thank you very much, see you soon!'
      }
    ],
    exercises: [
      // STEP 1: DISCOVER
      {
        id: 'u5-s1-discover',
        type: 'target_discovery',
        stepType: 'discover',
        prompt: 'Discover the complete palette of French greetings and cultural etiquette:',
        xpReward: 5
      },
      // STEP 2: LISTEN
      {
        id: 'u5-s2-listen',
        type: 'listening',
        stepType: 'listen',
        prompt: 'Listen: Which greeting is appropriate when walking into a bakery at 10 AM?',
        audioText: 'Bonjour',
        targetText: 'Bonjour',
        translation: 'Hello / Good morning',
        explanation: '“Bonjour” is the essential golden key of French etiquette when entering any shop.',
        options: [
          { id: 'u5-2a', text: 'Bonjour', translation: 'Daytime greeting for shops & public' },
          { id: 'u5-2b', text: 'Bonsoir', translation: 'Only used after 6 PM' },
          { id: 'u5-2c', text: 'Salut', translation: 'Too casual for a shopkeeper' }
        ],
        correctOptionId: 'u5-2a',
        xpReward: 5
      },
      // STEP 3: UNDERSTAND
      {
        id: 'u5-s3-understand',
        type: 'multiple_choice',
        stepType: 'understand',
        prompt: 'Social Etiquette: When is it appropriate to use “Salut” (/sa.ly/)?',
        explanation: '“Salut” is strictly informal. Use it only with friends, peers, and children. Using it with a French bank teller or boss is considered impolite.',
        options: [
          { id: 'u5-3a', text: 'With close friends, classmates, and family members', translation: 'Appropriate informal context' },
          { id: 'u5-3b', text: 'With a police officer or government official', translation: 'Impolite formality clash' },
          { id: 'u5-3c', text: 'In a formal job interview', translation: 'Inappropriate' }
        ],
        correctOptionId: 'u5-3a',
        xpReward: 5
      },
      // STEP 4: PRACTICE
      {
        id: 'u5-s4-practice',
        type: 'match_pairs',
        stepType: 'practice',
        prompt: 'Match each greeting to its time and social setting:',
        matchPairs: [
          { id: 'u5-p1', left: 'Bonjour', right: 'Daytime / Public' },
          { id: 'u5-p2', left: 'Bonsoir', right: 'Evening (after 6 PM)' },
          { id: 'u5-p3', left: 'Salut', right: 'Casual with friends' },
          { id: 'u5-p4', left: 'Au revoir', right: 'Standard Goodbye' }
        ],
        xpReward: 10
      },
      // STEP 5: SPEAK
      {
        id: 'u5-s5-speak',
        type: 'speaking',
        stepType: 'speak',
        prompt: 'Pronounce this polite greeting into your microphone:',
        targetText: 'Bonjour, comment allez-vous ?',
        audioText: 'Bonjour, comment allez-vous ?',
        phoneticHint: '/bɔ̃.ʒuʁ, kɔ.mɑ̃.t‿a.le vu/',
        translation: 'Hello, how are you? (Formal)',
        explanation: 'Glide smoothly through the liaison: “comment-T-allez-vous”.',
        xpReward: 10
      },
      // STEP 6: FEEDBACK
      {
        id: 'u5-s6-feedback',
        type: 'multiple_choice',
        stepType: 'feedback',
        prompt: 'Feedback Check: How do you reply to “Ça va ?” when everything is fine?',
        explanation: 'In French, the classic mirror response is “Ça va bien, merci !”',
        options: [
          { id: 'u5-6a', text: 'Ça va bien, merci !', translation: 'I am doing well, thank you!' },
          { id: 'u5-6b', text: 'Au revoir bonsoir !', translation: 'Goodbye good evening' }
        ],
        correctOptionId: 'u5-6a',
        xpReward: 5
      },
      // STEP 7: REPEAT
      {
        id: 'u5-s7-repeat',
        type: 'multiple_choice',
        stepType: 'repeat',
        prompt: 'Targeted Review: You are leaving a dinner party at 10 PM. You say:',
        targetText: 'Au revoir et bonne soirée !',
        audioText: 'Au revoir et bonne soirée !',
        explanation: '“Au revoir et bonne soirée !” wishes everyone a pleasant remainder of the evening.',
        options: [
          { id: 'u5-7a', text: 'Au revoir et bonne soirée !', translation: 'Goodbye and have a good evening!' },
          { id: 'u5-7b', text: 'Bonjour et bon matin !', translation: 'Wrong time of day' }
        ],
        correctOptionId: 'u5-7a',
        xpReward: 5
      },
      // STEP 8: USE
      {
        id: 'u5-s8-use',
        type: 'sentence_order',
        stepType: 'use',
        prompt: 'Real-world Situation: Greet your friend and ask how they are doing:',
        targetText: 'Salut, ça va bien ?',
        correctOrder: ['Salut,', 'ça', 'va', 'bien', '?'],
        options: [
          { id: 'u5-w1', text: 'Salut,' },
          { id: 'u5-w2', text: 'ça' },
          { id: 'u5-w3', text: 'va' },
          { id: 'u5-w4', text: 'bien' },
          { id: 'u5-w5', text: '?' },
          { id: 'u5-w6', text: 'Monsieur' }
        ],
        translation: 'Hi, how’s it going?',
        explanation: 'Natural casual French greeting between friends.',
        xpReward: 10
      },
      // STEP 9: CHALLENGE
      {
        id: 'u5-s9-challenge',
        type: 'multiple_choice',
        stepType: 'challenge',
        prompt: 'Social Etiquette Challenge: You are checking into a hotel at 8 PM. What is the most culturally authentic greeting?',
        audioText: 'Bonsoir Madame, j’ai une réservation',
        explanation: 'At 8 PM, “Bonsoir” is compulsory, followed by polite address and your request.',
        options: [
          { id: 'u5-9a', text: 'Bonsoir Madame, j’ai une réservation.', translation: 'Perfect formal French courtesy' },
          { id: 'u5-9b', text: 'Salut toi, donne ma chambre.', translation: 'Aggressive and disrespectful' },
          { id: 'u5-9c', text: 'Bonjour, bonne nuit.', translation: 'Contradictory and incorrect' }
        ],
        correctOptionId: 'u5-9a',
        xpReward: 10
      },
      // STEP 10: MASTER
      {
        id: 'u5-s10-master',
        type: 'speaking',
        stepType: 'master',
        prompt: 'Final Mastery Check: Speak this complete formal greeting and parting farewell:',
        targetText: 'Bonjour monsieur, merci et à bientôt !',
        audioText: 'Bonjour monsieur, merci et à bientôt !',
        phoneticHint: '/bɔ̃.ʒuʁ mə.sjø, mɛʁ.si e a bjɛ̃.to/',
        translation: 'Hello sir, thank you and see you soon!',
        explanation: 'Demonstrates 100% mastery over formal greetings, courtesy, and departure etiquette.',
        xpReward: 15
      }
    ]
  },

  // -------------------------------------------------------------
  // UNIT 6: CONVERSATION UNIT — Meeting Someone New & Small Talk
  // -------------------------------------------------------------
  u6: {
    unitId: 'u6',
    unitNumber: 6,
    title: 'Meeting Someone New & Small Talk',
    subtitle: 'Introductions & Dialogue: Je m’appelle, Enchanté, D’où venez-vous',
    pedagogyType: 'conversation',
    practicalOutcome: 'Introduce yourself, ask names and origins, and participate in a natural, polite French introduction dialogue from start to finish.',
    learningTargets: [
      {
        id: 't-u6-1',
        term: 'Je m’appelle...',
        translation: 'My name is...',
        phonetic: '/ʒə ma.pɛl/',
        context: 'Standard way to state your name (literally: "I call myself...").',
        exampleUsage: 'Je m’appelle Alex.',
        exampleTranslation: 'My name is Alex.'
      },
      {
        id: 't-u6-2',
        term: 'Comment vous vous appelez ?',
        translation: 'What is your name? (Formal)',
        phonetic: '/kɔ.mɑ̃ vu vu.za.ple/',
        context: 'Polite inquiry asking an adult or colleague their name.',
        exampleUsage: 'Et vous, comment vous vous appelez ?',
        exampleTranslation: 'And you, what is your name?'
      },
      {
        id: 't-u6-3',
        term: 'Enchanté(e)',
        translation: 'Pleased to meet you / Delighted',
        phonetic: '/ɑ̃.ʃɑ̃.te/',
        context: 'Universal polite response upon being introduced to someone.',
        exampleUsage: 'Enchanté de faire votre connaissance.',
        exampleTranslation: 'Delighted to make your acquaintance.'
      },
      {
        id: 't-u6-4',
        term: 'D’où venez-vous ?',
        translation: 'Where are you from? (Formal)',
        phonetic: '/du və.ne vu/',
        context: 'Polite inquiry regarding nationality or hometown.',
        exampleUsage: 'Pardon, d’où venez-vous ?',
        exampleTranslation: 'Excuse me, where are you from?'
      },
      {
        id: 't-u6-5',
        term: 'Je viens de...',
        translation: 'I come from / I am from...',
        phonetic: '/ʒə vjɛ̃ də/',
        context: 'Used to state your origin, country, or city.',
        exampleUsage: 'Je viens de Paris.',
        exampleTranslation: 'I come from Paris.'
      }
    ],
    exercises: [
      // STEP 1: DISCOVER
      {
        id: 'u6-s1-discover',
        type: 'target_discovery',
        stepType: 'discover',
        prompt: 'Discover the key expressions for making genuine connections in French:',
        xpReward: 5
      },
      // STEP 2: LISTEN
      {
        id: 'u6-s2-listen',
        type: 'listening',
        stepType: 'listen',
        prompt: 'Listen to the introduction: What is the speaker’s name?',
        audioText: 'Bonjour, je m’appelle Thomas',
        targetText: 'Bonjour, je m’appelle Thomas',
        translation: 'Hello, my name is Thomas',
        explanation: '“Je m’appelle...” (/ʒə ma.pɛl/) precedes the speaker’s name.',
        options: [
          { id: 'u6-2a', text: 'Thomas', translation: '“Je m’appelle Thomas”' },
          { id: 'u6-2b', text: 'Pierre', translation: 'Incorrect name' },
          { id: 'u6-2c', text: 'Alex', translation: 'Incorrect name' }
        ],
        correctOptionId: 'u6-2a',
        xpReward: 5
      },
      // STEP 3: UNDERSTAND
      {
        id: 'u6-s3-understand',
        type: 'multiple_choice',
        stepType: 'understand',
        prompt: 'Dialogue Protocol: When someone tells you their name, what is the single most polite word to say back?',
        targetText: 'Enchanté',
        audioText: 'Enchanté',
        explanation: '“Enchanté” (/ɑ̃.ʃɑ̃.te/) means "Delighted / Pleased to meet you" and is customary across all social classes.',
        options: [
          { id: 'u6-3a', text: 'Enchanté !', translation: 'Pleased to meet you' },
          { id: 'u6-3b', text: 'Au revoir !', translation: 'Goodbye (premature)' },
          { id: 'u6-3c', text: 'Pardon !', translation: 'Sorry / Excuse me' }
        ],
        correctOptionId: 'u6-3a',
        xpReward: 5
      },
      // STEP 4: PRACTICE
      {
        id: 'u6-s4-practice',
        type: 'sentence_order',
        stepType: 'practice',
        prompt: 'Construct your introduction: “Hello, my name is Marie”',
        targetText: 'Bonjour, je m’appelle Marie',
        correctOrder: ['Bonjour,', 'je', 'm’appelle', 'Marie'],
        options: [
          { id: 'u6-w1', text: 'Bonjour,' },
          { id: 'u6-w2', text: 'je' },
          { id: 'u6-w3', text: 'm’appelle' },
          { id: 'u6-w4', text: 'Marie' },
          { id: 'u6-w5', text: 'd’où' }
        ],
        translation: 'Hello, my name is Marie',
        explanation: 'Accurate word order for formal and informal self-introductions.',
        xpReward: 10
      },
      // STEP 5: SPEAK
      {
        id: 'u6-s5-speak',
        type: 'speaking',
        stepType: 'speak',
        prompt: 'Speak this essential inquiry into your microphone:',
        targetText: 'Et vous, comment vous vous appelez ?',
        audioText: 'Et vous, comment vous vous appelez ?',
        phoneticHint: '/e vu, kɔ.mɑ̃ vu vu.za.ple/',
        translation: 'And you, what is your name?',
        explanation: 'Keep the rhythm steady and link “vous vous appelez” with a /z/ liaison.',
        xpReward: 10
      },
      // STEP 6: FEEDBACK
      {
        id: 'u6-s6-feedback',
        type: 'multiple_choice',
        stepType: 'feedback',
        prompt: 'Origin Check: Which phrase means "I am from Paris"?',
        audioText: 'Je viens de Paris',
        explanation: '“Je viens de...” (/ʒə vjɛ̃ də/) expresses your city or country of origin.',
        options: [
          { id: 'u6-6a', text: 'Je viens de Paris', translation: 'I come from Paris' },
          { id: 'u6-6b', text: 'Je m’appelle Paris', translation: 'My name is Paris' }
        ],
        correctOptionId: 'u6-6a',
        xpReward: 5
      },
      // STEP 7: REPEAT
      {
        id: 'u6-s7-repeat',
        type: 'multiple_choice',
        stepType: 'repeat',
        prompt: 'Dialogue Turn Drill: Someone asks: “D’où venez-vous ?” — How do you answer if from London?',
        targetText: 'Je viens de Londres',
        audioText: 'Je viens de Londres',
        explanation: '“Je viens de Londres” correctly completes the question-and-answer pair.',
        options: [
          { id: 'u6-7a', text: 'Je viens de Londres.', translation: 'I come from London.' },
          { id: 'u6-7b', text: 'Enchanté de Londres.', translation: 'Incorrect usage' }
        ],
        correctOptionId: 'u6-7a',
        xpReward: 5
      },
      // STEP 8: USE
      {
        id: 'u6-s8-use',
        type: 'conversation_turn',
        stepType: 'use',
        prompt: 'Real-world Roleplay: Madame Laurent says: “Bonjour ! Je m’appelle Sophie Laurent. Et vous ?”',
        audioText: 'Bonjour ! Je m’appelle Sophie Laurent. Et vous ?',
        explanation: 'Respond with greeting, your name, and courteous acknowledgment.',
        options: [
          { id: 'u6-8a', text: 'Bonjour Madame, je m’appelle Paul. Enchanté !', translation: 'Authentic courteous dialogue' },
          { id: 'u6-8b', text: 'Au revoir Sophie, bon vin.', translation: 'Incoherent' }
        ],
        correctOptionId: 'u6-8a',
        xpReward: 10
      },
      // STEP 9: CHALLENGE
      {
        id: 'u6-s9-challenge',
        type: 'sentence_order',
        stepType: 'challenge',
        prompt: 'Dialogue Challenge: Assemble the complete polite introduction exchange:',
        targetText: 'Enchanté, je viens de New York',
        correctOrder: ['Enchanté,', 'je', 'viens', 'de', 'New York'],
        options: [
          { id: 'u6-ch1', text: 'Enchanté,' },
          { id: 'u6-ch2', text: 'je' },
          { id: 'u6-ch3', text: 'viens' },
          { id: 'u6-ch4', text: 'de' },
          { id: 'u6-ch5', text: 'New York' },
          { id: 'u6-ch6', text: 's’il vous plaît' }
        ],
        translation: 'Delighted, I come from New York',
        explanation: 'Combines courtesy and origin into a smooth conversational introduction.',
        xpReward: 10
      },
      // STEP 10: MASTER
      {
        id: 'u6-s10-master',
        type: 'speaking',
        stepType: 'master',
        prompt: 'Final Mastery Dialogue: Speak this complete introduction fluently:',
        targetText: 'Bonjour, je m’appelle Jean et je viens d’ici. Enchanté !',
        audioText: 'Bonjour, je m’appelle Jean et je viens d’ici. Enchanté !',
        phoneticHint: '/bɔ̃.ʒuʁ, ʒə ma.pɛl ʒɑ̃ e ʒə vjɛ̃ di.si. ɑ̃.ʃɑ̃.te/',
        translation: 'Hello, my name is Jean and I come from here. Pleased to meet you!',
        explanation: 'Complete conversational fluency bringing together all 6 learning targets.',
        xpReward: 15
      }
    ]
  }
};

/**
 * Retrieves the pedagogical 10-step journey for a unit if available
 */
export const getUnitJourney = (unitId: string): UnitLearningJourney | null => {
  return UNIT_JOURNEYS[unitId] || null;
};

export const isUnitJourneyAvailable = (unitId: string): boolean => {
  return Boolean(UNIT_JOURNEYS[unitId]);
};

/**
 * Builds a comprehensive 10-step pedagogical Lesson object from a UnitLearningJourney
 */
export const buildUnitLessonFromJourney = (journey: UnitLearningJourney): Lesson => {
  return {
    id: `${journey.unitId}-journey`,
    title: `${journey.title} — 10-Step Mastery`,
    description: journey.practicalOutcome,
    order: 1,
    xpReward: 40,
    unitId: journey.unitId,
    exercises: journey.exercises
  };
};
