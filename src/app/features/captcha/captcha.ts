import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressService } from '../../core/services/progress';

@Component({
  selector: 'app-captcha',
  imports: [FormsModule],
  templateUrl: './captcha.html',
  styleUrl: './captcha.scss',
})
export class Captcha {
  progress = inject(ProgressService);
  private router = inject(Router);

  answer = '';
  selectedTiles: number[] = [];
  result: 'correct' | 'incorrect' | null = null;

  get alreadyAnswered(): boolean {
    const challenge = this.progress.currentChallenge;
    if (!challenge) return false;
    return !!this.progress.resultFor(challenge.id)?.correct;
  }

  toggleTile(index: number): void {
    const pos = this.selectedTiles.indexOf(index);
    if (pos === -1) {
      this.selectedTiles.push(index);
    } else {
      this.selectedTiles.splice(pos, 1);
    }
  }

  submit(): void {
    const challenge = this.progress.currentChallenge;
    if (!challenge) return;

    const submitted =
      challenge.type === 'image-select'
        ? this.selectedTiles.map(i => i.toString())
        : this.answer;

    const isRight = this.progress.isCorrect(submitted);
    this.result = isRight ? 'correct' : 'incorrect';
    this.progress.recordResult(isRight);

    if (isRight) {
      this.progress.advance();
      this.resetInputs();

      if (this.progress.isFinished) {
        this.router.navigate(['/result']);
      }
    }
  }

  previous(): void {
    this.progress.goToPrevious();
    this.resetInputs();
  }

  next(): void {
    this.progress.goToNext();
    this.resetInputs();
  }

  private resetInputs(): void {
    this.answer = '';
    this.selectedTiles = [];
    this.result = null;
  }
}