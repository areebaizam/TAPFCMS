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
export class PrayerService {
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private http: HttpClient
  ) {}

  private _fajrStartInEpoch!: number;
  private _sunriseStartInEpoch!: number;
  private _ishraqStartInEpoch!: number;
  private _chashtStartInEpoch!: number;
  private _zawalStartInEpoch!: number;
  private _dhurStartInEpoch!: number;
  private _asrStartInEpoch!: number;
  private _asrEndInEpoch!: number;
  private _maghribStartInEpoch!: number;
  private _ishaStartInEpoch!: number;
  private _ishaEndInEpoch!: number;

  public _cacheSunriseAPIData: any = null;
  private _cachePrayerCSVData: any = null;

  public prayers: Array<PrayerModel> = [];
  public prayerOrg?: PrayerOrgDegree = PrayerDegreeMap.get(
    PrayerConfig.prayerOrg
  );

  annualPrayerTimings: PrayerTimingsModel[] = [];
  annualPrayerTimingsUTC: PrayerTimingsModel[] = [];
  sunriseAPIResult: SunriseTimingsUTCModel = new SunriseTimingsUTCModel();

  // TODO use HttpResponse<T> or CustomHttpResponse<T> with interceptor
  getSunriseAPITime$(
    date: string = new Date().toLocaleDateString("en-US")
  ): Observable<any> {
    if (this._cacheSunriseAPIData) return of(this._cacheSunriseAPIData);
    return this.http.get(Config.getSunriseBaseUrl(date));
  }

  getPrayerCSVTime$(): Observable<string> {
    if (this._cachePrayerCSVData) return of(this._cachePrayerCSVData);
    return this.http.get(Config.getPrayerCSVUrl, { responseType: "text" });
  }

  setPrayerCsvTimings(csvData: any) {
    this._cachePrayerCSVData = csvData;
    this.loadPrayerTimingsFromCsv(csvData);
    this.convertLocalTimeToUTC();
  }

  loadPrayerTimingsFromCsv(csvData: any) {
    this.annualPrayerTimings = [];
    let csvToRowArray = csvData.toString().split("\n");
    for (let index = 1; index < csvToRowArray.length - 1; index++) {
      let row = csvToRowArray[index].split(",");
      this.annualPrayerTimings.push(
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

  convertLocalTimeToUTC() {
    this.annualPrayerTimingsUTC = [];
    this.annualPrayerTimings.forEach((ashura) => {
      this.annualPrayerTimingsUTC.push(
        new PrayerTimingsModel(
          ashura.order,
          ashura.month,
          ashura.ashura,
          DateHelper.convertLocalTimeToUTC8(ashura.fajr),
          DateHelper.convertLocalTimeToUTC8(ashura.dhur),
          DateHelper.convertLocalTimeToUTC8(ashura.jumuah_1),
          DateHelper.convertLocalTimeToUTC8(ashura.jumuah_2),
          DateHelper.convertLocalTimeToUTC8(ashura.asr),
          DateHelper.convertLocalTimeToUTC8(ashura.isha)
        )
      );
    });
  }

  setSunriseApiTimings(apiData: any): void {
    //Cach API Data
    this._cacheSunriseAPIData = apiData;
    this.sunriseAPIResult = apiData.results;
    this._fajrStartInEpoch = DateHelper.addTimeInEpochMinutes(
      this.sunriseAPIResult.sunrise,
      -DateHelper.convertDegreeToMinutes(this.prayerOrg?.Fajr)
    );
    this._sunriseStartInEpoch = DateHelper.addTimeInEpochMinutes(
      this.sunriseAPIResult.sunrise,
      PrayerConfig.offsetInMinutes.sunrise
    );

    this._ishraqStartInEpoch = DateHelper.addTimeInEpochMinutes(
      this.sunriseAPIResult.sunrise,
      PrayerConfig.offsetInMinutes.ishraq
    );

    this._chashtStartInEpoch = DateHelper.addTimeInEpochMinutes(
      this.sunriseAPIResult.sunrise,
      this.sunriseAPIResult.day_length / (4 * 60) //1/4 of Daylength
    );

    this._zawalStartInEpoch = DateHelper.addTimeInEpochMinutes(
      this.sunriseAPIResult.solar_noon,
      PrayerConfig.offsetInMinutes.zawal
    );

    this._dhurStartInEpoch = DateHelper.addTimeInEpochMinutes(
      this.sunriseAPIResult.solar_noon,
      PrayerConfig.offsetInMinutes.dhur
    );

    this._asrStartInEpoch = DateHelper.addTimeInEpochMinutes(
      this.sunriseAPIResult.solar_noon,
      this.sunriseAPIResult.day_length / (4 * 60) //1/4 of Daylength
    );
    this._asrEndInEpoch = DateHelper.addTimeInEpochMinutes(
      this.sunriseAPIResult.sunset,
      PrayerConfig.offsetInMinutes.sunset
    );

    this._maghribStartInEpoch = DateHelper.addTimeInEpochMinutes(
      this.sunriseAPIResult.sunset,
      PrayerConfig.offsetInMinutes.maghrib
    );

    this._ishaStartInEpoch = DateHelper.addTimeInEpochMinutes(
      this.sunriseAPIResult.sunset,
      DateHelper.convertDegreeToMinutes(this.prayerOrg?.Isha)
    );

    this._ishaEndInEpoch = DateHelper.addTimeInEpochMinutes(
      this.sunriseAPIResult.sunset,
      (86400 - this.sunriseAPIResult.day_length) / (2 * 60) //1/4 of Daylength
    );
  }

  setPrayerTimings(): void {
    this.prayers = [];
    let currentAshura: PrayerTimingsModel = this.getCurrentAshuraTimings();

    this.prayers.push(
      {
        name: ePrayers.TAHAJJUD,
        type: ePrayerType.INTERVAL,
        start: formatDate(
          DateHelper.getYesterdayCurrentTimeLocal(this._ishaEndInEpoch),
          "hh:mm a",
          this.locale
        ),
        startEpoch: DateHelper.getYesterdayCurrentTime(this._ishaEndInEpoch),
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
        athan: formatDate(currentAshura.fajr, "hh:mm a", this.locale),
        iqamah: formatDate(
          DateHelper.addTimeInEpochMinutes(currentAshura.fajr, 10),
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
        type: ePrayerType.INTERVAL,
        start: formatDate(
          this.sunriseAPIResult.sunrise,
          "hh:mm a",
          this.locale
        ),
        startEpoch: this._sunriseStartInEpoch,
        end: formatDate(this._ishraqStartInEpoch, "hh:mm a", this.locale), //Sunrise
        endEpoch: this._ishraqStartInEpoch, //Sunrise in Epoch
        visible: true,
        isActive: false,
        order: 3,
      },
      {
        name: ePrayers.ISHRAQ,
        type: ePrayerType.INTERVAL,
        start: formatDate(this._ishraqStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._ishraqStartInEpoch,
        end: formatDate(this._chashtStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._chashtStartInEpoch,
        visible: false,
        isActive: false,
        order: 4,
      },
      {
        name: ePrayers.CHASHT,
        type: ePrayerType.INTERVAL,
        start: formatDate(this._chashtStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._chashtStartInEpoch,
        end: formatDate(this._zawalStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._zawalStartInEpoch,
        visible: false,
        isActive: false,
        order: 5,
      },
      {
        name: ePrayers.ZAWAL,
        type: ePrayerType.INTERVAL,
        start: formatDate(this._zawalStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._zawalStartInEpoch,
        end: formatDate(
          this.sunriseAPIResult.solar_noon,
          "hh:mm a",
          this.locale
        ), //Noon
        endEpoch: DateHelper.getTimeInEpoch(this.sunriseAPIResult.solar_noon), //Noon in Epoch
        visible: true,
        isActive: false,
        order: 6,
      },
      {
        name: ePrayers.DHUR,
        type: ePrayerType.PRAYER,
        start: formatDate(this._dhurStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._dhurStartInEpoch,
        athan: formatDate(currentAshura.dhur, "hh:mm a", this.locale),
        iqamah: formatDate(
          DateHelper.addTimeInEpochMinutes(currentAshura.dhur, 10),
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
        athan: formatDate(currentAshura.asr, "hh:mm a", this.locale),
        iqamah: formatDate(
          DateHelper.addTimeInEpochMinutes(currentAshura.asr, 10),
          "hh:mm a",
          this.locale
        ),
        end: formatDate(this._asrEndInEpoch, "hh:mm a", this.locale),
        endEpoch: this._asrEndInEpoch,
        visible: true,
        isActive: false,
        order: 9,
      },
      {
        name: ePrayers.GHUROOB,
        type: ePrayerType.INTERVAL,
        start: formatDate(this._asrEndInEpoch, "hh:mm a", this.locale),
        startEpoch: this._asrEndInEpoch,
        end: formatDate(this.sunriseAPIResult.sunset, "hh:mm a", this.locale), //Noon
        endEpoch: DateHelper.getTimeInEpoch(this.sunriseAPIResult.sunset), //Noon in Epoch
        visible: false,
        isActive: false,
        order: 10,
      },
      {
        name: ePrayers.MAGHRIB,
        type: ePrayerType.PRAYER,
        start: formatDate(this.sunriseAPIResult.sunset, "hh:mm a", this.locale), //Sunset
        startEpoch: DateHelper.getTimeInEpoch(this.sunriseAPIResult.sunset), //Sunset in Epoch
        iqamah: formatDate(this._maghribStartInEpoch, "hh:mm a", this.locale),
        athan: formatDate(this._maghribStartInEpoch, "hh:mm a", this.locale),
        end: formatDate(
          this.sunriseAPIResult.astronomical_twilight_end,
          "hh:mm a",
          this.locale
        ),
        endEpoch: DateHelper.getTimeInEpoch(
          this.sunriseAPIResult.astronomical_twilight_end
        ),
        visible: true,
        isActive: false,
        order: 11,
      },
      {
        name: ePrayers.ISHA,
        type: ePrayerType.PRAYER,
        start: formatDate(this._ishaStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._ishaStartInEpoch,
        athan: formatDate(currentAshura.isha, "hh:mm a", this.locale),
        iqamah: formatDate(
          DateHelper.addTimeInEpochMinutes(currentAshura.isha, 10),
          "hh:mm a",
          this.locale
        ),
        end: formatDate(this._ishaEndInEpoch, "hh:mm a", this.locale),
        endEpoch: this._ishaEndInEpoch,
        visible: true,
        isActive: false,
        order: 12,
      },
      {
        name: ePrayers.JUMUAH,
        type: ePrayerType.JUMUAH,
        start: formatDate("2023-01-20T20:30:00+00:00", "hh:mm a", this.locale), //Noon
        startEpoch: this._dhurStartInEpoch, //Noon in Epoch
        athan: formatDate(currentAshura.jumuah_1, "hh:mm a", this.locale),
        iqamah: formatDate(currentAshura.jumuah_2, "hh:mm a", this.locale),
        end: formatDate("2023-01-20T21:30:00+00:00", "hh:mm a", this.locale),
        endEpoch: this._asrStartInEpoch,
        visible: true,
        isActive: false,
        order: new Date().getDay() == 5 ? 7 : 13, //5=Friday, 6 is order of DHUR, 12 is Default Order
      }
    );

    this.prayers.forEach((prayer) => {
      if (prayer.type == ePrayerType.PRAYER) {
        prayer.startLabel = ePrayerLabels.ATHAN;
        prayer.endLabel = ePrayerLabels.IQAMAH;
      } else if (prayer.type == ePrayerType.INTERVAL) {
        prayer.startLabel = ePrayerLabels.START;
        prayer.endLabel = ePrayerLabels.END;
      } else if (prayer.type == ePrayerType.JUMUAH) {
        prayer.startLabel = ePrayerLabels.FIRST_JUMUAH;
        prayer.endLabel = ePrayerLabels.SECOND_JUMUAH;
      }
    });

    //Sort Prayers based on order id
    this.prayers?.sort((a, b) => (a.order < b.order ? -1 : 1));
    
  }

  getCurrentAshuraTimings(): PrayerTimingsModel {
    const currentDate = new Date();
    let currentMonth = MONTHS[currentDate.getMonth()];
    let currentDay = currentDate.getDate();
    let ashura = eAshura.SECOND_ASHURA;
    if (currentDay > 20) ashura = eAshura.THIRD_ASHURA;
    else if (currentDay < 11) ashura = eAshura.FIRST_ASHURA;

    return this.annualPrayerTimingsUTC.filter(
      (ashr) => ashr.month === currentMonth && ashr.ashura === ashura
    )[0];
  }

  invalidateCache() {
    this._cacheSunriseAPIData = null;
    this._cachePrayerCSVData = null;
  }
}
