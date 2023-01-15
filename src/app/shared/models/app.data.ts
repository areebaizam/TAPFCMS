import { eRouteURL, eNodeType, eNodeCategory, MenuNode, FeatureCard, TopicHeading, eTopicHeading } from "./common.model";

export const headerData = [
  {
    order: 1,
    type: eNodeType.ROUTE,
    iconClass: "volunteer_activism",
    name: "donate",
    url: eRouteURL.DONATE,
    category: eNodeCategory.NAV,
    visible: true,
  },
  {
    order: 2,
    type: eNodeType.ROUTE,
    iconClass: "alarm",
    name: "prayers",
    url: eRouteURL.PRAYER,
    category: eNodeCategory.NAV,
    visible: true,
  },
  {
    order: 3,
    type: eNodeType.ROUTE,
    iconClass: "perm_phone_msg",
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
    name: "F M C S",
    url: eRouteURL.HOME,
    category: eNodeCategory.BRAND,
    visible: true,
  },
] as Array<MenuNode>;

export const headerMobileData = [
  {
    order: 1,
    type: eNodeType.ROUTE,
    iconClass: "mosque",
    name: "home",
    url: eRouteURL.HOME,
    category: eNodeCategory.NAV,
    visible: true,
  },
  {
    order: 2,
    type: eNodeType.ROUTE,
    iconClass: "volunteer_activism",
    name: "donate",
    url: eRouteURL.DONATE,
    category: eNodeCategory.NAV,
    visible: true,
  },
  {
    order: 3,
    type: eNodeType.ROUTE,
    iconClass: "alarm",
    name: "prayers",
    url: eRouteURL.PRAYER,
    category: eNodeCategory.NAV,
    visible: true,
  },
  {
    order: 4,
    type: eNodeType.EVENT,
    iconClass: "menu",
    name: "menu",
    category: eNodeCategory.MENU,
    visible: true,
  },
] as Array<MenuNode>;

export const topicList = [
  {
    type: eTopicHeading.WELCOME,
    title: "Welcome to the",
    subtitle: "Fraserview Muslim Community Services",
    content:
      "The Fraserview Musallah is not just a mosque for prayers rather it is a community center for all. The Center is committed to preserving an Islamic identity, building and supporting a viable Muslim community, promoting a comprehensive Islamic way of life based on the Holy Quran and the Sunnah of Prophet Muhammad ﷺ.",
  },
  {
    type: eTopicHeading.HELP,
    title: "Help Us",
    subtitle: "We Need Your Support",
    content: "",
  },
  {
    type: eTopicHeading.SERVICES,
    title: "Our Services",
    subtitle: "Serving Community",
    content: "",
  },
  {
    type: eTopicHeading.CONTACT,
    title: "Contact Us",
    subtitle: "Get in Touch",
    content: "If you have any query, comment, suggestion or complaint, or would like to enroll for volunteering, please use the following information or submit the form to contact us.",
  },
  {
    type: eTopicHeading.VOLUNTEER,
    title: "Wish to Volunteer",
    subtitle: "Write to Us",
    content: "",
  },
  {
    type: eTopicHeading.SUGGESTION,
    title: "Your suggestions are welcome...",
    subtitle: "Reach out to Us",
    content:
      "If you have any query, comment, suggestion or complaint, or would like to enroll for volunteering, please use the following information or submit the form to contact us.",
  },
  {
    type: eTopicHeading.DONATION,
    title: "Make a Donation",
    subtitle: "We need your Support",
    content: "",
  },
] as Array<TopicHeading>;
