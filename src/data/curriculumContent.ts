import { Lesson, Exercise, LearningTarget, UnitMetadata } from '../types/curriculum';
import { CURRICULUM_DATA } from './curriculumRegistry';
import { aiCurriculumGenerator } from '../services/aiCurriculumGenerator';
import { UNIT_JOURNEYS, buildUnitLessonFromJourney } from './unitJourneys';
import { getLanguageOption } from './languages';

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

interface TopicSentenceItem {
  target: string;
  trans: string;
  explanation: string;
}

export function getTopicSpecificCurriculumItems(
  meta: { title: string; category?: string; number: number; levelNumber: number },
  canonicalName: string
): { item1: TopicSentenceItem; item2: TopicSentenceItem } {
  const pack = LANGUAGE_PACKS[canonicalName] || LANGUAGE_PACKS.French;
  const title = (meta?.title || '').toLowerCase();
  const category = (meta?.category || '').toLowerCase();
  const combined = `${title} ${category}`;

  // 1. Saying / Asking Names & Introductions
  if (combined.includes('name') || combined.includes('prénom') || combined.includes('称呼') || combined.includes('llam') || combined.includes('heiß')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          item1: { target: '我叫李明，很高兴认识你', trans: 'My name is Li Ming, pleased to meet you', explanation: 'Essential introduction phrase stating your name in Chinese.' },
          item2: { target: '请问你叫什么名字？', trans: 'May I ask, what is your name?', explanation: 'Polite way to inquire about someone’s name.' }
        };
      case 'Spanish':
        return {
          item1: { target: 'Me llamo Carlos, mucho gusto', trans: 'My name is Carlos, pleased to meet you', explanation: 'Standard way to state your name in Spanish.' },
          item2: { target: '¿Cómo te llamas tú?', trans: 'What is your name?', explanation: 'Friendly everyday question asking for someone’s name.' }
        };
      case 'German':
        return {
          item1: { target: 'Ich heiße Anna, sehr angenehm', trans: 'My name is Anna, very pleased to meet you', explanation: 'Formal and friendly German name introduction.' },
          item2: { target: 'Wie heißen Sie bitte?', trans: 'What is your name please? (Formal)', explanation: 'Courteous question to ask a name in German.' }
        };
      case 'Japanese':
        return {
          item1: { target: '私の名前は田中です、どうぞよろしく', trans: 'My name is Tanaka, pleased to meet you', explanation: 'Standard Japanese self-introduction.' },
          item2: { target: 'お名前は何とおっしゃいますか？', trans: 'What is your name please? (Polite)', explanation: 'Polite Japanese inquiry for a person’s name.' }
        };
      case 'Italian':
        return {
          item1: { target: 'Mi chiamo Marco, molto piacere', trans: 'My name is Marco, very pleased to meet you', explanation: 'Everyday Italian self-introduction.' },
          item2: { target: 'Come ti chiami?', trans: 'What is your name?', explanation: 'Common friendly question to ask a name in Italian.' }
        };
      case 'French':
      default:
        return {
          item1: { target: 'Je m’appelle Thomas, enchanté', trans: 'My name is Thomas, delighted to meet you', explanation: 'Universal French phrase for stating your name.' },
          item2: { target: 'Comment vous appelez-vous ?', trans: 'What is your name? (Polite)', explanation: 'Standard polite question to ask someone’s name in French.' }
        };
    }
  }

  // 2. Where Are You From? / Origin & Hometown
  if (combined.includes('where') || combined.includes('from') || combined.includes('origin') || combined.includes('d’où') || combined.includes('dónde') || combined.includes('来自')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          item1: { target: '我来自北京，你呢？', trans: 'I come from Beijing, and you?', explanation: 'Stating your hometown in Chinese.' },
          item2: { target: '请问你来自哪个城市？', trans: 'Which city do you come from?', explanation: 'Asking where someone is from.' }
        };
      case 'Spanish':
        return {
          item1: { target: 'Soy de Madrid, España', trans: 'I am from Madrid, Spain', explanation: 'Expressing your country of origin in Spanish.' },
          item2: { target: '¿De dónde eres tú?', trans: 'Where are you from?', explanation: 'Asking someone where they are from in Spanish.' }
        };
      case 'German':
        return {
          item1: { target: 'Ich komme aus Berlin', trans: 'I come from Berlin', explanation: 'Stating origin with "aus" in German.' },
          item2: { target: 'Woher kommen Sie?', trans: 'Where do you come from? (Formal)', explanation: 'Polite German inquiry for origin.' }
        };
      case 'Japanese':
        return {
          item1: { target: '東京から来ました', trans: 'I come from Tokyo', explanation: 'Expressing hometown origin in Japanese.' },
          item2: { target: 'ご出身はどちらですか？', trans: 'Where are you from? (Polite)', explanation: 'Respectful way to ask where someone is from.' }
        };
      case 'Italian':
        return {
          item1: { target: 'Vengo da Roma, Italia', trans: 'I come from Rome, Italy', explanation: 'Stating origin with "venire da" in Italian.' },
          item2: { target: 'Di dove sei?', trans: 'Where are you from?', explanation: 'Common friendly inquiry about origin.' }
        };
      case 'French':
      default:
        return {
          item1: { target: 'Je viens de Paris, en France', trans: 'I come from Paris, in France', explanation: 'Stating your origin with "venir de".' },
          item2: { target: 'D’où venez-vous s’il vous plaît ?', trans: 'Where do you come from please?', explanation: 'Polite inquiry about someone’s hometown.' }
        };
    }
  }

  // 3. Goodbyes & Parting Words
  if (combined.includes('goodbye') || combined.includes('parting') || combined.includes('farewell') || combined.includes('revoir') || combined.includes('adiós') || combined.includes('tschüss') || combined.includes('再见')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          item1: { target: '再见，明天见！', trans: 'Goodbye, see you tomorrow!', explanation: 'Standard Chinese parting phrase.' },
          item2: { target: '祝你今天过得愉快！', trans: 'Have a wonderful day!', explanation: 'Polite daytime well-wish.' }
        };
      case 'Spanish':
        return {
          item1: { target: '¡Adiós, hasta mañana!', trans: 'Goodbye, see you tomorrow!', explanation: 'Everyday parting phrase in Spanish.' },
          item2: { target: '¡Que tengas un buen día!', trans: 'Have a nice day!', explanation: 'Friendly wish when parting.' }
        };
      case 'German':
        return {
          item1: { target: 'Auf Wiedersehen und bis morgen!', trans: 'Goodbye and see you tomorrow!', explanation: 'Formal German parting phrase.' },
          item2: { target: 'Schönen Tag noch!', trans: 'Have a nice day!', explanation: 'Common friendly farewell wish.' }
        };
      case 'Japanese':
        return {
          item1: { target: 'さようなら、また明日！', trans: 'Goodbye, see you tomorrow!', explanation: 'Polite parting phrase in Japanese.' },
          item2: { target: '良い一日を！', trans: 'Have a nice day!', explanation: 'Friendly farewell expression.' }
        };
      case 'Italian':
        return {
          item1: { target: 'Arrivederci e a presto!', trans: 'Goodbye and see you soon!', explanation: 'Standard polite Italian farewell.' },
          item2: { target: 'Buona giornata a tutti!', trans: 'Have a good day everyone!', explanation: 'Warm Italian daytime wish.' }
        };
      case 'French':
      default:
        return {
          item1: { target: 'Au revoir et à demain !', trans: 'Goodbye and see you tomorrow!', explanation: 'Standard polite French parting phrase.' },
          item2: { target: 'Bonne journée à vous !', trans: 'Have a good day!', explanation: 'Everyday daytime wish.' }
        };
    }
  }

  // 4. Polite Expressions & Sincere Gratitude
  if (combined.includes('polite') || combined.includes('gratitude') || combined.includes('merci') || combined.includes('gracias') || combined.includes('danke') || combined.includes('谢谢')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          item1: { target: '非常感谢你的热心帮助', trans: 'Thank you very much for your kind help', explanation: 'Expressing deep gratitude in Chinese.' },
          item2: { target: '不用客气，这是我应该做的', trans: 'You are welcome, happy to help', explanation: 'Polite reply to thanks.' }
        };
      case 'Spanish':
        return {
          item1: { target: 'Muchísimas gracias por su ayuda', trans: 'Thank you so much for your help', explanation: 'Heartfelt gratitude in Spanish.' },
          item2: { target: 'De nada, con mucho gusto', trans: 'You are welcome, with pleasure', explanation: 'Natural polite reply.' }
        };
      case 'German':
        return {
          item1: { target: 'Herzlichen Dank für Ihre Hilfe', trans: 'Heartfelt thanks for your help', explanation: 'Polite German expression of gratitude.' },
          item2: { target: 'Bitte sehr, keine Ursache', trans: 'You are welcome, not at all', explanation: 'Standard courteous reply.' }
        };
      case 'Japanese':
        return {
          item1: { target: 'ご親切にありがとうございます', trans: 'Thank you very much for your kindness', explanation: 'Deep gratitude in Japanese.' },
          item2: { target: 'どういたしまして', trans: 'You are welcome', explanation: 'Standard reply to gratitude.' }
        };
      case 'Italian':
        return {
          item1: { target: 'Grazie di cuore per il vostro aiuto', trans: 'Heartfelt thanks for your help', explanation: 'Warm Italian gratitude.' },
          item2: { target: 'Prego, non c’è di che', trans: 'You are welcome, not at all', explanation: 'Polite Italian reply.' }
        };
      case 'French':
      default:
        return {
          item1: { target: 'Merci infiniment pour votre aide', trans: 'Thank you so much for your help', explanation: 'Sincere polite gratitude in French.' },
          item2: { target: 'Je vous en prie, avec plaisir', trans: 'You are very welcome, with pleasure', explanation: 'Formal and warm response to thanks.' }
        };
    }
  }

  // 5. Numbers, Counting, Age & Phone Numbers
  if (combined.includes('number') || combined.includes('count') || combined.includes('age') || combined.includes('phone') || combined.includes('quantit')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          item1: { target: '我今年二十五岁', trans: 'I am 25 years old', explanation: 'Stating your age in Chinese.' },
          item2: { target: '我的电话号码是八八六六', trans: 'My phone number is 8866', explanation: 'Sharing phone digits in Chinese.' }
        };
      case 'Spanish':
        return {
          item1: { target: 'Tengo veinticinco años', trans: 'I am 25 years old', explanation: 'Expressing age using "tener" in Spanish.' },
          item2: { target: 'Mi número de teléfono es cinco cinco', trans: 'My phone number is 55...', explanation: 'Sharing phone numbers in Spanish.' }
        };
      case 'German':
        return {
          item1: { target: 'Ich bin fünfundzwanzig Jahre alt', trans: 'I am 25 years old', explanation: 'Stating age using "sein" in German.' },
          item2: { target: 'Meine Telefonnummer ist null eins', trans: 'My phone number is 01...', explanation: 'Exchanging phone numbers in German.' }
        };
      case 'Japanese':
        return {
          item1: { target: '私は二十五歳です', trans: 'I am 25 years old', explanation: 'Stating age in Japanese.' },
          item2: { target: '電話番号はゼロ八ゼロです', trans: 'The phone number is 080...', explanation: 'Sharing telephone numbers in Japanese.' }
        };
      case 'Italian':
        return {
          item1: { target: 'Ho venticinque anni', trans: 'I am 25 years old', explanation: 'Stating age using "avere" in Italian.' },
          item2: { target: 'Il mio numero di telefono è tre quattro', trans: 'My phone number is 34...', explanation: 'Sharing contact numbers in Italian.' }
        };
      case 'French':
      default:
        return {
          item1: { target: 'J’ai vingt-cinq ans', trans: 'I am 25 years old', explanation: 'Stating your age with "avoir" in French.' },
          item2: { target: 'Mon numéro de téléphone est le zéro six', trans: 'My phone number is 06...', explanation: 'Exchanging phone numbers in French.' }
        };
    }
  }

  // 6. Calendar, Time, Days of the Week & Appointments
  if (combined.includes('day') || combined.includes('week') || combined.includes('month') || combined.includes('time') || combined.includes('hour') || combined.includes('calendar')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          item1: { target: '今天星期一，天气非常好', trans: 'Today is Monday, weather is very good', explanation: 'Days of the week in Chinese.' },
          item2: { target: '我们星期五下午见', trans: 'We will meet on Friday afternoon', explanation: 'Scheduling meetings in Chinese.' }
        };
      case 'Spanish':
        return {
          item1: { target: 'Hoy es lunes por la mañana', trans: 'Today is Monday morning', explanation: 'Days of the week in Spanish.' },
          item2: { target: 'Nos vemos el viernes por la tarde', trans: 'See you on Friday afternoon', explanation: 'Scheduling an appointment in Spanish.' }
        };
      case 'German':
        return {
          item1: { target: 'Heute ist Montagmorgen', trans: 'Today is Monday morning', explanation: 'Days of the week in German.' },
          item2: { target: 'Wir sehen uns am Freitagnachmittag', trans: 'See you on Friday afternoon', explanation: 'Setting a time in German.' }
        };
      case 'Japanese':
        return {
          item1: { target: '今日は月曜日の朝です', trans: 'Today is Monday morning', explanation: 'Days of the week in Japanese.' },
          item2: { target: '金曜日の午後にお会いしましょう', trans: 'Let’s meet on Friday afternoon', explanation: 'Scheduling in Japanese.' }
        };
      case 'Italian':
        return {
          item1: { target: 'Oggi è lunedì mattina', trans: 'Today is Monday morning', explanation: 'Days of the week in Italian.' },
          item2: { target: 'Ci vediamo venerdì pomeriggio', trans: 'See you Friday afternoon', explanation: 'Setting an appointment in Italian.' }
        };
      case 'French':
      default:
        return {
          item1: { target: 'Aujourd’hui c’est lundi matin', trans: 'Today is Monday morning', explanation: 'Days of the week in French.' },
          item2: { target: 'On se voit vendredi après-midi', trans: 'See you on Friday afternoon', explanation: 'Arranging meetings in French.' }
        };
    }
  }

  // 7. Food, Drinks, Café, Bakery & Ordering
  if (combined.includes('food') || combined.includes('café') || combined.includes('coffee') || combined.includes('drink') || combined.includes('order') || combined.includes('restaurant')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          item1: { target: '请给我一杯热咖啡和点心', trans: 'Please give me a hot coffee and snack', explanation: 'Ordering at a café in Chinese.' },
          item2: { target: '服务员，请问可以买单吗？', trans: 'Waiter, may I have the check please?', explanation: 'Asking for the bill politely.' }
        };
      case 'Spanish':
        return {
          item1: { target: 'Quisiera un café con leche y un cruasán', trans: 'I would like a coffee with milk and a croissant', explanation: 'Ordering breakfast in Spanish.' },
          item2: { target: 'La cuenta por favor señor', trans: 'The check please sir', explanation: 'Asking for the bill in Spanish.' }
        };
      case 'German':
        return {
          item1: { target: 'Ich möchte einen Kaffee und ein Croissant', trans: 'I would like a coffee and a croissant', explanation: 'Ordering food in German.' },
          item2: { target: 'Die Rechnung bitte', trans: 'The bill please', explanation: 'Requesting the check in German.' }
        };
      case 'Japanese':
        return {
          item1: { target: 'コーヒーとパンをお願いします', trans: 'A coffee and bread please', explanation: 'Ordering in a Japanese café.' },
          item2: { target: 'お会計をお願いします', trans: 'The check please', explanation: 'Asking for the bill in Japanese.' }
        };
      case 'Italian':
        return {
          item1: { target: 'Vorrei un caffè espresso e un cornetto', trans: 'I would like an espresso and a croissant', explanation: 'Classic Italian breakfast order.' },
          item2: { target: 'Il conto per favore', trans: 'The bill please', explanation: 'Asking for the check in Italian.' }
        };
      case 'French':
      default:
        return {
          item1: { target: 'Je voudrais un café et un croissant', trans: 'I would like a coffee and a croissant', explanation: 'Classic French café order.' },
          item2: { target: 'L’addition s’il vous plaît', trans: 'The check please', explanation: 'Polite way to request the bill in French.' }
        };
    }
  }

  // 8. Travel, Directions, Train Station & Street Navigation
  if (combined.includes('direction') || combined.includes('station') || combined.includes('hotel') || combined.includes('travel') || combined.includes('where is')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return {
          item1: { target: '请问火车站怎么走？', trans: 'Excuse me, how do I get to the train station?', explanation: 'Asking for directions in Chinese.' },
          item2: { target: '请一直往前走，然后右转', trans: 'Go straight ahead, then turn right', explanation: 'Direction instructions in Chinese.' }
        };
      case 'Spanish':
        return {
          item1: { target: 'Disculpe, ¿dónde está la estación?', trans: 'Excuse me, where is the station?', explanation: 'Asking directions in Spanish.' },
          item2: { target: 'Siga todo recto y gire a la derecha', trans: 'Go straight ahead and turn right', explanation: 'Giving directions in Spanish.' }
        };
      case 'German':
        return {
          item1: { target: 'Entschuldigung, wo ist der Bahnhof?', trans: 'Excuse me, where is the train station?', explanation: 'Asking for directions in German.' },
          item2: { target: 'Gehen Sie geradeaus und dann rechts', trans: 'Go straight ahead and then right', explanation: 'Giving street directions in German.' }
        };
      case 'Japanese':
        return {
          item1: { target: 'すみません、駅はどこですか？', trans: 'Excuse me, where is the station?', explanation: 'Asking for directions in Japanese.' },
          item2: { target: 'まっすぐ行って右に曲がってください', trans: 'Go straight and turn right please', explanation: 'Direction guidance in Japanese.' }
        };
      case 'Italian':
        return {
          item1: { target: 'Scusi, dov’è la stazione ferroviaria?', trans: 'Excuse me, where is the train station?', explanation: 'Asking directions in Italian.' },
          item2: { target: 'Vada dritto e poi giri a destra', trans: 'Go straight and then turn right', explanation: 'Giving directions in Italian.' }
        };
      case 'French':
      default:
        return {
          item1: { target: 'Pardon, où se trouve la gare ?', trans: 'Excuse me, where is the train station located?', explanation: 'Asking for navigation directions in French.' },
          item2: { target: 'Allez tout droit puis tournez à droite', trans: 'Go straight ahead then turn right', explanation: 'Standard French direction phrase.' }
        };
    }
  }

  // 9. Default Fallback using level-appropriate phrases
  const pool = pack.levelSentences[meta.levelNumber] || pack.levelSentences[1] || [
    { target: pack.greetingFormal.target, trans: pack.greetingFormal.trans, explanation: pack.greetingFormal.exp }
  ];
  const item1 = pool[(meta.number - 1) % pool.length] || pool[0];
  const item2 = pool[meta.number % pool.length] || pool[0];
  return { item1, item2 };
}

