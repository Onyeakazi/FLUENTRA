import { Lesson, Exercise } from '../types/curriculum';
import { CURRICULUM_DATA } from './curriculumRegistry';
import { aiCurriculumGenerator } from '../services/aiCurriculumGenerator';
import { UNIT_JOURNEYS, buildUnitLessonFromJourney } from './unitJourneys';

export interface LanguagePack {
  code: string;
  name: string;
  flag: string;
  greetingFormal: { target: string; trans: string; hint: string; exp: string };
  greetingInformal: { target: string; trans: string; hint: string; exp: string };
  thankYou: { target: string; trans: string; hint: string; exp: string };
  goodbye: { target: string; trans: string; hint: string; exp: string };
  howAreYou: { target: string; trans: string; hint: string; exp: string };
  fineThanks: { target: string; trans: string; hint: string; exp: string };
  pairs: { left: string; right: string }[];
  orderSentence: { prompt: string; target: string; trans: string; words: string[]; distractors: string[] };
  levelSentences: Record<number, { target: string; trans: string; explanation: string; options: string[] }[]>;
}

export const LANGUAGE_PACKS: Record<string, LanguagePack> = {
  'Chinese Mandarin': {
    code: 'zh-CN',
    name: 'Chinese Mandarin',
    flag: '🇨🇳',
    greetingFormal: { target: '您好', trans: 'Hello / Good day (Polite)', hint: 'Nǐn hǎo', exp: 'Standard polite and respectful greeting in Mandarin.' },
    greetingInformal: { target: '你好', trans: 'Hello / Hi', hint: 'Nǐ hǎo', exp: 'Universal friendly greeting for peers and friends.' },
    thankYou: { target: '非常感谢', trans: 'Thank you very much', hint: 'Fēicháng gǎnxiè', exp: 'Polite expression of sincere gratitude.' },
    goodbye: { target: '再见', trans: 'Goodbye', hint: 'Zàijiàn', exp: 'Standard parting phrase.' },
    howAreYou: { target: '你最近怎么样？', trans: 'How have you been?', hint: 'Nǐ zuìjìn zěnmeyàng?', exp: 'Everyday question asking how someone is doing.' },
    fineThanks: { target: '我很好，谢谢你！', trans: 'I am doing very well, thank you!', hint: 'Wǒ hěn hǎo, xièxie nǐ!', exp: 'Courteous positive response.' },
    pairs: [
      { left: '你好', right: 'Hello' },
      { left: '谢谢', right: 'Thank you' },
      { left: '再见', right: 'Goodbye' },
      { left: '请', right: 'Please' },
      { left: '对不起', right: 'Sorry / Excuse me' }
    ],
    orderSentence: {
      prompt: 'Arrange the characters to say: “Hello, thank you very much”',
      target: '你好 非常 感谢',
      trans: 'Hello, thank you very much',
      words: ['你好', '非常', '感谢'],
      distractors: ['请问', '再见']
    },
    levelSentences: {
      1: [
        { target: '很高兴认识你', trans: 'Pleased to meet you', explanation: 'Essential first introduction phrase.', options: ['很高兴认识你', '再见', '对不起', '谢谢'] },
        { target: '请给我一杯水', trans: 'Please give me a glass of water', explanation: 'Standard polite request in cafés and restaurants.', options: ['一杯水', '一个苹果', '买单', '菜单'] }
      ],
      2: [
        { target: '我家人住在北京附近', trans: 'My family lives near Beijing', explanation: 'Describing family residence.', options: ['住在', '吃', '旅行', '工作'] },
        { target: '请问这个多少钱？', trans: 'Excuse me, how much is this?', explanation: 'Inquiring about prices.', options: ['多少钱', '怎么去', '在哪里', '是谁'] }
      ],
      3: [
        { target: '我想预订一张两人的桌子', trans: 'I would like to reserve a table for two', explanation: 'Restaurant booking in Chinese.', options: ['预订', '付款', '选择', '取消'] }
      ],
      4: [
        { target: '昨天晚上我们和朋友一起吃了一顿丰盛的晚餐', trans: 'Last night we had dinner with friends', explanation: 'Past completed action with 了 (le).', options: ['吃了一顿', '要吃', '想吃', '吃过'] }
      ]
    }
  },
  French: {
    code: 'fr-FR',
    name: 'French',
    flag: '🇫🇷',
    greetingFormal: { target: 'Bonjour', trans: 'Hello / Good morning', hint: '/bɔ̃.ʒuʁ/', exp: 'Standard polite French greeting used from morning to evening.' },
    greetingInformal: { target: 'Salut', trans: 'Hi / Hey', hint: '/sa.ly/', exp: 'Informal friendly greeting for peers and friends.' },
    thankYou: { target: 'Merci beaucoup', trans: 'Thank you very much', hint: '/mɛʁ.si bo.ku/', exp: 'Polite expression of gratitude.' },
    goodbye: { target: 'Au revoir', trans: 'Goodbye', hint: '/o ʁə.vwaʁ/', exp: 'Standard formal parting phrase.' },
    howAreYou: { target: 'Comment ça va ?', trans: 'How are you?', hint: '/kɔ.mɑ̃ sa va/', exp: 'Common everyday inquiry.' },
    fineThanks: { target: 'Ça va très bien, merci !', trans: 'I am doing very well, thanks!', hint: '/sa va tʁɛ bjɛ̃ mɛʁ.si/', exp: 'Polite positive response.' },
    pairs: [
      { left: 'Bonjour', right: 'Hello / Good morning' },
      { left: 'Salut', right: 'Hi (Informal)' },
      { left: 'Merci', right: 'Thank you' },
      { left: 'Au revoir', right: 'Goodbye' },
      { left: 'S’il vous plaît', right: 'Please' }
    ],
    orderSentence: {
      prompt: 'Arrange the words to say: “Hello, thank you very much”',
      target: 'Bonjour merci beaucoup',
      trans: 'Hello, thank you very much',
      words: ['Bonjour', 'merci', 'beaucoup'],
      distractors: ['s’il vous plaît', 'au revoir']
    },
    levelSentences: {
      1: [
        { target: 'Enchanté de faire votre connaissance', trans: 'Delighted to meet you', explanation: 'Essential introduction phrase.', options: ['Enchanté', 'Au revoir', 'Pardon', 'Merci'] },
        { target: 'Je voudrais un café s’il vous plaît', trans: 'I would like a coffee please', explanation: 'Polite conditional request.', options: ['un café', 'de l’eau', 'l’addition', 'le menu'] }
      ],
      2: [
        { target: 'Ma famille habite près de la gare', trans: 'My family lives near the train station', explanation: 'Describing relatives and places.', options: ['habite', 'mange', 'voyage', 'travaille'] },
        { target: 'Combien coûte cette baguette ?', trans: 'How much does this baguette cost?', explanation: 'Pricing question at local shops.', options: ['Combien', 'Comment', 'Où', 'Qui'] }
      ],
      3: [
        { target: 'Je voudrais réserver une table pour deux personnes', trans: 'I would like to reserve a table for two', explanation: 'Restaurant booking phrasing.', options: ['réserver', 'payer', 'choisir', 'annuler'] }
      ],
      4: [
        { target: 'Hier soir, nous avons dîné avec des amis au restaurant', trans: 'Last night we had dinner with friends at the restaurant', explanation: 'Passé composé past tense construction.', options: ['avons dîné', 'dînons', 'dînions', 'allons dîner'] }
      ]
    }
  },
  Spanish: {
    code: 'es-ES',
    name: 'Spanish',
    flag: '🇪🇸',
    greetingFormal: { target: '¡Buenos días!', trans: 'Good morning!', hint: '/bwe.nos ˈdi.as/', exp: 'Standard morning greeting across Spanish-speaking countries.' },
    greetingInformal: { target: '¡Hola!', trans: 'Hello / Hi!', hint: '/ˈo.la/', exp: 'Universal friendly greeting for any time of day.' },
    thankYou: { target: 'Muchas gracias', trans: 'Thank you very much', hint: '/ˈmu.tʃas ˈɡɾa.sjas/', exp: 'Warm polite gratitude.' },
    goodbye: { target: 'Adiós, hasta luego', trans: 'Goodbye, see you later', hint: '/aˈdjos ˈas.ta ˈlwe.ɣo/', exp: 'Common parting phrase.' },
    howAreYou: { target: '¿Cómo estás?', trans: 'How are you?', hint: '/ˈko.mo esˈtas/', exp: 'Everyday question asking someone how they are doing.' },
    fineThanks: { target: '¡Muy bien, gracias! ¿Y tú?', trans: 'Very well, thank you! And you?', hint: '/mwi βjen ˈɡɾa.sjas i tu/', exp: 'Natural, friendly response with reciprocal question.' },
    pairs: [
      { left: '¡Hola!', right: 'Hello' },
      { left: 'Buenos días', right: 'Good morning' },
      { left: 'Muchas gracias', right: 'Thank you very much' },
      { left: 'Por favor', right: 'Please' },
      { left: 'Hasta luego', right: 'See you later' }
    ],
    orderSentence: {
      prompt: 'Arrange the words to say: “Hello, thank you very much”',
      target: 'Hola muchas gracias',
      trans: 'Hello, thank you very much',
      words: ['Hola', 'muchas', 'gracias'],
      distractors: ['por favor', 'adiós']
    },
    levelSentences: {
      1: [
        { target: 'Mucho gusto en conocerte', trans: 'Pleased to meet you', explanation: 'Key phrase when meeting someone for the first time.', options: ['Mucho gusto', 'Adiós', 'Perdón', 'Gracias'] },
        { target: 'Quisiera un café con leche por favor', trans: 'I would like a coffee with milk please', explanation: 'Polite ordering format in Spain and Latin America.', options: ['un café', 'un agua', 'la cuenta', 'el menú'] }
      ],
      2: [
        { target: 'Mi familia vive cerca del centro de la ciudad', trans: 'My family lives near downtown', explanation: 'Describing family and residence.', options: ['vive', 'come', 'viaja', 'trabaja'] },
        { target: '¿Cuánto cuesta este plato del día?', trans: 'How much does this daily special cost?', explanation: 'Inquiring about prices.', options: ['Cuánto', 'Cómo', 'Dónde', 'Quién'] }
      ],
      3: [
        { target: 'Quisiera reservar una mesa para dos en la terraza', trans: 'I would like to reserve a table for two on the terrace', explanation: 'Dining reservation etiquette.', options: ['reservar', 'pagar', 'elegir', 'cancelar'] }
      ],
      4: [
        { target: 'Ayer cenamos con amigos y hablamos de nuestros viajes', trans: 'Yesterday we had dinner with friends and talked about our travels', explanation: 'Preterite past tense storytelling.', options: ['cenamos', 'cenaremos', 'cenar', 'cenando'] }
      ]
    }
  },
  German: {
    code: 'de-DE',
    name: 'German',
    flag: '🇩🇪',
    greetingFormal: { target: 'Guten Tag', trans: 'Good day / Hello', hint: '/ˈɡuːtn̩ taːk/', exp: 'Polite daytime greeting throughout Germany, Austria, and Switzerland.' },
    greetingInformal: { target: 'Hallo', trans: 'Hello / Hi', hint: '/ˈhalo/', exp: 'Standard friendly greeting.' },
    thankYou: { target: 'Vielen Dank', trans: 'Thank you very much', hint: '/ˈfiːlən daŋk/', exp: 'Warm, sincere gratitude.' },
    goodbye: { target: 'Auf Wiedersehen', trans: 'Goodbye', hint: '/aʊ̯f ˈviːdɐˌzeːən/', exp: 'Formal parting phrase.' },
    howAreYou: { target: 'Wie geht es Ihnen?', trans: 'How are you? (Formal)', hint: '/viː ɡeːt ɛs ˈiːnən/', exp: 'Polite inquiry.' },
    fineThanks: { target: 'Sehr gut, danke!', trans: 'Very well, thank you!', hint: '/zeːɐ̯ ɡuːt ˈdaŋkə/', exp: 'Direct and courteous reply.' },
    pairs: [
      { left: 'Hallo', right: 'Hello' },
      { left: 'Guten Tag', right: 'Good day' },
      { left: 'Vielen Dank', right: 'Thank you very much' },
      { left: 'Bitte', right: 'Please / You’re welcome' },
      { left: 'Tschüss', right: 'Bye (Informal)' }
    ],
    orderSentence: {
      prompt: 'Arrange the words to say: “Hello, thank you very much”',
      target: 'Hallo vielen Dank',
      trans: 'Hello, thank you very much',
      words: ['Hallo', 'vielen', 'Dank'],
      distractors: ['bitte', 'tschüss']
    },
    levelSentences: {
      1: [
        { target: 'Freut mich, Sie kennenzulernen', trans: 'Pleased to meet you', explanation: 'Formal introduction phrase.', options: ['Freut mich', 'Auf Wiedersehen', 'Entschuldigung', 'Danke'] },
        { target: 'Ich möchte bitte einen Kaffee bestellen', trans: 'I would like to order a coffee please', explanation: 'Polite request in a café.', options: ['einen Kaffee', 'ein Wasser', 'die Rechnung', 'die Karte'] }
      ],
      2: [
        { target: 'Meine Familie wohnt in der Nähe von München', trans: 'My family lives near Munich', explanation: 'Expressing location of relatives.', options: ['wohnt', 'isst', 'reist', 'arbeitet'] }
      ],
      3: [
        { target: 'Ich möchte einen Tisch für zwei Personen reservieren', trans: 'I would like to reserve a table for two', explanation: 'Restaurant booking in German.', options: ['reservieren', 'bezahlen', 'wählen', 'stornieren'] }
      ],
      4: [
        { target: 'Gestern haben wir mit Freunden zu Abend gegessen', trans: 'Yesterday we had dinner with friends', explanation: 'Perfekt past tense with haben.', options: ['haben gegessen', 'essen', 'aßen', 'werden essen'] }
      ]
    }
  },
  Japanese: {
    code: 'ja-JP',
    name: 'Japanese',
    flag: '🇯🇵',
    greetingFormal: { target: 'こんにちは', trans: 'Hello / Good afternoon', hint: 'Konnichiwa', exp: 'Standard polite daytime greeting in Japan.' },
    greetingInformal: { target: 'おはようございます', trans: 'Good morning (Polite)', hint: 'Ohayou gozaimasu', exp: 'Essential polite morning greeting.' },
    thankYou: { target: 'どうもありがとうございます', trans: 'Thank you very much', hint: 'Doumo arigatou gozaimasu', exp: 'Deep, polite appreciation.' },
    goodbye: { target: 'さようなら', trans: 'Goodbye', hint: 'Sayounara', exp: 'Classic parting phrase.' },
    howAreYou: { target: 'お元気ですか？', trans: 'How are you?', hint: 'O-genki desu ka?', exp: 'Polite check on someone’s well-being.' },
    fineThanks: { target: 'はい、とても元気です！', trans: 'Yes, I am very well!', hint: 'Hai, totemo genki desu!', exp: 'Positive cheerful response.' },
    pairs: [
      { left: 'こんにちは', right: 'Hello' },
      { left: 'ありがとう', right: 'Thank you' },
      { left: 'すみません', right: 'Excuse me / Sorry' },
      { left: 'おねがいします', right: 'Please' },
      { left: 'じゃあまた', right: 'See you later' }
    ],
    orderSentence: {
      prompt: 'Arrange the words to say: “Hello, thank you very much”',
      target: 'こんにちは どうも ありがとう',
      trans: 'Hello, thank you very much',
      words: ['こんにちは', 'どうも', 'ありがとう'],
      distractors: ['すみません', 'さようなら']
    },
    levelSentences: {
      1: [
        { target: 'はじめまして、よろしくお願いします', trans: 'Nice to meet you, please treat me well', explanation: 'The quintessential Japanese introduction phrase.', options: ['はじめまして', 'さようなら', 'ごめんなさい', 'ありがとう'] },
        { target: 'コーヒーをひとつお願いします', trans: 'One coffee please', explanation: 'Ordering items politely with onegaishimasu.', options: ['コーヒー', 'お水', 'お会計', 'メニュー'] }
      ],
      2: [
        { target: '私の家族は東京の近くに住んでいます', trans: 'My family lives near Tokyo', explanation: 'Describing family residence.', options: ['住んでいます', '食べています', '旅行します', '働きます'] }
      ],
      3: [
        { target: '二名でテーブルの予約をお願いしたいのですが', trans: 'I would like to reserve a table for two people', explanation: 'Formal restaurant inquiry.', options: ['予約', 'お会計', '選択', 'キャンセル'] }
      ],
      4: [
        { target: '昨日の夜、友達と一緒に美味しいご飯を食べました', trans: 'Last night I ate delicious food with friends', explanation: 'Past tense storytelling in Japanese.', options: ['食べました', '食べます', '食べる', '食べている'] }
      ]
    }
  },
  Italian: {
    code: 'it-IT',
    name: 'Italian',
    flag: '🇮🇹',
    greetingFormal: { target: 'Buongiorno', trans: 'Good morning / Good day', hint: '/bwonˈdʒor.no/', exp: 'Polite daytime greeting throughout Italy.' },
    greetingInformal: { target: 'Ciao!', trans: 'Hi / Bye!', hint: '/ˈtʃa.o/', exp: 'World-famous informal Italian greeting.' },
    thankYou: { target: 'Grazie mille', trans: 'A thousand thanks', hint: '/ˈɡrat.tsje ˈmil.le/', exp: 'Warm Italian gratitude.' },
    goodbye: { target: 'Arrivederci', trans: 'Goodbye / Until we see each other again', hint: '/ar.ri.veˈder.tʃi/', exp: 'Standard polite farewell.' },
    howAreYou: { target: 'Come stai?', trans: 'How are you?', hint: '/ˈko.me ˈstaj/', exp: 'Everyday friendly question.' },
    fineThanks: { target: 'Molto bene, grazie!', trans: 'Very well, thank you!', hint: '/ˈmol.to ˈbɛ.ne ˈɡrat.tsje/', exp: 'Enthusiastic polite answer.' },
    pairs: [
      { left: 'Ciao', right: 'Hi / Bye' },
      { left: 'Buongiorno', right: 'Good morning' },
      { left: 'Grazie mille', right: 'A thousand thanks' },
      { left: 'Per favore', right: 'Please' },
      { left: 'A presto', right: 'See you soon' }
    ],
    orderSentence: {
      prompt: 'Arrange the words to say: “Hello, thank you very much”',
      target: 'Buongiorno grazie mille',
      trans: 'Hello, thank you very much',
      words: ['Buongiorno', 'grazie', 'mille'],
      distractors: ['per favore', 'arrivederci']
    },
    levelSentences: {
      1: [
        { target: 'Piacere di conoscerti', trans: 'Pleasure to meet you', explanation: 'Warm Italian introduction phrase.', options: ['Piacere', 'Arrivederci', 'Scusa', 'Grazie'] },
        { target: 'Vorrei un cappuccino per favore', trans: 'I would like a cappuccino please', explanation: 'Polite café order.', options: ['un cappuccino', 'un’acqua', 'il conto', 'il menù'] }
      ],
      2: [
        { target: 'La mia famiglia abita vicino a Roma', trans: 'My family lives near Rome', explanation: 'Describing relatives and home locations.', options: ['abita', 'mangia', 'viaggia', 'lavora'] }
      ],
      3: [
        { target: 'Vorrei prenotare un tavolo per due stasera', trans: 'I would like to reserve a table for two tonight', explanation: 'Restaurant booking in Italy.', options: ['prenotare', 'pagare', 'scegliere', 'annullare'] }
      ],
      4: [
        { target: 'Ieri sera abbiamo cenato con gli amici in una trattoria', trans: 'Last night we had dinner with friends at a trattoria', explanation: 'Passato prossimo past tense in Italian.', options: ['abbiamo cenato', 'ceniamo', 'ceneremo', 'cenavamo'] }
      ]
    }
  }
};

