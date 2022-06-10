import { ClaimModel } from "../models/claim";
import { AuthProvider } from "../providers/auth";
import { UseCase } from "./usecase";
import { UseCaseException, UseCaseResult } from "./usecase_result";

export type AuthorizedUseCaseParams = {
  readonly accessToken: string;
};

export abstract class AuthorizedUseCase<T extends AuthorizedUseCaseParams, K>
  implements UseCase<T, K>
{
  constructor(protected readonly authProvider: AuthProvider) {}

  async execute(params: T): Promise<UseCaseResult<K>> {
    const { accessToken } = params;

    const isVerified = await this.authProvider.verifyAccessToken(accessToken);

    if (!isVerified) {
      return new UseCaseException(102);
    }

    const claim = await this.authProvider.extractClaim(accessToken);

    return this.executeWithAuth(claim, params);
  }

  protected abstract executeWithAuth(
    claim: ClaimModel,
    params: T,
  ): Promise<UseCaseResult<K>>;
}
