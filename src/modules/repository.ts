import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthRepository } from "src/domain/repositories/auth";
import { UserRepository } from "src/domain/repositories/user";
import { AuthRepositoryImpl } from "src/infrastructure/repositories/auth";
import { AuthEntity } from "src/infrastructure/repositories/auth/entity";
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
        entities: [AuthEntity, UserEntity],
        synchronize: true,
        dropSchema: process.env.NODE_ENV !== "production",
      }),
    }),
    TypeOrmModule.forFeature([AuthEntity, UserEntity]),
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
  ],
  exports: [AuthRepository, UserRepository],
})
export class RepositoryModule {}
