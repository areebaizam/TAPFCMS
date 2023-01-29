import { PrayerConfig } from "./prayer.config";
//Constants
const adminAPI = "admin";
export const lat = PrayerConfig.location.lat;
export const lng = PrayerConfig.location.lng;

export class Config {
  // public static get baseApiUrl(): string {
  //   return environment.useBaseUrl ? "get production url" : environment.apiPath;
  // }

  //Sunrise-Sunset Url
  public static getSunriseBaseUrl(date: string): string {
    return `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0&date=${date}`;
  }

  //Hijri Date URL
  public static getHijriDateUrl(date: string): string {
    return `https://hijri.habibur.com/api01/date/?date=${date}`;
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
