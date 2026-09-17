import { Injectable } from '@angular/core';
import {Challenge, ChallengeResult} from '../models/challenge.model';

const CHALENGE: Challenge[] = [
   { id: 'math-1',prompt: '7+5',answer: '12',},
   { id: 'math-2',prompt: '9-3',answer: '6',},
   { id: 'text-1', prompt: 'Type the word "cat" backwards', answer: 'tac' },
]

@Injectable({providedIn: 'root'})
export class ProgressService{
    private challenges = CHALENGE;
    currentIndex = 0;
    results: ChallengeResult[] = [];

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
    }
    // currentChallenge: Challenge = CHALENGE;

    isCorrect(submitted: string): boolean {
        const challenge= this.currentChallenge;
        if (!challenge) return false;
        return submitted.trim() === challenge.answer;
    }
    advance(): void{
        this.currentIndex++;
    }
}