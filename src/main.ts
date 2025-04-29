import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // https://docs.nestjs.com/security/helmet
  app.use(helmet());

  // https://docs.nestjs.com/faq/global-prefix
  app.setGlobalPrefix('api/v1');

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('NestJS Starter Kit 🚀 API Documentation')
    .setDescription(
      '🏹👑 A starter kit for NestJS with Prisma, Passport, Zod, Swagger, and more. Built to be a solid foundation for YOUR next project 👑🏹.',
    )
    .setVersion('0.1')
    .addServer('http://localhost:3000/', 'Local environment')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const theme = new SwaggerTheme();

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      defaultModelsExpandDepth: -1,
      docExpansion: 'none',
      filter: true,
    },
    customCss: theme.getBuffer(SwaggerThemeNameEnum.NORD_DARK),
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
