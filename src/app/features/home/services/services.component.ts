import { Component } from '@angular/core';
import { HeadingComponent,CardServiceComponent } from "@tap/standalone/components/";
import {
  TopicHeading,
  topicList,
  eTopicHeading,
  FeatureCard,
  cardData,
} from "@tap/shared/models";

@Component({
  selector: 'tap-services',
  standalone: true,
  imports: [HeadingComponent,CardServiceComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
   heading: TopicHeading = topicList.filter(t=>t.type==eTopicHeading.SERVICES)[0];
   data: Array<FeatureCard> = cardData.filter(
    (t) => t.type == eTopicHeading.SERVICES
  );
}
