// FLUENTRA Pronunciation Scoring & Phonetic Analysis Engine
import { PronunciationResult, WordPronunciation } from '../types/speech';

class PronunciationEngine {
  /**
   * Levenshtein distance between two strings
   */
  private distance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  private cleanString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics for basic tolerance
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, '')
      .trim();
  }

  public evaluate(target: string, transcript: string): PronunciationResult {
    const targetWords = target.split(/\s+/).filter(Boolean);
    const spokenWords = transcript.split(/\s+/).filter(Boolean);

    const evaluatedWords: WordPronunciation[] = [];
    let totalScore = 0;

    targetWords.forEach((targetWord, index) => {
      const cleanTarget = this.cleanString(targetWord);
      // Look for the closest spoken word in proximity
      let bestMatchScore = 0;
      let closestSpoken = '';

      const searchWindow = spokenWords.slice(Math.max(0, index - 2), index + 3);
      
      if (searchWindow.length === 0) {
        bestMatchScore = 0;
      } else {
        for (const candidate of searchWindow) {
          const cleanCand = this.cleanString(candidate);
          const maxLen = Math.max(cleanTarget.length, cleanCand.length);
          if (maxLen === 0) continue;
          const dist = this.distance(cleanTarget, cleanCand);
          const similarity = Math.max(0, Math.round(((maxLen - dist) / maxLen) * 100));
          if (similarity > bestMatchScore) {
            bestMatchScore = similarity;
            closestSpoken = candidate;
          }
        }
      }

      let accuracy: 'exact' | 'approximate' | 'missed' = 'missed';
      let feedback = '';

      if (bestMatchScore >= 85) {
        accuracy = 'exact';
        feedback = 'Spot on!';
      } else if (bestMatchScore >= 55) {
        accuracy = 'approximate';
        feedback = `Almost there. Pay attention to the end sound.`;
      } else {
        accuracy = 'missed';
        feedback = `Try articulating each syllable slowly.`;
      }

      evaluatedWords.push({
        word: closestSpoken || targetWord,
        expected: targetWord,
        score: bestMatchScore,
        accuracy,
        feedback
      });

      totalScore += bestMatchScore;
    });

    const averageScore = targetWords.length > 0 ? Math.round(totalScore / targetWords.length) : 0;
    const isPassed = averageScore >= 70;

    let feedbackMessage = '';
    let phoneticAdvice = '';

    if (averageScore >= 90) {
      feedbackMessage = 'Outstanding pronunciation! Clear, natural and confident.';
      phoneticAdvice = 'Your intonation was exceptionally close to native speakers.';
    } else if (averageScore >= 75) {
      feedbackMessage = 'Great effort! Your sentence was well understood.';
      phoneticAdvice = 'Listen one more time to the model audio to sharpen the subtle vowel transitions.';
    } else if (averageScore >= 50) {
      feedbackMessage = 'Good attempt! You have the structure, but some vowels were blurred.';
      phoneticAdvice = 'Tap the turtle icon for slower playback and repeat phrase by phrase.';
    } else {
      feedbackMessage = 'Keep going! Speaking is a muscle memory skill.';
      phoneticAdvice = 'Focus on breaking down the word sounds before saying the whole phrase.';
    }

    return {
      overallScore: averageScore,
      rawTranscription: transcript,
      targetText: target,
      words: evaluatedWords,
      feedbackMessage,
      isPassed,
      phoneticAdvice
    };
  }
}

export const pronunciationEngine = new PronunciationEngine();
