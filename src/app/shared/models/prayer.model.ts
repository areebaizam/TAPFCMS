//Prayers
export enum ePrayers {
  SUNRISE = "Sunrise",
  FAJR = "Fajr",
  ISHRAQ="Ishraq",
  CHASHT = "Chasht",
  ZAWAL = "Zawal",
  DHUR = "Dhur",
  ASR = "Asr",
  MAGHRIB = "Maghrib",
  ISHA = "Isha",
  FIRST_JUMUAH = "Jumuah I",
  SECOND_JUMUAH = "Jumuah II",
}

export enum ePrayerType {
 PRAYER,
 INTERVAL,
}

//Prayer OffSet
export enum ePrayerOffset {
   SUNRISE = -15,
   ISHRAQ = 20,
   ZAWAL = -40,
   ASR = -15,
   MAGHRIB = 7,
}

export class PrayerModel {
  prayer?:ePrayers;
  type?:ePrayerType;
  start?: string;
  startEpoch?: number;
  athan?: string;
  iqamah?: string;
  end?: string;
  endEpoch?: number;
}
