// FLUENTRA AI Conversation Roleplay Scenarios (Multi-Language Support)
import { ConversationScenario } from '../types/conversation';

const FRENCH_SCENARIOS: ConversationScenario[] = [
  {
    id: 'sc-bakery',
    title: 'At the Traditional Bakery',
    category: 'dining',
    minLevelNumber: 1,
    description: 'Order your morning baguette and pastries from the local artisan baker.',
    aiRole: 'Boulanger (Friendly Paris Baker)',
    userRole: 'Customer',
    initialAiMessage: 'Bonjour ! Bienvenue à la boulangerie. Qu’est-ce qui vous ferait plaisir aujourd’hui ?',
    suggestedUserStarters: [
      'Bonjour ! Une baguette tradition s’il vous plaît.',
      'Bonjour, je voudrais deux croissants.',
      'Avez-vous des pains au chocolat chauds ?'
    ],
    learningObjectives: [
      'Use formal polite greetings',
      'Order food using "Je voudrais..."',
      'Inquire about prices and thank the baker'
    ]
  },
  {
    id: 'sc-neighbor',
    title: 'Meeting Your New Neighbor',
    category: 'social',
    minLevelNumber: 2,
    description: 'Introduce yourself in the building hallway and chat about your neighborhood.',
    aiRole: 'Antoine (Your building neighbor)',
    userRole: 'New resident in apartment 4B',
    initialAiMessage: 'Ah bonjour ! Vous êtes le nouveau voisin du quatrième étage ? Moi c’est Antoine !',
    suggestedUserStarters: [
      'Bonjour Antoine ! Oui tout à fait, enchanté.',
      'Bonjour ! Oui je viens d’emménager hier.',
      'Enchanté Antoine, le quartier a l’air très agréable.'
    ],
    learningObjectives: [
      'Introduce your name and background',
      'Ask simple questions about the building and neighborhood',
      'Use cordial small talk phrases'
    ]
  },
  {
    id: 'sc-restaurant',
    title: 'Bistro Dinner in Saint-Germain',
    category: 'dining',
    minLevelNumber: 3,
    description: 'Reserve a table, ask for the chef’s daily special, and order drinks.',
    aiRole: 'Clément (Bistro head waiter)',
    userRole: 'Diner',
    initialAiMessage: 'Bonsoir monsieur / madame, vous avez réservé ou vous préférez une table en terrasse ?',
    suggestedUserStarters: [
      'Bonsoir, nous n’avons pas réservé. Avez-vous une table pour deux ?',
      'Bonsoir, une table en terrasse s’il vous plaît.',
      'Quel est le plat du jour aujourd’hui ?'
    ],
    learningObjectives: [
      'Inquire about seating and specials',
      'Discuss dietary preferences and ingredients',
      'Ask for water, condiments, and the final check'
    ]
  }
];

const MANDARIN_SCENARIOS: ConversationScenario[] = [
  {
    id: 'sc-mandarin-cafe',
    title: 'At the Teahouse & Dim Sum Café',
    category: 'dining',
    minLevelNumber: 1,
    description: 'Order authentic tea and dim sum from a friendly server in Beijing or Shanghai.',
    aiRole: '茶馆服务员 (Teahouse Server)',
    userRole: 'Customer',
    initialAiMessage: '您好！欢迎光临！请问您几位？想先喝点什么茶？我们有龙井和普洱。',
    suggestedUserStarters: [
      '您好！我们两位，请来一壶西湖龙井茶。',
      '请问今天有什么招牌点心？',
      '请给我看一下菜单，谢谢。'
    ],
    learningObjectives: [
      'Use polite greetings (您好 nǐn hǎo)',
      'Order tea and dim sum in Mandarin',
      'Ask for the bill courteously (买单 mǎidān)'
    ]
  },
  {
    id: 'sc-mandarin-neighbor',
    title: 'Meeting Your Neighbor in Beijing',
    category: 'social',
    minLevelNumber: 2,
    description: 'Introduce yourself to your neighbor and exchange friendly small talk.',
    aiRole: '小张 (Your friendly neighbor)',
    userRole: 'New resident in 402',
    initialAiMessage: '你好！你是刚搬来的新邻居吧？我叫小张，住你隔壁！',
    suggestedUserStarters: [
      '你好小张！很高兴认识你，我刚搬过来。',
      '小张你好，请问这附近有什么好吃的餐馆吗？',
      '以后请多关照！'
    ],
    learningObjectives: [
      'Introduce your name and apartment',
      'Ask about local neighborhood spots',
      'Use polite Chinese cultural pleasantries'
    ]
  },
  {
    id: 'sc-mandarin-restaurant',
    title: 'Dining at a Traditional Restaurant',
    category: 'dining',
    minLevelNumber: 3,
    description: 'Inquire about table seating, chef specials, and dietary preferences.',
    aiRole: '大堂经理 (Restaurant Manager)',
    userRole: 'Diner',
    initialAiMessage: '晚上好！请问有预订吗？您想坐大厅还是靠窗的位置？',
    suggestedUserStarters: [
      '晚上好，我们没有预订，请问有两人的桌子吗？',
      '请问今天有什么特色菜推荐？',
      '请不要放太辣，微辣就可以。'
    ],
    learningObjectives: [
      'Table seating requests',
      'Specify spice levels and ingredients',
      'Communicate payment and receipt needs'
    ]
  }
];

