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

  submit(): void{
    const isRight = this.progress.isCorrect(this.answer);
    this.result = isRight ? 'correct' : 'incorrect';
    if (isRight) {
      this.progress.advance();
      this.answer = '';
      this.result = null;
      if (this.progress.isFinished) {
        this.router.navigate(['/result']);
      }
    }
  }
}
