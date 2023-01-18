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
  selector: 'tap-card-service',
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
  templateUrl: './card-service.component.html',
  styleUrls: ['./card-service.component.scss']
})
export class CardServiceComponent {
  @Input() cards: Array<FeatureCard> = [];
}
