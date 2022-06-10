import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ErrorFilter } from "./adapter/filters/error";
import { ErrorFilterForDev } from "./adapter/filters/error_dev";
import { HttpExceptionFilter } from "./adapter/filters/http";
import { ThrottlerExceptionFilter } from "./adapter/filters/throttler";
import { AppModule } from "./modules/app";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    process.env.NODE_ENV === "production"
      ? new ErrorFilter()
      : new ErrorFilterForDev(),
    new HttpExceptionFilter(),
    new ThrottlerExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.setGlobalPrefix(process.env.VERSION);

  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(process.env.PORT);
}

bootstrap();
