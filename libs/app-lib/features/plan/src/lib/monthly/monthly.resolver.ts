import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {
  MONTH_PARAM_KEY,
  PlanFacadeService,
  YEAR_PARAM_KEY,
} from '@app/app-lib/shared/domain';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MonthlyResolver implements Resolve<null> {
  constructor(private planFacadeService: PlanFacadeService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<null> | Promise<null> | null {
    const params = route.params;
    const year = params[YEAR_PARAM_KEY];
    const month = params[MONTH_PARAM_KEY];
    const dateOfMonth = new Date().getDate();
    const currentDate = new Date(year, month, dateOfMonth);

    this.planFacadeService.fetchMonthlyGoalPeriods(
      currentDate.getMonth(),
      currentDate.getFullYear()
    );

    return null;
  }
}
