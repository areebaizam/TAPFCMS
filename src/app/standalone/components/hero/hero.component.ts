import { Component, Inject } from "@angular/core";
import { PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { NgIf } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {
  HeaderDisplayComponent,
  HeadingComponent,
  PrayerTimeComponent,
} from "@tap/standalone/components/";
import { TopicHeading, topicList, eTopicHeading } from "@tap/shared/models";

@Component({
  selector: "tap-hero",
  standalone: true,
  imports: [
    NgIf,
    MatButtonModule,
    MatIconModule,
    HeaderDisplayComponent,
    HeadingComponent,
    PrayerTimeComponent,
  ],
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
})
export class HeroComponent {
  isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  heading: TopicHeading = topicList.filter(
    (t) => t.type == eTopicHeading.WELCOME
  )[0];
}
