import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { UploadImageUseCase } from "src/domain/usecases/image/upload/usecase";
import { Throttle } from "@nestjs/throttler";
import { AbstractController } from "src/adapter/common/adapter";
import { BearerToken } from "src/adapter/decorators/bearer_token";

@Throttle(1, 0.1)
@Controller("images")
export class UploadImageController extends AbstractController {
  constructor(private readonly usecase: UploadImageUseCase) {
    super();
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async receive(
    @BearerToken() accessToken: string,
    @UploadedFile() { buffer, mimetype }: Express.Multer.File,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      buffer,
      mimetype,
    });

    return this.response(result);
  }
}
