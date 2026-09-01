import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import morgan from 'morgan';

import { ResponseValidationInterceptor } from '@supremegaming/api/v2';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

/** ASA tribe logs routinely exceed Express's default 100kb JSON limit. */
const JSON_BODY_LIMIT = '25mb';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  const globalPrefix = process.env.API_GLOBAL_PREFIX || 'api';
  const port = process.env.API_PORT || 3333;

  app.useBodyParser('json', { limit: JSON_BODY_LIMIT });
  app.useBodyParser('urlencoded', { extended: true, limit: JSON_BODY_LIMIT });
  app.use(morgan('combined'));
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      disableErrorMessages: environment.production,
    })
  );
  app.useGlobalInterceptors(
    new ResponseValidationInterceptor(app.get(Reflector), { hideErrorDetails: environment.production })
  );

  // TODO: Might wanna tighten this up a bit
  app.enableCors({
    origin: '*',
  });

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
