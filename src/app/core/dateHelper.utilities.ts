export const minutesToMilliseconds: number = 60 * 1000; //60000
export const hoursToMilliseconds: number = 60 * 60 * 1000; //3600000
export const dayToMilliseconds: number = 24 * 60 * 60 * 1000; //86,400,000
// export const datePrefix: string = "2023-01-01T"; //TODO Remove this
// export const dateSuffix: string = ":00+00:00"; //TODO Remove this

export class DateHelper {

  public static addEpochTimeInEpochMinutes(
    epochDate: number,
    minutes: number
  ): number {
    return epochDate + minutes * minutesToMilliseconds;
  }

  public static getTomorrowDateInterval(): number {
    const today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - today.getTime();
  }

  public static getNDayCurrentTimeInEpoch(
    epochtime: number,
    days: number
  ): number {
    return epochtime + days * dayToMilliseconds;
  }

  public static convertLocalTimeToEpoch(
    time: string,
    date: Date = new Date()
  ): number {
    let hour = parseInt(time.split(" ").join("").padStart(5, "0").slice(0, 2));
    let minutes = parseInt(
      time.split(" ").join("").padStart(5, "0").slice(3, 5)
    );
    date.setHours(hour, minutes, 0, 0);
    return date.getTime();
  }

  public static convertSecondsToTime(seconds: number): string {
    let date = new Date(seconds).toISOString().slice(11, 19); //Extract timt from date
    return date;
  }

  public static get getDayToMilliseconds(): number {
    return dayToMilliseconds;
  }
}
