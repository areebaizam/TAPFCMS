import { Component } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgFor } from "@angular/common";

//Components
import { BtnIconRowComponent } from "@tap/standalone/components/btn-icon-row/btn-icon-row.component";
//Pipes
import { FilterBooleanPipe, FilterStringPipe } from "@tap/standalone/pipes";
//Models and enums
import { MenuNode, eNodeCategory } from "@tap/shared/models";
//Data
import { headerData } from "@tap/shared/models/app.data";
//Services
import { CoreService } from "@tap/shared/services/";

@Component({
  selector: "tap-main-header",
  standalone: true,
  imports: [
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    NgFor,
    FilterBooleanPipe,
    FilterStringPipe,
    BtnIconRowComponent,
  ],
  templateUrl: "./main-header.component.html",
  styleUrls: ["./main-header.component.scss"],
})
export class MainHeaderComponent {
  nodes: Array<MenuNode> = headerData;
  eNodeCategory = eNodeCategory;

  constructor(private coreService: CoreService) {
  }

  handleBtnClick(node: MenuNode) {
    this.coreService.handleNodeEvents(node);
  }
}
