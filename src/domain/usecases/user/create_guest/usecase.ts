import { Injectable } from "@nestjs/common";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { ClaimGrade, ClaimModel } from "src/domain/models/claim";
import { AuthProvider } from "src/domain/providers/auth";
import { UserRepository } from "src/domain/repositories/user";
import { UserResult } from "src/domain/results/user";

export type Params = {
  accessToken: string;
};

@Injectable()
export class CreateGuestUseCase extends AuthorizedUseCase<Params, UserResult> {
  constructor(
    authProvider: AuthProvider,
    private readonly userRepository: UserRepository,
  ) {
    super(authProvider);
  }

  protected assertGrade(grade: ClaimGrade): boolean {
    return grade === "guest";
  }

  protected async executeWithAuth({
    id,
  }: ClaimModel): Promise<UseCaseResult<UserResult>> {
    const option = await this.userRepository.findOne(id);

    if (!option.isNone()) {
      return new UseCaseException(1);
    }

    const { name, updatedAt, createdAt } = await this.userRepository.save({
      id,
      name: "게스트",
    });

    return new UseCaseOk({
      id,
      name,
      updatedAt,
      createdAt,
    });
  }
}
