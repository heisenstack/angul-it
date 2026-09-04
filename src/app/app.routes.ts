import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Captcha } from './pages/captcha/captcha';
import { Result } from './pages/result/result';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'captcha', component: Captcha },
  { path: 'result', component: Result },
  { path: '**', redirectTo: '' }
];