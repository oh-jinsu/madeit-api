import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsString } from "class-validator";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { CreateChatUseCase } from "src/declarations/usecases/chat/create/usecase";

export class MessageTypeRequestBody {
  @IsString()
  type: "message";

  @IsString()
  message: string;
}

export class ImageTypeRequestBody {
  @IsString()
  type: "image";

  @IsString({ each: true })
  image_ids: string[];
}

export class PhotologTypeRequestBody {
  @IsString()
  type: "photolog";

  @IsString()
  message: string;

  @IsString({ each: true })
  image_ids: string[];
}

export class DefaultRequestBody {
  @IsString()
  room_id: string;
}

@Throttle(1, 0.1)
@Controller("chats")
export class CreateChatController extends AbstractController {
  constructor(private readonly usecase: CreateChatUseCase) {
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
    const result = await this.usecase.execute({
      accessToken,
      roomId,
      ...(() => {
        switch (body.type) {
          case "message":
            return {
              type: body.type,
              message: body.message,
            };
          case "image":
            return {
              type: body.type,
              imageIds: body.image_ids,
            };
          case "photolog":
            return {
              type: body.type,
              message: body.message,
              imageIds: body.image_ids,
            };
        }
      })(),
    });

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
