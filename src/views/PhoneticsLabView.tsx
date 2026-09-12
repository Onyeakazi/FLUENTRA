// FLUENTRA Ground-Zero Sounds & Letters Lab (Duolingo Characters Tab)
import React, { useState } from 'react';
import { Volume2, Sparkles, BookOpen, CheckCircle, Info } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useProgression } from '../context/ProgressionContext';
import { AudioControls } from '../components/speech/AudioControls';
import { soundService } from '../services/soundService';

interface SoundItem {
  symbol: string;
  pinyinOrPhonetic: string;
  name: string;
  description: string;
  audioText: string;
}

const SOUND_SYSTEMS: Record<string, { title: string; subtitle: string; items: SoundItem[] }> = {
  'Chinese Mandarin': {
    title: 'The 4 Mandarin Tones & Pinyin',
    subtitle: 'Tap any tone to hear the exact pitch shape and master tone discrimination.',
    items: [
      { symbol: 'ˉ', pinyinOrPhonetic: 'mā (妈)', name: '1st Tone: High Flat (55)', description: 'Sustained high pitch like singing "ahhh". Means Mother.', audioText: 'mā' },
      { symbol: 'ˊ', pinyinOrPhonetic: 'má (麻)', name: '2nd Tone: Rising (35)', description: 'Pitch rises smoothly like asking "what?". Means Hemp.', audioText: 'má' },
      { symbol: 'ˇ', pinyinOrPhonetic: 'mǎ (马)', name: '3rd Tone: Dipping (214)', description: 'Dips into chest voice then curls upward. Means Horse.', audioText: 'mǎ' },
      { symbol: 'ˋ', pinyinOrPhonetic: 'mà (骂)', name: '4th Tone: Sharp Drop (51)', description: 'Sharp, decisive downward drop like saying "stop!". Means Scold.', audioText: 'mà' },
      { symbol: '·', pinyinOrPhonetic: 'ma (吗)', name: 'Neutral Tone (Light)', description: 'Soft, short question marker attached to phrases.', audioText: '吗' },
      { symbol: 'b / p', pinyinOrPhonetic: 'bō / pō', name: 'Aspirated vs Non-Aspirated', description: 'Put a tissue before your mouth: "p" blows it; "b" does not.', audioText: 'bō pō' },
      { symbol: 'zh / ch / sh', pinyinOrPhonetic: 'zhī / chī / shī', name: 'Retroflex Consonants', description: 'Curl the tip of your tongue lightly toward the roof of your mouth.', audioText: 'zhī chī shī' }
    ]
  },
  French: {
    title: 'French Nasal Vowels & Silent Letters',
    subtitle: 'Train your ear to recognize the musical French sounds and silent endings.',
    items: [
      { symbol: 'ON', pinyinOrPhonetic: '/bɔ̃/ (bon)', name: 'Nasal "ON"', description: 'Rounded lips, resonant nasal vibration as in "bon" or "bonjour".', audioText: 'bon' },
      { symbol: 'AN / EN', pinyinOrPhonetic: '/ɑ̃/ (sans)', name: 'Nasal "AN / EN"', description: 'Open mouth, air escapes through both mouth and nose.', audioText: 'sans' },
      { symbol: 'IN / AIN', pinyinOrPhonetic: '/ɛ̃/ (pain)', name: 'Nasal "IN / AIN"', description: 'Smile shape with nasal resonance, as in "pain" (bread).', audioText: 'pain' },
      { symbol: 'R', pinyinOrPhonetic: '/ʁ/ (merci)', name: 'The Soft French "R"', description: 'Gently vibrate the back of your tongue against the soft palate.', audioText: 'merci' },
      { symbol: 'Ø (Silent)', pinyinOrPhonetic: 'salut (/sa.ly/)', name: 'Silent Final Consonants', description: 'Final letters s, t, d, x are silent at word ends.', audioText: 'salut' },
      { symbol: 'Ç', pinyinOrPhonetic: 'ça va (/sa va/)', name: 'Cédille "Ç"', description: 'Turns the hard "C" into a soft "S" sound before a, o, u.', audioText: 'ça va' }
    ]
  },
  Spanish: {
    title: 'Spanish Pure Vowels & The Rolled "RR"',
    subtitle: 'Crisp, melodic syllables that never change their sound.',
    items: [
      { symbol: 'A-E-I-O-U', pinyinOrPhonetic: '/a e i o u/', name: 'The 5 Pure Vowels', description: 'Short, pure, and clean. No English vowel sliding or diphthongs.', audioText: 'a e i o u' },
      { symbol: 'RR', pinyinOrPhonetic: '/r/ (perro)', name: 'The Rolled Double "RR"', description: 'Tip of your tongue vibrates against the alveolar ridge.', audioText: 'perro' },
      { symbol: 'R (Tap)', pinyinOrPhonetic: '/ɾ/ (gracias)', name: 'The Single Tap "R"', description: 'A single light flick of the tongue tip, as in "gracias".', audioText: 'gracias' },
      { symbol: 'H', pinyinOrPhonetic: 'hola (/ˈo.la/)', name: 'The Silent "H"', description: 'The letter H is 100% silent in Spanish from start to finish.', audioText: 'hola' },
      { symbol: 'LL / Y', pinyinOrPhonetic: 'llamar (/ʝaˈmaɾ/)', name: 'The "LL" Sound', description: 'Pronounced like an English "Y" in "yes" or soft "J".', audioText: 'llamar' }
    ]
  },
  German: {
    title: 'German Umlauts & Articulation',
    subtitle: 'Master the rounded vowels ä, ö, ü and consistent consonant logic.',
    items: [
      { symbol: 'Ä', pinyinOrPhonetic: '/ɛː/ (Mädchen)', name: 'Umlaut Ä', description: 'Open mouth like saying "eh" in bed.', audioText: 'Mädchen' },
      { symbol: 'Ö', pinyinOrPhonetic: '/øː/ (schön)', name: 'Umlaut Ö', description: 'Round lips into an "O" while trying to say "E".', audioText: 'schön' },
      { symbol: 'Ü', pinyinOrPhonetic: '/yː/ (Tschüss)', name: 'Umlaut Ü', description: 'Pucker lips tightly like a whistle while voicing an "I".', audioText: 'Tschüss' },
      { symbol: 'W', pinyinOrPhonetic: 'wie (/viː/)', name: 'German W = English V', description: 'German "W" is always pronounced with teeth on lower lip.', audioText: 'wie' },
      { symbol: 'V', pinyinOrPhonetic: 'viel (/fiːl/)', name: 'German V = English F', description: 'German "V" sounds like an English "F" as in "Vielen Dank".', audioText: 'Vielen Dank' }
    ]
  },
  Japanese: {
    title: 'Japanese Hiragana Vowels & Mora Rhythm',
    subtitle: 'The 5 foundation pillars of Japanese pronunciation.',
    items: [
      { symbol: 'あ (A)', pinyinOrPhonetic: '/a/ (arigatou)', name: 'Vowel A (あ)', description: 'Open, clear "ah" sound.', audioText: 'あ' },
      { symbol: 'い (I)', pinyinOrPhonetic: '/i/ (ichi)', name: 'Vowel I (い)', description: 'Smile vowel "ee" like in "beet".', audioText: 'い' },
      { symbol: 'う (U)', pinyinOrPhonetic: '/ɯ/ (uma)', name: 'Vowel U (う)', description: 'Unrounded soft "oo" sound.', audioText: 'う' },
      { symbol: 'え (E)', pinyinOrPhonetic: '/e/ (eki)', name: 'Vowel E (え)', description: 'Crisp "eh" like in "pet".', audioText: 'え' },
      { symbol: 'お (O)', pinyinOrPhonetic: '/o/ (ohayou)', name: 'Vowel O (お)', description: 'Pure rounded "oh" sound.', audioText: 'お' },
      { symbol: 'ん (N)', pinyinOrPhonetic: '/N/ (konnichiwa)', name: 'Mora Nasal (ん)', description: 'Holds its own full musical beat in spoken Japanese.', audioText: 'ん' }
    ]
  },
  Italian: {
    title: 'Italian Musical Cadence & Double Consonants',
    subtitle: 'Clear open vowels and held double consonants.',
    items: [
      { symbol: 'CI / CE', pinyinOrPhonetic: 'ciao (/ˈtʃa.o/)', name: 'Soft "CH" Sound', description: 'Letter C before I or E always makes the soft "ch" in chocolate.', audioText: 'ciao' },
      { symbol: 'GI / GE', pinyinOrPhonetic: 'buongiorno (/dʒ/)', name: 'Soft "J" Sound', description: 'Letter G before I or E makes the soft English "J" sound.', audioText: 'buongiorno' },
      { symbol: 'LL', pinyinOrPhonetic: 'mille (/ˈmil.le/)', name: 'Held Double Consonant', description: 'Pause and hold the consonant twice as long as a single letter.', audioText: 'mille' },
      { symbol: 'GLI', pinyinOrPhonetic: 'famiglia (/ˈʎa/)', name: 'Liquid "GLI"', description: 'Sounds like the "lli" in brilliant or million.', audioText: 'famiglia' }
    ]
  }
};

