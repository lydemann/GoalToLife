import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { persistState } from '@datorama/akita';
import { debounceTime } from 'rxjs/operators';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const storage = persistState({
  preStorageUpdateOperator: () => debounceTime(2000),
});

// const providers = [{ provide: 'persistStorage', useValue: storage }];

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // eslint-disable-next-line no-console
  .catch((err) => console.log(err));
