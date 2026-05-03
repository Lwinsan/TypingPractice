
import { Badge } from './types';

export const MYANMAR_PHRASES = [
  'မင်္ဂလာပါ',
  'နေကောင်းလား',
  'စာသင်ကျောင်း',
  'မြန်မာနိုင်ငံ',
  'ပျော်ရွှင်ပါစေ',
  'ကွန်ပျူတာ လက်နှိပ်စင်',
  'ကျန်းမာရေးသည် လာဘ်တစ်ပါး',
  'ပညာရွှေအိုး လူမခိုး',
  'အချိန်သည် ရွှေထက် တန်ဖိုးရှိသည်',
  'စာဖတ်ခြင်းသည် ဗဟုသုတ တိုးပွားစေသည်'
];

export const ENGLISH_PHRASES = [
  'The quick brown fox jumps over the lazy dog.',
  'Practice makes perfect.',
  'Typing is a valuable skill in the digital age.',
  'Stay focused and keep practicing.',
  'Efficiency is doing things right; effectiveness is doing the right things.',
  'Every journey begins with a single step.',
  'Knowledge is power.',
  'Learning never exhausts the mind.',
  'Accuracy is better than speed initially.',
  'Consistency is the key to mastery.'
];

export const BADGES: Badge[] = [
  { id: 'first_run', name: 'Beginner', description: 'Complete your first practice session', icon: '🌱' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Reach over 60 WPM', icon: '⚡' },
  { id: 'perfect_accuracy', name: 'Sharpshooter', description: 'Maintain 100% accuracy', icon: '🎯' },
  { id: 'daily_warrior', name: 'Daily Warrior', description: 'Complete 7 daily challenges in a row', icon: '🔥' },
  { id: 'myanmar_pro', name: 'Myanmar Maestro', description: 'Master Myanmar typing', icon: '🇲🇲' },
];

export const LEARNING_SEQUENCES = {
  english: 'eniarltosudycghpmkbwfzvxqj'.split(''),
  myanmar: 'ကမအစပနတဆယထလဘဖဂဃငစဆဇဈညဋဌဍ႑ဏတထဒဓနပဖဗဘမယရလဝသဟဠအ'.split('')
};

export const INITIAL_UNLOCKED = {
  english: ['e', 'n', 'i', 'a'],
  myanmar: ['က', 'မ', 'အ', 'စ']
};

export const KEYBOARD_LAYOUTS = {
  english: {
    name: 'QWERTY',
    rows: [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ]
  },
  myanmar: {
    name: 'Myanmar (Unicode)',
    rows: [
      ['ဆ', 'တ', 'န', 'မ', 'အ', 'ပ', 'က', 'င', 'သ', 'စ'],
      ['ေ', 'ဗ', 'ပ', 'ျ', 'ွ', 'ှ', 'ု', 'ူ', 'း'],
      ['ဖ', 'ထ', 'ခ', 'လ', 'ဘ', 'ည', 'ာ']
    ]
  }
};
