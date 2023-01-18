import { Component, Input } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { UpperCasePipe } from "@angular/common";
import { FeatureCard } from "@tap/shared/models";
//Pipes
import { FilterBooleanPipe, FilterStringPipe } from "@tap/standalone/pipes";

@Component({
  selector: "tap-card-support",
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    UpperCasePipe,
    FilterBooleanPipe,
  ],
  templateUrl: "./card-support.component.html",
  styleUrls: ["./card-support.component.scss"],
})
export class CardSupportComponent {
  @Input() cards: Array<FeatureCard> = [];
}
