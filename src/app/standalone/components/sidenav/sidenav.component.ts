//Angular
import { Component, OnInit } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { NgIf, NgFor } from "@angular/common";
import { throttleTime } from "rxjs/internal/operators/throttleTime";
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from "@angular/cdk/layout";

//Material
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTabsModule } from "@angular/material/tabs";
//Components
import {
  MainHeaderComponent,
  MobileHeaderComponent,
  BtnIconRowComponent,
} from "@tap/standalone/components/";
//Pipes
import { FilterBooleanPipe, FilterStringPipe } from "@tap/standalone/pipes";
//Services
import { CoreService } from "@tap/shared/services/";
//SEO Router Service 
import { SeoRouterHelperService } from "@tap/core/services";
//Models and Enums
import { MenuNode, eNodeCategory } from "@tap/shared/models";
//Data
import { headerData } from "@tap/shared/models/app.data";
@Component({
  selector: "tap-sidenav",
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf,
    NgFor,
    MatSidenavModule,
    MatTabsModule,
    FilterBooleanPipe,
    FilterStringPipe,
    MainHeaderComponent,
    MobileHeaderComponent,
    BtnIconRowComponent,
  ],
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
})
export class SidenavComponent implements OnInit {
  title = "TAPBase";
  isSideNavOpen: boolean = false;
  isPortraitViewPort: boolean = false;
  eNodeCategory = eNodeCategory;
  nodes: Array<MenuNode> = headerData;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private coreService: CoreService,
    private seoRouterHelperService: SeoRouterHelperService
  ) {}

  async ngOnInit(): Promise<void> {
    //*Intiate Listeners
    this.initListeners();
  }

  initListeners() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        if (state.matches) this.isPortraitViewPort = false;
        else this.isPortraitViewPort = true;
      });
    this.sideBarMenuToggleListener();
  }

  handleBtnClick(node: MenuNode) {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  private sideBarMenuToggleListener() {
    this.coreService.menuBtnClicked$
      .pipe(throttleTime(400))
      .subscribe((next) => {
        if (next === "menu") this.isSideNavOpen = !this.isSideNavOpen;
        else this.isSideNavOpen = false;
      });
  }
}
