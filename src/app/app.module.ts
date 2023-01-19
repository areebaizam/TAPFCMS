import { NgModule, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from "@angular/service-worker";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { SidenavComponent } from "./standalone/components";

//Router Configuration
import { APP_ROUTES } from "./app.route";
import {
  provideRouter,
  PreloadAllModules,
  withPreloading,
} from "@angular/router";


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    HttpClientModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: "registerWhenStable:30000",
    }),
    BrowserAnimationsModule,
    SidenavComponent,
  ],
  providers: [provideRouter(APP_ROUTES, withPreloading(PreloadAllModules))],
  bootstrap: [AppComponent],
})
export class AppModule {}
