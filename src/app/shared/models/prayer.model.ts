//Prayers
export enum ePrayers {
  SHUROOQ = "Shurooq",
  FAJR = "Fajr",
  ISHRAQ = "Ishraq",
  CHASHT = "Chasht",
  ZAWAL = "Zawal",
  DHUR = "Dhur",
  ASR = "Asr",
  GHUROOB = "Ghuroob",
  MAGHRIB = "Maghrib",
  ISHA = "Isha",
  JUMUAH = "Jumuah",
}
export enum ePrayerLabels {
  ADHAN = "Adhan",
  IQAMAH = "Iqamah",
  START = "Starts",
  END = "Ends",
  FIRST_JUMUAH = "Jumuah I",
  SECOND_JUMUAH = "Jumuah II",
}

export enum ePrayerType {
  PRAYER,
  INTERVAL,
  JUMUAH,
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
  name?: ePrayers;
  type?: ePrayerType;
  start?: string;
  startLabel?: string;
  endLabel?: string;
  startEpoch?: number;
  athan?: string;
  iqamah?: string;
  end?: string;
  endEpoch?: number;
}
