//Prayers
export enum ePrayers {
  TAHAJJUD = "Tahajjud",
  FAJR = "Fajr",
  SHUROOQ = "Shurooq",
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
  FIRST_JUMUAH = "First Jumuah",
  SECOND_JUMUAH = "Second Jumuah",
}

export enum eAshura {
  FIRST_ASHURA = "FIRST_ASHURA",
  SECOND_ASHURA = "SECOND_ASHURA",
  THIRD_ASHURA = "THIRD_ASHURA",
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
  isActive: boolean = false;
  visible:boolean = true;
}

export class PrayerTimingsModel {
  order: number;
  month: string;
  ashura: string;
  fajr: any;
  dhur: any;
  jumuah_1: any;
  jumuah_2: any;
  asr: any;
  isha: any;

  constructor(
    order: number,
    month: string,
    ashura: string,
    fajr: any,
    dhur: any,
    jumuah_1: any,
    jumuah_2: any,
    asr: any,
    isha: any
  ) {
    this.order = order;
    this.month = month;
    this.ashura = ashura;
    this.fajr = fajr;
    this.dhur = dhur;
    this.jumuah_1 = jumuah_1;
    this.jumuah_2 = jumuah_2;
    this.asr = asr;
    this.isha = isha;
  }
}
