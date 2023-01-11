import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { UpperCasePipe } from "@angular/common";
//Models
import { MenuNode } from "@tap/shared/models";

@Component({
  selector: 'tap-btn-icon-row',
  standalone: true,
  imports: [MatIconModule, UpperCasePipe],
  templateUrl: './btn-icon-row.component.html',
  styleUrls: ['./btn-icon-row.component.scss']
})
export class BtnIconRowComponent {
  @Input() node: MenuNode = new MenuNode();
}
