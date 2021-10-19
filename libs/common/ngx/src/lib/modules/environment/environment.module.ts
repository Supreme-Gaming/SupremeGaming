import { ModuleWithProviders, NgModule } from '@angular/core';

import { EnvironmentService, ENVIRONMENT } from './environment.service';

@NgModule({})
export class EnvironmentModule {
  public static forRoot(environment): ModuleWithProviders<EnvironmentModule> {
    return {
      ngModule: EnvironmentModule,
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: environment,
        },
        EnvironmentService,
      ],
    };
  }
}
