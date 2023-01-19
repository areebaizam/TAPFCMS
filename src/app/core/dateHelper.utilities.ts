export const minutesToMilliseconds: number = 60 * 1000;

export class DateHelper {
  public static addTimeInEpoch(date: Date, minutes: number): number {
    return new Date(date).getTime() + minutes * minutesToMilliseconds;
  }
  public static getTimeInEpoch(date: Date): number {
    return new Date(date).getTime();
  }
  public static get getMinutesToMilliseconds(): number {
    return minutesToMilliseconds;
  }
}
