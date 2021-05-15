import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Resolve,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RedirectToCurrentMonthResolver implements Resolve<boolean> {
  /**
   *
   */
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}
  resolve(route: ActivatedRouteSnapshot): Promise<boolean> {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    return this.router.navigate(['plan', 'monthly', year, month]);
  }
}
