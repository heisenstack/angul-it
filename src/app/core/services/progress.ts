import { Injectable } from '@angular/core';
import {Challenge, ChallengeResult} from '../models/challenge.model';

const CHALENGE: Challenge[] = [
   { id: 'math-1',prompt: '7+5',answer: '12',},
   { id: 'math-2',prompt: '9-3',answer: '6',},
   { id: 'text-1', prompt: 'Type the word "cat" backwards', answer: 'tac' },
]
const STORAGE_KEY = 'progress';

interface StoredState {
    currentIndex: number;
    results: ChallengeResult[];
}

@Injectable({providedIn: 'root'})
export class ProgressService{
    private challenges = CHALENGE;
    currentIndex = 0;
    results: ChallengeResult[] = [];

    constructor(){
        this.loadFromStorage();
    }

    get currentChallenge(): Challenge{
        return this.challenges[this.currentIndex]?? null;
    }

    get isFinished(): boolean{
        return this.currentIndex >= this.challenges.length;
    }

    get correctCount(): number {
        return this.results.filter(r => r.correct).length;
    }

    recordResult(correct: boolean): void {
        const challenge = this.currentChallenge;
        if (!challenge) return;
        this.results.push({challengeId: challenge.id, correct});
        this.saveToStorage();
    }
    // currentChallenge: Challenge = CHALENGE;

    isCorrect(submitted: string): boolean {
        const challenge= this.currentChallenge;
        if (!challenge) return false;
        return submitted.trim() === challenge.answer;
    }
    advance(): void{
        this.currentIndex++;
        this.saveToStorage();
    }
    reset(): void {
        this.currentIndex = 0;
        this.results = [];
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