/**
 * Returns 3-4 topic-specific core words as mental building blocks before sentence formation
 */
export function getTopicTargetWords(meta: UnitMetadata, canonicalName: string): LearningTarget[] {
  if (meta?.learningTargets && meta.learningTargets.length > 0) {
    return meta.learningTargets;
  }

  const title = (meta?.title || '').toLowerCase();
  const cat = (meta?.category || '').toLowerCase();
  const sub = (meta?.subtitle || '').toLowerCase();
  const combined = `${title} ${cat} ${sub}`;

  // 1. Phonics & Alphabet
  if (combined.includes('sound') || combined.includes('tone') || combined.includes('vowel') || combined.includes('letter') || combined.includes('alphab') || combined.includes('phoni')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return [
          { id: 'tw-1', term: 'mā', translation: 'Tone 1: High & Flat (Mother)', phonetic: 'mā ˉ', audioText: 'mā', exampleUsage: 'mā (妈)', exampleTranslation: 'Mother' },
          { id: 'tw-2', term: 'má', translation: 'Tone 2: Rising (Hemp)', phonetic: 'má ˊ', audioText: 'má', exampleUsage: 'má (麻)', exampleTranslation: 'Hemp' },
          { id: 'tw-3', term: 'mǎ', translation: 'Tone 3: Dipping (Horse)', phonetic: 'mǎ ˇ', audioText: 'mǎ', exampleUsage: 'mǎ (马)', exampleTranslation: 'Horse' },
          { id: 'tw-4', term: 'mà', translation: 'Tone 4: Falling (Scold)', phonetic: 'mà ˋ', audioText: 'mà', exampleUsage: 'mà (骂)', exampleTranslation: 'To scold' }
        ];
      case 'Spanish':
        return [
          { id: 'tw-1', term: '¡Hola!', translation: 'Hello / Hi (Silent H)', phonetic: '/ˈo.la/', audioText: 'Hola', exampleUsage: '¡Hola, amigo!', exampleTranslation: 'Hello, friend!' },
          { id: 'tw-2', term: 'Buenos días', translation: 'Good morning', phonetic: '/ˈbwe.noz ˈði.as/', audioText: 'Buenos días', exampleUsage: 'Buenos días a todos.', exampleTranslation: 'Good morning to everyone.' },
          { id: 'tw-3', term: 'Gracias', translation: 'Thank you (Tap R)', phonetic: '/ˈɡɾa.sjas/', audioText: 'Gracias', exampleUsage: 'Muchas gracias.', exampleTranslation: 'Thank you very much.' }
        ];
      case 'German':
        return [
          { id: 'tw-1', term: 'Hallo', translation: 'Hello / Hi', phonetic: '/ˈha.loː/', audioText: 'Hallo', exampleUsage: 'Hallo, wie geht’s?', exampleTranslation: 'Hello, how are you?' },
          { id: 'tw-2', term: 'Guten Tag', translation: 'Good day / Hello', phonetic: '/ˌɡuːtn̩ ˈtaːk/', audioText: 'Guten Tag', exampleUsage: 'Guten Tag, mein Herr.', exampleTranslation: 'Good day, sir.' },
          { id: 'tw-3', term: 'Danke', translation: 'Thank you', phonetic: '/ˈdaŋ.kə/', audioText: 'Danke', exampleUsage: 'Danke schön.', exampleTranslation: 'Thank you kindly.' }
        ];
      case 'Japanese':
        return [
          { id: 'tw-1', term: 'こんにちは', translation: 'Hello / Good day', phonetic: 'Konnichiwa', audioText: 'こんにちは', exampleUsage: 'こんにちは。', exampleTranslation: 'Hello.' },
          { id: 'tw-2', term: 'ありがとう', translation: 'Thank you', phonetic: 'Arigatou', audioText: 'ありがとう', exampleUsage: 'どうもありがとう。', exampleTranslation: 'Thank you very much.' },
          { id: 'tw-3', term: 'すみません', translation: 'Excuse me / Sorry', phonetic: 'Sumimasen', audioText: 'すみません。', exampleTranslation: 'Excuse me.' }
        ];
      case 'Italian':
        return [
          { id: 'tw-1', term: 'Ciao', translation: 'Hi / Bye (Casual)', phonetic: '/ˈtʃa.o/', audioText: 'Ciao', exampleUsage: 'Ciao a tutti!', exampleTranslation: 'Hi everyone!' },
          { id: 'tw-2', term: 'Buongiorno', translation: 'Good morning', phonetic: '/bwonˈdʒor.no/', audioText: 'Buongiorno', exampleUsage: 'Buongiorno signora.', exampleTranslation: 'Good morning ma’am.' },
          { id: 'tw-3', term: 'Grazie', translation: 'Thank you', phonetic: '/ˈɡrat.tsje/', audioText: 'Grazie', exampleUsage: 'Mille grazie.', exampleTranslation: 'A thousand thanks.' }
        ];
      case 'French':
      default:
        return [
          { id: 'tw-1', term: 'Bonjour', translation: 'Hello / Good morning', phonetic: '/bɔ̃.ʒuʁ/', audioText: 'Bonjour', exampleUsage: 'Bonjour, comment allez-vous ?', exampleTranslation: 'Good morning, how are you?' },
          { id: 'tw-2', term: 'Salut', translation: 'Hi / Bye (Silent T)', phonetic: '/sa.ly/', audioText: 'Salut', exampleUsage: 'Salut tout le monde !', exampleTranslation: 'Hi everyone!' },
          { id: 'tw-3', term: 'Merci', translation: 'Thank you', phonetic: '/mɛʁ.si/', audioText: 'Merci', exampleUsage: 'Merci beaucoup !', exampleTranslation: 'Thank you very much!' }
        ];
    }
  }

  // 2. Greetings, Introductions & Names
  if (combined.includes('greet') || combined.includes('name') || combined.includes('meet') || combined.includes('intro') || combined.includes('hello')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return [
          { id: 'tw-1', term: '你好', translation: 'Hello', phonetic: 'Nǐ hǎo', audioText: '你好', exampleUsage: '你好，朋友！', exampleTranslation: 'Hello friend!' },
          { id: 'tw-2', term: '我叫', translation: 'My name is / I am called', phonetic: 'Wǒ jiào', audioText: '我叫', exampleUsage: '我叫大卫。', exampleTranslation: 'My name is David.' },
          { id: 'tw-3', term: '很高兴', translation: 'Very glad / Pleased', phonetic: 'Hěn gāoxìng', audioText: '很高兴', exampleUsage: '很高兴认识你！', exampleTranslation: 'Nice to meet you!' }
        ];
      case 'Spanish':
        return [
          { id: 'tw-1', term: '¡Hola!', translation: 'Hello', phonetic: '/ˈo.la/', audioText: 'Hola', exampleUsage: '¡Hola a todos!', exampleTranslation: 'Hello to all!' },
          { id: 'tw-2', term: 'Me llamo', translation: 'My name is', phonetic: '/me ˈʝa.mo/', audioText: 'Me llamo', exampleUsage: 'Me llamo Carlos.', exampleTranslation: 'My name is Carlos.' },
          { id: 'tw-3', term: 'Mucho gusto', translation: 'Pleased to meet you', phonetic: '/ˈmu.tʃo ˈɣus.to/', audioText: 'Mucho gusto', exampleUsage: 'Mucho gusto en conocerte.', exampleTranslation: 'Nice to meet you.' }
        ];
      case 'German':
        return [
          { id: 'tw-1', term: 'Hallo', translation: 'Hello', phonetic: '/ˈha.loː/', audioText: 'Hallo', exampleUsage: 'Hallo zusammen!', exampleTranslation: 'Hello everyone!' },
          { id: 'tw-2', term: 'Ich heiße', translation: 'My name is', phonetic: '/ɪç ˈhaɪ̯.sə/', audioText: 'Ich heiße', exampleUsage: 'Ich heiße Anna.', exampleTranslation: 'My name is Anna.' },
          { id: 'tw-3', term: 'Freut mich', translation: 'Pleased to meet you', phonetic: '/fʁɔɪ̯t mɪç/', audioText: 'Freut mich', exampleUsage: 'Freut mich sehr.', exampleTranslation: 'Very pleased to meet you.' }
        ];
      case 'Japanese':
        return [
          { id: 'tw-1', term: 'はじめまして', translation: 'Nice to meet you (First time)', phonetic: 'Hajimemashite', audioText: 'はじめまして', exampleUsage: 'はじめまして、田中です。', exampleTranslation: 'Nice to meet you, I am Tanaka.' },
          { id: 'tw-2', term: '名前', translation: 'Name', phonetic: 'Namae', audioText: '名前', exampleUsage: 'お名前は何ですか？', exampleTranslation: 'What is your name?' },
          { id: 'tw-3', term: 'よろしく', translation: 'Please treat me well / Regards', phonetic: 'Yoroshiku', audioText: 'よろしく', exampleUsage: 'よろしくお願いします。', exampleTranslation: 'Pleased to meet you.' }
        ];
      case 'Italian':
        return [
          { id: 'tw-1', term: 'Piacere', translation: 'Pleasure / Nice to meet you', phonetic: '/pjaˈtʃe.re/', audioText: 'Piacere', exampleUsage: 'Piacere di conoscerti!', exampleTranslation: 'Nice to meet you!' },
          { id: 'tw-2', term: 'Mi chiamo', translation: 'My name is', phonetic: '/mi ˈkja.mo/', audioText: 'Mi chiamo', exampleUsage: 'Mi chiamo Marco.', exampleTranslation: 'My name is Marco.' },
          { id: 'tw-3', term: 'Buongiorno', translation: 'Good day / Hello', phonetic: '/bwonˈdʒor.no/', audioText: 'Buongiorno', exampleUsage: 'Buongiorno signore.', exampleTranslation: 'Good day sir.' }
        ];
      case 'French':
      default:
        return [
          { id: 'tw-1', term: 'Je m’appelle', translation: 'My name is', phonetic: '/ʒə ma.pɛl/', audioText: 'Je m’appelle', exampleUsage: 'Je m’appelle Thomas.', exampleTranslation: 'My name is Thomas.' },
          { id: 'tw-2', term: 'Enchanté', translation: 'Delighted / Nice to meet you', phonetic: '/ɑ̃.ʃɑ̃.te/', audioText: 'Enchanté', exampleUsage: 'Enchanté de faire votre connaissance.', exampleTranslation: 'Delighted to make your acquaintance.' },
          { id: 'tw-3', term: 'Comment', translation: 'How', phonetic: '/kɔ.mɑ̃/', audioText: 'Comment', exampleUsage: 'Comment vous appelez-vous ?', exampleTranslation: 'What is your name?' }
        ];
    }
  }

  // 3. Origins, Countries & Where you are from
  if (combined.includes('from') || combined.includes('origin') || combined.includes('country') || combined.includes('where') || combined.includes('city') || combined.includes('national')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return [
          { id: 'tw-1', term: '来自', translation: 'Come from', phonetic: 'Láizì', audioText: '来自', exampleUsage: '我来自中国。', exampleTranslation: 'I come from China.' },
          { id: 'tw-2', term: '哪里', translation: 'Where', phonetic: 'Nǎlǐ', audioText: '哪里', exampleUsage: '你来自哪里？', exampleTranslation: 'Where do you come from?' },
          { id: 'tw-3', term: '国家', translation: 'Country / Nation', phonetic: 'Guójiā', audioText: '国家', exampleUsage: '美丽的国家。', exampleTranslation: 'Beautiful country.' }
        ];
      case 'Spanish':
        return [
          { id: 'tw-1', term: 'Soy de', translation: 'I am from', phonetic: '/soj de/', audioText: 'Soy de', exampleUsage: 'Soy de Madrid.', exampleTranslation: 'I am from Madrid.' },
          { id: 'tw-2', term: '¿De dónde?', translation: 'From where?', phonetic: '/de ˈðon.de/', audioText: 'De dónde', exampleUsage: '¿De dónde eres tú?', exampleTranslation: 'Where are you from?' },
          { id: 'tw-3', term: 'País', translation: 'Country', phonetic: '/paˈis/', audioText: 'País', exampleUsage: 'Un país hermoso.', exampleTranslation: 'A beautiful country.' }
        ];
      case 'German':
        return [
          { id: 'tw-1', term: 'Ich komme aus', translation: 'I come from', phonetic: '/ɪç ˈkɔ.mə aʊ̯s/', audioText: 'Ich komme aus', exampleUsage: 'Ich komme aus Berlin.', exampleTranslation: 'I come from Berlin.' },
          { id: 'tw-2', term: 'Woher', translation: 'Where from', phonetic: '/voːˈheːɐ̯/', audioText: 'Woher', exampleUsage: 'Woher kommen Sie?', exampleTranslation: 'Where do you come from?' },
          { id: 'tw-3', term: 'Stadt', translation: 'City / Town', phonetic: '/ʃtat/', audioText: 'Stadt', exampleUsage: 'Eine schöne Stadt.', exampleTranslation: 'A beautiful city.' }
        ];
      case 'Japanese':
        return [
          { id: 'tw-1', term: '出身', translation: 'Origin / Hometown', phonetic: 'Shusshin', audioText: '出身', exampleUsage: '東京の出身です。', exampleTranslation: 'I am from Tokyo.' },
          { id: 'tw-2', term: 'どこ', translation: 'Where', phonetic: 'Doko', audioText: 'どこ', exampleUsage: 'ご出身はどちらですか？', exampleTranslation: 'Where are you from?' },
          { id: 'tw-3', term: '国', translation: 'Country', phonetic: 'Kuni', audioText: '国', exampleUsage: '美しい国です。', exampleTranslation: 'It is a beautiful country.' }
        ];
      case 'Italian':
        return [
          { id: 'tw-1', term: 'Vengo da', translation: 'I come from', phonetic: '/ˈvɛŋ.ɡo da/', audioText: 'Vengo da', exampleUsage: 'Vengo da Roma.', exampleTranslation: 'I come from Rome.' },
          { id: 'tw-2', term: 'Di dove', translation: 'From where', phonetic: '/di ˈdo.ve/', audioText: 'Di dove', exampleUsage: 'Di dove sei?', exampleTranslation: 'Where are you from?' },
          { id: 'tw-3', term: 'Città', translation: 'City', phonetic: '/tʃitˈta/', audioText: 'Città', exampleUsage: 'Una bella città.', exampleTranslation: 'A beautiful city.' }
        ];
      case 'French':
      default:
        return [
          { id: 'tw-1', term: 'Je viens de', translation: 'I come from', phonetic: '/ʒə vjɛ̃ də/', audioText: 'Je viens de', exampleUsage: 'Je viens de Paris.', exampleTranslation: 'I come from Paris.' },
          { id: 'tw-2', term: 'D’où', translation: 'From where', phonetic: '/du/', audioText: 'D’où', exampleUsage: 'D’où venez-vous ?', exampleTranslation: 'Where do you come from?' },
          { id: 'tw-3', term: 'Pays', translation: 'Country', phonetic: '/pe.i/', audioText: 'Pays', exampleUsage: 'Un magnifique pays.', exampleTranslation: 'A wonderful country.' }
        ];
    }
  }

  // 4. Polite Expressions & Gratitude
  if (combined.includes('thank') || combined.includes('polite') || combined.includes('please') || combined.includes('welcome') || combined.includes('courtes')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return [
          { id: 'tw-1', term: '谢谢', translation: 'Thank you', phonetic: 'Xièxiè', audioText: '谢谢', exampleUsage: '非常谢谢！', exampleTranslation: 'Thank you very much!' },
          { id: 'tw-2', term: '请', translation: 'Please', phonetic: 'Qǐng', audioText: '请', exampleUsage: '请进。', exampleTranslation: 'Please come in.' },
          { id: 'tw-3', term: '不客气', translation: 'You are welcome', phonetic: 'Bù kèqì', audioText: '不客气', exampleUsage: '不用客气！', exampleTranslation: 'No need to be polite!' }
        ];
      case 'Spanish':
        return [
          { id: 'tw-1', term: 'Por favor', translation: 'Please', phonetic: '/poɾ faˈβoɾ/', audioText: 'Por favor', exampleUsage: 'Un café, por favor.', exampleTranslation: 'A coffee, please.' },
          { id: 'tw-2', term: 'Muchas gracias', translation: 'Thank you very much', phonetic: '/ˈmu.tʃaz ˈɣɾa.sjas/', audioText: 'Muchas gracias', exampleUsage: 'Muchas gracias por todo.', exampleTranslation: 'Thank you very much for everything.' },
          { id: 'tw-3', term: 'De nada', translation: 'You are welcome', phonetic: '/de ˈna.ða/', audioText: 'De nada', exampleUsage: 'De nada, un placer.', exampleTranslation: 'You are welcome, a pleasure.' }
        ];
      case 'German':
        return [
          { id: 'tw-1', term: 'Bitte', translation: 'Please / You’re welcome', phonetic: '/ˈbɪ.tə/', audioText: 'Bitte', exampleUsage: 'Einen Kaffee, bitte.', exampleTranslation: 'A coffee, please.' },
          { id: 'tw-2', term: 'Danke schön', translation: 'Thank you kindly', phonetic: '/ˈdaŋ.kə ʃøːn/', audioText: 'Danke schön', exampleUsage: 'Danke schön für die Hilfe.', exampleTranslation: 'Thank you kindly for the help.' },
          { id: 'tw-3', term: 'Gerne', translation: 'With pleasure / Gladly', phonetic: '/ˈɡɛʁ.nə/', audioText: 'Gerne', exampleUsage: 'Sehr gerne!', exampleTranslation: 'With great pleasure!' }
        ];
      case 'Japanese':
        return [
          { id: 'tw-1', term: 'お願いします', translation: 'Please (Requesting)', phonetic: 'Onegaishimasu', audioText: 'お願いします', exampleUsage: 'これをお願いします。', exampleTranslation: 'This one please.' },
          { id: 'tw-2', term: 'ありがとうございます', translation: 'Thank you very much (Polite)', phonetic: 'Arigatou gozaimasu', audioText: 'ありがとうございます', exampleUsage: 'ご親切にありがとうございます。', exampleTranslation: 'Thank you for your kindness.' },
          { id: 'tw-3', term: 'どういたしまして', translation: 'You are welcome', phonetic: 'Douitashimashite', audioText: 'どういたしまして', exampleUsage: 'どういたしまして！', exampleTranslation: 'You are very welcome!' }
        ];
      case 'Italian':
        return [
          { id: 'tw-1', term: 'Per favore', translation: 'Please', phonetic: '/per faˈvo.re/', audioText: 'Per favore', exampleUsage: 'Un caffè, per favore.', exampleTranslation: 'A coffee, please.' },
          { id: 'tw-2', term: 'Grazie mille', translation: 'Thanks a million', phonetic: '/ˈɡrat.tsje ˈmil.le/', audioText: 'Grazie mille', exampleUsage: 'Grazie mille di cuore.', exampleTranslation: 'Thanks a million from the heart.' },
          { id: 'tw-3', term: 'Prego', translation: 'You are welcome', phonetic: '/ˈprɛ.ɡo/', audioText: 'Prego', exampleUsage: 'Prego, si accomodi.', exampleTranslation: 'You are welcome, have a seat.' }
        ];
      case 'French':
      default:
        return [
          { id: 'tw-1', term: 'S’il vous plaît', translation: 'Please (Polite)', phonetic: '/sil vu plɛ/', audioText: 'S’il vous plaît', exampleUsage: 'Un café, s’il vous plaît.', exampleTranslation: 'A coffee, please.' },
          { id: 'tw-2', term: 'Merci beaucoup', translation: 'Thank you very much', phonetic: '/mɛʁ.si bo.ku/', audioText: 'Merci beaucoup', exampleUsage: 'Merci beaucoup pour votre aide.', exampleTranslation: 'Thank you very much for your help.' },
          { id: 'tw-3', term: 'De rien', translation: 'You’re welcome / Not at all', phonetic: '/də ʁjɛ̃/', audioText: 'De rien', exampleUsage: 'De rien, avec plaisir !', exampleTranslation: 'You’re welcome, with pleasure!' }
        ];
    }
  }

  // 5. Food, Drinks, Café & Ordering
  if (combined.includes('food') || combined.includes('drink') || combined.includes('café') || combined.includes('cafe') || combined.includes('order') || combined.includes('restaur') || combined.includes('menu') || combined.includes('eat')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return [
          { id: 'tw-1', term: '水', translation: 'Water', phonetic: 'Shuǐ', audioText: '水', exampleUsage: '一杯水。', exampleTranslation: 'A glass of water.' },
          { id: 'tw-2', term: '咖啡', translation: 'Coffee', phonetic: 'Kāfēi', audioText: '咖啡', exampleUsage: '热咖啡。', exampleTranslation: 'Hot coffee.' },
          { id: 'tw-3', term: '请给我', translation: 'Please give me', phonetic: 'Qǐng gěi wǒ', audioText: '请给我', exampleUsage: '请给我菜单。', exampleTranslation: 'Please give me the menu.' }
        ];
      case 'Spanish':
        return [
          { id: 'tw-1', term: 'Un café', translation: 'A coffee', phonetic: '/un kaˈfe/', audioText: 'Un café', exampleUsage: 'Un café con leche.', exampleTranslation: 'A coffee with milk.' },
          { id: 'tw-2', term: 'Agua', translation: 'Water', phonetic: '/ˈa.ɣwa/', audioText: 'Agua', exampleUsage: 'Un vaso de agua.', exampleTranslation: 'A glass of water.' },
          { id: 'tw-3', term: 'La cuenta', translation: 'The bill / check', phonetic: '/la ˈkwen.ta/', audioText: 'La cuenta', exampleUsage: 'La cuenta, por favor.', exampleTranslation: 'The bill, please.' }
        ];
      case 'German':
        return [
          { id: 'tw-1', term: 'Ein Kaffee', translation: 'A coffee', phonetic: '/aɪ̯n ˈka.feː/', audioText: 'Ein Kaffee', exampleUsage: 'Einen Kaffee bitte.', exampleTranslation: 'A coffee please.' },
          { id: 'tw-2', term: 'Wasser', translation: 'Water', phonetic: '/ˈva.sɐ/', audioText: 'Wasser', exampleUsage: 'Ein Glas Wasser.', exampleTranslation: 'A glass of water.' },
          { id: 'tw-3', term: 'Die Rechnung', translation: 'The bill', phonetic: '/diː ˈʁɛç.nʊŋ/', audioText: 'Die Rechnung', exampleUsage: 'Die Rechnung bitte.', exampleTranslation: 'The bill please.' }
        ];
      case 'Japanese':
        return [
          { id: 'tw-1', term: 'お水', translation: 'Water', phonetic: 'Omizu', audioText: 'お水', exampleUsage: 'お水をください。', exampleTranslation: 'Water please.' },
          { id: 'tw-2', term: 'コーヒー', translation: 'Coffee', phonetic: 'Koohii', audioText: 'コーヒー', exampleUsage: 'アイスコーヒー。', exampleTranslation: 'Iced coffee.' },
          { id: 'tw-3', term: 'お会計', translation: 'The bill / check', phonetic: 'Okaikei', audioText: 'お会計', exampleUsage: 'お会計をお願いします。', exampleTranslation: 'The bill please.' }
        ];
      case 'Italian':
        return [
          { id: 'tw-1', term: 'Un caffè', translation: 'An espresso / coffee', phonetic: '/un kafˈfɛ/', audioText: 'Un caffè', exampleUsage: 'Un caffè al banco.', exampleTranslation: 'An espresso at the counter.' },
          { id: 'tw-2', term: 'Acqua', translation: 'Water', phonetic: '/ˈak.kwa/', audioText: 'Acqua', exampleUsage: 'Una bottiglia d’acqua.', exampleTranslation: 'A bottle of water.' },
          { id: 'tw-3', term: 'Il conto', translation: 'The bill', phonetic: '/il ˈkon.to/', audioText: 'Il conto', exampleUsage: 'Il conto, per favore.', exampleTranslation: 'The bill, please.' }
        ];
      case 'French':
      default:
        return [
          { id: 'tw-1', term: 'Un café', translation: 'A coffee', phonetic: '/œ̃ ka.fe/', audioText: 'Un café', exampleUsage: 'Un café noir, s’il vous plaît.', exampleTranslation: 'A black coffee, please.' },
          { id: 'tw-2', term: 'L’addition', translation: 'The bill / check', phonetic: '/la.di.sjɔ̃/', audioText: 'L’addition', exampleUsage: 'L’addition, s’il vous plaît.', exampleTranslation: 'The bill, please.' },
          { id: 'tw-3', term: 'Je voudrais', translation: 'I would like', phonetic: '/ʒə vu.dʁɛ/', audioText: 'Je voudrais', exampleUsage: 'Je voudrais un croissant.', exampleTranslation: 'I would like a croissant.' }
        ];
    }
  }

  // 6. Directions, Navigation & Travel
  if (combined.includes('direct') || combined.includes('where') || combined.includes('station') || combined.includes('train') || combined.includes('street') || combined.includes('travel') || combined.includes('hotel')) {
    switch (canonicalName) {
      case 'Chinese Mandarin':
        return [
          { id: 'tw-1', term: '在哪里', translation: 'Where is (located)', phonetic: 'Zài nǎlǐ', audioText: '在哪里', exampleUsage: '地铁站在哪里？', exampleTranslation: 'Where is the subway station?' },
          { id: 'tw-2', term: '直走', translation: 'Go straight', phonetic: 'Zhí zǒu', audioText: '直走', exampleUsage: '一直直走。', exampleTranslation: 'Go straight ahead.' },
          { id: 'tw-3', term: '右转', translation: 'Turn right', phonetic: 'Yòu zhuǎn', audioText: '右转', exampleUsage: '然后右转。', exampleTranslation: 'Then turn right.' }
        ];
      case 'Spanish':
        return [
          { id: 'tw-1', term: '¿Dónde está?', translation: 'Where is?', phonetic: '/ˈdon.de esˈta/', audioText: 'Dónde está', exampleUsage: '¿Dónde está la estación?', exampleTranslation: 'Where is the station?' },
          { id: 'tw-2', term: 'Todo recto', translation: 'Straight ahead', phonetic: '/ˈto.ðo ˈrek.to/', audioText: 'Todo recto', exampleUsage: 'Siga todo recto.', exampleTranslation: 'Continue straight ahead.' },
          { id: 'tw-3', term: 'A la derecha', translation: 'To the right', phonetic: '/a la ðeˈɾe.tʃa/', audioText: 'A la derecha', exampleUsage: 'Gire a la derecha.', exampleTranslation: 'Turn to the right.' }
        ];
      case 'German':
        return [
          { id: 'tw-1', term: 'Wo ist', translation: 'Where is', phonetic: '/voː ɪst/', audioText: 'Wo ist', exampleUsage: 'Wo ist der Bahnhof?', exampleTranslation: 'Where is the train station?' },
          { id: 'tw-2', term: 'Geradeaus', translation: 'Straight ahead', phonetic: '/ɡəˈʁaː.də.aʊ̯s/', audioText: 'Geradeaus', exampleUsage: 'Immer geradeaus gehen.', exampleTranslation: 'Always go straight ahead.' },
          { id: 'tw-3', term: 'Rechts', translation: 'Right', phonetic: '/ʁɛçts/', audioText: 'Rechts', exampleUsage: 'Biegen Sie rechts ab.', exampleTranslation: 'Turn right.' }
        ];
      case 'Japanese':
        return [
          { id: 'tw-1', term: 'どこですか', translation: 'Where is it?', phonetic: 'Doko desu ka', audioText: 'どこですか', exampleUsage: '駅はどこですか？', exampleTranslation: 'Where is the station?' },
          { id: 'tw-2', term: 'まっすぐ', translation: 'Straight ahead', phonetic: 'Massugu', audioText: 'まっすぐ', exampleUsage: 'まっすぐ行ってください。', exampleTranslation: 'Please go straight.' },
          { id: 'tw-3', term: '右', translation: 'Right', phonetic: 'Migi', audioText: '右', exampleUsage: '右に曲がります。', exampleTranslation: 'Turn right.' }
        ];
      case 'Italian':
        return [
          { id: 'tw-1', term: 'Dov’è', translation: 'Where is', phonetic: '/doˈvɛ/', audioText: 'Dov’è', exampleUsage: 'Dov’è la stazione?', exampleTranslation: 'Where is the station?' },
          { id: 'tw-2', term: 'Dritto', translation: 'Straight ahead', phonetic: '/ˈdrit.to/', audioText: 'Dritto', exampleUsage: 'Vada sempre dritto.', exampleTranslation: 'Go always straight.' },
          { id: 'tw-3', term: 'A destra', translation: 'To the right', phonetic: '/a ˈdɛs.tra/', audioText: 'A destra', exampleUsage: 'Giri a destra.', exampleTranslation: 'Turn right.' }
        ];
      case 'French':
      default:
        return [
          { id: 'tw-1', term: 'Où est', translation: 'Where is', phonetic: '/u ɛ/', audioText: 'Où est', exampleUsage: 'Où est la gare ?', exampleTranslation: 'Where is the station?' },
          { id: 'tw-2', term: 'Tout droit', translation: 'Straight ahead', phonetic: '/tu dʁwa/', audioText: 'Tout droit', exampleUsage: 'Continuez tout droit.', exampleTranslation: 'Continue straight ahead.' },
          { id: 'tw-3', term: 'À droite', translation: 'To the right', phonetic: '/a dʁwat/', audioText: 'À droite', exampleUsage: 'Tournez à droite.', exampleTranslation: 'Turn to the right.' }
        ];
    }
  }

  // 7. General / Fallback Words
  const pack = LANGUAGE_PACKS[canonicalName] || LANGUAGE_PACKS.French;
  return [
    { id: 'tw-1', term: pack.greetingFormal.target, translation: pack.greetingFormal.trans, phonetic: pack.greetingFormal.hint, audioText: pack.greetingFormal.target, exampleUsage: pack.greetingFormal.target, exampleTranslation: pack.greetingFormal.trans },
    { id: 'tw-2', term: pack.thankYou.target, translation: pack.thankYou.trans, phonetic: pack.thankYou.hint, audioText: pack.thankYou.target, exampleUsage: pack.thankYou.target, exampleTranslation: pack.thankYou.trans },
    { id: 'tw-3', term: pack.howAreYou.target, translation: pack.howAreYou.trans, phonetic: pack.howAreYou.hint, audioText: pack.howAreYou.target, exampleUsage: pack.howAreYou.target, exampleTranslation: pack.howAreYou.trans }
  ];
}

