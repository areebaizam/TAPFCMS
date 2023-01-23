import { Component } from "@angular/core"
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
  imports: [MatButtonModule,MatIconModule,HeaderDisplayComponent, HeadingComponent, PrayerTimeComponent],
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
})
export class HeroComponent {
  heading: TopicHeading = topicList.filter(
    (t) => t.type == eTopicHeading.WELCOME
  )[0];
}
