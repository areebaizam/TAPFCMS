import { Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { HeadingComponent,FooterCopyrightComponent } from "@tap/standalone/components/";
import { TopicHeading, topicList, eTopicHeading } from '@tap/shared/models';

@Component({
  selector: "tap-donate",
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, HeadingComponent, FooterCopyrightComponent],
  templateUrl: "./donate.component.html",
  styleUrls: ["./donate.component.scss"],
})
export class DonateComponent {
  heading: TopicHeading = topicList.filter(t=>t.type==eTopicHeading.DONATION)[0];
}
