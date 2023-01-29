import { ePrayerOrganization, PrayerConfigModel } from "@tap/shared/models";
export const PrayerConfig = {
  location: {
    lat: 49.2263435,
    lng: -123.1067579,
  },
  prayerOrg: ePrayerOrganization.BCMA,
  offsetInMinutes: {
    sunrise: -15,
    ishraq: 20,
    zawal: -20,
    dhur: 2,
    sunset: -15,
    maghrib: 7,
  },
} as PrayerConfigModel;
