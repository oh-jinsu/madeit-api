import { Injectable } from "@nestjs/common";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { ClaimModel } from "src/domain/models/claim";
import { AuthProvider } from "src/domain/providers/auth";
import { GoogleAuthProvider } from "src/domain/providers/google_auth";
import { HashProvider } from "src/domain/providers/hash";
import { AuthRepository } from "src/domain/repositories/auth";
import { UserRepository } from "src/domain/repositories/user";
import { AuthCrendentialResult } from "src/domain/results/auth/crendential";

export type Params = {
  readonly accessToken: string;
  readonly idToken: string;
};

@Injectable()
export class SignUpWithGoogleUseCase extends AuthorizedUseCase<
  Params,
  AuthCrendentialResult
> {
  constructor(
    authProvider: AuthProvider,
    private readonly googleAuthProvider: GoogleAuthProvider,
    private readonly hashProvider: HashProvider,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    { id }: ClaimModel,
    { idToken }: Params,
  ): Promise<UseCaseResult<AuthCrendentialResult>> {
    const isVerified = await this.googleAuthProvider.verify(idToken);

    if (!isVerified) {
      return new UseCaseException(1);
    }

    const { id: key } = await this.googleAuthProvider.extractClaim(idToken);

    const option = await this.authRepository.findOneByKey(key);

    if (option.isSome()) {
      return new UseCaseException(2);
    }

    await this.authRepository.update(id, {
      key,
      from: "google",
    });

    const accessToken = await this.authProvider.issueAccessToken({
      sub: id,
    });

    await this.authRepository.update(id, { accessToken });

    const refreshToken = await this.authProvider.issueRefreshToken({
      sub: id,
    });

    const hashedRefreshToken = await this.hashProvider.encode(refreshToken);

    await this.authRepository.update(id, { refreshToken: hashedRefreshToken });

    await this.userRepository.delete(id);

    return new UseCaseOk({
      accessToken,
      refreshToken,
    });
  }
}