const SPANISH_SCENARIOS: ConversationScenario[] = [
  {
    id: 'sc-spanish-bakery',
    title: 'En la Panadería y Cafetería',
    category: 'dining',
    minLevelNumber: 1,
    description: 'Order breakfast coffee and fresh pastries at a local Spanish panadería.',
    aiRole: 'Panadero (Friendly Baker)',
    userRole: 'Customer',
    initialAiMessage: '¡Buenos días! Bienvenido a la panadería. ¿Qué le gustaría llevar hoy?',
    suggestedUserStarters: [
      '¡Buenos días! Un café con leche y dos cruasanes, por favor.',
      'Hola, ¿tienen empanadas recién horneadas?',
      '¿Cuánto cuesta la barra de pan?'
    ],
    learningObjectives: [
      'Use polite morning greetings',
      'Order food and beverages naturally',
      'Inquire about prices'
    ]
  },
  {
    id: 'sc-spanish-neighbor',
    title: 'Conociendo a tu Vecino',
    category: 'social',
    minLevelNumber: 2,
    description: 'Introduce yourself in the building hallway in Madrid or Barcelona.',
    aiRole: 'Carlos (Tu vecino del cuarto piso)',
    userRole: 'New resident in 4B',
    initialAiMessage: '¡Hola! ¿Eres el nuevo vecino del cuarto piso? ¡Mucho gusto, soy Carlos!',
    suggestedUserStarters: [
      '¡Hola Carlos! Mucho gusto, me acabo de mudar ayer.',
      '¡Encantado Carlos! El barrio se ve muy bonito y tranquilo.',
      '¿Hay algún supermercado bueno cerca de aquí?'
    ],
    learningObjectives: [
      'Introduce your name and situation',
      'Ask about local amenities',
      'Engage in cordial Spanish small talk'
    ]
  },
  {
    id: 'sc-spanish-restaurant',
    title: 'Cena de Tapas en el Centro',
    category: 'dining',
    minLevelNumber: 3,
    description: 'Order tapas, drinks, and ask for recommendations.',
    aiRole: 'Camarero (Tapas Bar Server)',
    userRole: 'Diner',
    initialAiMessage: '¡Buenas noches! ¿Tienen reserva o prefieren una mesa en la terraza?',
    suggestedUserStarters: [
      'Buenas noches, una mesa en la terraza para dos, por favor.',
      '¿Qué tapas nos recomienda para compartir?',
      'La cuenta cuando pueda, por favor.'
    ],
    learningObjectives: [
      'Dining reservations and seating',
      'Inquiring about daily tapas specials',
      'Asking for the bill politely'
    ]
  }
];

const GERMAN_SCENARIOS: ConversationScenario[] = [
  {
    id: 'sc-german-bakery',
    title: 'In der traditionellen Bäckerei',
    category: 'dining',
    minLevelNumber: 1,
    description: 'Order fresh bread rolls, pretzels, and coffee in a German bakery.',
    aiRole: 'Bäcker (Freundlicher Bäckermeister)',
    userRole: 'Customer',
    initialAiMessage: 'Guten Tag! Willkommen in der Bäckerei. Was darf es für Sie sein?',
    suggestedUserStarters: [
      'Guten Tag! Ich hätte gerne zwei Brezeln und ein Vollkornbrot.',
      'Haben Sie frische Schokocroissants?',
      'Einen Kaffee zum Mitnehmen bitte.'
    ],
    learningObjectives: [
      'Formal daytime greetings',
      'Polite requests using "Ich hätte gerne..."',
      'Ordering food items with accuracy'
    ]
  },
  {
    id: 'sc-german-neighbor',
    title: 'Den neuen Nachbarn kennenlernen',
    category: 'social',
    minLevelNumber: 2,
    description: 'Meet your apartment neighbor and introduce yourself.',
    aiRole: 'Florian (Dein Nachbar im 4. Stock)',
    userRole: 'New neighbor',
    initialAiMessage: 'Hallo! Sie sind der neue Nachbar aus dem vierten Stock, richtig? Ich bin Florian!',
    suggestedUserStarters: [
      'Hallo Florian! Freut mich sehr, ich bin gestern eingezogen.',
      'Guten Tag Florian, die Gegend gefällt mir bisher sehr gut.',
      'Können Sie mir einen guten Bäcker in der Nähe empfehlen?'
    ],
    learningObjectives: [
      'Neighbor introductions',
      'Polite conversational exchange',
      'Asking for local recommendations'
    ]
  }
];

