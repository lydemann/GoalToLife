/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlanFacadeService } from './plan-facade.service';

describe('Service: PlanFacade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanFacadeService]
    });
  });

  it('should ...', inject([PlanFacadeService], (service: PlanFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
