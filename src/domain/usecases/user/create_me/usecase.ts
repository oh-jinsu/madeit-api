import { Injectable } from "@nestjs/common";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { ClaimModel } from "src/domain/models/claim";
import { AuthProvider } from "src/domain/providers/auth";
import { ImageRepository } from "src/domain/repositories/image";
import { UserRepository } from "src/domain/repositories/user";
import { UserResult } from "src/domain/results/user";

export type Params = {
  readonly accessToken: string;
  readonly email?: string;
  readonly name: string;
  readonly avatarId?: string;
};

@Injectable()
export class CreateMeUseCase extends AuthorizedUseCase<Params, UserResult> {
  constructor(
    authProvider: AuthProvider,
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    { id }: ClaimModel,
    { email, name, avatarId }: Params,
  ): Promise<UseCaseResult<UserResult>> {
    const option = await this.userRepository.findOne(id);

    if (!option.isNone()) {
      return new UseCaseException(1);
    }

    const nameLength = ~-encodeURI(name).split(/%..|./).length;

    if (nameLength < 2) {
      return new UseCaseException(2);
    }

    if (nameLength > 24) {
      return new UseCaseException(3);
    }

    const avatarOption = await this.imageRepository.findOne(avatarId);

    if (!avatarOption.isSome()) {
      return new UseCaseException(4);
    }

    const { updatedAt, createdAt } = await this.userRepository.save({
      id,
      name,
      email,
      avatarId,
    });

    return new UseCaseOk({
      id,
      email,
      name,
      avatarId,
      updatedAt,
      createdAt,
    });
  }
}
