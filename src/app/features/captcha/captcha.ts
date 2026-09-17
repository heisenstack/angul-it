import { Component, inject } from '@angular/core';
import { ProgressService } from '../../core/services/progress';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-captcha',
  styleUrl: './captcha.scss',
  templateUrl: './captcha.html',
})
export class Captcha {
  router = inject(Router);
  progress = inject(ProgressService);

  answer = '';
  result : 'correct' | 'incorrect' | null = null;

  get alreadyAnswered(): boolean {
    const challenge = this.progress.currentChallenge;
    if (!challenge) return false;
    return !!this.progress.resultFor(challenge.id)?.correct;
  }

  submit(): void{
    const isRight = this.progress.isCorrect(this.answer);
    this.result = isRight ? 'correct' : 'incorrect';
    this.progress.recordResult(isRight);
    if (isRight) {
      this.progress.advance();
      this.answer = '';
      this.result = null;
      console.log(this.progress);
      
      if (this.progress.isFinished) {
        this.router.navigate(['/result']);
      }
    }
  }
  previous(): void {
    this.progress.goToPrevious();
    this.answer = '';
    this.result = null;
  }
  next(): void {
    this.progress.goToNext();
    this.answer = '';
    this.result = null;
  }
}
