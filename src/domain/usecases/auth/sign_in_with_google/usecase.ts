import { Injectable } from "@nestjs/common";
import { UseCase } from "src/domain/common/usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { AuthProvider } from "src/domain/providers/auth";
import { GoogleAuthProvider } from "src/domain/providers/google_auth";
import { HashProvider } from "src/domain/providers/hash";
import { AuthRepository } from "src/domain/repositories/auth";
import { AuthCrendentialResult } from "src/domain/results/auth/crendential";

export type Params = {
  idToken: string;
};

@Injectable()
export class SignInWithGoogleUseCase
  implements UseCase<Params, AuthCrendentialResult>
{
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly googleAuthProvider: GoogleAuthProvider,
    private readonly hashProvider: HashProvider,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute({
    idToken,
  }: Params): Promise<UseCaseResult<AuthCrendentialResult>> {
    const isVerified = await this.googleAuthProvider.verify(idToken);

    if (!isVerified) {
      return new UseCaseException(1);
    }

    const { id: key } = await this.googleAuthProvider.extractClaim(idToken);

    const option = await this.authRepository.findOneByKey(key);

    if (!option.isSome()) {
      return new UseCaseException(2);
    }

    const { id } = option.value;

    const accessToken = await this.authProvider.issueAccessToken({
      sub: id,
    });

    await this.authRepository.update(id, { accessToken });

    const refreshToken = await this.authProvider.issueRefreshToken({
      sub: id,
    });

    const hashedRefreshToken = await this.hashProvider.encode(refreshToken);

    await this.authRepository.update(id, { refreshToken: hashedRefreshToken });

    return new UseCaseOk({
      accessToken,
      refreshToken,
    });
  }
}
