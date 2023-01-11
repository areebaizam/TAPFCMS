import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterString",
  standalone: true,
})
export class FilterStringPipe implements PipeTransform {
  transform(items: any[] | undefined, field: string, value: string): any[] {
    if (!items) return [];
    return items.filter((it) => it[field] == value);
  }
}
