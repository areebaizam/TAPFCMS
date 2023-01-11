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
    switch (node.name) {
      case 'menu':
        this.menuBtnClicked$.next(node.name);
        break;
      default:
        this.menuBtnClicked$.next(node.name);
        break;
    }
  }
}
