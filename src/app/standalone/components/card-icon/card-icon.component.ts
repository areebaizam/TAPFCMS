import { Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "tap-card-icon",
  standalone: true,
  imports: [MatCardModule,MatIconModule],
  templateUrl: "./card-icon.component.html",
  styleUrls: ["./card-icon.component.scss"],
})
export class CardIconComponent {}
