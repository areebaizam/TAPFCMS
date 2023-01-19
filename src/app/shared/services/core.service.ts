import { Injectable } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";
import { MenuNode } from "@tap/shared/models";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Config } from "@tap/core/config";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class CoreService {
  public menuBtnClicked$ = new Subject();

  constructor(private http: HttpClient) {}

  readonly lat = 49.2263435; 
  readonly lng = -123.1067579;

  // TODO use HttpResponse<T> or CustomHttpResponse<T> with interceptor
  getSunriseTime$(date:Date = new Date()): Observable<any> {
    return this.http.get(Config.getSunriseBaseUrl(this.lat,this.lng, date));
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
