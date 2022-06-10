import { Global, Module } from "@nestjs/common";
import { DeleteAuthUseCase } from "src/domain/usecases/auth/delete/usecase";
import { IssueGuestTokenUseCase } from "src/domain/usecases/auth/guest/usecase";
import { RefreshAuthUseCase } from "src/domain/usecases/auth/refresh/usecase";
import { SignInWithAppleUseCase } from "src/domain/usecases/auth/sign_in_with_apple/usecase";
import { SignInWithGoogleUseCase } from "src/domain/usecases/auth/sign_in_with_google/usecase";
import { SignOutUseCase } from "src/domain/usecases/auth/sign_out/usecase";
import { SignUpWithAppleUseCase } from "src/domain/usecases/auth/sign_up_with_apple/usecase";
import { SignUpWithGoogleUseCase } from "src/domain/usecases/auth/sign_up_with_google/usecase";
import { VerifyAuthUseCase } from "src/domain/usecases/auth/verify/usecase";
import { UploadImageUseCase } from "src/domain/usecases/image/upload/usecase";
import { CreateGuestUseCase } from "src/domain/usecases/user/create_guest/usecase";
import { CreateMeUseCase } from "src/domain/usecases/user/create_me/usecase";
import { FindMeUseCase } from "src/domain/usecases/user/find_me/usecase";
import { UpdateMeUseCase } from "src/domain/usecases/user/update_me/usecase";

@Global()
@Module({
  providers: [
    VerifyAuthUseCase,
    DeleteAuthUseCase,
    IssueGuestTokenUseCase,
    RefreshAuthUseCase,
    SignInWithGoogleUseCase,
    SignInWithAppleUseCase,
    SignUpWithGoogleUseCase,
    SignUpWithAppleUseCase,
    SignOutUseCase,
    // Auth Module
    CreateGuestUseCase,
    CreateMeUseCase,
    FindMeUseCase,
    UpdateMeUseCase,
    // User Module
    UploadImageUseCase,
    // Image Module
  ],
  exports: [
    VerifyAuthUseCase,
    DeleteAuthUseCase,
    IssueGuestTokenUseCase,
    RefreshAuthUseCase,
    SignInWithGoogleUseCase,
    SignInWithAppleUseCase,
    SignUpWithGoogleUseCase,
    SignUpWithAppleUseCase,
    SignOutUseCase,
    // Auth Module
    CreateGuestUseCase,
    CreateMeUseCase,
    FindMeUseCase,
    UpdateMeUseCase,
    // User Module
    UploadImageUseCase,
    // Image Module
  ],
})
export class UseCaseModule {}
