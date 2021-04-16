/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlanStateService } from './plan-state.service';

describe('Service: PlanState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanStateService]
    });
  });

  it('should ...', inject([PlanStateService], (service: PlanStateService) => {
    expect(service).toBeTruthy();
  }));
});
