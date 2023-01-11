import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterBoolean",
  standalone: true,
})
export class FilterBooleanPipe implements PipeTransform {
  transform(items: any[] | undefined, field: string, value: boolean): any[] {
    if (!items) return [];
    return items.filter((it) => it[field] == value);
  }
}