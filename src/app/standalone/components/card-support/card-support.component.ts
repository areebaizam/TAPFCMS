import { Component } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'tap-card-support',
  standalone: true,
  imports: [MatButtonModule,MatIconModule],
  templateUrl: './card-support.component.html',
  styleUrls: ['./card-support.component.scss']
})
export class CardSupportComponent {

}
