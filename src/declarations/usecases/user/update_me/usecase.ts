import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/declarations/common/authorized_usecase";
import {
  RemovePropertyParam,
  ReplacePropertyParam,
} from "src/declarations/common/params";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { AuthProvider } from "src/declarations/providers/auth";
import { UserModel } from "src/declarations/models/user";
import { UserEntity } from "src/declarations/entities/user";
import { Repository } from "typeorm";

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
export class UpdateMeUseCase extends AuthorizedUseCase<Params, UserModel> {
  constructor(
    authProvider: AuthProvider,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    id: string,
    { dtos }: Params,
  ): Promise<UseCaseResult<UserModel>> {
    const option = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!option) {
      return new UseCaseException(1);
    }

    await Promise.all(
      dtos.map((dto) => {
        if (dto.path == "/name") {
          return this.userRepository.update(id, {
            name: dto.value,
          });
        }

        if (dto.path == "/email") {
          if (dto.op == "remove") {
            return this.userRepository.update(id, {
              email: null,
            });
          } else {
            return this.userRepository.update(id, {
              email: dto.value,
            });
          }
        }

        if (dto.path === "/avatar_id") {
          if (dto.op == "remove") {
            return this.userRepository.update(id, {
              avatarId: null,
            });
          } else {
            return this.userRepository.update(id, {
              avatarId: dto.value,
            });
          }
        }
      }),
    );

    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return new UseCaseException(2);
    }

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
