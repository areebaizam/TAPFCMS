import { Routes } from '@angular/router';

export const ROUTES: Routes = [
    { path: "", loadComponent: () => import('./donate.component').then(mod => mod.DonateComponent)},
];