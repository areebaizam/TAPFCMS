import { DateHelper } from "@tap/core/dateHelper.utilities";
//https://www.al-habib.info/islamic-calendar/hijricalendar-kuwaiti.js

// constants
const hijriMonths = [
  "Muharram",
  "Safar",
  "Rabi' al-awwal",
  "Rabi' al-thani",
  "Jumada al-awwal",
  "Jumada al-thani",
  "Rajab",
  "Sha'aban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];
const hijriDays = [
  "Ahad",
  "Ithnin",
  "Thulatha",
  "Arbaa",
  "Khams",
  "Jumuah",
  "Sabt",
];

export class HijriDate {
  public static getHijriDate(date: Date, adjustDays: number = 0): any {
    // calculate the number of days since the Gregorian epoch
    let jd =
      (date.getTime() + adjustDays * DateHelper.getDayToMilliseconds) /
        86400000 +
      2440587.5; //Add .5 for taking noon time not midnight for calculation
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    //Leap Year Calculation
    let m = month + 1;
    let y = year;
    if (m < 3) {
      y -= 1;
      m += 12;
    }

    let a = Math.floor(y / 100);
    let b = 2 - a + Math.floor(a / 4);
    if (y < 1583) b = 0;
    if (y == 1582) {
      if (m > 10) b = -10;
      if (m == 10) {
        b = 0;
        if (day > 4) b = -10;
      }
    }

    b = 0;
    if (jd > 2299160) {
      a = Math.floor((jd - 1867216.25) / 36524.25);
      b = 1 + a - Math.floor(a / 4);
    }

    let bb = jd + b + 1524;
    let cc = Math.floor((bb - 122.1) / 365.25);
    let dd = Math.floor(365.25 * cc);
    let ee = Math.floor((bb - dd) / 30.6001);
    day = bb - dd - Math.floor(30.6001 * ee);
    month = ee - 1;
    if (ee > 13) {
      cc += 1;
      month = ee - 13;
    }
    year = cc - 4716;

    let wd = this.gmod(jd + 1, 7) + 1;
    if (adjustDays) wd = this.gmod(jd + 1 - adjustDays, 7) + 1;

    let iyear = 10631 / 30;
    let epochastro = 1948084;
    // let epochcivil = 1948085;
    // TODO Find when epochcivil hijri is used

    let shift1 = 8.01 / 60;

    let z = jd - epochastro;
    let cyc = Math.floor(z / 10631);
    z = z - 10631 * cyc;
    let j = Math.floor((z - shift1) / iyear);
    let iy = 30 * cyc + j;
    z = z - Math.floor(j * iyear + shift1);
    let im = Math.floor((z + 28.5001) / 29.5);
    if (im == 13) im = 12;
    let id = z - Math.floor(29.5001 * im - 29);
    let myRes = new Array(8);
    myRes[0] = day; //calculated day (CE)
    myRes[1] = month - 1; //calculated month (CE)
    myRes[2] = year; //calculated year (CE)
    myRes[3] = jd - 1; //julian day number
    myRes[4] = wd - 1; //weekday number
    myRes[5] = id; //islamic date
    myRes[6] = im - 1; //islamic month
    myRes[7] = iy; //islamic year
    // console.log(
    //   hijriDays[date.getDay()] +
    //     ", " +
    //     hijriMonths[myRes[6]] +
    //     " " +
    //     (myRes[5]) +
    //     ", " +
    //     myRes[7]
    // );
    return hijriMonths[myRes[6]] + " " + Math.floor(myRes[5]) + ", " + myRes[7];
  }

  private static gmod(n: number, m: number) {
    return ((n % m) + m) % m;
  }
}
