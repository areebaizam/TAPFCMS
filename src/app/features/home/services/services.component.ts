import { Component } from '@angular/core';
import { HeadingComponent,CardServiceComponent,CardSupportComponent } from "@tap/standalone/components/";
import { TopicHeading, topicList, eTopicHeading } from '@tap/shared/models';

@Component({
  selector: 'tap-services',
  standalone: true,
  imports: [HeadingComponent,CardServiceComponent,CardSupportComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  headingHelp: TopicHeading = topicList.filter(t=>t.type==eTopicHeading.HELP)[0];
  headingServices: TopicHeading = topicList.filter(t=>t.type==eTopicHeading.SERVICES)[0];
}