/**
 * Returns tailored pedagogical lessons for any unit in the learner's chosen language,
 * generated dynamically by the Fluentra AI curriculum engine
 */
export function getLessonsForUnit(
  unitId: string,
  languageName: string = 'French',
  learningGoal: string = 'travel'
): Lesson[] {
  const opt = getLanguageOption(languageName);
  const canonicalName = opt.name;

  // If unit has a structured 10-step pedagogical journey, return it
  if ((canonicalName === 'French' || !canonicalName) && UNIT_JOURNEYS[unitId]) {
    return [buildUnitLessonFromJourney(UNIT_JOURNEYS[unitId])];
  }

  const pack = LANGUAGE_PACKS[canonicalName] || LANGUAGE_PACKS.French;
  const meta = CURRICULUM_DATA.unitsById[unitId] || CURRICULUM_DATA.units[0];

  // Unit 1: Absolute Ground-Zero Ear-Training, Phonetics & Sound Architecture
  if (unitId === 'u1') {
    const u1Targets = getTopicTargetWords(meta, canonicalName);

    if (canonicalName === 'Chinese Mandarin') {
      return [
        {
          id: 'u1-l1',
          title: 'Mandarin Ground-Zero: The 4 Tones & Pitch Curves',
          description: 'Ear training on the 4 Mandarin tones: mā (high flat), má (rising), mǎ (dipping), and mà (falling).',
          order: 1,
          xpReward: 15,
          exercises: [
            {
              id: 'u1-l1-e0-words',
              type: 'target_discovery',
              stepType: 'discover',
              prompt: 'Learn the 4 core tone sounds before training your ear:',
              targets: u1Targets,
              xpReward: 5
            },
            {
              id: 'u1-l1-e1',
              type: 'multiple_choice',
              prompt: 'Tone 1 (High & Flat — 55 pitch): Which syllable stays high and steady like singing a note?',
              targetText: 'mā (妈 - Mother)',
              audioText: 'mā',
              translation: 'Tone 1: High & Flat (mā)',
              options: [
                { id: 't1', text: 'mā (High & Flat ˉ)', translation: 'Tone 1: mā', audioText: 'mā' },
                { id: 't2', text: 'má (Rising ˊ)', translation: 'Tone 2: má', audioText: 'má' },
                { id: 't4', text: 'mà (Falling ˋ)', translation: 'Tone 4: mà', audioText: 'mà' }
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
                { id: 'opt-t', text: 'The letter "t" is silent (/sa-ly/)', translation: 'Correct French phonetics', audioText: 'Salut' },
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
                { id: 'h1', text: 'Pronounced "Oh-la" (Silent H)', translation: 'Correct Spanish phonetics', audioText: 'Hola' },
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
              audioText: 'Wie',
              translation: 'German W = English V sound',
              options: [
                { id: 'w1', text: 'Pronounced like "Vee" (/viː/)', translation: 'Correct German phonetics', audioText: 'Wie' },
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
                { id: 'b1', text: '5 equal beats (Ko-n-ni-chi-wa)', translation: 'Correct Japanese mora rhythm', audioText: 'こんにちは' },
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
                { id: 'c1', text: 'English "ch" as in "chocolate" (/ˈtʃa.o/)', translation: 'Correct Italian phonetics', audioText: 'Ciao' },
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

  // Topic-specific curriculum synthesis for all units across the 800-unit progression:
  const { item1, item2 } = getTopicSpecificCurriculumItems(meta, canonicalName);
  const targetWords = getTopicTargetWords(meta, canonicalName);

  return [
    {
      id: `${unitId}-l1`,
      title: `${meta.title} — AI Core Studio`,
      description: `Dynamically synthesized for ${pack.name} · Level ${meta.levelNumber} · Goal: ${learningGoal.toUpperCase()}`,
      order: 1,
      xpReward: 20,
      exercises: [
        {
          id: `${unitId}-l1-e0-words`,
          type: 'target_discovery',
          stepType: 'discover',
          prompt: `Learn the core words for "${meta.title}" before using them in sentences:`,
          targets: targetWords,
          xpReward: 5
        },
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
      xpReward: 25,
      exercises: [
        {
          id: `${unitId}-l2-e0-words`,
          type: 'target_discovery',
          stepType: 'discover',
          prompt: `Core vocabulary for conversational fluency in "${meta.title}":`,
          targets: targetWords.slice(1).concat(targetWords[0]),
          xpReward: 5
        },
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
