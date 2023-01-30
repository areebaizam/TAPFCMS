import { PrayerConfig } from "./prayer.config";
//Constants
const adminAPI = "admin";
export const lat = PrayerConfig.location.lat;
export const lng = PrayerConfig.location.lng;

export class Config {
  // public static get baseApiUrl(): string {
  //   return environment.useBaseUrl ? "get production url" : environment.apiPath;
  // }


  // TODO Remove this
  //Sunrise-Sunset Url
  // public static getSunriseBaseUrl(date: string): string {
  //   return `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0&date=${date}`;
  // }

  // // TODO Remove this
  // //Hijri Date URL
  // public static getHijriDateUrl(date: string): string {
  //   return `https://api.aladhan.com/v1/gToH?date=${date}`;
  // }

  // Prayer API URL
  public static getPrayerAPIUrl(): string {
    return `https://api.aladhan.com/v1/calendarByAddress?address=49.2263435,-123.1067579&method=99&methodSettings=18,null,15&school=1&year=2023&month=01&iso8601=true`;
  }
  // Prayer CSV URL
  public static get getPrayerCSVUrl(): string {
    // return `${this.baseApiUrl}/assets/csv/prayer_fcms.csv`;
    return `/../assets/csv/prayer_fcms.csv`;
  }

  //Admin
  // public static get getAdminBaseUrl(): string {
  //   return `${this.baseApiUrl}/${adminAPI}/list`;
  // }
}
