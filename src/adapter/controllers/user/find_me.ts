import { Controller, Get } from "@nestjs/common";
import { FindMeUseCase } from "src/declarations/usecases/user/find_me/usecase";
import { Throttle } from "@nestjs/throttler";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";

@Throttle(1, 0.1)
@Controller("users")
export class FindMeController extends AbstractController {
  constructor(private readonly usecase: FindMeUseCase) {
    super();
  }

  @Get("me")
  async receive(@BearerToken() accessToken: string) {
    const result = await this.usecase.execute({ accessToken });

    return this.response(result);
  }

  protected getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 404;
      default:
        return 500;
    }
  }

  protected inform(code: number): ExceptionResponse {
    switch (code) {
      case 1:
        return {
          status: 404,
          message: "이용자를 찾을 수 없습니다",
        };
    }
  }
}
