/// <reference types="jest" />

import { ApolloQueryResult } from '@apollo/client/core';
import { MONTH_PARAM_KEY, YEAR_PARAM_KEY } from '@app/app-lib';
import { SharedModule } from '@app/app-lib/shared/ui';
import { GoalPeriod } from '@app/shared/interfaces';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { PlanResourceService } from 'libs/app-lib/src/lib/plan/resource/plan-resource.service';
import { of } from 'rxjs';

import { MonthlyComponent } from './monthly.component';
import { MonthlyModule } from './monthly.module';

async function setupComponent(
  spectator: SpectatorRouting<MonthlyComponent>,
  createComponent
) {
  spectator = createComponent({
    detectChanges: false,
    params: {
      [YEAR_PARAM_KEY]: '2021',
      [MONTH_PARAM_KEY]: '3',
    },
  });
  const planResourceService = spectator.inject(PlanResourceService);
  planResourceService.getMonthlyGoalPeriods.andReturn(
    of({ data: { goalPeriod: [] } } as ApolloQueryResult<{
      goalPeriod: GoalPeriod[];
    }>)
  );

  spectator.detectChanges();

  await spectator.fixture.whenStable();
  return spectator;
}

describe('MonthlyComponent', () => {
  let spectator: SpectatorRouting<MonthlyComponent>;
  const createComponent = createRoutingFactory({
    params: {},
    stubsEnabled: false,
    routes: [
      {
        path: 'plan/monthly',
        children: [
          {
            path: ':year/:month',
            component: MonthlyComponent,
          },
        ],
      },
    ],
    imports: [MonthlyModule, SharedModule],
    providers: [
      // { provide: ElementRef, useClass: MockElementRef }
    ],
    mocks: [PlanResourceService],
    declareComponent: false,
    component: MonthlyComponent,
  });

  beforeEach(() => {
    const date = new Date(2021, 3, 24);
    jest.useFakeTimers('modern').setSystemTime(date);
  });

  it('should show calendar', async () => {
    spectator = await setupComponent(spectator, createComponent);

    expect(spectator.element).toMatchSnapshot();
  });

  describe('monthly goal period', () => {
    it('should create goal', () => {});

    it('should auto save retro item', () => {});

    it('should edit goal', () => {});

    it('should delete goal', () => {});
  });

  describe('daily goal period', () => {
    it('should delete create goal', () => {});

    it('should auto save retro item', () => {});

    it('should edit goal', () => {});

    it('should delete goal', () => {});
  });
});
