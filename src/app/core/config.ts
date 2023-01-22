// import { environment } from "@tap/env";
//Constants
const adminAPI = "admin";
export const lat = 49.2263435;
export const lng = -123.1067579;

export class Config {
  // public static get baseApiUrl(): string {
  //   return environment.useBaseUrl ? "get production url" : environment.apiPath;
  // }

  //Sunrise-Sunset Url
  public static getSunriseBaseUrl(date: Date): string {
    return `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0&date=${date
      .toISOString()
      .slice(0, 10)}`;
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
