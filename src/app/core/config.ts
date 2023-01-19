import { environment } from "@tap/env";
const adminAPI = "admin";

export class Config {
  public static get baseApiUrl(): string {
    return environment.useBaseUrl ? "get production url" : environment.apiPath;
  }

  //Sunrise-Sunset Url
  public static getSunriseBaseUrl(
    lat: number,
    lng: number,
    date: Date
  ): string {
    return `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0&date=${date
      .toISOString()
      .slice(0, 10)}`;
  }

  //Admin
  public static get getAdminBaseUrl(): string {
    return `${this.baseApiUrl}/${adminAPI}/list`;
  }
}
