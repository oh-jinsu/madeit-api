import { Injectable } from "@nestjs/common";
import { UseCase } from "src/domain/common/usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { AppleAuthProvider } from "src/domain/providers/apple_auth";
import { AuthProvider } from "src/domain/providers/auth";
import { GoogleAuthProvider } from "src/domain/providers/google_auth";
import { HashProvider } from "src/domain/providers/hash";
import { KakaoAuthProvider } from "src/domain/providers/kakao_auth";
import { AuthRepository } from "src/domain/repositories/auth";
import { AuthCrendentialResult } from "src/domain/results/auth/crendential";

export type Params = {
  readonly provider: "apple" | "google" | "kakao";
  readonly idToken: string;
};

@Injectable()
export class SignUpUseCase implements UseCase<Params, AuthCrendentialResult> {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly appleAuthProvider: AppleAuthProvider,
    private readonly googleAuthProvider: GoogleAuthProvider,
    private readonly kakaoAuthProvider: KakaoAuthProvider,
    private readonly hashProvider: HashProvider,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute({
    provider,
    idToken,
  }: Params): Promise<UseCaseResult<AuthCrendentialResult>> {
    const { id: key } = await (async () => {
      switch (provider) {
        case "apple":
          if (!(await this.appleAuthProvider.verify(idToken))) {
            return { id: null };
          }

          return this.appleAuthProvider.extractClaim(idToken);
        case "google":
          if (!(await this.googleAuthProvider.verify(idToken))) {
            return { id: null };
          }

          return this.googleAuthProvider.extractClaim(idToken);
        case "kakao":
          if (!(await this.kakaoAuthProvider.verify(idToken))) {
            return { id: null };
          }

          return this.kakaoAuthProvider.extractClaim(idToken);
      }
    })();

    if (!key) {
      return new UseCaseException(1);
    }

    const option = await this.authRepository.findOneByKey(key);

    if (option.isSome()) {
      return new UseCaseException(2);
    }

    const auth = await this.authRepository.save({
      key,
      from: "apple",
    });

    const accessToken = await this.authProvider.issueAccessToken({
      sub: auth.id,
    });

    await this.authRepository.update(auth.id, { accessToken });

    const refreshToken = await this.authProvider.issueRefreshToken({
      sub: auth.id,
    });

    const hashedRefreshToken = await this.hashProvider.encode(refreshToken);

    await this.authRepository.update(auth.id, {
      refreshToken: hashedRefreshToken,
    });

    return new UseCaseOk({
      accessToken,
      refreshToken,
    });
  }
}
