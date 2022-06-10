import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsString } from "class-validator";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { SocketGateway } from "src/adapter/gateways/socket";
import { CreateParticipantUseCase } from "src/domain/usecases/participant/create/usecase";

export class RequestBody {
  @IsString()
  room_id: string;
}

@Throttle(1, 0.1)
@Controller("participant")
export class CreateParticipantController extends AbstractController {
  constructor(
    private readonly usecase: CreateParticipantUseCase,
    private readonly socket: SocketGateway,
  ) {
    super();
  }

  @Post()
  async receive(
    @BearerToken() accessToken: string,
    @Body() { room_id: roomId }: RequestBody,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      roomId,
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
          status: 404,
          message: "채팅방을 찾지 못했습니다.",
        };
      case 3:
        return {
          status: 409,
          message: "이미 가입한 채팅방입니다.",
        };
    }
  }
}