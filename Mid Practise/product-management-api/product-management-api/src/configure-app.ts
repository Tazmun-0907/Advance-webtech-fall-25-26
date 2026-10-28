import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureApp(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
      validationError: { target: false, value: false },
    }),
  );
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Tech Shop - Products & Employees')
      .setDescription('Lab Task 1. All ten required CRUD endpoints use a real database.')
      .setVersion('2.0.0')
      .build(),
  );
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: false, docExpansion: 'list' },
  });
}
