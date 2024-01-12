import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home').then(m => m.HomeComponent),
  },
  {
    path: 'challenge',
    loadComponent: () =>
      import('./features/captcha/captcha').then(m => m.CaptchaComponent),
  },
  {
    path: 'result',
    loadComponent: () =>
      import('./features/result/result').then(m => m.ResultComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];