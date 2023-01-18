import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { MenuNode } from '@tap/shared/models';
@Injectable({
  providedIn: 'root'
})
export class CoreService {

  public menuBtnClicked$ = new Subject();

  constructor() {}

  handleNodeEvents(node: MenuNode) {
    switch (node.iconLabel) {
      case 'menu':
        this.menuBtnClicked$.next(node.iconLabel);
        break;
      default:
        this.menuBtnClicked$.next(node.iconLabel);
        break;
    }
  }
}
