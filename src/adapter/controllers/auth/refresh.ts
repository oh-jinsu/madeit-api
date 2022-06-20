import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsString } from "class-validator";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { RefreshAuthUseCase } from "src/declarations/usecases/auth/refresh/usecase";

export class RequestBody {
  @IsString()
  refresh_token: string;
}

@Throttle(1, 0.1)
@Controller("auth/refresh")
export class RefreshAuthController extends AbstractController {
  constructor(private readonly usecase: RefreshAuthUseCase) {
    super();
  }

  @Post()
  async receive(@Body() { refresh_token: refreshToken }: RequestBody) {
    const result = await this.usecase.execute({ refreshToken });

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
          message: "탈퇴한 이용자입니다.",
        };
      case 3:
        return {
          status: 401,
          message: "폐기된 인증정보입니다.",
        };
    }
  }
}
