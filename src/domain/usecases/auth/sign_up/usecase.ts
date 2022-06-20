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
import { UuidProvider } from "src/domain/providers/uuid";
import { AuthCrendentialResult } from "src/domain/results/auth/crendential";
import { AuthEntity } from "src/domain/entities/auth";
import { UserEntity } from "src/domain/entities/user";
import { Repository } from "typeorm";

export type Params = {
  readonly provider: "apple" | "google" | "kakao";
  readonly idToken: string;
  readonly email?: string;
  readonly name: string;
};

@Injectable()
export class SignUpUseCase implements UseCase<Params, AuthCrendentialResult> {
  constructor(
    private readonly uuidProvider: UuidProvider,
    private readonly authProvider: AuthProvider,
    private readonly appleAuthProvider: AppleAuthProvider,
    private readonly googleAuthProvider: GoogleAuthProvider,
    private readonly kakaoAuthProvider: KakaoAuthProvider,
    private readonly hashProvider: HashProvider,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute({
    provider,
    idToken,
    name,
    email,
  }: Params): Promise<UseCaseResult<AuthCrendentialResult>> {
    const { sub: key } = await (async () => {
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

    const entity = await this.authRepository.findOne({ where: { key } });

    if (entity) {
      return new UseCaseException(2);
    }

    const id = this.uuidProvider.v4();

    const newAuth = this.authRepository.create({
      id,
      key,
      from: provider,
    });

    const auth = await this.authRepository.save(newAuth);

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

    const option = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!option) {
      return new UseCaseException(3);
    }

    const nameLength = ~-encodeURI(name).split(/%..|./).length;

    if (nameLength < 6) {
      return new UseCaseException(4);
    }

    if (nameLength > 24) {
      return new UseCaseException(5);
    }

    const newUser = this.userRepository.create({
      id,
      name,
      email,
    });

    await this.userRepository.save(newUser);

    return new UseCaseOk({
      accessToken,
      refreshToken,
    });
  }
}
