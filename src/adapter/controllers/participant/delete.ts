import { Body, Controller, Delete, HttpCode } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsString } from "class-validator";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { SocketGateway } from "src/adapter/gateways/socket";
import { DeleteParticipantUseCase } from "src/declarations/usecases/participant/delete/usecase";

export class RequestBody {
  @IsString()
  room_id: string;
}

@Throttle(1, 0.1)
@Controller("participants")
export class DeleteParticipantController extends AbstractController {
  constructor(
    private readonly usecase: DeleteParticipantUseCase,
    private readonly socketGateway: SocketGateway,
  ) {
    super();
  }

  @Delete()
  @HttpCode(204)
  async receive(
    @BearerToken() accessToken: string,
    @Body() { room_id: roomId }: RequestBody,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      roomId,
    });

    if (result.isOk()) {
      await this.socketGateway.getSocket(result.value.userId).leave(roomId);
    }

    return this.response(result);
  }

  protected inform(code: number): ExceptionResponse {
    switch (code) {
      case 1:
        return {
          status: 409,
          message: "채팅방에 참여하고 있지 않습니다.",
        };
    }
  }
}
