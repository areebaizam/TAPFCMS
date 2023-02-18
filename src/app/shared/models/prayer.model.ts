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
  JUMUAH = "Jumah",
}
export enum ePrayerLabels {
  ATHAN = "Athan",
  IQAMAH = "Iqamah",
  START = "Starts",
  END = "Ends",
  FIRST_JUMUAH = "First Jumah",
  SECOND_JUMUAH = "Second Jumah",
}

export enum eAshura {
  FIRST_ASHURA = "FIRST_ASHURA",
  SECOND_ASHURA = "SECOND_ASHURA",
  THIRD_ASHURA = "THIRD_ASHURA",
}

export enum ePrayerCalcMethod {
  CSTM,
  BCMA,
  EGA,
  ISNA,
  IUK,
  MWL,
  MAK,
  MAKR, //Makkah Ramadan Timings
  SIA,
  TRN,
}

export enum OffsetSelector {
  DEGREE,
  MINUTES,
}

export class PrayerCalcMethodDegree {
  Organization: string = "";
  Label: string="";
  FajrOffset: number;
  MaghribSelector: number; //(0 = angle; 1 = minutes after sunset)
  MaghribOffset: number; //maghrib parameter value (in angle or minutes)
  IshaSelector: number; //isha selector (0 = angle; 1 = minutes after maghrib)
  IshaOffset: number; //isha parameter value (in angle or minutes)
  constructor(
    org: string,
    lbl: string,
    fo: number,
    ms: number,
    mo: number,
    is: number,
    io: number
  ) {
    this.Organization = org;
    this.Label = lbl;
    this.FajrOffset = fo;
    this.MaghribSelector = ms;
    this.MaghribOffset = mo;
    this.IshaSelector = is;
    this.IshaOffset = io;
  }
}

export const PrayerCalcMethodDegreeMap = new Map([
  [
    ePrayerCalcMethod.BCMA,
    new PrayerCalcMethodDegree(
      "BCMA and Sharia Council of B.C.",
      "BCMA Timings (Fajr: 18° / Isha: 15°)",
      18,
      OffsetSelector.MINUTES,
      1,
      OffsetSelector.DEGREE,
      15
    ),
  ],
  [
    ePrayerCalcMethod.EGA,
    new PrayerCalcMethodDegree(
      "Egyptian General Authority",
      "Egypt (Fajr: 19.5° / Isha: 17.5°)",
      19.5,
      OffsetSelector.MINUTES,
      1,
      OffsetSelector.DEGREE,
      17.5
    ),
  ],
  [
    ePrayerCalcMethod.ISNA,
    new PrayerCalcMethodDegree(
      "Islamic Society of North America",
      "ISNA (Fajr: 15° / Isha: 15°)",
      15,
      OffsetSelector.MINUTES,
      1,
      OffsetSelector.DEGREE,
      15
    ),
  ],
  [
    ePrayerCalcMethod.IUK,
    new PrayerCalcMethodDegree(
      "Karachi (University Of Islamic Sciences)",
      "Karachi (Fajr: 18° / Isha: 18°)",
      18,
      OffsetSelector.MINUTES,
      1,
      OffsetSelector.DEGREE,
      18
    ),
  ],
  [
    ePrayerCalcMethod.MAK,
    new PrayerCalcMethodDegree(
      "Makkah (Umm al-Qura University)",
      "Makkah (Fajr: 18.5° / Isha: Maghrib + 90')",
      18.5,
      OffsetSelector.MINUTES,
      1,
      OffsetSelector.MINUTES,
      90
    ),
  ],
  [
    ePrayerCalcMethod.MAKR,
    new PrayerCalcMethodDegree(
      "Makkah (Ramadan Timings)",
      "Makkah-R (Fajr: 18.5° / Isha: Maghrib + 120')",
      18.5,
      OffsetSelector.MINUTES,
      1,
      OffsetSelector.MINUTES,
      120
    ),
  ],
  [
    ePrayerCalcMethod.MWL,
    new PrayerCalcMethodDegree(
      "Muslim World League",
      "MWL (Fajr: 18° / Isha: 17°)",
      18,
      OffsetSelector.MINUTES,
      1,
      OffsetSelector.DEGREE,
      17
    ),
  ],
  [
    ePrayerCalcMethod.SIA,
    new PrayerCalcMethodDegree(
      "Shia Ithna Ashari",
      "SIA Jaffari (Fajr: 16° / Maghrib: 4° / Isha: 14°)",
      16,
      OffsetSelector.DEGREE,
      4,
      OffsetSelector.DEGREE,
      14
    ),
  ],
  [
    ePrayerCalcMethod.TRN,
    new PrayerCalcMethodDegree(
      "Tehran (Institute of Geophysics)",
      "Tahran (Fajr: 17.7° / Maghrib: 4.5° / Isha: 14°)",
      17.7,
      OffsetSelector.DEGREE,
      4.5,
      OffsetSelector.DEGREE,
      14
    ),
  ],
  [
    ePrayerCalcMethod.CSTM,
    new PrayerCalcMethodDegree(
      "Custom Timings",
      "",
      18,
      OffsetSelector.MINUTES,
      1,
      OffsetSelector.DEGREE,
      18
    ),
  ],
]);

export enum eJuristicMethod {
  STD, //0 for Shafi Maliki Hanbali
  HNF, // 1 for Hanafi (Shadow length is twice the object)
}
export const JuristicMethodMap = new Map([
  [eJuristicMethod.STD, "Standard"],
  [eJuristicMethod.HNF, "Hanafi"],
]);

export enum eHighAltitudeAdjustment {
  NONE, //0.0
  MIDNIGHT, //Middle of the night 0.5
  ONE_SEVENTH, // 0.14286
  ANGLE_BASED, // angle/60.0
}

export const HighAltitudeAdjMap = new Map([
  [eHighAltitudeAdjustment.NONE, "None"],
  [eHighAltitudeAdjustment.MIDNIGHT, "Midnight"],
  [eHighAltitudeAdjustment.ONE_SEVENTH, "1/7 of Night"],
  [eHighAltitudeAdjustment.ANGLE_BASED, "Angle based"],
]);

export enum ePrayerType {
  PRAYER,
  MAKROOH,
  NAFL,
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
export class PrayerModel {
  name?: ePrayers;
  label?: string;
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
  imsak: number;
  fajr: number;
  ishraq: number;
  zawal: number;
  dhur: number;
  asr: number;
}
export interface PrayerConfigModel {
  location: Location;
  prayerCalcMethod: ePrayerCalcMethod;
  asrJuristicMethod: eJuristicMethod;
  highAltitudeAdj: eHighAltitudeAdjustment;
  offsetInMinutes: PrayerOffset;
}
