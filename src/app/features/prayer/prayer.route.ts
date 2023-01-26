import { Routes } from "@angular/router";

export const ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./prayer.component").then((mod) => mod.PrayerComponent),
  },
];
