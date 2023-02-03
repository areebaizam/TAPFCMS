import { PrayerConfig } from "./prayer.config";
//Constants
const adminAPI = "admin";
export const lat = PrayerConfig.location.lat;
export const lng = PrayerConfig.location.lng;

export class Config {
  // public static get baseApiUrl(): string {
  //   return environment.useBaseUrl ? "get production url" : environment.apiPath;
  // }

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
