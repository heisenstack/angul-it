import { Injectable } from '@angular/core';
import { Challenge, ChallengeResult, ChallengeType } from '../models/challenge.model';

const CHALLENGE_POOL: Challenge[] = [
    { id: 'math-1', type: 'math', prompt: '7 + 5', answer: '12' },
    { id: 'math-2', type: 'math', prompt: '9 - 3', answer: '6' },

    { id: 'text-1', type: 'text', prompt: 'Type the word "zone" backwards', answer: 'enoz' },

    {
        id: 'image-1',
        type: 'image-select',
        prompt: 'Select all the tiles showing a cat',
        options: ['🐱', '🐶', '🐱', '🐦'],
        answer: ['0', '2'],
    },
    
];
const STORAGE_KEY = 'progress';
// const SESSION_CHALLENGE_IDS: string[] = pickOneOfEachType().map(c => c.id);
function pickOneOfEachType(): Challenge[] {
    const types: ChallengeType[] = ['math', 'text', 'image-select'];

    const oneOfEach = types.map(type => {
        const matchingChallenges = CHALLENGE_POOL.filter(c => c.type === type);

        const shuffled = shuffle(matchingChallenges);

        return shuffled[0];
    });


    const final = shuffle(oneOfEach);


    return final;
}
// console.log("IDs: ", SESSION_CHALLENGE_IDS);

interface StoredState {
    currentIndex: number;
    results: ChallengeResult[];
    sessionChallengeIds: string[];
}
function shuffle<T>(items: T[]): T[] {
    console.log('--- shuffle() called with:', items);
    const copy = [...items];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        console.log(`  swapping position ${i} (${copy[i]}) with position ${j} (${copy[j]})`);
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    console.log('shuffle:', copy);
    return copy;
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
    // private challenges = CHALLENGE_POOL;
    currentIndex = 0;
    results: ChallengeResult[] = [];
    private sessionChallengeIds: string[] = [];


    constructor() {
        this.loadFromStorage();
    }


    get currentChallenge(): Challenge | null {
        const id = this.sessionChallengeIds[this.currentIndex];
        return CHALLENGE_POOL.find(c => c.id === id) ?? null;
    }

    get isFinished(): boolean {
        return this.currentIndex >= this.sessionChallengeIds.length;
    }

    get correctCount(): number {
        return this.results.filter(r => r.correct).length;
    }

    recordResult(correct: boolean): void {
        const challenge = this.currentChallenge;
        if (!challenge) return;

        const existing = this.results.find(r => r.challengeId === challenge.id);

        if (existing) {
            existing.attempts = (existing.attempts ?? 0) + 1;
            existing.correct = correct;
        } else {
            this.results.push({ challengeId: challenge.id, correct, attempts: 1 });
        }

        this.saveToStorage();
    }
    // currentChallenge: Challenge = CHALENGE;

    isCorrect(submitted: string | string[]): boolean {
        const challenge = this.currentChallenge;
        if (!challenge) return false;

        if (Array.isArray(challenge.answer)) {
            const submittedArr = Array.isArray(submitted) ? submitted : [submitted];
            return (
                submittedArr.length === challenge.answer.length &&
                submittedArr.every(a => (challenge.answer as string[]).includes(a))
            );
        }

        return submitted === challenge.answer;
    }
    advance(): void {
        this.currentIndex++;
        this.saveToStorage();
    }
    reset(): void {
        this.currentIndex = 0;
        this.results = [];
        this.sessionChallengeIds = pickOneOfEachType().map(c => c.id);
        this.saveToStorage();
    }
    canGoBack(): boolean {
        return this.currentIndex > 0;
    }
    get canGoForward(): boolean {
        return this.currentIndex < this.sessionChallengeIds.length - 1;
    }
    resultFor(challengeId: string): ChallengeResult | undefined {
        return this.results.find(r => r.challengeId === challengeId);
    }
    goToPrevious(): void {
        if (!this.canGoBack()) return;
        this.currentIndex--;
        this.saveToStorage();
    }
    goToNext(): void {
        const challenge = this.currentChallenge;
        if (!challenge || !this.canGoForward) return;
        const result = this.resultFor(challenge.id);
        if (!result?.correct) return;
        this.currentIndex++;
        this.saveToStorage();
    }
    promptFor(challengeId: string): string {
        return CHALLENGE_POOL.find(c => c.id === challengeId)?.prompt ?? challengeId;
    }

    private saveToStorage(): void {
        const state: StoredState = {
            currentIndex: this.currentIndex,
            results: this.results,
            sessionChallengeIds: this.sessionChallengeIds,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    private loadFromStorage(): void {
        const raw = localStorage.getItem(STORAGE_KEY);
        const state = raw ? (JSON.parse(raw) as StoredState) : null;

        if (!state || !state.sessionChallengeIds || state.sessionChallengeIds.length === 0) {
            this.sessionChallengeIds = pickOneOfEachType().map(c => c.id);
            this.saveToStorage();
            return;
        }

        this.currentIndex = state.currentIndex;
        this.results = state.results;
        this.sessionChallengeIds = state.sessionChallengeIds;
    }
}