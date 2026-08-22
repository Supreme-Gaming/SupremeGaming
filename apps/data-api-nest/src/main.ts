import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import morgan from 'morgan';

import { ResponseValidationInterceptor } from '@supremegaming/api/v2';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = process.env.API_GLOBAL_PREFIX || 'api';
  const port = process.env.API_PORT || 3333;

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
