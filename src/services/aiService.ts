// FLUENTRA AI Conversation & Roleplay Service
import { ConversationScenario, ConversationTurn, ConversationReview } from '../types/conversation';

class AIService {
  /**
   * Generates a level-aware contextual response from the roleplay AI persona
   */
  public async generateReply(
    scenario: ConversationScenario,
    history: ConversationTurn[],
    userMessage: string,
    learnerLevel: number
  ): Promise<{ replyText: string; translation: string }> {
    // Artificial slight delay to mimic natural typing / contemplation (400-800ms)
    await new Promise(res => setTimeout(res, 600));

    const clean = userMessage.toLowerCase();

    // Contextual responses tailored by scenario
    if (scenario.id === 'sc-bakery') {
      if (clean.includes('baguette') || clean.includes('pain')) {
        return {
          replyText: 'Très bien ! Une tradition bien dorée. Et avec ceci, vous désirez une viennoiserie ? Nos croissants sortent tout juste du four !',
          translation: 'Very well! A nicely baked tradition. And with this, would you like a pastry? Our croissants are fresh out of the oven!'
        };
      }
      if (clean.includes('croissant') || clean.includes('chocolat')) {
        return {
          replyText: 'Parfait ! Ça vous fera trois euros cinquante en tout s’il vous plaît. Vous réglez par carte ou en espèces ?',
          translation: 'Perfect! That will be three euros fifty in total please. Are you paying by card or in cash?'
        };
      }
      if (clean.includes('carte') || clean.includes('merci') || clean.includes('espece')) {
        return {
          replyText: 'Voilà pour vous ! Merci beaucoup et passez une excellente journée. Au revoir !',
          translation: 'Here you are! Thank you very much and have a wonderful day. Goodbye!'
        };
      }
      return {
        replyText: 'Bien sûr ! C’est noté. Autre chose pour vous aujourd’hui ?',
        translation: 'Of course! Noted. Anything else for you today?'
      };
    }

    if (scenario.id === 'sc-restaurant') {
      if (clean.includes('plat du jour') || clean.includes('menu')) {
        return {
          replyText: 'Aujourd’hui, le chef vous propose un saumon grillé aux herbes de Provence avec un risotto crémeux. Qu’en pensez-vous ?',
          translation: 'Today, the chef recommends grilled salmon with Provence herbs and a creamy risotto. What do you think?'
        };
      }
      if (clean.includes('eau') || clean.includes('boire') || clean.includes('vin')) {
        return {
          replyText: 'Excellente idée. Une carafe d’eau fraîche arrive tout de suite. Voulez-vous également une entrée pour commencer ?',
          translation: 'Excellent idea. A chilled carafe of water is coming right up. Would you also like a starter to begin?'
        };
      }
      if (clean.includes('addition') || clean.includes('payer')) {
        return {
          replyText: 'Tout de suite monsieur / madame. J’espère que vous avez passé un agréable moment parmi nous !',
          translation: 'Right away sir / ma’am. I hope you enjoyed your time with us!'
        };
      }
      return {
        replyText: 'C’est un excellent choix. Je transmets votre commande en cuisine dès maintenant.',
        translation: 'That is an excellent choice. I am sending your order to the kitchen right now.'
      };
    }

    // Default adaptive roleplay reply
    if (learnerLevel <= 2) {
      return {
        replyText: 'Merci beaucoup ! C’est très clair. Avez-vous une autre question pour moi ?',
        translation: 'Thank you very much! That is very clear. Do you have another question for me?'
      };
    } else if (learnerLevel <= 5) {
      return {
        replyText: 'Je comprends tout à fait votre point de vue. C’est une démarche très intéressante qui mérite qu’on s’y attarde.',
        translation: 'I completely understand your point of view. It is a very interesting approach that deserves further thought.'
      };
    } else {
      return {
        replyText: 'Votre analyse soulève un aspect fondamental. Comment concilier cette vision avec les contraintes pratiques du quotidien ?',
        translation: 'Your analysis raises a fundamental aspect. How do we reconcile this vision with everyday practical constraints?'
      };
    }
  }

  /**
   * Generates a comprehensive, educational conversation review
   */
  public evaluateConversation(
    scenario: ConversationScenario,
    turns: ConversationTurn[]
  ): ConversationReview {
    const userTurns = turns.filter(t => t.sender === 'user');
    const turnCount = userTurns.length;

    // Calculate dynamic performance scores based on conversation volume & attempts
    const baseScore = Math.min(95, 75 + turnCount * 4);
    const commScore = Math.min(98, baseScore + 3);
    const pronScore = Math.min(96, Math.max(72, baseScore - 2));
    const vocabScore = Math.min(94, baseScore);
    const gramScore = Math.min(92, baseScore - 4);
    const fluScore = Math.min(95, baseScore + 1);
    const overall = Math.round((commScore + pronScore + vocabScore + gramScore + fluScore) / 5);

    return {
      scenarioId: scenario.id,
      totalTurns: turns.length,
      communicationScore: commScore,
      pronunciationScore: pronScore,
      vocabularyScore: vocabScore,
      grammarScore: gramScore,
      fluencyScore: fluScore,
      overallScore: overall,
      strengths: [
        'You maintained polite address forms naturally throughout the exchange.',
        'Immediate comprehension of questions without requiring translation restarts.',
        'Spontaneous sentence construction without long hesitation pauses.'
      ],
      growthAreas: [
        'Pay attention to masculine/feminine noun agreement in quick responses.',
        'Use conversational connectors (par exemple, en fait, d’ailleurs) to transition smoothly.'
      ],
      newVocabulary: [
        { word: 'Une viennoiserie', translation: 'Baked breakfast pastry (croissant, pain au chocolat)', example: 'Les viennoiseries sortent du four.' },
        { word: 'Le plat du jour', translation: 'Daily special', example: 'Quel est le plat du jour aujourd’hui ?' },
        { word: 'En espèces', translation: 'In cash', example: 'Vous payez par carte ou en espèces ?' }
      ],
      xpEarned: 35
    };
  }
}

export const aiService = new AIService();
