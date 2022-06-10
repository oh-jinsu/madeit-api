import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ControllerModule } from "./controller";
import { ProviderModule } from "./provider";
import { RepositoryModule } from "./repository";
import { SourceModule } from "./source";
import { UseCaseModule } from "./usecase";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot(),
    SourceModule,
    RepositoryModule,
    ProviderModule,
    UseCaseModule,
    ControllerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
