import { ePrayerCalcMethod, PrayerConfigModel, eJuristicMethod } from "@tap/shared/models";
export const PrayerConfig = {
  location: {
    lat: 49.2263435,
    lng: -123.1067579,
  },
  prayerCalcMethod: ePrayerCalcMethod.BCMA,
  asrJuristicMethod: eJuristicMethod.HNF, 
  offsetInMinutes: {
    imsak: -10,
    fajr: -15,
    ishraq: 20,
    zawal: -20,
    dhur: 2,
    asr: -15,
  },
} as PrayerConfigModel;
