import { Component, inject } from '@angular/core';
import { ProgressService } from '../../core/services/progress';

@Component({
  imports: [],
  selector: 'app-result',
  styleUrl: './result.scss',
  templateUrl: './result.html',
})
export class Result {
  progress = inject(ProgressService);
  log(): void {
    console.log(this.progress);
  }
}
