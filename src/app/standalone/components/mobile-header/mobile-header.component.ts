import { Component } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgFor } from "@angular/common";

//Models and Enums
import { MenuNode, eNodeCategory } from "@tap/shared/models";

//Pipes
import { FilterBooleanPipe, FilterStringPipe } from "@tap/standalone/pipes";

//Data
import { headerMobileData } from "@tap/shared/models/app.data";

//Components
import { BtnIconColComponent } from "@tap/standalone/components/btn-icon-col/btn-icon-col.component";

//Services
import { CoreService } from '@tap/shared/services/';

@Component({
  selector: "tap-mobile-header",
  standalone: true,
  imports: [
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    NgFor,
    FilterBooleanPipe,
    FilterStringPipe,
    BtnIconColComponent,
  ],
  templateUrl: "./mobile-header.component.html",
  styleUrls: ["./mobile-header.component.scss"],
})
export class MobileHeaderComponent {
  nodes: Array<MenuNode> = headerMobileData;
  eNodeCategory = eNodeCategory;
  constructor(private coreService: CoreService) {}
  
  handleBtnClick(node: MenuNode) {
    this.coreService.handleNodeEvents(node);
  }
}
