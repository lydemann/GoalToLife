import { TestBed, waitForAsync } from '@angular/core/testing';

import { SharedFeatureAuthModule } from './shared-feature-auth.module';

describe('SharedFeatureAuthModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedFeatureAuthModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedFeatureAuthModule).toBeDefined();
  });
});
