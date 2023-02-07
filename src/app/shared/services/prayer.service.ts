import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Config, PrayerConfig } from "@tap/core/configurations";
import { DateHelper } from "@tap/core/dateHelper.utilities";
import { HijriDate } from "@tap/core/hijriDate.utilities";
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
  OffsetSelector,
  MONTHS,
} from "@tap/shared/models";

import { SunriseSunset, SolarNoonData } from "@tap/core/solarHelper.utilities";

@Injectable({
  providedIn: "root",
})
export class PrayerService {
  //Cache API
  private _cachePrayerCSVData: any = null;

  private _solarNoonData: SolarNoonData = new SolarNoonData();

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
  private _noonStartInEpoch!: number;
  private _dhurStartInEpoch!: number;
  private _asrStartInEpoch!: number;
  private _asrEndInEpoch!: number;
  private _sunsetStartInEpoch!: number;
  private _maghribStartInEpoch!: number;
  private _ishaStartInEpoch!: number;
  private _ishaEndInEpoch!: number;

  getSolarTimings(date: Date = new Date()) {
    date.setHours(0, 0, 0, 0);
    this.hijriDate= HijriDate.getHijriDate(date);
    this._solarNoonData = SunriseSunset.calcSolarNoonData(
      PrayerConfig.location.lng,
      date
    );
    this.setPrayersInteval(this._solarNoonData, date);
  }

  private setPrayersInteval(solarNoonData: SolarNoonData, date: Date) {
    const fajrOffsetInSeconds = SunriseSunset.calcSolarAngleOffsetInSeconds(
      180 -
        (this.prayerCalcMethod && this.prayerCalcMethod.FajrOffset
          ? this.prayerCalcMethod.FajrOffset
          : 0),
      PrayerConfig.location.lat,
      solarNoonData
    );
    //ATM Refraction Factor: .8333 Zenith Angle: Sunset/sunset 90, Civil Twilight:96, Nautical: 102, Astronomical: 108
    const sunriseOffsetInSeconds = SunriseSunset.calcSolarAngleOffsetInSeconds(
      180 - 0.833,
      PrayerConfig.location.lat,
      solarNoonData
    );
    const sunsetOffsetInSeconds = SunriseSunset.calcSolarAngleOffsetInSeconds(
      0.833,
      PrayerConfig.location.lat,
      solarNoonData
    );

    const dayPortion = sunsetOffsetInSeconds - sunriseOffsetInSeconds;
    const nightPortion = 86400 - dayPortion;

    const asrOffsetInSeconds = SunriseSunset.calcAsrOffsetInSeconds(
      PrayerConfig.location.lat,
      solarNoonData,
      PrayerConfig.asrJuristicMethod
    );

    const maghribOffsetInSeconds = SunriseSunset.calcSolarAngleOffsetInSeconds(
      this.prayerCalcMethod ? this.prayerCalcMethod.MaghribOffset : 0,
      PrayerConfig.location.lat,
      solarNoonData
    );

    const ishaOffsetInSeconds = SunriseSunset.calcSolarAngleOffsetInSeconds(
      this.prayerCalcMethod ? this.prayerCalcMethod.IshaOffset : 0,
      PrayerConfig.location.lat,
      solarNoonData
    );

    this._noonStartInEpoch = DateHelper.convertEpochOffsetToEpoch(
      date,
      solarNoonData.solarNoonInSeconds
    );
    this._sunriseStartInEpoch = DateHelper.convertEpochOffsetToEpoch(
      date,
      sunriseOffsetInSeconds
    );
    this._sunsetStartInEpoch = DateHelper.convertEpochOffsetToEpoch(
      date,
      sunsetOffsetInSeconds
    );
    this._fajrStartInEpoch = DateHelper.convertEpochOffsetToEpoch(
      date,
      fajrOffsetInSeconds
    );
    this._asrStartInEpoch = DateHelper.convertEpochOffsetToEpoch(
      date,
      asrOffsetInSeconds
    );

    //Set Maghrib Prayer Start
    if (
      this.prayerCalcMethod &&
      this.prayerCalcMethod.MaghribSelector == OffsetSelector.MINUTES
    )
      this._maghribStartInEpoch = DateHelper.addEpochTimeInEpochMinutes(
        this._sunsetStartInEpoch,
        this.prayerCalcMethod.MaghribOffset
      );
    else if (
      this.prayerCalcMethod &&
      this.prayerCalcMethod.MaghribSelector == OffsetSelector.DEGREE
    )
      this._maghribStartInEpoch = DateHelper.convertEpochOffsetToEpoch(
        date,
        maghribOffsetInSeconds
      );

    // Set Isha Prayer Start
    if (
      this.prayerCalcMethod &&
      this.prayerCalcMethod.IshaSelector == OffsetSelector.DEGREE
    )
      this._ishaStartInEpoch = DateHelper.convertEpochOffsetToEpoch(
        date,
        ishaOffsetInSeconds
      );
    else if (
      this.prayerCalcMethod &&
      this.prayerCalcMethod.IshaSelector == OffsetSelector.MINUTES
    )
      this._ishaStartInEpoch = DateHelper.addEpochTimeInEpochMinutes(
        this._maghribStartInEpoch,
        this.prayerCalcMethod.IshaOffset
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

    this._asrEndInEpoch = DateHelper.addEpochTimeInEpochMinutes(
      this._sunsetStartInEpoch,
      PrayerConfig.offsetInMinutes.asr
    );

    this._ishaEndInEpoch = DateHelper.convertEpochOffsetToEpoch(
      date,
      sunsetOffsetInSeconds + nightPortion / 2
    );
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
          this.locale
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
        end: formatDate(this._sunsetStartInEpoch, "hh:mm a", this.locale),
        endEpoch: this._sunsetStartInEpoch,
        visible: false,
        isActive: false,
        order: 10,
      },
      {
        name: ePrayers.MAGHRIB,
        label: this.getPrayerLabel(this.prayerCalcMethod, ePrayers.MAGHRIB),
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
        label: this.getPrayerLabel(this.prayerCalcMethod, ePrayers.ISHA),
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

  private getPrayerLabel(
    prayerMethod: PrayerCalcMethodDegree | undefined,
    prayer: ePrayers
  ): string {
    let maghribLabel = "Ghuroob";
    let ishaLabel = "";
    if (prayerMethod && prayerMethod.MaghribOffset) {
      let unit =
        prayerMethod.MaghribSelector === OffsetSelector.MINUTES
          ? prayerMethod.MaghribOffset + "'"
          : prayerMethod.MaghribOffset + "°";
      maghribLabel = maghribLabel + " + " + unit;
    }

    if (prayerMethod && prayerMethod.IshaOffset) {
      ishaLabel =
        prayerMethod.IshaSelector === OffsetSelector.MINUTES
          ? "Ghuroob + " + prayerMethod.IshaOffset + "'"
          : prayerMethod.IshaOffset + "° to Midnight";
    }
    return prayer === ePrayers.MAGHRIB ? maghribLabel : ishaLabel;
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
