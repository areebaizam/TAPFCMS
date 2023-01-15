import { Component } from "@angular/core";
import { HeadingComponent } from "@tap/standalone/components/";
import { TopicHeading, topicList, eTopicHeading } from "@tap/shared/models";

@Component({
  selector: "tap-hero",
  standalone: true,
  imports: [HeadingComponent],
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
})
export class HeroComponent {
  heading: TopicHeading = topicList.filter(
    (t) => t.type == eTopicHeading.WELCOME
  )[0];
}
