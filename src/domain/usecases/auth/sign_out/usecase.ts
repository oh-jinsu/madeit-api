import { Injectable } from "@nestjs/common";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { ClaimModel } from "src/domain/models/claim";
import { AuthProvider } from "src/domain/providers/auth";
import { AuthRepository } from "src/domain/repositories/auth";
import { NothingResult } from "src/domain/results/common/nothing";

export type Params = {
  readonly accessToken: string;
};

@Injectable()
export class SignOutUseCase extends AuthorizedUseCase<Params, NothingResult> {
  constructor(
    authProvider: AuthProvider,
    private readonly authRepository: AuthRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth({
    id,
  }: ClaimModel): Promise<UseCaseResult<NothingResult>> {
    const option = await this.authRepository.findOne(id);

    if (!option.isSome()) {
      return new UseCaseException(1);
    }

    const { refreshToken } = option.value;

    if (!refreshToken) {
      return new UseCaseException(2);
    }

    await this.authRepository.update(id, { accessToken: null });

    await this.authRepository.update(id, { refreshToken: null });

    return new UseCaseOk(null);
  }
}
