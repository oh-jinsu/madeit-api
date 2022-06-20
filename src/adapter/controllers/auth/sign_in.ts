import { Body, Controller, Post, Query } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsString } from "class-validator";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { SignInUseCase } from "src/declarations/usecases/auth/sign_in/usecase";

export class RequestBody {
  @IsString()
  id_token: string;
}

@Throttle(1, 0.1)
@Controller("auth/signin")
export class SignInController extends AbstractController {
  constructor(private readonly usecase: SignInUseCase) {
    super();
  }

  @Post()
  async receive(
    @Query("provider") provider: "apple" | "google" | "kakao",
    @Body() { id_token: idToken }: RequestBody,
  ) {
    const result = await this.usecase.execute({ provider, idToken });

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
