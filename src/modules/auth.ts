import { Module } from "@nestjs/common";
import { DeleteAuthController } from "src/adapter/controllers/auth/delete";
import { IssueGuestTokenController } from "src/adapter/controllers/auth/guest";
import { RefreshAuthController } from "src/adapter/controllers/auth/refresh";
import { SignInController } from "src/adapter/controllers/auth/sign_in";
import { SignOutController } from "src/adapter/controllers/auth/sign_out";
import { SignUpController } from "src/adapter/controllers/auth/sign_up";
import { DeleteAuthUseCase } from "src/domain/usecases/auth/delete/usecase";
import { IssueGuestTokenUseCase } from "src/domain/usecases/auth/guest/usecase";
import { RefreshAuthUseCase } from "src/domain/usecases/auth/refresh/usecase";
import { SignInWithAppleUseCase } from "src/domain/usecases/auth/sign_in_with_apple/usecase";
import { SignInWithGoogleUseCase } from "src/domain/usecases/auth/sign_in_with_google/usecase";
import { SignOutUseCase } from "src/domain/usecases/auth/sign_out/usecase";
import { SignUpWithAppleUseCase } from "src/domain/usecases/auth/sign_up_with_apple/usecase";
import { SignUpWithGoogleUseCase } from "src/domain/usecases/auth/sign_up_with_google/usecase";

@Module({
  providers: [
    DeleteAuthUseCase,
    IssueGuestTokenUseCase,
    RefreshAuthUseCase,
    SignInWithGoogleUseCase,
    SignInWithAppleUseCase,
    SignUpWithGoogleUseCase,
    SignUpWithAppleUseCase,
    SignOutUseCase,
  ],
  controllers: [
    DeleteAuthController,
    IssueGuestTokenController,
    RefreshAuthController,
    SignInController,
    SignUpController,
    SignOutController,
  ],
})
export class AuthModule {}
