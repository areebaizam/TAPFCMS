import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Config, PrayerConfig } from "@tap/core/configurations";
import { DateHelper } from "@tap/core/dateHelper.utilities";
import {
  PrayerTimingsModel,
  PrayerModel,
  ePrayers,
  ePrayerLabels,
  ePrayerType,
  eAshura,
  PrayerCalcMethodDegreeMap,
  PrayerCalcMethodDegree,
  JuristicMethodMap,
  MONTHS,
} from "@tap/shared/models";

import { SunriseSunset, SolarDataModel } from "@tap/core/solarHelper.utilities";

@Injectable({
  providedIn: "root",
})
export class PrayerService {
  //Cache API
  private _cachePrayerCSVData: any = null;

  private _solarTimings: SolarDataModel = new SolarDataModel();

  public prayers: Array<PrayerModel> = [];
  public prayerCalcMethod?: PrayerCalcMethodDegree =
    PrayerCalcMethodDegreeMap.get(PrayerConfig.prayerCalcMethod);

  annualPrayerTimingsCSV: PrayerTimingsModel[] = [];
  annualPrayerTimingsEpoch: PrayerTimingsModel[] = [];
  hijriDate: string = "";

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private http: HttpClient
  ) {}

  private _imsakStartInEpoch!: number;
  private _fajrStartInEpoch!: number;
  private _fajrEndInEpoch!: number;
  private _sunriseStartInEpoch!: number;
  private _ishraqStartInEpoch!: number;
  private _chashtStartInEpoch!: number;
  private _zawalStartInEpoch!: number;
  private _dhurStartInEpoch!: number; //TODO remove this
  private _noonStartInEpoch!: number;
  private _asrStartInEpoch!: number;
  private _asrEndInEpoch!: number;
  private _sunsetStartInEpoch!: number;
  private _maghribStartInEpoch!: number;
  private _ishaStartInEpoch!: number;
  private _ishaEndInEpoch!: number;

  getSolarTimings(date: Date = new Date()) {
    date.setHours(0, 0, 0, 0);
    this._solarTimings = SunriseSunset.CalcSunTimeInSeconds(
      PrayerConfig.location.lat,
      PrayerConfig.location.lng,
      date
    );
    this.setPrayersInteval(this._solarTimings, date);
  }

  private setPrayersInteval(
    solarTimings: SolarDataModel,
    date: Date
  ) {
    this._sunriseStartInEpoch = DateHelper.convertEpochOffsetToEpoch(
      date,
      solarTimings.sunriseInSeconds
    );

    this._fajrStartInEpoch = DateHelper.addOffsetDegreeToEpoch(
      this._sunriseStartInEpoch,
      this.prayerCalcMethod ? -this.prayerCalcMethod.FajrOffset : 0
    );

    this._imsakStartInEpoch = DateHelper.addEpochTimeInEpochMinutes(
      this._fajrStartInEpoch,
      PrayerConfig.offsetInMinutes.imsak
    );

    this._fajrEndInEpoch = DateHelper.addEpochTimeInEpochMinutes(
      this._sunriseStartInEpoch,
      PrayerConfig.offsetInMinutes.fajr
    );

    this._ishraqStartInEpoch = DateHelper.addEpochTimeInEpochMinutes(
      this._sunriseStartInEpoch,
      PrayerConfig.offsetInMinutes.ishraq
    );

    this._noonStartInEpoch = DateHelper.convertEpochOffsetToEpoch(
      date,
      solarTimings.solarNoonInSeconds
    );

    this._chashtStartInEpoch =
      0.5 * (this._sunriseStartInEpoch + this._noonStartInEpoch);

    this._zawalStartInEpoch = DateHelper.addEpochTimeInEpochMinutes(
      this._noonStartInEpoch,
      PrayerConfig.offsetInMinutes.zawal
    );

    this._dhurStartInEpoch = DateHelper.addEpochTimeInEpochMinutes(
      this._noonStartInEpoch,
      PrayerConfig.offsetInMinutes.dhur
    );

    const asrOffsetInSeconds = SunriseSunset.calcAsrInSeconds(
      solarTimings.lat,
      solarTimings.sunDecl,
      solarTimings.solarNoonInSeconds,
      PrayerConfig.asrJuristicMethod
    );

    this._asrStartInEpoch = DateHelper.convertEpochOffsetToEpoch(
      date,
      asrOffsetInSeconds
    );

    this._sunsetStartInEpoch = DateHelper.convertEpochOffsetToEpoch(
      date,
      solarTimings.sunsetInSeconds
    );

    this._asrEndInEpoch = DateHelper.addEpochTimeInEpochMinutes(
      this._sunsetStartInEpoch,
      PrayerConfig.offsetInMinutes.asr
    );

    //TODO Add Altitude adjustments
    this._maghribStartInEpoch = this._sunsetStartInEpoch;

    this._ishaStartInEpoch = DateHelper.addOffsetDegreeToEpoch(
      this._maghribStartInEpoch,
      this.prayerCalcMethod ? this.prayerCalcMethod.IshaOffset : 0
    );

    const midnightOffsetInSeconds =
      SunriseSunset.calcNightInSeconds(
        solarTimings.sunriseInSeconds,
        solarTimings.sunsetInSeconds
      ) / 2;

    this._ishaEndInEpoch = DateHelper.convertEpochOffsetToEpoch(
      date,
      solarTimings.sunsetInSeconds + midnightOffsetInSeconds
    );

    console.log('solarTimings', solarTimings, this._sunriseStartInEpoch,this._noonStartInEpoch, this._sunsetStartInEpoch)
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
    this.getSolarTimings();
    this.prayers.push(
      {
        name: ePrayers.TAHAJJUD,
        type: ePrayerType.NAFL,
        start: formatDate(
          DateHelper.addDaysToEpochInEpoch(this._ishaEndInEpoch, -1),
          "hh:mm a",
          this.locale,
        ),
        startEpoch: DateHelper.addDaysToEpochInEpoch(this._ishaEndInEpoch, -1),
        end: formatDate(this._imsakStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._imsakStartInEpoch,
        visible: false,
        isActive: false,
        order: 1,
      },
      {
        name: ePrayers.FAJR,
        label: this.prayerCalcMethod?.FajrOffset + "° - Sunrise",
        type: ePrayerType.PRAYER,
        start: formatDate(this._fajrStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._fajrStartInEpoch,
        athan: formatDate(currentDayInEpoch.fajr, "hh:mm a", this.locale),
        iqamah: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(currentDayInEpoch.fajr, 10),
          "hh:mm a",
          this.locale
        ),
        end: formatDate(this._fajrEndInEpoch, "hh:mm a", this.locale),
        endEpoch: this._fajrEndInEpoch,
        visible: true,
        isActive: false,
        order: 2,
      },
      {
        name: ePrayers.SHUROOQ,
        type: ePrayerType.MAKROOH,
        start: formatDate(this._sunriseStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._sunriseStartInEpoch,
        end: formatDate(this._ishraqStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._ishraqStartInEpoch,
        visible: true,
        isActive: false,
        order: 3,
      },
      {
        name: ePrayers.ISHRAQ,
        type: ePrayerType.NAFL,
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
        type: ePrayerType.NAFL,
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
        type: ePrayerType.MAKROOH,
        start: formatDate(this._zawalStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._zawalStartInEpoch,
        end: formatDate(this._noonStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._noonStartInEpoch,
        visible: true,
        isActive: false,
        order: 6,
      },
      {
        name: ePrayers.DHUR,
        label: "Zawal + 2'",
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
        label: JuristicMethodMap.get(PrayerConfig.asrJuristicMethod),
        type: ePrayerType.PRAYER,
        start: formatDate(this._asrStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._asrStartInEpoch,
        athan: formatDate(currentDayInEpoch.asr, "hh:mm a", this.locale),
        iqamah: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(currentDayInEpoch.asr, 10),
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
        type: ePrayerType.MAKROOH,
        start: formatDate(this._asrEndInEpoch, "hh:mm a", this.locale),
        startEpoch: this._asrEndInEpoch,
        end: formatDate(this._maghribStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._maghribStartInEpoch,
        visible: false,
        isActive: false,
        order: 10,
      },
      {
        name: ePrayers.MAGHRIB,
        label: "Sunset",
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
        label: this.prayerCalcMethod?.IshaOffset + "° - Midnight",
        type: ePrayerType.PRAYER,
        start: formatDate(this._ishaStartInEpoch, "hh:mm a", this.locale),
        startEpoch: this._ishaStartInEpoch,
        athan: formatDate(currentDayInEpoch.isha, "hh:mm a", this.locale),
        iqamah: formatDate(
          DateHelper.addEpochTimeInEpochMinutes(currentDayInEpoch.isha, 10),
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
        label: "Khutbah",
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
        p.label,
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
    this._cachePrayerCSVData = null;
  }
}
