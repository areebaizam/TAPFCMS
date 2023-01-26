export enum SeoMetaTagAttr {
    name = 'name',
    property = 'property'
  }
  
  export interface SeoMetaTag {
    attr: SeoMetaTagAttr;
    attrValue: string;
    value: string;
  }
  
  export interface SeoSocialData {
    title?: string;
    keywords?: string;
    description?: string;
    image?: string;
    imageAuxData?: ImageAuxData;
    url?: string;
    type?: string;
    author?: string;
    section?: string;
    published?: string;
    modified?: string;
  }
  
  export interface ImageAuxData {
    width?: number;
    height?: number;
    secureUrl?: string;
    mimeType?: string;
    alt?: string;
  }
  