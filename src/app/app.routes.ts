import { Routes } from '@angular/router';
import {completedGuard} from './core/guards/completed.guard';

export const routes : Routes =[
    {
        path: '',
        loadComponent: () => 
            import('./features/home/home').then(m => m.Home)
    },
    {
        path: 'captcha',
        loadComponent: () =>
            import('./features/captcha/captcha').then(m => m.Captcha)
    },
    {
        path: 'result',
        loadComponent: () => 
            import('./features/result/result').then(m => m.Result),
        canActivate: [completedGuard]
    },
    {
        path: '**',
        redirectTo: '',
    },
]