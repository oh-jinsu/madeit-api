import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/declarations/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { AuthProvider } from "src/declarations/providers/auth";
import { NothingResult } from "src/declarations/results/common/nothing";
import { AuthEntity } from "src/declarations/entities/auth";
import { Repository } from "typeorm";

export type Params = {
  readonly accessToken: string;
};

@Injectable()
export class SignOutUseCase extends AuthorizedUseCase<Params, NothingResult> {
  constructor(
    authProvider: AuthProvider,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    id: string,
  ): Promise<UseCaseResult<NothingResult>> {
    const option = await this.authRepository.findOne({ where: { id } });

    if (!option) {
      return new UseCaseException(1);
    }

    const { refreshToken } = option;

    if (!refreshToken) {
      return new UseCaseException(2);
    }

    await this.authRepository.update(id, { accessToken: null });

    await this.authRepository.update(id, { refreshToken: null });

    return new UseCaseOk(null);
  }
}
