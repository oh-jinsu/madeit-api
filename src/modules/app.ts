import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthEntity } from "src/domain/entities/auth";
import { ImageEntity } from "src/domain/entities/image";
import { ParticipantEntity } from "src/domain/entities/participant";
import { RoomEntity } from "src/domain/entities/room";
import { UserEntity } from "src/domain/entities/user";
import { ControllerModule } from "./controller";
import { ProviderModule } from "./provider";
import { RepositoryModule } from "./repository";
import { UseCaseModule } from "./usecase";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "mysql",
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        entities: [
          AuthEntity,
          UserEntity,
          ImageEntity,
          RoomEntity,
          ParticipantEntity,
        ],
        synchronize: true,
        dropSchema: process.env.NODE_ENV !== "production",
      }),
    }),
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot(),
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
