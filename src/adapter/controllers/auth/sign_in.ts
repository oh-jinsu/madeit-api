import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsString } from "class-validator";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { SignInWithAppleUseCase } from "src/domain/usecases/auth/sign_in_with_apple/usecase";
import { SignInWithGoogleUseCase } from "src/domain/usecases/auth/sign_in_with_google/usecase";

export class RequestBody {
  @IsString()
  id_token: string;
}

@Throttle(1, 0.1)
@Controller("auth/signin")
export class SignInController extends AbstractController {
  constructor(
    private readonly usecaseWithApple: SignInWithAppleUseCase,
    private readonly usecaseWithGoogle: SignInWithGoogleUseCase,
  ) {
    super();
  }

  @Post()
  async receive(
    @Query("provider") provider: string,
    @Body() { id_token: idToken }: RequestBody,
  ) {
    const result = await (() => {
      switch (provider) {
        case "apple":
          return this.usecaseWithApple.execute({ idToken });
        case "google":
          return this.usecaseWithGoogle.execute({ idToken });
        default:
          throw new BadRequestException();
      }
    })();

    return this.response(result);
  }

  protected inform(code: number): ExceptionResponse {
    switch (code) {
      case 1:
        return {
          status: 401,
          message: "유효하지 않은 인증정보입니다.",
        };
      case 2:
        return {
          status: 404,
          message: "가입자를 찾지 못했습니다.",
        };
    }
  }
}
