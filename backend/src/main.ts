import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './shared/modules/config/service/app-config-service';
import { AllExceptionsFilter } from './shared/core/ExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false
  });

  app.enableCors({
    origin: '*',
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
    // allowedHeaders: [],
  });

  const adapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(adapter));

  const configService = app.get(AppConfigService);
  await app.listen(configService.app.port);

  console.log(`App run in port ${configService.app.port}`);

}

bootstrap();
