import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { FindChatsUseCase } from "src/declarations/usecases/chat/find/usecase";

@Throttle(1, 0.1)
@Controller("chats")
export class FindChatsController extends AbstractController {
  constructor(private readonly usecase: FindChatsUseCase) {
    super();
  }

  @Get()
  async receive(
    @BearerToken() accessToken: string,
    @Query("room_id") roomId: string,
    @Query("cursor") cursor?: string,
    @Query("limit") limit?: string,
  ) {
    if (!roomId) {
      throw new BadRequestException();
    }

    const result = await this.usecase.execute({
      accessToken,
      roomId,
      cursor,
      limit: Number(limit),
    });

    return this.response(result);
  }

  protected inform(code: number): ExceptionResponse {
    switch (code) {
      case 1:
        return {
          status: 403,
          message: "참여하지 않은 방입니다.",
        };
    }
  }
}
