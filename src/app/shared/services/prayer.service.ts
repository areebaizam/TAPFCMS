import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Config } from "@tap/core/config";
import { DateHelper } from "@tap/core/dateHelper.utilities";
import {
  SunriseTimingsUTCModel,
  PrayerTimingsModel,
  PrayerModel,
  ePrayers,
  ePrayerLabels,
  ePrayerType,
  ePrayerOffset,
  eAshura,
} from "@tap/shared/models";
import { off } from "process";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

@Injectable({
  providedIn: "root",
})
export class PrayerService {
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private http: HttpClient
  ) {}

  private _sunriseStartInEpoch!: number;
  private _ishraqStartInEpoch!: number;
  private _chashtStartInEpoch!: number;
  private _zawalStartInEpoch!: number;
  private _asrStartInEpoch!: number;
  private _asrEndInEpoch!: number;
  private _maghribStartInEpoch!: number;
  private _ishaEndInEpoch!: number;

  public prayers: Array<PrayerModel> = [];

  annualPrayerTimings: PrayerTimingsModel[] = [];
  annualPrayerTimingsUTC: PrayerTimingsModel[] = [];
  sunriseAPIResult: SunriseTimingsUTCModel = new SunriseTimingsUTCModel();

  // TODO use HttpResponse<T> or CustomHttpResponse<T> with interceptor
  getSunriseTime$(
    date: string = new Date().toLocaleDateString('en-US')
  ): Observable<any> {
    return this.http.get(Config.getSunriseBaseUrl(date));
  }

  getPrayerTime$(): Observable<any> {
    return this.http.get(Config.getPrayerCSVUrl, { responseType: "text" });
  }

  setPrayerCsvTimings(data: any) {
    this.loadPrayerTimingsFromCsv(data);
    this.convertLocalTimeToUTC();
  }

  loadPrayerTimingsFromCsv(data: any) {
    this.annualPrayerTimings = [];
    let csvToRowArray = data.toString().split("\n");
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

  setSunriseApiTimings(sunriseAPIResult: SunriseTimingsUTCModel): void {
    this.sunriseAPIResult = sunriseAPIResult;
    this._sunriseStartInEpoch = DateHelper.addTimeInEpochMinutes(
      sunriseAPIResult.sunrise,
      ePrayerOffset.SUNRISE
    );

    this._ishraqStartInEpoch = DateHelper.addTimeInEpochMinutes(
      sunriseAPIResult.sunrise,
      ePrayerOffset.ISHRAQ
    );

    this._chashtStartInEpoch = DateHelper.addTimeInEpochMinutes(
      sunriseAPIResult.sunrise,
      sunriseAPIResult.day_length / (4 * 60) //1/4 of Daylength
    );

    this._zawalStartInEpoch = DateHelper.addTimeInEpochMinutes(
      sunriseAPIResult.solar_noon,
      ePrayerOffset.ZAWAL
    );

    this._asrStartInEpoch = DateHelper.addTimeInEpochMinutes(
      sunriseAPIResult.solar_noon,
      sunriseAPIResult.day_length / (4 * 60) //1/4 of Daylength
    );
    this._asrEndInEpoch = DateHelper.addTimeInEpochMinutes(
      sunriseAPIResult.sunset,
      ePrayerOffset.ASR
    );

    this._maghribStartInEpoch = DateHelper.addTimeInEpochMinutes(
      sunriseAPIResult.sunset,
      ePrayerOffset.MAGHRIB
    );

    this._ishaEndInEpoch = DateHelper.addTimeInEpochMinutes(
      sunriseAPIResult.sunset,
      (86400 - sunriseAPIResult.day_length) / (2 * 60) //1/4 of Daylength
    );
  }

  setPrayerTimings(): void {
    this.prayers = [];
    let currentAshura: PrayerTimingsModel = this.getCurrentAshuraTimings();

    this.prayers.push(
      {
        name: ePrayers.FAJR,
        type: ePrayerType.PRAYER,
        start: formatDate(
          this.sunriseAPIResult.astronomical_twilight_begin,
          "hh:mm a",
          this.locale
        ),
        startEpoch: DateHelper.getTimeInEpoch(
          this.sunriseAPIResult.astronomical_twilight_begin
        ),
        athan: formatDate(currentAshura.fajr, "hh:mm a", this.locale),
        iqamah: formatDate(
          DateHelper.addTimeInEpochMinutes(currentAshura.fajr, 10),
          "hh:mm a",
          this.locale
        ),
        end: formatDate(this._sunriseStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._sunriseStartInEpoch,
        visible: true,
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
      },
      // {
      //   name: ePrayers.ISHRAQ,
      //   type: ePrayerType.INTERVAL,
      //   start: formatDate(this._ishraqStartInEpoch, "hh:mm a", this.locale),
      //   startEpoch: this._ishraqStartInEpoch,
      //   end: formatDate(this._chashtStartInEpoch, "hh:mm a", this.locale),
      //   endEpoch: this._chashtStartInEpoch,
      //   visible: false,
      // },
      // {
      //   name: ePrayers.CHASHT,
      //   type: ePrayerType.INTERVAL,
      //   start: formatDate(this._chashtStartInEpoch, "hh:mm a", this.locale),
      //   startEpoch: this._chashtStartInEpoch,
      //   end: formatDate(this._zawalStartInEpoch, "hh:mm a", this.locale),
      //   endEpoch: this._zawalStartInEpoch,
      //   visible: false,
      // },
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
      },
      {
        name: ePrayers.DHUR,
        type: ePrayerType.PRAYER,
        start: formatDate(
          this.sunriseAPIResult.solar_noon,
          "hh:mm a",
          this.locale
        ), //Noon
        startEpoch: DateHelper.getTimeInEpoch(this.sunriseAPIResult.solar_noon), //Noon in Epoch
        athan: formatDate(currentAshura.dhur, "hh:mm a", this.locale),
        iqamah: formatDate(
          DateHelper.addTimeInEpochMinutes(currentAshura.dhur, 10),
          "hh:mm a",
          this.locale
        ),
        end: formatDate(this._asrStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._asrStartInEpoch,
        visible: new Date().getDay() == 5 ? false : true,
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
      },
      {
        name: ePrayers.GHUROOB,
        type: ePrayerType.INTERVAL,
        start: formatDate(this._asrEndInEpoch, "hh:mm a", this.locale),
        startEpoch: this._asrEndInEpoch,
        end: formatDate(this.sunriseAPIResult.sunset, "hh:mm a", this.locale), //Noon
        endEpoch: DateHelper.getTimeInEpoch(this.sunriseAPIResult.sunset), //Noon in Epoch
        visible: false,
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
      },
      {
        name: ePrayers.ISHA,
        type: ePrayerType.PRAYER,
        start: formatDate(
          this.sunriseAPIResult.astronomical_twilight_end,
          "hh:mm a",
          this.locale
        ),
        startEpoch: DateHelper.getTimeInEpoch(
          this.sunriseAPIResult.astronomical_twilight_end
        ),
        athan: formatDate(currentAshura.isha, "hh:mm a", this.locale),
        iqamah: formatDate(
          DateHelper.addTimeInEpochMinutes(currentAshura.isha, 10),
          "hh:mm a",
          this.locale
        ),
        end: formatDate(this._ishaEndInEpoch, "hh:mm a", this.locale),
        endEpoch: this._ishaEndInEpoch,
        visible: true,
      },
      {
        name: ePrayers.JUMUAH,
        type: ePrayerType.JUMUAH,
        start: formatDate("2023-01-20T20:30:00+00:00", "hh:mm a", this.locale), //Noon
        startEpoch: DateHelper.getTimeInEpoch(this.sunriseAPIResult.solar_noon), //Noon in Epoch
        athan: formatDate(currentAshura.jumuah_1, "hh:mm a", this.locale),
        iqamah: formatDate(currentAshura.jumuah_2, "hh:mm a", this.locale),
        end: formatDate("2023-01-20T21:30:00+00:00", "hh:mm a", this.locale),
        endEpoch: this._asrStartInEpoch,
        visible: true,
      }
    );

    this.prayers.forEach((prayer) => {
      if (prayer.type == ePrayerType.PRAYER) {
        prayer.startLabel = ePrayerLabels.ADHAN;
        prayer.endLabel = ePrayerLabels.IQAMAH;
      } else if (prayer.type == ePrayerType.INTERVAL) {
        prayer.startLabel = ePrayerLabels.START;
        prayer.endLabel = ePrayerLabels.END;
      } else if (prayer.type == ePrayerType.JUMUAH) {
        prayer.startLabel = ePrayerLabels.FIRST_JUMUAH;
        prayer.endLabel = ePrayerLabels.SECOND_JUMUAH;
      }
    });
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
}
