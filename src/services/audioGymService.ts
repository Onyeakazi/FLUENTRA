// FLUENTRA Dynamic Level-Scoped Audio Gym & Pronunciation Generator

export interface SoundItem {
  symbol: string;
  phonetic: string;
  word: string;
  trans: string;
  audio: string;
}

export interface LiaisonItem {
  title: string;
  isolated: string;
  connected: string;
  audio: string;
  rule: string;
}

export interface RhythmItem {
  title: string;
  phrase: string;
  trans: string;
  audio: string;
  tag: string;
}

export interface ClinicItem {
  phrase: string;
  phonetic: string;
  trans: string;
  keySound: string;
}

export interface LevelGymContent {
  levelNumber: number;
  batchId: number;
  sounds: SoundItem[];
  liaisons: LiaisonItem[];
  rhythms: RhythmItem[];
  clinics: ClinicItem[];
}

// Deep Multi-Level Curated Sound Matrices (10–16 Cards Per Tier Per Batch)
const LEVEL_VARIATIONS: Record<string, Record<number, LevelGymContent[]>> = {
  French: {
    1: [
      {
        levelNumber: 1,
        batchId: 1,
        sounds: [
          { symbol: 'on', phonetic: '/bɔ̃/', word: 'bon', trans: 'good', audio: 'bon' },
          { symbol: 'an / en', phonetic: '/ɑ̃/', word: 'sans', trans: 'without', audio: 'sans' },
          { symbol: 'in / ain', phonetic: '/ɛ̃/', word: 'pain', trans: 'bread', audio: 'pain' },
          { symbol: 'un', phonetic: '/œ̃/', word: 'un', trans: 'one / a', audio: 'un' },
          { symbol: 'ou', phonetic: '/u/', word: 'vous', trans: 'you', audio: 'vous' },
          { symbol: 'u', phonetic: '/y/', word: 'salut', trans: 'hello', audio: 'salut' },
          { symbol: 'r', phonetic: '/ʁ/', word: 'merci', trans: 'thank you', audio: 'merci' },
          { symbol: 'é (aigu)', phonetic: '/e/', word: 'café', trans: 'coffee', audio: 'café' },
          { symbol: 'è / ê', phonetic: '/ɛ/', word: 'très', trans: 'very', audio: 'très' },
          { symbol: 'eau / au', phonetic: '/o/', word: 'beau', trans: 'beautiful', audio: 'beau' },
          { symbol: 'oi', phonetic: '/wa/', word: 'moi', trans: 'me', audio: 'moi' },
          { symbol: 'ch', phonetic: '/ʃ/', word: 'chat', trans: 'cat', audio: 'chat' },
          { symbol: 'ç (cédille)', phonetic: '/s/', word: 'ça va', trans: 'fine', audio: 'ça va' },
          { symbol: 'silent -e', phonetic: 'Ø', word: 'amie', trans: 'friend (fem.)', audio: 'amie' }
        ],
        liaisons: [
          {
            title: 'Plurals with Vowels (s → z)',
            isolated: 'les + amis',
            connected: 'lez-ami (/le.z‿a.mi/)',
            audio: 'les amis',
            rule: 'Final silent -s sounds like a gentle Z when followed by a vowel.'
          },
          {
            title: 'Indefinite Article (n → n)',
            isolated: 'un + ami',
            connected: 'un-n-ami (/œ̃.n‿a.mi/)',
            audio: 'un ami',
            rule: 'The nasal vowel flows forward into vowel with an audible N.'
          },
          {
            title: 'Demonstrative Liaison (cet)',
            isolated: 'ce + hôtel',
            connected: 'cet-hôtel (/sɛ.t‿o.tɛl/)',
            audio: 'cet hôtel',
            rule: 'Uses "cet" before vowels and silent H for smooth liaison.'
          },
          {
            title: 'Verb Être (t → t)',
            isolated: "c'est + un",
            connected: "c'est-t-un (/sɛ.t‿œ̃/)",
            audio: "c'est un",
            rule: 'Silent -t links clearly with following vowel to prevent hiatus.'
          },
          {
            title: 'Number Liaison (Deux)',
            isolated: 'deux + heures',
            connected: 'deu-z-heures (/dø.z‿œʁ/)',
            audio: 'deux heures',
            rule: 'Silent -x transforms into a voiced Z before vowels.'
          },
          {
            title: 'Subject Pronoun (Nous)',
            isolated: 'nous + avons',
            connected: 'nou-z-avons (/nu.z‿a.vɔ̃/)',
            audio: 'nous avons',
            rule: 'High-frequency verb liaison essential for spoken fluency.'
          },
          {
            title: 'Pronoun Ils / Elles',
            isolated: 'ils + ont',
            connected: 'il-z-ont (/il.z‿ɔ̃/)',
            audio: 'ils ont',
            rule: 'Voiced Z distinguishes "they have" (ils ont) from "they are" (ils sont).'
          },
          {
            title: 'Preposition En',
            isolated: 'en + avion',
            connected: 'en-n-avion (/ɑ̃.n‿a.vjɔ̃/)',
            audio: 'en avion',
            rule: 'Compulsory liaison before any following vowel noun.'
          },
          {
            title: 'Adjective Grand (d → t)',
            isolated: 'grand + arbre',
            connected: 'gran-t-arbre (/ɡʁɑ̃.t‿aʁbʁ/)',
            audio: 'grand arbre',
            rule: 'Silent final -d softens into a crisp T sound.'
          },
          {
            title: 'First Floor (Premier)',
            isolated: 'premier + étage',
            connected: 'premie-r-étage (/pʁə.mje.ʁ‿e.taʒ/)',
            audio: 'premier étage',
            rule: 'Silent final -r voices clearly before a vowel.'
          },
          {
            title: 'Elision L’ (Le / La)',
            isolated: 'le + arbre',
            connected: "l'arbre (/laʁbʁ/)",
            audio: "l'arbre",
            rule: 'Dropped vowel prevents vowel collision in native speech.'
          },
          {
            title: 'Adverb Bien (n → n)',
            isolated: 'bien + aimé',
            connected: 'bien-n-aimé (/bjɛ̃.n‿e.me/)',
            audio: 'bien aimé',
            rule: 'Adverbial "bien" flows directly into participles with an audible N.'
          },
          {
            title: 'Chez + Pronoun (z → z)',
            isolated: 'chez + elle',
            connected: 'che-z-elle (/ʃe.z‿ɛl/)',
            audio: 'chez elle',
            rule: 'Preposition "chez" links smoothly with a voiced Z sound.'
          }
        ],
        rhythms: [
          {
            title: 'A1 Morning Flow',
            phrase: 'Bonjour! Comment allez-vous ce matin?',
            trans: 'Hello! How are you doing this morning?',
            audio: 'Bonjour! Comment allez-vous ce matin?',
            tag: 'Greeting Cadence'
          },
          {
            title: 'Classic Hunter Twister',
            phrase: 'Un chasseur sachant chasser sans son chien.',
            trans: 'A hunter who knows how to hunt without his dog.',
            audio: 'Un chasseur sachant chasser sans son chien.',
            tag: 'S / CH Agility'
          },
          {
            title: 'Six Saws Twister',
            phrase: 'Si six scies scient six cyprès, six cents scies scient six cents cyprès.',
            trans: 'If six saws saw six cypresses, six hundred saws saw six hundred cypresses.',
            audio: 'Si six scies scient six cyprès, six cents scies scient six cents cyprès.',
            tag: 'Sibilant Speed'
          },
          {
            title: 'Green Tree Rhythm',
            phrase: 'Regarde le grand arbre vert au coin de la rue.',
            trans: 'Look at the big green tree at the corner of the street.',
            audio: 'Regarde le grand arbre vert au coin de la rue.',
            tag: 'Soft R Flow'
          },
          {
            title: 'Bistro Express Order',
            phrase: 'S’il vous plaît, un café noir et une carafe d’eau.',
            trans: 'Please, a black coffee and a jug of water.',
            audio: "S'il vous plaît, un café noir et une carafe d'eau.",
            tag: 'Café Tempo'
          },
          {
            title: 'Train Station Question',
            phrase: 'Pardon madame, à quelle heure part le prochain train pour Paris?',
            trans: 'Excuse me madam, what time does the next train to Paris leave?',
            audio: 'Pardon madame, à quelle heure part le prochain train pour Paris?',
            tag: 'Traveler Rhythm'
          },
          {
            title: 'Nasal Candy Drill',
            phrase: 'Le bonbon rond de ton tonton est très bon.',
            trans: "Your uncle's round candy is very good.",
            audio: 'Le bonbon rond de ton tonton est très bon.',
            tag: 'Nasal ON Focus'
          },
          {
            title: 'Sunny Weather Cadence',
            phrase: 'Il fait un temps magnifique aujourd’hui dans les rues de Lyon.',
            trans: 'The weather is magnificent today in the streets of Lyon.',
            audio: 'Il fait un temps magnifique aujourd’hui dans les rues de Lyon.',
            tag: 'Conversational Pace'
          },
          {
            title: 'Dinner Reservation',
            phrase: 'J’aimerais réserver une table pour deux personnes ce soir à vingt heures.',
            trans: 'I would like to reserve a table for two tonight at 8 PM.',
            audio: "J'aimerais réserver une table pour deux personnes ce soir à vingt heures.",
            tag: 'Booking Cadence'
          },
          {
            title: 'The Trotting Turtles',
            phrase: 'Trois tortues trottaient sur un trottoir très étroit.',
            trans: 'Three turtles trotted on a very narrow sidewalk.',
            audio: 'Trois tortues trottaient sur un trottoir très étroit.',
            tag: 'TR Consonant Cluster'
          },
          {
            title: 'Daily Routine Flow',
            phrase: 'Tous les matins, je me réveille tôt et je bois un grand thé chaud.',
            trans: 'Every morning, I wake up early and drink a big hot tea.',
            audio: 'Tous les matins, je me réveille tôt et je bois un grand thé chaud.',
            tag: 'Daily Habit Flow'
          },
          {
            title: 'Fresh Bread Cadence',
            phrase: 'Je vais à la boulangerie du quartier chercher une baguette croustillante.',
            trans: 'I am going to the neighborhood bakery to get a crusty baguette.',
            audio: 'Je vais à la boulangerie du quartier chercher une baguette croustillante.',
            tag: 'Bakery Cadence'
          },
          {
            title: 'The Archduchess Socks',
            phrase: 'Les chaussettes de l’archiduchesse sont-elles sèches ou archi-sèches?',
            trans: 'Are the archduchess’s socks dry or completely dry?',
            audio: 'Les chaussettes de l’archiduchesse sont-elles sèches ou archi-sèches?',
            tag: 'S / CH Virtuoso'
          }
        ],
        clinics: [
          { phrase: 'Bonjour, je m’appelle Alex et je suis très heureux d’être ici.', phonetic: '/bɔ̃.ʒuʁ ʒə m‿a.pɛl a.lɛks e ʒə sɥi tʁɛ.z‿œ.ʁø d‿ɛtʁ i.si/', trans: 'Hello, my name is Alex and I am very happy to be here.', keySound: 'Nasal ON & Liaison' },
          { phrase: 'Excusez-moi monsieur, où se trouve la pharmacie la plus proche?', phonetic: '/ɛk.sky.ze mwa mə.sjø u sə tʁuv la faʁ.ma.si la ply pʁɔʃ/', trans: 'Excuse me sir, where is the nearest pharmacy?', keySound: 'Soft R & Question Rise' },
          { phrase: 'Je voudrais commander une salade et une bouteille d’eau minérale.', phonetic: '/ʒə vu.dʁɛ kɔ.mɑ̃.de yn sa.lad e yn bu.tɛj d‿o mi.ne.ʁal/', trans: 'I would like to order a salad and a bottle of mineral water.', keySound: 'Liquid ILL & Clean Vowels' },
          { phrase: 'Enchanté de faire votre connaissance, vous venez souvent ici?', phonetic: '/ɑ̃.ʃɑ̃.te də fɛʁ vɔtʁ kɔ.nɛ.sɑ̃s vu və.ne su.vɑ̃ i.si/', trans: 'Delighted to meet you, do you come here often?', keySound: 'Double Nasal EN & R' },
          { phrase: 'Il est huit heures et demie, nous devons partir tout de suite.', phonetic: '/i.l‿ɛ ɥi.t‿œʁ e d.mi nu də.vɔ̃ paʁ.tiʁ tu d‿sɥit/', trans: 'It is half past eight, we must leave right away.', keySound: 'Huit Liaison & Flow' },
          { phrase: 'Combien coûte ce beau tableau dans la vitrine du magasin?', phonetic: '/kɔ̃.bjɛ̃ kut sə bo ta.blo dɑ̃ la vi.tʁin dy ma.ɡa.zɛ̃/', trans: 'How much is this beautiful painting in the shop window?', keySound: 'Nasal IN & Vowels' },
          { phrase: 'Pouvez-vous parler un peu plus lentement s’il vous plaît?', phonetic: '/pu.ve vu paʁ.le œ̃ pø ply lɑ̃t.mɑ̃ s‿il vu plɛ/', trans: 'Could you speak a little more slowly please?', keySound: 'Polite Request Flow' },
          { phrase: 'Ce voyage à travers la France a été une expérience inoubliable.', phonetic: '/sə vwa.jaʒ a tʁa.vɛʁ la fʁɑ̃s a e.te yn ɛk.spe.ʁjɑ̃s i.nu.bli.jabl/', trans: 'This trip across France was an unforgettable experience.', keySound: 'Liaison & Long Cadence' },
          { phrase: 'J’adore écouter de la musique classique le soir chez moi.', phonetic: '/ʒ‿a.dɔʁ e.ku.te də la my.zik kla.sik lə swaʁ ʃe mwa/', trans: 'I love listening to classical music in the evening at home.', keySound: 'Pure Vowels & Rhythm' },
          { phrase: 'Nous avons passé une excellente soirée avec tous nos amis.', phonetic: '/nu.z‿a.vɔ̃ pa.se y.n‿ɛk.sɛ.lɑ̃t swa.ʁe a.vɛk tu no.z‿a.mi/', trans: 'We spent an excellent evening with all our friends.', keySound: 'Double Liaison S → Z' },
          { phrase: 'Merci beaucoup pour vos précieux conseils, à la prochaine!', phonetic: '/mɛʁ.si bo.ku puʁ vo pʁe.sjø kɔ̃.sɛj a la pʁɔ.ʃɛn/', trans: 'Thank you very much for your valuable advice, see you next time!', keySound: 'Parting Cadence' },
          { phrase: 'Quelle magnifique vue sur la tour Eiffel illuminée dans la nuit!', phonetic: '/kɛl ma.ɲi.fik vy syʁ la tuʁ ɛ.fɛl i.ly.mi.ne dɑ̃ la nɥi/', trans: 'What a magnificent view of the Eiffel Tower illuminated in the night!', keySound: 'Palatal GN & Clean U' },
          { phrase: 'Prenez la deuxième rue à droite après le feu rouge.', phonetic: '/pʁə.ne la dø.zjɛm ʁy a dʁwat a.pʁɛ lə fø ʁuʒ/', trans: 'Take the second street on the right after the red light.', keySound: 'Fricative R & Direction' }
        ]
      },
      {
        levelNumber: 1,
        batchId: 2,
        sounds: [
          { symbol: 'gn', phonetic: '/ɲ/', word: 'montagne', trans: 'mountain', audio: 'montagne' },
          { symbol: 'ill', phonetic: '/ij/', word: 'famille', trans: 'family', audio: 'famille' },
          { symbol: 'eu / œu', phonetic: '/ø/', word: 'bleu', trans: 'blue', audio: 'bleu' },
          { symbol: 'ail / aille', phonetic: '/aj/', word: 'travail', trans: 'work', audio: 'travail' },
          { symbol: 'eil / eille', phonetic: '/ɛj/', word: 'soleil', trans: 'sun', audio: 'soleil' },
          { symbol: 'ouil', phonetic: '/uj/', word: 'grenouille', trans: 'frog', audio: 'grenouille' },
          { symbol: 'tion', phonetic: '/sjɔ̃/', word: 'attention', trans: 'attention', audio: 'attention' },
          { symbol: 'ph', phonetic: '/f/', word: 'photo', trans: 'photo', audio: 'photo' },
          { symbol: 'th', phonetic: '/t/', word: 'thé', trans: 'tea', audio: 'thé' },
          { symbol: 'silent -s', phonetic: 'Ø', word: 'français', trans: 'French', audio: 'français' },
          { symbol: 'silent -t', phonetic: 'Ø', word: 'petit', trans: 'small', audio: 'petit' },
          { symbol: 'silent -d', phonetic: 'Ø', word: 'grand', trans: 'tall', audio: 'grand' },
          { symbol: 'h muet', phonetic: 'Ø', word: 'homme', trans: 'man', audio: 'homme' },
          { symbol: 'ai / ei', phonetic: '/ɛ/', word: 'lait', trans: 'milk', audio: 'lait' }
        ],
        liaisons: [
          {
            title: 'Numbers with Vowels (Dix)',
            isolated: 'dix + ans',
            connected: 'di-z-ans (/di.z‿ɑ̃/)',
            audio: 'dix ans',
            rule: 'Final -x sounds like Z before vowels in compound counting.'
          },
          {
            title: 'Too Much (Trop)',
            isolated: 'trop + aimable',
            connected: 'tro-p-aimable (/tʁo.p‿ɛ.mabl/)',
            audio: 'trop aimable',
            rule: 'The silent -p links softly in polite conversational turns.'
          },
          {
            title: 'Possessive Liaison (Mon)',
            isolated: 'mon + oncle',
            connected: 'mon-n-oncle (/mɔ̃.n‿ɔ̃kl/)',
            audio: 'mon oncle',
            rule: 'Possessives (mon, ton, son) compulsory forward N bridge.'
          },
          {
            title: 'No Liaison with "Et" (Ban)',
            isolated: 'et + alors',
            connected: 'et [break] alors',
            audio: 'et alors',
            rule: 'CRITICAL: Never make a liaison after the word "et" (and).'
          },
          {
            title: 'Aspirated H (Héros)',
            isolated: 'les + héros',
            connected: 'les [break] héros',
            audio: 'les héros',
            rule: 'H aspiré words prohibit liaison (unlike H muet).'
          },
          {
            title: 'Very (Très)',
            isolated: 'très + heureux',
            connected: 'trè-z-heureux (/tʁɛ.z‿ø.ʁø/)',
            audio: 'très heureux',
            rule: 'Adverb "très" always bridges smoothly into adjectives.'
          },
          {
            title: 'Sans (Without)',
            isolated: 'sans + arrêt',
            connected: 'san-z-arrêt (/sɑ̃.z‿a.ʁɛ/)',
            audio: 'sans arrêt',
            rule: 'Nasal preposition bridges with voiced Z.'
          },
          {
            title: 'Under (Sous)',
            isolated: 'sous + un',
            connected: 'sou-z-un (/su.z‿œ̃/)',
            audio: 'sous un',
            rule: 'Preposition bridges smoothly into indefinite articles.'
          },
          {
            title: 'In Front (Devant)',
            isolated: 'devant + elle',
            connected: 'devan-t-elle (/də.vɑ̃.t‿ɛl/)',
            audio: 'devant elle',
            rule: 'Final -t links forward in spatial descriptions.'
          },
          {
            title: 'All (Tout)',
            isolated: 'tout + entier',
            connected: 'tou-t-entier (/tu.t‿ɑ̃.tje/)',
            audio: 'tout entier',
            rule: 'Compulsory T liaison with adverbial tout.'
          },
          {
            title: 'Bon Appétit (n → n)',
            isolated: 'bon + appétit',
            connected: 'bon-n-appétit (/bɔ̃.n‿a.pe.ti/)',
            audio: 'bon appétit',
            rule: 'Adjective "bon" opens its nasal into a ringing N sound before vowels.'
          },
          {
            title: 'Euphonic T in Questions',
            isolated: 'a + il',
            connected: 'a-t-il (/a.t‿il/)',
            audio: 'a-t-il',
            rule: 'Inverted pronouns insert an audible T to prevent hiatus.'
          },
          {
            title: 'Quantifier Trop (p → p)',
            isolated: 'trop + inquiet',
            connected: 'tro-p-inquiet (/tʁo.p‿ɛ̃.kjɛ/)',
            audio: 'trop inquiet',
            rule: 'Soft P liaison in rapid conversational French.'
          }
        ],
        rhythms: [
          {
            title: 'Croissant Order Flow',
            phrase: 'S’il vous plaît, deux croissants chauds et un thé au citron.',
            trans: 'Please, two warm croissants and a lemon tea.',
            audio: 'S’il vous plaît, deux croissants chauds et un thé au citron.',
            tag: 'Bakery Pace'
          },
          {
            title: 'Metro Navigation',
            phrase: 'Prenez la ligne une direction Château de Vincennes.',
            trans: 'Take line one towards Château de Vincennes.',
            audio: 'Prenez la ligne une direction Château de Vincennes.',
            tag: 'Transit Cadence'
          },
          {
            title: 'Sunny Promenade',
            phrase: 'Nous nous promenons le long de la Seine chaque dimanche.',
            trans: 'We stroll along the Seine every Sunday.',
            audio: 'Nous nous promenons le long de la Seine chaque dimanche.',
            tag: 'Leisure Flow'
          },
          {
            title: 'Restaurant Greeting',
            phrase: 'Avez-vous une table libre en terrasse pour le déjeuner?',
            trans: 'Do you have a free table on the terrace for lunch?',
            audio: 'Avez-vous une table libre en terrasse pour le déjeuner?',
            tag: 'Dining Flow'
          },
          {
            title: 'Friendship Chat',
            phrase: 'C’est vraiment un plaisir de te revoir après tout ce temps.',
            trans: 'It is truly a pleasure to see you again after all this time.',
            audio: 'C’est vraiment un plaisir de te revoir après tout ce temps.',
            tag: 'Warm Cadence'
          },
          {
            title: 'Supermarket Routine',
            phrase: 'Il nous faut du fromage, du pain frais et des pommes.',
            trans: 'We need cheese, fresh bread, and apples.',
            audio: 'Il nous faut du fromage, du pain frais et des pommes.',
            tag: 'Market List'
          },
          {
            title: 'Evening Parting',
            phrase: 'Passe une très bonne soirée et dors bien!',
            trans: 'Have a very good evening and sleep well!',
            audio: 'Passe une très bonne soirée et dors bien!',
            tag: 'Friendly Night'
          },
          {
            title: 'Museum Visit',
            phrase: 'Les chefs-d’œuvre du Louvre sont célèbres dans le monde entier.',
            trans: 'The masterpieces of the Louvre are famous throughout the world.',
            audio: 'Les chefs-d’œuvre du Louvre sont célèbres dans le monde entier.',
            tag: 'Cultural Pace'
          },
          {
            title: 'Airport Check-in',
            phrase: 'Voici mon passeport et ma carte d’embarquement.',
            trans: 'Here is my passport and my boarding pass.',
            audio: 'Voici mon passeport et ma carte d’embarquement.',
            tag: 'Travel Check'
          },
          {
            title: 'Bookstore Inquiries',
            phrase: 'Cherchez-vous un roman en particulier ou un guide de voyage?',
            trans: 'Are you looking for a particular novel or a travel guide?',
            audio: 'Cherchez-vous un roman en particulier ou un guide de voyage?',
            tag: 'Bookshop Flow'
          },
          {
            title: 'Green Glass Twister',
            phrase: 'Un ver vert va vers un verre vert.',
            trans: 'A green worm goes towards a green glass.',
            audio: 'Un ver vert va vers un verre vert.',
            tag: 'Homophone Agility'
          },
          {
            title: 'Cats & Dogs Twister',
            phrase: 'Cinq chiens chassent six chats dans la cour du voisin.',
            trans: 'Five dogs chase six cats in the neighbor’s yard.',
            audio: 'Cinq chiens chassent six chats dans la cour du voisin.',
            tag: 'Sibilant Speed'
          },
          {
            title: 'Morning Flight',
            phrase: 'Demain matin, je prends le premier avion pour Marseille à l’aube.',
            trans: 'Tomorrow morning, I take the first flight to Marseille at dawn.',
            audio: 'Demain matin, je prends le premier avion pour Marseille à l’aube.',
            tag: 'Travel Tempo'
          }
        ],
        clinics: [
          { phrase: 'Bonjour madame, je cherche un livre sur l’histoire de Paris.', phonetic: '/bɔ̃.ʒuʁ ma.dam ʒə ʃɛʁʃ œ̃ livʁ syʁ l‿is.twaʁ də pa.ʁi/', trans: 'Hello madam, I am looking for a book on the history of Paris.', keySound: 'Silent H & Nasal IN' },
          { phrase: 'Nous aimerions visiter le château samedi matin s’il fait beau.', phonetic: '/nu.z‿ɛm.ʁjɔ̃ vi.zi.te lə ʃa.to sam.di ma.tɛ̃ s‿il fɛ bo/', trans: 'We would like to visit the castle Saturday morning if weather is nice.', keySound: 'Liaison Nous & Nasal IN' },
          { phrase: 'Quelle est la spécialité culinaire typique de votre région?', phonetic: '/kɛl ɛ la spe.sja.li.te ky.li.nɛʁ ti.pik də vɔtʁ ʁe.ʒjɔ̃/', trans: 'What is the typical culinary specialty of your region?', keySound: 'Question Tone & Nasal ON' },
          { phrase: 'J’ai acheté deux billets de train en première classe.', phonetic: '/ʒ‿e aʃ.te dø bi.jɛ də tʁɛ̃ ɑ̃ pʁə.mjɛʁ klas/', trans: 'I bought two train tickets in first class.', keySound: 'Liquid ILL & Nasal IN' },
          { phrase: 'Le concert commence à vingt heures précises ce soir.', phonetic: '/lə kɔ̃.sɛʁ kɔ.mɑ̃s a vɛ̃.t‿œʁ pʁe.siz sə swaʁ/', trans: 'The concert begins at eight o’clock sharp tonight.', keySound: 'Vingt Heures Liaison' },
          { phrase: 'Pourriez-vous m’indiquer le chemin pour aller à l’opéra?', phonetic: '/pu.ʁje vu m‿ɛ̃.di.ke lə ʃmɛ̃ puʁ a.le a l‿ɔ.pe.ʁa/', trans: 'Could you show me the way to get to the opera?', keySound: 'Double R & Nasal IN' },
          { phrase: 'Cet appartement ancien au troisième étage est très lumineux.', phonetic: '/sɛ.t‿a.paʁ.tə.mɑ̃ ɑ̃.sjɛ̃ o tʁwa.zjɛm e.taʒ ɛ tʁɛ ly.mi.nø/', trans: 'This old apartment on the third floor is very bright.', keySound: 'Cet Liaison & EU vowel' },
          { phrase: 'Tous les étudiants préparent activement leurs examens de fin d’année.', phonetic: '/tu le.z‿e.ty.djɑ̃ pʁe.paʁ ak.tiv.mɑ̃ lœʁ.z‿ɛɡ.za.mɛ̃ də fɛ̃ d‿a.ne/', trans: 'All students are actively preparing their end-of-year exams.', keySound: 'Plural Liaison & Nasal' },
          { phrase: 'Prenez votre temps pour déguster ce délicieux dessert maison.', phonetic: '/pʁə.ne vɔtʁ tɑ̃ puʁ de.ɡys.te sə de.li.sjø dɛ.sɛʁ mɛ.zɔ̃/', trans: 'Take your time to savor this delicious homemade dessert.', keySound: 'Clean Vowels & Nasal ON' },
          { phrase: 'J’ai passé un moment inoubliable en compagnie de toute l’équipe.', phonetic: '/ʒ‿e pa.se œ̃ mɔ.mɑ̃ i.nu.bli.jabl ɑ̃ kɔ̃.pa.ɲi də tut l‿e.kip/', trans: 'I had an unforgettable time in the company of the whole team.', keySound: 'Palatal GN & Liquid L' },
          { phrase: 'Le serveur nous a recommandé la tarte aux pommes chaude maison.', phonetic: '/lə sɛʁ.vœʁ nu.z‿a ʁə.kɔ.mɑ̃.de la taʁt o pɔm ʃod mɛ.zɔ̃/', trans: 'The waiter recommended the warm homemade apple tart to us.', keySound: 'Liaison Nous & Nasal ON' },
          { phrase: 'Il y a beaucoup d’activités culturelles dans cette charmante ville.', phonetic: '/i.l‿i.j‿a bo.ku d‿ak.ti.vi.te kyl.ty.ʁɛl dɑ̃ sɛt ʃaʁ.mɑ̃t vil/', trans: 'There are many cultural activities in this charming city.', keySound: 'Y Vowel Glide & R' },
          { phrase: 'Nous espérons vous revoir très bientôt parmi nous à Paris.', phonetic: '/nu.z‿ɛs.pe.ʁɔ̃ vu ʁə.vwaʁ tʁɛ bjɛ̃.to paʁ.mi nu a pa.ʁi/', trans: 'We hope to see you again very soon among us in Paris.', keySound: 'Final S Liaison & Vowels' }
        ]
      }
    ]
  },
  'Chinese Mandarin': {
    1: [
      {
        levelNumber: 1,
        batchId: 1,
        sounds: [
          { symbol: '1st Tone (ˉ)', phonetic: 'mā (妈)', word: 'mā', trans: 'High flat (55) · Mother', audio: 'mā' },
          { symbol: '2nd Tone (ˊ)', phonetic: 'má (麻)', word: 'má', trans: 'Rising (35) · Hemp', audio: 'má' },
          { symbol: '3rd Tone (ˇ)', phonetic: 'mǎ (马)', word: 'mǎ', trans: 'Dipping (214) · Horse', audio: 'mǎ' },
          { symbol: '4th Tone (ˋ)', phonetic: 'mà (骂)', word: 'mà', trans: 'Sharp drop (51) · Scold', audio: 'mà' },
          { symbol: 'Neutral (·)', phonetic: 'ma (吗)', word: 'ma', trans: 'Light neutral · Question', audio: '吗' },
          { symbol: 'b / p', phonetic: 'bō pō', word: 'bō pō', trans: 'Non-aspirated vs Aspirated', audio: 'bō pō' },
          { symbol: 'd / t', phonetic: 'dē tē', word: 'dē tē', trans: 'Tongue-tip stops', audio: 'dē tē' },
          { symbol: 'g / k', phonetic: 'gē kē', word: 'gē kē', trans: 'Velar consonants', audio: 'gē kē' },
          { symbol: 'zh / ch', phonetic: 'zhī chī', word: 'zhī chī', trans: 'Retroflex tongue curl', audio: 'zhī chī' },
          { symbol: 'sh / r', phonetic: 'shī rì', word: 'shī rì', trans: 'Fricative & liquid retroflex', audio: 'shī rì' },
          { symbol: 'z / c / s', phonetic: 'zī cī sī', word: 'zī cī sī', trans: 'Flat dental alveolar', audio: 'zī cī sī' },
          { symbol: 'j / q / x', phonetic: 'jī qī xī', word: 'jī qī xī', trans: 'Flat tongue palatals', audio: 'jī qī xī' },
          { symbol: 'ü (yú)', phonetic: 'yǘ', word: 'yú', trans: 'Fish (puckered lips)', audio: 'yú' },
          { symbol: 'er', phonetic: 'ér', word: 'ér', trans: 'Son (retroflex final)', audio: 'ér' }
        ],
        liaisons: [
          {
            title: '3rd + 3rd Tone Sandhi',
            isolated: 'nǐ (3rd) + hǎo (3rd)',
            connected: 'ní-hǎo (2nd + 3rd)',
            audio: '你好',
            rule: 'When two 3rd tones meet, the first smoothly shifts into a 2nd rising tone.'
          },
          {
            title: 'The "不" (Bù) Tone Shift',
            isolated: 'bù (4th) + shì (4th)',
            connected: 'bú-shì (2nd + 4th)',
            audio: '不是',
            rule: 'Bù shifts from 4th to 2nd tone before another 4th tone.'
          },
          {
            title: 'The "一" (Yī) Before 4th Tone',
            isolated: 'yī (1st) + dìng (4th)',
            connected: 'yí-dìng (2nd + 4th)',
            audio: '一定',
            rule: 'Yī shifts from 1st to 2nd tone before any 4th tone word.'
          },
          {
            title: 'The "一" (Yī) Before 1st/2nd/3rd',
            isolated: 'yī (1st) + qǐ (3rd)',
            connected: 'yì-qǐ (4th + 3rd)',
            audio: '一起',
            rule: 'Yī shifts to 4th falling tone before 1st, 2nd, and 3rd tone words.'
          },
          {
            title: 'Neutral Tone Softening',
            isolated: 'xiè + xiè',
            connected: 'xiè-xie (4th + light)',
            audio: '谢谢',
            rule: 'Reduplicated syllables drop pitch into a short, feather-light neutral sound.'
          },
          {
            title: 'Half-Third Tone Flow',
            isolated: 'hěn (3rd) + gāo (1st)',
            connected: 'hěn (low flat) + gāo',
            audio: '很高',
            rule: 'Before non-3rd tones, 3rd tone stays low without rising back up.'
          },
          {
            title: 'The "啊" (A) Sound Blends',
            isolated: 'hǎo + a',
            connected: 'hǎo-wa (w sound glide)',
            audio: '好啊',
            rule: 'Exclamation marker "a" assimilates with preceding vowel glide.'
          },
          {
            title: 'Er-Hua (Erhua R-Coloring)',
            isolated: 'nǎ + lǐ',
            connected: 'nǎr (哪儿)',
            audio: '哪儿',
            rule: 'Northern Mandarin curls the tongue to fuse -er into preceding syllables.'
          },
          {
            title: 'Tone Shift in "不要"',
            isolated: 'bù (4th) + yào (4th)',
            connected: 'bú-yào (2nd + 4th)',
            audio: '不要',
            rule: 'Everyday refusal shifts into smooth rising second tone.'
          },
          {
            title: 'Reduplicated Verbs',
            isolated: 'kàn + kàn',
            connected: 'kàn-kan (look around)',
            audio: '看看',
            rule: 'Second verb syllable becomes light neutral tone.'
          },
          {
            title: 'The "了" (Le) Completion Softening',
            isolated: 'chī + le',
            connected: 'chī-le (1st + light)',
            audio: '吃了',
            rule: 'Completion particle "le" is unstressed, blending seamlessly after verbs.'
          },
          {
            title: 'The "的" (De) Grammatical Bridge',
            isolated: 'wǒ + de + shū',
            connected: 'wǒ-de-shū (glide)',
            audio: '我的书',
            rule: 'Structural particle "de" stays ultra-short to maintain phrase tempo.'
          },
          {
            title: 'Qī & Bā Tone Sandhi in Counting',
            isolated: 'qī (1st) + kuài (4th)',
            connected: 'qí-kuài (2nd + 4th in rapid speech)',
            audio: '七块',
            rule: 'In rapid speech, numbers 7 and 8 often rise before 4th tone words.'
          }
        ],
        rhythms: [
          {
            title: 'Tone Precision Twister',
            phrase: '妈妈骑马，马慢，妈妈骂马。',
            trans: 'Mother rides a horse, the horse is slow, mother scolds the horse.',
            audio: '妈妈骑马，马慢，妈妈骂马。',
            tag: 'Classic Ma Twister'
          },
          {
            title: '4 & 10 Tone Challenge',
            phrase: '四是四，十是十，十四是十四，四十是四十。',
            trans: 'Four is four, ten is ten, fourteen is fourteen, forty is forty.',
            audio: '四是四，十是十，十四是十四，四十是四十。',
            tag: 'Sì vs Shí Distinction'
          },
          {
            title: 'Greeting Cadence',
            phrase: '你好！很高兴认识你，今天天气非常不错。',
            trans: 'Hello! Pleased to meet you, today the weather is very nice.',
            audio: '你好！很高兴认识你，今天天气非常不错。',
            tag: 'Courteous Flow'
          },
          {
            title: 'Asking the Price',
            phrase: '请问一下，这件漂亮的衣服多少钱一件？',
            trans: 'Excuse me, how much is this pretty piece of clothing?',
            audio: '请问一下，这件漂亮的衣服多少钱一件？',
            tag: 'Shopping Pace'
          },
          {
            title: 'Ordering at the Tea House',
            phrase: '服务员，请给我们来两杯热茉莉花茶。',
            trans: 'Waiter, please bring us two cups of hot jasmine tea.',
            audio: '服务员，请给我们来两杯热茉莉花茶。',
            tag: 'Restaurant Flow'
          },
          {
            title: 'Weekend Plan Cadence',
            phrase: '周末我们打算和朋友一起去故宫参观。',
            trans: 'This weekend we plan to visit the Forbidden City with friends.',
            audio: '周末我们打算和朋友一起去故宫参观。',
            tag: 'Traveler Rhythm'
          },
          {
            title: 'Family Description',
            phrase: '我爸爸妈妈都在北京的一所大学工作。',
            trans: 'My mom and dad both work at a university in Beijing.',
            audio: '我爸爸妈妈都在北京的一所大学工作。',
            tag: 'Family Cadence'
          },
          {
            title: 'Asking Directions',
            phrase: '劳驾，去最近的地铁站应该怎么走？',
            trans: 'Excuse me, how do I get to the nearest subway station?',
            audio: '劳驾，去最近的地铁站应该怎么走？',
            tag: 'Navigation Cadence'
          },
          {
            title: 'Time & Punctuality',
            phrase: '明天早上八点半我们在校门口见面吧。',
            trans: 'Let’s meet at the school gate at 8:30 tomorrow morning.',
            audio: '明天早上八点半我们在校门口见面吧。',
            tag: 'Meeting Flow'
          },
          {
            title: 'Compliment Flow',
            phrase: '你的普通话说得真流利，发音非常标准！',
            trans: 'Your Mandarin is so fluent, your pronunciation is very standard!',
            audio: '你的普通话说得真流利，发音非常标准！',
            tag: 'Praise Rhythm'
          },
          {
            title: 'Grape Skin Twister',
            phrase: '吃葡萄不吐葡萄皮，不吃葡萄倒吐葡萄皮。',
            trans: 'Eat grapes don’t spit skins, don’t eat grapes spit skins.',
            audio: '吃葡萄不吐葡萄皮，不吃葡萄倒吐葡萄皮。',
            tag: 'P & T Agility'
          },
          {
            title: 'Big Watermelon Flow',
            phrase: '大西瓜，圆又圆，切开两半尝口甜。',
            trans: 'Big watermelon, round and round, slice in two to taste the sweetness.',
            audio: '大西瓜，圆又圆，切开两半尝口甜。',
            tag: 'Cadence Rhyme'
          },
          {
            title: 'Airport Farewell Pace',
            phrase: '祝你在新的城市工作顺利，一切顺心，保重身体！',
            trans: 'Wish you smooth work in the new city, all the best, take care!',
            audio: '祝你在新的城市工作顺利，一切顺心，保重身体！',
            tag: 'Warm Parting'
          }
        ],
        clinics: [
          { phrase: '你好！我是李明，非常高兴今天能认识你。', phonetic: 'Nǐ hǎo! Wǒ shì Lǐ Míng, fēicháng gāoxìng jīntiān néng rènshi nǐ.', trans: 'Hello! I am Li Ming, very happy to meet you today.', keySound: 'Tone Shifts & 1st Tones' },
          { phrase: '请问洗手间在哪里？往前面走右拐就到了。', phonetic: 'Qǐngwèn xǐshǒujiān zài nǎlǐ? Wǎng qiánmian zǒu yòuguǎi jiù dào le.', trans: 'Excuse me, where is the restroom? Go forward and turn right.', keySound: '3rd Tones & Directions' },
          { phrase: '我想预订一张明天晚上七点的两人桌。', phonetic: 'Wǒ xiǎng yùdìng yì zhāng míngtiān wǎnshang qī diǎn de liǎng rén zhuō.', trans: 'I would like to reserve a table for two tomorrow at 7 PM.', keySound: 'Yī Shift & Tones' },
          { phrase: '这不是我的行李箱，我的箱子是黑色的。', phonetic: 'Zhè bú shì wǒ de xínglixiāng, wǒ de xiāngzi shì hēisè de.', trans: 'This is not my suitcase, mine is black.', keySound: 'Bù Shift & Neutral' },
          { phrase: '你会说英语吗？我的中文还在初学阶段。', phonetic: 'Nǐ huì shuō yīngyǔ ma? Wǒ de zhōngwén hái zài chūxué jiēduàn.', trans: 'Do you speak English? My Chinese is still at beginner stage.', keySound: 'Question Tones & Sh' },
          { phrase: '这道菜非常美味，服务也很周到热情。', phonetic: 'Zhè dào cài fēicháng měiwèi, fúwù yě hěn zhōudào rèqíng.', trans: 'This dish is very delicious, service is also warm and attentive.', keySound: 'Tone Sandhi & Retroflex' },
          { phrase: '请帮我叫一辆出租车去国际机场，谢谢！', phonetic: 'Qǐng bāng wǒ jiào yí liàng chūzūchē qù guójì jīchǎng, xièxie!', trans: 'Please help me call a taxi to the international airport, thank you!', keySound: 'Ch / Sh / Z Consonants' },
          { phrase: '今天天气有点冷，出门记得多穿一件外套。', phonetic: 'Jīntiān tiānqì yǒudiǎn lěng, chūmén jìde duō chuān yí jiàn wàitào.', trans: 'The weather today is a bit cold, remember to wear a jacket.', keySound: '3rd Tones & Flow' },
          { phrase: '我很喜欢学习中国文化和练习毛笔书法。', phonetic: 'Wǒ hěn xǐhuan xuéxí zhōngguó wénhuà hé liànxí máobǐ shūfǎ.', trans: 'I like studying Chinese culture and practicing calligraphy.', keySound: 'Half-Thirds & Sh/F' },
          { phrase: '祝你旅途愉快，一路顺风，我们北京再见！', phonetic: 'Zhù nǐ lǚtú yúkuài, yílù shùnfēng, wǒmen Běijīng zàijiàn!', trans: 'Wish you a pleasant trip and smooth sailing, see you in Beijing!', keySound: 'Umlaut Ü & Parting Tone' },
          { phrase: '师傅，麻烦您在前面的红绿灯路口靠边停一下。', phonetic: 'Shīfu, máfan nín zài qiánmian de hónglǜdēng lùkǒu kàobiān tíng yíxià.', trans: 'Driver, please pull over near the traffic lights ahead.', keySound: 'Polite Request & Ü Sound' },
          { phrase: '这个手机软件非常方便，可以随时查阅城市地图。', phonetic: 'Zhège shǒujī ruǎnjiàn fēicháng fāngbiàn, kěyǐ suíshí cháyuè chéngshì dìtú.', trans: 'This mobile app is very convenient, you can check maps anytime.', keySound: 'Compound Vowels & Sh/Ch' },
          { phrase: '我们周末经常去国家图书馆借阅各类经典书籍。', phonetic: 'Wǒmen zhōumò jīngcháng qù guójiā túshūguǎn jièyuè gèlèi jīngdiǎn shūjí.', trans: 'We often borrow various classic books at the National Library.', keySound: 'Triple 3rd Tones Flow' }
        ]
      },
      {
        levelNumber: 1,
        batchId: 2,
        sounds: [
          { symbol: 'iao', phonetic: '/jaʊ/', word: 'miáo (喵)', trans: 'Cat meow (triple vowel)', audio: 'miáo' },
          { symbol: 'iu / iou', phonetic: '/joʊ/', word: 'liù (六)', trans: 'Six (glide vowel)', audio: 'liù' },
          { symbol: 'uai', phonetic: '/waɪ/', word: 'kuài (快)', trans: 'Fast / quick', audio: 'kuài' },
          { symbol: 'ui / uei', phonetic: '/weɪ/', word: 'duì (对)', trans: 'Correct / right', audio: 'duì' },
          { symbol: 'an', phonetic: '/an/', word: 'tiān (天)', trans: 'Sky / day', audio: 'tiān' },
          { symbol: 'en', phonetic: '/ən/', word: 'běn (本)', trans: 'Book (front nasal)', audio: 'běn' },
          { symbol: 'in', phonetic: '/in/', word: 'jīn (金)', trans: 'Gold / modern', audio: 'jīn' },
          { symbol: 'un', phonetic: '/wən/', word: 'wén (文)', trans: 'Culture / language', audio: 'wén' },
          { symbol: 'ang', phonetic: '/ɑŋ/', word: 'bàng (棒)', trans: 'Awesome (back nasal)', audio: 'bàng' },
          { symbol: 'eng', phonetic: '/əŋ/', word: 'péng (朋)', trans: 'Friend (resonant)', audio: 'péng' },
          { symbol: 'ing', phonetic: '/iŋ/', word: 'míng (明)', trans: 'Bright / tomorrow', audio: 'míng' },
          { symbol: 'ong', phonetic: '/ʊŋ/', word: 'hóng (红)', trans: 'Red', audio: 'hóng' },
          { symbol: 'iong', phonetic: '/jʊŋ/', word: 'xióng (熊)', trans: 'Bear (palatal back nasal)', audio: 'xióng' },
          { symbol: 'uo', phonetic: '/wɔ/', word: 'guó (国)', trans: 'Country / nation', audio: 'guó' }
        ],
        liaisons: [
          {
            title: 'Triple 3rd Tone Chaining',
            isolated: 'wǒ (3rd) + yě (3rd) + hěn (3rd) + hǎo (3rd)',
            connected: 'wó-yé-hén-hǎo (2nd + 2nd + 2nd + 3rd)',
            audio: '我也很好',
            rule: 'In chains of 3rd tones, all preceding syllables rise to 2nd tones.'
          },
          {
            title: 'The Particle "吧" (Ba) Soft Drop',
            isolated: 'zǒu + ba',
            connected: 'zǒu-ba (suggestive drop)',
            audio: '走吧',
            rule: 'Suggestion marker drops to a very light, soft breath sound.'
          },
          {
            title: 'Numbers: "两" (Liǎng) vs "二" (Èr)',
            isolated: 'liǎng + gè',
            connected: 'liáng-ge (measure word shift)',
            audio: '两个',
            rule: 'Liǎng pairs with measure words, shifting 3rd tone smoothly before gè.'
          },
          {
            title: 'Question Marker "呢" (Ne)',
            isolated: 'nǐ + ne',
            connected: 'nǐ-ne (interrogative glide)',
            audio: '你呢',
            rule: 'Light unstressed syllable keeping conversational cadence lively.'
          },
          {
            title: 'Directional Complements (起来)',
            isolated: 'zhàn + qǐ + lái',
            connected: 'zhàn-qi-lai (neutral reduction)',
            audio: '站起来',
            rule: 'Compound direction suffixes lose their primary tone in natural speech.'
          },
          {
            title: 'The "没" (Méi) Negation Flow',
            isolated: 'méi + yǒu',
            connected: 'méi-yǒu (2nd + low 3rd)',
            audio: '没有',
            rule: 'Smooth melodic bridge that distinguishes past negative from present.'
          },
          {
            title: 'Adverb "太" (Tài) Emphasis',
            isolated: 'tài + hǎo + le',
            connected: 'tài-hǎo-le (4th + 3rd + neutral)',
            audio: '太好了',
            rule: 'Dynamic falling pitch transitioning into exclamation release.'
          },
          {
            title: 'Time Word "点" (Diǎn) Sandhi',
            isolated: 'yǒu + diǎn',
            connected: 'yóu-diǎn (2nd + 3rd)',
            audio: '有点',
            rule: '3rd tone adjective sandhi heard constantly in casual speech.'
          },
          {
            title: 'Locational "里" (Lǐ) Softening',
            isolated: 'jiā + lǐ',
            connected: 'jiā-li (neutral locative)',
            audio: '家里',
            rule: 'Location suffix drops full 3rd tone into brief neutral unstressed tone.'
          },
          {
            title: 'Discourse Marker "那" (Nà)',
            isolated: 'nà + me',
            connected: 'nà-me (filler connector)',
            audio: '那么',
            rule: 'Essential conversational connector linking ideas without abrupt stops.'
          },
          {
            title: 'Potential Marker "得" (De)',
            isolated: 'shuō + de + hǎo',
            connected: 'shuō-de-hǎo (bridge de)',
            audio: '说得好',
            rule: 'Degree complement links action verb directly into assessment adverb.'
          },
          {
            title: 'Reflexive "自己" (Zìjǐ)',
            isolated: 'zì + jǐ',
            connected: 'zì-jǐ (4th + dipping 3rd)',
            audio: '自己',
            rule: 'Clean contrast between sharp drop and dipping tone.'
          },
          {
            title: 'Conjunction "而且" (Érqiě)',
            isolated: 'ér + qiě',
            connected: 'ér-qiě (smooth 2nd to 3rd)',
            audio: '而且',
            rule: 'Fluid sentence transition bridging two related clauses.'
          }
        ],
        rhythms: [
          {
            title: 'Eight Hundred Spearmen',
            phrase: '八百标兵奔北坡，炮兵并排北坡跑。',
            trans: '800 spearmen sprint north slope, artillery runners run side by side.',
            audio: '八百标兵奔北坡，炮兵并排北坡跑。',
            tag: 'B & P Articulation'
          },
          {
            title: 'Dumb & Broad Twister',
            phrase: '扁担长，板凳宽，扁担没有板凳宽。',
            trans: 'Carrying pole is long, bench is wide, pole isn’t wider than bench.',
            audio: '扁担长，板凳宽，扁担没有板凳宽。',
            tag: 'AN & ENG Agility'
          },
          {
            title: 'Ordering Dim Sum',
            phrase: '请给我们上一笼小笼包和一份清炒鲜虾仁。',
            trans: 'Please bring us a basket of soup dumplings and sautéed fresh shrimp.',
            audio: '请给我们上一笼小笼包和一份清炒鲜虾仁。',
            tag: 'Dim Sum Cadence'
          },
          {
            title: 'Catching the High-Speed Train',
            phrase: '高铁马上就要检票了，请大家排好队依次进站。',
            trans: 'The bullet train is boarding soon, please line up and enter.',
            audio: '高铁马上就要检票了，请大家排好队依次进站。',
            tag: 'Transit Tempo'
          },
          {
            title: 'Weather Forecast Pace',
            phrase: '据天气预报说，明天傍晚全城会有中到大雨。',
            trans: 'According to the forecast, moderate to heavy rain will hit tomorrow evening.',
            audio: '据天气预报说，明天傍晚全城会有中到大雨。',
            tag: 'News Cadence'
          },
          {
            title: 'Supermarket Checkout',
            phrase: '请问您需要小票吗？一共是一百二十五块五毛钱。',
            trans: 'Do you need a receipt? The total is 125.50 yuan.',
            audio: '请问您需要小票吗？一共是一百二十五块五毛钱。',
            tag: 'Retail Rhythm'
          },
          {
            title: 'Asking Hotel Amenities',
            phrase: '请问酒店的健身房和室内游泳池在几楼？',
            trans: 'Excuse me, which floor are the gym and indoor pool on?',
            audio: '请问酒店的健身房和室内游泳池在几楼？',
            tag: 'Hotel Flow'
          },
          {
            title: 'Inviting a Colleague',
            phrase: '下班以后有空吗？我们一起去尝尝那家新开的川菜吧。',
            trans: 'Are you free after work? Let’s try that newly opened Sichuan restaurant.',
            audio: '下班以后有空吗？我们一起去尝尝那家新开的川菜吧。',
            tag: 'Social Invitation'
          },
          {
            title: 'Coffee Break Chat',
            phrase: '来一杯冰美式咖啡，不加糖，谢谢！',
            trans: 'An iced Americano coffee, no sugar please, thanks!',
            audio: '来一杯冰美式咖啡，不加糖，谢谢！',
            tag: 'Café Flow'
          },
          {
            title: 'Scenic Park Walk',
            phrase: '秋天的颐和园湖光山色，风景真是美不胜收。',
            trans: 'The Autumn scenery at the Summer Palace is breathtakingly gorgeous.',
            audio: '秋天的颐和园湖光山色，风景真是美不胜收。',
            tag: 'Descriptive Cadence'
          },
          {
            title: 'Library Etiquette',
            phrase: '在阅览室请保持安静，把手机调成静音模式。',
            trans: 'Please keep quiet in the reading room and mute your mobile phone.',
            audio: '在阅览室请保持安静，把手机调成静音模式。',
            tag: 'Announcement Tone'
          },
          {
            title: 'Calling a Colleague',
            phrase: '王经理您好，关于明天会议的演示文稿我已经发您邮箱了。',
            trans: 'Hello Manager Wang, I have emailed you the presentation slides for tomorrow.',
            audio: '王经理您好，关于明天会议的演示文稿我已经发您邮箱了。',
            tag: 'Business Cadence'
          },
          {
            title: 'Weekend Cooking Flow',
            phrase: '周日我最喜欢在家里做几道拿手的好菜犒劳自己。',
            trans: 'On Sundays I love making my specialty dishes at home to treat myself.',
            audio: '周日我最喜欢在家里做几道拿手的好菜犒劳自己。',
            tag: 'Casual Rhythm'
          }
        ],
        clinics: [
          { phrase: '您好！欢迎光临，请问一共几位用餐？', phonetic: 'Nín hǎo! Huānyíng guānglín, qǐngwèn yígòng jǐ wèi yòngcān?', trans: 'Hello! Welcome, how many people in your party for dining?', keySound: 'Polite Nín & Sandhi' },
          { phrase: '我想换一张靠窗户的安静座位，可以吗？', phonetic: 'Wǒ xiǎng huàn yì zhāng kào chuānghu de ānjìng zuòwèi, kěyǐ ma?', trans: 'I would like to change to a quiet window seat, is that possible?', keySound: 'Yī Shift & Ch Consonants' },
          { phrase: '这台笔记本电脑的屏幕分辨率非常高。', phonetic: 'Zhè tái bǐjìběn diànnǎo de píngmù fēnbiànlǜ fēicháng gāo.', trans: 'The screen resolution of this notebook computer is very high.', keySound: 'Bǐ / Jì Tone Contrasts' },
          { phrase: '非常感谢您对我们工作提出的宝贵建议。', phonetic: 'Fēicháng gǎnxiè nín duì wǒmen gōngzuò tíchū de bǎoguì jiànyì.', trans: 'Thank you very much for your valuable advice on our work.', keySound: 'Gǎnxiè & Polite Flow' },
          { phrase: '我们要抓紧时间，不然可能会赶不上末班车。', phonetic: 'Wǒmen yào zhuājǐn shíjiān, bùrán kěnéng huì gǎnbushàng mòbānchē.', trans: 'We need to hurry, otherwise we might miss the last bus.', keySound: 'Zh / Sh & Bù Shift' },
          { phrase: '中国传统书法艺术有着几千年的悠久历史。', phonetic: 'Zhōngguó chuántǒng shūfǎ yìshù yǒuzhe jǐ qiān nián de yōujiǔ lìshǐ.', trans: 'Traditional Chinese calligraphy has thousands of years of history.', keySound: 'Ch / Sh & Dip Tones' },
          { phrase: '麻烦帮我在这张表格的右下角签个名字。', phonetic: 'Máfan bāng wǒ zài zhè zhāng biǎogé de yòuxiàjiǎo qiān ge míngzi.', trans: 'Please help sign your name in the bottom right corner of this form.', keySound: 'Neutral ge & Biǎogé' },
          { phrase: '今天早上交通非常顺畅，只花了二十分钟。', phonetic: 'Jīntiān zǎoshang jiāotōng fēicháng shùnchàng, zhǐ huā le èrshí fēnzhōng.', trans: 'Traffic was very smooth this morning, taking only 20 minutes.', keySound: 'Shùnchàng Retroflex' },
          { phrase: '我们期待未来能有更多深入合作的机会。', phonetic: 'Wǒmen qīdài wèilái néng yǒu gèng duō shēnrù hézuò de jīhuì.', trans: 'We look forward to having more opportunities for deep cooperation.', keySound: 'Clean Vowels & Shēnrù' },
          { phrase: '请您在黄线外耐心排队，谢谢您的配合！', phonetic: 'Qǐng nín zài huángxiàn wài nàixīn páiduì, xièxie nín de pèihé!', trans: 'Please wait patiently behind yellow line, thank you for cooperating!', keySound: 'Ai / Ei Diphthongs' },
          { phrase: '海边的日落景色美得让人流连忘返。', phonetic: 'Hǎibiān de rìluò jǐngsè měi de ràng rén liúlián wàng fǎn.', trans: 'The sunset view by the sea is so captivating you don’t want to leave.', keySound: 'R Consonant & Flow' },
          { phrase: '多喝温开水对身体新陈代谢非常有好处。', phonetic: 'Duō hē wēn kāishuǐ duì shēntǐ xīnchén dàixiè fēicháng yǒu hǎochu.', trans: 'Drinking warm water is very beneficial for body metabolism.', keySound: 'Duō Hē 1st Tones' },
          { phrase: '祝贺你顺利通过本次汉语水平等级考试！', phonetic: 'Zhùhè nǐ shùnlì tōngguò běncì hànyǔ shuǐpíng děngjí kǎoshì.', trans: 'Congratulations on successfully passing this Chinese proficiency exam!', keySound: 'Tone Agility & Sh' }
        ]
      }
    ]
  },
  Spanish: {
    1: [
      {
        levelNumber: 1,
        batchId: 1,
        sounds: [
          { symbol: 'rr (rolled)', phonetic: '/r/', word: 'perro', trans: 'dog (rolled trill)', audio: 'perro' },
          { symbol: 'r (single tap)', phonetic: '/ɾ/', word: 'pero', trans: 'but (single tap)', audio: 'pero' },
          { symbol: 'ñ', phonetic: '/ɲ/', word: 'niño', trans: 'child / boy', audio: 'niño' },
          { symbol: 'll', phonetic: '/ʝ/', word: 'llamar', trans: 'to call', audio: 'llamar' },
          { symbol: 'y', phonetic: '/ʝ/', word: 'yo', trans: 'I / me', audio: 'yo' },
          { symbol: 'j / ge / gi', phonetic: '/x/', word: 'rojo', trans: 'red', audio: 'rojo' },
          { symbol: 'h (silent)', phonetic: 'Ø', word: 'hola', trans: 'hello (silent H)', audio: 'hola' },
          { symbol: 'z / ce / ci', phonetic: '/θ/', word: 'gracias', trans: 'thank you', audio: 'gracias' },
          { symbol: 'v / b', phonetic: '/β/', word: 'vivir', trans: 'to live', audio: 'vivir' },
          { symbol: 'ch', phonetic: '/tʃ/', word: 'chico', trans: 'boy / small', audio: 'chico' },
          { symbol: 'qu', phonetic: '/k/', word: 'queso', trans: 'cheese', audio: 'queso' },
          { symbol: 'gue / gui', phonetic: '/ɡ/', word: 'guitarra', trans: 'guitar', audio: 'guitarra' },
          { symbol: 'güe / güi', phonetic: '/ɡw/', word: 'bilingüe', trans: 'bilingual', audio: 'bilingüe' },
          { symbol: 'a / e / i / o / u', phonetic: '/a e i o u/', word: 'amigo', trans: 'pure clear vowels', audio: 'amigo' }
        ],
        liaisons: [
          {
            title: 'Sinalefa: Two Vowels Blending',
            isolated: 'de + acuerdo',
            connected: 'dea-cuerdo (/de‿a.kweɾ.ðo/)',
            audio: 'de acuerdo',
            rule: 'Adjacent vowels fuse into a single fluid musical syllable.'
          },
          {
            title: 'Identical Vowels Fusing',
            isolated: 'va + a + hablar',
            connected: 'va-hablar (/ba‿aˈblaɾ/)',
            audio: 'va a hablar',
            rule: 'Identical consecutive vowels merge into one held sound.'
          },
          {
            title: 'Consonant to Vowel Bridge',
            isolated: 'los + ojos',
            connected: 'lo-so-jos (/lo.ˈso.xos/)',
            audio: 'los ojos',
            rule: 'Final consonants naturally attach to the start of the next vowel.'
          },
          {
            title: 'Elision in Speech (D Intervocálica)',
            isolated: 'cansado',
            connected: 'cansao (/kanˈsa.o/)',
            audio: 'cansado',
            rule: 'Spoken Spanish softens or drops the intervocalic D.'
          },
          {
            title: 'Preposition "A" Linking',
            isolated: 'voy + a + ir',
            connected: 'voy-a-ir (/boi̯.a.ˈiɾ/)',
            audio: 'voy a ir',
            rule: 'Glide Y links with preposition A into the infinitive.'
          },
          {
            title: 'En + Vowel',
            isolated: 'en + España',
            connected: 'e-nEspaña (/e.nesˈpa.ɲa/)',
            audio: 'en España',
            rule: 'Alveolar nasal shifts smoothly into the capital E.'
          },
          {
            title: 'Con + Vowel',
            isolated: 'con + ella',
            connected: 'co-nella (/ko.ˈne.ʎa/)',
            audio: 'con ella',
            rule: 'Syllabification bridges the final N into the pronoun.'
          },
          {
            title: 'Por + Vowel',
            isolated: 'por + ejemplo',
            connected: 'po-rejemplo (/po.ɾeˈxem.plo/)',
            audio: 'por ejemplo',
            rule: 'Single tap R opens the next word.'
          },
          {
            title: 'Un + Vowel',
            isolated: 'un + amigo',
            connected: 'u-namigo (/u.naˈmi.ɣo/)',
            audio: 'un amigo',
            rule: 'Article N attaches directly to the noun syllable.'
          },
          {
            title: 'Sin + Vowel',
            isolated: 'sin + embargo',
            connected: 'si-nembargo (/si.nemˈbaɾ.ɣo/)',
            audio: 'sin embargo',
            rule: 'Crucial transition marker said in one uninterrupted breath.'
          },
          {
            title: 'Preposition "De" + Vowel (Elision)',
            isolated: 'de + oro',
            connected: 'deo-ro (/de.ˈo.ɾo/)',
            audio: 'de oro',
            rule: 'Preposition "de" joins musical resonance with following vowel.'
          },
          {
            title: 'Article "El" + Vowel Liaison',
            isolated: 'el + agua',
            connected: 'e-lagua (/e.ˈla.ɣwa/)',
            audio: 'el agua',
            rule: 'Lateral L consonant glides directly into feminine stressed A noun.'
          },
          {
            title: 'Word-Final "D" Softening (Madrid)',
            isolated: 'Madrid',
            connected: 'Madri(ð) (/maˈðɾið/)',
            audio: 'Madrid',
            rule: 'Word-final D softens into a breathy dental fricative in Spain and Latin America.'
          }
        ],
        rhythms: [
          {
            title: 'The Famous "RR" Twister',
            phrase: 'Tres tristes tigres tragaban trigo en un trigal.',
            trans: 'Three sad tigers swallowed wheat in a wheat field.',
            audio: 'Tres tristes tigres tragaban trigo en un trigal.',
            tag: 'Rolled R Agility'
          },
          {
            title: 'Erre con Erre Twister',
            phrase: 'Erre con erre guitarra, erre con erre barril, rápido corren los carros.',
            trans: 'R with R guitar, R with R barrel, fast run the train cars.',
            audio: 'Erre con erre guitarra, erre con erre barril, rápido corren los carros.',
            tag: 'Tongue Trill Mastery'
          },
          {
            title: 'Morning Greeting Flow',
            phrase: '¡Buenos días! ¿Cómo amaneciste hoy? Espero que muy bien.',
            trans: 'Good morning! How did you wake up today? I hope very well.',
            audio: '¡Buenos días! ¿Cómo amaneciste hoy? Espero que muy bien.',
            tag: 'Warm Cadence'
          },
          {
            title: 'Tapas Bar Rhythm',
            phrase: 'Por favor, ¿nos puedes traer una ración de jamón y dos aguas?',
            trans: 'Please, can you bring us a portion of ham and two waters?',
            audio: 'Por favor, ¿nos puedes traer una ración de jamón y dos aguas?',
            tag: 'Tapas Speed'
          },
          {
            title: 'City Walk Pace',
            phrase: 'Vamos a dar un paseo por el parque del Retiro esta tarde.',
            trans: 'Let’s go for a walk in Retiro park this afternoon.',
            audio: 'Vamos a dar un paseo por el parque del Retiro esta tarde.',
            tag: 'Leisure Cadence'
          },
          {
            title: 'Train Station Hurry',
            phrase: 'El tren con destino a Barcelona sale del andén número cuatro.',
            trans: 'The train bound for Barcelona leaves from platform number four.',
            audio: 'El tren con destino a Barcelona sale del andén número cuatro.',
            tag: 'Transit Cadence'
          },
          {
            title: 'Coffee Break Flow',
            phrase: 'Me gustaría tomar un café con leche templado y un cruasán.',
            trans: 'I would like to have a lukewarm coffee with milk and a croissant.',
            audio: 'Me gustaría tomar un café con leche templado y un cruasán.',
            tag: 'Café Flow'
          },
          {
            title: 'Market Shopping Pace',
            phrase: 'Póngame un kilo de manzanas rojas y medio kilo de plátanos.',
            trans: 'Give me a kilo of red apples and half a kilo of bananas.',
            audio: 'Póngame un kilo de manzanas rojas y medio kilo de plátanos.',
            tag: 'Market Cadence'
          },
          {
            title: 'Hotel Front Desk',
            phrase: 'Tengo una reserva a nombre de Carlos para tres noches.',
            trans: 'I have a reservation under the name of Carlos for three nights.',
            audio: 'Tengo una reserva a nombre de Carlos para tres noches.',
            tag: 'Hotel Flow'
          },
          {
            title: 'Friendship Meeting',
            phrase: '¡Cuánto tiempo sin verte! Tenemos que ponernos al día pronto.',
            trans: 'Long time no see! We have to catch up soon.',
            audio: '¡Cuánto tiempo sin verte! Tenemos que ponernos al día pronto.',
            tag: 'Reunion Flow'
          },
          {
            title: 'Little Paul Nail Twister',
            phrase: 'Pablito clavó un clavito en la calva de un calvito.',
            trans: 'Little Pablo hammered a little nail into a little bald man’s head.',
            audio: 'Pablito clavó un clavito en la calva de un calvito.',
            tag: 'CL Consonant Cluster'
          },
          {
            title: 'Little Coconut Twister',
            phrase: 'El que poco coco come, poco coco compra.',
            trans: 'He who eats little coconut, buys little coconut.',
            audio: 'El que poco coco come, poco coco compra.',
            tag: 'P & K Cadence'
          },
          {
            title: 'Weekend Beach Getaway',
            phrase: 'En agosto siempre vamos a pasar el fin de semana a la playa con la familia.',
            trans: 'In August we always go spend the weekend at the beach with family.',
            audio: 'En agosto siempre vamos a pasar el fin de semana a la playa con la familia.',
            tag: 'Summer Flow'
          }
        ],
        clinics: [
          { phrase: '¡Hola! Me llamo María y estoy encantada de conocerte.', phonetic: '/ˈo.la me ˈʝa.mo maˈɾi.a i esˈtoi̯ en.kanˈta.da ðe ko.noˈseɾ.te/', trans: 'Hello! My name is Maria and I am delighted to meet you.', keySound: 'LL Sound & Pure Vowels' },
          { phrase: 'Disculpe señor, ¿dónde está la estación de metro más cercana?', phonetic: '/disˈkul.pe seˈɲoɾ ˈdon.de esˈta la es.taˈsjon de ˈme.tɾo mas seɾˈka.na/', trans: 'Excuse me sir, where is the nearest metro station?', keySound: 'Tap R & Question Melody' },
          { phrase: 'Quisiera pedir una paella tradicional de mariscos para dos.', phonetic: '/kiˈsje.ɾa peˈðiɾ ˈu.na paˈe.ʎa tɾa.ði.sjoˈnal de maˈɾis.kos ˈpa.ɾa ðos/', trans: 'I would like to order a traditional seafood paella for two.', keySound: 'Intervocalic D & LL' },
          { phrase: 'El hotel tiene una terraza maravillosa con vistas a la catedral.', phonetic: '/el oˈtel ˈtje.ne ˈu.na teˈra.sa ma.ɾa.βiˈʎo.sa kon ˈbis.tas a la ka.teˈðɾal/', trans: 'The hotel has a marvelous terrace overlooking the cathedral.', keySound: 'Rolled RR & V/B sound' },
          { phrase: 'Muchas gracias por su amable ayuda, que tenga un excelente día.', phonetic: '/ˈmu.tʃas ˈɣɾa.sjas poɾ su aˈma.βle aˈʝu.ða ke ˈteŋ.ɡa un ek.seˈlen.te ˈði.a/', trans: 'Thank you very much for your kind help, have an excellent day.', keySound: 'Polite Flow & Bilingüe' },
          { phrase: '¿A qué hora empieza la función del teatro esta noche?', phonetic: '/a ke ˈo.ɾa emˈpje.sa la funˈsjon del teˈa.tɾo ˈes.ta ˈno.tʃe/', trans: 'What time does the theater show start tonight?', keySound: 'Z/C Lisp & Pure O/E' },
          { phrase: 'Prefiero viajar en tren porque es más cómodo y ecológico.', phonetic: '/pɾeˈfje.ɾo bjaˈxaɾ en tɾen poɾˈke es mas ˈko.mo.ðo i e.koˈlo.xi.ko/', trans: 'I prefer traveling by train because it is more comfortable and ecological.', keySound: 'Jota /x/ & Tap R' },
          { phrase: 'Mañana por la mañana vamos a visitar el Museo del Prado.', phonetic: '/maˈɲa.na poɾ la maˈɲa.na ˈba.mos a bi.siˈtaɾ el muˈse.o ðel ˈpɾa.ðo/', trans: 'Tomorrow morning we are going to visit the Prado Museum.', keySound: 'Ñ Sound & Vowels' },
          { phrase: 'Fue un placer inmenso compartir esta velada contigo.', phonetic: '/fwe un plaˈseɾ inˈmen.so kom.paɾˈtiɾ ˈes.ta beˈla.ða konˈti.ɣo/', trans: 'It was an immense pleasure to share this evening with you.', keySound: 'Intervocalic D & G' },
          { phrase: '¡Buen viaje y que te diviertas mucho en tus vacaciones!', phonetic: '/bwen ˈbja.xe i ke te ðiˈβjeɾ.tas ˈmu.tʃo en tus ba.kaˈsjo.nes/', trans: 'Safe travels and have a lot of fun on your vacation!', keySound: 'Exclamation Energy & Jota' },
          { phrase: 'El restaurante italiano de la esquina prepara una pasta fresca deliciosa.', phonetic: '/el res.taw.ˈɾan.te i.ta.ˈlja.no ðe la es.ˈki.na pɾe.ˈpa.ɾa ˈu.na ˈpas.ta ˈfɾes.ka ðe.li.ˈsjo.sa/', trans: 'The Italian restaurant on the corner prepares delicious fresh pasta.', keySound: 'Fricative D & Flow' },
          { phrase: 'Necesito cambiar dinero antes de tomar el autobús hacia el aeropuerto.', phonetic: '/ne.se.ˈsi.to kam.ˈbjaɾ di.ˈne.ɾo ˈan.tes ðe to.ˈmaɾ el aw.to.ˈβus ˈa.sja el a.e.ɾo.ˈpweɾ.to/', trans: 'I need to exchange money before taking the bus to the airport.', keySound: 'B/V Bilabial & Sinalefa' },
          { phrase: 'Fue una experiencia inolvidable conocer a tanta gente acogedora y simpática.', phonetic: '/fwe ˈu.na eks.pe.ˈɾjen.sja i.nol.bi.ˈða.βle ko.no.ˈseɾ a ˈtan.ta ˈxen.te a.ko.xe.ˈðo.ɾa i sim.ˈpa.ti.ka/', trans: 'It was an unforgettable experience meeting so many welcoming people.', keySound: 'Jota /x/ & Tap R' }
        ]
      },
      {
        levelNumber: 1,
        batchId: 2,
        sounds: [
          { symbol: 'br', phonetic: '/bɾ/', word: 'brazo', trans: 'arm (bilabial + tap)', audio: 'brazo' },
          { symbol: 'cr', phonetic: '/kɾ/', word: 'crema', trans: 'cream / lotion', audio: 'crema' },
          { symbol: 'dr', phonetic: '/dɾ/', word: 'madre', trans: 'mother', audio: 'madre' },
          { symbol: 'fr', phonetic: '/fɾ/', word: 'fruta', trans: 'fruit', audio: 'fruta' },
          { symbol: 'gr', phonetic: '/ɡɾ/', word: 'grande', trans: 'big / large', audio: 'grande' },
          { symbol: 'pr', phonetic: '/pɾ/', word: 'primo', trans: 'cousin', audio: 'primo' },
          { symbol: 'tr', phonetic: '/tɾ/', word: 'tren', trans: 'train', audio: 'tren' },
          { symbol: 'bl', phonetic: '/bl/', word: 'blanco', trans: 'white', audio: 'blanco' },
          { symbol: 'cl', phonetic: '/kl/', word: 'claro', trans: 'clear / of course', audio: 'claro' },
          { symbol: 'fl', phonetic: '/fl/', word: 'flor', trans: 'flower', audio: 'flor' },
          { symbol: 'gl', phonetic: '/ɡl/', word: 'globo', trans: 'balloon', audio: 'globo' },
          { symbol: 'pl', phonetic: '/pl/', word: 'playa', trans: 'beach', audio: 'playa' },
          { symbol: 'x (s / ks)', phonetic: '/ks/', word: 'éxito', trans: 'success', audio: 'éxito' },
          { symbol: 'tl', phonetic: '/tl/', word: 'atleta', trans: 'athlete', audio: 'atleta' }
        ],
        liaisons: [
          {
            title: 'Sinalefa Triple (Three Vowels Merging)',
            isolated: 'iba + a + hablar',
            connected: 'ibaa-blar (/i.ba‿aˈblaɾ/)',
            audio: 'iba a hablar',
            rule: 'Three successive vowels across word boundaries glide into one extended tone.'
          },
          {
            title: 'Seseo & Ceceo Transition',
            isolated: 'caza + casa',
            connected: 'caza (/ˈka.θa/ o /ˈka.sa/)',
            audio: 'caza y casa',
            rule: 'Mastering the distinction between Spain ceceo (th) and Latin America seseo (s).'
          },
          {
            title: 'Nasal Assimilation Before P/B (m sound)',
            isolated: 'en + paz',
            connected: 'em-paz (/emˈpas/)',
            audio: 'en paz',
            rule: 'The letter N assimilates into a bilabial M sound before P and B.'
          },
          {
            title: 'Alveolar N Before Velar C/G/J (ŋ sound)',
            isolated: 'un + gato',
            connected: 'uŋ-gato (/uŋˈɡa.to/)',
            audio: 'un gato',
            rule: 'N shifts back into the soft palate velar position before G and K.'
          },
          {
            title: 'Preposition "Hacia" Linking',
            isolated: 'hacia + el',
            connected: 'hacia-el (/ˈa.sja‿el/)',
            audio: 'hacia el',
            rule: 'Unaccented vowels blend effortlessly without any glottal pause.'
          },
          {
            title: 'Direct Object Lo/La Enclitic',
            isolated: 'dámelo',
            connected: 'dá-me-lo (/ˈda.me.lo/)',
            audio: 'dámelo',
            rule: 'Pronouns append directly onto imperative verbs maintaining stress position.'
          },
          {
            title: 'Gerund Clitic Attachment',
            isolated: 'diciéndotelo',
            connected: 'di-cién-do-te-lo',
            audio: 'diciéndotelo',
            rule: 'Stress stays fixed on the verb stem with a written accent.'
          },
          {
            title: 'Conjunction "Y" Becomes "E"',
            isolated: 'padre + y + hijo',
            connected: 'padre e hijo (/ˈpa.ðɾe e ˈi.xo/)',
            audio: 'padre e hijo',
            rule: 'The conjunction "y" transforms into "e" before words starting with the "i" sound.'
          },
          {
            title: 'Conjunction "O" Becomes "U"',
            isolated: 'siete + o + ocho',
            connected: 'siete u ocho (/ˈsje.te w‿ˈo.tʃo/)',
            audio: 'siete u ocho',
            rule: 'The conjunction "o" transforms into "u" before words beginning with "o".'
          },
          {
            title: 'Soft B/V Between Vowels (Aproximante)',
            isolated: 'la + vaca',
            connected: 'la βaca (/la ˈβa.ka/)',
            audio: 'la vaca',
            rule: 'Between vowels, Spanish B and V are pronounced with lips not touching.'
          },
          {
            title: 'Soft G Between Vowels',
            isolated: 'amigo',
            connected: 'a-mi-ɣo (/aˈmi.ɣo/)',
            audio: 'amigo',
            rule: 'Intervocalic G softens into a smooth voiced velar fricative.'
          },
          {
            title: 'Tap R in Inverted Verbs',
            isolated: 'quiero + ir',
            connected: 'quie-ro-ir (/ˈkje.ɾo.iɾ/)',
            audio: 'quiero ir',
            rule: 'Vowel glide between conjugated verb and following infinitive.'
          },
          {
            title: 'Final -S Aspiration (Dialectal)',
            isolated: 'hasta + luego',
            connected: 'hahta luego (/ˈah.ta ˈlwe.ɣo/)',
            audio: 'hasta luego',
            rule: 'In Southern Spain, the Caribbean, and the Andes, syllable-final S softens to H.'
          }
        ],
        rhythms: [
          {
            title: 'The Stork Twister',
            phrase: 'La cigüeña sube a la torre con su pico largo.',
            trans: 'The stork climbs to the tower with its long beak.',
            audio: 'La cigüeña sube a la torre con su pico largo.',
            tag: 'Güe & Ñ Rhythm'
          },
          {
            title: 'Quick Dog Twister',
            phrase: 'El perro de San Roque no tiene rabo porque Ramón Ramírez se lo ha cortado.',
            trans: 'San Roque’s dog has no tail because Ramón Ramírez cut it off.',
            audio: 'El perro de San Roque no tiene rabo porque Ramón Ramírez se lo ha cortado.',
            tag: 'RR Virtuoso Drill'
          },
          {
            title: 'Flamenco Guitar Tempo',
            phrase: 'La guitarra flamenca suena con una pasión vibrante en las calles de Sevilla.',
            trans: 'The flamenco guitar sounds with vibrant passion in the streets of Seville.',
            audio: 'La guitarra flamenca suena con una pasión vibrante en las calles de Sevilla.',
            tag: 'Andalucía Pace'
          },
          {
            title: 'Metro Announcement',
            phrase: 'Próxima estación Sol, correspondencia con líneas uno, dos y tres de metro.',
            trans: 'Next station Sol, transfer to metro lines 1, 2, and 3.',
            audio: 'Próxima estación Sol, correspondencia con líneas uno, dos y tres de metro.',
            tag: 'Transit Cadence'
          },
          {
            title: 'Ordering Paella in Valencia',
            phrase: 'Camarero, una paella valenciana con pollo, conejo y judías verdes por favor.',
            trans: 'Waiter, a Valencian paella with chicken, rabbit, and green beans please.',
            audio: 'Camarero, una paella valenciana con pollo, conejo y judías verdes por favor.',
            tag: 'Dining Flow'
          },
          {
            title: 'Museum Tour Cadence',
            phrase: 'En esta sala podemos admirar las obras maestras de Velázquez y Goya.',
            trans: 'In this hall we can admire the masterpieces of Velazquez and Goya.',
            audio: 'En esta sala podemos admirar las obras maestras de Velázquez y Goya.',
            tag: 'Art & Culture'
          },
          {
            title: 'Booking a Flight',
            phrase: 'Quisiera confirmar mi billete de ida y vuelta para el próximo martes.',
            trans: 'I would like to confirm my round-trip ticket for next Tuesday.',
            audio: 'Quisiera confirmar mi billete de ida y vuelta para el próximo martes.',
            tag: 'Travel Rhythm'
          },
          {
            title: 'Sunny Promenade Walk',
            phrase: 'Caminamos junto a la orilla del mar disfrutando de la brisa marina.',
            trans: 'We walked along the seashore enjoying the marine breeze.',
            audio: 'Caminamos junto a la orilla del mar disfrutando de la brisa marina.',
            tag: 'Coastal Flow'
          },
          {
            title: 'Hospitality Greeting',
            phrase: 'Pase adelante, siéntase como en su propia casa y tómese algo fresco.',
            trans: 'Come right in, make yourself at home and have something cool to drink.',
            audio: 'Pase adelante, siéntase como en su propia casa y tómese algo fresco.',
            tag: 'Warm Courtesy'
          },
          {
            title: 'Fresh Bakery Morning',
            phrase: 'El aroma a pan recién horneado inunda toda la plaza del mercado central.',
            trans: 'The aroma of freshly baked bread floods the entire central market square.',
            audio: 'El aroma a pan recién horneado inunda toda la plaza del mercado central.',
            tag: 'Morning Rhythm'
          },
          {
            title: 'Football Match Excitement',
            phrase: '¡Qué golazo espectacular acaba de marcar el delantero en el último minuto!',
            trans: 'What a spectacular goal the forward just scored in the very last minute!',
            audio: '¡Qué golazo espectacular acaba de marcar el delantero en el último minuto!',
            tag: 'Excitement Tempo'
          },
          {
            title: 'University Campus Chat',
            phrase: 'Nos reuniremos en la biblioteca general para repasar los apuntes del examen.',
            trans: 'We will meet in the main library to review the exam notes.',
            audio: 'Nos reuniremos en la biblioteca general para repasar los apuntes del examen.',
            tag: 'Academic Pace'
          },
          {
            title: 'Evening Farewell',
            phrase: 'Ha sido una noche fantástica, descansen mucho y nos vemos el lunes temprano.',
            trans: 'It has been a fantastic night, rest well and see you Monday early.',
            audio: 'Ha sido una noche fantástica, descansen mucho y nos vemos el lunes temprano.',
            tag: 'Friendly Goodbye'
          }
        ],
        clinics: [
          { phrase: '¡Buenas tardes! ¿En qué puedo ayudarle hoy en nuestra tienda?', phonetic: '/ˈbwe.nas ˈtaɾ.ðes eŋ ke ˈpwe.ðo a.ʝu.ˈðaɾ.le oi̯ en ˈnwes.tɾa ˈtjen.da/', trans: 'Good afternoon! How can I help you today in our shop?', keySound: 'Bwe / Diphthongs & Intervocalic D' },
          { phrase: '¿Podría indicarme el camino más directo para llegar a la playa?', phonetic: '/po.ˈðɾi.a in.di.ˈkaɾ.me el ka.ˈmi.no mas di.ˈɾek.to ˈpa.ɾa ʝe.ˈɣaɾ a la ˈpla.ʝa/', trans: 'Could you indicate the most direct way to get to the beach?', keySound: 'Soft G/D & LL Sound' },
          { phrase: 'Me encantaría aprender a bailar salsa y bachata este verano.', phonetic: '/me eŋ.kan.ta.ˈɾi.a a.pɾen.ˈdeɾ a βai̯.ˈlaɾ ˈsal.sa i βa.ˈtʃa.ta ˈes.te βe.ˈɾa.no/', trans: 'I would love to learn how to dance salsa and bachata this summer.', keySound: 'Tap R & Bilabial B/V' },
          { phrase: 'El clima aquí es sumamente agradable durante casi todo el año.', phonetic: '/el ˈkli.ma a.ˈki es su.ma.ˈmen.te a.ɣɾa.ˈða.βle ðu.ˈɾan.te ˈka.si ˈto.ðo el ˈa.ɲo/', trans: 'The climate here is extremely pleasant during almost the whole year.', keySound: 'Ñ Sound & Soft D/B' },
          { phrase: '¿Tienen opciones vegetarianas o sin gluten en la carta del menú?', phonetic: '/ˈtje.nen op.ˈsjo.nes βe.xe.ta.ˈɾja.nas o siŋ ˈɡlu.ten en la ˈkaɾ.ta ðel me.ˈnu/', trans: 'Do you have vegetarian or gluten-free options on the menu?', keySound: 'Jota /x/ & Sinalefa' },
          { phrase: 'El concierto de anoche en el auditorio nacional fue inolvidable.', phonetic: '/el kon.ˈsjeɾ.to ðe a.ˈno.tʃe en el aw.ði.ˈto.ɾjo na.sjo.ˈnal fwe i.nol.bi.ˈða.βle/', trans: 'Last night’s concert in the national auditorium was unforgettable.', keySound: 'Ch / Pure Vowels / Sinalefa' },
          { phrase: 'Por favor firme este documento con bolígrafo azul en la última hoja.', phonetic: '/poɾ fa.ˈβoɾ ˈfiɾ.me ˈes.te do.ku.ˈmen.to kom bo.ˈli.ɣɾa.fo a.ˈsul en la ˈul.ti.ma ˈo.xa/', trans: 'Please sign this document with blue pen on the last page.', keySound: 'Z/S & Intervocalic G' },
          { phrase: 'Disfrutamos muchísimo de las vistas panorámicas desde el mirador.', phonetic: '/dis.fɾu.ˈta.mos mu.ˈtʃi.si.mo ðe las ˈbis.tas pa.no.ˈɾa.mi.kas ˈdez.ðe el mi.ɾa.ˈðoɾ/', trans: 'We greatly enjoyed the panoramic views from the viewpoint.', keySound: 'Ch & Bilabial V/B' },
          { phrase: 'Siempre es un placer visitar esta hermosa e histórica ciudad.', phonetic: '/ˈsjem.pɾe es um pla.ˈseɾ bi.si.ˈtaɾ ˈes.ta eɾ.ˈmo.sa e is.ˈto.ɾi.ka sju.ˈðað/', trans: 'It is always a pleasure to visit this beautiful and historic city.', keySound: 'Silent H & Tap R' },
          { phrase: 'Nos despedimos deseándoles el mayor de los éxitos en sus proyectos.', phonetic: '/noz ðes.pe.ˈði.mos de.se.ˈan.do.les el ma.ˈʝoɾ ðe los ˈek.si.tos en sus pɾo.ˈʝek.tos/', trans: 'We bid farewell wishing you the greatest success in your projects.', keySound: 'S to Z glide before D' },
          { phrase: 'El café colombiano tiene un aroma suave y un sabor inconfundible.', phonetic: '/el ka.ˈfe ko.lom.ˈbja.no ˈtje.ne un a.ˈɾo.ma ˈswa.βe i un sa.ˈβoɾ iŋ.koɱ.fun.ˈdi.βle/', trans: 'Colombian coffee has a smooth aroma and an unmistakable flavor.', keySound: 'Nasal Assimilation & V/B' },
          { phrase: 'Asegúrese de apagar las luces y cerrar bien las ventanas antes de salir.', phonetic: '/a.se.ˈɣu.ɾe.se ðe a.pa.ˈɣaɾ las ˈlu.ses i se.ˈraɾ bjen las ben.ˈta.nas ˈan.tes ðe sa.ˈliɾ/', trans: 'Make sure to turn off the lights and close windows before leaving.', keySound: 'Double RR & Soft G' },
          { phrase: '¡Enhorabuena por su excelente graduación académica con honores!', phonetic: '/e.no.ɾa.ˈβwe.na poɾ sw‿ek.se.ˈlen.te ɡɾa.ðwa.ˈsjon a.ka.ˈðe.mi.ka kon o.ˈno.ɾes/', trans: 'Congratulations on your excellent academic graduation with honors!', keySound: 'Exclamation & H Silences' }
        ]
      }
    ]
  }
};

class AudioGymService {
  /**
   * Returns a level-scoped batch of exercises for the given language and level
   */
  public getLevelBatch(
    language: string,
    levelNumber: number,
    requestedBatchIndex?: number
  ): LevelGymContent {
    const langData = LEVEL_VARIATIONS[language] || LEVEL_VARIATIONS.French;
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
  public generateNextVariation(language: string, levelNumber: number, currentBatchId: number): LevelGymContent {
    const langData = LEVEL_VARIATIONS[language] || LEVEL_VARIATIONS.French;
    const levelKey = Math.min(Math.max(1, levelNumber), 2);
    const batches = langData[levelKey] || langData[1];

    const nextIdx = (currentBatchId % batches.length);
    return batches[nextIdx];
  }
}

export const audioGymService = new AudioGymService();
