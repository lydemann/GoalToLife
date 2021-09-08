import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Goal } from '@app/shared/domain';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GoalsResolver implements Resolve<void> {
  resolve(route: ActivatedRouteSnapshot): void {
    return;
  }
}
