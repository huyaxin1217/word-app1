import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, writeBatch, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { initialWords } from '../data/words';
import { Word, WordFamiliarity, PetOutfit, UserStats } from '../types';

import { getNextReviewTime } from '../utils/ebbinghaus';

export const initializeVocabulary = async () => {
  const wordsRef = collection(db, 'words');
  const snapshot = await getDocs(query(wordsRef, where('book', '==', 'CET6')));
  
  // Seed if empty
  if (snapshot.empty) {
    console.log('Seeding initial vocabulary...');
    const batch = writeBatch(db);
    initialWords.forEach((word) => {
      const newDocRef = doc(wordsRef);
      batch.set(newDocRef, {
        ...word,
        id: newDocRef.id
      });
    });
    await batch.commit();
  }
};

export const getUserData = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const defaultData = {
      coins: 0,
      currentBook: 'CET6',
      petOutfit: 'none' as PetOutfit,
      createdAt: serverTimestamp()
    };
    await setDoc(userRef, defaultData);
    return defaultData;
  }
  return userSnap.data();
};

export const updateUserData = async (userId: string, data: Partial<{ coins: number, currentBook: string, petOutfit: PetOutfit }>) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
};

export const fetchWordsForStudy = async (userId: string, book: string): Promise<Word[]> => {
  // We fetch global words for the book
  const wordsRef = collection(db, 'words');
  const q = query(wordsRef, where('book', '==', book));
  const querySnapshot = await getDocs(q);
  
  const allWords = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  
  // We fetch user progress
  const progressRef = collection(db, 'users', userId, 'progress');
  const progressSnap = await getDocs(progressRef);
  
  const progressMap = new Map<string, any>();
  progressSnap.forEach(doc => {
    progressMap.set(doc.id, doc.data());
  });
  
  // Merge
  return allWords.map(w => {
    const p = progressMap.get(w.id);
    return {
      id: w.id,
      english: w.english,
      phonetic: w.phonetic,
      definition: w.definition,
      exampleEn: w.exampleEn,
      exampleZh: w.exampleZh,
      book: w.book,
      familiarity: p ? p.familiarity : 0,
      progress: p ? {
        familiarity: p.familiarity,
        reviewLevel: p.reviewLevel || 0,
        nextReviewTime: p.nextReviewTime || 0,
        lastReviewedAt: p.lastReviewedAt || 0
      } : undefined
    };
  });
};

export const updateWordProgress = async (userId: string, wordId: string, action: 'forgot' | 'vague' | 'know', currentProgress?: any) => {
  const progressRef = doc(db, 'users', userId, 'progress', wordId);
  
  let newFamiliarity = currentProgress?.familiarity || 0;
  let newReviewLevel = currentProgress?.reviewLevel || 0;
  
  if (action === 'know') {
    newFamiliarity = Math.min(3, newFamiliarity + 1);
    newReviewLevel += 1;
  } else if (action === 'forgot') {
    newFamiliarity = Math.max(0, newFamiliarity - 1);
    newReviewLevel = 0;
  } else if (action === 'vague') {
    newFamiliarity = Math.max(1, newFamiliarity);
  }
  
  const nextReviewTime = getNextReviewTime(newReviewLevel);
  const lastReviewedAt = Date.now();

  await setDoc(progressRef, {
    familiarity: newFamiliarity,
    reviewLevel: newReviewLevel,
    nextReviewTime,
    lastReviewedAt,
  }, { merge: true });
  
  return {
    familiarity: newFamiliarity,
    reviewLevel: newReviewLevel,
    nextReviewTime,
    lastReviewedAt
  };
};
