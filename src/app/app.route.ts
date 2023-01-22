import { Routes } from "@angular/router";

export const APP_ROUTES: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./features/home/home.route").then((mod) => mod.ROUTES),
  },  
  {
    path: "prayer",
    loadChildren: () =>
      import("./features/prayer/prayer.route").then((mod) => mod.ROUTES),
  },
  {
    path: "home",
    loadChildren: () =>
      import("./features/prayers/prayers.route").then((mod) => mod.ROUTES),
  },
  {
    path: "contact",
    loadChildren: () =>
      import("./features/contact/contact.route").then((mod) => mod.ROUTES),
  },
  {
    path: "donate",
    loadChildren: () =>
      import("./features/donate/donate.route").then((mod) => mod.ROUTES),
  },
  { path: "**", redirectTo: "" },
];
