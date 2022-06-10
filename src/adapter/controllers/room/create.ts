import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsString } from "class-validator";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { CreateRoomUseCase } from "src/domain/usecases/room/create/usecase";

export class RequestBody {
  @IsString()
  title: string;
}

@Throttle(1, 0.1)
@Controller("rooms")
export class CreateRoomController extends AbstractController {
  constructor(private readonly usecase: CreateRoomUseCase) {
    super();
  }

  @Post()
  async receive(
    @BearerToken() accessToken: string,
    @Body() { title }: RequestBody,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      title,
    });

    return this.response(result);
  }

  protected inform(code: number): ExceptionResponse {
    switch (code) {
      case 1:
        return {
          status: 400,
          message: "제목은 2글자 이상이어야 합니다.",
        };
      case 2:
        return {
          status: 400,
          message: "제목은 32글자 이하여야 합니다.",
        };
    }
  }
}
