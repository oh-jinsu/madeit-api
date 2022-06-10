import { Global, Module } from "@nestjs/common";
import { DeleteAuthUseCase } from "src/domain/usecases/auth/delete/usecase";
import { RefreshAuthUseCase } from "src/domain/usecases/auth/refresh/usecase";
import { SignInWithAppleUseCase } from "src/domain/usecases/auth/sign_in_with_apple/usecase";
import { SignInWithGoogleUseCase } from "src/domain/usecases/auth/sign_in_with_google/usecase";
import { SignOutUseCase } from "src/domain/usecases/auth/sign_out/usecase";
import { SignUpWithAppleUseCase } from "src/domain/usecases/auth/sign_up_with_apple/usecase";
import { SignUpWithGoogleUseCase } from "src/domain/usecases/auth/sign_up_with_google/usecase";
import { VerifyAuthUseCase } from "src/domain/usecases/auth/verify/usecase";
import { UploadImageUseCase } from "src/domain/usecases/image/upload/usecase";
import { CreateParticipantUseCase } from "src/domain/usecases/participant/create/usecase";
import { DeleteParticipantUseCase } from "src/domain/usecases/participant/delete/usecase";
import { CreateRoomUseCase } from "src/domain/usecases/room/create/usecase";
import { FindRoomsUseCase } from "src/domain/usecases/room/find/usecase";
import { CreateMeUseCase } from "src/domain/usecases/user/create_me/usecase";
import { FindMeUseCase } from "src/domain/usecases/user/find_me/usecase";
import { UpdateMeUseCase } from "src/domain/usecases/user/update_me/usecase";

@Global()
@Module({
  providers: [
    VerifyAuthUseCase,
    DeleteAuthUseCase,
    RefreshAuthUseCase,
    SignInWithGoogleUseCase,
    SignInWithAppleUseCase,
    SignUpWithGoogleUseCase,
    SignUpWithAppleUseCase,
    SignOutUseCase,
    // Auth Module
    CreateMeUseCase,
    FindMeUseCase,
    UpdateMeUseCase,
    // User Module
    FindRoomsUseCase,
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
    SignInWithGoogleUseCase,
    SignInWithAppleUseCase,
    SignUpWithGoogleUseCase,
    SignUpWithAppleUseCase,
    SignOutUseCase,
    // Auth Module
    CreateMeUseCase,
    FindMeUseCase,
    UpdateMeUseCase,
    // User Module
    FindRoomsUseCase,
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
