import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UseCase } from "src/domain/common/usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { AuthProvider } from "src/domain/providers/auth";
import { HashProvider } from "src/domain/providers/hash";
import { AuthEntity } from "src/domain/entities/auth";
import { Repository } from "typeorm";

export type Params = {
  readonly refreshToken: string;
};

export type Result = {
  readonly accessToken: string;
};

@Injectable()
export class RefreshAuthUseCase implements UseCase<Params, Result> {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly hashProvider: HashProvider,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {}

  async execute({ refreshToken }: Params): Promise<UseCaseResult<Result>> {
    const isVerified = await this.authProvider.verifyRefreshToken(refreshToken);

    if (!isVerified) {
      return new UseCaseException(1);
    }

    const { id } = await this.authProvider.extractClaim(refreshToken);

    const auth = await this.authRepository.findOne({ where: { id } });

    if (!auth) {
      return new UseCaseException(2);
    }

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
