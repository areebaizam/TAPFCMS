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
    CREATE = "create",
    UPDATE = "update",
  }

  //Topic Heading
  export enum eTopicHeading{
    WELCOME = "welcome",
    HELP = "help",
    CONTACT = "contact",
    SERVICES = "services",
    VOLUNTEER = "volunteer",
    DONATION = "donation",
    SUGGESTION = "suggestion",
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

  export class FeatureCard {
    order: number = -1;
    header?: string | '';
    iconClassName?: string | undefined;
    content?: string | '';
    visible?: boolean = true;
  }
  
  export class TopicHeading {
    type?: eTopicHeading | '';
    title?: string | '';
    subtitle?: string | '';
    content?: string | '';
  }
  