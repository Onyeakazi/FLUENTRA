// FLUENTRA Curriculum Registry — 8 Levels, 80 Stages, 800 Units Total
import { Level, UnitMetadata, Stage } from '../types/curriculum';

interface LevelBlueprint {
  name: string;
  tagline: string;
  description: string;
  color: string;
  cefr: string;
  stageThemes: { title: string; desc: string; unitTopics: string[] }[];
}

const LEVEL_BLUEPRINTS: Record<number, LevelBlueprint> = {
  1: {
    name: 'Foundations',
    tagline: 'Sounds, Greetings & Survival Words',
    description: 'Master accurate pronunciation, core greetings, alphabet phonics, numbers, and basic sentence structures.',
    color: 'var(--fl-teal-light)',
    cefr: 'A1.1',
    stageThemes: [
      {
        title: 'Sounds & Phonics',
        desc: 'Vowels, nasal sounds, and mouth shaping',
        unitTopics: [
          'Vowel Sounds & Breath', 'Nasal Vowels', 'Silent Letters & Endings', 'Elisions & Liaisons',
          'Accents & Intonation', 'P / B / V Sound Distinction', 'The French R Sound', 'Rhythm & Word Stress',
          'Phonic Recognition', 'Foundations Sound Check'
        ]
      },
      {
        title: 'Greetings & Introductions',
        desc: 'Saying hello, goodbye, and your name',
        unitTopics: [
          'Formal vs Informal Greetings', 'Saying Your Name', 'Asking Someone’s Name', 'Polite Expressions',
          'Goodbyes & Parting Words', 'Where Are You From?', 'Nationalities', 'Meeting Someone New',
          'Simple Small Talk', 'Stage 2 Speaking Milestone'
        ]
      },
      {
        title: 'Numbers & Counting',
        desc: 'Numbers 1–100, phone numbers, and ages',
        unitTopics: [
          'Numbers 1 to 10', 'Numbers 11 to 20', 'Multiples of Ten', 'Numbers up to 69',
          'Special Number Systems (70-99)', 'Counting to 100', 'Sharing Your Age', 'Exchanging Phone Numbers',
          'Basic Quantities', 'Numbers Speed Challenge'
        ]
      },
      {
        title: 'Calendar & Time',
        desc: 'Days of the week, months, and the clock',
        unitTopics: [
          'Days of the Week', 'Months of the Year', 'Seasons & Weather', 'Telling the Hour',
          'Minutes & Half-Hours', 'Morning, Noon, Night', 'Scheduling a Day', 'Important Dates',
          'Today, Tomorrow, Yesterday', 'Time & Dates Assessment'
        ]
      },
      {
        title: 'Essential Classroom & Tech Words',
        desc: 'Navigating everyday learning items',
        unitTopics: [
          'Classroom Objects', 'Phone & Screen Words', 'Asking for Clarification', 'Please Repeat',
          'Spell That Out', 'Understanding Instructions', 'Notebooks & Writing', 'Audio & Listening Words',
          'Simple Commands', 'Learning Essentials Check'
        ]
      },
      {
        title: 'Basic Everyday Objects',
        desc: 'Keys, wallet, bag, clothes, and colors',
        unitTopics: [
          'Personal Belongings', 'Colors & Shades', 'Where Is My...?', 'Describing Size',
          'Definite Articles (The)', 'Indefinite Articles (A / An)', 'This and That', 'Lost Items',
          'Daily Bag Essentials', 'Object Identification Milestone'
        ]
      },
      {
        title: 'Yes, No & Basic Questions',
        desc: 'Affirmations, negations, and question words',
        unitTopics: [
          'Yes, No, Maybe', 'Do You Speak English?', 'Who, What, Where', 'When & Why',
          'How Much Is It?', 'Basic Negation (Not)', 'Confirming Facts', 'Polite Inquiries',
          'Simple Interrogatives', 'Question Formation Sprint'
        ]
      },
      {
        title: 'Basic Feelings & States',
        desc: 'I am tired, happy, hungry, thirsty, ready',
        unitTopics: [
          'I Am / You Are', 'Hunger & Thirst', 'Hot & Cold', 'Tired vs Energetic',
          'Happy, Fine, Sad', 'Being In a Hurry', 'Ready or Not', 'Expressing Needs',
          'Basic Physical Sensations', 'Feelings & States Check'
        ]
      },
      {
        title: 'Simple Action Verbs',
        desc: 'To go, to have, to be, to want, to do',
        unitTopics: [
          'The Verb To Be (Être)', 'The Verb To Have (Avoir)', 'The Verb To Go (Aller)', 'The Verb To Do (Faire)',
          'I Want / I Would Like', 'I Can / Can You?', 'Going Somewhere', 'Having Something',
          'Action Verb Pairing', 'Core Verbs Benchmark'
        ]
      },
      {
        title: 'Foundations Capstone',
        desc: 'Consolidation of all Level 1 foundations',
        unitTopics: [
          'Self-Introduction Monologue', 'Pronunciation Comprehensive', 'Listening to Real Introductions',
          'Survival Phrase Recall', 'Number & Time Rapid Fire', 'Asking 10 Key Questions', 'Polite Interaction Simulation',
          'Vocabulary Retrospective', 'Foundations Final Evaluation', 'Level 1 Mastery Gate'
        ]
      }
    ]
  },
  2: {
    name: 'Basic Communication',
    tagline: 'Family, Food & Essential Places',
    description: 'Describe family members, order simple snacks, navigate places in town, and ask daily survival questions.',
    color: '#38BDF8',
    cefr: 'A1.2',
    stageThemes: [
      {
        title: 'Family & Relationships',
        desc: 'Parents, siblings, and pets',
        unitTopics: [
          'Immediate Family', 'Extended Family', 'Talking About Siblings', 'Pets & Animals',
          'Marital Status', 'Describing Family Traits', 'Family Gatherings', 'Generations',
          'Who Lives With You?', 'Family Tree Presentation'
        ]
      },
      {
        title: 'Food Basics & Snacks',
        desc: 'Bread, cheese, coffee, fruits, and drinks',
        unitTopics: [
          'Bakery Staples (Baguette & Croissants)', 'Coffee, Tea & Water', 'Morning Breakfast', 'Fruits & Berries',
          'Vegetables', 'Dairy & Cheeses', 'Meats & Alternatives', 'Sweet vs Savory',
          'Snack Time', 'Food Vocabulary Mastery'
        ]
      },
      {
        title: 'In the Town & Neighborhood',
        desc: 'Streets, shops, pharmacy, and parks',
        unitTopics: [
          'Places in Town', 'The Pharmacy & Doctor', 'The Supermarket', 'The Bank & ATM',
          'Parks & Squares', 'Train Station & Metro', 'Near and Far', 'Is There A... Nearby?',
          'Neighborhood Walk', 'Town Navigation Test'
        ]
      },
      {
        title: 'Simple Questions & Answers',
        desc: 'Constructing confident two-way exchanges',
        unitTopics: [
          'What Time Does It Open?', 'Where Can I Find...?', 'How Do I Get To...?', 'Is It Included?',
          'Do You Take Card?', 'Can I Help You?', 'Short Answers', 'Clarifying Answers',
          'Polite Conversational Fillers', 'Interactive Dialogue Sprint'
        ]
      },
      {
        title: 'Daily Activities',
        desc: 'Waking up, working, eating, and sleeping',
        unitTopics: [
          'Morning Routine', 'Commuting to Work/School', 'Lunch Break', 'Afternoon Tasks',
          'Evening Downtime', 'Bedtime Habits', 'Weekend vs Weekday', 'Frequency Words (Always, Often)',
          'Daily Timeline', 'Habits Presentation'
        ]
      },
      {
        title: 'At the Market',
        desc: 'Weights, prices, fresh produce, and bags',
        unitTopics: [
          'A Kilo Of...', 'A Piece Of...', 'Fresh Produce Selection', 'Asking For the Best Item',
          'Prices and Change', 'Reusable Bags', 'Market Etiquette', 'Tasting Before Buying',
          'Full Market Interaction', 'Market Dialogue Milestone'
        ]
      },
      {
        title: 'Transportation Basics',
        desc: 'Bus, metro tickets, taxi, and walking',
        unitTopics: [
          'Buying a Ticket', 'Which Line / Platform?', 'Next Stop Announcements', 'Taking a Taxi',
          'Walking Directions', 'Left, Right, Straight', 'Cross the Street', 'Delays and Schedules',
          'Transit Map Reading', 'Commuter Challenge'
        ]
      },
      {
        title: 'Describing Your Home',
        desc: 'Rooms, furniture, and apartment life',
        unitTopics: [
          'Rooms of the House', 'Kitchen Essentials', 'Bedroom & Living Room', 'Bathroom Items',
          'Big, Small, Cozy', 'Floor Number & Elevator', 'Where Things Are Located', 'Home Chores',
          'Renting Basics', 'Home Tour Challenge'
        ]
      },
      {
        title: 'Making Plans with Friends',
        desc: 'Inviting, agreeing, and meeting up',
        unitTopics: [
          'Are You Free Tonight?', 'Let’s Meet At...', 'What Time Works?', 'Accepting an Invite',
          'Politely Declining', 'Suggesting an Activity', 'Checking Weather for Plans', 'Running Late Message',
          'Confirmation Exchange', 'Social Planning Simulation'
        ]
      },
      {
        title: 'Basic Communication Capstone',
        desc: 'Level 2 synthesis and comprehensive test',
        unitTopics: [
          'Roleplay: First Day in a New City', 'Ordering a Light Lunch', 'Asking for Directions to Museum',
          'Describing Your Daily Life', 'Family Photo Discussion', 'Listening: Real Train Station Voice',
          'Speaking Accuracy Check', 'Essential Grammar Check', 'Level 2 Synthesis Test', 'Level 2 Mastery Gate'
        ]
      }
    ]
  },
  3: {
    name: 'Everyday Life',
    tagline: 'Shopping, Dining, Transport & Routines',
    description: 'Comfortably handle restaurant dining, clothing shopping, appointments, and describing people and places in detail.',
    color: '#818CF8',
    cefr: 'A2.1',
    stageThemes: [
      {
        title: 'Dining at a Restaurant',
        desc: 'Menus, specials, appetizers, and paying the bill',
        unitTopics: [
          'Reserving a Table', 'Reading the Menu', 'The Daily Special (Plat du Jour)', 'Dietary Restrictions',
          'Ordering Courses', 'Asking for Recommendations', 'More Water / Napkins', 'Complimenting the Food',
          'Asking for the Check', 'Restaurant Roleplay'
        ]
      },
      {
        title: 'Shopping for Clothes',
        desc: 'Sizes, colors, materials, and trying on',
        unitTopics: [
          'Clothing Items', 'Shoe & Clothing Sizes', 'Fitting Room Inquiries', 'Too Tight / Too Loose',
          'Fabrics (Cotton, Wool, Silk)', 'Discounts & Sales', 'Exchanges & Returns', 'Cashier Exchange',
          'Window Shopping Vocabulary', 'Boutique Shopping Simulation'
        ]
      },
      {
        title: 'At the Pharmacy & Health',
        desc: 'Minor ailments, symptoms, and medicine',
        unitTopics: [
          'Body Parts', 'Headache & Fever', 'Cough & Cold', 'Describing Pain',
          'At the Pharmacy Counter', 'Prescription & Dosage', 'Allergies', 'Rest & Recovery Advice',
          'Emergency Health Numbers', 'Health Consultation Milestone'
        ]
      },
      {
        title: 'Hobbies & Leisure',
        desc: 'Sports, arts, music, and outdoor fun',
        unitTopics: [
          'Playing Instruments', 'Favorite Sports', 'Reading & Cinema', 'Cooking as a Hobby',
          'Going Outdoors & Hiking', 'Photography & Art', 'Joining a Club', 'Talking About Passion',
          'Sharing Weekend Hobbies', 'Hobbies Dialogue Challenge'
        ]
      },
      {
        title: 'Making Appointments',
        desc: 'Doctor, barber, dentist, and timing',
        unitTopics: [
          'Calling For an Appointment', 'Available Time Slots', 'Rescheduling', 'Canceling Courteously',
          'Arrival & Waiting Room', 'Explaining the Reason', 'Follow-up Date', 'Calendar Reminders',
          'Receptionist Exchange', 'Appointment Mastery Check'
        ]
      },
      {
        title: 'Describing People & Appearances',
        desc: 'Hair, eyes, height, and personality',
        unitTopics: [
          'Hair Color & Style', 'Eye Color & Facial Features', 'Height & Build', 'Clothing Styles',
          'Personality Traits (Kind, Funny, Serious)', 'First Impressions', 'Comparing People', 'Character Quirks',
          'Describing a Friend', 'People Description Sprint'
        ]
      },
      {
        title: 'Weather & Seasons in Depth',
        desc: 'Forecasts, climate, and dressing accordingly',
        unitTopics: [
          'Interpreting Weather Forecasts', 'Temperature Scales', 'Rain, Storm & Wind', 'Snow & Winter Terms',
          'Summer Heatwaves', 'Packing for the Weather', 'Climate Across Regions', 'Seasonal Traditions',
          'Small Talk About the Weather', 'Meteorology Challenge'
        ]
      },
      {
        title: 'At the Post Office & Admin',
        desc: 'Sending packages, letters, and forms',
        unitTopics: [
          'Stamps & Envelopes', 'Sending a Parcel', 'Filling Out Sender/Recipient', 'Tracking Numbers',
          'Official Identification', 'Proof of Address', 'Filling Out Basic Forms', 'Administrative Politeness',
          'Postal Counter Dialogue', 'Services Milestone'
        ]
      },
      {
        title: 'Describing Objects & Preferences',
        desc: 'Shape, material, utility, and favorites',
        unitTopics: [
          'Materials (Wood, Metal, Glass)', 'Shapes & Dimensions', 'How It Works', 'Why I Prefer This',
          'Pros & Cons', 'Comparing Two Products', 'Recommendations', 'Giving Honest Feedback',
          'Consumer Review Challenge', 'Object Presentation'
        ]
      },
      {
        title: 'Everyday Life Capstone',
        desc: 'Complete Level 3 integration and roleplay',
        unitTopics: [
          'Roleplay: A Full Day in Paris/Madrid', 'Dinner Party with Locals', 'Solving a Delivery Issue',
          'Shopping Assistance Exchange', 'Describing Your Ideal City', 'Listening Comprehension: Street Audio',
          'Pronunciation Fluency Check', 'Level 3 Vocabulary Review', 'Level 3 Synthesis Test', 'Level 3 Mastery Gate'
        ]
      }
    ]
  },
  4: {
    name: 'Building Fluency',
    tagline: 'Tenses, Sentence Construction & Complex Ideas',
    description: 'Master past, present, and future tenses, construct compound sentences, and express opinions smoothly.',
    color: '#A855F7',
    cefr: 'A2.2',
    stageThemes: [
      {
        title: 'The Past Tense (Passé Composé)',
        desc: 'Completed actions and yesterday’s stories',
        unitTopics: [
          'Auxiliary Verbs (Avoir vs Être)', 'Regular Past Participles', 'Irregular Past Participles', 'Agreement Rules',
          'Yesterday What Did You Do?', 'Describing a Past Vacation', 'Past Negation', 'Time Markers (Yesterday, Last Year)',
          'Storytelling in the Past', 'Past Tense Sprint'
        ]
      },
      {
        title: 'The Imperfect Tense (L’Imparfait)',
        desc: 'Memories, childhood, habits, and background',
        unitTopics: [
          'Imparfait Endings', 'When I Was Young...', 'Habitual Past Actions', 'Setting the Scene (It Was Raining)',
          'Passé Composé vs Imparfait', 'Childhood Memories', 'How Things Used to Be', 'Telling a Spooky Tale',
          'Past Tense Contrast', 'Memories Narrative Challenge'
        ]
      },
      {
        title: 'Talking About the Future',
        desc: 'Near future (aller) and simple future',
        unitTopics: [
          'Near Future with Aller', 'Simple Future Endings', 'Irregular Future Stems', 'Next Weekend Plans',
          'Career & Life Goals', 'Predictions & Forecasts', 'If / When Clauses (Si + Présent)', 'Making Promises',
          'Dream Itinerary', 'Future Horizon Milestone'
        ]
      },
      {
        title: 'Complex Sentences & Connectors',
        desc: 'Because, although, but, therefore, whereas',
        unitTopics: [
          'Cause & Effect (Because, Since)', 'Contrast (However, Although)', 'Consequence (Therefore, So)', 'Addition (Furthermore)',
          'Chronology (First, Then, Finally)', 'Relative Pronouns (Who, Which, That)', 'Where & When Pronouns', 'Building Long Sentences',
          'Smooth Transitions', 'Flow & Cohesion Sprint'
        ]
      },
      {
        title: 'Expressing Preferences & Opinions',
        desc: 'I believe, in my view, I agree, I disagree',
        unitTopics: [
          'In My Opinion...', 'I Think That / I Believe That', 'Strong Agreement', 'Polite Disagreement',
          'Weighing Options', 'Talking About Value', 'Cultural Differences', 'Food Critiques',
          'Mini-Debate Exchange', 'Opinion Expression Milestone'
        ]
      },
      {
        title: 'Pronouns in Action (Direct & Indirect)',
        desc: 'Him, her, them, to me, to us, replacing nouns',
        unitTopics: [
          'Direct Object Pronouns (Le, La, Les)', 'Indirect Object Pronouns (Lui, Leur)', 'Pronoun Placement Before Verbs',
          'Pronouns in the Past Tense', 'The Pronoun Y (Places)', 'The Pronoun En (Quantities)', 'Double Pronoun Order',
          'Natural Speech Flow', 'Avoiding Repetition', 'Pronoun Mastery Test'
        ]
      },
      {
        title: 'Comparisons & Superlatives',
        desc: 'More than, less than, as good as, the best',
        unitTopics: [
          'More... Than / Less... Than', 'As... As Comparisons', 'The Best and The Worst', 'Better vs Best (Mieux vs Meilleur)',
          'Comparing Cities', 'Comparing Lifestyles', 'Price vs Quality', 'Superlative Nuance',
          'Product Comparison Pitch', 'Comparative Analysis Check'
        ]
      },
      {
        title: 'Conditionals & Polite Requests',
        desc: 'I would like, could you, if I had time',
        unitTopics: [
          'Polite Conditional (I Would Like)', 'Could You Please? (Pourriez-vous)', 'Hypothetical Situations', 'Giving Friendly Advice',
          'If I Were You...', 'Expressing Regret', 'Wishes & Dreams', 'Workplace Politeness',
          'Courtesy Mastery', 'Polite Negotiation Sprint'
        ]
      },
      {
        title: 'Daily Problem Solving',
        desc: 'Broken appliances, missing items, customer service',
        unitTopics: [
          'It Doesn’t Work', 'Missing Parts', 'Contacting Support', 'Describing the Malfunction',
          'Requesting a Replacement', 'Understanding Warranty', 'Refund Demands', 'Escalating an Issue',
          'Resolving Disputes', 'Customer Service Challenge'
        ]
      },
      {
        title: 'Building Fluency Capstone',
        desc: 'Level 4 comprehensive synthesis',
        unitTopics: [
          'Multi-Tense Narrative Presentation', 'Roleplay: Solving a Landlord Issue', 'Persuasive Speech: City Life vs Country Life',
          'Rapid Tense Switching Exercise', 'Listening to Native Podcasts Excerpt', 'Pronunciation Cadence Test',
          'Vocabulary & Grammar Cross-Check', 'Self-Correction Demonstration', 'Level 4 Final Evaluation', 'Level 4 Mastery Gate'
        ]
      }
    ]
  },
  5: {
    name: 'Practical Conversation',
    tagline: 'Travel, Roleplays, Requests & Social Life',
    description: 'Immerse in full real-world scenarios: airport logistics, hotel check-ins, networking, and cultural discussions.',
    color: '#FF6B4A',
    cefr: 'B1.1',
    stageThemes: [
      {
        title: 'Airport Logistics & Boarding',
        desc: 'Check-in, security, gates, and luggage issues',
        unitTopics: [
          'Airport Check-in Counter', 'Baggage Allowance & Fees', 'Security Protocol Directions', 'Flight Status & Gate Changes',
          'Lost Luggage Claim', 'Customs Declaration', 'Immigration Inquiries', 'Connecting Flights',
          'Duty Free Inquiries', 'Airport Roleplay Milestone'
        ]
      },
      {
        title: 'Hotel & Vacation Rentals',
        desc: 'Reservations, amenities, complaints, check-out',
        unitTopics: [
          'Checking In to a Hotel', 'Requesting Room Changes', 'Wi-Fi & Amenities', 'Air Conditioning & Heating Issues',
          'Breakfast & Room Service', 'Local Recommendations from Concierge', 'Late Check-out Request', 'Reviewing the Final Bill',
          'Vacation Rental Host Communication', 'Hotel Interaction Benchmark'
        ]
      },
      {
        title: 'Social Gatherings & Networking',
        desc: 'Mingling, introductions, interests, humor',
        unitTopics: [
          'Entering a Conversation Group', 'Introducing Mutual Friends', 'Finding Common Ground', 'Talking About Professions',
          'Reacting to Surprising News', 'Sharing Amusing Anecdotes', 'Gracefully Exiting a Conversation', 'Exchanging Social Media',
          'Party Small Talk Mastery', 'Networking Simulation'
        ]
      },
      {
        title: 'Travel Emergencies & Assistance',
        desc: 'Lost passport, medical clinic, police reports',
        unitTopics: [
          'Losing a Wallet or Passport', 'Filing a Police Report', 'Describing Suspects or Incidents', 'Consulate Assistance',
          'Urgent Care Clinic Visit', 'Pharmacy Prescriptions Abroad', 'Emergency Roadside Assistance', 'Canceled Travel Bookings',
          'Emergency Hotlines', 'Crisis Navigation Challenge'
        ]
      },
      {
        title: 'Giving & Receiving Advice',
        desc: 'Guiding others, best practices, mentoring',
        unitTopics: [
          'You Should Really Try...', 'Have You Considered...?', 'Seeking Practical Guidance', 'Pros and Cons of a Choice',
          'Career Advice Exchanges', 'Financial Budgeting Tips', 'Health & Fitness Suggestions', 'Reflecting on Advice',
          'Constructive Feedback Tone', 'Advisory Dialogue Milestone'
        ]
      },
      {
        title: 'Cultural Norms & Etiquette',
        desc: 'Politeness codes, dinner hosting, taboos',
        unitTopics: [
          'Dinner Host Gifts & Traditions', 'Greetings Etiquette (La Bise etc.)', 'Table Manners & Toasting', 'Tipping Practices',
          'Conversational Taboos', 'Public Space Etiquette', 'Regional Differences', 'Stereotypes vs Realities',
          'Cultural Curiosity Exchanges', 'Etiquette Benchmark'
        ]
      },
      {
        title: 'Workplace Interactions',
        desc: 'Emails, team meetings, project updates',
        unitTopics: [
          'Professional Email Greetings', 'Scheduling a Team Sync', 'Giving a Project Update', 'Asking for Deadlines',
          'Addressing Colleagues', 'Watercooler Conversations', 'Sharing Work Challenges', 'Presenting Ideas to the Boss',
          'Meeting Etiquette', 'Workplace Dialogue Sprint'
        ]
      },
      {
        title: 'Expressing Doubts & Certainty',
        desc: 'Subjunctive hints, probability, confidence',
        unitTopics: [
          'I Am Sure That...', 'It Is Possible That...', 'I Doubt It', 'Introduction to the Subjunctive',
          'Expressing Wishes with Subjunctive', 'It Is Necessary That...', 'Expressing Uncertainty', 'Reassuring Someone',
          'Subjunctive Everyday Formulas', 'Certainty & Doubt Milestone'
        ]
      },
      {
        title: 'Storytelling & Personal Anecdotes',
        desc: 'Building narrative tension and memorable moments',
        unitTopics: [
          'Hooking the Listener', 'Setting the Scene', 'The Turning Point (Suddenly...)', 'Dialogue Inside Stories',
          'Exaggeration & Humor', 'Resolving the Plot', 'Reflecting on the Outcome', 'Storytelling Timing',
          '3-Minute Personal Tale', 'Storytelling Showcase'
        ]
      },
      {
        title: 'Practical Conversation Capstone',
        desc: 'Unscripted scenarios and Level 5 mastery',
        unitTopics: [
          'Roleplay: Stranded Traveler Solves Everything', 'Job Interview: Past Experience Showcase', 'Dinner with French Host Family',
          'Listening to Fast Colloquial Dialogue', 'Spontaneous Debate: Travel vs Roots', 'Accent Refinement Check',
          'Vocabulary Depth Benchmark', 'Idiomatic Usage Review', 'Level 5 Comprehensive Test', 'Level 5 Mastery Gate'
        ]
      }
    ]
  },
  6: {
    name: 'Conversational Ability',
    tagline: 'Spontaneous Speaking & Natural Expressions',
    description: 'Think directly in the target language. Overcome translation hesitation, tell rich stories, and recover seamlessly.',
    color: '#00C48C',
    cefr: 'B1.2',
    stageThemes: [
      {
        title: 'Spontaneous Responses & Flow',
        desc: 'Eliminating mental translation pauses',
        unitTopics: [
          'Speed Drills: Rapid Answering', 'Conversational Fillers (Well, You See...)', 'Buying Time to Think', 'Immediate Reactions',
          'Interrupting Courteously', 'Holding the Floor', 'Paraphrasing When Forgetting a Word', 'Natural Intonation Bursts',
          'Stream of Consciousness', 'Fluency Speed Benchmark'
        ]
      },
      {
        title: 'Colloquial Language & Slang',
        desc: 'Everyday street French, contractions, verlan',
        unitTopics: [
          'Everyday Contractions (T’as, J’sais pas)', 'Common Slang Words (Boulot, Pote, Fric)', 'Verlan Basics (Ouf, Meuf)',
          'Informal Question Forms', 'When to Use Slang Safely', 'Pop Culture References', 'Text Messaging Abbreviations',
          'Youth vs Mature Colloquialisms', 'Street Audio Decoding', 'Colloquial Mastery Check'
        ]
      },
      {
        title: 'Nuanced Emotions & Tone',
        desc: 'Irony, empathy, sarcasm, and subtle feelings',
        unitTopics: [
          'Gentle Irony and Wit', 'Deep Empathy & Comforting Words', 'Expressing Annoyance Calmly', 'Enthusiastic Celebration',
          'Disappointment & Resilience', 'Relief & Gratitude', 'Sarcasm Detection', 'Vocal Inflection Mastery',
          'Emotional Resonance Test', 'Tone Dialogue Challenge'
        ]
      },
      {
        title: 'Complex Narrative Storytelling',
        desc: 'Multi-part accounts and personal journeys',
        unitTopics: [
          'A Turning Point in My Life', 'A Travel Misadventure', 'A Surprising Coincidence', 'An Unforgettable Encounter',
          'Describing Complex Environments', 'Building Suspense', 'Character Voices', 'Moral of the Story',
          'Storytelling Feedback Loop', 'Narrative Milestone'
        ]
      },
      {
        title: 'Explaining Abstract Concepts',
        desc: 'Philosophy, creativity, motivation, and time',
        unitTopics: [
          'Defining What Success Means', 'The Nature of Creativity', 'Balancing Work and Wellbeing', 'Why We Procrastinate',
          'The Impact of Modern Tech', 'Friendship Across Distance', 'Personal Freedom vs Duty', 'Cultural Identity',
          'Abstract Concept Defense', 'Philosophy Sprint'
        ]
      },
      {
        title: 'Conversation Recovery Tactics',
        desc: 'Handling misunderstandings like a native',
        unitTopics: [
          'What Did You Mean By...?', 'Let Me Rephrase That', 'I Lost My Train of Thought', 'That’s Not Quite What I Meant',
          'Clarifying Accent Mismatches', 'Switching Topics Smoothly', 'Summarizing the Other Person’s Point', 'Graceful Recoveries',
          'Troubleshooting Confusions', 'Resilience Dialogue Check'
        ]
      },
      {
        title: 'Persuasion & Gentle Debate',
        desc: 'Constructing arguments without confrontation',
        unitTopics: [
          'Opening an Argument Respectfully', 'Providing Compelling Evidence', 'Acknowledging the Counter-Argument', 'Finding Middle Ground',
          'Rhetorical Questions', 'Changing Someone’s Mind', 'Agreeing to Disagree', 'Closing a Persuasive Point',
          'Live Argument Simulation', 'Debate Milestone'
        ]
      },
      {
        title: 'News & Current Events Discussion',
        desc: 'Headlines, social trends, environmental topics',
        unitTopics: [
          'Reading News Headlines', 'Climate & Green Initiatives', 'Urban Development Trends', 'Educational Reforms',
          'Global Economics Basics', 'Scientific Discoveries', 'Social Movements', 'Analyzing Multiple Perspectives',
          'News Anchor Audio Analysis', 'Current Events Roundtable'
        ]
      },
      {
        title: 'Advanced Subjunctive Mastery',
        desc: 'Subtle feelings, doubts, necessities, and idioms',
        unitTopics: [
          'Subjunctive with Emotions', 'Subjunctive with Conjunctions (Bien que, Pour que)', 'Subjunctive of Doubt',
          'Fixed Subjunctive Idioms', 'Subjunctive vs Indicative Nuances', 'Natural Subjunctive Reflexes',
          'Grammar in Spoken Flow', 'Rapid Subjunctive Conjugations', 'Subjunctive Benchmark', 'Fluency Drill'
        ]
      },
      {
        title: 'Conversational Ability Capstone',
        desc: 'Level 6 spontaneous mastery evaluation',
        unitTopics: [
          '10-Minute Uninterrupted Conversation', 'Defending an Unexpected Position', 'Colloquial Street Scene Simulation',
          'Fast Podcast Comprehension', 'Pronunciation Cadence & Accent Review', 'Vocabulary Richness Evaluation',
          'Spontaneous Response Latency Check', 'Comprehensive Fluency Report', 'Level 6 Final Evaluation', 'Level 6 Mastery Gate'
        ]
      }
    ]
  },
  7: {
    name: 'Advanced Communication',
    tagline: 'Idioms, Professional Nuance, Debate & Humor',
    description: 'Master regional idioms, handle tough professional interviews, navigate delicate humor, and speak with cultural authority.',
    color: '#F59E0B',
    cefr: 'B2',
    stageThemes: [
      {
        title: 'Idiomatic Expressions & Figurative Speech',
        desc: 'Metaphors, sayings, and colorful language',
        unitTopics: [
          'Animal Idioms', 'Food & Cooking Metaphors', 'Weather & Nature Sayings', 'Body Part Idioms',
          'Time & Money Expressions', 'When Pigs Fly Equivalents', 'Translating Idioms Naturally', 'Avoiding Clichés',
          'Idiomatic Story Construction', 'Idiom Pro Challenge'
        ]
      },
      {
        title: 'Professional Job Interviews',
        desc: 'Career achievements, strengths, and negotiations',
        unitTopics: [
          'Executive Self-Presentation', 'Discussing Failures & Resilience', 'Strategic Vision & Leadership', 'Salary & Compensation Negotiation',
          'Behavioral Interview Questions', 'Company Culture Alignment', 'Asking Thoughtful Questions to Interviewers', 'Following Up Post-Interview',
          'Mock Executive Interview', 'Career Milestone'
        ]
      },
      {
        title: 'Humor, Wit & Banter',
        desc: 'Irony, wordplay, observational comedy',
        unitTopics: [
          'French Puns (Jeux de Mots)', 'Dry Humor & Understatement', 'Teasing Friends Affectionately', 'Comedic Timing & Pauses',
          'Cultural Comedy Standards', 'Understanding Standup Clips', 'Self-Deprecating Wit', 'Responding to Teasing',
          'Humorous Banter Practice', 'Wit & Humor Milestone'
        ]
      },
      {
        title: 'High-Stakes Negotiations',
        desc: 'Contracts, concessions, compromise, deadlines',
        unitTopics: [
          'Setting the Negotiation Framework', 'Making Initial Offers', 'Pushback and Counter-Proposals', 'Finding Leverage',
          'Concessions and Trade-offs', 'Tactical Silence in Negotiation', 'Formalizing Verbal Agreements', 'Handling Tough Counterparts',
          'Contract Negotiation Simulation', 'Negotiation Benchmark'
        ]
      },
      {
        title: 'Formal Speeches & Presentations',
        desc: 'Keynotes, introductions, rhetoric, cadence',
        unitTopics: [
          'Keynote Introductions', 'Structuring a Compelling 3-Act Talk', 'Rhetorical Devices (Anaphora, Tricolon)', 'Stage Presence & Pacing',
          'Handling Hostile Audience Q&A', 'Using Slides & Visual Aids in Target Language', 'Inspiring Calls to Action', 'Toast at a Formal Dinner',
          '5-Minute Presentation Delivery', 'Rhetoric Milestone'
        ]
      },
      {
        title: 'Literature, Cinema & Art Critique',
        desc: 'Reviewing films, novels, and exhibits',
        unitTopics: [
          'Analyzing Cinematography & Plot', 'Literary Styles & Themes', 'Contemporary Art Interpretations', 'Writing an Editorial Review',
          'Discussing Classic Masterpieces', 'Music Album Critiques', 'Theater & Performance Analysis', 'Defending Artistic Choices',
          'Cultural Critic Challenge', 'Arts Milestone'
        ]
      },
      {
        title: 'Ethics, Society & Legal Concepts',
        desc: 'Justice, morality, rights, and civic debates',
        unitTopics: [
          'Fundamental Human Rights', 'Bioethics & Genetic Tech', 'AI Ethics & Automation', 'Freedom of Speech Boundaries',
          'Criminal Justice System Terms', 'Environmental Responsibility', 'Civil Obligations', 'Ethical Dilemmas Case Studies',
          'Moral Debate Roundtable', 'Ethics Benchmark'
        ]
      },
      {
        title: 'Regional Dialects & Accents',
        desc: 'Quebec, Swiss, Belgian, and African French',
        unitTopics: [
          'Quebecois French Vocabulary & Sounds', 'Belgian French Particulars (Nonante etc.)', 'Swiss French Expressions',
          'West African French Flavor', 'Southern French Accent & Rhythm', 'Parisian Cadence Differences', 'Mutual Intelligibility',
          'Global Francophone Culture', 'Global Accents Listening Sprint', 'Dialect Diversity Check'
        ]
      },
      {
        title: 'Subtle Diplomatic Language',
        desc: 'Softening blow, consensus building, tact',
        unitTopics: [
          'Diplomatic Euphemisms', 'Softening Harsh Realities', 'Building Multi-Party Consensus', 'Navigating Political Sensitivities',
          'Crafting Formal Statements', 'De-escalating Tensions', 'Institutional Jargon', 'Cross-Cultural Diplomacy',
          'Diplomatic Simulation', 'Tact & Grace Milestone'
        ]
      },
      {
        title: 'Advanced Communication Capstone',
        desc: 'Level 7 comprehensive mastery evaluation',
        unitTopics: [
          'Formal Public Address', 'Hardball Negotiation Roleplay', 'Analysis of Native Editorial Column',
          'Rapid Wit & Banter Challenge', 'Accent Fine-Tuning & Nuance Scoring', 'Comprehensive Vocabulary Diversity Assessment',
          'Complex Idiom Integration Check', 'Detailed Stylistic Feedback', 'Level 7 Final Evaluation', 'Level 7 Mastery Gate'
        ]
      }
    ]
  },
  8: {
    name: 'Mastery',
    tagline: 'Free Conversation, Cultural Authority & Native Resonance',
    description: 'Effortless communication across any domain. Freeform voice dialogue, subtle subtext, debate, and effortless fluency.',
    color: '#FFB800',
    cefr: 'C1/C2',
    stageThemes: [
      {
        title: 'Freeform Spontaneous Dialogue',
        desc: 'Unconstrained, open-ended conversational mastery',
        unitTopics: [
          'Unscripted Philosophy Session', 'Improvised Banter with AI Tutor', 'Stream of Consciousness Exploration', 'Rapid Topic Shifting',
          'Deep Personal Confessions', 'Late Night Conversations', 'Intellectual Sparring', 'Effortless Natural Rhythm',
          'Spontaneous Voice Challenge', 'Freeform Fluency Benchmark'
        ]
      },
      {
        title: 'Subtext & Unspoken Meaning',
        desc: 'Reading between the lines, sarcasm, cultural cues',
        unitTopics: [
          'Detecting Subtle Sarcasm', 'What Is Left Unsaid', 'Social Inferences & Body Language Cues', 'Passive Aggression Identification',
          'Double Entendres', 'Strategic Ambiguity', 'Polite Dismissals', 'Decoding Complex Subtext',
          'Subtext Analysis Milestone', 'Intuition Benchmark'
        ]
      },
      {
        title: 'Advanced Technical & Scientific Discourse',
        desc: 'Engineering, medicine, economics, mathematics',
        unitTopics: [
          'Biotechnology & Medicine Terms', 'Computer Science & Neural Networks', 'Macroeconomic Models', 'Quantum Mechanics Simplifications',
          'Engineering Problem Solving', 'Peer Review Critiques', 'Academic Research Papers', 'Presenting Complex Data',
          'Scientific Colloquium Challenge', 'Technical Mastery Check'
        ]
      },
      {
        title: 'Deep Cultural Immersion',
        desc: 'History, political evolution, national identity',
        unitTopics: [
          'Key Historical Pivots (e.g. 1789, 1968)', 'The Republic & Secularism (Laïcité)', 'Literary Movements (Existentialism, Romanticism)',
          'Gastronomy as Heritage', 'Social Safety Nets & Strikes', 'Cinema Nouvelle Vague', 'Colonial Legacy & Modern Identity',
          'National Pride & Self-Criticism', 'Deep Culture Dialogue', 'Heritage Milestone'
        ]
      },
      {
        title: 'Persuasive Oratory & Public Debate',
        desc: 'Championing a cause before a critical audience',
        unitTopics: [
          'Parliamentary Debate Style', 'Refuting Sophistry and Fallacies', 'Emotional Appeal (Pathos) Mastery', 'Logical Rigor (Logos)',
          'Moral Credibility (Ethos)', 'Handling Live Hecklers', 'Closing Arguments That Resonate', 'Televised Debate Simulation',
          'Oratory Masterclass Delivery', 'Debate Championship'
        ]
      },
      {
        title: 'Accent & Phonetic Refinement',
        desc: 'Eliminating residual mother-tongue traces',
        unitTopics: [
          'Micro-Vowel Resonances', 'Perfecting the Glottal & Back Vowels', 'Rhythmic Cadence & Breath Control', 'Consonant Clusters',
          'Singing & Poetry Recitation', 'Mimicking Regional Native Speakers', 'Phonetic Precision Under Pressure', 'Vocal Stamina',
          'Acoustic Waveform Comparison', 'Phonetic Perfection Test'
        ]
      },
      {
        title: 'Crisis & High-Pressure Communication',
        desc: 'Managing intense confrontations and crises',
        unitTopics: [
          'Crisis PR Statement', 'Hostile Press Conference Handling', 'High-Stakes Emergency Coordination', 'De-escalating Panicked Crowds',
          'Delivering Devastating News with Dignity', 'Remaining Poised Under Fire', 'Absolute Linguistic Precision', 'Damage Control Tactics',
          'Live Pressure Simulation', 'Crisis Benchmark'
        ]
      },
      {
        title: 'Personalized Weakness Eradication',
        desc: 'Targeted correction of lingering error patterns',
        unitTopics: [
          'Diagnostic Review of Recurring Errors', 'Preposition Precision Drills', 'Gender Memory Tricks (Masculine/Feminine)',
          'False Friends (Faux Amis) Elimination', 'Tense Consistency in Long Monologues', 'Speed Pronunciation Drills',
          'Complex Subjunctive Exceptions', 'Vocabulary Breadth Expansion', 'Weakness Eradication Sprint', 'Correction Milestone'
        ]
      },
      {
        title: 'Masterclass Teaching & Mentoring',
        desc: 'Explaining grammar and nuances to other learners',
        unitTopics: [
          'Explaining Difficult Grammar Simply', 'Mentoring a Beginner Learner', 'Giving Constructive Pronunciation Feedback',
          'Creating Mnemonic Devices', 'Translating Subtle English Idioms to French', 'Linguistic Comparative Analysis',
          'Language Learning Philosophy', 'Inspiring Lifelong Curiosity', 'Teaching Demonstration', 'Pedagogy Milestone'
        ]
      },
      {
        title: 'Grand Mastery Capstone',
        desc: 'The ultimate 800-unit fluency summit',
        unitTopics: [
          'The 20-Minute Free AI Conversation Challenge', 'Defending an Original Thesis', 'Spontaneous Roleplay: Any Domain',
          'Native-Speed Podcaster Decoding', 'Phonetic Accuracy Summit (95%+ Target)', 'Idiomatic Naturalness Benchmark',
          'Comprehensive 8-Level Learning Journey Review', 'Fluency Certification Showcase', 'Grand Mastery Ceremony', 'Mastery Gate Conquered'
        ]
      }
    ]
  }
};

