import { Body, Controller, Delete, HttpCode } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsString } from "class-validator";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { SocketGateway } from "src/adapter/gateways/socket";
import { CreateNoticeChatUseCase } from "src/declarations/usecases/chat/create_notice/usecase";
import { DeleteParticipantUseCase } from "src/declarations/usecases/participant/delete/usecase";

export class RequestBody {
  @IsString()
  room_id: string;
}

@Throttle(1, 0.1)
@Controller("participants")
export class DeleteParticipantController extends AbstractController {
  constructor(
    private readonly deleteParticipantUseCase: DeleteParticipantUseCase,
    private readonly createNoticeChatUseCase: CreateNoticeChatUseCase,
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
    const result = await this.deleteParticipantUseCase.execute({
      accessToken,
      roomId,
    });

    if (result.isOk()) {
      await this.socketGateway.getSocket(result.value.user.id).leave(roomId);

      const notice = await this.createNoticeChatUseCase.execute({
        roomId,
        message: `${result.value.user.name}님이 방을 나갔습니다.`,
      });

      if (notice.isOk()) {
        this.socketGateway
          .getRoom(roomId)
          .emit("chatted", this.mapSnakeCase(notice.value));
      }
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
