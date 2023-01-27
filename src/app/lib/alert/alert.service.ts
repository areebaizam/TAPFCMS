import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";

import { Alert, eAlertType, AlertOptions,eAlertClassId } from "./alert.model";
@Injectable({
  providedIn: "root",
})
export class AlertService {
  private alert$ = new Subject<Alert>();
  private defaultId = eAlertClassId.DEFAULT;

  // enable subscribing to alerts observable
  onAlert(id = this.defaultId): Observable<Alert> {
    return this.alert$.asObservable().pipe(filter((x) => x && x.id === id));
  }

  // convenience methods
  success(message: string, options?: AlertOptions) {
    this.alert(new Alert({ ...options, type: eAlertType.Success, message }));
  }

  error(message: string, options?: AlertOptions) {
    this.alert(new Alert({ ...options, type: eAlertType.Error, message }));
  }

  info(message: string, options?: AlertOptions) {
    this.alert(new Alert({ ...options, type: eAlertType.Info, message }));
  }

  warn(message: string, options?: AlertOptions) {
    this.alert(new Alert({ ...options, type: eAlertType.Warning, message }));
  }

  // main alert method
  alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;
    this.alert$.next(alert);
  }

  // clear alerts
  clear(id = this.defaultId) {
    this.alert$.next(new Alert({ id }));
  }
}
