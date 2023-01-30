import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Config, PrayerConfig } from "@tap/core/configurations";
import { DateHelper } from "@tap/core/dateHelper.utilities";
import {
  SunriseTimingsUTCModel,
  PrayerTimingsModel,
  PrayerModel,
  ePrayers,
  ePrayerLabels,
  ePrayerType,
  eAshura,
  PrayerDegreeMap,
  PrayerOrgDegree,
  MONTHS,
} from "@tap/shared/models";

@Injectable({
  providedIn: "root",
})
export class PrayerTimingService {
  //Cache API
  private _cachePrayerCSVData: any = null;
  private _cachePrayerAPIData: any = null;

  public prayers: Array<PrayerModel> = [];
  public prayerOrg?: PrayerOrgDegree = PrayerDegreeMap.get(
    PrayerConfig.prayerOrg
  );

  annualPrayerTimingsCSV: PrayerTimingsModel[] = [];
  annualPrayerTimingsEpoch: PrayerTimingsModel[] = [];
  hijriDate: string = "";

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private http: HttpClient
  ) {}

  private _fajrStartInEpoch!: number;
  private _sunriseStartInEpoch!: number;
  private _chashtStartInEpoch!: number;
  private _dhurStartInEpoch!: number;
  private _asrStartInEpoch!: number;
  private _maghribStartInEpoch!: number;
  private _ishaStartInEpoch!: number;
  private _ishaEndInEpoch!: number;

  // TODO use HttpResponse<T> or CustomHttpResponse<T> with interceptor
  getPrayerAPITime$(): Observable<any> {
    if (this._cachePrayerAPIData) return of(this._cachePrayerAPIData);
    return this.http.get(Config.getPrayerAPIUrl());
  }
  setPrayerAPITime(apiData: any, day = new Date().getDate() - 1): void {
    //Cach API Data
    this._cachePrayerAPIData = apiData;

    //Set Hijri Date
    this.hijriDate =
      // apiData.data[day].date.hijri.weekday.en +
      // ", " +
      apiData.data[day].date.hijri.month.en +
      " " +
      apiData.data[day].date.hijri.day +
      ", " +
      apiData.data[day].date.hijri.year;
    //Set Prayer Timings
    this._fajrStartInEpoch = new Date(
      apiData.data[day].timings.Fajr.slice(0, 25)
    ).getTime();
    this._sunriseStartInEpoch = new Date(
      apiData.data[day].timings.Sunrise.slice(0, 25)
    ).getTime();
    this._dhurStartInEpoch = new Date(
      apiData.data[day].timings.Dhuhr.slice(0, 25)
    ).getTime();

    this._chashtStartInEpoch =
      0.5 * (this._sunriseStartInEpoch + this._dhurStartInEpoch);

    this._asrStartInEpoch = new Date(
      apiData.data[day].timings.Asr.slice(0, 25)
    ).getTime();
    this._maghribStartInEpoch = new Date(
      apiData.data[day].timings.Maghrib.slice(0, 25)
    ).getTime();
    this._ishaStartInEpoch = new Date(
      apiData.data[day].timings.Isha.slice(0, 25)
    ).getTime();
    this._ishaEndInEpoch = new Date(
      apiData.data[day].timings.Midnight.slice(0, 25)
    ).getTime();
  }

  getPrayerCSVTime$(): Observable<string> {
    if (this._cachePrayerCSVData) return of(this._cachePrayerCSVData);
    return this.http.get(Config.getPrayerCSVUrl, { responseType: "text" });
  }

  setPrayerCsvTimings(csvData: any) {
    this._cachePrayerCSVData = csvData;
    this.loadPrayerTimingsFromCsv(csvData);
    this.convertLocalTimeToEpoch();
  }

  loadPrayerTimingsFromCsv(csvData: any) {
    this.annualPrayerTimingsCSV = [];
    let csvToRowArray = csvData.toString().split("\n");
    for (let index = 1; index < csvToRowArray.length - 1; index++) {
      let row = csvToRowArray[index].split(",");
      this.annualPrayerTimingsCSV.push(
        new PrayerTimingsModel(
          parseInt(row[0], 10),
          row[1],
          row[2],
          row[3],
          row[4],
          row[5],
          row[6],
          row[7],
          row[8]
        )
      );
    }
  }

  convertLocalTimeToEpoch() {
    this.annualPrayerTimingsEpoch = [];
    this.annualPrayerTimingsCSV.forEach((ashura) => {
      this.annualPrayerTimingsEpoch.push(
        new PrayerTimingsModel(
          ashura.order,
          ashura.month,
          ashura.ashura,
          DateHelper.convertLocalTimeToEpoch(ashura.fajr),
          DateHelper.convertLocalTimeToEpoch(ashura.dhur),
          DateHelper.convertLocalTimeToEpoch(ashura.jumuah_1),
          DateHelper.convertLocalTimeToEpoch(ashura.jumuah_2),
          DateHelper.convertLocalTimeToEpoch(ashura.asr),
          DateHelper.convertLocalTimeToEpoch(ashura.isha)
        )
      );
    });
  }

  setPrayerTimings(): void {
    this.prayers = [];
    let currentDayInEpoch: PrayerTimingsModel = this.getCurrentDayTimings();

    this.prayers.push(
      {
        name: ePrayers.TAHAJJUD,
        type: ePrayerType.MAKROOH,
        start: formatDate(this._ishaEndInEpoch, "hh:mm a", this.locale), //TODO Fix This
        startEpoch: this._ishaEndInEpoch,
        end: formatDate(this._fajrStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._fajrStartInEpoch,
        visible: false,
        isActive: false,
        order: 1,
      },
      {
        name: ePrayers.FAJR,
        type: ePrayerType.PRAYER,
        start: formatDate(this._fajrStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._fajrStartInEpoch,
        athan: formatDate(currentDayInEpoch.fajr, "hh:mm a", this.locale),
        iqamah: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(currentDayInEpoch.fajr, 10),
          "hh:mm a",
          this.locale
        ),
        end: formatDate(this._sunriseStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._sunriseStartInEpoch,
        visible: true,
        isActive: false,
        order: 2,
      },
      {
        name: ePrayers.SHUROOQ,
        type: ePrayerType.MAKROOH,
        start: formatDate(this._sunriseStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._sunriseStartInEpoch,
        end: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(this._sunriseStartInEpoch, 20),
          "hh:mm a",
          this.locale
        ), //Sunrise
        endEpoch: DateHelper.addEpochTimeInEpochMinutes(
          this._sunriseStartInEpoch,
          20
        ), //Sunrise in Epoch
        visible: true,
        isActive: false,
        order: 3,
      },
      {
        name: ePrayers.ISHRAQ,
        type: ePrayerType.NAFL,
        start: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(this._sunriseStartInEpoch, 20),
          "hh:mm a",
          this.locale
        ),
        startEpoch: DateHelper.addEpochTimeInEpochMinutes(
          this._sunriseStartInEpoch,
          20
        ),
        end: formatDate(this._chashtStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._chashtStartInEpoch,
        visible: false,
        isActive: false,
        order: 4,
      },
      {
        name: ePrayers.CHASHT,
        type: ePrayerType.NAFL,
        start: formatDate(this._chashtStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._chashtStartInEpoch,
        end: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(this._dhurStartInEpoch, -26),
          "hh:mm a",
          this.locale
        ),
        endEpoch: DateHelper.addEpochTimeInEpochMinutes(
          this._dhurStartInEpoch,
          -26
        ),
        visible: false,
        isActive: false,
        order: 5,
      },
      {
        name: ePrayers.ZAWAL,
        type: ePrayerType.MAKROOH, //TODO Set Offsets
        start: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(this._dhurStartInEpoch, -26),
          "hh:mm a",
          this.locale
        ),
        startEpoch: DateHelper.addEpochTimeInEpochMinutes(
          this._dhurStartInEpoch,
          -26
        ),
        end: formatDate(this._dhurStartInEpoch, "hh:mm a", this.locale), //Noon
        endEpoch: this._dhurStartInEpoch, //Noon in Epoch
        visible: true,
        isActive: false,
        order: 6,
      },
      {
        name: ePrayers.DHUR,
        type: ePrayerType.PRAYER,
        start: formatDate(this._dhurStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._dhurStartInEpoch,
        athan: formatDate(currentDayInEpoch.dhur, "hh:mm a", this.locale),
        iqamah: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(currentDayInEpoch.dhur, 10),
          "hh:mm a",
          this.locale
        ),
        end: formatDate(this._asrStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._asrStartInEpoch,
        visible: true,
        isActive: false,
        order: 8,
      },
      {
        name: ePrayers.ASR,
        type: ePrayerType.PRAYER,
        start: formatDate(this._asrStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._asrStartInEpoch,
        athan: formatDate(currentDayInEpoch.asr, "hh:mm a", this.locale),
        iqamah: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(currentDayInEpoch.asr, 10),
          "hh:mm a",
          this.locale
        ),
        end: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(this._maghribStartInEpoch, -15),
          "hh:mm a",
          this.locale
        ),
        endEpoch: DateHelper.addEpochTimeInEpochMinutes(
          this._maghribStartInEpoch,
          -15
        ),
        visible: true,
        isActive: false,
        order: 9,
      },
      {
        name: ePrayers.GHUROOB,
        type: ePrayerType.MAKROOH,
        start: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(this._maghribStartInEpoch, -15),
          "hh:mm a",
          this.locale
        ),
        startEpoch: DateHelper.addEpochTimeInEpochMinutes(
          this._maghribStartInEpoch,
          -15
        ),
        end: formatDate(this._maghribStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._maghribStartInEpoch,
        visible: false,
        isActive: false,
        order: 10,
      },
      {
        name: ePrayers.MAGHRIB,
        type: ePrayerType.PRAYER,
        start: formatDate(this._maghribStartInEpoch, "hh:mm a", this.locale), //Sunset
        startEpoch: this._maghribStartInEpoch, //Sunset in Epoch
        iqamah: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(this._maghribStartInEpoch, 7),
          "hh:mm a",
          this.locale
        ),
        athan: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(this._maghribStartInEpoch, 7),
          "hh:mm a",
          this.locale
        ),
        end: formatDate(this._ishaStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._ishaStartInEpoch,
        visible: true,
        isActive: false,
        order: 11,
      },
      {
        name: ePrayers.ISHA,
        type: ePrayerType.PRAYER,
        start: formatDate(this._ishaStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._ishaStartInEpoch,
        athan: formatDate(currentDayInEpoch.isha, "hh:mm a", this.locale),
        iqamah: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(currentDayInEpoch.isha, 10),
          "hh:mm a",
          this.locale
        ),
        end: formatDate(
          DateHelper.getNDayCurrentTimeInEpoch(this._ishaEndInEpoch, 1),
          "hh:mm a",
          this.locale
        ),
        endEpoch: DateHelper.getNDayCurrentTimeInEpoch(this._ishaEndInEpoch, 1),
        visible: true,
        isActive: false,
        order: 12,
      },
      {
        name: ePrayers.JUMUAH,
        type: ePrayerType.JUMUAH,
        start: formatDate(this._dhurStartInEpoch, "hh:mm a", this.locale), //Noon
        startEpoch: this._dhurStartInEpoch, //Noon in Epoch
        athan: formatDate(currentDayInEpoch.jumuah_1, "hh:mm a", this.locale),
        iqamah: formatDate(currentDayInEpoch.jumuah_2, "hh:mm a", this.locale),
        end: formatDate(this._asrStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._asrStartInEpoch,
        visible: true,
        isActive: false,
        order: new Date().getDay() == 5 ? 7 : 13, //5=Friday, 6 is order of DHUR, 12 is Default Order
      }
    );

    // Set Prayer Labels
    this.prayers.forEach((prayer) => {
      if (prayer.type == ePrayerType.PRAYER) {
        prayer.startLabel = ePrayerLabels.ATHAN;
        prayer.endLabel = ePrayerLabels.IQAMAH;
      } else if (prayer.type == ePrayerType.MAKROOH) {
        prayer.startLabel = ePrayerLabels.START;
        prayer.endLabel = ePrayerLabels.END;
      } else if (prayer.type == ePrayerType.JUMUAH) {
        prayer.startLabel = ePrayerLabels.FIRST_JUMUAH;
        prayer.endLabel = ePrayerLabels.SECOND_JUMUAH;
      }
    });

    //Sort Prayers based on order id
    this.prayers?.sort((a, b) => (a.order < b.order ? -1 : 1));
    this.prayers.forEach((p) => {
      console.log(
        "prayers",
        p.name,
        p.start,
        p.athan,
        p.iqamah,
        p.end,
        p.startEpoch,
        p.endEpoch
      );
    });
  }

  private getCurrentDayTimings(): PrayerTimingsModel {
    const currentDate = new Date();
    let currentMonth = MONTHS[currentDate.getMonth()];
    let currentDay = currentDate.getDate();
    let ashura = eAshura.SECOND_ASHURA;
    if (currentDay > 20) ashura = eAshura.THIRD_ASHURA;
    else if (currentDay < 11) ashura = eAshura.FIRST_ASHURA;

    return this.annualPrayerTimingsEpoch.filter(
      (ashr) => ashr.month === currentMonth && ashr.ashura === ashura
    )[0];
  }

  invalidateCache() {
    this._cachePrayerAPIData = null;
    this._cachePrayerCSVData = null;
  }
}
