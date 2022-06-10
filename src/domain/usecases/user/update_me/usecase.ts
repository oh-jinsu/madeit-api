import { Injectable } from "@nestjs/common";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import {
  RemovePropertyParam,
  ReplacePropertyParam,
} from "src/domain/common/params";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { ClaimModel } from "src/domain/models/claim";
import { AuthProvider } from "src/domain/providers/auth";
import { UserRepository } from "src/domain/repositories/user";
import { UserResult } from "src/domain/results/user";

export type UpdateNameDto = {
  readonly path: "/name";
} & ReplacePropertyParam<string>;

export type UpdateEmailDto = {
  readonly path: "/email";
} & (ReplacePropertyParam<string> | RemovePropertyParam);

export type UpdateAvatarDto = {
  readonly path: "/avatar_id";
} & (ReplacePropertyParam<string> | RemovePropertyParam);

export type UpdateMeDto = UpdateNameDto | UpdateEmailDto | UpdateAvatarDto;

export type Params = {
  readonly accessToken: string;
  readonly dtos: UpdateMeDto[];
};

@Injectable()
export class UpdateMeUseCase extends AuthorizedUseCase<Params, UserResult> {
  constructor(
    authProvider: AuthProvider,
    private readonly userRepository: UserRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { dtos }: Params,
  ): Promise<UseCaseResult<UserResult>> {
    const option = await this.userRepository.findOne(userId);

    if (option.isNone()) {
      return new UseCaseException(1);
    }

    await Promise.all(
      dtos.map((dto) => {
        if (dto.path == "/name") {
          return this.userRepository.update(userId, {
            name: dto.value,
          });
        }

        if (dto.path == "/email") {
          if (dto.op == "remove") {
            return this.userRepository.update(userId, {
              email: null,
            });
          } else {
            return this.userRepository.update(userId, {
              email: dto.value,
            });
          }
        }

        if (dto.path === "/avatar_id") {
          if (dto.op == "remove") {
            return this.userRepository.update(userId, {
              avatarId: null,
            });
          } else {
            return this.userRepository.update(userId, {
              avatarId: dto.value,
            });
          }
        }
      }),
    );

    const userOption = await this.userRepository.findOne(userId);

    if (!userOption.isSome()) {
      return new UseCaseException(2);
    }

    const user = userOption.value;

    return new UseCaseOk({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarId: user.avatarId,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    });
  }
}
