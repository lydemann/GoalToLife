import { TestBed, inject } from '@angular/core/testing';

import { TODOService } from './todo.service';

describe('TODOService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TODOService]
    });
  });

  it('should be created', inject([TODOService], (service: TODOService) => {
    expect(service).toBeTruthy();
  }));
});
