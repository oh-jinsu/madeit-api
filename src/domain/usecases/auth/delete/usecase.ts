import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import { UseCaseOk, UseCaseResult } from "src/domain/common/usecase_result";
import { AuthProvider } from "src/domain/providers/auth";
import { NothingResult } from "src/domain/results/common/nothing";
import { AuthEntity } from "src/domain/entities/auth";
import { UserEntity } from "src/domain/entities/user";
import { Repository } from "typeorm";

export type Params = {
  readonly accessToken: string;
};

@Injectable()
export class DeleteAuthUseCase extends AuthorizedUseCase<
  Params,
  NothingResult
> {
  constructor(
    authProvider: AuthProvider,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    id: string,
  ): Promise<UseCaseResult<NothingResult>> {
    await this.authRepository.delete(id);

    await this.userRepository.delete(id);

    return new UseCaseOk(null);
  }
}
