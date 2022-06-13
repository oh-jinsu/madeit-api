import { Injectable } from "@nestjs/common";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { ClaimModel } from "src/domain/models/claim";
import { AuthProvider } from "src/domain/providers/auth";
import { ParticipantRepository } from "src/domain/repositories/participant";

export type Params = {
  readonly accessToken: string;
  readonly roomId: string;
};

export type Result = {
  readonly userId: string;
};

@Injectable()
export class DeleteParticipantUseCase extends AuthorizedUseCase<
  Params,
  Result
> {
  constructor(
    authProvider: AuthProvider,
    private readonly participantRepository: ParticipantRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { roomId }: Params,
  ): Promise<UseCaseResult<Result>> {
    const participantOption = await this.participantRepository.findOne(
      userId,
      roomId,
    );

    if (!participantOption.isSome()) {
      return new UseCaseException(1);
    }

    await this.participantRepository.delete(participantOption.value.id);

    return new UseCaseOk({
      userId,
    });
  }
}
