import { Injectable } from '@angular/core';
import { Challenge, ChallengeResult } from '../models/challenge.model';

const CHALENGE: Challenge[] = [
    { id: 'math-1', type: 'math', prompt: '7+5', answer: '12' },
    { id: 'text-1', type: 'text', prompt: 'Type the word "cat" backwards', answer: 'tac' },
    {
        id: 'image-1',
        type: 'image-select',
        prompt: 'Select all the tiles showing a cat',
        options: ['🐱', '🐶', '🐱', '🐦'],
        answer: ['0', '2'],
    },
];
const STORAGE_KEY = 'progress';

interface StoredState {
    currentIndex: number;
    results: ChallengeResult[];
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
    private challenges = CHALENGE;
    currentIndex = 0;
    results: ChallengeResult[] = [];

    constructor() {
        this.loadFromStorage();
    }

    get currentChallenge(): Challenge {
        return this.challenges[this.currentIndex] ?? null;
    }

    get isFinished(): boolean {
        return this.currentIndex >= this.challenges.length;
    }

    get correctCount(): number {
        return this.results.filter(r => r.correct).length;
    }

    recordResult(correct: boolean): void {
        const challenge = this.currentChallenge;
        if (!challenge) return;
        this.results.push({ challengeId: challenge.id, correct });
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
        this.saveToStorage();
    }
    canGoBack(): boolean {
        return this.currentIndex > 0;
    }
    canGoForward(): boolean {
        return this.currentIndex < this.challenges.length - 1;
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
        if (!challenge || !this.canGoForward()) return;
        const result = this.resultFor(challenge.id);
        if (!result?.correct) return;
        this.currentIndex++;
        this.saveToStorage();
    }

    private saveToStorage(): void {
        const state: StoredState = {
            currentIndex: this.currentIndex,
            results: this.results
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    private loadFromStorage(): void {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const state: StoredState = JSON.parse(raw) as StoredState;
        this.currentIndex = state.currentIndex;
        this.results = state.results;
    }
}