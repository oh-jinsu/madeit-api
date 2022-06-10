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
import { NothingResult } from "src/domain/results/common/nothing";

export type Params = {
  readonly accessToken: string;
  readonly roomId: string;
};

@Injectable()
export class DeleteParticipantUseCase extends AuthorizedUseCase<
  Params,
  NothingResult
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
  ): Promise<UseCaseResult<NothingResult>> {
    const participantOption = await this.participantRepository.findOne(
      userId,
      roomId,
    );

    if (!participantOption.isSome()) {
      return new UseCaseException(1);
    }

    await this.participantRepository.delete(participantOption.value.id);

    return new UseCaseOk(null);
  }
}
