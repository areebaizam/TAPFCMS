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
  private _asrEndInEpoch!: number;
  private _maghribStartInEpoch!: number;

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

    this._asrEndInEpoch = DateHelper.addTimeInEpoch(
      sunriseAPIResult.sunset,
      ePrayerOffset.ASR
    );

    this._maghribStartInEpoch = DateHelper.addTimeInEpoch(
      sunriseAPIResult.sunset,
      ePrayerOffset.MAGHRIB
    );
  }

  setPrayerTimings(sunriseAPIResult: SunriseTimingsUTCModel): void {
    this.prayers.push(
      {
        prayer: ePrayers.FAJR,
        type: ePrayerType.PRAYER,
        // start: this.ishraqStart,
        // iqamah: this.maghribStart,
        // athan: this.maghribStart,
        end: formatDate(this._sunriseStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._sunriseStartInEpoch,
      },
      {
        prayer: ePrayers.SUNRISE,
        type: ePrayerType.INTERVAL,
        start: formatDate(this._sunriseStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._sunriseStartInEpoch,
        end: formatDate(sunriseAPIResult.sunrise, "hh:mm a", this.locale), //Sunrise
        endEpoch: DateHelper.getTimeInEpoch(sunriseAPIResult.sunrise), //Sunrise in Epoch
      },
      {
        prayer: ePrayers.ISHRAQ,
        type: ePrayerType.INTERVAL,
        start: formatDate(this._ishraqStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._ishraqStartInEpoch,
        end: formatDate(this._chashtStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._chashtStartInEpoch,
      },
      {
        prayer: ePrayers.CHASHT,
        type: ePrayerType.INTERVAL,
        start: formatDate(this._chashtStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._chashtStartInEpoch,
        end: formatDate(this._zawalStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._zawalStartInEpoch,
      },
      {
        prayer: ePrayers.ZAWAL,
        type: ePrayerType.INTERVAL,
        start: formatDate(this._zawalStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._zawalStartInEpoch,
        end: formatDate(sunriseAPIResult.solar_noon, "hh:mm a", this.locale), //Noon
        endEpoch: DateHelper.getTimeInEpoch(sunriseAPIResult.solar_noon), //Noon in Epoch
      },
      {
        prayer: ePrayers.DHUR,
        type: ePrayerType.PRAYER,
        start: formatDate(sunriseAPIResult.solar_noon, "hh:mm a", this.locale), //Noon
        startEpoch: DateHelper.getTimeInEpoch(sunriseAPIResult.solar_noon), //Noon in Epoch
        // iqamah: this.maghribStart,
        // athan: this.maghribStart,
        // end: formatDate(sunriseAPIResult.solar_noon, "hh:mm a", this.locale),
      },
      {
        prayer: ePrayers.ASR,
        type: ePrayerType.PRAYER,
        // start: formatDate(sunriseAPIResult.sunset, "hh:mm a", this.locale),
        // iqamah: this.maghribStart,
        // athan: this.maghribStart,
        end: formatDate(this._asrEndInEpoch, "hh:mm a", this.locale),
        endEpoch: this._asrEndInEpoch,
      },
      {
        prayer: ePrayers.MAGHRIB,
        type: ePrayerType.PRAYER,
        start: formatDate(sunriseAPIResult.sunset, "hh:mm a", this.locale), //Sunset
        startEpoch: DateHelper.getTimeInEpoch(sunriseAPIResult.sunset), //Sunset in Epoch
        iqamah: formatDate(this._maghribStartInEpoch, "hh:mm a", this.locale),
        athan: formatDate(this._maghribStartInEpoch, "hh:mm a", this.locale),
        // end: this.maghribStart, //TODO FIND THIS
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
