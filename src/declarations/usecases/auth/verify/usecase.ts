import { Injectable } from "@nestjs/common";
import { UseCase } from "src/declarations/common/usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { AuthProvider } from "src/declarations/providers/auth";

export type Params = {
  readonly accessToken: string;
};

export type Model = {
  readonly id: string;
};

@Injectable()
export class VerifyAuthUseCase implements UseCase<Params, Model> {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute({ accessToken }: Params): Promise<UseCaseResult<Model>> {
    const isVerified = await this.authProvider.verifyAccessToken(accessToken);

    if (!isVerified) {
      return new UseCaseException(1);
    }

    const { sub: id } = await this.authProvider.extractClaim(accessToken);

    return new UseCaseOk({ id });
  }
}
