export enum eSunriseAPIStatusCodes {
  //next.status
  OK = "OK",
  INVALID_REQUEST = "Invalid Request", // indicates that either lat or lng parameters are missing or invalid
  //error.error.status
  INVALID_DATE = "INVALID_DATE", // indicates that date parameter is missing or invalid;
  //error.statusText
  UNKNOWN_ERROR = "Unknown Error", //indicates that the request could not be processed due to a server error. The request may succeed if you try again.
}

// * Sunrise Models
export class SunriseTimingsUTCModel {
  sunrise: Date = new Date();
  sunset: Date = new Date();
  solar_noon: Date = new Date();
  day_length: number = 0;
  civil_twilight_begin: Date = new Date();
  civil_twilight_end: Date = new Date();
  nautical_twilight_begin: Date = new Date();
  nautical_twilight_end:Date = new Date();
  astronomical_twilight_begin: Date = new Date();
  astronomical_twilight_end: Date = new Date();
}
