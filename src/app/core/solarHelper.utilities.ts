const JULIAN_DAYS_ON_19000501_1200_APPROX = 2415018.5;
const JULIAN_DAYS_ON_19000501_1200 = 2451545;
// Standard epoch of J1900.0. When we hit year 2100, the Epoch will change.
// As written in the source, "Please note that calculations in the spreadsheets are only
// valid for dates between 1901 and 2099, due to an approximation used in the Julian Day calculation".
//https://github.com/ashikahmad/PrayerTimes-Swift/blob/master/PrayerKit/AKPrayerTime/AKPrayerTime.swift
const ONE_JULIAN_CENTURY = 36525;
const radians = (degree: number) => (degree * Math.PI) / 180;
const degrees = (radian: number) => (radian * 180) / Math.PI;
const julianDate = (date: Date) =>
  Math.floor(date.getTime() / 86400000 + 2440587.5);
export class SunriseSunset {
  private static getBaselineNumbers(date: Date): any {
    const jd = julianDate(date);
    const jc = (jd - JULIAN_DAYS_ON_19000501_1200) / ONE_JULIAN_CENTURY;

    // Mean longitude of the sun in degrees.
    const gmLongSun = (280.46646 + (jc * 36000.76983 + jc * 0.0003032)) % 360;
    // Mean anomaly of the sun in degrees.
    const gmAnomSun = 357.52911 + (jc * 35999.05029 - 0.0001537 * jc);
    const eccentOrbitEarth =
      0.016708634 - jc * (0.000042037 + 0.0000001267 * jc);

    // Mean obliq ecliptic.
    const meanObliqEcliptic =
      23 +
      (26 + (21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813))) / 60) /
        60;
    const obliqCorr =
      meanObliqEcliptic + 0.00256 * Math.cos(radians(125.04 - 1934.136 * jc));
    const vary = Math.pow(Math.tan(radians(obliqCorr / 2)), 2);

    // Sun equation of thecenter.
    const sunEqCtr =
      Math.sin(radians(gmAnomSun)) *
        (1.914602 - jc * (0.004817 + 0.000014 * jc)) +
      Math.sin(radians(2 * gmAnomSun)) * (0.019993 - 0.000101 * jc) +
      Math.sin(radians(3 * gmAnomSun)) * 0.000289;
    const sunTrueLongitude = gmLongSun + sunEqCtr;
    // Sun apprearance longitude (degrees).
    const sunAppearLong =
      sunTrueLongitude -
      0.00569 -
      0.00478 * Math.sin(radians(125.04 - 1934.136 * jc));

    // Sun declination.
    const sunDecl = degrees(
      Math.asin(Math.sin(radians(obliqCorr)) * Math.sin(radians(sunAppearLong)))
    );

    const eq =
      4 *
      degrees(
        vary * Math.sin(2 * radians(gmLongSun)) -
          2 * eccentOrbitEarth * Math.sin(radians(gmAnomSun)) +
          4 *
            eccentOrbitEarth *
            vary *
            Math.sin(radians(gmAnomSun)) *
            Math.cos(1 * radians(gmLongSun)) -
          0.5 * vary * vary * Math.sin(4 * radians(gmLongSun)) -
          1.25 *
            eccentOrbitEarth *
            eccentOrbitEarth *
            Math.sin(2 * radians(gmAnomSun))
      );
    return {
      eq,
      sunDecl,
    };
  }
  private static getSolarData(
    lat: number,
    lng: number,
    eq: number,
    sunDecl: number,
    zenith: number
  ): any {
    const haSunrise = degrees(
      Math.acos(
        Math.cos(radians(zenith)) /
          (Math.cos(radians(lat)) * Math.cos(radians(sunDecl))) -
          Math.tan(radians(lat)) * Math.tan(radians(sunDecl))
      )
    );
    const solarNoon = (720 - 4 * lng - eq) / 1440;
    const solarNoonInSeconds = solarNoon * 86400;
    const sunriseInSeconds =
      solarNoonInSeconds - ((haSunrise * 4) / 1440) * 86400;
    const sunsetInSeconds =
      solarNoonInSeconds + ((haSunrise * 4) / 1440) * 86400;
    return {
      sunriseInSeconds,
      solarNoonInSeconds,
      sunsetInSeconds,
      sunDecl,
      lat,
    };
  }

  public static CalcSunTimeInSeconds(
    lat: number,
    lng: number,
    date: Date
  ): any {
    date.setHours(0, 0, 0, 0);
    const baseNumbers = this.getBaselineNumbers(date);
    const solarData: SolarDataModel = this.getSolarData(
      lat,
      lng,
      baseNumbers.eq,
      baseNumbers.sunDecl,
      90.8333 //ATM Refraction Factor: .8333 Zenith Angle: Sunset 90, Civil Twilight:96, Nautical: 102, Astronomical: 108
    );
    return solarData;
  }

  public static calcAsrInSeconds(
    lat: number,
    sunDecl: number,
    solarNoonInSeconds: number,
    asrJuristic: number = 0
  ): number {
    const solarAsr = degrees(
      (1 / 15) *
        Math.acos(
          (Math.sin(
            Math.PI / 2 -
              Math.atan(
                1 +
                  asrJuristic +
                  Math.tan(Math.abs(radians(lat) - radians(sunDecl)))
              )
          ) -
            Math.sin(radians(sunDecl)) * Math.sin(radians(lat))) /
            (Math.cos(radians(sunDecl)) * Math.cos(radians(lat)))
        )
    );
    const asrInSeconds = solarNoonInSeconds + (86400 * solarAsr) / 24;
    return asrInSeconds;
  }

  public static calcNightInSeconds(
    sunriseInSeconds: number,
    sunsetInSeconds: number
  ): number {
    return 86400 - (sunsetInSeconds - sunriseInSeconds);
  }
}

export class SolarDataModel {
  sunriseInSeconds: number = 0;
  solarNoonInSeconds: number = 0;
  sunsetInSeconds: number = 0;
  sunDecl: number = 0;
  lat: number = 0;
}
