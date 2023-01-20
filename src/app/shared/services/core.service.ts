import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Subject } from "rxjs/internal/Subject";

import { Config } from "@tap/core/config";
import { DateHelper } from "@tap/core/dateHelper.utilities";
import {
  MenuNode,
  SunriseTimingsUTCModel,
  PrayerModel,
  ePrayers,
  ePrayerType,
  ePrayerOffset,
} from "@tap/shared/models";

@Injectable({
  providedIn: "root",
})
export class CoreService {
  private _sunriseStartInEpoch!: number;
  private _ishraqStartInEpoch!: number;
  private _chashtStartInEpoch!: number;
  private _zawalStartInEpoch!: number;
  private _asrStartInEpoch!: number;
  private _asrEndInEpoch!: number;
  private _maghribStartInEpoch!: number;
  private _ishaEndInEpoch!: number;

  public prayers: Array<PrayerModel> = [];

  public menuBtnClicked$ = new Subject();

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private http: HttpClient
  ) {}

  // TODO use HttpResponse<T> or CustomHttpResponse<T> with interceptor
  getSunriseTime$(date: Date = new Date()): Observable<any> {
    return this.http.get(Config.getSunriseBaseUrl(date));
  }

  getPrayerTimings(sunriseAPIResult: SunriseTimingsUTCModel): void {
    this._sunriseStartInEpoch = DateHelper.addTimeInEpoch(
      sunriseAPIResult.sunrise,
      ePrayerOffset.SUNRISE
    );

    this._ishraqStartInEpoch = DateHelper.addTimeInEpoch(
      sunriseAPIResult.sunrise,
      ePrayerOffset.ISHRAQ
    );

    this._chashtStartInEpoch = DateHelper.addTimeInEpoch(
      sunriseAPIResult.sunrise,
      sunriseAPIResult.day_length / (4 * 60) //1/4 of Daylength
    );

    this._zawalStartInEpoch = DateHelper.addTimeInEpoch(
      sunriseAPIResult.solar_noon,
      ePrayerOffset.ZAWAL
    );

    this._asrStartInEpoch = DateHelper.addTimeInEpoch(
      sunriseAPIResult.solar_noon,
      sunriseAPIResult.day_length / (4 * 60) //1/4 of Daylength
    );
    this._asrEndInEpoch = DateHelper.addTimeInEpoch(
      sunriseAPIResult.sunset,
      ePrayerOffset.ASR
    );

    this._maghribStartInEpoch = DateHelper.addTimeInEpoch(
      sunriseAPIResult.sunset,
      ePrayerOffset.MAGHRIB
    );

    this._ishaEndInEpoch = DateHelper.addTimeInEpoch(
      sunriseAPIResult.sunset,
      (86400 - sunriseAPIResult.day_length) / (2 * 60) //1/4 of Daylength
    );
  }

 

  setPrayerTimings(sunriseAPIResult: SunriseTimingsUTCModel): void {
    this.prayers = [];
    this.prayers.push(
      {
        name: ePrayers.FAJR,
        type: ePrayerType.PRAYER,
        start: formatDate(sunriseAPIResult.astronomical_twilight_begin, "hh:mm a", this.locale),
        startEpoch: DateHelper.getTimeInEpoch(sunriseAPIResult.astronomical_twilight_begin), 
        // iqamah: this.maghribStart,
        // athan: this.maghribStart,
        end: formatDate(this._sunriseStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._sunriseStartInEpoch,
      },
      {
        name: ePrayers.SHUROOQ,
        type: ePrayerType.INTERVAL,
        start: formatDate(sunriseAPIResult.sunrise, "hh:mm a", this.locale),
        startEpoch: this._sunriseStartInEpoch,
        end: formatDate(this._ishraqStartInEpoch, "hh:mm a", this.locale), //Sunrise
        endEpoch: this._ishraqStartInEpoch, //Sunrise in Epoch
      },
      {
        name: ePrayers.ISHRAQ,
        type: ePrayerType.INTERVAL,
        start: formatDate(this._ishraqStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._ishraqStartInEpoch,
        end: formatDate(this._chashtStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._chashtStartInEpoch,
      },
      {
        name: ePrayers.CHASHT,
        type: ePrayerType.INTERVAL,
        start: formatDate(this._chashtStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._chashtStartInEpoch,
        end: formatDate(this._zawalStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._zawalStartInEpoch,
      },
      {
        name: ePrayers.ZAWAL,
        type: ePrayerType.INTERVAL,
        start: formatDate(this._zawalStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._zawalStartInEpoch,
        end: formatDate(sunriseAPIResult.solar_noon, "hh:mm a", this.locale), //Noon
        endEpoch: DateHelper.getTimeInEpoch(sunriseAPIResult.solar_noon), //Noon in Epoch
      },
      {
        name: ePrayers.DHUR,
        type: ePrayerType.PRAYER,
        start: formatDate(sunriseAPIResult.solar_noon, "hh:mm a", this.locale), //Noon
        startEpoch: DateHelper.getTimeInEpoch(sunriseAPIResult.solar_noon), //Noon in Epoch
        // iqamah: this.maghribStart,
        // athan: this.maghribStart,
        end: formatDate(this._asrStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._asrStartInEpoch,
      },
      {
        name: ePrayers.ASR,
        type: ePrayerType.PRAYER,
        start: formatDate(this._asrStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._asrStartInEpoch,
        // iqamah: this.maghribStart,
        // athan: this.maghribStart,
        end: formatDate(this._asrEndInEpoch, "hh:mm a", this.locale),
        endEpoch: this._asrEndInEpoch,
      },
      {
        name: ePrayers.GHUROOB,
        type: ePrayerType.INTERVAL,
        start: formatDate(this._asrEndInEpoch, "hh:mm a", this.locale),
        startEpoch: this._asrEndInEpoch,
        end: formatDate(sunriseAPIResult.sunset, "hh:mm a", this.locale), //Noon
        endEpoch: DateHelper.getTimeInEpoch(sunriseAPIResult.sunset), //Noon in Epoch
      },
      {
        name: ePrayers.MAGHRIB,
        type: ePrayerType.PRAYER,
        start: formatDate(sunriseAPIResult.sunset, "hh:mm a", this.locale), //Sunset
        startEpoch: DateHelper.getTimeInEpoch(sunriseAPIResult.sunset), //Sunset in Epoch
        iqamah: formatDate(this._maghribStartInEpoch, "hh:mm a", this.locale),
        athan: formatDate(this._maghribStartInEpoch, "hh:mm a", this.locale),
        end: formatDate(sunriseAPIResult.astronomical_twilight_end, "hh:mm a", this.locale), 
        endEpoch: DateHelper.getTimeInEpoch(sunriseAPIResult.astronomical_twilight_end),
      },
      {
        name: ePrayers.ISHA,
        type: ePrayerType.PRAYER,
        start: formatDate(sunriseAPIResult.astronomical_twilight_end, "hh:mm a", this.locale), 
        startEpoch: DateHelper.getTimeInEpoch(sunriseAPIResult.astronomical_twilight_end), 
        // iqamah: formatDate(this._maghribStartInEpoch, "hh:mm a", this.locale),
        // athan: formatDate(this._maghribStartInEpoch, "hh:mm a", this.locale),
        end: formatDate(this._ishaEndInEpoch, "hh:mm a", this.locale),
        endEpoch: this._ishaEndInEpoch,
      }
    );
  }

  handleNodeEvents(node: MenuNode) {
    switch (node.iconLabel) {
      case "menu":
        this.menuBtnClicked$.next(node.iconLabel);
        break;
      default:
        this.menuBtnClicked$.next(node.iconLabel);
        break;
    }
  }
}
