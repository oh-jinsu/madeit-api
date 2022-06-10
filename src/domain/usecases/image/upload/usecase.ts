import { Injectable } from "@nestjs/common";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import { UseCaseOk, UseCaseResult } from "src/domain/common/usecase_result";
import { ClaimModel } from "src/domain/models/claim";
import { AuthProvider } from "src/domain/providers/auth";
import { ImageRepository } from "src/domain/repositories/image";

export type Params = {
  accessToken: string;
  buffer: Buffer;
  mimetype: string;
};

export type Result = {
  id: string;
  createdAt: Date;
};

@Injectable()
export class UploadImageUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly imageRepository: ImageRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { buffer, mimetype }: Params,
  ): Promise<UseCaseResult<Result>> {
    const { id, createdAt } = await this.imageRepository.save({
      userId,
      buffer,
      mimetype,
    });

    return new UseCaseOk({
      id,
      createdAt,
    });
  }
}
