import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthEntity } from "src/declarations/entities/auth";
import { ChatEntity } from "src/declarations/entities/chat";
import { ChatImageEntity } from "src/declarations/entities/chat/image";
import { ChatMessageEntity } from "src/declarations/entities/chat/message";
import { ChatPhotologEntity } from "src/declarations/entities/chat/photolog";
import { ImageEntity } from "src/declarations/entities/image";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { PerformanceEntity } from "src/declarations/entities/performance";
import { RoomEntity } from "src/declarations/entities/room";
import { UserEntity } from "src/declarations/entities/user";
import { FileRepository } from "src/declarations/repositories/file";
import { FileRepositoryImpl } from "src/implementations/repositories/file";

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
          PerformanceEntity,
          ChatEntity,
          ChatMessageEntity,
          ChatImageEntity,
          ChatPhotologEntity,
        ],
        synchronize: true,
        dropSchema: Boolean(process.env.DROP_SCHEME),
      }),
    }),
  ],
  providers: [
    {
      provide: FileRepository,
      useClass: FileRepositoryImpl,
    },
  ],
  exports: [FileRepository],
})
export class RepositoryModule {}
