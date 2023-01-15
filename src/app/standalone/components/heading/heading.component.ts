import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { TopicHeading } from '@tap/shared/models';
@Component({
  selector: "tap-heading",
  standalone: true,
  imports: [NgClass],
  templateUrl: "./heading.component.html",
})
export class HeadingComponent {
  @Input() heading: TopicHeading = new TopicHeading();
  @Input() alignLeft: Boolean = false;
}
