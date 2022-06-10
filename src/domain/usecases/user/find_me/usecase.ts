import { Injectable } from "@nestjs/common";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { ClaimModel } from "src/domain/models/claim";
import { AuthProvider } from "src/domain/providers/auth";
import { UserRepository } from "src/domain/repositories/user";
import { UserResult } from "src/domain/results/user";

export type Params = {
  accessToken: string;
};

@Injectable()
export class FindMeUseCase extends AuthorizedUseCase<Params, UserResult> {
  constructor(
    authProvider: AuthProvider,
    private readonly userRepository: UserRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth({
    id,
  }: ClaimModel): Promise<UseCaseResult<UserResult>> {
    const option = await this.userRepository.findOne(id);

    if (!option.isSome()) {
      return new UseCaseException(1);
    }

    const { email, name, avatarId, updatedAt, createdAt } = option.value;

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
