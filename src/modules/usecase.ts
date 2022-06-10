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
    // AuthModule
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
    // AuthModule
  ],
})
export class UseCaseModule {}
