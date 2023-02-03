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

export enum ePrayerCalcMethod {
  CSTM,
  BCMA,
  EGA,
  ISNA,
  IUK,
  MWL,
  MAK,//Todo Cover Ramadan Timings
  SIA,
  TRN,
}




export class PrayerCalcMethodDegree {
  Organization: string = "";
  FajrOffset: number;
  MaghribSelector: number; //(0 = angle; 1 = minutes after sunset)
  MaghribOffset: number; //maghrib parameter value (in angle or minutes)
  IshaSelector: number; //isha selector (0 = angle; 1 = minutes after maghrib)
  IshaOffset: number; //isha parameter value (in angle or minutes)
  constructor(
    org: string,
    fo: number,
    ms: number,
    mo: number,
    is: number,
    io: number
  ) {
    this.Organization = org;
    this.FajrOffset = fo;
    this.MaghribSelector = ms;
    this.MaghribOffset = mo;
    this.IshaSelector = is;
    this.IshaOffset = io;
  }
}

export const PrayerCalcMethodDegreeMap = new Map([
  [ePrayerCalcMethod.BCMA, new PrayerCalcMethodDegree("BCMA and Sharia Council of B.C.",  18, 1,0,0, 15)],  
  [ePrayerCalcMethod.EGA, new PrayerCalcMethodDegree("Egyptian General Authority",  19.5, 1,0,0, 17.5)],
  [ePrayerCalcMethod.ISNA, new PrayerCalcMethodDegree("Islamic Society of North America",  15, 1,0,0, 15)],
  [ePrayerCalcMethod.IUK, new PrayerCalcMethodDegree("Karachi (University Of Islamic Sciences)",  18, 1,0,0, 18)],  
  [ePrayerCalcMethod.MAK, new PrayerCalcMethodDegree("Makkah (Umm al-Qura University)",  18.5, 1,0,1, 90)],
  [ePrayerCalcMethod.MWL, new PrayerCalcMethodDegree("Muslim World League",  18, 1,0,0, 17)],
  [ePrayerCalcMethod.SIA, new PrayerCalcMethodDegree("Shia Ithna Ashari",  16, 0,4,0, 14)],
  [ePrayerCalcMethod.TRN, new PrayerCalcMethodDegree("Tehran (Institute of Geophysics)",  17.7, 0,4.5,0, 14)],
  [ePrayerCalcMethod.CSTM, new PrayerCalcMethodDegree("Custom",  18, 1,0,0, 17)],
]);

export enum eJuristicMethod{
  STD, //0 for Shafi Maliki Hanbali
  HNF, // 1 for Hanafi (Shadow length is twice the object)
}
export const JuristicMethodMap = new Map([
  [eJuristicMethod.STD, "Standard (Shafi, Maliki, Hanbali)"],
  [eJuristicMethod.HNF, "Hanafi"],
]);

export enum eHighAltitudeAdjustment{
  NONE, //0.0
  MIDNIGHT, //Middle of the night 0.5
  ONE_SEVENTH, // 0.14286
  ANGLE_BASED,// angle/60.0
}


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
  prayerCalcMethod: ePrayerCalcMethod;
  asrJuristicMethod: eJuristicMethod;
  offsetInMinutes: PrayerOffset;
}
