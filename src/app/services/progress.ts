import { Injectable, signal } from '@angular/core';

export interface StageResult {
  stageIndex: number;
  type: string;
  attempts: number;
  correct: boolean;
}

interface StoredProgress {
  currentStage: number;
  totalStages: number;
  results: StageResult[];
  isFinished: boolean;
}

const STORAGE_KEY = 'angul-it-progress';

@Injectable({
  providedIn: 'root'
})
export class Progress {
  totalStages = signal<number>(3);
  currentStage = signal<number>(0);
  results = signal<StageResult[]>([]);
  isFinished = signal<boolean>(false);

  constructor() {
    this.loadFromStorage();
  }

  startNewSession(totalStages: number): void {
    this.totalStages.set(totalStages);
    this.currentStage.set(0);
    this.results.set([]);
    this.isFinished.set(false);
    this.saveToStorage();
  }

  recordStageResult(result: StageResult): void {
    this.results.update(current => [...current, result]);

    if (this.currentStage() < this.totalStages() - 1) {
      this.currentStage.update(stage => stage + 1);
    } else {
      this.isFinished.set(true);
    }

    this.saveToStorage();
  }

  goToPreviousStage(): void {
    if (this.currentStage() > 0) {
      this.currentStage.update(stage => stage - 1);
      this.saveToStorage();
    }
  }

  hasActiveSession(): boolean {
    return this.results().length > 0 || this.currentStage() > 0;
  }

  reset(): void {
    this.currentStage.set(0);
    this.results.set([]);
    this.isFinished.set(false);
    localStorage.removeItem(STORAGE_KEY);
  }

  private saveToStorage(): void {
    const data: StoredProgress = {
      currentStage: this.currentStage(),
      totalStages: this.totalStages(),
      results: this.results(),
      isFinished: this.isFinished()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  private loadFromStorage(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const data: StoredProgress = JSON.parse(raw);
      this.currentStage.set(data.currentStage);
      this.totalStages.set(data.totalStages);
      this.results.set(data.results);
      this.isFinished.set(data.isFinished);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}