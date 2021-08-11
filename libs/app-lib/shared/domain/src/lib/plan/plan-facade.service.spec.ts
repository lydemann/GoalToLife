import { promises } from 'dns';
import { fakeAsync, tick } from '@angular/core/testing';
import { ApolloQueryResult, FetchResult } from '@apollo/client/core';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';

import { Goal, GoalPeriod } from '@app/shared/domain';
import { PlanFacadeService } from './plan-facade.service';
import { MONTH_PARAM_KEY, YEAR_PARAM_KEY } from './plan.constants';
import { PlanResourceService } from './resource/plan-resource.service';
import { GoalPeriodsStore } from './state/goal-periods/goal-periods.store';
import { GoalsStore } from './state/goals/goals.store';

describe('PlanFacadeService', () => {
  let spectator: SpectatorService<PlanFacadeService>;
  let planResourceService: SpyObject<PlanResourceService>;
  let routerQuery: SpyObject<RouterQuery>;
  const createService = createServiceFactory({
    service: PlanFacadeService,
    providers: [
      mockProvider(RouterQuery, {
        selectParams: jest.fn((key) => {
          if (YEAR_PARAM_KEY === key) {
            return of('2021');
          }

          if (MONTH_PARAM_KEY === key) {
            return of('4');
          }

          return of('4');
        }),
      }),
    ],
    mocks: [PlanResourceService],
  });

  beforeEach(() => {
    spectator = createService();
    planResourceService = spectator.inject(PlanResourceService) as any;
    routerQuery = spectator.inject(RouterQuery) as SpyObject<RouterQuery>;
  });

  describe('currentMonthGoalPeriod$', () => {
    it('should get current month goal period', fakeAsync(() => {
      const goalPeriodResponse = {
        data: {
          goalPeriod: [
            {
              date: '2021/4',
              goals: [],
            },
          ],
        },
      } as ApolloQueryResult<{ goalPeriod: GoalPeriod[] }>;
      planResourceService.getMonthlyGoalPeriods.andReturn(
        of(goalPeriodResponse)
      );

      const month = 4;
      const year = 2021;
      spectator.service.fetchMonthlyGoalPeriods(month, year);

      spectator.service.currentMonthGoalPeriod$
        .pipe(first())
        .subscribe((currentMonthGoalPeriod) => {
          expect(currentMonthGoalPeriod).toMatchInlineSnapshot(`
            Object {
              "date": "2021-4",
              "goals": Array [],
              "type": "MONTHLY",
            }
          `);
        });

      tick();
    }));
  });

  describe('fetchMonthlyGoalPeriods', () => {
    it('should fetch monthly goal periods', () => {
      const goalPeriodResponse = {
        data: {
          goalPeriod: [
            {
              date: '2021/4',
              goals: [],
            },
          ],
        },
      } as ApolloQueryResult<{ goalPeriod: GoalPeriod[] }>;
      planResourceService.getMonthlyGoalPeriods.andReturn(
        of(goalPeriodResponse)
      );

      const month = 4;
      const year = 2021;
      spectator.service.fetchMonthlyGoalPeriods(month, year);

      expect(spectator.inject(GoalPeriodsStore).getValue())
        .toMatchInlineSnapshot(`
        Object {
          "entities": Object {
            "2021/4": Object {
              "date": "2021/4",
              "goals": Array [],
            },
          },
          "error": null,
          "ids": Array [
            "2021/4",
          ],
          "loading": false,
        }
      `);
    });
  });

  describe('addGoal', () => {
    it('should add goal', () => {
      const goal = {
        id: '1234',
        scheduledDate: '2021-5-5',
      } as Goal;
      planResourceService.addGoal.andReturn(
        of({
          data: {
            addGoal: goal,
          },
        }) as Observable<
          FetchResult<{
            addGoal: Goal;
          }>
        >
      );

      spectator.service.addGoal(goal);

      expect(spectator.inject(GoalPeriodsStore).getValue().entities)
        .toMatchInlineSnapshot(`
        Object {
          "2021-5-5": Object {
            "date": "2021-5-5",
            "goals": Array [
              "1234",
            ],
            "type": undefined,
          },
        }
      `);
      expect(spectator.inject(GoalsStore).getValue().entities)
        .toMatchInlineSnapshot(`
        Object {
          "1234": Object {
            "id": "1234",
            "scheduledDate": "2021-5-5",
          },
        }
      `);
    });
  });
});
