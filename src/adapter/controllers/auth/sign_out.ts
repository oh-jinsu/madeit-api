import { Controller, HttpCode, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { SignOutUseCase } from "src/declarations/usecases/auth/sign_out/usecase";

@Throttle(1, 0.1)
@Controller("auth/signout")
export class SignOutController extends AbstractController {
  constructor(private readonly usecase: SignOutUseCase) {
    super();
  }

  @Post()
  @HttpCode(204)
  async receive(@BearerToken() accessToken: string) {
    const result = await this.usecase.execute({ accessToken });

    return this.response(result);
  }

  protected inform(code: number): ExceptionResponse {
    switch (code) {
      case 1:
        return {
          status: 404,
          message: "가입자를 찾지 못했습니다.",
        };
      case 2:
        return {
          status: 409,
          message: "이미 로그아웃했습니다.",
        };
    }
  }
}
