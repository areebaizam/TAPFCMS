export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
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
  ATHAN = "Athan",
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

export enum ePrayerOrganization {
  EGA = "Egyptian General Authority",
  ISNA = "Islamic Society of North America",
  IUK = "University Of Islamic Sciences, Karachi",
  MWL = "Muslim World League",
  SIA = "Shia Ithna Ashari",
}

export enum ePrayerType {
  PRAYER,
  INTERVAL,
  JUMUAH,
}

//Prayer OffSet
export enum eLocation {
  SHUROOQ = -15,
  ISHRAQ = 20,
  ZAWAL = -20,
  DHUR = 2,
  MAGHRIB = 7,
}
//Prayer OffSet
// export enum ePrayerOffset {
//   SUNRISE = -15,
//   SHUROOQ = 20,
//   ISHRAQ = 20,
//   ZAWAL = -20,
//   DHUR = 2,
//   ASR = -15,
//   MAGHRIB = 5,
// }

export class PrayerDegree {
  Fajr: number = 15;
  Isha: number = 15;
}

export const PrayerDegreeMap = new Map([
  [ePrayerOrganization.EGA, { Fajr: 19.5, Isha: 17.5 } as PrayerDegree],
  [ePrayerOrganization.ISNA, { Fajr: 15, Isha: 15 } as PrayerDegree],
  [ePrayerOrganization.IUK, { Fajr: 18, Isha: 18 } as PrayerDegree],
  [ePrayerOrganization.MWL, { Fajr: 18, Isha: 17 } as PrayerDegree],
  [ePrayerOrganization.SIA, { Fajr: 16, Isha: 14 } as PrayerDegree],
]);

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
  order: number = -1;
  isActive: boolean = false;
  visible: boolean = true;
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

export interface Location {
  lat: number;
  lng: number;
}

export interface PrayerOffset {
  sunrise: number;
  ishraq: number;
  zawal: number;
  dhur: number;
  sunset: number;
  maghrib: number;
}
export interface PrayerConfigModel {
  location: Location;
  prayerOrg: ePrayerOrganization;
  offsetInMinutes: PrayerOffset;
}
