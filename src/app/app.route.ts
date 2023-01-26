import { Routes } from "@angular/router";

export const APP_ROUTES: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./features/home/home.route").then((mod) => mod.ROUTES),
    data: {
      seo: {
        title: `Fraserview Musallah`,
        description: `Fraserview Muslim Community Services is committed to preserving an Islamic identity, building and supporting a viable Muslim community.`,
        image: "/assets/images/png/fmcs.jpg",
        author: "AlephLab.ca",
      },
    },
  },
  {
    path: "prayer",
    loadChildren: () =>
      import("./features/prayer/prayer.route").then((mod) => mod.ROUTES),
    data: {
      seo: {
        title: `Prayer Timings FMCS`,
        description: `Our Center is now open for prayers five times.`,
        image: "/assets/images/png/fmcs.jpg",
        author: "AlephLab.ca",
      },
    },
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
      data: {
        seo: {
          title: `Contact FMCS`,
          description: `Reach out to us if you have any query, comment, suggestion or complaint, or would like to enroll for volunteering.`,
          image: "/assets/images/png/fmcs.jpg",
          author: "AlephLab.ca",
        }
      }
  },
  {
    path: "donate",
    loadChildren: () =>
      import("./features/donate/donate.route").then((mod) => mod.ROUTES),
      data: {
        seo: {
          title: `Donate to FMCS`,
          description: `Please donate generously as this ensures that the mosque is maintained properly and the Muslim community benefits from these facilities.`,
          image: "/assets/images/png/fmcs.jpg",
          author: "AlephLab.ca",
        }
      }
  },
  { path: "**", redirectTo: "" },
];
