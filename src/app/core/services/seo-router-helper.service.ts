import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { SeoMetatagService } from './seo-metatag.service';

@Injectable({
  providedIn: 'root'
})
export class SeoRouterHelperService {

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly seoMetaService: SeoMetatagService
  ) {
    this.setupRouting();
  }
  
  private setupRouting() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary')
      )
      .subscribe((route: ActivatedRoute) => {
        const seoData = route.snapshot.data['seo'];
        // set your meta tags & title here
        // this.seoService.updateTitle(seoData['title']);
        // this.seoService.updateMetaTags(seoData['metaTags']);
        if (seoData) this.seoMetaService.setData(seoData);
      });
    }
}
