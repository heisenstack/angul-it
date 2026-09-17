import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {ProgressService} from '../services/progress';

export const completedGuard: CanActivateFn = () => {
    const progress = inject(ProgressService);
    const router = inject(Router);
    if (progress.isFinished) {
        return true;
    }
    return router.createUrlTree(['/']);
}