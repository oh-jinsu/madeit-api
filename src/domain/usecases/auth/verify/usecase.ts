import { Injectable } from "@nestjs/common";
import { UseCase } from "src/domain/common/usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { AuthProvider } from "src/domain/providers/auth";

export type Params = {
  readonly accessToken: string;
};

export type Result = {
  readonly id: string;
};

@Injectable()
export class VerifyAuthUseCase implements UseCase<Params, Result> {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute({ accessToken }: Params): Promise<UseCaseResult<Result>> {
    const isVerified = await this.authProvider.verifyAccessToken(accessToken);

    if (!isVerified) {
      return new UseCaseException(1);
    }

    const { sub: id } = await this.authProvider.extractClaim(accessToken);

    return new UseCaseOk({ id });
  }
}
