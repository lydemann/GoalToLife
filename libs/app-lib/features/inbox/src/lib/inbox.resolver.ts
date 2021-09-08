import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { InboxFacadeService } from '@app/app-lib/shared/domain';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InboxResolver implements Resolve<null> {
  constructor(private inboxFacadeService: InboxFacadeService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<null> | Promise<null> | null {
    this.inboxFacadeService.fetchInboxGoals();
    return null;
  }
}
