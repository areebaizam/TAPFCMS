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
  BCMA,
  EGA,
  ISNA,
  IUK,
  MWL,
  SIA,
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

export class PrayerOrgDegree {
  Organization: string = "";
  Fajr: number = 15;
  Isha: number = 15;
}

export const PrayerDegreeMap = new Map([
  [ePrayerOrganization.BCMA, { Organization:"BCMA and Sharia Council of B.C.", Fajr: 18, Isha: 15 } as PrayerOrgDegree],
  [ePrayerOrganization.EGA, { Organization:"Egyptian General Authority", Fajr: 19.5, Isha: 17.5 } as PrayerOrgDegree],
  [ePrayerOrganization.ISNA, { Organization:"Islamic Society of North America", Fajr: 15, Isha: 15 } as PrayerOrgDegree],
  [ePrayerOrganization.IUK, { Organization:"University Of Islamic Sciences, Karachi", Fajr: 18, Isha: 18 } as PrayerOrgDegree],
  [ePrayerOrganization.MWL, { Organization:"Muslim World League", Fajr: 18, Isha: 17 } as PrayerOrgDegree],
  [ePrayerOrganization.SIA, { Organization:"Shia Ithna Ashari", Fajr: 16, Isha: 14 } as PrayerOrgDegree],
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
