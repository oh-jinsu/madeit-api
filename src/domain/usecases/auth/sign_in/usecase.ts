import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
import { AuthCrendentialResult } from "src/domain/results/auth/crendential";
import { AuthEntity } from "src/domain/entities/auth";
import { Repository } from "typeorm";

export type Params = {
  readonly provider: "apple" | "google" | "kakao";
  readonly idToken: string;
};

@Injectable()
export class SignInUseCase implements UseCase<Params, AuthCrendentialResult> {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly appleAuthProvider: AppleAuthProvider,
    private readonly googleAuthProvider: GoogleAuthProvider,
    private readonly kakaoAuthProvider: KakaoAuthProvider,
    private readonly hashProvider: HashProvider,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {}

  async execute({
    provider,
    idToken,
  }: Params): Promise<UseCaseResult<AuthCrendentialResult>> {
    const { sub: key } = await (async () => {
      switch (provider) {
        case "apple":
          if (!(await this.appleAuthProvider.verify(idToken))) {
            return {};
          }

          return this.appleAuthProvider.extractClaim(idToken);
        case "google":
          if (!(await this.googleAuthProvider.verify(idToken))) {
            return {};
          }

          return this.googleAuthProvider.extractClaim(idToken);
        case "kakao":
          if (!(await this.kakaoAuthProvider.verify(idToken))) {
            return {};
          }

          return this.kakaoAuthProvider.extractClaim(idToken);
      }
    })();

    if (!key) {
      return new UseCaseException(1);
    }

    const option = await this.authRepository.findOne({ where: { key } });

    if (!option) {
      return new UseCaseException(2);
    }

    const { id } = option;

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
