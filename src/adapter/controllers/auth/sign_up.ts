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
import { SignUpWithAppleUseCase } from "src/domain/usecases/auth/sign_up_with_apple/usecase";
import { SignUpWithGoogleUseCase } from "src/domain/usecases/auth/sign_up_with_google/usecase";

export class RequestBody {
  @IsString()
  id_token: string;
}

@Throttle(1, 0.1)
@Controller("auth/signup")
export class SignUpController extends AbstractController {
  constructor(
    private readonly usecaseWithApple: SignUpWithAppleUseCase,
    private readonly usecaseWithGoogle: SignUpWithGoogleUseCase,
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
          message: "이미 가입한 이용자입니다.",
        };
    }
  }
}
