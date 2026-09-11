// FLUENTRA AI Conversation Roleplay Scenarios
import { ConversationScenario } from '../types/conversation';

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [
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
  },
  {
    id: 'sc-airport',
    title: 'Airport Gate & Flight Rebooking',
    category: 'travel',
    minLevelNumber: 4,
    description: 'Your connecting flight has been moved. Talk to the gate agent to confirm boarding.',
    aiRole: 'Sophie (Air France Customer Agent)',
    userRole: 'Passenger with connecting luggage',
    initialAiMessage: 'Bonjour, que puis-je faire pour vous ? Avez-vous votre carte d’embarquement ?',
    suggestedUserStarters: [
      'Bonjour, j’ai une correspondance pour Lyon et la porte a changé.',
      'Bonjour, mon vol a du retard, est-ce que mes bagages suivront ?',
      'Pourriez-vous vérifier l’horaire exact d’embarquement s’il vous plaît ?'
    ],
    learningObjectives: [
      'Explain travel schedules and past delays',
      'Request assistance politely with conditional verbs',
      'Confirm flight gate and luggage transfer details'
    ]
  },
  {
    id: 'sc-hotel',
    title: 'Hotel Concierge & Local Gems',
    category: 'travel',
    minLevelNumber: 5,
    description: 'Ask the hotel concierge for off-the-beaten-path recommendations and art galleries.',
    aiRole: 'Laurent (Knowledgeable Hotel Concierge)',
    userRole: 'Hotel guest seeking hidden spots',
    initialAiMessage: 'Bonjour ! Comment se passe votre séjour ? Avez-vous besoin de recommandations pour aujourd’hui ?',
    suggestedUserStarters: [
      'Bonjour Laurent ! Nous cherchons un petit musée d’art calme, loin de la foule.',
      'Auriez-vous un restaurant typique et authentique à nous conseiller ce soir ?',
      'Comment est-il préférable de s’y rendre depuis l’hôtel ?'
    ],
    learningObjectives: [
      'Express detailed personal tastes and cultural preferences',
      'Formulate complex questions regarding routes and schedules',
      'Incorporate idiomatic travel expressions'
    ]
  },
  {
    id: 'sc-interview',
    title: 'Professional Career Interview',
    category: 'work',
    minLevelNumber: 7,
    description: 'Discuss your career milestones, how you overcome setbacks, and team leadership.',
    aiRole: 'Hélène (Director of Talent & Culture)',
    userRole: 'Candidate interviewing for a senior role',
    initialAiMessage: 'Bonjour et bienvenue. Pour commencer, pourriez-vous me résumer votre parcours et ce qui vous motive dans ce projet ?',
    suggestedUserStarters: [
      'Bonjour Hélène. Avec grand plaisir. Au cours des cinq dernières années...',
      'Bonjour, merci de me recevoir. Mon parcours s’articule autour de deux axes majeurs...',
      'Bonjour Hélène, je suis ravi d’échanger avec vous sur cette opportunité.'
    ],
    learningObjectives: [
      'Articulate professional achievements with precision',
      'Discuss complex challenges and strategic decisions',
      'Maintain an executive, polished conversational cadence'
    ]
  },
  {
    id: 'sc-debate',
    title: 'The Great Debate: Remote vs Office Culture',
    category: 'debate',
    minLevelNumber: 8,
    description: 'Engage in an intellectual, spontaneous debate on the sociological impacts of remote work.',
    aiRole: 'Professor Marc (Sociologist & Author)',
    userRole: 'Panelist & Contributor',
    initialAiMessage: 'Bienvenue à notre table ronde. À votre avis, le télétravail renforce-t-il l’autonomie individuelle ou fragilise-t-il le lien social ?',
    suggestedUserStarters: [
      'C’est une question passionnante. À mon sens, l’autonomie ne s’oppose pas nécessairement au lien social...',
      'Il me semble qu’il faut nuancer l’analyse selon les secteurs d’activité...',
      'Tout dépend de la culture d’entreprise et des rituels mis en place pour préserver la cohésion.'
    ],
    learningObjectives: [
      'Construct multi-layered argumentative responses',
      'Use rhetorical devices and subjunctive nuances effortlessly',
      'Challenge counter-points with wit and diplomatic tact'
    ]
  }
];
