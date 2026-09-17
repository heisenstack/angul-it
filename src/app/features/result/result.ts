import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressService } from '../../core/services/progress';


@Component({
  imports: [],
  selector: 'app-result',
  styleUrl: './result.scss',
  templateUrl: './result.html',
})
export class Result {
  progress = inject(ProgressService);
  private router = inject(Router);
  log(): void {
    console.log(this.progress);
  }
  restart(): void {
    this.progress.reset();
    this.router.navigate(['/']);
  }
}
