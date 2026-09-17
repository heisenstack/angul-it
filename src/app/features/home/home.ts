import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Challenge } from '../../core/models/challenge.model';

@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
 private route = inject(Router);
 startChallenge(): void {
    this.route.navigate(['/captcha']);
  }
}