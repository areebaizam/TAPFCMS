import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { NgFor } from "@angular/common";
import { Router, NavigationStart } from "@angular/router";
import { Subscription } from "rxjs";

import { Alert, eAlertType, eAlertClassId } from "./alert.model";
import { AlertService } from "./alert.service";

@Component({
  selector: "tap-alert",
  standalone: true,
  imports: [NgFor],
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.scss"],
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = eAlertClassId.DEFAULT;
  // fades on close
  @Input() fade = true;

  alerts: Alert[] = [];
  subscriptions: Subscription = new Subscription();

  constructor(private router: Router, private alertService: AlertService) {}

  ngOnInit(): void {
    this.initListener();
  }

  initListener() {
    this.subscriptions.add(
      this.alertService.onAlert(this.id).subscribe((alert) => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
          // filter out alerts without 'keepAfterRouteChange' flag
          this.alerts = this.alerts.filter((x) => x.keepAfterRouteChange);
          // remove 'keepAfterRouteChange' flag on the rest
          this.alerts.forEach((x) => delete x.keepAfterRouteChange);
          return;
        }
        // add alert to array
        this.alerts.push(alert);

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => this.removeAlert(alert), 3000);
        }
      })
    );

    // clear alerts on location change
    this.subscriptions.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.alertService.clear(this.id);
        }
      })
    );
  }

  removeAlert(alert: Alert) {
    // check if already removed to prevent error on auto close
    if (!this.alerts.includes(alert)) return;

    // fade out alert if this.fade === true
    const timeout = this.fade ? 250 : 0;
    alert.fade = this.fade;

    setTimeout(() => {
      // filter alert out of array
      this.alerts = this.alerts.filter((x) => x !== alert);
    }, timeout);
  }

  setAlertClass(alert: Alert) {
    if (!alert) return;

    //Dismissable Alert means close button
    const classes = [eAlertClassId.ALERT, eAlertClassId.DISMISS];

    const alertTypeClass = {
      [eAlertType.Success]: eAlertClassId.SUCCESS,
      [eAlertType.Error]: eAlertClassId.ERROR,
      [eAlertType.Info]: eAlertClassId.INFO,
      [eAlertType.Warning]: eAlertClassId.WARNING,
    };

    if (alert.type !== undefined) {
      classes.push(alertTypeClass[alert.type]);
    }

    if (alert.fade) {
      classes.push(eAlertClassId.FADE);
    }

    return classes.join(" ");
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
