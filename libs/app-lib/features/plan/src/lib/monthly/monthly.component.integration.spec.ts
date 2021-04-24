import { createHostFactory, SpectatorHost } from '@ngneat/spectator';

import { MonthlyComponent } from './monthly.component';

describe('MonthlyComponent', () => {
  let spectator: SpectatorHost<MonthlyComponent>;
  const createHost = createHostFactory(MonthlyComponent);

  it('should show calendar', () => {
      // TODO: load app
  })

  describe('monthly goal period', () => {
    it('should delete create goal', () => {
      fail();
    });

    it('should auto save retro item', () => {
        fail();
    });

    it('should edit goal', () => {});

    it('should delete goal', () => {});
  });

  describe('daily goal period', () => {
    it('should delete create goal', () => {
      fail();
    });

    it('should auto save retro item', () => {
        fail();
    });

    it('should edit goal', () => {});

    it('should delete goal', () => {});
  });
});
