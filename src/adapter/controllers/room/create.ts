import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsString } from "class-validator";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { CreateRoomUseCase } from "src/declarations/usecases/room/create/usecase";

export class RequestBody {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  goal_label: string;

  @IsString()
  goal_type: "done" | "number" | "time" | "duration";

  @IsString()
  goal_symbol: string;
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
    @Body()
    {
      title,
      description,
      goal_label: goalLabel,
      goal_type: goalType,
      goal_symbol: goalSymbol,
    }: RequestBody,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      description,
      title,
      goalLabel,
      goalType,
      goalSymbol,
    });

    return this.response(result);
  }

  protected inform(code: number): ExceptionResponse {
    switch (code) {
      case 1:
        return {
          status: 404,
          message: "이용자를 찾지 못했습니다.",
        };
      case 2:
        return {
          status: 400,
          message: "제목은 2글자 이상이어야 합니다.",
        };
      case 3:
        return {
          status: 400,
          message: "제목은 32글자 이하여야 합니다.",
        };
    }
  }
}
