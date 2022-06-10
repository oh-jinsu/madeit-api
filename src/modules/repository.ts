import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthRepository } from "src/domain/repositories/auth";
import { ImageRepository } from "src/domain/repositories/image";
import { ParticipantRepository } from "src/domain/repositories/participant";
import { RoomRepository } from "src/domain/repositories/room";
import { UserRepository } from "src/domain/repositories/user";
import { AuthRepositoryImpl } from "src/infrastructure/repositories/auth";
import { AuthEntity } from "src/infrastructure/repositories/auth/entity";
import { ImageRepositoryImpl } from "src/infrastructure/repositories/image";
import { ImageEntity } from "src/infrastructure/repositories/image/entity";
import { ParticipantRepositoryImpl } from "src/infrastructure/repositories/participant";
import { ParticipantEntity } from "src/infrastructure/repositories/participant/entity";
import { RoomRepositoryImpl } from "src/infrastructure/repositories/room";
import { RoomEntity } from "src/infrastructure/repositories/room/entity";
import { UserRepositoryImpl } from "src/infrastructure/repositories/user";
import { UserEntity } from "src/infrastructure/repositories/user/entity";

@Global()
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
    TypeOrmModule.forFeature([
      AuthEntity,
      UserEntity,
      ImageEntity,
      RoomEntity,
      ParticipantEntity,
    ]),
  ],
  providers: [
    {
      provide: AuthRepository,
      useClass: AuthRepositoryImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: RoomRepository,
      useClass: RoomRepositoryImpl,
    },
    {
      provide: ParticipantRepository,
      useClass: ParticipantRepositoryImpl,
    },
    {
      provide: ImageRepository,
      useClass: ImageRepositoryImpl,
    },
  ],
  exports: [
    AuthRepository,
    UserRepository,
    ImageRepository,
    RoomRepository,
    ParticipantRepository,
  ],
})
export class RepositoryModule {}
