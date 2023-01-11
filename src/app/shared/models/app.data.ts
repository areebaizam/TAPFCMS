import { eRouteURL, eNodeType, eNodeCategory, MenuNode } from "./common.model";

export const headerData = [
  {
    order: 1,
    type: eNodeType.ROUTE,
    iconClass: "mosque",
    name: "home",
    url: eRouteURL.HOME,  
    category: eNodeCategory.NAV,  
    visible: false,   
  },
  {
    order: 2,
    type: eNodeType.ROUTE,
    iconClass: "alarm",
    name: "prayer",
    url: eRouteURL.PRAYER,  
    category: eNodeCategory.NAV,    
    visible: true,   
  },
  {
    order: 3,
    type: eNodeType.ROUTE,
    iconClass: "call",
    name: "contact",
    url: eRouteURL.CONTACT,  
    category: eNodeCategory.NAV,    
    visible: true,   
  },
  {
    order: 4,
    type: eNodeType.ROUTE,
    iconClass: "group",
    name: "admin",
    url: eRouteURL.ADMIN, 
    category: eNodeCategory.NAV,    
    visible: false,   
  },
  {
    order: 5,
    type: eNodeType.EVENT,
    iconClass: "menu",
    name: "menu",
    category: eNodeCategory.MENU,    
    visible: true,   
  },
  {
    order: 5,
    type: eNodeType.ROUTE,
    iconClass: "mosque",
    name: "The Aleph Lab",
    url: eRouteURL.HOME,
    category: eNodeCategory.BRAND,   
    visible: true,   
  },
] as Array<MenuNode>;

export const headerMobileData = [
  {
    order: 1,
    type: eNodeType.ROUTE,
    iconClass: "home",
    name: "home",
    url: eRouteURL.HOME,    
    visible: true,   
  },
  {
    order: 2,
    type: eNodeType.ROUTE,
    iconClass: "call",
    name: "contact",
    url: eRouteURL.CONTACT,    
    visible: true,   
  },
  {
    order: 3,
    type: eNodeType.EVENT,
    iconClass: "menu",
    name:"menu",
    visible: true,   
  },
] as Array<MenuNode>;
