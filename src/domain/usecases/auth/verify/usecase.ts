import { Injectable } from "@nestjs/common";
import { UseCase } from "src/domain/common/usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { AuthProvider } from "src/domain/providers/auth";
import { NothingResult } from "src/domain/results/common/nothing";

export type Params = {
  readonly accessToken: string;
};

@Injectable()
export class VerifyAuthUseCase implements UseCase<Params, NothingResult> {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute({
    accessToken,
  }: Params): Promise<UseCaseResult<NothingResult>> {
    const isVerified = await this.authProvider.verifyAccessToken(accessToken);

    if (!isVerified) {
      return new UseCaseException(1);
    }

    return new UseCaseOk(null);
  }
}
