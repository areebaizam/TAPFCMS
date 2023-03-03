import {
  PrayerConfigModel,
  ePrayerCalcMethod,
  eJuristicMethod,
  eHighAltitudeAdjustment,
} from "@tap/shared/models";
export const PrayerConfig = {
  location: {
    lat: 49.2263435,
    lng: -123.1067579,
  },
  prayerCalcMethod: ePrayerCalcMethod.BCMA,
  asrJuristicMethod: eJuristicMethod.STD,
  highAltitudeAdj: eHighAltitudeAdjustment.MIDNIGHT,
  offsetInMinutes: {
    imsak: -10,
    fajr: -15,
    ishraq: 20,
    zawal: -20,
    dhur: 2,
    asr: -15,
    maghrib: 4,//1 minute added in BCMA
  },
} as PrayerConfigModel;
