import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  /*
    con esta línea de código a continuacion eliminamos los console.log en producción
  */
  window.console.log = () => {};
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
