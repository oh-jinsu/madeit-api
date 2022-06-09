import { Injectable } from "@nestjs/common";
import { UseCase } from "src/domain/common/usecase";
import { UseCaseOk, UseCaseResult } from "src/domain/common/usecase_result";
import { AuthProvider } from "src/domain/providers/auth";
import { HashProvider } from "src/domain/providers/hash";
import { AuthRepository } from "src/domain/repositories/auth";
import { AuthCrendentialResult } from "src/domain/results/auth/crendential";

export type Params = Record<string, never>;

@Injectable()
export class IssueGuestTokenUseCase
  implements UseCase<Params, AuthCrendentialResult>
{
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly hashProvider: HashProvider,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(): Promise<UseCaseResult<AuthCrendentialResult>> {
    const { id } = await this.authRepository.save({
      key: "none",
      from: "guest",
    });

    const accessToken = await this.authProvider.issueAccessToken({
      sub: id,
      grade: "guest",
    });

    await this.authRepository.update(id, {
      accessToken,
    });

    const refreshToken = await this.authProvider.issueRefreshToken({
      sub: id,
      grade: "guest",
    });

    const hashedRefreshToken = await this.hashProvider.encode(refreshToken);

    await this.authRepository.update(id, {
      refreshToken: hashedRefreshToken,
    });

    return new UseCaseOk({
      accessToken,
      refreshToken,
    });
  }
}
