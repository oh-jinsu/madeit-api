import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsEmail, IsOptional, IsString } from "class-validator";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";
import { CreateMeUseCase } from "../../../domain/usecases/user/create_me/usecase";

export class RequestBody {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}

@Throttle(1, 0.1)
@Controller("users")
export class CreateMeController extends AbstractController {
  constructor(private readonly usecase: CreateMeUseCase) {
    super();
  }

  @Post("me")
  async receive(
    @BearerToken() accessToken: string,
    @Body() { name, email, avatar }: RequestBody,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      name,
      email,
      avatarId: avatar,
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
      case 2:
        return {
          status: 400,
          message: "이름은 2글자 이상이어야 합니다.",
        };
      case 3:
        return {
          status: 400,
          message: "이름은 8글자 이하여야 합니다.",
        };
      case 4:
        return {
          status: 404,
          message: "저장된 이미지를 찾지 못했습니다.",
        };
    }
  }
}
