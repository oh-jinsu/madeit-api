import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsEmail, IsOptional, IsString } from "class-validator";
import {
  AbstractController,
  ExceptionResponse,
} from "src/adapter/common/adapter";
import { SignUpUseCase } from "src/declarations/usecases/auth/sign_up/usecase";
export class RequestBody {
  @IsString()
  id_token: string;

  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}

@Throttle(1, 0.1)
@Controller("auth/signup")
export class SignUpController extends AbstractController {
  constructor(private readonly usecase: SignUpUseCase) {
    super();
  }

  @Post()
  async receive(
    @Query("provider") provider: "apple" | "google" | "kakao",
    @Body() { id_token: idToken, name, email }: RequestBody,
  ) {
    if (provider !== "apple" && provider !== "google" && provider !== "kakao") {
      throw new BadRequestException();
    }

    const result = await this.usecase.execute({
      provider,
      idToken,
      name,
      email,
    });

    return this.response(result);
  }

  protected inform(code: number): ExceptionResponse {
    switch (code) {
      case 1:
        return {
          status: 401,
          message: "유효하지 않은 인증정보입니다.",
        };
      case 2:
        return {
          status: 404,
          message: "이미 가입한 이용자입니다.",
        };
      case 3:
        return {
          status: 400,
          message: "이름은 2글자 이상이어야 합니다.",
        };
      case 4:
        return {
          status: 400,
          message: "이름은 8글자 이하여야 합니다.",
        };
    }
  }
}
