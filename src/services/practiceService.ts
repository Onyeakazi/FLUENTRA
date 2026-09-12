// FLUENTRA Dynamic Level-Scoped Practice & Active Recall Curriculum Generator

export interface PracticePairItem {
  id: string;
  left: string;
  right: string;
  hint?: string;
  audio?: string;
}

export interface PracticeSentenceItem {
  id: string;
  prompt: string;
  translation: string;
  words: string[];
  distractors: string[];
  target: string;
  explanation?: string;
}

export interface PracticeListeningItem {
  id: string;
  targetAudio: string;
  phonetic?: string;
  translation: string;
  options: {
    id: string;
    text: string;
    translation: string;
    correct: boolean;
  }[];
}

export interface PracticeLightningItem {
  id: string;
  question: string;
  context?: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

export interface LevelPracticeContent {
  levelNumber: number;
  batchId: number;
  pairs: PracticePairItem[];
  sentences: PracticeSentenceItem[];
  listenings: PracticeListeningItem[];
  lightnings: PracticeLightningItem[];
}

// Deep Multi-Level Curated Practice Matrices (12–14 Items Per Tab Per Batch)
const PRACTICE_VARIATIONS: Record<string, Record<number, LevelPracticeContent[]>> = {
  French: {
    1: [
      {
        levelNumber: 1,
        batchId: 1,
        pairs: [
          { id: 'fr-p1-1', left: 'bonjour', right: 'hello / good morning', audio: 'bonjour' },
          { id: 'fr-p1-2', left: 'merci', right: 'thank you', audio: 'merci' },
          { id: 'fr-p1-3', left: 's’il vous plaît', right: 'please', audio: "s'il vous plaît" },
          { id: 'fr-p1-4', left: 'au revoir', right: 'goodbye', audio: 'au revoir' },
          { id: 'fr-p1-5', left: 'oui', right: 'yes', audio: 'oui' },
          { id: 'fr-p1-6', left: 'non', right: 'no', audio: 'non' },
          { id: 'fr-p1-7', left: 'bonsoir', right: 'good evening', audio: 'bonsoir' },
          { id: 'fr-p1-8', left: 'pardon', right: 'excuse me / sorry', audio: 'pardon' },
          { id: 'fr-p1-9', left: 'bonne nuit', right: 'good night', audio: 'bonne nuit' },
          { id: 'fr-p1-10', left: 'bienvenue', right: 'welcome', audio: 'bienvenue' },
          { id: 'fr-p1-11', left: 'l’eau', right: 'the water', audio: "l'eau" },
          { id: 'fr-p1-12', left: 'le pain', right: 'the bread', audio: 'le pain' },
          { id: 'fr-p1-13', left: 'le café', right: 'the coffee', audio: 'le café' },
          { id: 'fr-p1-14', left: 'l’ami', right: 'the friend', audio: "l'ami" }
        ],
        sentences: [
          {
            id: 'fr-s1-1',
            prompt: 'Assemble: “Hello, how are you?”',
            translation: 'Hello, how are you doing?',
            target: 'Bonjour, comment allez-vous ?',
            words: ['Bonjour,', 'comment', 'allez-vous', '?'],
            distractors: ['merci', 'au revoir']
          },
          {
            id: 'fr-s1-2',
            prompt: 'Assemble: “A black coffee, please.”',
            translation: 'A black coffee, please.',
            target: 'Un café noir, s’il vous plaît.',
            words: ['Un', 'café', 'noir,', 's’il', 'vous', 'plaît.'],
            distractors: ['le', 'pain', 'merci']
          },
          {
            id: 'fr-s1-3',
            prompt: 'Assemble: “Thank you very much, my friend.”',
            translation: 'Thank you very much, my friend.',
            target: 'Merci beaucoup, mon ami.',
            words: ['Merci', 'beaucoup,', 'mon', 'ami.'],
            distractors: ['bonsoir', 'salut']
          },
          {
            id: 'fr-s1-4',
            prompt: 'Assemble: “My name is Pierre and I am French.”',
            translation: 'My name is Pierre and I am French.',
            target: 'Je m’appelle Pierre et je suis français.',
            words: ['Je', 'm’appelle', 'Pierre', 'et', 'je', 'suis', 'français.'],
            distractors: ['tu', 'es', 'bonjour']
          },
          {
            id: 'fr-s1-5',
            prompt: 'Assemble: “I would like a glass of water.”',
            translation: 'I would like a glass of water.',
            target: 'Je voudrais un verre d’eau.',
            words: ['Je', 'voudrais', 'un', 'verre', 'd’eau.'],
            distractors: ['manger', 'thé', 'pain']
          },
          {
            id: 'fr-s1-6',
            prompt: 'Assemble: “Where is the train station, please?”',
            translation: 'Where is the train station, please?',
            target: 'Où est la gare, s’il vous plaît ?',
            words: ['Où', 'est', 'la', 'gare,', 's’il', 'vous', 'plaît', '?'],
            distractors: ['qui', 'rue', 'métro']
          },
          {
            id: 'fr-s1-7',
            prompt: 'Assemble: “Pleased to meet you, see you tomorrow.”',
            translation: 'Pleased to meet you, see you tomorrow.',
            target: 'Enchanté, à demain matin.',
            words: ['Enchanté,', 'à', 'demain', 'matin.'],
            distractors: ['bonsoir', 'hier']
          },
          {
            id: 'fr-s1-8',
            prompt: 'Assemble: “The bill, please.”',
            translation: 'The check / bill, please.',
            target: 'L’addition, s’il vous plaît.',
            words: ['L’addition,', 's’il', 'vous', 'plaît.'],
            distractors: ['menu', 'table', 'carte']
          },
          {
            id: 'fr-s1-9',
            prompt: 'Assemble: “Do you speak English?”',
            translation: 'Do you speak English?',
            target: 'Parlez-vous anglais ?',
            words: ['Parlez-vous', 'anglais', '?'],
            distractors: ['français', 'je', 'parle']
          },
          {
            id: 'fr-s1-10',
            prompt: 'Assemble: “Everything is very delicious, thank you.”',
            translation: 'Everything is very delicious, thank you.',
            target: 'Tout est très bon, merci.',
            words: ['Tout', 'est', 'très', 'bon,', 'merci.'],
            distractors: ['rien', 'mauvais']
          },
          {
            id: 'fr-s1-11',
            prompt: 'Assemble: “I live in a small apartment.”',
            translation: 'I live in a small apartment.',
            target: 'J’habite dans un petit appartement.',
            words: ['J’habite', 'dans', 'un', 'petit', 'appartement.'],
            distractors: ['grande', 'maison', 'ville']
          },
          {
            id: 'fr-s1-12',
            prompt: 'Assemble: “Have a very good evening!”',
            translation: 'Have a very good evening!',
            target: 'Passez une très bonne soirée !',
            words: ['Passez', 'une', 'très', 'bonne', 'soirée', '!'],
            distractors: ['journée', 'matin']
          }
        ],
        listenings: [
          {
            id: 'fr-l1-1',
            targetAudio: 'Bonjour, comment allez-vous ce matin ?',
            phonetic: '/bɔ̃.ʒuʁ kɔ.mɑ̃ a.le vu sə ma.tɛ̃/',
            translation: 'Hello, how are you this morning?',
            options: [
              { id: 'o1', text: 'Bonjour, comment allez-vous ce matin ?', translation: 'Hello, how are you this morning?', correct: true },
              { id: 'o2', text: 'Bonsoir, où allez-vous ce soir ?', translation: 'Good evening, where are you going tonight?', correct: false },
              { id: 'o3', text: 'Au revoir, à demain matin !', translation: 'Goodbye, see you tomorrow morning!', correct: false },
              { id: 'o4', text: 'Merci beaucoup pour le café.', translation: 'Thank you very much for the coffee.', correct: false }
            ]
          },
          {
            id: 'fr-l1-2',
            targetAudio: 'Un café et un croissant chaud, s’il vous plaît.',
            phonetic: '/œ̃ ka.fe e œ̃ kʁwa.sɑ̃ ʃo s‿il vu plɛ/',
            translation: 'A coffee and a warm croissant, please.',
            options: [
              { id: 'o1', text: 'Un café et un croissant chaud, s’il vous plaît.', translation: 'A coffee and a warm croissant, please.', correct: true },
              { id: 'o2', text: 'Deux thés et une carafe d’eau, merci.', translation: 'Two teas and a pitcher of water, thanks.', correct: false },
              { id: 'o3', text: 'Je voudrais une salade verte.', translation: 'I would like a green salad.', correct: false },
              { id: 'o4', text: 'L’addition pour la table numéro trois.', translation: 'The bill for table number three.', correct: false }
            ]
          },
          {
            id: 'fr-l1-3',
            targetAudio: 'Excusez-moi, où se trouve le métro ?',
            phonetic: '/ɛk.sky.ze mwa u sə tʁuv lə me.tʁo/',
            translation: 'Excuse me, where is the metro?',
            options: [
              { id: 'o1', text: 'Excusez-moi, où se trouve le métro ?', translation: 'Excuse me, where is the metro located?', correct: true },
              { id: 'o2', text: 'Pardonnez-moi, quelle heure est-il ?', translation: 'Forgive me, what time is it?', correct: false },
              { id: 'o3', text: 'Voici votre billet de train pour Paris.', translation: 'Here is your train ticket to Paris.', correct: false },
              { id: 'o4', text: 'Je cherche la gare centrale.', translation: 'I am looking for the central station.', correct: false }
            ]
          },
          {
            id: 'fr-l1-4',
            targetAudio: 'Je suis enchanté de faire votre connaissance.',
            phonetic: '/ʒə sɥi ɑ̃.ʃɑ̃.te də fɛʁ vɔtʁ kɔ.nɛ.sɑ̃s/',
            translation: 'I am delighted to meet you.',
            options: [
              { id: 'o1', text: 'Je suis enchanté de faire votre connaissance.', translation: 'Delighted to make your acquaintance.', correct: true },
              { id: 'o2', text: 'Je suis fatigué ce soir après le travail.', translation: 'I am tired tonight after work.', correct: false },
              { id: 'o3', text: 'Nous allons passer une excellente soirée.', translation: 'We are going to have an excellent evening.', correct: false },
              { id: 'o4', text: 'Comment vous appelez-vous, monsieur ?', translation: 'What is your name, sir?', correct: false }
            ]
          },
          {
            id: 'fr-l1-5',
            targetAudio: 'Combien coûte cette belle carte postale ?',
            phonetic: '/kɔ̃.bjɛ̃ kut sɛt bɛl kaʁt pɔs.tal/',
            translation: 'How much is this beautiful postcard?',
            options: [
              { id: 'o1', text: 'Combien coûte cette belle carte postale ?', translation: 'How much does this pretty postcard cost?', correct: true },
              { id: 'o2', text: 'Où puis-je trouver un timbre postal ?', translation: 'Where can I find a postage stamp?', correct: false },
              { id: 'o3', text: 'Avez-vous de la monnaie s’il vous plaît ?', translation: 'Do you have change, please?', correct: false },
              { id: 'o4', text: 'C’est un cadeau pour un ami proche.', translation: 'It is a gift for a close friend.', correct: false }
            ]
          },
          {
            id: 'fr-l1-6',
            targetAudio: 'Passez une excellente journée à Lyon !',
            phonetic: '/pa.se y.n‿ɛk.sɛ.lɑ̃t ʒuʁ.ne a ljɔ̃/',
            translation: 'Have an excellent day in Lyon!',
            options: [
              { id: 'o1', text: 'Passez une excellente journée à Lyon !', translation: 'Have an excellent day in Lyon!', correct: true },
              { id: 'o2', text: 'Bonne nuit et dormez bien.', translation: 'Good night and sleep well.', correct: false },
              { id: 'o3', text: 'Nous arrivons bientôt à la gare de Lyon.', translation: 'We arrive soon at Gare de Lyon.', correct: false },
              { id: 'o4', text: 'Merci pour votre accueil chaleureux.', translation: 'Thank you for your warm welcome.', correct: false }
            ]
          },
          {
            id: 'fr-l1-7',
            targetAudio: 'Je ne comprends pas, pouvez-vous répéter ?',
            phonetic: '/ʒə nə kɔ̃.pʁɑ̃ pa pu.ve vu ʁe.pe.te/',
            translation: 'I do not understand, can you repeat?',
            options: [
              { id: 'o1', text: 'Je ne comprends pas, pouvez-vous répéter ?', translation: 'I do not understand, can you repeat?', correct: true },
              { id: 'o2', text: 'Je parle très bien français maintenant.', translation: 'I speak French very well now.', correct: false },
              { id: 'o3', text: 'Parlez un peu plus fort s’il vous plaît.', translation: 'Speak a little louder please.', correct: false },
              { id: 'o4', text: 'D’accord, nous pouvons commencer.', translation: 'Okay, we can begin.', correct: false }
            ]
          },
          {
            id: 'fr-l1-8',
            targetAudio: 'Il fait très beau et ensoleillé aujourd’hui.',
            phonetic: '/il fɛ tʁɛ bo e ɑ̃.sɔ.lɛ.je o.ʒuʁ.dɥi/',
            translation: 'The weather is very beautiful and sunny today.',
            options: [
              { id: 'o1', text: 'Il fait très beau et ensoleillé aujourd’hui.', translation: 'It is very beautiful and sunny today.', correct: true },
              { id: 'o2', text: 'Il pleut des cordes sur toute la ville.', translation: 'It is raining heavily over the whole city.', correct: false },
              { id: 'o3', text: 'Le vent souffle fort depuis ce matin.', translation: 'The wind has blown hard since this morning.', correct: false },
              { id: 'o4', text: 'Il fait un peu froid pour se promener.', translation: 'It is a bit cold to go for a walk.', correct: false }
            ]
          },
          {
            id: 'fr-l1-9',
            targetAudio: 'Une table pour deux personnes en terrasse.',
            phonetic: '/yn tabl puʁ dø pɛʁ.sɔn ɑ̃ tɛ.ʁas/',
            translation: 'A table for two on the terrace.',
            options: [
              { id: 'o1', text: 'Une table pour deux personnes en terrasse.', translation: 'A table for two people on the terrace.', correct: true },
              { id: 'o2', text: 'Une réservation pour quatre personnes ce soir.', translation: 'A reservation for four people tonight.', correct: false },
              { id: 'o3', text: 'Préférez-vous être assis à l’intérieur ?', translation: 'Do you prefer to be seated inside?', correct: false },
              { id: 'o4', text: 'Le restaurant ouvre à midi et demi.', translation: 'The restaurant opens at half past noon.', correct: false }
            ]
          },
          {
            id: 'fr-l1-10',
            targetAudio: 'À quelle heure part le prochain bus pour le centre ?',
            phonetic: '/a kɛl œʁ paʁ lə pʁɔ.ʃɛ̃ bys puʁ lə sɑ̃tʁ/',
            translation: 'What time does the next bus to center leave?',
            options: [
              { id: 'o1', text: 'À quelle heure part le prochain bus pour le centre ?', translation: 'What time does the next bus leave for center?', correct: true },
              { id: 'o2', text: 'Où achetez-vous vos tickets de transport ?', translation: 'Where do you buy your transit tickets?', correct: false },
              { id: 'o3', text: 'Le train a dix minutes de retard.', translation: 'The train is ten minutes delayed.', correct: false },
              { id: 'o4', text: 'Prenez la deuxième sortie à droite.', translation: 'Take the second exit on the right.', correct: false }
            ]
          },
          {
            id: 'fr-l1-11',
            targetAudio: 'J’ai acheté du fromage et du pain frais au marché.',
            phonetic: '/ʒ‿e aʃ.te dy fʁɔ.maʒ e dy pɛ̃ fʁɛ o maʁ.ʃe/',
            translation: 'I bought cheese and fresh bread at the market.',
            options: [
              { id: 'o1', text: 'J’ai acheté du fromage et du pain frais au marché.', translation: 'I bought cheese and fresh bread at market.', correct: true },
              { id: 'o2', text: 'Nous allons préparer le dîner ensemble.', translation: 'We are going to prepare dinner together.', correct: false },
              { id: 'o3', text: 'Il ne reste plus de fruits dans le panier.', translation: 'There is no fruit left in the basket.', correct: false },
              { id: 'o4', text: 'La boulangerie est fermée le lundi.', translation: 'The bakery is closed on Mondays.', correct: false }
            ]
          },
          {
            id: 'fr-l1-12',
            targetAudio: 'Merci infiniment pour votre aide précieuse !',
            phonetic: '/mɛʁ.si ɛ̃.fi.ni.mɑ̃ puʁ vɔtʁ ɛd pʁe.sjøz/',
            translation: 'Thank you infinitely for your precious help!',
            options: [
              { id: 'o1', text: 'Merci infiniment pour votre aide précieuse !', translation: 'Thank you so much for your precious help!', correct: true },
              { id: 'o2', text: 'De rien, c’était un véritable plaisir.', translation: 'You are welcome, it was a true pleasure.', correct: false },
              { id: 'o3', text: 'Bon courage pour la suite de vos projets.', translation: 'Good luck with the rest of your projects.', correct: false },
              { id: 'o4', text: 'À très bientôt, prenez bien soin de vous.', translation: 'See you very soon, take good care.', correct: false }
            ]
          }
        ],
        lightnings: [
          {
            id: 'fr-q1-1',
            question: 'How do you say “Good evening” politely in French?',
            correctAnswer: 'Bonsoir',
            options: ['Bonsoir', 'Bonjour', 'Bonne nuit', 'Salut'],
            explanation: '“Bonsoir” is used when greeting someone in the evening.'
          },
          {
            id: 'fr-q1-2',
            question: 'Complete: “S’il vous ____” (Please)',
            correctAnswer: 'plaît',
            options: ['plaît', 'voulez', 'merci', 'va'],
            explanation: '“S’il vous plaît” is the standard polite phrase for please.'
          },
          {
            id: 'fr-q1-3',
            question: 'Which word means “The water”?',
            correctAnswer: 'L’eau',
            options: ['L’eau', 'Le lait', 'Le pain', 'Le vin'],
            explanation: '“L’eau” (feminine noun with elision) means water.'
          },
          {
            id: 'fr-q1-4',
            question: 'How do you reply to “Merci beaucoup”?',
            correctAnswer: 'De rien',
            options: ['De rien', 'Au revoir', 'Pardon', 'Enchanté'],
            explanation: '“De rien” translates directly to “You are welcome / It’s nothing”.'
          },
          {
            id: 'fr-q1-5',
            question: 'Fill the blank: “Je ____ Pierre.” (My name is Pierre)',
            correctAnswer: 'm’appelle',
            options: ['m’appelle', 'suis', 'habite', 'parle'],
            explanation: '“Je m’appelle” is used for introducing your name.'
          },
          {
            id: 'fr-q1-6',
            question: 'What does “Où est la gare ?” mean?',
            correctAnswer: 'Where is the train station?',
            options: ['Where is the train station?', 'Where is the airport?', 'Where is the metro?', 'Where is the bus?'],
            explanation: '“La gare” specifically denotes a railway train station.'
          },
          {
            id: 'fr-q1-7',
            question: 'Which of the following is “Goodbye”?',
            correctAnswer: 'Au revoir',
            options: ['Au revoir', 'Bonjour', 'Bienvenue', 'Bonsoir'],
            explanation: '“Au revoir” is the universal parting phrase.'
          },
          {
            id: 'fr-q1-8',
            question: 'Fill the blank: “Une table pour ____ personnes.” (two people)',
            correctAnswer: 'deux',
            options: ['deux', 'un', 'dix', 'trois'],
            explanation: '“Deux” is the number two in French.'
          },
          {
            id: 'fr-q1-9',
            question: 'How do you ask for the restaurant bill?',
            correctAnswer: 'L’addition, s’il vous plaît.',
            options: ['L’addition, s’il vous plaît.', 'Le menu, s’il vous plaît.', 'La table, merci.', 'Le verre d’eau.'],
            explanation: '“L’addition” is the standard French term for dining check/bill.'
          },
          {
            id: 'fr-q1-10',
            question: 'What is the meaning of “Enchanté”?',
            correctAnswer: 'Nice to meet you',
            options: ['Nice to meet you', 'Excuse me', 'Good morning', 'Have a good trip'],
            explanation: '“Enchanté” means enchanted or delighted to meet you.'
          },
          {
            id: 'fr-q1-11',
            question: 'Fill the blank: “Parlez-vous ____ ?” (English)',
            correctAnswer: 'anglais',
            options: ['anglais', 'français', 'espagnol', 'italien'],
            explanation: '“Anglais” means English.'
          },
          {
            id: 'fr-q1-12',
            question: 'Which word means “Excuse me” in French?',
            correctAnswer: 'Pardon',
            options: ['Pardon', 'Merci', 'Oui', 'Non'],
            explanation: '“Pardon” or “Excusez-moi” expresses polite apology or getting attention.'
          }
        ]
      },
      {
        levelNumber: 1,
        batchId: 2,
        pairs: [
          { id: 'fr-p2-1', left: 'la ville', right: 'the city / town', audio: 'la ville' },
          { id: 'fr-p2-2', left: 'la maison', right: 'the house', audio: 'la maison' },
          { id: 'fr-p2-3', left: 'le train', right: 'the train', audio: 'le train' },
          { id: 'fr-p2-4', left: 'la rue', right: 'the street', audio: 'la rue' },
          { id: 'fr-p2-5', left: 'le fromage', right: 'the cheese', audio: 'le fromage' },
          { id: 'fr-p2-6', left: 'la pomme', right: 'the apple', audio: 'la pomme' },
          { id: 'fr-p2-7', left: 'le livre', right: 'the book', audio: 'le livre' },
          { id: 'fr-p2-8', left: 'la musique', right: 'the music', audio: 'la musique' },
          { id: 'fr-p2-9', left: 'le restaurant', right: 'the restaurant', audio: 'le restaurant' },
          { id: 'fr-p2-10', left: 'la mer', right: 'the sea', audio: 'la mer' },
          { id: 'fr-p2-11', left: 'le soleil', right: 'the sun', audio: 'le soleil' },
          { id: 'fr-p2-12', left: 'la famille', right: 'the family', audio: 'la famille' },
          { id: 'fr-p2-13', left: 'le matin', right: 'the morning', audio: 'le matin' },
          { id: 'fr-p2-14', left: 'le soir', right: 'the evening', audio: 'le soir' }
        ],
        sentences: [
          {
            id: 'fr-s2-1',
            prompt: 'Assemble: “We are eating fresh bread.”',
            translation: 'We are eating fresh bread.',
            target: 'Nous mangeons du pain frais.',
            words: ['Nous', 'mangeons', 'du', 'pain', 'frais.'],
            distractors: ['vous', 'buvez', 'lait']
          },
          {
            id: 'fr-s2-2',
            prompt: 'Assemble: “She is visiting a big museum.”',
            translation: 'She is visiting a big museum.',
            target: 'Elle visite un grand musée.',
            words: ['Elle', 'visite', 'un', 'grand', 'musée.'],
            distractors: ['il', 'petite', 'gare']
          },
          {
            id: 'fr-s2-3',
            prompt: 'Assemble: “Where is the nearest pharmacy?”',
            translation: 'Where is the nearest pharmacy?',
            target: 'Où est la pharmacie la plus proche ?',
            words: ['Où', 'est', 'la', 'pharmacie', 'la', 'plus', 'proche', '?'],
            distractors: ['loin', 'banque', 'café']
          },
          {
            id: 'fr-s2-4',
            prompt: 'Assemble: “I would like to reserve a table.”',
            translation: 'I would like to reserve a table.',
            target: 'J’aimerais réserver une table.',
            words: ['J’aimerais', 'réserver', 'une', 'table.'],
            distractors: ['partir', 'manger', 'gare']
          },
          {
            id: 'fr-s2-5',
            prompt: 'Assemble: “The weather is pleasant this afternoon.”',
            translation: 'The weather is pleasant this afternoon.',
            target: 'Le temps est agréable cet après-midi.',
            words: ['Le', 'temps', 'est', 'agréable', 'cet', 'après-midi.'],
            distractors: ['matin', 'froid', 'pleut']
          },
          {
            id: 'fr-s2-6',
            prompt: 'Assemble: “Can you help me please?”',
            translation: 'Can you help me please?',
            target: 'Pouvez-vous m’aider s’il vous plaît ?',
            words: ['Pouvez-vous', 'm’aider', 's’il', 'vous', 'plaît', '?'],
            distractors: ['parler', 'merci', 'aller']
          },
          {
            id: 'fr-s2-7',
            prompt: 'Assemble: “They live in the city center.”',
            translation: 'They live in the city center.',
            target: 'Ils habitent dans le centre-ville.',
            words: ['Ils', 'habitent', 'dans', 'le', 'centre-ville.'],
            distractors: ['campagne', 'nous', 'maison']
          },
          {
            id: 'fr-s2-8',
            prompt: 'Assemble: “I don’t have enough cash.”',
            translation: 'I do not have enough cash.',
            target: 'Je n’ai pas assez d’argent liquide.',
            words: ['Je', 'n’ai', 'pas', 'assez', 'd’argent', 'liquide.'],
            distractors: ['beaucoup', 'carte', 'banque']
          },
          {
            id: 'fr-s2-9',
            prompt: 'Assemble: “Take the first street on the left.”',
            translation: 'Take the first street on the left.',
            target: 'Prenez la première rue à gauche.',
            words: ['Prenez', 'la', 'première', 'rue', 'à', 'gauche.'],
            distractors: ['droite', 'deuxième', 'tout']
          },
          {
            id: 'fr-s2-10',
            prompt: 'Assemble: “We are very glad to see you.”',
            translation: 'We are very glad to see you.',
            target: 'Nous sommes très contents de vous voir.',
            words: ['Nous', 'sommes', 'très', 'contents', 'de', 'vous', 'voir.'],
            distractors: ['tristes', 'ils', 'partir']
          },
          {
            id: 'fr-s2-11',
            prompt: 'Assemble: “What is your favorite book?”',
            translation: 'What is your favorite book?',
            target: 'Quel est votre livre préféré ?',
            words: ['Quel', 'est', 'votre', 'livre', 'préféré', '?'],
            distractors: ['film', 'chanson', 'qui']
          },
          {
            id: 'fr-s2-12',
            prompt: 'Assemble: “See you next Saturday morning!”',
            translation: 'See you next Saturday morning!',
            target: 'À samedi matin prochain !',
            words: ['À', 'samedi', 'matin', 'prochain', '!'],
            distractors: ['dimanche', 'hier', 'soir']
          }
        ],
        listenings: [
          {
            id: 'fr-l2-1',
            targetAudio: 'La boulangerie ouvre ses portes tous les matins à sept heures.',
            phonetic: '/la bu.lɑ̃ʒ.ʁi uvʁ se pɔʁt tu le ma.tɛ̃ a sɛ.t‿œʁ/',
            translation: 'The bakery opens every morning at seven.',
            options: [
              { id: 'o1', text: 'La boulangerie ouvre ses portes tous les matins à sept heures.', translation: 'The bakery opens every morning at seven o’clock.', correct: true },
              { id: 'o2', text: 'Le supermarché est ouvert jusqu’à vingt heures.', translation: 'The supermarket is open until 8 PM.', correct: false },
              { id: 'o3', text: 'Nous allons chercher des croissants chauds.', translation: 'We are going to pick up warm croissants.', correct: false },
              { id: 'o4', text: 'La pharmacie de garde est fermée ce soir.', translation: 'The duty pharmacy is closed tonight.', correct: false }
            ]
          },
          {
            id: 'fr-l2-2',
            targetAudio: 'Prenez la deuxième rue à droite après le carrefour.',
            phonetic: '/pʁə.ne la dø.zjɛm ʁy a dʁwat a.pʁɛ lə kaʁ.fuʁ/',
            translation: 'Take the second street on the right after intersection.',
            options: [
              { id: 'o1', text: 'Prenez la deuxième rue à droite après le carrefour.', translation: 'Take the second street on the right after the crossroads.', correct: true },
              { id: 'o2', text: 'Allez tout droit jusqu’au prochain feu rouge.', translation: 'Go straight until the next red light.', correct: false },
              { id: 'o3', text: 'Tournez à gauche devant le grand musée.', translation: 'Turn left in front of the large museum.', correct: false },
              { id: 'o4', text: 'La station de métro est juste en face.', translation: 'The subway station is right across.', correct: false }
            ]
          },
          {
            id: 'fr-l2-3',
            targetAudio: 'Nous aimerions réserver deux billets en première classe.',
            phonetic: '/nu.z‿ɛm.ʁjɔ̃ ʁe.zɛʁ.ve dø bi.jɛ ɑ̃ pʁə.mjɛʁ klas/',
            translation: 'We would like to book two tickets in first class.',
            options: [
              { id: 'o1', text: 'Nous aimerions réserver deux billets en première classe.', translation: 'We would like to reserve two tickets in first class.', correct: true },
              { id: 'o2', text: 'Quel est le prix pour un aller simple ?', translation: 'What is the price for a one-way ticket?', correct: false },
              { id: 'o3', text: 'Le train pour Marseille part de la voie numéro deux.', translation: 'The train to Marseille leaves from track two.', correct: false },
              { id: 'o4', text: 'Avez-vous vos cartes d’embarquement prêtes ?', translation: 'Do you have your boarding passes ready?', correct: false }
            ]
          },
          {
            id: 'fr-l2-4',
            targetAudio: 'Ce gâteau au chocolat maison est vraiment délicieux.',
            phonetic: '/sə ɡa.to o ʃɔ.kɔ.la mɛ.zɔ̃ ɛ vʁɛ.mɑ̃ de.li.sjø/',
            translation: 'This homemade chocolate cake is truly delicious.',
            options: [
              { id: 'o1', text: 'Ce gâteau au chocolat maison est vraiment délicieux.', translation: 'This homemade chocolate cake is truly delicious.', correct: true },
              { id: 'o2', text: 'Préférez-vous une tarte aux pommes chaude ?', translation: 'Do you prefer a warm apple tart?', correct: false },
              { id: 'o3', text: 'Nous prenons toujours une glace à la vanille.', translation: 'We always take a vanilla ice cream.', correct: false },
              { id: 'o4', text: 'Le café gourmand est servi avec trois mignardises.', translation: 'The gourmet coffee is served with three pastries.', correct: false }
            ]
          },
          {
            id: 'fr-l2-5',
            targetAudio: 'J’ai passé un week-end formidable au bord de la mer.',
            phonetic: '/ʒ‿e pa.se œ̃ wi.kɛnd fɔʁ.mi.dabl o bɔʁ də la mɛʁ/',
            translation: 'I spent a wonderful weekend by the seaside.',
            options: [
              { id: 'o1', text: 'J’ai passé un week-end formidable au bord de la mer.', translation: 'I spent a wonderful weekend by the sea.', correct: true },
              { id: 'o2', text: 'Nous partons demain faire de la randonnée en montagne.', translation: 'We leave tomorrow to hike in the mountains.', correct: false },
              { id: 'o3', text: 'Le musée d’art moderne était très intéressant.', translation: 'The modern art museum was very interesting.', correct: false },
              { id: 'o4', text: 'J’adore nager dans la piscine municipale.', translation: 'I love swimming in the municipal pool.', correct: false }
            ]
          },
          {
            id: 'fr-l2-6',
            targetAudio: 'Pourriez-vous m’indiquer le chemin le plus rapide ?',
            phonetic: '/pu.ʁje vu m‿ɛ̃.di.ke lə ʃmɛ̃ lə ply ʁa.pid/',
            translation: 'Could you indicate the fastest way to me?',
            options: [
              { id: 'o1', text: 'Pourriez-vous m’indiquer le chemin le plus rapide ?', translation: 'Could you show me the fastest path?', correct: true },
              { id: 'o2', text: 'Combien de temps faut-il pour aller au centre ?', translation: 'How long does it take to get to center?', correct: false },
              { id: 'o3', text: 'Y a-t-il une navette directe vers l’aéroport ?', translation: 'Is there a direct shuttle to the airport?', correct: false },
              { id: 'o4', text: 'Je suis un peu perdu dans ce quartier.', translation: 'I am a little lost in this neighborhood.', correct: false }
            ]
          },
          {
            id: 'fr-l2-7',
            targetAudio: 'Je cherche une paire de chaussures confortables pour marcher.',
            phonetic: '/ʒə ʃɛʁʃ yn pɛʁ də ʃo.syʁ kɔ̃.fɔʁ.tabl puʁ maʁ.ʃe/',
            translation: 'I am looking for a pair of comfortable walking shoes.',
            options: [
              { id: 'o1', text: 'Je cherche une paire de chaussures confortables pour marcher.', translation: 'Looking for comfortable shoes for walking.', correct: true },
              { id: 'o2', text: 'Avez-vous cette veste en taille moyenne ?', translation: 'Do you have this jacket in medium size?', correct: false },
              { id: 'o3', text: 'Où se trouvent les cabines d’essayage ?', translation: 'Where are the fitting rooms located?', correct: false },
              { id: 'o4', text: 'Ces vêtements sont fabriqués en France.', translation: 'These clothes are made in France.', correct: false }
            ]
          },
          {
            id: 'fr-l2-8',
            targetAudio: 'Tous les dimanches, nous déjeunons en famille chez mes grands-parents.',
            phonetic: '/tu le di.mɑ̃ʃ nu de.ʒœ.nɔ̃ ɑ̃ fa.mij ʃe me ɡʁɑ̃.pa.ʁɑ̃/',
            translation: 'Every Sunday we have family lunch at grandparents.',
            options: [
              { id: 'o1', text: 'Tous les dimanches, nous déjeunons en famille chez mes grands-parents.', translation: 'Every Sunday we have lunch at grandparents.', correct: true },
              { id: 'o2', text: 'Mes cousins viennent nous rendre visite samedi.', translation: 'My cousins are visiting us on Saturday.', correct: false },
              { id: 'o3', text: 'Nous préparons un grand repas pour leur anniversaire.', translation: 'We are preparing a big meal for their birthday.', correct: false },
              { id: 'o4', text: 'C’est toujours un moment chaleureux et convivial.', translation: 'It is always a warm and convivial moment.', correct: false }
            ]
          },
          {
            id: 'fr-l2-9',
            targetAudio: 'Le concert commence à vingt heures précises ce soir.',
            phonetic: '/lə kɔ̃.sɛʁ kɔ.mɑ̃s a vɛ̃.t‿œʁ pʁe.siz sə swaʁ/',
            translation: 'The concert begins at 8:00 PM sharp tonight.',
            options: [
              { id: 'o1', text: 'Le concert commence à vingt heures précises ce soir.', translation: 'The concert begins at 8:00 PM sharp tonight.', correct: true },
              { id: 'o2', text: 'Les portes de la salle ouvrent à dix-neuf heures.', translation: 'The doors open at 7:00 PM.', correct: false },
              { id: 'o3', text: 'N’oubliez pas d’éteindre vos téléphones portables.', translation: 'Do not forget to turn off your mobile phones.', correct: false },
              { id: 'o4', text: 'C’était une performance musicale inoubliable.', translation: 'It was an unforgettable musical performance.', correct: false }
            ]
          },
          {
            id: 'fr-l2-10',
            targetAudio: 'Il est très important de boire beaucoup d’eau chaque jour.',
            phonetic: '/i.l‿ɛ tʁɛ.z‿ɛ̃.pɔʁ.tɑ̃ də bwaʁ bo.ku d‿o ʃak ʒuʁ/',
            translation: 'It is very important to drink plenty of water daily.',
            options: [
              { id: 'o1', text: 'Il est très important de boire beaucoup d’eau chaque jour.', translation: 'Very important to drink lots of water every day.', correct: true },
              { id: 'o2', text: 'Faire du sport régulièrement est bon pour la santé.', translation: 'Exercising regularly is good for health.', correct: false },
              { id: 'o3', text: 'Dormir huit heures par nuit aide à rester en forme.', translation: 'Sleeping eight hours a night helps stay fit.', correct: false },
              { id: 'o4', text: 'Mangez au moins cinq fruits et légumes par jour.', translation: 'Eat at least five fruits and vegetables daily.', correct: false }
            ]
          },
          {
            id: 'fr-l2-11',
            targetAudio: 'Avez-vous bien reçu mon courriel avec les pièces jointes ?',
            phonetic: '/a.ve vu bjɛ̃ ʁə.sy mɔ̃ ku.ʁjɛl a.vɛk le pjɛs ʒwɛ̃t/',
            translation: 'Did you receive my email with attachments?',
            options: [
              { id: 'o1', text: 'Avez-vous bien reçu mon courriel avec les pièces jointes ?', translation: 'Did you receive my email with attachments?', correct: true },
              { id: 'o2', text: 'Je vous envoie le contrat signé dès cet après-midi.', translation: 'I will send the signed contract this afternoon.', correct: false },
              { id: 'o3', text: 'Merci pour votre réponse rapide et détaillée.', translation: 'Thank you for your prompt and detailed reply.', correct: false },
              { id: 'o4', text: 'La réunion de projet aura lieu vendredi matin.', translation: 'The project meeting will take place Friday.', correct: false }
            ]
          },
          {
            id: 'fr-l2-12',
            targetAudio: 'C’était un immense plaisir de partager ce moment avec vous !',
            phonetic: '/s‿e.tɛ œ̃.n‿i.mɑ̃s plɛ.ziʁ də paʁ.ta.ʒe sə mɔ.mɑ̃ a.vɛk vu/',
            translation: 'It was an immense pleasure to share this moment with you!',
            options: [
              { id: 'o1', text: 'C’était un immense plaisir de partager ce moment avec vous !', translation: 'It was an immense pleasure to share this moment with you!', correct: true },
              { id: 'o2', text: 'Nous espérons vous revoir très bientôt parmi nous.', translation: 'We hope to see you again among us very soon.', correct: false },
              { id: 'o3', text: 'Je vous souhaite un excellent voyage de retour.', translation: 'I wish you an excellent return journey.', correct: false },
              { id: 'o4', text: 'Prenez bien soin de vous et à la prochaine !', translation: 'Take good care and see you next time!', correct: false }
            ]
          }
        ],
        lightnings: [
          {
            id: 'fr-q2-1',
            question: 'What is the plural of “un ami”?',
            correctAnswer: 'des amis',
            options: ['des amis', 'les ami', 'un amis', 'des amies'],
            explanation: '“Un ami” becomes “des amis” in the plural indefinite form.'
          },
          {
            id: 'fr-q2-2',
            question: 'Which word means “The cheese” in French?',
            correctAnswer: 'Le fromage',
            options: ['Le fromage', 'Le pain', 'Le beurre', 'Le lait'],
            explanation: '“Le fromage” is masculine singular for cheese.'
          },
          {
            id: 'fr-q2-3',
            question: 'Complete: “Nous ____ au restaurant.” (We are going)',
            correctAnswer: 'allons',
            options: ['allons', 'va', 'allez', 'vont'],
            explanation: 'Conjugation of “aller” with “nous” is “allons”.'
          },
          {
            id: 'fr-q2-4',
            question: 'What does “La mer” translate to?',
            correctAnswer: 'The sea',
            options: ['The sea', 'The mother', 'The city', 'The mountain'],
            explanation: '“La mer” means the sea / ocean.'
          },
          {
            id: 'fr-q2-5',
            question: 'Which verb means “To understand”?',
            correctAnswer: 'Comprendre',
            options: ['Comprendre', 'Apprendre', 'Prendre', 'Vendre'],
            explanation: '“Comprendre” means to understand.'
          },
          {
            id: 'fr-q2-6',
            question: 'Complete: “Je voudrais ____ pomme.” (an apple)',
            correctAnswer: 'une',
            options: ['une', 'un', 'du', 'des'],
            explanation: '“Pomme” is feminine, so it uses the indefinite article “une”.'
          },
          {
            id: 'fr-q2-7',
            question: 'How do you say “See you tomorrow”?',
            correctAnswer: 'À demain',
            options: ['À demain', 'À bientôt', 'Au revoir', 'À tout à l’heure'],
            explanation: '“À demain” specifically means “until tomorrow”.'
          },
          {
            id: 'fr-q2-8',
            question: 'What is “The sun” in French?',
            correctAnswer: 'Le soleil',
            options: ['Le soleil', 'La lune', 'Le ciel', 'La pluie'],
            explanation: '“Le soleil” is masculine for sun.'
          },
          {
            id: 'fr-q2-9',
            question: 'Fill in: “Ils ____ français.” (They speak)',
            correctAnswer: 'parlent',
            options: ['parlent', 'parle', 'parlons', 'parlez'],
            explanation: 'The 3rd-person plural ending for regular -er verbs is “-ent”.'
          },
          {
            id: 'fr-q2-10',
            question: 'What does “À gauche” mean?',
            correctAnswer: 'To the left',
            options: ['To the left', 'To the right', 'Straight ahead', 'Behind'],
            explanation: '“À gauche” means on or to the left.'
          },
          {
            id: 'fr-q2-11',
            question: 'Which word translates to “The house”?',
            correctAnswer: 'La maison',
            options: ['La maison', 'Le bâtiment', 'La chambre', 'Le jardin'],
            explanation: '“La maison” is the feminine French noun for house.'
          },
          {
            id: 'fr-q2-12',
            question: 'Complete: “C’est un ____ musée.” (big museum)',
            correctAnswer: 'grand',
            options: ['grand', 'grande', 'grands', 'grandes'],
            explanation: '“Musée” is masculine singular, preceded by “grand”.'
          }
        ]
      }
    ]
  },
  'Chinese Mandarin': {
    1: [
      {
        levelNumber: 1,
        batchId: 1,
        pairs: [
          { id: 'zh-p1-1', left: '你好 (nǐ hǎo)', right: 'hello', audio: '你好' },
          { id: 'zh-p1-2', left: '谢谢 (xièxie)', right: 'thank you', audio: '谢谢' },
          { id: 'zh-p1-3', left: '再见 (zàijiàn)', right: 'goodbye', audio: '再见' },
          { id: 'zh-p1-4', left: '请 (qǐng)', right: 'please', audio: '请' },
          { id: 'zh-p1-5', left: '对不起 (duìbuqǐ)', right: 'sorry / excuse me', audio: '对不起' },
          { id: 'zh-p1-6', left: '没关系 (méi guānxi)', right: 'no problem / it’s okay', audio: '没关系' },
          { id: 'zh-p1-7', left: '水 (shuǐ)', right: 'water', audio: '水' },
          { id: 'zh-p1-8', left: '茶 (chá)', right: 'tea', audio: '茶' },
          { id: 'zh-p1-9', left: '米饭 (mǐfàn)', right: 'rice', audio: '米饭' },
          { id: 'zh-p1-10', left: '中国 (zhōngguó)', right: 'China', audio: '中国' },
          { id: 'zh-p1-11', left: '朋友 (péngyou)', right: 'friend', audio: '朋友' },
          { id: 'zh-p1-12', left: '北京 (běijīng)', right: 'Beijing', audio: '北京' },
          { id: 'zh-p1-13', left: '吃 (chī)', right: 'to eat', audio: '吃' },
          { id: 'zh-p1-14', left: '喝 (hē)', right: 'to drink', audio: '喝' }
        ],
        sentences: [
          {
            id: 'zh-s1-1',
            prompt: 'Assemble: “Hello, pleased to meet you!”',
            translation: 'Hello, pleased to meet you!',
            target: '你好，很高兴认识你！',
            words: ['你好，', '很高兴', '认识', '你！'],
            distractors: ['再见', '谢谢']
          },
          {
            id: 'zh-s1-2',
            prompt: 'Assemble: “Please give me a cup of hot tea.”',
            translation: 'Please give me a cup of hot tea.',
            target: '请给我一杯热茶。',
            words: ['请', '给我', '一杯', '热茶。'],
            distractors: ['冰水', '米饭', '再见']
          },
          {
            id: 'zh-s1-3',
            prompt: 'Assemble: “Excuse me, how much is this?”',
            translation: 'Excuse me, how much is this?',
            target: '请问，这个多少钱？',
            words: ['请问，', '这个', '多少', '钱？'],
            distractors: ['在哪里', '是谁']
          },
          {
            id: 'zh-s1-4',
            prompt: 'Assemble: “My name is Alex, I am a student.”',
            translation: 'My name is Alex, I am a student.',
            target: '我叫亚历克斯，我是学生。',
            words: ['我叫', '亚历克斯，', '我是', '学生。'],
            distractors: ['老师', '去', '中国']
          },
          {
            id: 'zh-s1-5',
            prompt: 'Assemble: “Where is the restroom, please?”',
            translation: 'Where is the restroom, please?',
            target: '请问洗手间在哪里？',
            words: ['请问', '洗手间', '在', '哪里？'],
            distractors: ['地铁站', '饭店']
          },
          {
            id: 'zh-s1-6',
            prompt: 'Assemble: “Today the weather is very good.”',
            translation: 'Today the weather is very good.',
            target: '今天天气非常好。',
            words: ['今天', '天气', '非常', '好。'],
            distractors: ['昨天', '下雨', '冷']
          },
          {
            id: 'zh-s1-7',
            prompt: 'Assemble: “I like learning Chinese very much.”',
            translation: 'I like learning Chinese very much.',
            target: '我很喜欢学习中文。',
            words: ['我', '很喜欢', '学习', '中文。'],
            distractors: ['英文', '不', '去']
          },
          {
            id: 'zh-s1-8',
            prompt: 'Assemble: “Can you speak English?”',
            translation: 'Can you speak English?',
            target: '你会说英语吗？',
            words: ['你', '会说', '英语', '吗？'],
            distractors: ['汉语', '写', '吃']
          },
          {
            id: 'zh-s1-9',
            prompt: 'Assemble: “Waiter, check the bill please.”',
            translation: 'Waiter, check the bill please.',
            target: '服务员，请买单。',
            words: ['服务员，', '请', '买单。'],
            distractors: ['菜单', '茶水', '来']
          },
          {
            id: 'zh-s1-10',
            prompt: 'Assemble: “See you tomorrow morning at eight!”',
            translation: 'See you tomorrow morning at eight!',
            target: '明天早上八点见！',
            words: ['明天', '早上', '八点', '见！'],
            distractors: ['晚上', '七点', '昨天']
          },
          {
            id: 'zh-s1-11',
            prompt: 'Assemble: “This dish is very delicious.”',
            translation: 'This dish is very delicious.',
            target: '这道菜非常美味。',
            words: ['这道', '菜', '非常', '美味。'],
            distractors: ['不好吃', '辣', '水']
          },
          {
            id: 'zh-s1-12',
            prompt: 'Assemble: “Thank you for your warm help!”',
            translation: 'Thank you for your warm help!',
            target: '谢谢你热情的帮助！',
            words: ['谢谢', '你', '热情的', '帮助！'],
            distractors: ['客气', '再见', '请']
          }
        ],
        listenings: [
          {
            id: 'zh-l1-1',
            targetAudio: '你好，请问去最近的地铁站怎么走？',
            phonetic: 'Nǐ hǎo, qǐngwèn qù zuìjìn de dìtiězhàn zěnme zǒu?',
            translation: 'Hello, how do I get to the nearest subway station?',
            options: [
              { id: 'o1', text: '你好，请问去最近的地铁站怎么走？', translation: 'Hello, how do I get to nearest subway station?', correct: true },
              { id: 'o2', text: '你好，请问现在几点钟了？', translation: 'Hello, what time is it now?', correct: false },
              { id: 'o3', text: '这里的出租车在哪里乘坐？', translation: 'Where do I catch a taxi here?', correct: false },
              { id: 'o4', text: '我要买一张去北京的火车票。', translation: 'I want to buy a train ticket to Beijing.', correct: false }
            ]
          },
          {
            id: 'zh-l1-2',
            targetAudio: '服务员，请给我们来两杯热茉莉花茶。',
            phonetic: 'Fúwùyuán, qǐng gěi wǒmen lái liǎng bēi rè mòlìhuā chá.',
            translation: 'Waiter, please bring us two cups of hot jasmine tea.',
            options: [
              { id: 'o1', text: '服务员，请给我们来两杯热茉莉花茶。', translation: 'Waiter, please bring us two hot jasmine teas.', correct: true },
              { id: 'o2', text: '请问今天有什么特色的点心吗？', translation: 'What specialty dim sum is there today?', correct: false },
              { id: 'o3', text: '我们一共是四位客人用餐。', translation: 'We are four guests dining in total.', correct: false },
              { id: 'o4', text: '买单一共是一百二十块钱。', translation: 'The bill is 120 yuan total.', correct: false }
            ]
          },
          {
            id: 'zh-l1-3',
            targetAudio: '非常高兴今天能在北京认识你！',
            phonetic: 'Fēicháng gāoxìng jīntiān néng zài Běijīng rènshi nǐ!',
            translation: 'Very happy to meet you today in Beijing!',
            options: [
              { id: 'o1', text: '非常高兴今天能在北京认识你！', translation: 'Very glad to meet you in Beijing today!', correct: true },
              { id: 'o2', text: '你明天打算去参观故宫博物院吗？', translation: 'Do you plan to visit the Forbidden City tomorrow?', correct: false },
              { id: 'o3', text: '祝你一路平安，北京欢迎你。', translation: 'Wish you safe travels, Beijing welcomes you.', correct: false },
              { id: 'o4', text: '我的家人目前都在上海生活。', translation: 'My family currently lives in Shanghai.', correct: false }
            ]
          },
          {
            id: 'zh-l1-4',
            targetAudio: '请问这件红色的衣服多少钱一件？',
            phonetic: 'Qǐngwèn zhè jiàn hóngsè de yīfu duōshao qián yí jiàn?',
            translation: 'Excuse me, how much is this red clothing item?',
            options: [
              { id: 'o1', text: '请问这件红色的衣服多少钱一件？', translation: 'How much is this red clothing item?', correct: true },
              { id: 'o2', text: '请问试衣间在哪个方向？', translation: 'Where is the fitting room located?', correct: false },
              { id: 'o3', text: '这双鞋子有大一点的尺码吗？', translation: 'Do these shoes have a bigger size?', correct: false },
              { id: 'o4', text: '可以用手机移动支付付款吗？', translation: 'Can I pay with mobile payment?', correct: false }
            ]
          },
          {
            id: 'zh-l1-5',
            targetAudio: '洗手间就在前面走廊的右手边。',
            phonetic: 'Xǐshǒujiān jiù zài qiánmian zǒuláng de yòushǒu biān.',
            translation: 'Restroom is right on the right side of corridor ahead.',
            options: [
              { id: 'o1', text: '洗手间就在前面走廊的右手边。', translation: 'The restroom is right along the hallway on the right.', correct: true },
              { id: 'o2', text: '电梯在楼梯的左边靠窗位置。', translation: 'The elevator is to the left of stairs by window.', correct: false },
              { id: 'o3', text: '请跟我来，座位已经准备好了。', translation: 'Please follow me, the table is ready.', correct: false },
              { id: 'o4', text: '大堂入口处有中文咨询服务台。', translation: 'There is an info desk in the lobby entrance.', correct: false }
            ]
          },
          {
            id: 'zh-l1-6',
            targetAudio: '今天天气晴朗，微风吹拂非常舒服。',
            phonetic: 'Jīntiān tiānqì qínglǎng, wēifēng chuīfú fēicháng shūfu.',
            translation: 'Today is sunny, the breeze is very pleasant.',
            options: [
              { id: 'o1', text: '今天天气晴朗，微风吹拂非常舒服。', translation: 'The weather is clear and breeze is very comfortable.', correct: true },
              { id: 'o2', text: '明天傍晚全城可能会有阵雨。', translation: 'There might be showers citywide tomorrow evening.', correct: false },
              { id: 'o3', text: '冬天北方气温比较低，要多穿衣服。', translation: 'Winter in North is cold, wear more clothes.', correct: false },
              { id: 'o4', text: '秋天是游览北京香山最美的季节。', translation: 'Autumn is the best season to tour Fragrant Hills.', correct: false }
            ]
          },
          {
            id: 'zh-l1-7',
            targetAudio: '不好意思，请问您刚才说了什么？',
            phonetic: 'Bù hǎoyìsi, qǐngwèn nín gāngcái shuō le shénme?',
            translation: 'Sorry, could you please repeat what you said?',
            options: [
              { id: 'o1', text: '不好意思，请问您刚才说了什么？', translation: 'Pardon me, what did you just say?', correct: true },
              { id: 'o2', text: '没关系，我们有充裕的时间。', translation: 'No worries, we have plenty of time.', correct: false },
              { id: 'o3', text: '请您在这里签一下中文全名。', translation: 'Please sign your full Chinese name here.', correct: false },
              { id: 'o4', text: '您需要把发票打印出来吗？', translation: 'Do you need the invoice printed out?', correct: false }
            ]
          },
          {
            id: 'zh-l1-8',
            targetAudio: '我想预订一张明天晚上七点的两人桌。',
            phonetic: 'Wǒ xiǎng yùdìng yì zhāng míngtiān wǎnshang qī diǎn de liǎng rén zhuō.',
            translation: 'I’d like to reserve a table for two tomorrow at 7 PM.',
            options: [
              { id: 'o1', text: '我想预订一张明天晚上七点的两人桌。', translation: 'I want to reserve a table for two tomorrow at 7 PM.', correct: true },
              { id: 'o2', text: '请帮我们把剩下的菜品打包带走。', translation: 'Please pack up the remaining dishes for takeout.', correct: false },
              { id: 'o3', text: '这家餐厅的烤鸭味道非常地道。', translation: 'The roast duck in this restaurant is authentic.', correct: false },
              { id: 'o4', text: '请问今晚还有空闲的包厢吗？', translation: 'Are there any private dining rooms free tonight?', correct: false }
            ]
          },
          {
            id: 'zh-l1-9',
            targetAudio: '你的中文说得非常标准，语调很自然！',
            phonetic: 'Nǐ de zhōngwén shuō de fēicháng biāozhǔn, yǔdiào hěn zìrán!',
            translation: 'Your Chinese is so standard, intonation is very natural!',
            options: [
              { id: 'o1', text: '你的中文说得非常标准，语调很自然！', translation: 'Your Chinese pronunciation is very standard and natural!', correct: true },
              { id: 'o2', text: '你学习汉语多长时间了呢？', translation: 'How long have you been studying Chinese?', correct: false },
              { id: 'o3', text: '汉字的书写对你来说难不难？', translation: 'Is writing Chinese characters hard for you?', correct: false },
              { id: 'o4', text: '多听广播对提高听力很有帮助。', translation: 'Listening to radio helps improve listening skills.', correct: false }
            ]
          },
          {
            id: 'zh-l1-10',
            targetAudio: '明天早上八点半我们在学校门口碰面。',
            phonetic: 'Míngtiān zǎoshang bā diǎn bàn wǒmen zài xuéxiào ménkǒu pèngmiàn.',
            translation: 'Tomorrow morning at 8:30 we meet at school gate.',
            options: [
              { id: 'o1', text: '明天早上八点半我们在学校门口碰面。', translation: 'Tomorrow at 8:30 AM we meet at school gate.', correct: true },
              { id: 'o2', text: '下课后大家一起去体育馆打篮球。', translation: 'After class everyone goes to gym for basketball.', correct: false },
              { id: 'o3', text: '图书馆每天晚上九点半准时闭馆。', translation: 'The library closes at 9:30 PM sharp.', correct: false },
              { id: 'o4', text: '这学期的汉语期末考试安排在下周。', translation: 'The Chinese final exam is scheduled for next week.', correct: false }
            ]
          },
          {
            id: 'zh-l1-11',
            targetAudio: '请出示您的有效身份证件和登机牌。',
            phonetic: 'Qǐng chūshì nín de yǒuxiào shēnfèn zhèngjiàn hé dēngjīpái.',
            translation: 'Please show your valid ID and boarding pass.',
            options: [
              { id: 'o1', text: '请出示您的有效身份证件和登机牌。', translation: 'Please present your valid ID and boarding pass.', correct: true },
              { id: 'o2', text: '航班预计将于三十分钟后起飞。', translation: 'Flight is expected to take off in 30 minutes.', correct: false },
              { id: 'o3', text: '行李托运柜台在二号航站楼三层。', translation: 'Baggage check-in is on 3rd floor of Terminal 2.', correct: false },
              { id: 'o4', text: '祝您旅途平安，飞行愉快！', translation: 'Wish you safe travels and a pleasant flight!', correct: false }
            ]
          },
          {
            id: 'zh-l1-12',
            targetAudio: '祝你工作顺利，身体健康，万事如意！',
            phonetic: 'Zhù nǐ gōngzuò shùnlì, shēntǐ jiànkāng, wànshì rúyì!',
            translation: 'Wish you smooth work, good health, all the best!',
            options: [
              { id: 'o1', text: '祝你工作顺利，身体健康，万事如意！', translation: 'Wish you smooth work, good health, and best wishes!', correct: true },
              { id: 'o2', text: '新年快乐，合家幸福安康！', translation: 'Happy New Year and happiness to your family!', correct: false },
              { id: 'o3', text: '感谢大家一直以来的信任与支持。', translation: 'Thank you all for your trust and support.', correct: false },
              { id: 'o4', text: '我们北京再相聚，一路顺风！', translation: 'See you again in Beijing, safe travels!', correct: false }
            ]
          }
        ],
        lightnings: [
          {
            id: 'zh-q1-1',
            question: 'What is the standard polite greeting in Chinese?',
            correctAnswer: '您好 (nín hǎo)',
            options: ['您好 (nín hǎo)', '再见 (zàijiàn)', '谢谢 (xièxie)', '对不起 (duìbuqǐ)'],
            explanation: '“您好” is the polite, respectful version of hello.'
          },
          {
            id: 'zh-q1-2',
            question: 'How do you say “Thank you”?',
            correctAnswer: '谢谢 (xièxie)',
            options: ['谢谢 (xièxie)', '请 (qǐng)', '不好 (bù hǎo)', '不客气 (bú kèqi)'],
            explanation: '“谢谢” is the universal expression of thanks.'
          },
          {
            id: 'zh-q1-3',
            question: 'Which character means “water” in Mandarin?',
            correctAnswer: '水 (shuǐ)',
            options: ['水 (shuǐ)', '茶 (chá)', '饭 (fàn)', '火 (huǒ)'],
            explanation: '“水” translates to water.'
          },
          {
            id: 'zh-q1-4',
            question: 'How do you answer when someone says “谢谢”?',
            correctAnswer: '不客气 (bú kèqi)',
            options: ['不客气 (bú kèqi)', '没关系 (méi guānxi)', '再见 (zàijiàn)', '请 (qǐng)'],
            explanation: '“不客气” means “You are welcome / Don’t be so courteous”.'
          },
          {
            id: 'zh-q1-5',
            question: 'What does “对不起 (duìbuqǐ)” mean?',
            correctAnswer: 'I am sorry / Excuse me',
            options: ['I am sorry / Excuse me', 'Thank you', 'Goodbye', 'Good morning'],
            explanation: '“对不起” is used to apologize.'
          },
          {
            id: 'zh-q1-6',
            question: 'Fill in: “我叫王明，我是____。” (student)',
            correctAnswer: '学生 (xuésheng)',
            options: ['学生 (xuésheng)', '老师 (lǎoshī)', '医生 (yīshēng)', '经理 (jīnglǐ)'],
            explanation: '“学生” means student.'
          },
          {
            id: 'zh-q1-7',
            question: 'Which phrase asks “How much is this?”',
            correctAnswer: '这个多少钱？',
            options: ['这个多少钱？', '你在哪里？', '几点了？', '是谁的？'],
            explanation: '“多少钱” is the standard way to inquire about price.'
          },
          {
            id: 'zh-q1-8',
            question: 'What does “再见 (zàijiàn)” literally mean?',
            correctAnswer: 'See you again',
            options: ['See you again', 'Go slowly', 'Good night', 'Stay safe'],
            explanation: '“再” means again, and “见” means to see.'
          },
          {
            id: 'zh-q1-9',
            question: 'Fill the blank: “请给我一杯____。” (tea)',
            correctAnswer: '茶 (chá)',
            options: ['茶 (chá)', '肉 (ròu)', '书 (shū)', '笔 (bǐ)'],
            explanation: '“茶” means tea.'
          },
          {
            id: 'zh-q1-10',
            question: 'How do you ask for the restaurant bill in China?',
            correctAnswer: '服务员，买单！',
            options: ['服务员，买单！', '服务员，点菜！', '多少钱？', '洗手间！'],
            explanation: '“买单” (mǎidān) is the ubiquitous way to pay the bill.'
          },
          {
            id: 'zh-q1-11',
            question: 'Which word means “friend” in Mandarin?',
            correctAnswer: '朋友 (péngyou)',
            options: ['朋友 (péngyou)', '同学 (tóngxué)', '同事 (tóngshì)', '邻居 (línjū)'],
            explanation: '“朋友” means friend.'
          },
          {
            id: 'zh-q1-12',
            question: 'How do you say “Goodbye” politely to guests?',
            correctAnswer: '慢走 (màn zǒu)',
            options: ['慢走 (màn zǒu)', '快来 (kuài lái)', '随便 (suíbiàn)', '好的 (hǎode)'],
            explanation: '“慢走” literally means “walk slowly”, a warm Chinese courtesy when parting.'
          }
        ]
      }
    ]
  },
  Spanish: {
    1: [
      {
        levelNumber: 1,
        batchId: 1,
        pairs: [
          { id: 'es-p1-1', left: 'hola', right: 'hello / hi', audio: 'hola' },
          { id: 'es-p1-2', left: 'gracias', right: 'thank you', audio: 'gracias' },
          { id: 'es-p1-3', left: 'por favor', right: 'please', audio: 'por favor' },
          { id: 'es-p1-4', left: 'adiós', right: 'goodbye', audio: 'adiós' },
          { id: 'es-p1-5', left: 'sí', right: 'yes', audio: 'sí' },
          { id: 'es-p1-6', left: 'no', right: 'no', audio: 'no' },
          { id: 'es-p1-7', left: 'buenos días', right: 'good morning', audio: 'buenos días' },
          { id: 'es-p1-8', left: 'buenas tardes', right: 'good afternoon', audio: 'buenas tardes' },
          { id: 'es-p1-9', left: 'buenas noches', right: 'good night', audio: 'buenas noches' },
          { id: 'es-p1-10', left: 'de nada', right: 'you are welcome', audio: 'de nada' },
          { id: 'es-p1-11', left: 'el agua', right: 'the water', audio: 'el agua' },
          { id: 'es-p1-12', left: 'el café', right: 'the coffee', audio: 'el café' },
          { id: 'es-p1-13', left: 'el pan', right: 'the bread', audio: 'el pan' },
          { id: 'es-p1-14', left: 'el amigo', right: 'the friend', audio: 'el amigo' }
        ],
        sentences: [
          {
            id: 'es-s1-1',
            prompt: 'Assemble: “Hello, good morning, how are you?”',
            translation: 'Hello, good morning, how are you?',
            target: '¡Hola, buenos días! ¿Cómo estás?',
            words: ['¡Hola,', 'buenos', 'días!', '¿Cómo', 'estás?'],
            distractors: ['adiós', 'gracias', 'mal']
          },
          {
            id: 'es-s1-2',
            prompt: 'Assemble: “A coffee with milk, please.”',
            translation: 'A coffee with milk, please.',
            target: 'Un café con leche, por favor.',
            words: ['Un', 'café', 'con', 'leche,', 'por', 'favor.'],
            distractors: ['el', 'agua', 'té']
          },
          {
            id: 'es-s1-3',
            prompt: 'Assemble: “Thank you very much, my friend.”',
            translation: 'Thank you very much, my friend.',
            target: 'Muchas gracias, amigo mío.',
            words: ['Muchas', 'gracias,', 'amigo', 'mío.'],
            distractors: ['hola', 'adiós']
          },
          {
            id: 'es-s1-4',
            prompt: 'Assemble: “My name is Carlos and I live in Madrid.”',
            translation: 'My name is Carlos and I live in Madrid.',
            target: 'Me llamo Carlos y vivo en Madrid.',
            words: ['Me', 'llamo', 'Carlos', 'y', 'vivo', 'en', 'Madrid.'],
            distractors: ['tú', 'eres', 'español']
          },
          {
            id: 'es-s1-5',
            prompt: 'Assemble: “Where is the train station?”',
            translation: 'Where is the train station?',
            target: '¿Dónde está la estación de tren?',
            words: ['¿Dónde', 'está', 'la', 'estación', 'de', 'tren?'],
            distractors: ['quién', 'calle', 'metro']
          },
          {
            id: 'es-s1-6',
            prompt: 'Assemble: “The bill, please.”',
            translation: 'The bill / check, please.',
            target: 'La cuenta, por favor.',
            words: ['La', 'cuenta,', 'por', 'favor.'],
            distractors: ['mesa', 'carta', 'menú']
          },
          {
            id: 'es-s1-7',
            prompt: 'Assemble: “Pleased to meet you, see you tomorrow.”',
            translation: 'Pleased to meet you, see you tomorrow.',
            target: 'Mucho gusto, hasta mañana.',
            words: ['Mucho', 'gusto,', 'hasta', 'mañana.'],
            distractors: ['ayer', 'tarde', 'noche']
          },
          {
            id: 'es-s1-8',
            prompt: 'Assemble: “Do you speak English?”',
            translation: 'Do you speak English?',
            target: '¿Habla usted inglés?',
            words: ['¿Habla', 'usted', 'inglés?'],
            distractors: ['español', 'yo', 'hablo']
          },
          {
            id: 'es-s1-9',
            prompt: 'Assemble: “Everything is very tasty, thanks.”',
            translation: 'Everything is very delicious, thanks.',
            target: 'Todo está muy rico, gracias.',
            words: ['Todo', 'está', 'muy', 'rico,', 'gracias.'],
            distractors: ['malo', 'nada']
          },
          {
            id: 'es-s1-10',
            prompt: 'Assemble: “I would like a bottle of water.”',
            translation: 'I would like a bottle of water.',
            target: 'Quisiera una botella de agua.',
            words: ['Quisiera', 'una', 'botella', 'de', 'agua.'],
            distractors: ['comer', 'pan', 'vino']
          },
          {
            id: 'es-s1-11',
            prompt: 'Assemble: “Have a very good afternoon!”',
            translation: 'Have a very good afternoon!',
            target: '¡Que pase una muy buena tarde!',
            words: ['¡Que', 'pase', 'una', 'muy', 'buena', 'tarde!'],
            distractors: ['noche', 'mañana']
          },
          {
            id: 'es-s1-12',
            prompt: 'Assemble: “See you soon, take care!”',
            translation: 'See you soon, take care!',
            target: '¡Hasta pronto, cuídate mucho!',
            words: ['¡Hasta', 'pronto,', 'cuídate', 'mucho!'],
            distractors: ['nunca', 'adiós']
          }
        ],
        listenings: [
          {
            id: 'es-l1-1',
            targetAudio: '¡Buenos días! ¿Cómo amaneciste hoy?',
            phonetic: '/ˈbwe.noz ˈði.as ˈko.mo a.ma.neˈsis.te oi̯/',
            translation: 'Good morning! How did you wake up today?',
            options: [
              { id: 'o1', text: '¡Buenos días! ¿Cómo amaneciste hoy?', translation: 'Good morning! How did you wake up today?', correct: true },
              { id: 'o2', text: '¡Buenas noches! Que descanses bien.', translation: 'Good night! Rest well.', correct: false },
              { id: 'o3', text: 'Muchas gracias por la cena de anoche.', translation: 'Thank you for dinner last night.', correct: false },
              { id: 'o4', text: '¿A qué hora nos encontramos en el parque?', translation: 'What time do we meet at the park?', correct: false }
            ]
          },
          {
            id: 'es-l1-2',
            targetAudio: 'Por favor, ¿nos puedes traer la cuenta?',
            phonetic: '/poɾ fa.ˈβoɾ nos ˈpwe.ðes tɾa.ˈeɾ la ˈkwen.ta/',
            translation: 'Please, could you bring us the bill?',
            options: [
              { id: 'o1', text: 'Por favor, ¿nos puedes traer la cuenta?', translation: 'Please, could you bring us the check?', correct: true },
              { id: 'o2', text: 'Queremos pedir dos tapas de tortilla.', translation: 'We want to order two tortilla tapas.', correct: false },
              { id: 'o3', text: '¿Tienen una mesa libre en la terraza?', translation: 'Do you have a free table on the terrace?', correct: false },
              { id: 'o4', text: 'Un café solo y un vaso de agua fresca.', translation: 'An espresso and a glass of fresh water.', correct: false }
            ]
          },
          {
            id: 'es-l1-3',
            targetAudio: 'Disculpe, ¿dónde está la estación de metro más cercana?',
            phonetic: '/disˈkul.pe ˈdon.de esˈta la es.taˈsjon de ˈme.tɾo mas seɾˈka.na/',
            translation: 'Excuse me, where is the nearest metro station?',
            options: [
              { id: 'o1', text: 'Disculpe, ¿dónde está la estación de metro más cercana?', translation: 'Where is the nearest metro station?', correct: true },
              { id: 'o2', text: '¿A qué andén llega el tren de Sevilla?', translation: 'Which platform does the Seville train arrive at?', correct: false },
              { id: 'o3', text: 'El autobús hacia el centro pasa cada diez minutos.', translation: 'The bus to center runs every 10 minutes.', correct: false },
              { id: 'o4', text: 'Siga todo recto y gire a la derecha.', translation: 'Go straight ahead and turn right.', correct: false }
            ]
          },
          {
            id: 'es-l1-4',
            targetAudio: '¡Mucho gusto en conocerte, bienvenido a España!',
            phonetic: '/ˈmu.tʃo ˈɣus.to eŋ ko.noˈseɾ.te bjem.beˈni.ðo a esˈpa.ɲa/',
            translation: 'Nice to meet you, welcome to Spain!',
            options: [
              { id: 'o1', text: '¡Mucho gusto en conocerte, bienvenido a España!', translation: 'Nice to meet you, welcome to Spain!', correct: true },
              { id: 'o2', text: 'Espero que tengas un excelente viaje de vuelta.', translation: 'Hope you have an excellent return trip.', correct: false },
              { id: 'o3', text: '¿Cuántos días vas a quedarte en Barcelona?', translation: 'How many days are you staying in Barcelona?', correct: false },
              { id: 'o4', text: 'El clima aquí en primavera es maravilloso.', translation: 'The weather here in spring is wonderful.', correct: false }
            ]
          },
          {
            id: 'es-l1-5',
            targetAudio: 'Quisiera un billete de ida y vuelta para Toledo.',
            phonetic: '/kiˈsje.ɾa um biˈʎe.te ðe ˈi.ða i ˈβwel.ta ˈpa.ɾa toˈle.ðo/',
            translation: 'I would like a round-trip ticket to Toledo.',
            options: [
              { id: 'o1', text: 'Quisiera un billete de ida y vuelta para Toledo.', translation: 'Round-trip ticket to Toledo please.', correct: true },
              { id: 'o2', text: '¿Cuánto cuesta un billete sencillo en cercanías?', translation: 'How much is a single commuter ticket?', correct: false },
              { id: 'o3', text: 'El tren sale puntualmente a las diez de la mañana.', translation: 'The train departs punctually at 10 AM.', correct: false },
              { id: 'o4', text: 'Tiene que validar su billete antes de subir.', translation: 'You must validate your ticket before boarding.', correct: false }
            ]
          },
          {
            id: 'es-l1-6',
            targetAudio: 'La paella de mariscos de este lugar está exquisita.',
            phonetic: '/la paˈe.ʎa ðe maˈɾis.kos ðe ˈes.te luˈɣaɾ esˈta eks.kiˈsi.ta/',
            translation: 'The seafood paella here is exquisite.',
            options: [
              { id: 'o1', text: 'La paella de mariscos de este lugar está exquisita.', translation: 'The seafood paella here is exquisite.', correct: true },
              { id: 'o2', text: 'De postre queremos tarta de santiago y café.', translation: 'For dessert we want Santiago cake and coffee.', correct: false },
              { id: 'o3', text: 'El jamón ibérico tiene un sabor inigualable.', translation: 'Iberian ham has an incomparable flavor.', correct: false },
              { id: 'o4', text: 'Vamos a pedir unas aceitunas para picar.', translation: 'Let’s order some olives for an appetizer.', correct: false }
            ]
          },
          {
            id: 'es-l1-7',
            targetAudio: 'No entiendo muy bien, ¿podría hablar más despacio?',
            phonetic: '/no enˈtjen.do mwi βjen poˈðɾi.a aˈβlaɾ mas desˈpa.sjo/',
            translation: 'I don’t understand well, could you speak slower?',
            options: [
              { id: 'o1', text: 'No entiendo muy bien, ¿podría hablar más despacio?', translation: 'I don’t understand, could you speak more slowly?', correct: true },
              { id: 'o2', text: 'Mi nivel de español ha mejorado bastante.', translation: 'My Spanish level has improved considerably.', correct: false },
              { id: 'o3', text: '¿Cómo se escribe esta palabra en el cuaderno?', translation: 'How is this word written in the notebook?', correct: false },
              { id: 'o4', text: 'Estoy estudiando la gramática todos los días.', translation: 'I am studying grammar every day.', correct: false }
            ]
          },
          {
            id: 'es-l1-8',
            targetAudio: 'Hoy hace un día soleado y muy agradable para pasear.',
            phonetic: '/oi̯ ˈa.se un ˈdi.a so.leˈa.ðo i mwi a.ɣɾaˈða.βle ˈpa.ɾa pa.seˈaɾ/',
            translation: 'Today is sunny and very pleasant for a walk.',
            options: [
              { id: 'o1', text: 'Hoy hace un día soleado y muy agradable para pasear.', translation: 'Today is sunny and pleasant to stroll.', correct: true },
              { id: 'o2', text: 'Parece que va a llover durante la tarde.', translation: 'It seems it is going to rain this afternoon.', correct: false },
              { id: 'o3', text: 'Hace mucho viento cerca de la playa.', translation: 'It is very windy near the beach.', correct: false },
              { id: 'o4', text: 'La temperatura ha bajado varios grados.', translation: 'The temperature has dropped several degrees.', correct: false }
            ]
          },
          {
            id: 'es-l1-9',
            targetAudio: '¿Nos encontramos en la plaza mayor a las seis?',
            phonetic: '/nos eŋ.konˈtɾa.mos en la ˈpla.sa maˈʝoɾ a las seis/',
            translation: 'Shall we meet at Plaza Mayor at six?',
            options: [
              { id: 'o1', text: '¿Nos encontramos en la plaza mayor a las seis?', translation: 'Shall we meet at Plaza Mayor at six?', correct: true },
              { id: 'o2', text: 'Quedamos en la puerta de la catedral a las siete.', translation: 'We meet at cathedral door at seven.', correct: false },
              { id: 'o3', text: 'Prefiero tomar algo cerca de mi hotel.', translation: 'I prefer to drink something near my hotel.', correct: false },
              { id: 'o4', text: 'Hay un ambiente fantástico en el centro.', translation: 'There is a fantastic vibe in the center.', correct: false }
            ]
          },
          {
            id: 'es-l1-10',
            targetAudio: 'Tengo una reserva a nombre de Juan para dos noches.',
            phonetic: '/ˈteŋ.ɡo ˈu.na reˈseɾ.βa a ˈnom.bɾe ðe xwan ˈpa.ɾa ðoz ˈno.tʃes/',
            translation: 'I have a reservation under Juan for two nights.',
            options: [
              { id: 'o1', text: 'Tengo una reserva a nombre de Juan para dos noches.', translation: 'Reservation under Juan for two nights.', correct: true },
              { id: 'o2', text: '¿A qué hora se sirve el desayuno buffet?', translation: 'What time is the breakfast buffet served?', correct: false },
              { id: 'o3', text: '¿Me puede dar la contraseña de la red wifi?', translation: 'Could you give me the wifi network password?', correct: false },
              { id: 'o4', text: 'La habitación tiene vistas preciosas a la montaña.', translation: 'The room has gorgeous views of mountains.', correct: false }
            ]
          },
          {
            id: 'es-l1-11',
            targetAudio: 'Muchas gracias por su hospitalidad y amabilidad.',
            phonetic: '/ˈmu.tʃas ˈɣɾa.sjas poɾ su os.pi.ta.liˈðað i a.ma.βi.liˈðað/',
            translation: 'Thank you very much for your hospitality and kindness.',
            options: [
              { id: 'o1', text: 'Muchas gracias por su hospitalidad y amabilidad.', translation: 'Thank you for your hospitality and kindness.', correct: true },
              { id: 'o2', text: 'Ha sido un verdadero honor tenerles con nosotros.', translation: 'It was a true honor having you with us.', correct: false },
              { id: 'o3', text: 'Esperamos que vuelvan a visitarnos muy pronto.', translation: 'We hope you come back to visit very soon.', correct: false },
              { id: 'o4', text: '¡Buen viaje de regreso a todos!', translation: 'Safe journey back to everyone!', correct: false }
            ]
          },
          {
            id: 'es-l1-12',
            targetAudio: '¡Hasta luego y que tengas un día maravilloso!',
            phonetic: '/ˈas.ta ˈlwe.ɣo i ke ˈteŋ.ɡas un ˈdi.a ma.ɾa.βiˈʎo.so/',
            translation: 'See you later and have a marvelous day!',
            options: [
              { id: 'o1', text: '¡Hasta luego y que tengas un día maravilloso!', translation: 'See you later and have a marvelous day!', correct: true },
              { id: 'o2', text: 'Nos vemos el próximo lunes en la oficina.', translation: 'See you next Monday in the office.', correct: false },
              { id: 'o3', text: 'Que disfrutes muchísimo de tus vacaciones.', translation: 'Enjoy your vacation to the fullest.', correct: false },
              { id: 'o4', text: 'Cuídate mucho y dale recuerdos a tu familia.', translation: 'Take care and give regards to your family.', correct: false }
            ]
          }
        ],
        lightnings: [
          {
            id: 'es-q1-1',
            question: 'How do you say “Good morning” in Spanish?',
            correctAnswer: 'Buenos días',
            options: ['Buenos días', 'Buenas tardes', 'Buenas noches', 'Hola'],
            explanation: '“Buenos días” is used in the morning until midday.'
          },
          {
            id: 'es-q1-2',
            question: 'What is the Spanish phrase for “Please”?',
            correctAnswer: 'Por favor',
            options: ['Por favor', 'De nada', 'Gracias', 'Perdón'],
            explanation: '“Por favor” translates to please.'
          },
          {
            id: 'es-q1-3',
            question: 'Which word means “The water”?',
            correctAnswer: 'El agua',
            options: ['El agua', 'El pan', 'El café', 'La leche'],
            explanation: '“El agua” uses masculine singular article “el” before stressed initial A.'
          },
          {
            id: 'es-q1-4',
            question: 'How do you reply to “Muchas gracias”?',
            correctAnswer: 'De nada',
            options: ['De nada', 'Adiós', 'Por favor', 'Hasta luego'],
            explanation: '“De nada” means “You are welcome / It’s nothing”.'
          },
          {
            id: 'es-q1-5',
            question: 'Fill the blank: “Me ____ Carlos.” (My name is Carlos)',
            correctAnswer: 'llamo',
            options: ['llamo', 'soy', 'vivo', 'estoy'],
            explanation: '“Me llamo” is used when giving your name.'
          },
          {
            id: 'es-q1-6',
            question: 'What does “La cuenta, por favor” mean?',
            correctAnswer: 'The bill, please',
            options: ['The bill, please', 'The menu, please', 'The water, please', 'A table, please'],
            explanation: '“La cuenta” refers to the bill or check in restaurants.'
          },
          {
            id: 'es-q1-7',
            question: 'Which of the following means “Goodbye”?',
            correctAnswer: 'Adiós',
            options: ['Adiós', 'Hola', 'Bienvenido', 'Buenos días'],
            explanation: '“Adiós” is the standard parting word.'
          },
          {
            id: 'es-q1-8',
            question: 'Fill in: “Una mesa para ____ personas.” (two people)',
            correctAnswer: 'dos',
            options: ['dos', 'uno', 'tres', 'diez'],
            explanation: '“Dos” is the number two.'
          },
          {
            id: 'es-q1-9',
            question: 'What is “Nice to meet you” in Spanish?',
            correctAnswer: 'Mucho gusto',
            options: ['Mucho gusto', 'Hasta mañana', 'Por favor', 'Buen viaje'],
            explanation: '“Mucho gusto” means pleased / nice to meet you.'
          },
          {
            id: 'es-q1-10',
            question: 'Fill in: “¿Habla usted ____ ?” (English)',
            correctAnswer: 'inglés',
            options: ['inglés', 'español', 'francés', 'alemán'],
            explanation: '“Inglés” means English.'
          },
          {
            id: 'es-q1-11',
            question: 'Which word means “The bread”?',
            correctAnswer: 'El pan',
            options: ['El pan', 'El queso', 'El agua', 'La fruta'],
            explanation: '“El pan” means bread.'
          },
          {
            id: 'es-q1-12',
            question: 'How do you say “See you tomorrow”?',
            correctAnswer: 'Hasta mañana',
            options: ['Hasta mañana', 'Hasta luego', 'Hasta pronto', 'Adiós'],
            explanation: '“Hasta mañana” specifically means until tomorrow.'
          }
        ]
      }
    ]
  }
};

class PracticeService {
  /**
   * Returns a level-scoped practice batch for the user's language and active level
   */
  public getLevelPracticeBatch(
    language: string,
    levelNumber: number,
    requestedBatchIndex?: number
  ): LevelPracticeContent {
    const langData = PRACTICE_VARIATIONS[language] || PRACTICE_VARIATIONS.French;
    const levelKey = Math.min(Math.max(1, levelNumber), 2);
    const batches = langData[levelKey] || langData[1];

    if (requestedBatchIndex !== undefined && requestedBatchIndex < batches.length) {
      return batches[requestedBatchIndex];
    }

    return batches[0];
  }

  /**
   * Generates a completely new dynamic drill batch for the user's level
   */
  public generateNextVariation(
    language: string,
    levelNumber: number,
    currentBatchId: number
  ): LevelPracticeContent {
    const langData = PRACTICE_VARIATIONS[language] || PRACTICE_VARIATIONS.French;
    const levelKey = Math.min(Math.max(1, levelNumber), 2);
    const batches = langData[levelKey] || langData[1];

    const nextIdx = (currentBatchId % batches.length);
    return batches[nextIdx];
  }
}

export const practiceService = new PracticeService();