const JAPANESE_SCENARIOS: ConversationScenario[] = [
  {
    id: 'sc-japanese-cafe',
    title: 'カフェ＆ベーカリーにて',
    category: 'dining',
    minLevelNumber: 1,
    description: 'Order coffee and matcha treats at a stylish Tokyo café.',
    aiRole: '店員 (Friendly Café Staff)',
    userRole: 'Customer',
    initialAiMessage: 'いらっしゃいませ！店内でお召し上がりですか、それともお持ち帰りですか？',
    suggestedUserStarters: [
      '店内でお願いします。アイスラテをひとつください。',
      'おすすめのデザートは何ですか？',
      'お会計をお願いします。'
    ],
    learningObjectives: [
      'Dine-in vs takeaway ordering',
      'Polite item requests with "kudasai"',
      'Payment etiquette'
    ]
  },
  {
    id: 'sc-japanese-neighbor',
    title: '新しい隣人へのご挨拶',
    category: 'social',
    minLevelNumber: 2,
    description: 'Introduce yourself politely to your apartment neighbor in Tokyo.',
    aiRole: '田中さん (Neighbor next door)',
    userRole: 'New resident',
    initialAiMessage: 'こんにちは！お隣の田中です。最近お引越しされてきた方ですね？',
    suggestedUserStarters: [
      'はじめまして！隣に引っ越してきた者です。よろしくお願いします。',
      'こんにちは田中さん！この街は静かでとても住みやすそうですね。',
      'これからどうぞよろしくお願いします。'
    ],
    learningObjectives: [
      'Formal Japanese self-introductions (Hajimemashite)',
      'Polite neighborly deference (Yoroshiku onegaishimasu)',
      'Natural conversational rhythm'
    ]
  }
];

const ITALIAN_SCENARIOS: ConversationScenario[] = [
  {
    id: 'sc-italian-bakery',
    title: 'Al Forno e Caffetteria',
    category: 'dining',
    minLevelNumber: 1,
    description: 'Order your morning cappuccino, cornetto, and fresh focaccia.',
    aiRole: 'Fornaio (Friendly Baker)',
    userRole: 'Customer',
    initialAiMessage: 'Buongiorno! Benvenuto al forno. Cosa le preparo stamattina di buono?',
    suggestedUserStarters: [
      'Buongiorno! Un cappuccino e un cornetto alla crema, per favore.',
      'Avete della focaccia calda appena sfornata?',
      'Quanto costa in tutto?'
    ],
    learningObjectives: [
      'Italian morning café greetings',
      'Ordering food and beverages',
      'Inquiring about freshly baked goods'
    ]
  },
  {
    id: 'sc-italian-neighbor',
    title: 'Incontro con il Vicino di Casa',
    category: 'social',
    minLevelNumber: 2,
    description: 'Meet your neighbor in the building lobby in Rome or Florence.',
    aiRole: 'Marco (Il tuo vicino del quarto piano)',
    userRole: 'New resident in apartment 4B',
    initialAiMessage: 'Ciao! Sei il nuovo vicino del quarto piano? Piacere di conoscerti, mi chiamo Marco!',
    suggestedUserStarters: [
      'Ciao Marco! Piacere mio, mi sono trasferito proprio ieri.',
      'Molto piacere! Il quartiere sembra davvero tranquillo e accogliente.',
      'C’è un buon ristorante tipico qui vicino che mi consigli?'
    ],
    learningObjectives: [
      'Informal and formal introductions',
      'Asking for local advice',
      'Warm Italian conversational rapport'
    ]
  }
];

const SCENARIOS_BY_LANG: Record<string, ConversationScenario[]> = {
  'Chinese Mandarin': MANDARIN_SCENARIOS,
  French: FRENCH_SCENARIOS,
  Spanish: SPANISH_SCENARIOS,
  German: GERMAN_SCENARIOS,
  Japanese: JAPANESE_SCENARIOS,
  Italian: ITALIAN_SCENARIOS
};

export const getScenariosForLanguage = (language: string): ConversationScenario[] => {
  return SCENARIOS_BY_LANG[language] || FRENCH_SCENARIOS;
};

// Global fallback export for backwards compatibility
export const CONVERSATION_SCENARIOS: ConversationScenario[] = FRENCH_SCENARIOS;
