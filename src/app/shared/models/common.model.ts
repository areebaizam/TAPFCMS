export enum eMatElevation {
    DEFAULT_ELEVATION = 2,
    RAISED_ELEVATION = 8,
  }
  
  export enum eNodeType {
    EVENT = 0,
    ROUTE = 1,
  }
  
  export enum eNodeCategory {
    NAV= 'nav',
    MENU = 'menu',
    BRAND = 'brand',
  }
  
  //Routes
  export enum eRouteURL {
    BASE = "",
    HOME = "",
    CONTACT = "contact",
    ADMIN = "admin",
    PRAYER = "prayer",    
    DONATE = "donate",
  }
  
  export enum eRouteActionURL {
    create = "create",
    update = "update",
  }
  
  // * Menu Node
  export class MenuNode {
    id: number = 0;
    parentId?: number = 0;
    order: number = -1;
    type: eNodeType = eNodeType.ROUTE; //ENUM
    category?: eNodeCategory = eNodeCategory.NAV; //ENUM
    iconClass?: string | undefined;
    name?: string | "";
    description?: string | "";
    content?: string | "";
    url?: string | undefined;
    visible?: boolean = true;
    children?: MenuNode[] | undefined;
  }
  