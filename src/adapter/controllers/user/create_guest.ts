import { Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { CreateGuestUseCase } from "src/domain/usecases/user/create_guest/usecase";

@Throttle(1, 1)
@Controller("users/guest")
export class CreateGuestController extends AbstractController {
  constructor(private readonly usecase: CreateGuestUseCase) {
    super();
  }

  @Post()
  async receive(@BearerToken() accessToken: string) {
    const result = await this.usecase.execute({
      accessToken,
    });

    return this.response(result);
  }

  protected inform(code: number): ExceptionResponse {
    switch (code) {
      case 1:
        return {
          status: 409,
          message: "이미 등록된 이용자입니다.",
        };
    }
  }
}
