import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/declarations/common/authorized_usecase";
import {
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { AuthProvider } from "src/declarations/providers/auth";
import { ImageProvider } from "src/declarations/providers/image";
import { UuidProvider } from "src/declarations/providers/uuid";
import { ImageEntity } from "src/declarations/entities/image";
import { Repository } from "typeorm";
import { FileRepository } from "src/declarations/repositories/file";

export type Params = {
  readonly accessToken: string;
  readonly buffer: Buffer;
  readonly mimetype: string;
};

export type Result = {
  readonly id: string;
  readonly createdAt: Date;
};

@Injectable()
export class UploadImageUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly uuidProvider: UuidProvider,
    private readonly imageProvider: ImageProvider,
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private readonly fileRepository: FileRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    userId: string,
    { buffer, mimetype }: Params,
  ): Promise<UseCaseResult<Result>> {
    const id = this.uuidProvider.v4();

    const newone = this.imageRepository.create({ id, userId });

    this.fileRepository.upload(`${id}`, buffer, mimetype);

    const [mdpi, xhdpi, xxhdpi] = await Promise.all([
      this.imageProvider.resize(buffer, 375),
      this.imageProvider.resize(buffer, 768),
      this.imageProvider.resize(buffer, 1024),
    ]);

    await Promise.all([
      this.fileRepository.upload(`${id}/mdpi`, mdpi, mimetype),
      this.fileRepository.upload(`${id}/xhdpi`, xhdpi, mimetype),
      this.fileRepository.upload(`${id}/xxhdpi`, xxhdpi, mimetype),
    ]);

    const { createdAt } = await this.imageRepository.save(newone);

    return new UseCaseOk({
      id,
      createdAt,
    });
  }
}