/**
 * Returns tailored pedagogical lessons for any unit in the learner's chosen language,
 * generated dynamically by the Fluentra AI curriculum engine
 */
export function getLessonsForUnit(
  unitId: string,
  languageName: string = 'French',
  learningGoal: string = 'travel'
): Lesson[] {
  // If unit has a structured 10-step pedagogical journey, return it
  if ((languageName === 'French' || !languageName) && UNIT_JOURNEYS[unitId]) {
    return [buildUnitLessonFromJourney(UNIT_JOURNEYS[unitId])];
  }

  const pack = LANGUAGE_PACKS[languageName] || LANGUAGE_PACKS.French;
  const meta = CURRICULUM_DATA.unitsById[unitId] || CURRICULUM_DATA.units[0];

  // Unit 1: Absolute Ground-Zero Ear-Training, Phonetics & Sound Architecture
  if (unitId === 'u1') {
    if (languageName === 'Chinese Mandarin') {
      return [
        {
          id: 'u1-l1',
          title: 'Mandarin Ground-Zero: The 4 Tones & Pitch Curves',
          description: 'Ear training on the 4 Mandarin tones: mā (high flat), má (rising), mǎ (dipping), and mà (falling).',
          order: 1,
          xpReward: 15,
          exercises: [
            {
              id: 'u1-l1-e1',
              type: 'multiple_choice',
              prompt: 'Tone 1 (High & Flat — 55 pitch): Which syllable stays high and steady like singing a note?',
              targetText: 'mā (妈 - Mother)',
              audioText: 'mā',
              translation: 'Tone 1: High & Flat (mā)',
              options: [
                { id: 't1', text: 'mā (High & Flat ˉ)', translation: 'Tone 1: mā' },
                { id: 't2', text: 'má (Rising ˊ)', translation: 'Tone 2: má' },
                { id: 't4', text: 'mà (Falling ˋ)', translation: 'Tone 4: mà' }
              ],
              correctOptionId: 't1',
              explanation: 'The 1st tone (mā) is held high and steady, like a sustained musical note. It means "mother" (妈).',
              xpReward: 5
            },
            {
              id: 'u1-l1-e2',
              type: 'speaking',
              prompt: 'Pronounce Tone 1 (mā) steadily in a high pitch:',
              targetText: 'mā',
              audioText: 'mā',
              phoneticHint: 'High, steady pitch (like singing: ahhh)',
              translation: 'High-flat 1st tone',
              explanation: 'Keep your vocal pitch even without dipping or dropping.',
              xpReward: 10
            },
            {
              id: 'u1-l1-e3',
              type: 'match_pairs',
              prompt: 'Match each tone number with its vocal pitch curve:',
              matchPairs: [
                { id: 'm1', left: 'Tone 1 (mā)', right: 'High & Flat ˉ (55)' },
                { id: 'm2', left: 'Tone 2 (má)', right: 'Rising upward ˊ (35)' },
                { id: 'm3', left: 'Tone 3 (mǎ)', right: 'Dipping then rising ˇ (214)' },
                { id: 'm4', left: 'Tone 4 (mà)', right: 'Sharp falling drop ˋ (51)' }
              ],
              explanation: 'Mastering the 4 tones prevents confusing "mother" (mā 妈) with "horse" (mǎ 马) or "scold" (mà 骂)!',
              xpReward: 10
            },
            {
              id: 'u1-l1-e4',
              type: 'listening',
              prompt: 'Listen to the audio. Which tone curve did you hear?',
              audioText: 'mǎ',
              targetText: 'mǎ (Tone 3)',
              translation: 'Tone 3: Dipping (mǎ - Horse)',
              options: [
                { id: 'opt-t3', text: 'mǎ (Tone 3 - Dipping)', translation: 'Tone 3' },
                { id: 'opt-t1', text: 'mā (Tone 1 - High Flat)', translation: 'Tone 1' },
                { id: 'opt-t4', text: 'mà (Tone 4 - Sharp Drop)', translation: 'Tone 4' }
              ],
              correctOptionId: 'opt-t3',
              explanation: 'Tone 3 dips down into your lower chest register before curling back up.',
              xpReward: 10
            }
          ]
        },
        {
          id: 'u1-l2',
          title: 'Mandarin Ground-Zero: Tone Sandhi & First Greeting',
          description: 'Learn how Tone 3 + Tone 3 transforms naturally when saying “Nǐ hǎo” (你好)!',
          order: 2,
          xpReward: 20,
          exercises: [
            {
              id: 'u1-l2-e1',
              type: 'multiple_choice',
              prompt: 'Tone Rule: When two 3rd tones meet (Nǐ + hǎo), the first tone naturally changes to:',
              targetText: '2nd Tone (Rising): Ní hǎo',
              audioText: '你好',
              translation: 'Nǐ hǎo -> pronounced Ní hǎo',
              options: [
                { id: 'c1', text: '2nd Tone (Rising: Ní hǎo)', translation: 'Tone Sandhi rule' },
                { id: 'c2', text: '4th Tone (Falling: Nì hǎo)', translation: 'Incorrect' },
                { id: 'c3', text: 'Flat Tone (Mā hǎo)', translation: 'Incorrect' }
              ],
              correctOptionId: 'c1',
              explanation: 'Tone Sandhi: Two consecutive 3rd tones are awkward to say, so native speakers always pronounce "nǐ hǎo" as "ní hǎo" (Tone 2 + Tone 3).',
              xpReward: 5
            },
            {
              id: 'u1-l2-e2',
              type: 'speaking',
              prompt: 'Speak your first authentic Mandarin greeting with proper tone flow:',
              targetText: '你好',
              audioText: '你好',
              phoneticHint: 'Nǐ hǎo (sounds like: Ní hǎo)',
              translation: 'Hello / Hi',
              explanation: 'Congratulations! You just mastered your first tone sandhi pair in native Mandarin.',
              xpReward: 15
            }
          ]
        }
      ];
    }

    if (languageName === 'French') {
      return [
        {
          id: 'u1-l1',
          title: 'French Ground-Zero: Ear Training & Nasal Vowels',
          description: 'Train your ear to recognize the signature French nasal vowels (on, an, in) and silent letters.',
          order: 1,
          xpReward: 15,
          exercises: [
            {
              id: 'u1-l1-e1',
              type: 'multiple_choice',
              prompt: 'Silent Letter Rule: In French, final consonants (s, t, d, x) are usually silent. In "Salut" (Hi), which letter is NOT pronounced?',
              targetText: 'The final letter "t"',
              audioText: 'Salut',
              translation: 'Salut is pronounced /sa.ly/',
              options: [
                { id: 'opt-t', text: 'The letter "t" is silent (/sa-ly/)', translation: 'Correct French phonetics' },
                { id: 'opt-s', text: 'The letter "s" is silent', translation: 'Incorrect' },
                { id: 'opt-all', text: 'All letters are pronounced', translation: 'Incorrect' }
              ],
              correctOptionId: 'opt-t',
              explanation: 'In French words like "Salut" and "Comment", final consonants are silent unless linked to a following vowel.',
              xpReward: 5
            },
            {
              id: 'u1-l1-e2',
              type: 'speaking',
              prompt: 'Pronounce "Salut" naturally without voicing the final "t":',
              targetText: 'Salut',
              audioText: 'Salut',
              phoneticHint: '/sa.ly/ (rhymes with "sea-view")',
              translation: 'Hi / Hey (Casual)',
              explanation: 'Great! You just unlocked the golden rule of French silent endings.',
              xpReward: 10
            },
            {
              id: 'u1-l1-e3',
              type: 'match_pairs',
              prompt: 'Match each French word with its silent consonant rule:',
              matchPairs: [
                { id: 'm1', left: 'Salut', right: 'Silent "t" at the end' },
                { id: 'm2', left: 'Vous', right: 'Silent "s" at the end' },
                { id: 'm3', left: 'Bonjour', right: 'Nasal "on" sound' },
                { id: 'm4', left: 'Merci', right: 'Crisp soft "ci" ending' }
              ],
              explanation: 'Recognizing silent endings makes reading French intuitive from day one.',
              xpReward: 10
            },
            {
              id: 'u1-l1-e4',
              type: 'sentence_order',
              prompt: 'Arrange the French greetings from informal to formal:',
              targetText: 'Salut Bonjour',
              correctOrder: ['Salut', 'Bonjour'],
              options: [{ id: 'w1', text: 'Salut' }, { id: 'w2', text: 'Bonjour' }, { id: 'w3', text: 'Au revoir' }],
              explanation: '"Salut" is used with peers; "Bonjour" is the universal polite daytime greeting.',
              xpReward: 10
            }
          ]
        },
        {
          id: 'u1-l2',
          title: 'French Ground-Zero: Nasal Vowels & "Bonjour"',
          description: 'Produce the resonant nasal sound "on" in "Bonjour" and polite gratitude.',
          order: 2,
          xpReward: 20,
          exercises: [
            {
              id: 'u1-l2-e1',
              type: 'listening',
              prompt: 'Listen to the native audio and identify the greeting:',
              audioText: 'Bonjour',
              targetText: 'Bonjour',
              translation: 'Good morning / Hello',
              options: [
                { id: 'o1', text: 'Bonjour', translation: 'Hello (Polite)' },
                { id: 'o2', text: 'Au revoir', translation: 'Goodbye' }
              ],
              correctOptionId: 'o1',
              explanation: '"Bonjour" blends the nasal "on" with the soft French "j".',
              xpReward: 5
            },
            {
              id: 'u1-l2-e2',
              type: 'speaking',
              prompt: 'Speak "Bonjour" with warm native French resonance:',
              targetText: 'Bonjour',
              audioText: 'Bonjour',
              phoneticHint: '/bɔ̃.ʒuʁ/',
              translation: 'Hello / Good morning',
              explanation: 'Magnifique! Your ear and voice are now attuned to French phonetics.',
              xpReward: 15
            }
          ]
        }
      ];
    }

    if (languageName === 'Spanish') {
      return [
        {
          id: 'u1-l1',
          title: 'Spanish Ground-Zero: Crisp Vowels & Silent "H"',
          description: 'Master the 5 pure Spanish vowels (A-E-I-O-U) and the silent "H" in “¡Hola!” without English vowel glides.',
          order: 1,
          xpReward: 15,
          exercises: [
            {
              id: 'u1-l1-e1',
              type: 'multiple_choice',
              prompt: 'Silent Letter Rule: In Spanish, the letter "H" is ALWAYS silent. How is "¡Hola!" (Hello) pronounced?',
              targetText: 'Pronounced /ˈo.la/ (Silent H)',
              audioText: 'Hola',
              translation: '¡Hola! sounds like "Oh-la"',
              options: [
                { id: 'h1', text: 'Pronounced "Oh-la" (Silent H)', translation: 'Correct Spanish phonetics' },
                { id: 'h2', text: 'Pronounced with an English "H" sound (Hoh-la)', translation: 'Incorrect' },
                { id: 'h3', text: 'Pronounced with a "W" sound (Woh-la)', translation: 'Incorrect' }
              ],
              correctOptionId: 'h1',
              explanation: 'In Spanish, "H" has no sound! "¡Hola!" is pronounced purely as /ˈo.la/.',
              xpReward: 5
            },
            {
              id: 'u1-l1-e2',
              type: 'speaking',
              prompt: 'Pronounce "¡Hola!" with a pure, crisp vowel and silent "H":',
              targetText: '¡Hola!',
              audioText: 'Hola',
              phoneticHint: '/ˈo.la/ (pure short O and A)',
              translation: 'Hello / Hi',
              explanation: '¡Excelente! You pronounced the silent H and pure vowels like a native speaker.',
              xpReward: 10
            },
            {
              id: 'u1-l1-e3',
              type: 'match_pairs',
              prompt: 'Match each Spanish greeting with its phonetic pronunciation:',
              matchPairs: [
                { id: 'm1', left: '¡Hola!', right: 'Oh-lah (Silent H)' },
                { id: 'm2', left: 'Buenos días', right: 'Bweh-nos dee-ahs' },
                { id: 'm3', left: 'Muchas gracias', right: 'Moo-chas grah-syahs' },
                { id: 'm4', left: 'Adiós', right: 'Ah-dyohs' }
              ],
              explanation: 'Spanish vowels never change their sound: A is always /a/, E is always /e/, I is always /i/.',
              xpReward: 10
            },
            {
              id: 'u1-l1-e4',
              type: 'sentence_order',
              prompt: 'Arrange the words to say: “Hello, thank you very much”',
              targetText: 'Hola muchas gracias',
              correctOrder: ['Hola', 'muchas', 'gracias'],
              options: [{ id: 'w1', text: 'Hola' }, { id: 'w2', text: 'muchas' }, { id: 'w3', text: 'gracias' }, { id: 'w4', text: 'adiós' }],
              explanation: 'Polite greetings establish instant warmth in Spanish culture.',
              xpReward: 10
            }
          ]
        },
        {
          id: 'u1-l2',
          title: 'Spanish Ground-Zero: The Melodic Rolled "R"',
          description: 'Train your tongue against the roof of your mouth for the tap R in “gracias” and rolled RR.',
          order: 2,
          xpReward: 20,
          exercises: [
            {
              id: 'u1-l2-e1',
              type: 'listening',
              prompt: 'Listen to the audio. Which polite phrase is being spoken?',
              audioText: 'Muchas gracias',
              targetText: 'Muchas gracias',
              translation: 'Thank you very much',
              options: [
                { id: 'o1', text: 'Muchas gracias', translation: 'Thank you very much' },
                { id: 'o2', text: 'Buenos días', translation: 'Good morning' }
              ],
              correctOptionId: 'o1',
              explanation: 'Notice the crisp tap "r" in "gracias".',
              xpReward: 5
            },
            {
              id: 'u1-l2-e2',
              type: 'speaking',
              prompt: 'Speak "Muchas gracias" with authentic Spanish rhythm:',
              targetText: 'Muchas gracias',
              audioText: 'Muchas gracias',
              phoneticHint: '/ˈmu.tʃas ˈɡɾa.sjas/',
              translation: 'Thank you very much',
              explanation: '¡Maravilloso! Your pronunciation is clear and confident.',
              xpReward: 15
            }
          ]
        }
      ];
    }

    if (languageName === 'German') {
      return [
        {
          id: 'u1-l1',
          title: 'German Ground-Zero: Vowel Clarity & The "CH" Sound',
          description: 'Master German vowel articulation, the soft /ç/ sound, and formal daytime greetings.',
          order: 1,
          xpReward: 15,
          exercises: [
            {
              id: 'u1-l1-e1',
              type: 'multiple_choice',
              prompt: 'In German, the "W" is pronounced like an English "V". How do you pronounce "Wie" (How)?',
              targetText: 'Pronounced like "Vee" (/viː/)',
              audioText: 'Wie geht es Ihnen?',
              translation: 'German W = English V sound',
              options: [
                { id: 'w1', text: 'Pronounced like "Vee" (/viː/)', translation: 'Correct German phonetics' },
                { id: 'w2', text: 'Pronounced like "Wee"', translation: 'Incorrect' },
                { id: 'w3', text: 'Pronounced like "Why"', translation: 'Incorrect' }
              ],
              correctOptionId: 'w1',
              explanation: 'In German, "W" always sounds like "V" (e.g. Volkswagen = Folks-vah-gen).',
              xpReward: 5
            },
            {
              id: 'u1-l1-e2',
              type: 'speaking',
              prompt: 'Pronounce "Guten Tag" with crisp German precision:',
              targetText: 'Guten Tag',
              audioText: 'Guten Tag',
              phoneticHint: '/ˈɡuːtn̩ taːk/',
              translation: 'Good day / Hello',
              explanation: 'Ausgezeichnet! You produced the exact German final "g" consonant sound.',
              xpReward: 10
            },
            {
              id: 'u1-l1-e3',
              type: 'match_pairs',
              prompt: 'Match each German expression with its phonetic rule:',
              matchPairs: [
                { id: 'm1', left: 'Guten Tag', right: 'Final "g" sounds like a soft "k"' },
                { id: 'm2', left: 'Vielen Dank', right: 'German "V" sounds like an "F"' },
                { id: 'm3', left: 'Bitte', right: 'Short crisp double "t"' },
                { id: 'm4', left: 'Tschüss', right: 'Umlaut ü with rounded lips' }
              ],
              explanation: 'German pronunciation is highly consistent once you know these core phonetic keys.',
              xpReward: 10
            }
          ]
        },
        {
          id: 'u1-l2',
          title: 'German Ground-Zero: Gratitude & Polite Etiquette',
          description: 'Master saying “Vielen Dank” (Thank you very much) and “Bitte” (Please / You are welcome).',
          order: 2,
          xpReward: 20,
          exercises: [
            {
              id: 'u1-l2-e1',
              type: 'listening',
              prompt: 'Listen to the audio. Which courteous phrase is spoken?',
              audioText: 'Vielen Dank',
              targetText: 'Vielen Dank',
              translation: 'Thank you very much',
              options: [
                { id: 'o1', text: 'Vielen Dank', translation: 'Thank you very much' },
                { id: 'o2', text: 'Auf Wiedersehen', translation: 'Goodbye' }
              ],
              correctOptionId: 'o1',
              explanation: '"Vielen Dank" expresses sincere appreciation in any setting.',
              xpReward: 5
            },
            {
              id: 'u1-l2-e2',
              type: 'speaking',
              prompt: 'Speak "Vielen Dank" clearly into your microphone:',
              targetText: 'Vielen Dank',
              audioText: 'Vielen Dank',
              phoneticHint: '/ˈfiːlən daŋk/ (remember V sounds like F)',
              translation: 'Thank you very much',
              explanation: 'Sehr gut! Your German articulation is authentic.',
              xpReward: 15
            }
          ]
        }
      ];
    }

    if (languageName === 'Japanese') {
      return [
        {
          id: 'u1-l1',
          title: 'Japanese Ground-Zero: The 5 Pure Vowels & Mora Rhythm',
          description: 'Learn the foundational 5 Japanese vowel sounds (A-I-U-E-O / あ-い-う-え-お) and steady mora beats.',
          order: 1,
          xpReward: 15,
          exercises: [
            {
              id: 'u1-l1-e1',
              type: 'multiple_choice',
              prompt: 'In Japanese, each syllable (mora) takes exactly the same length of time. In "Konnichiwa", how many beats are there?',
              targetText: '5 beats (Ko - n - ni - chi - wa)',
              audioText: 'こんにちは',
              translation: 'Konnichiwa has 5 equal mora beats',
              options: [
                { id: 'b1', text: '5 equal beats (Ko-n-ni-chi-wa)', translation: 'Correct Japanese mora rhythm' },
                { id: 'b2', text: '3 quick beats (Kon-ni-chiwa)', translation: 'Incorrect' },
                { id: 'b3', text: '2 beats (Kon-chiwa)', translation: 'Incorrect' }
              ],
              correctOptionId: 'b1',
              explanation: 'Japanese is a mora-timed language! Even the nasal "n" (ん) gets its own full beat.',
              xpReward: 5
            },
            {
              id: 'u1-l1-e2',
              type: 'speaking',
              prompt: 'Speak "Konnichiwa" with even, melodious rhythm:',
              targetText: 'こんにちは',
              audioText: 'こんにちは',
              phoneticHint: 'Kon-ni-chi-wa (steady 5 beats)',
              translation: 'Hello / Good afternoon',
              explanation: '素晴らしい (Subarashii)! You captured the native mora cadence.',
              xpReward: 10
            },
            {
              id: 'u1-l1-e3',
              type: 'match_pairs',
              prompt: 'Match each Japanese courtesy with its English meaning:',
              matchPairs: [
                { id: 'm1', left: 'こんにちは', right: 'Hello / Good day' },
                { id: 'm2', left: 'ありがとう', right: 'Thank you' },
                { id: 'm3', left: 'すみません', right: 'Excuse me / Sorry' },
                { id: 'm4', left: 'さようなら', right: 'Goodbye' }
              ],
              explanation: 'Polite words are the cornerstone of daily Japanese life.',
              xpReward: 10
            }
          ]
        },
        {
          id: 'u1-l2',
          title: 'Japanese Ground-Zero: Deep Gratitude & Respect',
          description: 'Master saying “Doumo arigatou gozaimasu” (どうもありがとうございます) with natural pitch accent.',
          order: 2,
          xpReward: 20,
          exercises: [
            {
              id: 'u1-l2-e1',
              type: 'listening',
              prompt: 'Listen to the audio. Which expression of gratitude is spoken?',
              audioText: 'どうもありがとうございます',
              targetText: 'どうもありがとうございます',
              translation: 'Thank you very much (Polite)',
              options: [
                { id: 'o1', text: 'どうもありがとうございます', translation: 'Thank you very much' },
                { id: 'o2', text: 'おやすみなさい', translation: 'Good night' }
              ],
              correctOptionId: 'o1',
              explanation: 'This phrase conveys deep, formal appreciation.',
              xpReward: 5
            },
            {
              id: 'u1-l2-e2',
              type: 'speaking',
              prompt: 'Speak "Arigatou gozaimasu" with sincere Japanese warmth:',
              targetText: 'ありがとうございます',
              audioText: 'ありがとうございます',
              phoneticHint: 'A-ri-ga-tou go-za-i-ma-su',
              translation: 'Thank you very much',
              explanation: '見事 (Migoto)! Perfectly articulated.',
              xpReward: 15
            }
          ]
        }
      ];
    }

    if (languageName === 'Italian') {
      return [
        {
          id: 'u1-l1',
          title: 'Italian Ground-Zero: Open Vowels & Double Consonants',
          description: 'Experience musical Italian open vowels, double consonant rhythm, and universal greetings.',
          order: 1,
          xpReward: 15,
          exercises: [
            {
              id: 'u1-l1-e1',
              type: 'multiple_choice',
              prompt: 'In Italian, double consonants (like "ll" in "mille") are held slightly longer. In "Ciao", the "ci" sounds like:',
              targetText: 'English "ch" as in "chocolate"',
              audioText: 'Ciao',
              translation: 'Ciao is pronounced /ˈtʃa.o/',
              options: [
                { id: 'c1', text: 'English "ch" as in "chocolate" (/ˈtʃa.o/)', translation: 'Correct Italian phonetics' },
                { id: 'c2', text: 'English "s" as in "see" (/ˈsa.o/)', translation: 'Incorrect' },
                { id: 'c3', text: 'English "k" as in "cat" (/ˈka.o/)', translation: 'Incorrect' }
              ],
              correctOptionId: 'c1',
              explanation: 'In Italian, "C" before "I" or "E" always makes the soft "ch" sound (/tʃ/).',
              xpReward: 5
            },
            {
              id: 'u1-l1-e2',
              type: 'speaking',
              prompt: 'Say "Ciao!" with joyful, open Italian cadence:',
              targetText: 'Ciao!',
              audioText: 'Ciao',
              phoneticHint: '/ˈtʃa.o/',
              translation: 'Hi / Bye (Friendly)',
              explanation: 'Bravissimo! Your Italian vowel resonance is spot-on.',
              xpReward: 10
            },
            {
              id: 'u1-l1-e3',
              type: 'match_pairs',
              prompt: 'Match each Italian expression with its phonetic rule:',
              matchPairs: [
                { id: 'm1', left: 'Ciao!', right: 'Soft "ch" sound (/tʃ/)' },
                { id: 'm2', left: 'Buongiorno', right: 'Soft "j" sound (/dʒ/)' },
                { id: 'm3', left: 'Grazie mille', right: 'Held double "ll" consonant' },
                { id: 'm4', left: 'Arrivederci', right: 'Rolled "rr" and polite farewell' }
              ],
              explanation: 'Italian is written almost exactly as it is pronounced!',
              xpReward: 10
            }
          ]
        },
        {
          id: 'u1-l2',
          title: 'Italian Ground-Zero: Daytime Greetings & "Grazie Mille"',
          description: 'Master daytime formality with “Buongiorno” and warm gratitude with “Grazie mille”.',
          order: 2,
          xpReward: 20,
          exercises: [
            {
              id: 'u1-l2-e1',
              type: 'listening',
              prompt: 'Listen to the audio. Which expression of gratitude is spoken?',
              audioText: 'Grazie mille',
              targetText: 'Grazie mille',
              translation: 'A thousand thanks / Thank you very much',
              options: [
                { id: 'o1', text: 'Grazie mille', translation: 'A thousand thanks' },
                { id: 'o2', text: 'Per favore', translation: 'Please' }
              ],
              correctOptionId: 'o1',
              explanation: '"Grazie mille" is universally loved across Italy.',
              xpReward: 5
            },
            {
              id: 'u1-l2-e2',
              type: 'speaking',
              prompt: 'Speak "Buongiorno" with warm melodic Italian flair:',
              targetText: 'Buongiorno',
              audioText: 'Buongiorno',
              phoneticHint: '/bwonˈdʒor.no/',
              translation: 'Good morning / Good day',
              explanation: 'Ottimo lavoro! True Italian cadence unlocked.',
              xpReward: 15
            }
          ]
        }
      ];
    }
  }

  // For all other units across the 800-unit curriculum:
  // Dynamically synthesized by the Fluentra AI curriculum generator!
  const pool = pack.levelSentences[meta.levelNumber] || pack.levelSentences[1] || [
    { target: pack.greetingFormal.target, trans: pack.greetingFormal.trans, explanation: pack.greetingFormal.exp, options: [pack.greetingFormal.target, pack.goodbye.target] }
  ];
  const item1 = pool[(meta.number - 1) % pool.length] || pool[0];
  const item2 = pool[meta.number % pool.length] || pool[0];

  return [
    {
      id: `${unitId}-l1`,
      title: `${meta.title} — AI Core Studio`,
      description: `Dynamically synthesized for ${pack.name} · Level ${meta.levelNumber} · Goal: ${learningGoal.toUpperCase()}`,
      order: 1,
      xpReward: 15,
      exercises: [
        {
          id: `${unitId}-l1-e1`,
          type: 'multiple_choice',
          prompt: `Select the natural ${pack.name} expression for "${meta.title}":`,
          targetText: item1.target,
          audioText: item1.target,
          translation: item1.trans,
          options: [
            { id: 'opt-a', text: item1.target, translation: item1.trans },
            { id: 'opt-b', text: pack.greetingFormal.target, translation: pack.greetingFormal.trans },
            { id: 'opt-c', text: pack.goodbye.target, translation: pack.goodbye.trans }
          ],
          correctOptionId: 'opt-a',
          explanation: item1.explanation,
          xpReward: 5
        },
        {
          id: `${unitId}-l1-e2`,
          type: 'speaking',
          prompt: `Pronounce this key ${pack.name} expression into your microphone:`,
          targetText: item1.target,
          audioText: item1.target,
          translation: item1.trans,
          explanation: 'Speak at a steady cadence and focus on sound clarity.',
          xpReward: 10
        }
      ]
    },
    {
      id: `${unitId}-l2`,
      title: `${meta.title} — Conversational Reflexes`,
      description: `Apply ${meta.title} into active context through listening and voice practice in ${pack.name}.`,
      order: 2,
      xpReward: 20,
      exercises: [
        {
          id: `${unitId}-l2-e1`,
          type: 'listening',
          prompt: `Listen to the native ${pack.name} pronunciation and choose the matching phrase:`,
          targetText: item2.target,
          audioText: item2.target,
          translation: item2.trans,
          options: [
            { id: 'la', text: item2.target, translation: item2.trans },
            { id: 'lb', text: pack.thankYou.target, translation: pack.thankYou.trans }
          ],
          correctOptionId: 'la',
          explanation: item2.explanation,
          xpReward: 10
        },
        {
          id: `${unitId}-l2-e2`,
          type: 'speaking',
          prompt: `Repeat the full sentence with natural expression in ${pack.name}:`,
          targetText: item2.target,
          audioText: item2.target,
          translation: item2.trans,
          explanation: 'Focus on rhythm and intonation.',
          xpReward: 10
        }
      ]
    }
  ];
}
