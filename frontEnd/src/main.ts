import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import './assets/js/bs-init.js' ;
import './assets/bootstrap/js/bootstrap.min.js' ;
//import './assets/js/Sidebar-Menu-sidebar.js'
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
