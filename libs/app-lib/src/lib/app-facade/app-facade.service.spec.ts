import { Task } from '@app/shared/interfaces';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { first } from 'rxjs/operators';
import { AppFacadeService } from './app-facade.service';

describe('AppFacadeService', () => {
  let spectator: SpectatorService<AppFacadeService>;
  const createService = createServiceFactory({
    service: AppFacadeService,
    mocks: [],
  });

  beforeEach(() => (spectator = createService()));

  describe('delete', () => {
    it('should delete task', (done) => {
      const initialTasks = [
        {
          id: '1',
          name: 'Do laundry',
          categories: [],
        } as Task,
        {
          id: '2',
          name: 'Buy milk',
          categories: ['groceries'],
        } as Task,
        {
          id: '3',
          name: 'Run 10k',
          categories: ['fitness'],
        } as Task,
      ];

      spectator.service.deleteTask(initialTasks[1]);

      spectator.service.tasks$.pipe(first()).subscribe((tasks) => {
        expect(tasks).toEqual([
          {
            id: '1',
            name: 'Do laundry',
            categories: [],
          } as Task,
          {
            id: '3',
            name: 'Run 10k',
            categories: ['fitness'],
          } as Task,
        ]);

        done();
      });
    });
  });
});
