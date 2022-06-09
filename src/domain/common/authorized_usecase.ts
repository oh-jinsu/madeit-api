import { ClaimGrade, ClaimModel } from "../models/claim";
import { AuthProvider } from "../providers/auth";
import { UseCase } from "./usecase";
import { UseCaseException, UseCaseResult } from "./usecase_result";

export interface AuthorizedUseCaseParams {
  accessToken: string;
}

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

    if (!this.assertGrade(claim.grade)) {
      return new UseCaseException(104);
    }

    return this.executeWithAuth(claim, params);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected assertGrade(grade: ClaimGrade): boolean {
    return true;
  }

  protected abstract executeWithAuth(
    claim: ClaimModel,
    params: T,
  ): Promise<UseCaseResult<K>>;
}
