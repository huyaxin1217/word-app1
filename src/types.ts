export type WordFamiliarity = 0 | 1 | 2 | 3; // 0: new, 1: vague, 2: know, 3: mastered

export interface Word {
  id: string;
  english: string;
  phonetic: string;
  definition: string;
  exampleEn: string;
  exampleZh: string;
  familiarity: WordFamiliarity;
}

export type PetOutfit = 'none' | 'hat' | 'glasses' | 'headphone';

export type TabType = 'study' | 'review' | 'library' | 'progress';

export interface UserStats {
  coins: number;
  wordsLearned: number;
  treesGrown: number;
}
