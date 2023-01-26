import { Inject, Injectable } from "@angular/core";
import { Title, Meta, MetaDefinition } from "@angular/platform-browser";
import {
  SeoMetaTag,
  SeoSocialData,
  ImageAuxData,
} from "@tap/core/models/seo.interface";
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class SeoMetatagService {
  constructor(
    private readonly metaService: Meta,
    private readonly titleService: Title,
    @Inject(DOCUMENT) private readonly document: any
  ) {}
  public setData(data: SeoSocialData): void {
    this.setSection(data.section);
    this.setKeywords(data.keywords);
    this.setTitle(data.title);
    this.setType(data.type);
    this.setDescription(data.description);
    this.setImage(data.image, data.imageAuxData);
    this.setCanonicalUrl(data.url);
    this.setPublished(
      data.published ? data.published : new Date().toDateString()
    );
    this.setModified(data.modified);
    this.setAuthor(data.author);
    // TODO Change Author
    // this.setTwitterSiteCreator(data.author);
    this.setTwitterCard("summary");
    this.setFbAppId("CarRentalVancouver");
  }

  public setKeywords(keywords: string = ""): void {
    keywords =
      "cheap car rental sharing vancouver airport drop  cheapest pick-up match";
    if (Boolean(keywords)) {
      this.metaService.updateTag({ name: "keywords", content: keywords });
    } else {
      this.metaService.removeTag(`name='keywords'`);
    }
  }

  public setSection(section: string = ""): void {
    if (Boolean(section)) {
      this.metaService.updateTag({ name: "article:section", content: section });
    } else {
      this.metaService.removeTag(`name='article:section'`);
    }
  }

  public setTitle(title: string = ""): void {
    this.titleService.setTitle(title);
    if (title && title.length) {
      // this.metaService.updateTag({ property: 'twitter:title', content: title });
      // this.metaService.updateTag({
      //   property: 'twitter:image:alt',
      //   content: title,
      // });
      this.metaService.updateTag({ property: "og:image:alt", content: title });
      this.metaService.updateTag({ property: "og:title", content: title });
      this.metaService.updateTag({ name: "title", content: title });
      this.metaService.updateTag(
        { itemprop: "name", content: title },
        `itemprop='name'`
      );
    } else {
      // this.metaService.removeTag(`property='twitter:title'`);
      // this.metaService.removeTag(`property='twitter:image:alt'`);
      this.metaService.removeTag(`property='og:image:alt'`);
      this.metaService.removeTag(`property='og:title'`);
      this.metaService.removeTag(`name='title'`);
      this.metaService.removeTag(`itemprop='name'`);
    }
  }

  public setType(type?: string): void {
    if (type && type.length) {
      this.metaService.updateTag({ property: "og:type", content: type });
    } else {
      this.metaService.removeTag(`property='og:type'`);
    }
  }

  public setDescription(description?: string): void {
    if (description && description.length) {
      // this.metaService.updateTag({
      //   property: 'twitter:description',
      //   content: description,
      // });
      this.metaService.updateTag({
        property: "og:description",
        content: description,
      });
      this.metaService.updateTag({ name: "description", content: description });
      this.metaService.updateTag(
        { itemprop: "description", content: description },
        `itemprop='description'`
      );
    } else {
      // this.metaService.removeTag(`property='twitter:description'`);
      this.metaService.removeTag(`property='og:description'`);
      this.metaService.removeTag(`name='description'`);
      this.metaService.removeTag(`itemprop='description'`);
    }
  }

  public setImage(image?: string, auxData?: ImageAuxData): void {
    //TODO Remove base url
    const baseURL = "https://cheapcarrentalvancouver.com";
    image = baseURL + image;
    if (image && image.length) {
      this.metaService.updateTag({
        property: "twitter:image",
        content: image,
      });

      this.metaService.updateTag({
        property: "og:image",
        itemprop: "image",
        content: image,
      });

      if (auxData && auxData.height) {
        this.metaService.updateTag({
          property: "og:image:height",
          content: auxData.height.toString(),
        });
      } else {
        this.metaService.removeTag(`property='og:image:height'`);
      }

      if (auxData && auxData.width) {
        this.metaService.updateTag({
          property: "og:image:width",
          content: auxData.width.toString(),
        });
      } else {
        this.metaService.removeTag(`property='og:image:width'`);
      }

      if (auxData && auxData.alt) {
        this.metaService.updateTag({
          property: "og:image:alt",
          content: auxData.alt,
        });
      } else {
        this.metaService.removeTag(`property='og:image:alt'`);
      }

      if (auxData && auxData.mimeType) {
        this.metaService.updateTag({
          property: "og:image:type",
          content: auxData.mimeType,
        });
      } else {
        this.metaService.removeTag(`property='og:image:type'`);
      }

      if (auxData && auxData.secureUrl) {
        this.metaService.updateTag({
          property: "og:image:secure_url",
          content: auxData.secureUrl,
        });
      } else {
        this.metaService.removeTag(`property='og:image:secure_url'`);
      }
    } else {
      this.metaService.removeTag(`property='twitter:image'`);
      this.metaService.removeTag(`property='og:image'`);
      this.metaService.removeTag(`property='og:image:height'`);
      this.metaService.removeTag(`property='og:image:secure_url'`);
      this.metaService.removeTag(`property='og:image:type'`);
      this.metaService.removeTag(`property='og:image:alt'`);
      this.metaService.removeTag(`property='og:image:width'`);
      this.metaService.removeTag(`itemprop='image'`);
    }
  }

  public setUrl(url?: string): void {
    if (url && url.length) {
      this.metaService.updateTag({ property: "og:url", content: url });
      // this.metaService.updateTag({ property: 'twitter:url', content: url });
    } else {
      this.metaService.removeTag(`property='og:url'`);
      // this.metaService.removeTag(`property='twitter:url'`);
    }
  }

  public setPublished(publishedDateString?: string): void {
    if (publishedDateString) {
      const publishedDate = new Date(publishedDateString);
      this.metaService.updateTag({
        property: "article:published_time",
        content: publishedDate.toISOString(),
      });
      this.metaService.updateTag({
        property: "published_date",
        content: publishedDate.toISOString(),
      });
    } else {
      this.metaService.removeTag(`property='article:published_time'`);
      this.metaService.removeTag(`property='publication_date'`);
    }
  }

  public setModified(modifiedDateString?: string): void {
    if (modifiedDateString) {
      const modifiedDate = new Date(modifiedDateString);
      this.metaService.updateTag({
        property: "article:modified_time",
        content: modifiedDate.toISOString(),
      });
      this.metaService.updateTag({
        property: "og:updated_time",
        content: modifiedDate.toISOString(),
      });
    } else {
      this.metaService.removeTag(`property='article:modified_time'`);
      this.metaService.removeTag(`property='og:updated_time'`);
    }
  }

  public setAuthor(author?: string): void {
    if (author && author.length) {
      this.metaService.updateTag({
        property: "article:author",
        content: author,
      });
      this.metaService.updateTag({ property: "author", content: author });
    } else {
      this.metaService.removeTag(`property='article:author'`);
      this.metaService.removeTag(`property='author'`);
    }
  }

  public setTwitterSiteCreator(site: string = ""): void {
    if (Boolean(site)) {
      this.metaService.updateTag({ name: "twitter:site", content: site });
      this.metaService.updateTag({ name: "twitter:creator", content: site });
    } else {
      this.metaService.removeTag(`name='twitter:site'`);
      this.metaService.removeTag(`name='twitter:creator'`);
    }
  }

  public setTwitterCard(card: string = ""): void {
    if (Boolean(card.length)) {
      this.metaService.updateTag({ name: "twitter:card", content: card });
    } else {
      this.metaService.removeTag(`name='twitter:card'`);
    }
  }

  public setFbAppId(appId: string = ""): void {
    if (Boolean(appId)) {
      this.metaService.updateTag({ property: "fb:app_id", content: appId });
    } else {
      this.metaService.removeTag(`property='fb:app_id'`);
    }
  }

  public setMetaTag(metaTag: SeoMetaTag): void {
    if (Boolean(metaTag.value)) {
      const metaTagObject = {
        [metaTag.attr]: metaTag.attrValue,
        content: metaTag.value,
      };
      this.metaService.updateTag(metaTagObject);
    } else {
      const selector = `${metaTag.attr}='${metaTag.attrValue}'`;
      this.metaService.removeTag(selector);
    }
  }

  public setMetaTags(metaTags: SeoMetaTag[]): void {
    for (const metaTag of metaTags) {
      this.setMetaTag(metaTag);
    }
  }

  public setLanguageAlternativeUrl(lang: string, url?: string): void {
    // first remove potential previous url
    const selector = `link[rel='alternate'][hreflang='${lang}']`;
    const languageAlternativeElement =
      this.document.head.querySelector(selector);
    if (languageAlternativeElement) {
      this.document.head.removeChild(languageAlternativeElement);
    }
    const link: HTMLLinkElement = this.document.createElement("link");
    const linkURL = url && url.length ? url : this.document.URL;
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", lang);
    link.setAttribute("href", linkURL);
    this.document.head.appendChild(link);
  }

  public setCanonicalUrl(url?: string): void {
    // first remove potential previous url
    const selector = `link[rel='canonical']`;
    const canonicalElement = this.document.head.querySelector(selector);

    if (canonicalElement) {
      this.document.head.removeChild(canonicalElement);
    }
    const link: HTMLLinkElement = this.document.createElement("link");
    const linkURL = url && url.length ? url : this.document.URL;

    link.setAttribute("rel", "canonical");
    link.setAttribute("href", linkURL);
    this.document.head.appendChild(link);
    this.setUrl(linkURL);
  }
}
