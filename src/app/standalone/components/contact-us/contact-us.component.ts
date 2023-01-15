import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { HeadingComponent } from "@tap/standalone/components";
import { TopicHeading, topicList, eTopicHeading } from "@tap/shared/models";

@Component({
  selector: 'tap-contact-us',
  standalone: true,
  imports: [MatIconModule,HeadingComponent],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  heading: TopicHeading = topicList.filter(
    (t) => t.type == eTopicHeading.CONTACT
  )[0];
}
