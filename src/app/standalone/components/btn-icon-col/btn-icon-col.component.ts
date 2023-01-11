import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { UpperCasePipe } from "@angular/common";
//Models
import { MenuNode } from "@tap/shared/models";

@Component({
  selector: "tap-btn-icon-col",
  standalone: true,
  imports: [MatIconModule, UpperCasePipe],
  templateUrl: "./btn-icon-col.component.html",
  styleUrls: ["./btn-icon-col.component.scss"],
})
export class BtnIconColComponent {
  @Input() node: MenuNode = new MenuNode();
}
