/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppFacadeService } from './app-facade.service';

describe('Service: AppFacade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppFacadeService]
    });
  });

  it('should ...', inject([AppFacadeService], (service: AppFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
