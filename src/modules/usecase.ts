import { Global, Module } from "@nestjs/common";
import { DeleteAuthUseCase } from "src/domain/usecases/auth/delete/usecase";
import { RefreshAuthUseCase } from "src/domain/usecases/auth/refresh/usecase";
import { SignOutUseCase } from "src/domain/usecases/auth/sign_out/usecase";
import { VerifyAuthUseCase } from "src/domain/usecases/auth/verify/usecase";
import { UploadImageUseCase } from "src/domain/usecases/image/upload/usecase";
import { CreateParticipantUseCase } from "src/domain/usecases/participant/create/usecase";
import { DeleteParticipantUseCase } from "src/domain/usecases/participant/delete/usecase";
import { CreateRoomUseCase } from "src/domain/usecases/room/create/usecase";
import { FindRoomsUseCase } from "src/domain/usecases/room/find/usecase";
import { FindMyRoomsUsecase } from "src/domain/usecases/room/find_mine/usecase";
import { SignInUseCase } from "src/domain/usecases/auth/sign_in/usecase";
import { SignUpUseCase } from "src/domain/usecases/auth/sign_up/usecase";
import { FindMeUseCase } from "src/domain/usecases/user/find_me/usecase";
import { UpdateMeUseCase } from "src/domain/usecases/user/update_me/usecase";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthEntity } from "src/domain/entities/auth";
import { UserEntity } from "src/domain/entities/user";
import { ImageEntity } from "src/domain/entities/image";
import { RoomEntity } from "src/domain/entities/room";
import { ParticipantEntity } from "src/domain/entities/participant";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthEntity,
      UserEntity,
      ImageEntity,
      RoomEntity,
      ParticipantEntity,
    ]),
  ],
  providers: [
    VerifyAuthUseCase,
    DeleteAuthUseCase,
    RefreshAuthUseCase,
    SignInUseCase,
    SignUpUseCase,
    SignOutUseCase,
    // Auth Module
    FindMeUseCase,
    UpdateMeUseCase,
    // User Module
    FindRoomsUseCase,
    FindMyRoomsUsecase,
    CreateRoomUseCase,
    // Room Module
    CreateParticipantUseCase,
    DeleteParticipantUseCase,
    // Participant Module
    UploadImageUseCase,
    // Image Module
  ],
  exports: [
    VerifyAuthUseCase,
    DeleteAuthUseCase,
    RefreshAuthUseCase,
    SignInUseCase,
    SignUpUseCase,
    SignOutUseCase,
    // Auth Module
    FindMeUseCase,
    UpdateMeUseCase,
    // User Module
    FindRoomsUseCase,
    FindMyRoomsUsecase,
    CreateRoomUseCase,
    // Room Module
    CreateParticipantUseCase,
    DeleteParticipantUseCase,
    // Participant Module
    UploadImageUseCase,
    // Image Module
  ],
})
export class UseCaseModule {}
