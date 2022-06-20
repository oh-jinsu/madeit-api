import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { AuthProvider } from "src/domain/providers/auth";
import { UserResult } from "src/domain/results/user";
import { UserEntity } from "src/domain/entities/user";
import { Repository } from "typeorm";

export type Params = {
  readonly accessToken: string;
};

@Injectable()
export class FindMeUseCase extends AuthorizedUseCase<Params, UserResult> {
  constructor(
    authProvider: AuthProvider,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    id: string,
  ): Promise<UseCaseResult<UserResult>> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return new UseCaseException(1);
    }

    const { email, name, avatarId, updatedAt, createdAt } = user;

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
