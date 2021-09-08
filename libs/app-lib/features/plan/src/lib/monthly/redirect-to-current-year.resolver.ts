import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Resolve,
  Router,
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RedirectToCurrentYearResolver implements Resolve<boolean> {
  /**
   *
   */
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}
  resolve(route: ActivatedRouteSnapshot): Promise<boolean> {
    const date = new Date();
    const year = date.getFullYear();
    return this.router.navigate(['plan', 'yearly', year]);
  }
}
