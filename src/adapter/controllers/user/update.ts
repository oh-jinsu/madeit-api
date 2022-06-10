import { Body, Controller, Patch } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import {
  UpdateMeDto,
  UpdateMeUseCase,
} from "src/domain/usecases/user/update_me/usecase";

@Throttle(1, 0.1)
@Controller("users/me")
export class UpdateMeController extends AbstractController {
  constructor(private readonly usecase: UpdateMeUseCase) {
    super();
  }

  @Patch()
  async receive(
    @BearerToken() accessToken: string,
    @Body() dtos: UpdateMeDto[],
  ) {
    const result = await this.usecase.execute({
      accessToken,
      dtos,
    });

    return this.response(result);
  }

  protected inform(code: number): ExceptionResponse {
    switch (code) {
      case 1:
        return {
          status: 404,
          message: "이용자를 찾지 못했습니다",
        };
      case 2:
        return {
          status: 404,
          message: "이용자를 찾지 못했습니다",
        };
    }
  }
}