/**
 * Generate all 800 units across the 8 levels
 */
export function buildCurriculumRegistry(): {
  levels: Level[];
  units: UnitMetadata[];
  unitsById: Record<string, UnitMetadata>;
} {
  const levels: Level[] = [];
  const units: UnitMetadata[] = [];
  const unitsById: Record<string, UnitMetadata> = {};

  let globalUnitCounter = 1;

  for (let levelNum = 1; levelNum <= 8; levelNum++) {
    const blueprint = LEVEL_BLUEPRINTS[levelNum];
    const stages: Stage[] = [];

    blueprint.stageThemes.forEach((stageTheme, stageIdx) => {
      const stageNum = stageIdx + 1;
      const stageStartUnit = (levelNum - 1) * 100 + (stageNum - 1) * 10 + 1;
      const stageEndUnit = stageStartUnit + 9;
      const stageUnitIds: string[] = [];

      stageTheme.unitTopics.forEach((topicTitle, topicIdx) => {
        const unitNumber = stageStartUnit + topicIdx;
        const unitId = `u${unitNumber}`;
        stageUnitIds.push(unitId);

        const requiredUnlockUnitId = unitNumber > 1 ? `u${unitNumber - 1}` : undefined;

        const unitMeta: UnitMetadata = {
          id: unitId,
          number: unitNumber,
          levelNumber: levelNum,
          stageNumber: stageNum,
          title: topicTitle,
          subtitle: `Level ${levelNum} · Stage ${stageNum} · Unit ${topicIdx + 1}/10`,
          cefrLevel: blueprint.cefr,
          category: stageTheme.title,
          lessonCount: 3, // Each unit has structured interactive lessons
          requiredXp: 30,
          requiredUnlockUnitId
        };

        units.push(unitMeta);
        unitsById[unitId] = unitMeta;
        globalUnitCounter++;
      });

      stages.push({
        number: stageNum,
        title: stageTheme.title,
        description: stageTheme.desc,
        unitRange: [stageStartUnit, stageEndUnit],
        unitIds: stageUnitIds
      });
    });

    levels.push({
      id: `lvl-${levelNum}`,
      number: levelNum,
      name: blueprint.name,
      tagline: blueprint.tagline,
      description: blueprint.description,
      color: blueprint.color,
      totalUnits: 100,
      stages
    });
  }

  return { levels, units, unitsById };
}

export const CURRICULUM_DATA = buildCurriculumRegistry();
