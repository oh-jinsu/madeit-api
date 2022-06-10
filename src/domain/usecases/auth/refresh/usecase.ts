import { Injectable } from "@nestjs/common";
import { UseCase } from "src/domain/common/usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { AuthProvider } from "src/domain/providers/auth";
import { HashProvider } from "src/domain/providers/hash";
import { AuthRepository } from "src/domain/repositories/auth";

export type Params = {
  refreshToken: string;
};

export type Result = {
  accessToken: string;
};

@Injectable()
export class RefreshAuthUseCase implements UseCase<Params, Result> {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly hashProvider: HashProvider,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute({ refreshToken }: Params): Promise<UseCaseResult<Result>> {
    const isVerified = await this.authProvider.verifyRefreshToken(refreshToken);

    if (!isVerified) {
      return new UseCaseException(1);
    }

    const { id } = await this.authProvider.extractClaim(refreshToken);

    const option = await this.authRepository.findOne(id);

    if (!option.isSome()) {
      return new UseCaseException(2);
    }

    const auth = option.value;

    if (
      !auth.refreshToken ||
      !(await this.hashProvider.compare(refreshToken, auth.refreshToken))
    ) {
      return new UseCaseException(3);
    }

    const oldone = auth.accessToken;

    const isNotExpired = await this.authProvider.verifyAccessToken(oldone);

    const accessToken = isNotExpired
      ? oldone
      : await this.authProvider.issueAccessToken({
          sub: id,
        });

    if (accessToken !== oldone) {
      await this.authRepository.update(id, { accessToken });
    }

    return new UseCaseOk({
      accessToken,
    });
  }
}
