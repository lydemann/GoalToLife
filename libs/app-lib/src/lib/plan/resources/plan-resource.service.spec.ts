/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlanResourceService } from './plan-resource.service';

describe('Service: PlanResource', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanResourceService]
    });
  });

  it('should ...', inject([PlanResourceService], (service: PlanResourceService) => {
    expect(service).toBeTruthy();
  }));
});
