/// <reference types="jest" />

import { Component, CUSTOM_ELEMENTS_SCHEMA, NgZone } from '@angular/core';
import { fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';
import { ApolloQueryResult, FetchResult } from '@apollo/client/core';
import {
  byTestId,
  createRoutingFactory,
  mockProvider,
  SpectatorRouting,
  SpyObject,
} from '@ngneat/spectator/jest';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { AppModule } from 'apps/app/src/app/app.module';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { PlanResourceService } from 'libs/app-lib/src/lib/plan/resource/plan-resource.service';
import { Observable, of } from 'rxjs';

import { UserService } from '@app/shared/domain-auth';
import { GoalPeriod, GoalPeriodType } from '@app/shared/domain';

@Component({
  template: `<router-outlet></router-outlet>`,
})
class RoutingComponent {}

describe('MonthlyComponent', () => {
  let spectator: SpectatorRouting<RoutingComponent>;
  let planResourceService: SpyObject<PlanResourceService>;

  const createComponent = createRoutingFactory({
    component: RoutingComponent,
    declareComponent: true,
    stubsEnabled: false,
    imports: [AppModule],
    providers: [
      mockProvider(PlanResourceService, {
        getMonthlyGoalPeriods: () => {
          return of({
            data: {
              goalPeriod: [
                {
                  type: GoalPeriodType.MONTHLY,
                  date: '2021-3',
                  goals: [
                    {
                      id: 'some-goal-1',
                      scheduledDate: '2021-3',
                      type: GoalPeriodType.MONTHLY,
                      name: 'Some monthly goal 1',
                    },
                  ],
                },
              ],
            },
          } as ApolloQueryResult<{
            goalPeriod: GoalPeriod[];
          }>);
        },
        deleteGoal: () => of({ data: {} }) as Observable<FetchResult>,
      }),
      mockProvider(UserService, {
        getCurrentUser: () => of({}),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  const todayDayOfMonth = 30;
  const todayMonth = 3;
  const todayYear = 2021;
  beforeEach(() => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date(todayYear, todayMonth, todayDayOfMonth));

    spectator = createComponent({ detectChanges: false });
    planResourceService = spectator.inject(PlanResourceService);
  });

  afterEach(() => {});

  // it('should highlight current day', async () => {
  //   const ngZone = spectator.inject(NgZone);
  //   await ngZone.run(async () =>
  //     await spectator.router.navigate(['plan', 'monthly', todayYear, todayMonth])
  //   );

  //   expect(
  //     spectator.queryLast(byTestId('day-' + todayDayOfMonth)).className
  //   ).toMatchInlineSnapshot(`"day currentMonth highlightedDay"`);
  // });

  // TODO: breaking when run together because of ionic
  // it('should have monthly goal', fakeAsync(() => {
  //   spectator.router.navigate(['plan', 'monthly', todayYear, todayMonth]);
  //   // akita combineQueries needs a tick to trigger
  //   spectator.tick();
  //   spectator.detectChanges();

  //   expect(spectator.queryAll(byTestId('monthly-goal-period')).length).toBe(1);
  //   expect(spectator.queryAll(byTestId('goal')).length).toBe(1);

  //   flush();
  //   flushMicrotasks();
  // }));

  it('should delete monthly goal on clicking x', fakeAsync(() => {
    spectator.router.navigate(['plan', 'monthly', todayYear, todayMonth]);
    // akita combineQueries needs a tick to trigger
    spectator.tick();
    spectator.detectChanges();

    expect(spectator.queryAll(byTestId('goal')).length).toBe(1);

    expect(spectator.query(byTestId('delete-goal'))).toBeTruthy();
    spectator.click(spectator.query(byTestId('delete-goal')));

    tick();
    spectator.detectChanges();

    expect(spectator.queryAll(byTestId('goal')).length).toBe(0);

    flush();
    flushMicrotasks();
  }));
});
