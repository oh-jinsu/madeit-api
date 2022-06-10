import { Injectable } from "@nestjs/common";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import { UseCaseOk, UseCaseResult } from "src/domain/common/usecase_result";
import { ClaimModel } from "src/domain/models/claim";
import { AuthProvider } from "src/domain/providers/auth";
import { AuthRepository } from "src/domain/repositories/auth";
import { UserRepository } from "src/domain/repositories/user";
import { NothingResult } from "src/domain/results/common/nothing";

export type Params = {
  readonly accessToken: string;
};

@Injectable()
export class DeleteAuthUseCase extends AuthorizedUseCase<
  Params,
  NothingResult
> {
  constructor(
    authProvider: AuthProvider,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth({
    id: userId,
  }: ClaimModel): Promise<UseCaseResult<NothingResult>> {
    await this.authRepository.delete(userId);

    await this.userRepository.delete(userId);

    return new UseCaseOk(null);
  }
}
