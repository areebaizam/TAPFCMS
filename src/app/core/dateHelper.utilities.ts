export const minutesToMilliseconds: number = 60 * 1000; //60000
export const hoursToMilliseconds: number = 60 * 60 * 1000; //3600000
export const dayToMilliseconds: number = 24 * 60 * 60 * 1000; //86,400,000
export const datePrefix: string = "2023-01-01T";
export const dateSuffix: string = ":00+00:00";

export class DateHelper {
  public static addTimeInEpochMinutes(date: Date, minutes: number): number {
    return new Date(date).getTime() + minutes * minutesToMilliseconds;
  }
  public static addTimeInEpochHours(formattedDate: string, hours: number): number {
    return new Date(formattedDate).getTime() + hours * hoursToMilliseconds;
  }
  public static getTimeInEpoch(date: Date): number {
    return new Date(date).getTime();
  }

  public static convertLocalTimeToUTC8(time: string): number {
    //pad start for Fjr prayer for leading 0
    let formattedDate = datePrefix + time.padStart(5,"0") + dateSuffix;
    let utc8TimeInEpoch = DateHelper.addTimeInEpochHours(formattedDate,8);
    return utc8TimeInEpoch;
  }

  public static get getMinutesToMilliseconds(): number {
    return minutesToMilliseconds;
  }
  public static get getDayToMilliseconds(): number {
    return dayToMilliseconds;
  }
}
