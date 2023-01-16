import { Component } from '@angular/core';
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'tap-prayer-time',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './prayer-time.component.html',
  styleUrls: ['./prayer-time.component.scss']
})
export class PrayerTimeComponent {

}
