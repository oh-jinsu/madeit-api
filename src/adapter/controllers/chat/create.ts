import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { CreateChatUseCase } from "src/declarations/usecases/chat/create/usecase";
import { SocketGateway } from "src/adapter/gateways/socket";

export class MessageTypeRequestBody {
  type: "message";

  message: string;
}

export class ImageTypeRequestBody {
  type: "image";

  image_ids: string[];
}

export class PhotologTypeRequestBody {
  type: "photolog";

  message: string;

  image_ids: string[];
}

export class DefaultRequestBody {
  room_id: string;
}

@Throttle(1, 0.1)
@Controller("chats")
export class CreateChatController extends AbstractController {
  constructor(
    private readonly usecase: CreateChatUseCase,
    private readonly socketGateway: SocketGateway,
  ) {
    super();
  }

  @Post()
  async receive(
    @BearerToken() accessToken: string,
    @Body()
    {
      room_id: roomId,
      ...body
    }: DefaultRequestBody &
      (MessageTypeRequestBody | ImageTypeRequestBody | PhotologTypeRequestBody),
  ) {
    if (typeof roomId !== "string") {
      throw new BadRequestException();
    }

    if ("message" in body) {
      if (typeof body.message !== "string") {
        throw new BadRequestException();
      }
    }

    if ("image_ids" in body) {
      if (!Array.isArray(body.image_ids)) {
        throw new BadRequestException();
      }

      if (body.image_ids.some((e) => typeof e !== "string")) {
        throw new BadRequestException();
      }
    }

    const params = (() => {
      switch (body.type) {
        case "message":
          if (!body.message) {
            throw new BadRequestException();
          }

          return {
            type: body.type,
            message: body.message,
          };
        case "image":
          if (!body.image_ids) {
            throw new BadRequestException();
          }

          return {
            type: body.type,
            imageIds: body.image_ids,
          };
        case "photolog":
          if (!body.message) {
            throw new BadRequestException();
          }

          if (!body.image_ids) {
            throw new BadRequestException();
          }

          return {
            type: body.type,
            message: body.message,
            imageIds: body.image_ids,
          };
        default:
          throw new BadRequestException();
      }
    })();

    const result = await this.usecase.execute({
      accessToken,
      roomId,
      ...params,
    });

    if (result.isOk()) {
      this.socketGateway
        .getRoom(result.value.roomId)
        .emit("chat-created", result);
    }

    return this.response(result);
  }

  protected inform(code: number): ExceptionResponse {
    switch (code) {
      case 1:
        return {
          status: 401,
          message: "이용자를 찾지 못했습니다.",
        };
      case 2:
        return {
          status: 403,
          message: "참여하지 않은 방입니다.",
        };
      case 3:
        return {
          status: 400,
          message: "한 개 이상의 사진을 등록해야 합니다.",
        };
      case 4:
        return {
          status: 400,
          message: "유효하지 않은 요청입니다.",
        };
    }
  }
}
