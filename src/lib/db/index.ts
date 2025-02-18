import { openDB } from 'idb';
import { QuizAttempt } from '../../types/quiz';

const DB_NAME = 'quiz-platform';
const STORE_NAME = 'attempts';

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

export const db = isBrowser 
  ? openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      },
    })
  : null;

export async function saveQuizAttempt(attempt: QuizAttempt) {
  if (!isBrowser) return null;
  return (await db)?.put(STORE_NAME, attempt);
}

export async function getQuizAttempts(): Promise<QuizAttempt[]> {
  if (!isBrowser) return [];
  return (await db)?.getAll(STORE_NAME) ?? [];
}

export async function clearQuizAttempts() {
  if (!isBrowser) return null;
  return (await db)?.clear(STORE_NAME);
}

export async function getQuizAttempt(id: string): Promise<QuizAttempt | null> {
  if (!isBrowser) return null;
  return (await db)?.get(STORE_NAME, id) ?? null;
} 