export const PhoneticsLabView: React.FC = () => {
  const { profile } = useUser();
  const { activeCourse } = useProgression();

  const currentLang = profile.currentLanguage || 'Chinese Mandarin';
  const soundData = SOUND_SYSTEMS[currentLang] || SOUND_SYSTEMS['Chinese Mandarin'];

  return (
    <div
      className="content-scrollable"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '16px 16px 80px',
        maxWidth: '520px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      {/* Header Banner */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-teal-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Phonetics Lab
          </span>
          <span className="fl-badge fl-badge-teal" style={{ padding: '2px 8px', fontSize: '11px', fontWeight: 800 }}>
            {activeCourse.flag} {activeCourse.languageId}
          </span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, marginTop: '2px' }}>
          {soundData.title}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)' }}>
          {soundData.subtitle}
        </p>
      </div>

      {/* Interactive Sound Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {soundData.items.map((item, idx) => (
          <div
            key={idx}
            className="fl-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 18px',
              borderRadius: '20px',
              backgroundColor: 'var(--fl-bg-card-subtle)',
              border: '1.5px solid var(--fl-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Big Sound Symbol Badge */}
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(0, 245, 180, 0.12)',
                  border: '2px solid var(--fl-teal-light)',
                  color: 'var(--fl-teal-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 900,
                  flexShrink: 0
                }}
              >
                {item.symbol}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
                    {item.pinyinOrPhonetic}
                  </span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                  {item.name}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--fl-text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>
                  {item.description}
                </p>
              </div>
            </div>

            {/* Audio Play Button */}
            <div style={{ marginLeft: '12px', flexShrink: 0 }}>
              <AudioControls text={item.audioText} lang={profile.targetLanguage} size="md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
