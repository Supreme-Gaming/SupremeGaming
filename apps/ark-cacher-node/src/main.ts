import { manager } from '@supremegaming/utilities/database';
import { ArkCacherApp } from './app/app';

import { ormconfig } from './environments/environment';

console.log('Starting ark caching service')

async function bootstrap(){
  await manager(ormconfig);

  new ArkCacherApp().start();
}

bootstrap();